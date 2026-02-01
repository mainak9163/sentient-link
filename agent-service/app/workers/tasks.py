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
You are an AI system responsible for generating HIGH-QUALITY, HUMAN-FRIENDLY
shortcodes for shortened URLs.

Your goal is NOT to generate random strings.
Your goal is to perform semantic compression.

-----------------------------------
INPUT
-----------------------------------
URL: {job.payload.original_url}
User intent: {job.payload.user_intent}

-----------------------------------
UNDERSTANDING URL CLASSES
-----------------------------------

URLs generally fall into one of these categories:

1. Personal / Portfolio Websites
   - Purpose: identity, credibility, professional sharing
   - Good aliases: names, identity-based, readable
   - Examples: john, johnfolio, gulll, dev-john

2. Product / Marketing Pages
   - Purpose: promotion, campaigns, offers
   - Good aliases: sale, launch, offer, summer24

3. Documents / Resources
   - Purpose: access, reference
   - Good aliases: resume, proposal, notes, spec

4. Meetings / Events
   - Purpose: quick access, action-oriented
   - Good aliases: meet, demo, call, standup

5. Technical / API / Webhooks
   - Purpose: system clarity
   - Good aliases: webhook, callback, auth, status

6. Social / Media Content
   - Purpose: content sharing
   - Good aliases: yt-demo, tweet, post, clip

-----------------------------------
SHORTCODE PRINCIPLES (CRITICAL)
-----------------------------------

A good shortcode:
- is human-readable
- is pronounceable
- aligns with user intent
- gives an immediate hint of what the link is
- feels intentional, not generated

A bad shortcode:
- looks random (x9f2, a1b2)
- encodes IDs or hashes
- ignores user intent
- requires explanation

-----------------------------------
USER INTENT MATTERS
-----------------------------------

The SAME URL can have different ideal aliases depending on intent:

- "share professionally" → clean, identity-based
- "marketing campaign" → catchy, promotional
- "internal testing" → technical, descriptive
- "temporary use" → short, disposable

Always adapt the alias to the intent.

-----------------------------------
OUTPUT REQUIREMENTS
-----------------------------------

You MUST return valid JSON only.
Do NOT include markdown.
Do NOT include explanations outside JSON.

Return EXACTLY this format:

{{
  "tags": ["string"],
  "risk_score": 0.0,
  "suggested_alias": "string",
  "reasoning": "string"
}}

Rules:
- risk_score must be between 0 and 1
- suggested_alias must be lowercase, URL-safe, hyphens only
- reasoning should briefly justify the alias choice
- The response MUST start with {{ and end with }}

IMPORTANT:
Return ONLY raw JSON. Nothing else.
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
