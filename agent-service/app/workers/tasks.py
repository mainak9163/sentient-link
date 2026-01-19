import json
from uuid import uuid4
from app.results.store import is_job_finished

from app.schemas.job import AgentJob
from app.schemas.memory import MemoryRecord
from app.schemas.agent_output import LinkAnalysisOutput

from app.llm.service import run_gemini
from app.llm.prompt_builder import build_rag_prompt

from app.vector.index import index_memory
from app.vector.retrieve import retrieve_memories

from app.results.store import update_status


def process_agent_job(job_data: dict):
    """
    Entry point for RQ worker.
    """
    job = AgentJob(**job_data)

    if job.job_type == "link_analysis":
        return analyze_link(job)

    return {"status": "unknown job type"}


def analyze_link(job: AgentJob):
    request_id = job.payload.request_id

    # 🛑 IDEMPOTENCY GUARD
    if is_job_finished(request_id):
        return {"status": "already_completed"}

    # ▶️ Worker picked job
    update_status(
        request_id=request_id,
        status="running",
    )

    try:
        # 2️⃣ Base prompt (STRICT JSON CONTRACT)
        base_prompt = f"""
You are an AI system that MUST return valid JSON.

Analyze the following URL for intent, safety, and categorization.

URL: {job.payload.original_url}
User intent: {job.payload.user_intent}

Respond ONLY in the following JSON format:

{{
  "tags": ["string"],
  "risk_score": 0.0,
  "suggested_alias": "string",
  "reasoning": "string"
}}

Rules:
- risk_score must be between 0 and 1
- suggested_alias must be URL-safe (lowercase, hyphens only)
- Do NOT include markdown
- Do NOT include explanations outside JSON
"""

        # 3️⃣ Retrieve relevant memories (RAG)
        memories = retrieve_memories(
            query_text=base_prompt,
            user_id=job.payload.user_id,
            limit=5,
        )

        # 4️⃣ Build RAG-augmented prompt
        rag_prompt = build_rag_prompt(base_prompt, memories)

        # 5️⃣ Gemini reasoning
        raw_output = run_gemini(rag_prompt, deep=False)

        # 6️⃣ Parse + validate AI output
        try:
            parsed_json = json.loads(raw_output)
            validated = LinkAnalysisOutput(**parsed_json)
        except Exception as e:
            raise ValueError(f"Invalid AI output format: {e}")

        # 7️⃣ Store memory (reasoning is best semantic signal)
        memory = MemoryRecord(
            memory_id=str(uuid4()),
            source="link_analysis",
            content=validated.reasoning,
            metadata={
                "tags": validated.tags,
                "risk_score": validated.risk_score,
                "suggested_alias": validated.suggested_alias,
                "user_id": job.payload.user_id,
                "link_id": job.payload.link_id,
                "request_id": request_id,
            },
        )
        index_memory(memory)

        # 8️⃣ Job completed successfully
        update_status(
            request_id=request_id,
            status="completed",
            result=validated.model_dump(),
        )

        return {"status": "completed"}

    except Exception as e:
        # 9️⃣ Job failed
        update_status(
            request_id=request_id,
            status="failed",
            result=str(e),
        )
        raise
