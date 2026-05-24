from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.auth.dependencies import require_admin
from app.database.connection import get_db
from app.models.contact_message_model import ContactMessage
from app.models.job_description_model import ActivityLog
from app.models.report_model import AnalysisReport
from app.models.resume_model import Resume
from app.models.user_model import User
from app.schemas.contact_schema import ContactMessageResponse, ContactMessageStatusUpdate
from app.services.activity_log_service import log_activity
from app.services.report_service import get_report, serialize_report
from app.utils.response_handler import success_response

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/overview")
def admin_overview(current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    log_activity(db, current_user, "admin_dashboard_access", "success", "Admin overview accessed")
    latest_uploads = (
        db.query(Resume, User)
        .join(User, Resume.user_id == User.id)
        .order_by(Resume.uploaded_at.desc())
        .limit(5)
        .all()
    )
    latest_reports = (
        db.query(AnalysisReport, User, Resume)
        .join(User, AnalysisReport.user_id == User.id)
        .join(Resume, AnalysisReport.resume_id == Resume.id)
        .order_by(AnalysisReport.created_at.desc())
        .limit(5)
        .all()
    )
    return success_response(
        "Admin overview fetched successfully",
        {
            "total_users": db.query(User).count(),
            "total_resumes": db.query(Resume).count(),
            "total_reports": db.query(AnalysisReport).count(),
            "latest_uploads": [_serialize_resume(resume, user) for resume, user in latest_uploads],
            "latest_reports": [_serialize_report(report, user, resume) for report, user, resume in latest_reports],
            "backend_status": "healthy",
        },
    )


@router.get("/users")
def admin_users(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    resume_counts = dict(db.query(Resume.user_id, func.count(Resume.id)).group_by(Resume.user_id).all())
    report_counts = dict(db.query(AnalysisReport.user_id, func.count(AnalysisReport.id)).group_by(AnalysisReport.user_id).all())
    users = db.query(User).order_by(User.created_at.desc()).all()
    return success_response(
        "Admin users fetched successfully",
        [
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "created_at": user.created_at,
                "total_resumes": resume_counts.get(user.id, 0),
                "total_reports": report_counts.get(user.id, 0),
            }
            for user in users
        ],
    )


@router.get("/reports")
def admin_reports(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    rows = (
        db.query(AnalysisReport, User, Resume)
        .join(User, AnalysisReport.user_id == User.id)
        .join(Resume, AnalysisReport.resume_id == Resume.id)
        .order_by(AnalysisReport.created_at.desc())
        .all()
    )
    return success_response("Admin reports fetched successfully", [_serialize_report(report, user, resume) for report, user, resume in rows])


@router.get("/reports/{report_id}")
def admin_report_detail(report_id: int, _: User = Depends(require_admin), db: Session = Depends(get_db)):
    report = get_report(db, user_id=0, report_id=report_id, allow_any_user=True)
    data = serialize_report(report)
    data["user"] = {
        "id": report.user.id,
        "name": report.user.name,
        "email": report.user.email,
    } if report.user else None
    return success_response("Admin report fetched successfully", data)


@router.get("/resumes")
def admin_resumes(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    rows = db.query(Resume, User).join(User, Resume.user_id == User.id).order_by(Resume.uploaded_at.desc()).all()
    return success_response("Admin resumes fetched successfully", [_serialize_resume(resume, user) for resume, user in rows])


@router.get("/logs")
def admin_logs(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    rows = (
        db.query(ActivityLog, User)
        .join(User, ActivityLog.user_id == User.id)
        .order_by(ActivityLog.created_at.desc())
        .limit(100)
        .all()
    )
    return success_response(
        "Admin logs fetched successfully",
        [
            {
                "id": log.id,
                "user": {"id": user.id, "name": user.name, "email": user.email},
                "action": log.action,
                "status": log.status,
                "message": log.message,
                "created_at": log.created_at,
            }
            for log, user in rows
        ],
    )


@router.get("/contact-messages")
@router.get("/messages")
def admin_contact_messages(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    messages = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
    return success_response(
        "Contact messages fetched successfully",
        [ContactMessageResponse.model_validate(message) for message in messages],
    )


@router.patch("/contact-messages/{message_id}/status")
@router.patch("/messages/{message_id}/status")
def admin_contact_message_status(
    message_id: int,
    payload: ContactMessageStatusUpdate,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    message = db.get(ContactMessage, message_id)
    if not message:
        from fastapi import HTTPException, status

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact message not found.")
    message.status = payload.status.strip()
    db.commit()
    db.refresh(message)
    return success_response("Contact message status updated successfully", ContactMessageResponse.model_validate(message))


def _serialize_resume(resume: Resume, user: User) -> dict:
    return {
        "id": resume.id,
        "user": {"id": user.id, "name": user.name, "email": user.email},
        "file_name": resume.file_name,
        "file_type": resume.file_type,
        "file_size": resume.file_size,
        "processing_status": resume.processing_status,
        "uploaded_at": resume.uploaded_at,
    }


def _serialize_report(report: AnalysisReport, user: User, resume: Resume) -> dict:
    return {
        "id": report.id,
        "report_id": report.id,
        "user": {"id": user.id, "name": user.name, "email": user.email},
        "resume_id": resume.id,
        "resume_name": resume.file_name,
        "overall_score": report.overall_score,
        "ats_score": report.ats_score,
        "job_match_score": report.job_match_score,
        "created_at": report.created_at,
    }
