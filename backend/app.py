import os

from flask import Flask, send_from_directory
from flask_cors import CORS

import utils.email_queue  # noqa: F401 — starts background email worker thread
from config import FLASK_DEBUG
from routes.admin import admin_bp
from routes.auth import auth_bp
from routes.authorities import authorities_bp
from routes.complaints import complaints_bp
from routes.dashboard import dashboard_bp

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
CORS(app, resources={r"/campusfix/api/*": {"origins": "*"}})

# Register blueprints under /campusfix/api prefix
app.register_blueprint(complaints_bp, url_prefix="/campusfix/api")
app.register_blueprint(admin_bp, url_prefix="/campusfix/api")
app.register_blueprint(dashboard_bp, url_prefix="/campusfix/api")
app.register_blueprint(auth_bp, url_prefix="/campusfix/api")
app.register_blueprint(authorities_bp, url_prefix="/campusfix/api")


@app.route("/")
def index():
    return {"message": "CampusFix API is running"}


@app.route("/campusfix/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8021))
    app.run(debug=FLASK_DEBUG, host="0.0.0.0", port=port)
