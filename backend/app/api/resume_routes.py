from fastapi import APIRouter, Depends, File, UploadFile, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.connection import get_db
from app.models.user_model import User
from app.schemas.resume_schema import ResumeResponse
from app.services.activity_log_service import log_activity
from app.services.resume_service import upload_resume
from app.utils.response_handler import success_response

router = APIRouter(prefix="/resume", tags=["Resume"])


@router.post("/upload", status_code=status.HTTP_201_CREATED)
def upload(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resume = upload_resume(db, current_user, file)
    log_activity(db, current_user, "resume_upload", "success", f"Resume uploaded: {resume.file_name}")
    return success_response("Resume uploaded and processed successfully", ResumeResponse.model_validate(resume))
