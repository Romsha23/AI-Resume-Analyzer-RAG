import json
import re
from pathlib import Path
from typing import Any

import fitz
from loguru import logger

from app.services.gemini_service import gemini_service

SKILL_PATTERNS = [
    r"\b(python|java|javascript|typescript|react|node\.?js|fastapi|django|flask|sql|postgresql|mongodb|aws|azure|docker|kubernetes|git|ci/cd|machine learning|deep learning|nlp|tensorflow|pytorch|langchain|faiss|tailwind|css|html|rest|graphql|microservices|agile|scrum)\b",
]

SECTION_KEYWORDS = {
    "experience": ["experience", "work history", "employment"],
    "education": ["education", "academic"],
    "skills": ["skills", "technical skills", "core competencies"],
    "projects": ["projects", "portfolio"],
    "certifications": ["certifications", "licenses"],
}


def _ensure_array(value: Any) -> list:
    """Normalize any value to a list. Handles str/dict/None/list gracefully."""
    if isinstance(value, list):
        return value
    if value is None or value == "" or value == {}:
        return []
    if isinstance(value, dict):
        # Gemini returned a single object where an array was expected — wrap it
        return [value]
    if isinstance(value, str):
        # Plain text string returned where structured array expected — discard
        return []
    return []


def _normalize_parsed_data(data: dict[str, Any]) -> dict[str, Any]:
    """Enforce correct types for all array fields regardless of AI output."""
    for field in ["skills", "experience", "education", "projects", "certifications"]:
        data[field] = _ensure_array(data.get(field))
    return data


class ResumeParserService:
    def extract_text_from_pdf(self, file_path: str | Path) -> str:
        doc = fitz.open(str(file_path))
        text_parts = []
        for page in doc:
            text_parts.append(page.get_text())
        doc.close()
        return "\n".join(text_parts).strip()

    def _extract_sections(self, text: str) -> dict[str, str]:
        lines = text.split("\n")
        sections: dict[str, list[str]] = {k: [] for k in SECTION_KEYWORDS}
        current = "general"
        for line in lines:
            lower = line.lower().strip()
            matched = False
            for section, keywords in SECTION_KEYWORDS.items():
                if any(kw in lower for kw in keywords) and len(lower) < 60:
                    current = section
                    matched = True
                    break
            if not matched and line.strip():
                sections.setdefault(current, []).append(line)
        return {k: "\n".join(v).strip() for k, v in sections.items() if v}

    def _extract_skills_regex(self, text: str) -> list[str]:
        found = set()
        lower = text.lower()
        for pattern in SKILL_PATTERNS:
            for match in re.finditer(pattern, lower, re.IGNORECASE):
                found.add(match.group().strip().title())
        return sorted(found)

    def _guess_name(self, text: str) -> str:
        lines = [ln.strip() for ln in text.split("\n") if ln.strip()]
        if not lines:
            return "Unknown"
        candidate = lines[0]
        if len(candidate) < 50 and not "@" in candidate:
            return candidate
        return "Unknown"

    def parse_with_text_splitter(self, text: str) -> dict[str, Any]:
        sections = self._extract_sections(text)
        skills = self._extract_skills_regex(text)
        # Initialize with safe empty arrays for all array fields
        return {
            "name": self._guess_name(text),
            "email": self._extract_email(text),
            "phone": self._extract_phone(text),
            "location": None,
            "summary": text[:500],
            "skills": skills,
            "experience": [],
            "education": [],
            "projects": [],
            "certifications": [],
        }

    def _extract_email(self, text: str) -> str | None:
        match = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", text)
        return match.group() if match else None

    def _extract_phone(self, text: str) -> str | None:
        match = re.search(r"\+?[\d\s().-]{10,}", text)
        return match.group().strip() if match else None

    def enhance_with_gemini(self, text: str, basic: dict[str, Any]) -> dict[str, Any]:
        try:
            prompt = f"""Analyze this resume text and return a single JSON object with EXACTLY these keys:

- name: string
- email: string or null
- phone: string or null
- location: string or null
- summary: string (1-2 sentences)
- skills: array of strings, e.g. ["Python", "React", "SQL"]
- experience: array of objects with keys: role, company, duration, description
- education: array of objects with keys: degree, institution, year
- projects: array of objects with keys: name, description
- certifications: array of strings

RULES:
- experience, education, projects, certifications MUST be arrays even if only one item exists.
- If a section has no data return an empty array [].
- Never return a single object where an array is expected.
- Respond with valid JSON only, no markdown or explanation.

Resume:
{text[:8000]}
"""
            enhanced = gemini_service.generate_json(prompt)

            # Merge Gemini output into basic, preferring Gemini values
            for key in ["name", "email", "phone", "location", "summary",
                        "skills", "experience", "education", "projects", "certifications"]:
                val = enhanced.get(key)
                if val is not None and val != "" and val != [] and val != {}:
                    basic[key] = val

            if "years_of_experience" in enhanced:
                basic["years_of_experience"] = enhanced["years_of_experience"]

        except Exception as exc:
            logger.warning(f"Gemini parse enhancement skipped: {exc}")

        # Always normalize after Gemini (or if Gemini failed) — enforces correct types
        return _normalize_parsed_data(basic)

    def parse_resume(self, text: str, use_gemini: bool = True) -> dict[str, Any]:
        parsed = self.parse_with_text_splitter(text)
        if use_gemini:
            parsed = self.enhance_with_gemini(text, parsed)
        else:
            parsed = _normalize_parsed_data(parsed)
        return parsed

    def to_json(self, data: dict[str, Any]) -> str:
        return json.dumps(data, default=str)


resume_parser = ResumeParserService()
