import re


def clean_text(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = text.replace("\u00a0", " ")
    text = re.sub(r"[•·●▪]", "-", text)
    text = re.sub(r"[^\S\n]+", " ", text)
    text = re.sub(r"[^\x09\x0A\x0D\x20-\x7E]", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    lines = [line.strip() for line in text.split("\n")]
    lines = [line for line in lines if line]
    return "\n".join(lines).strip()
