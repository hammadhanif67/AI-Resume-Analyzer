from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class SkillFound(Base):
    __tablename__ = "skills_found"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    report_id: Mapped[int] = mapped_column(ForeignKey("analysis_reports.id"), nullable=False, index=True)
    skill_name: Mapped[str] = mapped_column(String(100), nullable=False)
    skill_category: Mapped[str] = mapped_column(String(100), nullable=False)
    confidence_score: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)

    report = relationship("AnalysisReport", back_populates="skills_found")


class MissingSkill(Base):
    __tablename__ = "missing_skills"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    report_id: Mapped[int] = mapped_column(ForeignKey("analysis_reports.id"), nullable=False, index=True)
    skill_name: Mapped[str] = mapped_column(String(100), nullable=False)
    priority: Mapped[str] = mapped_column(String(50), default="medium", nullable=False)
    reason: Mapped[str] = mapped_column(String(255), nullable=False)

    report = relationship("AnalysisReport", back_populates="missing_skills")
