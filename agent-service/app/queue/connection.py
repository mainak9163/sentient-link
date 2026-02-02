import ssl
from redis import Redis, ConnectionPool
from redis.retry import Retry
from redis.backoff import ExponentialBackoff
from app.core.config import settings


# Create a connection pool for reuse across the application
_redis_pool: ConnectionPool | None = None


def get_redis() -> Redis:
    """
    Create and return a Redis client using the configured Redis URL.

    This function centralizes Redis connection logic so that
    all consumers use a consistent configuration.

    For Upstash/Redis Cloud, we configure:
    - SSL/TLS with relaxed certificate verification
    - Connection pooling for efficiency
    - Automatic retry with exponential backoff
    - Socket timeouts for network resilience
    """
    global _redis_pool

    print("[REDIS] Creating Redis client connection...")

    if _redis_pool is None:
        print("[REDIS] Initializing Redis connection pool...")

        # Configure retry mechanism with exponential backoff
        # ExponentialBackoff takes (cap, base) where cap is max backoff time
        retry = Retry(ExponentialBackoff(cap=5, base=3), retries=3)

        # Configure SSL for Upstash (rediss:// URLs)
        # Upstash uses self-signed certs, so we skip verification in development
        # In production, you should use ssl_cert_reqs=ssl.CERT_REQUIRED with proper certs
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE

        # Create connection pool with cloud-friendly settings
        _redis_pool = ConnectionPool.from_url(
            settings.redis_url,
            decode_responses=False,
            ssl_cert_reqs=None,  # Upstash compatibility
            socket_timeout=10,  # Connection timeout
            socket_connect_timeout=5,  # Initial connection timeout
            socket_keepalive=True,
            health_check_interval=30,  # Check connection health periodically
            retry_on_timeout=True,
            retry=retry,
        )
        print("[REDIS][SUCCESS] Redis connection pool initialized")

    # Return a new Redis client using the shared pool
    return Redis(connection_pool=_redis_pool)
