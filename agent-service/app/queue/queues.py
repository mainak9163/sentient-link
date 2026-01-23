from rq import Queue
from app.queue.connection import get_redis


def get_agent_queue() -> Queue:
    """
    Create and return the RQ queue used for agent background jobs.

    This queue is backed by Redis and is configured with
    a default execution timeout.
    """

    print("[QUEUE] Initializing agent job queue...")

    return Queue(name="agent-jobs", connection=get_redis(), default_timeout=600)
