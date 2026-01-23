from dotenv import load_dotenv
from pydantic import BaseModel
import os
from pathlib import Path

# ======================================
# Environment loading
# ======================================

# Force absolute path resolution for .env
# This avoids issues when running the service from different working directories
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BASE_DIR / ".env"

print(f"[CONFIG] Loading environment variables from: {ENV_PATH}")

# Load environment variables from the resolved .env file
load_dotenv(dotenv_path=ENV_PATH, override=True)
print("[CONFIG] Environment variables loaded")

# ======================================
# Settings definition
# ======================================


class Settings(BaseModel):
    """
    Centralized application configuration.

    Values are loaded from environment variables at startup
    and should be accessed via the `settings` singleton.
    """

    #: Application environment (development / staging / production)
    env: str = os.getenv("ENV", "development")

    #: Service name used for logging and identification
    service_name: str = os.getenv("SERVICE_NAME", "agent-service")

    #: Internal API key for service-to-service authentication
    internal_api_key: str | None = os.getenv("INTERNAL_API_KEY")

    #: API key for Gemini LLM service
    gemini_api_key: str | None = os.getenv("GEMINI_API_KEY")

    #: Redis connection URL
    redis_url: str | None = os.getenv("REDIS_URL")


print("[CONFIG] Initializing application settings...")
settings = Settings()
print(f"[CONFIG] Settings initialized for environment: {settings.env}")

# ======================================
# Fail-fast configuration validation
# ======================================

print("[CONFIG] Validating required configuration...")

# Fail fast if critical configuration is missing
if not settings.internal_api_key:
    print("[CONFIG][ERROR] INTERNAL_API_KEY is missing")
    raise RuntimeError("INTERNAL_API_KEY is not set or .env not loaded")

if not settings.redis_url:
    print("[CONFIG][ERROR] REDIS_URL is missing")
    raise RuntimeError("REDIS_URL is not set or .env not loaded")

print("[CONFIG][SUCCESS] Configuration validated successfully")
