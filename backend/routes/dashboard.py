from flask import Blueprint, jsonify
from db import complaints_collection

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/dashboard", methods=["GET"])
def dashboard_stats():
    """Return dashboard statistics."""
    total = complaints_collection.count_documents({})
    pending = complaints_collection.count_documents({"status": {"$in": ["Submitted", "Assigned"]}})
    in_progress = complaints_collection.count_documents({"status": "In Progress"})
    resolved = complaints_collection.count_documents({"status": "Completed"})

    return jsonify({
        "totalComplaints": total,
        "pendingIssues": pending,
        "inProgress": in_progress,
        "resolvedIssues": resolved,
    }), 200
