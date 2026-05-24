from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.analysis_schema import MissingSkillItem, SkillItem


class ReportResponse(BaseModel):
    id: int
    user_id: int
    resume_id: int
    overall_score: float
    ats_score: float
    job_match_score: float
    grammar_score: float
    readability_score: float
    strengths: list[str]
    weaknesses: list[str]
    suggestions: list[str]
    skills_found: list[SkillItem]
    missing_skills: list[MissingSkillItem]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
