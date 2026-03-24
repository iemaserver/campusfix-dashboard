from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime, timezone

from db import authorities_collection
from utils.helpers import is_valid_object_id

authorities_bp = Blueprint("authorities", __name__)


def _serialize_authority(doc):
    return {
        "_id": str(doc["_id"]),
        "name": doc.get("name", ""),
        "email": doc.get("email", ""),
        "phone": doc.get("phone", ""),
        "category": doc.get("category", ""),
    }


@authorities_bp.route("/authorities", methods=["GET"])
def get_authorities():
    query = {}
    if request.args.get("category"):
        query["category"] = request.args["category"]
    docs = list(authorities_collection.find(query).sort("name", 1))
    return jsonify([_serialize_authority(d) for d in docs]), 200


@authorities_bp.route("/authorities", methods=["POST"])
def add_authority():
    data = request.get_json(silent=True) or {}
    required = ["name", "email", "category"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    doc = {
        "name": data["name"].strip(),
        "email": data["email"].strip().lower(),
        "phone": data.get("phone", "").strip(),
        "category": data["category"].strip(),
        "created_at": datetime.now(timezone.utc),
    }
    result = authorities_collection.insert_one(doc)
    return jsonify({"success": True, "_id": str(result.inserted_id)}), 201


@authorities_bp.route("/authorities/<authority_id>", methods=["DELETE"])
def delete_authority(authority_id):
    if not is_valid_object_id(authority_id):
        return jsonify({"error": "Invalid ID"}), 400
    result = authorities_collection.delete_one({"_id": ObjectId(authority_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Authority not found"}), 404
    return jsonify({"success": True}), 200
