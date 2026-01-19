import json
from datetime import datetime
from redis import Redis
from app.queue.connection import get_redis
from app.results.models import AgentResult

redis: Redis = get_redis()
KEY_PREFIX = "agent:result:"


def _key(request_id: str) -> str:
    return f"{KEY_PREFIX}{request_id}"


def save_agent_result(result: AgentResult):
    redis.set(
        _key(result.request_id),
        json.dumps(result.model_dump(), default=str),
    )


def get_agent_result(request_id: str) -> AgentResult | None:
    raw = redis.get(_key(request_id))
    if not raw:
        return None
    return AgentResult(**json.loads(raw))


def update_status(
    request_id: str,
    status: str,
    result: dict | str | None = None,
):
    existing = get_agent_result(request_id)
    if not existing:
        return

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


def is_job_finished(request_id: str) -> bool:
    result = get_agent_result(request_id)
    return bool(result and result.status == "completed")
