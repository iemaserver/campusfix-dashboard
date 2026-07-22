import os

from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS

import utils.email_queue  # noqa: F401 — starts background email worker thread
from config import FLASK_DEBUG, PORT
from extensions import limiter
from routes.admin import admin_bp
from routes.auth import auth_bp
from routes.authorities import authorities_bp
from routes.complaints import complaints_bp
from routes.dashboard import dashboard_bp

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Cap request bodies (incl. uploads) at 5 MB to prevent memory-exhaustion DoS.
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024

# ── CORS ──────────────────────────────────────────────────────────────────────
# Flask-CORS as a baseline.
CORS(app, resources={r"/*": {"origins": "*"}})

# Belt-and-braces: guarantee CORS headers on *every* response — including
# error pages, 502 retries, and anything flask-cors might miss behind a
# reverse proxy like Nginx.
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    if request.method == "OPTIONS":
        response.status_code = 200
    return response

limiter.init_app(app)


@app.errorhandler(413)
def payload_too_large(_e):
    return jsonify({"error": "File too large. Maximum upload size is 5 MB."}), 413

# Register blueprints under /api prefix
app.register_blueprint(complaints_bp, url_prefix="/api")
app.register_blueprint(admin_bp, url_prefix="/api")
app.register_blueprint(dashboard_bp, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(authorities_bp, url_prefix="/api")


@app.route("/")
def index():
    return {"message": "CampusFix API is running"}


@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


if __name__ == "__main__":
    app.run(debug=FLASK_DEBUG, host="0.0.0.0", port=PORT)
