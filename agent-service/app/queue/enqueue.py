from rq.job import Job
from rq import Retry
from app.queue.queues import get_agent_queue
from app.schemas.job import AgentJob
from datetime import datetime
from app.results.store import save_agent_result
from app.results.models import AgentResult
from app.workers.tasks import process_agent_job


def enqueue_agent_job(job: AgentJob) -> Job:
    queue = get_agent_queue()

    save_agent_result(
        AgentResult(
            request_id=job.payload.request_id,
            job_type=job.job_type,
            user_id=job.payload.user_id,
            link_id=job.payload.link_id,
            status="queued",
            result=None,
            created_at=datetime.utcnow(),
        )
    )

    return queue.enqueue(
        process_agent_job,
        job.model_dump(),
        retry=Retry(max=3, interval=[10, 30, 60]),
        job_timeout=600,
        result_ttl=86400,
    )
