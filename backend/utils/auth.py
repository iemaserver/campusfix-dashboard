"""
Stateless authentication for the CampusFix API.

Login endpoints issue a signed, expiring token (itsdangerous — a core Flask
dependency, so no extra package). Clients send it back as
`Authorization: Bearer <token>` on every request. The decorators below verify
the signature/expiry and attach the caller's identity to `flask.g.user`, so
routes derive *who* is calling from the token — never from a spoofable field in
the request body.
"""
import functools

from flask import request, jsonify, g
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired

from config import SECRET_KEY, TOKEN_MAX_AGE

_serializer = URLSafeTimedSerializer(SECRET_KEY, salt="campusfix-auth")


def generate_token(user: dict) -> str:
    """Create a signed token embedding the user's identity."""
    return _serializer.dumps({
        "email": (user.get("email") or "").strip().lower(),
        "role":  user.get("role") or "student",
        "name":  user.get("name") or "",
    })


def verify_token(token: str):
    """Return the decoded identity dict, or None if the token is invalid/expired."""
    try:
        return _serializer.loads(token, max_age=TOKEN_MAX_AGE)
    except (BadSignature, SignatureExpired):
        return None


def _identity_from_request():
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        return None
    return verify_token(header[7:].strip())


def require_auth(fn):
    """Reject the request unless it carries a valid token. Sets g.user."""
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        identity = _identity_from_request()
        if not identity:
            return jsonify({"error": "Authentication required"}), 401
        g.user = identity
        return fn(*args, **kwargs)
    return wrapper


def require_admin(fn):
    """Reject the request unless it carries a valid *admin* token. Sets g.user."""
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        identity = _identity_from_request()
        if not identity:
            return jsonify({"error": "Authentication required"}), 401
        if identity.get("role") != "admin":
            return jsonify({"error": "Admin privileges required"}), 403
        g.user = identity
        return fn(*args, **kwargs)
    return wrapper
