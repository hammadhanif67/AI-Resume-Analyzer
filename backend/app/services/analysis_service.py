from sqlalchemy.orm import Session

from app.ai_engine.achievement_analyzer import analyze_achievement_quality
from app.ai_engine.job_matcher import match_job_description
from app.ai_engine.readability_analyzer import analyze_readability
from app.ai_engine.section_detector import analyze_sections, detect_sections
from app.ai_engine.skill_extractor import extract_skills
from app.ats_engine.ats_score import calculate_ats_score
from app.models.job_description_model import JobDescription
from app.models.resume_model import Resume
from app.services.report_service import save_analysis_report


def analyze_resume(db: Session, user_id: int, resume: Resume, job_description: str | None = None) -> dict[str, object]:
    text = resume.extracted_text or ""
    job_match = match_job_description(text, job_description) if job_description else {
        "match_percentage": 0,
        "matched_skills": [],
        "missing_skills": [],
        "matched_keywords": [],
        "missing_keywords": [],
        "suggestions": [],
    }
    ats = calculate_ats_score(text, float(job_match["match_percentage"]))
    found_skills = extract_skills(text)
    sections = detect_sections(text)
    section_analysis = analyze_sections(text)
    readability = analyze_readability(text)
    achievement_quality = analyze_achievement_quality(text)

    missing_skills = [
        {"skill_name": item["skill_name"], "priority": item["priority"], "reason": item["reason"]}
        for item in job_match.get("missing_skill_priorities", [])
    ]

    strengths = _build_strengths(found_skills, sections)
    weaknesses = _build_weaknesses(sections, found_skills, text, readability)
    suggestion_groups = _build_suggestion_groups(weaknesses, job_match["suggestions"], readability, achievement_quality)
    suggestions = [item for group in suggestion_groups.values() for item in group]
    overall_score = round((float(ats["ats_score"]) * 0.75) + (float(job_match["match_percentage"]) * 0.25), 2)

    analysis = {
        "overall_score": overall_score,
        "ats_score": ats["ats_score"],
        "job_match_score": job_match["match_percentage"],
        "grammar_score": ats["grammar_score"],
        "readability_score": ats["readability_score"],
        "sections": ats["sections"],
        "score_breakdown": ats["score_breakdown"],
        "readability_analysis": readability,
        "skills_found": found_skills,
        "missing_skills": missing_skills,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "suggestions": suggestions,
        "suggestion_groups": suggestion_groups,
        "enhanced_analysis": {
            "section_analysis": section_analysis,
            "readability_analysis": readability,
            "achievement_quality": achievement_quality,
            "job_match": job_match,
            "suggestion_groups": suggestion_groups,
        },
    }
    report = save_analysis_report(db, user_id, resume.id, analysis)
    analysis["report_id"] = report.id
    return analysis


def run_job_match(db: Session, user_id: int, resume: Resume, job_title: str, job_description: str) -> dict[str, object]:
    db.add(JobDescription(user_id=user_id, title=job_title, description=job_description))
    db.commit()
    return match_job_description(resume.extracted_text or "", job_description)


def _build_strengths(skills: list[dict[str, object]], sections: dict[str, dict[str, object]]) -> list[str]:
    strengths = []
    if skills:
        categories = sorted({skill["skill_category"] for skill in skills})
        strengths.append(f"Detected skills across {', '.join(categories)}.")
    if sections["experience"]["present"] or sections["projects"]["present"]:
        strengths.append("Resume includes practical experience or project evidence.")
    if sections["education"]["present"]:
        strengths.append("Education section is present.")
    return strengths or ["Resume has extractable content for analysis."]


def _build_weaknesses(sections: dict[str, dict[str, object]], skills: list[dict[str, object]], text: str, readability: dict[str, object]) -> list[str]:
    weaknesses = []
    if not sections["skills"]["present"] or not skills:
        weaknesses.append("Skills section or recognizable skills are limited.")
    if not sections["experience"]["present"] and not sections["projects"]["present"]:
        weaknesses.append("Experience or projects section is missing.")
    if len(text.split()) < 120:
        weaknesses.append("Resume content appears too short for strong ATS performance.")
    weaknesses.extend(str(issue) for issue in readability.get("readability_issues", [])[:3])
    return weaknesses


def _build_suggestion_groups(
    weaknesses: list[str],
    job_suggestions: list[str],
    readability: dict[str, object],
    achievement_quality: dict[str, object],
) -> dict[str, list[str]]:
    groups = {
        "ATS": [],
        "Skills": [],
        "Projects": [],
        "Grammar/Readability": list(readability.get("readability_suggestions", [])),
        "Job Match": list(job_suggestions),
    }
    if any("Skills" in weakness for weakness in weaknesses):
        groups["Skills"].append("Add a clear skills section with relevant technical and soft skills.")
    if any("Experience" in weakness for weakness in weaknesses):
        groups["Projects"].append("Add measurable experience or project bullets using action verbs.")
    if any("too short" in weakness for weakness in weaknesses):
        groups["ATS"].append("Expand resume details with achievements, tools, outcomes, and dates.")
    groups["Projects"].extend(str(item) for item in achievement_quality.get("suggestions", []))
    return {key: value or ["No critical issue detected in this category."] for key, value in groups.items()}
