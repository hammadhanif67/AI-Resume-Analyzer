import re


SECTION_KEYWORDS: dict[str, list[str]] = {
    "contact": ["email", "phone", "linkedin", "github", "address"],
    "summary": ["summary", "profile", "objective", "about me", "career objective"],
    "education": ["education", "degree", "university", "college", "cgpa", "gpa"],
    "skills": ["skills", "technical skills", "core skills"],
    "experience": ["experience", "employment", "work history", "internship"],
    "projects": ["projects", "academic projects", "personal projects"],
    "certifications": ["certifications", "certificates", "courses"],
    "achievements": ["achievements", "awards", "honors", "accomplishments"],
    "languages": ["languages", "spoken languages"],
    "links": ["portfolio", "linkedin", "github", "website", "links"],
}


def detect_sections(text: str) -> dict[str, dict[str, bool | list[str]]]:
    lower_text = text.lower()
    sections: dict[str, dict[str, bool | list[str]]] = {}
    for section, keywords in SECTION_KEYWORDS.items():
        matched = [keyword for keyword in keywords if re.search(rf"\b{re.escape(keyword)}\b", lower_text)]
        sections[section] = {"present": bool(matched), "matched_keywords": matched}
    return sections


def analyze_sections(text: str) -> dict[str, object]:
    detected = detect_sections(text)
    missing = [section for section, data in detected.items() if not data["present"]]
    notes = {}
    for section, data in detected.items():
        if data["present"]:
            notes[section] = "Detected with recognizable heading or keyword."
        elif section in {"experience", "projects"}:
            notes[section] = "Add measurable work or project evidence."
        elif section in {"contact", "skills", "education"}:
            notes[section] = "Important ATS section is missing or unclear."
        else:
            notes[section] = "Optional section not detected."
    return {"detected_sections": detected, "missing_sections": missing, "section_quality_notes": notes}
