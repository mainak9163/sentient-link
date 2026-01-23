import json
from uuid import uuid4

from app.results.store import is_job_finished, update_status

from app.schemas.job import AgentJob
from app.schemas.memory import MemoryRecord
from app.schemas.agent_output import LinkAnalysisOutput

from app.langgraph.graph import build_agent_graph
from app.langgraph.state import AgentState

from app.vector.index import index_memory


def process_agent_job(job_data: dict):
    """
    Entry point for RQ worker.

    This function deserializes the job payload and routes execution
    based on the job type.
    """

    print("[WORKER] Received job for processing")

    job = AgentJob(**job_data)
    print(f"[WORKER] Job type: {job.job_type}")
    print(f"[WORKER] Request ID: {job.payload.request_id}")

    if job.job_type == "link_analysis":
        return analyze_link(job)

    print("[WORKER][WARN] Unknown job type received")
    return {"status": "unknown job type"}


def analyze_link(job: AgentJob):
    """
    Execute link analysis agent workflow using LangGraph.
    """

    request_id = job.payload.request_id
    print(f"[WORKER] Starting link analysis for request_id={request_id}")

    # 🛑 IDEMPOTENCY GUARD
    if is_job_finished(request_id):
        print("[WORKER] Job already completed — skipping execution")
        return {"status": "already_completed"}

    # ▶️ Worker picked job
    print("[WORKER] Marking job as running")
    update_status(
        request_id=request_id,
        status="running",
    )

    try:
        # 1️⃣ Build base prompt (STRICT JSON CONTRACT)
        print("[WORKER] Constructing base prompt")

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
IMPORTANT:
Return ONLY raw JSON.
DONT GIVE MARKDOWN YOU PIECE OF SHIT . DO NOT FCKINGGGGGGGGG GIVE MARKDOWN.
Do not include explanations.
Do not include backticks.
"""

        # 2️⃣ Initialize LangGraph
        print("[WORKER] Initializing LangGraph agent")
        graph = build_agent_graph()

        # 3️⃣ Create initial agent state
        state = AgentState(
            user_id=job.payload.user_id,
            link_id=job.payload.link_id,
            request_id=request_id,
            original_url=str(job.payload.original_url),
            user_intent=job.payload.user_intent or "",
            prompt=base_prompt,
        )

        # 4️⃣ Run LangGraph (retrieve → generate)
        print("[WORKER] Executing LangGraph")
        final_state = graph.invoke(state)

        raw_output = final_state["result"]
        print("========== RAW LLM OUTPUT START ==========")
        print(final_state)
        print(repr(raw_output))
        print("=========== RAW LLM OUTPUT END ===========")
        print("[WORKER] LangGraph execution completed")

        # 5️⃣ Parse + validate AI output
        print("[WORKER] Parsing and validating AI output")
        try:
            parsed_json = json.loads(raw_output)
            validated = LinkAnalysisOutput(**parsed_json)
        except Exception as e:
            print("[WORKER][ERROR] AI output validation failed")
            raise ValueError(f"Invalid AI output format: {e}")

        print("[WORKER] AI output validated successfully")

        # 6️⃣ Store memory (reasoning is best semantic signal)
        print("[WORKER] Indexing reasoning as memory")
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

        # 7️⃣ Job completed successfully
        print("[WORKER] Marking job as completed")
        update_status(
            request_id=request_id,
            status="completed",
            result=validated.model_dump(),
        )

        print("[WORKER][SUCCESS] Link analysis completed successfully")
        return {"status": "completed"}

    except Exception as e:
        # 8️⃣ Job failed
        print(f"[WORKER][ERROR] Job failed: {e}")
        update_status(
            request_id=request_id,
            status="failed",
            result=str(e),
        )
        raise
