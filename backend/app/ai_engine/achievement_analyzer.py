from app.ai_engine.readability_analyzer import STRONG_ALTERNATIVES, WEAK_WORDING


def analyze_achievement_quality(text: str) -> dict[str, object]:
    lower_text = text.lower()
    weak_phrases = [phrase for phrase in WEAK_WORDING if phrase in lower_text]
    suggestions = []
    if weak_phrases:
        suggestions.append(
            f"Replace {', '.join(weak_phrases)} with action verbs like {', '.join(STRONG_ALTERNATIVES)}."
        )
        suggestions.append("Add measurable outcomes such as percentages, time saved, users served, or performance gains.")
    else:
        suggestions.append("Keep using action-led bullets and add metrics wherever possible.")
    score = 100 - min(len(weak_phrases) * 15, 60)
    return {"achievement_quality_score": float(score), "weak_phrases": weak_phrases, "suggestions": suggestions}
