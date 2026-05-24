import re


EMAIL_PATTERN = re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+")
PHONE_PATTERN = re.compile(r"(\+?\d[\d\s().-]{8,}\d)")


def has_contact_info(text: str) -> bool:
    return bool(EMAIL_PATTERN.search(text) and PHONE_PATTERN.search(text))


def has_enough_keywords(text: str) -> bool:
    return len(set(re.findall(r"[A-Za-z]{4,}", text.lower()))) >= 40


def is_reasonable_length(text: str) -> bool:
    return len(text.split()) >= 120


def basic_readability_score(text: str) -> float:
    words = text.split()
    if not words:
        return 0
    avg_word_len = sum(len(word) for word in words) / len(words)
    score = 100 - max(0, avg_word_len - 6) * 10
    return round(max(min(score, 100), 40), 2)


def basic_grammar_score(text: str) -> float:
    if not text.strip():
        return 0
    sentences = re.split(r"[.!?]+", text)
    very_short = sum(1 for sentence in sentences if 0 < len(sentence.split()) < 3)
    penalty = min(very_short * 3, 30)
    return float(100 - penalty)
