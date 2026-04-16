import certifi
from pymongo import MongoClient

from config import DB_NAME, MONGO_URI

client = MongoClient(MONGO_URI, tls=True, tlsCAFile=certifi.where())
db = client[DB_NAME]

complaints_collection = db["complaints"]
admins_collection = db["admins"]
authorities_collection = db["authorities"]
