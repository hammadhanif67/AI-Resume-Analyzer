import hashlib

import bcrypt


def _password_bytes(password: str) -> bytes:
    # bcrypt accepts at most 72 bytes; SHA-256 keeps long valid passwords safe and deterministic.
    return hashlib.sha256(password.encode("utf-8")).hexdigest().encode("ascii")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(_password_bytes(password), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(_password_bytes(plain_password), password_hash.encode("utf-8"))
