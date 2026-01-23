import hashlib
from redis import Redis
from app.queue.connection import get_redis

# Initialize Redis connection (shared client)
redis: Redis = get_redis()

# Time-to-live for cached LLM responses (24 hours)
CACHE_TTL = 60 * 60 * 24  # 24 hours


def _hash(prompt: str) -> str:
    """
    Generate a deterministic SHA-256 hash for a given prompt.

    This ensures:
    - Consistent cache keys for identical prompts
    - No raw prompt content stored in Redis keys
    """
    return hashlib.sha256(prompt.encode()).hexdigest()


def get_cached_response(prompt: str) -> str | None:
    """
    Retrieve a cached LLM response for the given prompt, if available.

    Returns:
    - Cached response string if found
    - None if cache miss
    """

    key = f"gemini:{_hash(prompt)}"
    print(f"[CACHE] Looking up cache for key: {key}")

    value = redis.get(key)

    if value:
        print("[CACHE][HIT] Cached response found")
        return value.decode()

    print("[CACHE][MISS] No cached response found")
    return None


def set_cached_response(prompt: str, response: str):
    """
    Store an LLM response in cache with a fixed TTL.
    """

    key = f"gemini:{_hash(prompt)}"
    print(f"[CACHE] Caching response with key: {key} (TTL={CACHE_TTL}s)")

    redis.setex(key, CACHE_TTL, response)

    print("[CACHE][SUCCESS] Response cached successfully")
