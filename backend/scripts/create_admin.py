import argparse
import getpass
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))

from app.auth.password_handler import hash_password
from app.database.connection import SessionLocal, create_tables
from app.models.user_model import User


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Create or promote a local admin user.")
    parser.add_argument("--name", help="Admin display name")
    parser.add_argument("--email", help="Admin email address")
    parser.add_argument("--password", help="Admin password. If omitted, you will be prompted securely.")
    parser.add_argument(
        "--promote-existing",
        action="store_true",
        help="Promote an existing account with this email to admin and update its password.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    create_tables()
    name = (args.name or input("Admin name: ")).strip()
    email = (args.email or input("Admin email: ")).strip().lower()
    password = args.password or getpass.getpass("Admin password: ")
    if not name or not email or len(password) < 8:
        raise SystemExit("Name, email, and password with at least 8 characters are required.")

    db = SessionLocal()
    try:
        matches = db.query(User).filter(User.email == email).all()
        if len(matches) > 1:
            raise SystemExit("Duplicate users found for this email. Resolve database duplicates before assigning admin role.")
        user = matches[0] if matches else None
        if user:
            if not args.promote_existing:
                raise SystemExit(
                    "A user with this email already exists. Re-run with --promote-existing to update that account."
                )
            user.name = name
            user.role = "admin"
            user.password_hash = hash_password(password)
            message = "Existing user promoted to admin and password updated."
        else:
            user = User(name=name, email=email, password_hash=hash_password(password), role="admin")
            db.add(user)
            message = "Admin user created."
        db.commit()
        print(message)
    finally:
        db.close()


if __name__ == "__main__":
    main()
