from fastapi import APIRouter, Depends, Path
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.connection import get_db
from app.models.user_model import User
from app.services.activity_log_service import log_activity
from app.services.pdf_report_service import build_report_pdf
from app.services.report_service import get_report, list_user_reports, serialize_report, serialize_report_summary
from app.utils.response_handler import success_response

router = APIRouter(tags=["Reports"])


@router.get("/report/history")
def get_report_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    reports = list_user_reports(db, current_user.id)
    return success_response("Report history fetched successfully", [serialize_report_summary(report) for report in reports])


@router.get("/report/{report_id}/download")
def download_analysis_report(
    report_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    report = get_report(db, current_user.id, report_id)
    pdf_bytes = build_report_pdf(report, current_user.name)
    log_activity(db, current_user, "report_download", "success", f"Downloaded report #{report_id}")
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="resume-analysis-report-{report_id}.pdf"'},
    )


@router.get("/report/{report_id}")
def get_analysis_report(
    report_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    report = get_report(db, current_user.id, report_id)
    return success_response("Report fetched successfully", serialize_report(report))


@router.get("/reports/{report_id}")
def get_analysis_report_legacy(
    report_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    report = get_report(db, current_user.id, report_id)
    return success_response("Report fetched successfully", serialize_report(report))
