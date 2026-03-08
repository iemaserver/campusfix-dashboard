import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from bson import ObjectId
from datetime import datetime, timezone
from werkzeug.utils import secure_filename

from db import complaints_collection
from models.complaint_model import create_complaint_doc
from utils.helpers import serialize_complaint, is_valid_object_id

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}


def _allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

complaints_bp = Blueprint("complaints", __name__)

ALLOWED_STATUSES = {"Submitted", "Assigned", "In Progress", "Completed"}


@complaints_bp.route("/complaints", methods=["POST"])
def create_complaint():
    """Create a new complaint."""
    try:
        # Support both JSON and form-data (the frontend sends FormData)
        if request.content_type and "multipart/form-data" in request.content_type:
            data = request.form.to_dict()
        else:
            data = request.get_json(silent=True) or {}

        required = ["category", "building", "floor", "room", "description"]
        missing = [f for f in required if not data.get(f)]
        if missing:
            return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

        # Handle photo upload
        photo_url = ""
        if "photo" in request.files:
            file = request.files["photo"]
            if file and file.filename and _allowed_file(file.filename):
                ext = secure_filename(file.filename).rsplit(".", 1)[1].lower()
                unique_name = f"{uuid.uuid4().hex}.{ext}"
                file.save(os.path.join(current_app.config["UPLOAD_FOLDER"], unique_name))
                photo_url = f"http://localhost:5000/uploads/{unique_name}"
        data["photo_url"] = photo_url

        doc = create_complaint_doc(data)
        result = complaints_collection.insert_one(doc)

        return jsonify({
            "success": True,
            "message": "Complaint submitted successfully",
            "_id": str(result.inserted_id),
        }), 201
    except Exception as e:
        print(f"Error creating complaint: {e}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


@complaints_bp.route("/complaints", methods=["GET"])
def get_complaints():
    """Return all complaints with optional filters."""
    query = {}
    if request.args.get("status"):
        query["status"] = request.args["status"]
    if request.args.get("category"):
        query["category"] = request.args["category"]
    if request.args.get("building"):
        query["building"] = request.args["building"]

    docs = complaints_collection.find(query).sort("created_at", -1)
    return jsonify([serialize_complaint(d) for d in docs]), 200


@complaints_bp.route("/complaints/<complaint_id>", methods=["GET"])
def get_complaint(complaint_id):
    """Return a single complaint by ID."""
    if not is_valid_object_id(complaint_id):
        return jsonify({"error": "Invalid complaint ID"}), 400

    doc = complaints_collection.find_one({"_id": ObjectId(complaint_id)})
    if not doc:
        return jsonify({"error": "Complaint not found"}), 404

    return jsonify(serialize_complaint(doc)), 200


@complaints_bp.route("/complaints/<complaint_id>/status", methods=["PUT"])
def update_status(complaint_id):
    """Update the status of a complaint."""
    if not is_valid_object_id(complaint_id):
        return jsonify({"error": "Invalid complaint ID"}), 400

    data = request.get_json(silent=True) or {}
    new_status = data.get("status")

    if new_status not in ALLOWED_STATUSES:
        return jsonify({"error": f"Invalid status. Allowed: {', '.join(ALLOWED_STATUSES)}"}), 400

    result = complaints_collection.update_one(
        {"_id": ObjectId(complaint_id)},
        {"$set": {"status": new_status, "updated_at": datetime.now(timezone.utc)}},
    )

    if result.matched_count == 0:
        return jsonify({"error": "Complaint not found"}), 404

    return jsonify({"success": True, "message": f"Status updated to {new_status}"}), 200


@complaints_bp.route("/complaints/<complaint_id>/upvote", methods=["POST"])
def upvote_complaint(complaint_id):
    """Increment the upvote count of a complaint."""
    if not is_valid_object_id(complaint_id):
        return jsonify({"error": "Invalid complaint ID"}), 400

    result = complaints_collection.update_one(
        {"_id": ObjectId(complaint_id)},
        {"$inc": {"upvotes": 1}},
    )

    if result.matched_count == 0:
        return jsonify({"error": "Complaint not found"}), 404

    doc = complaints_collection.find_one({"_id": ObjectId(complaint_id)})
    return jsonify({"success": True, "upvotes": doc.get("upvotes", 0)}), 200


@complaints_bp.route("/complaints/recurring", methods=["GET"])
def recurring_complaints():
    """Return rooms/categories with 3+ complaints (recurring issues)."""
    pipeline = [
        {"$group": {
            "_id": {"building": "$building", "room": "$room", "category": "$category"},
            "count": {"$sum": 1},
            "latest_status": {"$last": "$status"},
        }},
        {"$match": {"count": {"$gte": 3}}},
        {"$sort": {"count": -1}},
    ]
    results = list(complaints_collection.aggregate(pipeline))
    return jsonify([{
        "building": r["_id"]["building"],
        "room": r["_id"]["room"],
        "category": r["_id"]["category"],
        "count": r["count"],
        "latest_status": r["latest_status"],
    } for r in results]), 200
