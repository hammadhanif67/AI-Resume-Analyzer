from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.config import settings
from app.database.connection import get_db
from app.models.user_model import User
from app.schemas.user_schema import UserResponse
from app.services.activity_log_service import log_activity
from app.utils.response_handler import success_response

router = APIRouter(tags=["User Profile"])

ALLOWED_PROFILE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_PROFILE_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_PROFILE_IMAGE_BYTES = 2 * 1024 * 1024


@router.get("/user/profile")
@router.get("/users/profile")
@router.get("/profile")
def get_profile(current_user: User = Depends(get_current_user)):
    return success_response("Profile fetched successfully", UserResponse.model_validate(current_user))


@router.put("/user/profile")
@router.put("/users/profile")
@router.put("/profile")
@router.patch("/user/profile")
@router.patch("/users/profile")
@router.patch("/profile")
async def update_profile(
    name: str = Form(...),
    profile_image: UploadFile | None = File(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    clean_name = name.strip()
    if not clean_name:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Name is required.")

    current_user.name = clean_name
    if profile_image and profile_image.filename:
        current_user.profile_image = await _save_profile_image(current_user.id, profile_image)

    db.commit()
    db.refresh(current_user)
    log_activity(db, current_user, "profile_update", "success", "User profile updated")
    return success_response("Profile updated successfully", UserResponse.model_validate(current_user))


async def _save_profile_image(user_id: int, file: UploadFile) -> str:
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in ALLOWED_PROFILE_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image type. Only JPG, PNG, and WEBP files are allowed.",
        )
    content_type = (file.content_type or "").lower()
    if content_type and content_type not in ALLOWED_PROFILE_MIME_TYPES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid image MIME type.")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded image is empty.")
    if len(content) > MAX_PROFILE_IMAGE_BYTES:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Profile image must be 2 MB or smaller.")

    user_dir = settings.upload_dir / "profile_images" / str(user_id)
    user_dir.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid4().hex}{suffix}"
    path = user_dir / filename
    path.write_bytes(content)
    return f"/uploads/profile_images/{user_id}/{filename}"
