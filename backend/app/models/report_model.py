from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class AnalysisReport(Base):
    __tablename__ = "analysis_reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    resume_id: Mapped[int] = mapped_column(ForeignKey("resumes.id"), nullable=False, index=True)
    overall_score: Mapped[float] = mapped_column(Float, nullable=False)
    ats_score: Mapped[float] = mapped_column(Float, nullable=False)
    job_match_score: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    grammar_score: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    readability_score: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    score_breakdown: Mapped[str | None] = mapped_column(Text, nullable=True)
    enhanced_analysis: Mapped[str | None] = mapped_column(Text, nullable=True)
    strengths: Mapped[str | None] = mapped_column(Text, nullable=True)
    weaknesses: Mapped[str | None] = mapped_column(Text, nullable=True)
    suggestions: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="reports")
    resume = relationship("Resume", back_populates="reports")
    skills_found = relationship("SkillFound", back_populates="report", cascade="all, delete-orphan")
    missing_skills = relationship("MissingSkill", back_populates="report", cascade="all, delete-orphan")
