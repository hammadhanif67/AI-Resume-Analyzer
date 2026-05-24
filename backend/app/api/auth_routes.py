from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.auth.jwt_handler import create_access_token
from app.auth.password_handler import hash_password, verify_password
from app.auth.reset_token_handler import create_reset_token, hash_reset_token
from app.config import settings
from app.database.connection import get_db
from app.models.password_reset_model import PasswordResetToken
from app.models.user_model import User
from app.schemas.auth_schema import ForgotPasswordRequest, LoginRequest, RegisterRequest, ResetPasswordRequest
from app.schemas.user_schema import UserResponse
from app.services.activity_log_service import log_activity
from app.utils.response_handler import success_response

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered. Please login or reset your password.",
        )

    user = User(name=payload.name, email=payload.email.lower(), password_hash=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    log_activity(db, user, "user_register", "success", "User registered successfully")

    token = create_access_token(str(user.id))
    data = {"access_token": token, "token_type": "bearer", "user": UserResponse.model_validate(user)}
    return success_response("User registered successfully", data)


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        if user:
            log_activity(db, user, "login_failed", "failed", "Invalid email or password")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")

    action = "admin_login" if user.role == "admin" else "user_login"
    log_activity(db, user, action, "success", "Login successful")
    token = create_access_token(str(user.id))
    data = {"access_token": token, "token_type": "bearer", "user": UserResponse.model_validate(user)}
    return success_response("Login successful", data)


@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return success_response("Authenticated user fetched successfully", UserResponse.model_validate(current_user))


@router.post("/logout")
def logout(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    log_activity(db, current_user, "logout", "success", "User logged out")
    return success_response("Logout successful")


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if user:
        token, token_hash, expires_at = create_reset_token()
        db.add(PasswordResetToken(user_id=user.id, token_hash=token_hash, expires_at=expires_at))
        db.commit()
        log_activity(db, user, "forgot_password_request", "success", "Password reset requested")
        if settings.debug_password_reset_tokens:
            print(f"Password reset token for {user.email}: {token}")
            print(f"Local reset link: http://127.0.0.1:5173/reset-password/{token}")

    return success_response("If this email exists, a password reset link has been sent.")


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    token_hash = hash_reset_token(payload.token)
    reset_token = db.query(PasswordResetToken).filter(PasswordResetToken.token_hash == token_hash).first()
    if not reset_token or reset_token.used or reset_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token.")

    user = db.get(User, reset_token.user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token.")

    user.password_hash = hash_password(payload.new_password)
    reset_token.used = True
    db.commit()
    log_activity(db, user, "password_reset", "success", "Password reset completed")
    return success_response("Password reset successfully. Please login.")
