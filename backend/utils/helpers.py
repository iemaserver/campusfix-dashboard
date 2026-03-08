from bson import ObjectId


def serialize_complaint(doc):
    """Convert a MongoDB complaint document to a JSON-safe dict
    matching the frontend's expected shape."""
    return {
        "_id": str(doc["_id"]),
        "category": doc.get("category", ""),
        "location": {
            "building": doc.get("building", ""),
            "floor": doc.get("floor", ""),
            "room": doc.get("room", ""),
        },
        "description": doc.get("description", ""),
        "status": doc.get("status", "Submitted"),
        "date": doc.get("created_at", "").strftime("%Y-%m-%d") if doc.get("created_at") else "",
        "photo": doc.get("photo_url") or None,
        "upvotes": doc.get("upvotes", 0),
        "assignedTo": doc.get("assigned_to") or None,
    }


def is_valid_object_id(id_str):
    """Check whether a string is a valid MongoDB ObjectId."""
    return ObjectId.is_valid(id_str)
