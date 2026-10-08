from typing import Any
from loguru import logger

from app.config import get_settings
from app.rag.prompts import (
    INTERVIEW_TEMPLATE,
    MATCH_TEMPLATE,
    RAG_QA_TEMPLATE,
    SUGGESTIONS_TEMPLATE,
)
from app.rag.vectorstore import vectorstore_manager
from app.services.gemini_service import gemini_service

settings = get_settings()


class SimpleChatMemory:
    def __init__(self, k: int = 6):
        self.k = k
        self.messages: list[tuple[str, str]] = []

    def add_user_message(self, content: str):
        self.messages.append(("Human", content))
        if len(self.messages) > self.k * 2:
            self.messages = self.messages[-self.k * 2:]

    def add_ai_message(self, content: str):
        self.messages.append(("AI", content))
        if len(self.messages) > self.k * 2:
            self.messages = self.messages[-self.k * 2:]

    def get_history_string(self) -> str:
        return "\n".join(f"{role}: {text}" for role, text in self.messages)


_conversation_memories: dict[int, SimpleChatMemory] = {}


class RAGChainService:
    def retrieve_context(
        self, collection_keys: list[str], query: str, k: int = 5
    ) -> tuple[str, list[str]]:
        all_docs, sources = vectorstore_manager.similarity_search(
            query, collection_keys, k=k
        )
        if not all_docs:
            return "", []

        context = "\n\n---\n\n".join(doc.page_content for doc in all_docs[: k * 2])
        return context, sources

    def _get_memory(self, session_id: int) -> SimpleChatMemory:
        if session_id not in _conversation_memories:
            _conversation_memories[session_id] = SimpleChatMemory(k=6)
        return _conversation_memories[session_id]

    def chat(
        self,
        question: str,
        collection_keys: list[str],
        session_id: int,
        resume_text: str = "",
        jd_text: str = "",
    ) -> tuple[str, list[str]]:
        context, sources = self.retrieve_context(collection_keys, question)

        text_parts = []
        if resume_text.strip():
            text_parts.append(f"[RESUME]\n{resume_text[:6000]}")
        if jd_text.strip():
            text_parts.append(f"[JOB DESCRIPTION]\n{jd_text[:4000]}")
        if context.strip():
            text_parts.append(f"[RETRIEVED CHUNKS]\n{context}")

        full_context = (
            "\n\n---\n\n".join(text_parts)
            if text_parts
            else "No resume or job description text available."
        )

        memory = self._get_memory(session_id)
        history = memory.get_history_string()

        prompt = RAG_QA_TEMPLATE.format(
            context=full_context,
            history=history or "None",
            question=question,
        )
        answer = gemini_service.generate(prompt)
        memory.add_user_message(question)
        memory.add_ai_message(answer)
        return answer, sources

    def analyze_ats(self, resume_text: str, jd_text: str = "") -> dict[str, Any]:
        from app.services.ats_engine import compute_ats_metrics

        return compute_ats_metrics(resume_text, jd_text)

    def analyze_match(self, resume_text: str, jd_text: str) -> dict[str, Any]:
        prompt = MATCH_TEMPLATE.format(resume=resume_text[:6000], jd=jd_text[:4000])
        return gemini_service.generate_json(prompt)

    def generate_interview_questions(
        self, resume_text: str, jd_text: str = "", count: int = 5
    ) -> dict[str, Any]:
        prompt = INTERVIEW_TEMPLATE.format(
            resume=resume_text[:6000], jd=jd_text[:4000] or "General role", count=count
        )
        return gemini_service.generate_json(prompt)

    def get_suggestions(self, resume_text: str, jd_text: str = "") -> dict[str, Any]:
        prompt = SUGGESTIONS_TEMPLATE.format(resume=resume_text[:6000], jd=jd_text[:4000] or "N/A")
        return gemini_service.generate_json(prompt)


rag_chain_service = RAGChainService()
