import os
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv

load_dotenv()

admin_bp = Blueprint("admin", __name__)

# Admin credentials loaded from .env
ADMIN_EMAIL    = os.getenv("ADMIN_EMAIL", "admin@gmail.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")


# /api/login kept for backward-compat but auth is now handled by auth_bp
@admin_bp.route("/login", methods=["POST"])
def admin_login_legacy():
    """Legacy endpoint — delegates to same logic."""
    data = request.get_json(silent=True) or {}
    email    = data.get("email", "")
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
