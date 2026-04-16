import os
import random
import smtplib
from datetime import datetime, timedelta, timezone
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import requests as http_requests
from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

from config import FLASK_DEBUG
from db import db

auth_bp = Blueprint("auth", __name__)

# ── SMTP config from .env ────────────────────────────────────────────────────
SMTP_HOST = os.getenv("OUTLOOK_HOST", "smtp.office365.com")
SMTP_PORT = int(os.getenv("OUTLOOK_PORT", 587))
SMTP_USER = os.getenv("OUTLOOK_EMAIL", "")
SMTP_PASS = os.getenv("OUTLOOK_PASSWORD", "")


# ── Admin accounts from .env (ADMIN_1_, ADMIN_2_, …) ─────────────────────────
def _load_admins() -> list[dict]:
    admins, i = [], 1
    while True:
        email = os.getenv(f"ADMIN_{i}_EMAIL")
        if not email:
            break
        admins.append(
            {
                "email": email.strip().lower(),
                "password": os.getenv(f"ADMIN_{i}_PASSWORD", ""),
                "name": os.getenv(f"ADMIN_{i}_NAME", "Admin"),
            }
        )
        i += 1
    return admins


ADMINS = _load_admins()

# ── Collections ──────────────────────────────────────────────────────────────
students_collection = db["students"]

# ── In-memory OTP store  {email: {otp, expires_at}} ─────────────────────────
otp_store: dict = {}


def _is_allowed_student_email(email: str) -> bool:
    """Allow only official student domains."""
    normalized = email.strip().lower()
    return normalized.endswith("@uem.edu.in") or normalized.endswith("@iem.edu.in")


def _send_otp_email(to_email: str, otp: str) -> None:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "CampusFix – Your OTP Verification Code"
    msg["From"] = SMTP_USER
    msg["To"] = to_email

    html = f"""
    <html><body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td align="center" style="padding:40px 20px;">
          <table width="480" cellpadding="0" cellspacing="0"
                 style="background:#ffffff;border-radius:16px;overflow:hidden;
                        box-shadow:0 4px 24px rgba(30,58,138,.10);">
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#1e3a8a,#3b82f6);
                         padding:32px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">
                  🎓 UEM CampusFix
                </h1>
                <p style="margin:6px 0 0;color:rgba(255,255,255,.75);font-size:13px;">
                  UEM Complaint Management System
                </p>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:36px 32px;">
                <p style="color:#334155;font-size:15px;margin:0 0 8px;">Hi there 👋</p>
                <p style="color:#64748b;font-size:14px;margin:0 0 28px;">
                  Use the OTP below to sign in to your student account.
                  It is valid for <strong>10 minutes</strong>.
                </p>
                <!-- OTP Box -->
                <div style="background:#eff6ff;border:2px dashed #3b82f6;border-radius:12px;
                            padding:24px;text-align:center;margin-bottom:28px;">
                  <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#1e3a8a;">
                    {otp}
                  </span>
                </div>
                <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
                  Do not share this code with anyone.&nbsp; If you didn't request this, ignore this email.
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background:#f8fafc;padding:16px 32px;text-align:center;
                         border-top:1px solid #e2e8f0;">
                <p style="margin:0;color:#94a3b8;font-size:11px;">
                  © 2026 UEM CampusFix · University of Engineering &amp; Management
                </p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body></html>
    """
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.ehlo()
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(SMTP_USER, to_email, msg.as_string())


# ── Routes ───────────────────────────────────────────────────────────────────


@auth_bp.route("/auth/send-otp", methods=["POST"])
def send_otp():
    """Send a 6-digit OTP to the student's email."""
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()

    if not email:
        return jsonify({"error": "Email is required"}), 400

    if not _is_allowed_student_email(email):
        return jsonify(
            {"error": "Only @uem.edu.in and @iem.edu.in email addresses are allowed"}
        ), 403

    otp = str(random.randint(100000, 999999))
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
    otp_store[email] = {"otp": otp, "expires_at": expires_at}

    try:
        _send_otp_email(email, otp)
    except Exception as exc:
        if FLASK_DEBUG:
            print(f"[OTP] Failed to send email: {exc}")
            return jsonify(
                {
                    "error": "Failed to send OTP. Check SMTP configuration.",
                    "details": str(exc),
                }
            ), 500
        return jsonify(
            {
                "error": "Failed to send OTP. Please contact administrator if the issue persists."
            }
        ), 500

    return jsonify({"success": True, "message": f"OTP sent to {email}"}), 200


