from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.config import settings
from app.models.resume_model import Resume
from app.models.user_model import User
from app.parsers.docx_parser import extract_docx_text
from app.parsers.pdf_parser import extract_pdf_text
from app.utils.file_validator import validate_file_size, validate_resume_file


def get_user_resume(db: Session, user_id: int, resume_id: int) -> Resume:
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == user_id).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    return resume


def upload_resume(db: Session, user: User, file: UploadFile) -> Resume:
    suffix = validate_resume_file(file)
    content = file.file.read()
    validate_file_size(len(content))

    upload_root = settings.upload_dir.resolve()
    user_dir = (upload_root / str(user.id)).resolve()
    if upload_root not in user_dir.parents and user_dir != upload_root:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid upload path")
    user_dir.mkdir(parents=True, exist_ok=True)
    safe_name = f"{uuid4().hex}{suffix}"
    file_path = user_dir / safe_name

    with file_path.open("wb") as buffer:
        buffer.write(content)

    resume = Resume(
        user_id=user.id,
        file_name=file.filename or safe_name,
        file_path=str(file_path),
        file_type=suffix.replace(".", ""),
        file_size=len(content),
        processing_status="processing",
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    try:
        extracted_text = extract_pdf_text(file_path) if suffix == ".pdf" else extract_docx_text(file_path)
        if not extracted_text:
            raise ValueError("Resume text is empty after extraction")
        resume.extracted_text = extracted_text
        resume.processing_status = "completed"
    except Exception as exc:
        resume.processing_status = "failed"
        db.commit()
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc

    db.commit()
    db.refresh(resume)
    return resume
