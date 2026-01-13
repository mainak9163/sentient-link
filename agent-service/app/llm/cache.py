import hashlib
from redis import Redis
from app.queue.connection import get_redis

redis: Redis = get_redis()

CACHE_TTL = 60 * 60 * 24  # 24 hours


def _hash(prompt: str) -> str:
    return hashlib.sha256(prompt.encode()).hexdigest()


def get_cached_response(prompt: str) -> str | None:
    key = f"gemini:{_hash(prompt)}"
    value = redis.get(key)
    return value.decode() if value else None


def set_cached_response(prompt: str, response: str):
    key = f"gemini:{_hash(prompt)}"
    redis.setex(key, CACHE_TTL, response)

