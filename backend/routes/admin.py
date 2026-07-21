from flask import Blueprint, jsonify

from utils.auth import require_admin

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/admin/complaints", methods=["GET"])
@require_admin
def admin_complaints():
    """Return all complaints for the admin dashboard."""
    from db import complaints_collection
    from utils.helpers import serialize_complaint

    docs = complaints_collection.find().sort("created_at", -1)
    return jsonify([serialize_complaint(d) for d in docs]), 200
