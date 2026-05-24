from app.ai_engine.achievement_analyzer import analyze_achievement_quality
from app.ai_engine.job_matcher import match_job_description
from app.ai_engine.readability_analyzer import analyze_readability
from app.ai_engine.section_detector import analyze_sections, detect_sections
from app.ai_engine.skill_extractor import extract_skills
from app.ats_engine.ats_score import calculate_ats_score


SAMPLE_RESUME = """
Contact
test@example.com +1 555 123 4567 https://github.com/test
Summary
Backend developer focused on Python, JS, React.js and FastAPI.
Education
BS Computer Science
Skills
Python, FastAPI, JS, TS, React.js, Postgres, Docker, AWS, Git
Projects
- Developed a resume analyzer API with SQLAlchemy and SQLite.
- Responsible for frontend integration and helped with testing.
Achievements
Improved parsing quality for PDF and DOCX resumes.
Languages
English
"""


def test_skill_extraction_aliases_and_deduplication():
    skills = extract_skills(SAMPLE_RESUME)
    names = {skill["skill_name"] for skill in skills}
    assert "JavaScript" in names
    assert "TypeScript" in names
    assert "React" in names
    assert "PostgreSQL" in names
    assert len(names) == len(skills)


def test_section_detection_enhanced_output():
    sections = detect_sections(SAMPLE_RESUME)
    enhanced = analyze_sections(SAMPLE_RESUME)
    assert sections["contact"]["present"] is True
    assert sections["achievements"]["present"] is True
    assert "missing_sections" in enhanced
    assert "section_quality_notes" in enhanced


def test_readability_and_achievement_analysis():
    readability = analyze_readability(SAMPLE_RESUME)
    achievement = analyze_achievement_quality(SAMPLE_RESUME)
    assert "readability_score" in readability
    assert "responsible for" in achievement["weak_phrases"]
    assert achievement["suggestions"]


def test_ats_scoring_breakdown_contains_reasons_and_tips():
    result = calculate_ats_score(SAMPLE_RESUME, job_match_score=75)
    breakdown = result["score_breakdown"]
    expected = {
        "contact_information",
        "section_completeness",
        "skills_score",
        "formatting_score",
        "keyword_score",
        "readability_score",
        "experience_project_quality",
        "job_match",
    }
    assert expected.issubset(breakdown)
    assert all("reason" in item and "improvement_tip" in item for item in breakdown.values())


def test_job_matching_enhanced_fields():
    result = match_job_description(
        SAMPLE_RESUME,
        "We need Python FastAPI React TypeScript PostgreSQL Docker AWS and Kubernetes experience.",
    )
    assert result["match_percentage"] > 0
    assert "Python" in result["matched_skills"]
    assert "Kubernetes" in result["missing_skills"]
    assert result["missing_skill_priorities"]
    assert "matched_keywords" in result
    assert "missing_keywords" in result
