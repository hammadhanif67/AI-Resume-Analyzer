from pathlib import Path

from fastapi import HTTPException, UploadFile, status

from app.config import settings

ALLOWED_MIME_TYPES = {
    ".pdf": {"application/pdf"},
    ".docx": {
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/octet-stream",
    },
}


def validate_resume_file(file: UploadFile) -> str:
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in settings.allowed_file_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDF and DOCX files are allowed.",
        )
    content_type = (file.content_type or "").lower()
    if content_type and content_type not in ALLOWED_MIME_TYPES[suffix]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file MIME type for the uploaded resume.",
        )
    return suffix


def validate_file_size(size: int) -> None:
    if size <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty.")
    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    if size > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum size is {settings.max_upload_size_mb} MB.",
        )