@auth_bp.route("/auth/verify-otp", methods=["POST"])
def verify_otp():
    """Verify the OTP and log the student in (upsert record)."""
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    otp = data.get("otp", "").strip()

    if not email or not otp:
        return jsonify({"error": "Email and OTP are required"}), 400

    stored = otp_store.get(email)
    if not stored:
        return jsonify({"error": "No OTP found. Please request a new one."}), 400

    if datetime.now(timezone.utc) > stored["expires_at"]:
        otp_store.pop(email, None)
        return jsonify({"error": "OTP expired. Please request a new one."}), 400

    if stored["otp"] != otp:
        return jsonify({"error": "Invalid OTP. Please try again."}), 400

    otp_store.pop(email, None)

    # Upsert student in DB
    students_collection.update_one(
        {"email": email},
        {
            "$set": {"email": email, "last_login": datetime.now(timezone.utc)},
            "$setOnInsert": {"created_at": datetime.now(timezone.utc)},
        },
        upsert=True,
    )

    name = email.split("@")[0].replace(".", " ").title()
    return jsonify(
        {
            "success": True,
            "message": "Login successful",
            "user": {"email": email, "role": "student", "name": name},
        }
    ), 200


@auth_bp.route("/auth/student-register", methods=["POST"])
def student_register():
    """Register a new student with email/password."""
    data = request.get_json(silent=True) or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required"}), 400

    if not _is_allowed_student_email(email):
        return jsonify(
            {"error": "Only @uem.edu.in and @iem.edu.in email addresses are allowed"}
        ), 403

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    # Check if already exists
    existing = students_collection.find_one({"email": email})
    if existing and existing.get("password_hash"):
        return jsonify({"error": "An account with this email already exists"}), 409

    # Hash password and upsert
    password_hash = generate_password_hash(password)
    students_collection.update_one(
        {"email": email},
        {
            "$set": {
                "email": email,
                "name": name,
                "password_hash": password_hash,
                "provider": "email",
            },
            "$setOnInsert": {"created_at": datetime.now(timezone.utc)},
        },
        upsert=True,
    )

    return jsonify({"success": True, "message": "Registration successful"}), 201


@auth_bp.route("/auth/student-login", methods=["POST"])
def student_login():
    """Login student with email/password."""
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if not _is_allowed_student_email(email):
        return jsonify(
            {"error": "Only @uem.edu.in and @iem.edu.in email addresses are allowed"}
        ), 403

    student = students_collection.find_one({"email": email})
    if not student or not student.get("password_hash"):
        return jsonify({"error": "Account not found. Please register first."}), 404

    if not check_password_hash(student["password_hash"], password):
        return jsonify({"error": "Invalid password"}), 401

    # Update last login
    students_collection.update_one(
        {"email": email},
        {"$set": {"last_login": datetime.now(timezone.utc)}},
    )

    return jsonify(
        {
            "success": True,
            "message": "Login successful",
            "user": {
                "email": email,
                "role": "student",
                "name": student.get("name", email.split("@")[0].title()),
            },
        }
    ), 200


@auth_bp.route("/auth/microsoft", methods=["POST"])
def microsoft_login():
    """Verify Microsoft access token, enforce uem.edu.in domain."""
    data = request.get_json(silent=True) or {}
    access_token = data.get("access_token", "")

    if not access_token:
        return jsonify({"error": "Microsoft access token is required"}), 400

    # Call Microsoft Graph to get user info
    resp = http_requests.get(
        "https://graph.microsoft.com/v1.0/me",
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=10,
    )

    if resp.status_code != 200:
        return jsonify({"error": "Invalid or expired Microsoft token"}), 401

    info = resp.json()
    email = (info.get("mail") or info.get("userPrincipalName") or "").lower().strip()
    name = info.get("displayName") or email.split("@")[0].title()

    if not email:
        return jsonify(
            {"error": "Could not retrieve email from Microsoft account"}
        ), 400

    # ── Enforce allowed student domains ──────────────────────────────────
    if not _is_allowed_student_email(email):
        return jsonify(
            {
                "error": "Access restricted to students only. Please use your @uem.edu.in or @iem.edu.in Outlook account."
            }
        ), 403

    # Upsert student in DB
    students_collection.update_one(
        {"email": email},
        {
            "$set": {
                "email": email,
                "name": name,
                "last_login": datetime.now(timezone.utc),
                "provider": "microsoft",
            },
            "$setOnInsert": {"created_at": datetime.now(timezone.utc)},
        },
        upsert=True,
    )

    return jsonify(
        {
            "success": True,
            "message": "Login successful",
            "user": {"email": email, "role": "student", "name": name},
        }
    ), 200


@auth_bp.route("/auth/admin-login", methods=["POST"])
def admin_login():
    """Validate admin credentials against all accounts defined in .env."""
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    for admin in ADMINS:
        if email == admin["email"] and password == admin["password"]:
            return jsonify(
                {
                    "success": True,
                    "message": "Login successful",
                    "user": {"email": email, "role": "admin", "name": admin["name"]},
                }
            ), 200

    return jsonify({"error": "Invalid admin credentials"}), 401
