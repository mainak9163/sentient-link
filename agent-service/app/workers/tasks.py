from uuid import uuid4

from app.schemas.job import AgentJob
from app.schemas.memory import MemoryRecord
from app.vector.index import index_memory

# =========================
# 🔹 LANGGRAPH IMPORTS
# =========================
from app.langgraph.graph import build_agent_graph
from app.langgraph.state import AgentState

# =========================
# 🔹 BUILD GRAPH ONCE
# =========================
agent_graph = build_agent_graph()


def process_agent_job(job_data: dict):
    job = AgentJob(**job_data)

    if job.job_type == "link_analysis":
        return analyze_link(job)

    return {"status": "unknown job type"}


def analyze_link(job: AgentJob):
    # =========================
    # 🔹 LANGGRAPH STATE
    # =========================
    state = AgentState(
        user_id=job.payload.user_id,
        link_id=job.payload.link_id,
        request_id=job.payload.request_id,
        original_url=job.payload.original_url,
        user_intent=job.payload.user_intent,
    )

    # =========================
    # 🔹 LANGGRAPH EXECUTION
    # =========================
    final_state = agent_graph.invoke(state)

    result = final_state.result

    print("[LANGGRAPH RESULT]")
    print(result)

    # =========================
    # 🔹 MEMORY PERSISTENCE
    # =========================
    memory = MemoryRecord(
        memory_id=str(uuid4()),
        source="link_analysis",
        content=result,
        metadata={
            "user_id": job.payload.user_id,
            "link_id": job.payload.link_id,
            "request_id": job.payload.request_id,
            "original_url": job.payload.original_url,
            "job_type": job.job_type,
        },
    )

    index_memory(memory)

    return {
        "status": "completed",
        "result": result,
    }
