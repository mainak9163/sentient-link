from dotenv import load_dotenv
from pydantic import BaseModel
import os
from pathlib import Path

#  FORCE absolute path to .env
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH, override=True)


class Settings(BaseModel):
    env: str = os.getenv("ENV", "development")
    service_name: str = os.getenv("SERVICE_NAME", "agent-service")
    internal_api_key: str | None = os.getenv("INTERNAL_API_KEY")
    gemini_api_key: str | None = os.getenv("GEMINI_API_KEY")
    redis_url: str | None = os.getenv("REDIS_URL")


settings = Settings()

#  FAIL FAST IF MISCONFIGURED
if not settings.internal_api_key:
    raise RuntimeError("INTERNAL_API_KEY is not set or .env not loaded")

if not settings.redis_url:
    raise RuntimeError("REDIS_URL is not set or .env not loaded")
