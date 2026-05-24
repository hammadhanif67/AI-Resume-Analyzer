from app.ai_engine.section_detector import detect_sections
from app.ai_engine.skill_extractor import extract_skills
from app.ai_engine.readability_analyzer import analyze_readability
from app.ats_engine.scoring_rules import (
    has_contact_info,
    has_enough_keywords,
    is_reasonable_length,
)


def _score_item(points: float, max_points: float, reason: str, improvement_tip: str) -> dict[str, float | str]:
    return {"points": round(points, 2), "max_points": max_points, "reason": reason, "improvement_tip": improvement_tip}


def calculate_ats_score(text: str, job_match_score: float = 0) -> dict[str, object]:
    sections = detect_sections(text)
    details: dict[str, dict[str, float | str]] = {}
    skills = extract_skills(text)
    readability = analyze_readability(text)

    contact_points = 10 if has_contact_info(text) or sections["contact"]["present"] else 0
    details["contact_information"] = _score_item(contact_points, 10, "Email/phone or contact heading detected." if contact_points else "Email and phone were not both detected.", "Add email, phone, LinkedIn, GitHub, and portfolio links.")

    required_sections = ["contact", "education", "skills", "experience", "projects"]
    present_required = sum(1 for section in required_sections if sections.get(section, {}).get("present"))
    section_points = present_required / len(required_sections) * 15
    details["section_completeness"] = _score_item(section_points, 15, f"{present_required}/{len(required_sections)} core sections detected.", "Use clear headings for contact, education, skills, experience, and projects.")

    skills_points = min(len(skills) * 1.5, 15)
    details["skills_score"] = _score_item(skills_points, 15, f"{len(skills)} known skills detected.", "Add relevant skills from the target role and group them by category.")

    section_count = sum(1 for value in sections.values() if value["present"])
    formatting_points = 15 if section_count >= 4 else 7
    readability_score = float(readability["readability_score"])
    readability_points = round(readability_score * 0.10, 2)
    keyword_points = 10 if has_enough_keywords(text) else 5
    experience_points = 15 if sections["experience"]["present"] or sections["projects"]["present"] else 0
    job_points = round(job_match_score * 0.20, 2)

    if has_enough_keywords(text) and is_reasonable_length(text):
        formatting_points = min(formatting_points + 3, 15)

    details["formatting_score"] = _score_item(formatting_points, 15, f"{section_count} standard resume sections detected.", "Keep headings standard and avoid complex tables or graphics.")
    details["keyword_score"] = _score_item(keyword_points, 10, "Keyword variety is sufficient." if keyword_points == 10 else "Resume keyword coverage is limited.", "Add role-specific tools, technologies, and domain keywords.")
    details["readability_score"] = _score_item(readability_points, 10, "Readability analysis completed.", "Use concise bullets and reduce repeated wording.")
    details["experience_project_quality"] = _score_item(experience_points, 15, "Experience or projects section detected." if experience_points else "Experience and projects sections not detected.", "Add action-led project or experience bullets with measurable outcomes.")
    details["job_match"] = _score_item(job_points, 20, "Based on provided job description match score." if job_match_score else "No job description provided for this analysis.", "Paste a job description and align resume keywords to it.")

    score = round(sum(float(item["points"]) for item in details.values()), 2)
    return {
        "ats_score": min(score, 100),
        "grammar_score": readability_score,
        "readability_score": readability_score,
        "readability_analysis": readability,
        "sections": sections,
        "score_breakdown": details,
    }
