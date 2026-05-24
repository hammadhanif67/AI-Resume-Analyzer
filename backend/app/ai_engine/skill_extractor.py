import re


SKILL_DICTIONARY: dict[str, list[str]] = {
    "Frontend": ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Tailwind CSS", "Next.js", "Redux"],
    "Backend": ["Python", "FastAPI", "Node.js", "Express.js", "Django", "Flask", "REST API", "GraphQL"],
    "Database": ["SQLite", "MySQL", "PostgreSQL", "Postgres", "MongoDB", "Redis", "SQL"],
    "DevOps": ["Docker", "Kubernetes", "CI/CD", "GitHub Actions", "Linux", "Nginx"],
    "AI/ML": ["Machine Learning", "Deep Learning", "NLP", "TensorFlow", "PyTorch", "scikit-learn", "spaCy", "Pandas", "NumPy"],
    "Cloud": ["AWS", "Azure", "Google Cloud", "GCP", "Firebase", "Vercel", "Netlify"],
    "Tools": ["Git", "GitHub", "VS Code", "Postman", "Figma", "Jira"],
    "Soft Skills": ["Communication", "Teamwork", "Problem Solving", "Leadership", "Collaboration", "Adaptability"],
}

SKILL_ALIASES: dict[str, str] = {
    "JS": "JavaScript",
    "React.js": "React",
    "ReactJS": "React",
    "TS": "TypeScript",
    "Postgres": "PostgreSQL",
    "GCP": "Google Cloud",
    "Sklearn": "scikit-learn",
}


def _skill_pattern(skill: str) -> str:
    return rf"(?<![\w.+#-]){re.escape(skill)}(?![\w.+#-])"


def extract_skills(text: str) -> list[dict[str, str | float]]:
    found: dict[str, dict[str, str | float]] = {}
    searchable = {skill: skill for skills in SKILL_DICTIONARY.values() for skill in skills}
    searchable.update(SKILL_ALIASES)

    for term, canonical in searchable.items():
        match = re.search(_skill_pattern(term), text, flags=re.IGNORECASE)
        if not match:
            continue
        category = get_skill_category(canonical)
        existing = found.get(canonical)
        confidence = 1.0 if term == canonical else 0.92
        if existing:
            existing["confidence_score"] = max(float(existing["confidence_score"]), confidence)
            continue
        found[canonical] = {
            "skill_name": canonical,
            "skill_category": category,
            "confidence_score": confidence,
        }

    return sorted(found.values(), key=lambda item: (str(item["skill_category"]), str(item["skill_name"])))


def get_skill_category(skill_name: str) -> str:
    canonical = SKILL_ALIASES.get(skill_name, skill_name)
    for category, skills in SKILL_DICTIONARY.items():
        if canonical in skills:
            return category
    return "Tools"


def flatten_skills() -> set[str]:
    return {skill for skills in SKILL_DICTIONARY.values() for skill in skills}
