from rq import Queue
from app.queue.connection import get_redis

def get_agent_queue() -> Queue:
    return Queue(
        name="agent-jobs",
        connection=get_redis(),
        default_timeout=600
    )
