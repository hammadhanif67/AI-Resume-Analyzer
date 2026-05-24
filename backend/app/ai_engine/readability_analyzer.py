import re
from collections import Counter


WEAK_WORDING = ["worked on", "helped with", "responsible for", "made project", "did", "handled"]
STRONG_ALTERNATIVES = ["developed", "implemented", "optimized", "improved", "designed", "automated"]


def analyze_readability(text: str) -> dict[str, object]:
    words = re.findall(r"[A-Za-z]+", text.lower())
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    bullet_lines = [line for line in lines if re.match(r"^[-*•]", line)]
    issues: list[str] = []
    suggestions: list[str] = []

    if len(words) < 120:
        issues.append("Resume appears too short for strong ATS evaluation.")
        suggestions.append("Add project details, tools used, measurable outcomes, and dates.")
    if len(words) > 900:
        issues.append("Resume may be too long for a concise early-career resume.")
        suggestions.append("Trim older or less relevant details and prioritize role-specific achievements.")

    avg_line_length = round(sum(len(line) for line in lines) / len(lines), 2) if lines else 0
    if avg_line_length > 120:
        issues.append("Average line length is high, which can reduce readability.")
        suggestions.append("Break long statements into short, scannable bullets.")
    if not bullet_lines:
        issues.append("Bullet points were not clearly detected.")
        suggestions.append("Use bullet points for experience and project achievements.")

    repeated_words = [word for word, count in Counter(words).most_common(8) if count >= 8 and len(word) > 4]
    if repeated_words:
        issues.append(f"Repeated words detected: {', '.join(repeated_words[:5])}.")
        suggestions.append("Vary wording and replace repeated generic terms with specific technologies or outcomes.")

    weak_phrases = [phrase for phrase in WEAK_WORDING if phrase in text.lower()]
    if weak_phrases:
        issues.append(f"Weak wording detected: {', '.join(weak_phrases)}.")
        suggestions.append(f"Replace weak phrases with action verbs such as {', '.join(STRONG_ALTERNATIVES)}.")

    score = 100 - min(len(issues) * 12, 60)
    return {
        "readability_score": float(score),
        "average_line_length": avg_line_length,
        "bullet_point_count": len(bullet_lines),
        "repeated_words": repeated_words[:5],
        "weak_phrases": weak_phrases,
        "readability_issues": issues,
        "readability_suggestions": suggestions,
    }
