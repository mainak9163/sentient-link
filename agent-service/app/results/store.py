import json
from datetime import datetime
from redis import Redis
from app.queue.connection import get_redis
from app.results.models import AgentResult

# Initialize Redis client for result storage
redis: Redis = get_redis()

# Redis key prefix for agent results
KEY_PREFIX = "agent:result:"


def _key(request_id: str) -> str:
    """
    Build the Redis key for a given request ID.
    """
    return f"{KEY_PREFIX}{request_id}"


def save_agent_result(result: AgentResult):
    """
    Persist an AgentResult to Redis.

    The result is serialized to JSON and stored using the request_id
    as the unique key.
    """

    print(f"[RESULTS] Saving agent result for request_id={result.request_id}")

    redis.set(
        _key(result.request_id),
        json.dumps(result.model_dump(), default=str),
    )

    print("[RESULTS][SUCCESS] Agent result saved")


def get_agent_result(request_id: str) -> AgentResult | None:
    """
    Retrieve an AgentResult from Redis by request ID.

    Returns:
    - AgentResult if found
    - None if no result exists
    """

    print(f"[RESULTS] Fetching agent result for request_id={request_id}")

    raw = redis.get(_key(request_id))
    if not raw:
        print("[RESULTS][MISS] No agent result found")
        return None

    print("[RESULTS][HIT] Agent result retrieved")
    return AgentResult(**json.loads(raw))


def update_status(
    request_id: str,
    status: str,
    result: dict | str | None = None,
):
    """
    Update the status (and optionally the result payload) of an existing agent job.
    """

    print(f"[RESULTS] Updating status for request_id={request_id} → {status}")

    existing = get_agent_result(request_id)
    if not existing:
        print("[RESULTS][WARN] Cannot update status — result does not exist")
        return

    # Create a new AgentResult instance with updated status/result
    updated = AgentResult(
        request_id=existing.request_id,
        job_type=existing.job_type,
        user_id=existing.user_id,
        link_id=existing.link_id,
        status=status,
        result=result if result is not None else existing.result,
        created_at=existing.created_at,
    )

    save_agent_result(updated)

    print("[RESULTS][SUCCESS] Agent result status updated")


def is_job_finished(request_id: str) -> bool:
    """
    Check whether an agent job has completed successfully.
    """

    print(f"[RESULTS] Checking completion status for request_id={request_id}")

    result = get_agent_result(request_id)
    finished = bool(result and result.status == "completed")

    print(f"[RESULTS] Job finished: {finished}")

    return finished
