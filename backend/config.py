import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "campusfix")

# ── Auth token signing ────────────────────────────────────────────────────────
# Signs the stateless session tokens issued at login. MUST be a strong random
# value in production — if it leaks or stays at the dev default, tokens are
# forgeable and anyone can mint an admin session.
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    SECRET_KEY = "dev-insecure-change-me"
    print("[config] WARNING: SECRET_KEY not set in .env — using an insecure dev key. "
          "Set SECRET_KEY before deploying.")

# How long an issued login token stays valid, in seconds (default 24h).
TOKEN_MAX_AGE = int(os.getenv("TOKEN_MAX_AGE", 24 * 60 * 60))
