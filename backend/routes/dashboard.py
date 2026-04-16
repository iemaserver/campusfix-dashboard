from datetime import datetime, timedelta, timezone

from flask import Blueprint, jsonify, request

from db import complaints_collection

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/dashboard", methods=["GET"])
def dashboard_stats():
    """Return dashboard statistics with trends for a specific student."""
    query = {}
    if request.args.get("student_email"):
        query["student_email"] = request.args["student_email"].strip().lower()

    total = complaints_collection.count_documents(query)
    pending = complaints_collection.count_documents(
        {**query, "status": {"$in": ["Submitted", "Assigned"]}}
    )
    in_progress = complaints_collection.count_documents(
        {**query, "status": "In Progress"}
    )
    resolved = complaints_collection.count_documents({**query, "status": "Completed"})

    # ── Monthly trend for total complaints ───────────────────────────────────
    now = datetime.now(timezone.utc)
    start_this_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    start_last_month = (start_this_month - timedelta(days=1)).replace(day=1)

    this_month_count = complaints_collection.count_documents(
        {**query, "created_at": {"$gte": start_this_month}}
    )
    last_month_count = complaints_collection.count_documents(
        {**query, "created_at": {"$gte": start_last_month, "$lt": start_this_month}}
    )

    if last_month_count > 0:
        month_change = round(
            ((this_month_count - last_month_count) / last_month_count) * 100
        )
    elif this_month_count > 0:
        month_change = 100  # went from 0 to something
    else:
        month_change = 0

    # ── Resolution rate ───────────────────────────────────────────────────────
    resolution_rate = round((resolved / total) * 100) if total > 0 else 0

    return jsonify(
        {
            "totalComplaints": total,
            "pendingIssues": pending,
            "inProgress": in_progress,
            "resolvedIssues": resolved,
            "monthChange": month_change,  # e.g. 25 means +25%, -10 means -10%
            "resolutionRate": resolution_rate,  # e.g. 75 means 75%
        }
    ), 200
