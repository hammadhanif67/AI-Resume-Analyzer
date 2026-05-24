import hashlib
import secrets
from datetime import datetime, timedelta


RESET_TOKEN_EXPIRE_MINUTES = 30


def create_reset_token() -> tuple[str, str, datetime]:
    token = secrets.token_urlsafe(32)
    token_hash = hash_reset_token(token)
    expires_at = datetime.utcnow() + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)
    return token, token_hash, expires_at


def hash_reset_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()
