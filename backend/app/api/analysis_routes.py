from fastapi import APIRouter, Depends, Path
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.connection import get_db
from app.models.user_model import User
from app.schemas.analysis_schema import JobMatchRequest
from app.services.activity_log_service import log_activity
from app.services.analysis_service import analyze_resume, run_job_match
from app.services.resume_service import get_user_resume
from app.utils.response_handler import success_response

router = APIRouter(prefix="/analysis", tags=["Analysis"])


@router.post("/resume/{resume_id}")
def analyze_resume_endpoint(
    resume_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = get_user_resume(db, current_user.id, resume_id)
    result = analyze_resume(db, current_user.id, resume)
    log_activity(db, current_user, "resume_analysis", "success", f"Resume analysis completed for resume #{resume_id}")
    return success_response("Resume analysis completed and saved successfully", result)


@router.post("/job-match")
def job_match(payload: JobMatchRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resume = get_user_resume(db, current_user.id, payload.resume_id)
    result = run_job_match(db, current_user.id, resume, payload.job_title, payload.job_description)
    log_activity(db, current_user, "job_match", "success", f"Job match completed for {payload.job_title}")
    return success_response("Job description match completed successfully", result)
