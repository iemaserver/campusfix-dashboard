from datetime import datetime, timezone


def create_complaint_doc(data):
    """Build a complaint document for MongoDB insertion."""
    return {
        "category": data.get("category", ""),
        "building": data.get("building", ""),
        "floor": data.get("floor", ""),
        "room": data.get("room", ""),
        "description": data.get("description", ""),
        "photo_url": data.get("photo_url", ""),
        "status": "Submitted",
        "upvotes": 0,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
