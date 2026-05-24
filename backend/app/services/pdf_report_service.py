from io import BytesIO

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer

from app.models.report_model import AnalysisReport
from app.services.report_service import serialize_report


def build_report_pdf(report: AnalysisReport, user_name: str) -> bytes:
    buffer = BytesIO()
    document = SimpleDocTemplate(buffer, pagesize=A4, title=f"Resume Analysis Report #{report.id}")
    styles = getSampleStyleSheet()
    data = serialize_report(report)

    story = [
        Paragraph("AI Resume Analyzer Report", styles["Title"]),
        Spacer(1, 12),
        Paragraph(f"User: {user_name}", styles["Normal"]),
        Paragraph(f"Resume: {data['resume']['file_name'] if data['resume'] else 'Unknown'}", styles["Normal"]),
        Spacer(1, 12),
        Paragraph(f"Overall Score: {data['overall_score']}", styles["Heading2"]),
        Paragraph(f"ATS Score: {data['ats_score']}", styles["Normal"]),
        Paragraph(f"Job Match Score: {data['job_match_score']}", styles["Normal"]),
        Spacer(1, 12),
    ]

    _add_list(story, styles, "Skills Found", [skill["skill_name"] for skill in data["skills_found"]])
    _add_list(story, styles, "Missing Skills", [skill["skill_name"] for skill in data["missing_skills"]])
    _add_list(story, styles, "Strengths", data["strengths"])
    _add_list(story, styles, "Weaknesses", data["weaknesses"])
    _add_list(story, styles, "Suggestions", data["suggestions"])

    document.build(story)
    buffer.seek(0)
    return buffer.getvalue()


def _add_list(story: list, styles, title: str, items: list[str]) -> None:
    story.append(Paragraph(title, styles["Heading2"]))
    if not items:
        story.append(Paragraph("None recorded.", styles["Normal"]))
    for item in items:
        story.append(Paragraph(f"- {item}", styles["Normal"]))
    story.append(Spacer(1, 10))
