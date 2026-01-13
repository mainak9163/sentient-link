from rq.job import Job
from rq import Retry
from app.queue.queues import get_agent_queue
from app.schemas.job import AgentJob

def enqueue_agent_job(job: AgentJob) -> Job:
    queue = get_agent_queue()

    return queue.enqueue(
        "app.workers.tasks.process_agent_job",
        job.dict(),
        retry=Retry(max=3, interval=[10, 30, 60]),
        job_timeout=600,
        result_ttl=86400,
    )
