"""
Shared Flask extensions.

The limiter is created here without an app so blueprint modules can import it and
decorate individual routes; app.py calls `limiter.init_app(app)` at startup.

NOTE: storage is in-process ("memory://"). That's fine for a single-process
deploy. If you run multiple workers/processes, point `RATELIMIT_STORAGE_URI` at a
shared store (e.g. redis://...) so limits are enforced globally. The per-OTP
attempt cap in the DB still bounds brute-force regardless of worker count.
"""
import os

from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["300 per hour"],
    storage_uri=os.getenv("RATELIMIT_STORAGE_URI", "memory://"),
    strategy="fixed-window",
)
