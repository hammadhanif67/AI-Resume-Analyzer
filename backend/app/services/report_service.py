import json

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.models.report_model import AnalysisReport
from app.models.skill_model import MissingSkill, SkillFound


def save_analysis_report(
    db: Session,
    user_id: int,
    resume_id: int,
    analysis: dict[str, object],
) -> AnalysisReport:
    report = AnalysisReport(
        user_id=user_id,
        resume_id=resume_id,
        overall_score=float(analysis["overall_score"]),
        ats_score=float(analysis["ats_score"]),
        job_match_score=float(analysis.get("job_match_score", 0)),
        grammar_score=float(analysis["grammar_score"]),
        readability_score=float(analysis["readability_score"]),
        score_breakdown=json.dumps(analysis.get("score_breakdown", {})),
        enhanced_analysis=json.dumps(analysis.get("enhanced_analysis", {})),
        strengths=json.dumps(analysis["strengths"]),
        weaknesses=json.dumps(analysis["weaknesses"]),
        suggestions=json.dumps(analysis["suggestions"]),
    )
    db.add(report)
    db.flush()

    for skill in analysis["skills_found"]:
        db.add(
            SkillFound(
                report_id=report.id,
                skill_name=skill["skill_name"],
                skill_category=skill["skill_category"],
                confidence_score=skill["confidence_score"],
            )
        )

    for skill in analysis["missing_skills"]:
        db.add(
            MissingSkill(
                report_id=report.id,
                skill_name=skill["skill_name"],
                priority=skill["priority"],
                reason=skill["reason"],
            )
        )

    db.commit()
    return get_report(db, user_id, report.id)


def get_report(db: Session, user_id: int, report_id: int, allow_any_user: bool = False) -> AnalysisReport:
    query = db.query(AnalysisReport).options(
        selectinload(AnalysisReport.user),
        selectinload(AnalysisReport.resume),
        selectinload(AnalysisReport.skills_found),
        selectinload(AnalysisReport.missing_skills),
    )
    query = query.filter(AnalysisReport.id == report_id)
    if not allow_any_user:
        query = query.filter(AnalysisReport.user_id == user_id)

    report = query.first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found or you do not have access to this report.",
        )
    return report


def list_user_reports(db: Session, user_id: int) -> list[AnalysisReport]:
    return (
        db.query(AnalysisReport)
        .options(selectinload(AnalysisReport.resume))
        .filter(AnalysisReport.user_id == user_id)
        .order_by(AnalysisReport.created_at.desc())
        .all()
    )


def serialize_report(report: AnalysisReport) -> dict[str, object]:
    return {
        "id": report.id,
        "report_id": report.id,
        "user_id": report.user_id,
        "resume_id": report.resume_id,
        "resume_file_name": report.resume.file_name if report.resume else None,
        "overall_score": report.overall_score,
        "ats_score": report.ats_score,
        "job_match_score": report.job_match_score,
        "grammar_score": report.grammar_score,
        "readability_score": report.readability_score,
        "score_breakdown": json.loads(report.score_breakdown or "{}"),
        "enhanced_analysis": json.loads(report.enhanced_analysis or "{}"),
        "resume": {
            "id": report.resume.id,
            "file_name": report.resume.file_name,
            "file_type": report.resume.file_type,
            "file_size": report.resume.file_size,
            "processing_status": report.resume.processing_status,
            "uploaded_at": report.resume.uploaded_at,
        } if report.resume else None,
        "strengths": json.loads(report.strengths or "[]"),
        "weaknesses": json.loads(report.weaknesses or "[]"),
        "suggestions": json.loads(report.suggestions or "[]"),
        "skills_found": [
            {
                "skill_name": skill.skill_name,
                "skill_category": skill.skill_category,
                "confidence_score": skill.confidence_score,
            }
            for skill in report.skills_found
        ],
        "missing_skills": [
            {"skill_name": skill.skill_name, "priority": skill.priority, "reason": skill.reason}
            for skill in report.missing_skills
        ],
        "created_at": report.created_at,
    }


def serialize_report_summary(report: AnalysisReport) -> dict[str, object]:
    return {
        "id": report.id,
        "report_id": report.id,
        "resume_id": report.resume_id,
        "resume_file_name": report.resume.file_name if report.resume else None,
        "overall_score": report.overall_score,
        "ats_score": report.ats_score,
        "job_match_score": report.job_match_score,
        "created_at": report.created_at,
    }
