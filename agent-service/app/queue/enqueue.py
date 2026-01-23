from rq.job import Job
from rq import Retry
from app.queue.queues import get_agent_queue
from app.schemas.job import AgentJob
from datetime import datetime
from app.results.store import save_agent_result
from app.results.models import AgentResult
from app.workers.tasks import process_agent_job


def enqueue_agent_job(job: AgentJob) -> Job:
    """
    Enqueue an agent job for asynchronous processing.

    This function:
    - Persists an initial AgentResult with status 'queued'
    - Enqueues the job into the agent RQ queue
    - Configures retry, timeout, and result TTL policies
    """

    print("[QUEUE] Acquiring agent job queue...")
    queue = get_agent_queue()
    print("[QUEUE] Agent queue acquired")

    # Persist initial job result state before execution
    print("[QUEUE] Saving initial agent result with status 'queued'...")
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
    print("[QUEUE][SUCCESS] Initial agent result saved")

    # Enqueue job for background processing
    print("[QUEUE] Enqueuing agent job for processing...")
    rq_job = queue.enqueue(
        process_agent_job,
        job.model_dump(),
        retry=Retry(max=3, interval=[10, 30, 60]),
        job_timeout=600,
        result_ttl=86400,
    )

    print(f"[QUEUE][SUCCESS] Job enqueued with ID: {rq_job.id}")

    return rq_job
