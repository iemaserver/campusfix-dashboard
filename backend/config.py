import os

from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "campusfix")
FLASK_DEBUG = os.getenv("FLASK_DEBUG", "False").lower() in ("true", "1", "t")
PORT = int(os.getenv("PORT", 8021))
