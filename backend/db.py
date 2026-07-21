import certifi
from pymongo import MongoClient
from config import MONGO_URI, DB_NAME

client = MongoClient(MONGO_URI, tls=True, tlsCAFile=certifi.where())
db = client[DB_NAME]

complaints_collection = db["complaints"]
admins_collection = db["admins"]
authorities_collection = db["authorities"]
otps_collection = db["otps"]

# Indexes for the most common query patterns. create_index is idempotent, so
# this is safe to run on every startup; failures shouldn't block the app.
try:
    complaints_collection.create_index("student_email")
    complaints_collection.create_index("status")
    complaints_collection.create_index([("created_at", -1)])
    # One live OTP per email; TTL index lets MongoDB auto-purge expired codes.
    otps_collection.create_index("email", unique=True)
    otps_collection.create_index("expires_at", expireAfterSeconds=0)
except Exception as exc:  # pragma: no cover
    print(f"[db] index creation skipped: {exc}")
