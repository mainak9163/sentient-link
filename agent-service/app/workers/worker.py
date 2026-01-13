from rq import SimpleWorker
from app.queue.connection import get_redis

def start_worker():
    redis_conn = get_redis()
    worker = SimpleWorker(
        ["agent-jobs"],
        connection=redis_conn
    )
    worker.work(with_scheduler=True)

if __name__ == "__main__":
    start_worker()
