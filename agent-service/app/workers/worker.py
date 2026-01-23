from rq import SimpleWorker
from app.queue.connection import get_redis


def start_worker():
    """
    Start an RQ worker to process agent jobs.

    This worker listens to the 'agent-jobs' queue and executes
    background tasks using the SimpleWorker runtime.
    """

    print("[WORKER] Starting RQ worker process...")

    # Initialize Redis connection
    redis_conn = get_redis()
    print("[WORKER] Connected to Redis")

    # Initialize worker for the agent-jobs queue
    worker = SimpleWorker(["agent-jobs"], connection=redis_conn)

    print("[WORKER] Listening on queue: agent-jobs")

    # Start processing jobs
    worker.work(with_scheduler=True)


if __name__ == "__main__":
    start_worker()
