from pydantic import BaseModel, Field


class SkillItem(BaseModel):
    skill_name: str
    skill_category: str
    confidence_score: float = 1.0


class MissingSkillItem(BaseModel):
    skill_name: str
    priority: str
    reason: str


class JobMatchRequest(BaseModel):
    resume_id: int
    job_title: str = Field(..., min_length=2, max_length=150)
    job_description: str = Field(..., min_length=20)


class JobMatchResponse(BaseModel):
    match_percentage: float
    matched_skills: list[str]
    missing_skills: list[str]
    suggestions: list[str]
