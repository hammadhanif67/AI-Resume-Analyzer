from pathlib import Path

import pdfplumber

from app.parsers.text_cleaner import clean_text


def extract_pdf_text(file_path: str | Path) -> str:
    try:
        with pdfplumber.open(file_path) as pdf:
            page_texts = []
            for page in pdf.pages:
                page_text = page.extract_text(x_tolerance=1, y_tolerance=3) or page.extract_text_simple() or ""
                if not page_text:
                    words = page.extract_words() or []
                    page_text = " ".join(word.get("text", "") for word in words)
                page_texts.append(page_text)
            text = "\n".join(page_texts)
    except Exception as exc:
        raise ValueError("Unable to parse PDF resume. The file may be corrupted or encrypted.") from exc
    cleaned = clean_text(text)
    if not cleaned:
        raise ValueError("PDF resume text is empty after extraction.")
    return cleaned
