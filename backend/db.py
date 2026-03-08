import certifi
from pymongo import MongoClient
from config import MONGO_URI, DB_NAME

client = MongoClient(MONGO_URI, tls=True, tlsCAFile=certifi.where())
db = client[DB_NAME]

complaints_collection = db["complaints"]
admins_collection = db["admins"]
