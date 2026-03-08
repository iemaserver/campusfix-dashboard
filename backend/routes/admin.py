from flask import Blueprint, request, jsonify

admin_bp = Blueprint("admin", __name__)

# Temporary admin credentials
ADMIN_EMAIL = "admin@gmail.com"
ADMIN_PASSWORD = "admin"


@admin_bp.route("/login", methods=["POST"])
def admin_login():
    """Validate admin credentials."""
    data = request.get_json(silent=True) or {}
    email = data.get("email", "")
    password = data.get("password", "")

    if email == ADMIN_EMAIL and password == ADMIN_PASSWORD:
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {"email": email, "role": "admin", "name": "Admin"},
        }), 200

    return jsonify({"error": "Invalid credentials"}), 401


@admin_bp.route("/admin/complaints", methods=["GET"])
def admin_complaints():
    """Return all complaints for the admin dashboard."""
    from db import complaints_collection
    from utils.helpers import serialize_complaint

    docs = complaints_collection.find().sort("created_at", -1)
    return jsonify([serialize_complaint(d) for d in docs]), 200
