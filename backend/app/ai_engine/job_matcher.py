import re

from app.ai_engine.skill_extractor import extract_skills, flatten_skills


def tokenize_keywords(text: str) -> set[str]:
    words = re.findall(r"[a-zA-Z][a-zA-Z+#.\-]{2,}", text.lower())
    stop_words = {
        "and", "the", "for", "with", "are", "you", "our", "this", "that", "will",
        "have", "from", "your", "job", "role", "candidate", "experience", "years",
        "using", "work", "team", "plus", "strong", "good", "must",
    }
    return {word for word in words if word not in stop_words}


def match_job_description(resume_text: str, job_description: str) -> dict[str, object]:
    resume_skills = {str(skill["skill_name"]) for skill in extract_skills(resume_text)}
    required_skills = {str(skill["skill_name"]) for skill in extract_skills(job_description)}
    if not required_skills:
        required_skills = {skill for skill in flatten_skills() if re.search(rf"(?<![\w.+-]){re.escape(skill)}(?![\w.+-])", job_description, re.I)}
    matched_skills = sorted(required_skills & resume_skills)
    missing_skills = sorted(required_skills - resume_skills)

    jd_keywords = tokenize_keywords(job_description)
    resume_keywords = tokenize_keywords(resume_text)
    matched_keywords = sorted(jd_keywords & resume_keywords)
    missing_keywords = sorted(jd_keywords - resume_keywords)
    matched_phrases = _match_phrases(resume_text, job_description)
    keyword_match = len(matched_keywords) / len(jd_keywords) * 100 if jd_keywords else 0
    skill_match = len(matched_skills) / len(required_skills) * 100 if required_skills else keyword_match
    phrase_match = min(len(matched_phrases) * 10, 100)
    match_percentage = round((keyword_match * 0.35) + (skill_match * 0.50) + (phrase_match * 0.15), 2)

    suggestions = []
    if missing_skills:
        suggestions.append(f"Add evidence for missing required skills: {', '.join(missing_skills[:6])}.")
    if keyword_match < 60:
        suggestions.append("Mirror important job description keywords in your resume achievements.")
    if not suggestions:
        suggestions.append("Resume aligns well with the provided job description.")

    return {
        "match_percentage": min(match_percentage, 100),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "missing_skill_priorities": [
            {"skill_name": skill, "priority": "high" if index < 5 else "medium", "reason": "Detected in job description but not in resume."}
            for index, skill in enumerate(missing_skills)
        ],
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords[:30],
        "matched_phrases": matched_phrases,
        "suggestions": suggestions,
    }


def _match_phrases(resume_text: str, job_description: str) -> list[str]:
    phrases = re.findall(r"\b[a-zA-Z][a-zA-Z+#.-]+(?:\s+[a-zA-Z][a-zA-Z+#.-]+){1,3}\b", job_description.lower())
    resume_lower = resume_text.lower()
    return sorted({phrase for phrase in phrases if phrase in resume_lower})[:15]
