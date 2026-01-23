from redis import Redis
from app.core.config import settings


def get_redis() -> Redis:
    """
    Create and return a Redis client using the configured Redis URL.

    This function centralizes Redis connection logic so that
    all consumers use a consistent configuration.
    """

    print("[REDIS] Creating Redis client connection...")
    return Redis.from_url(settings.redis_url, decode_responses=False)
