from fastapi import Header, HTTPException
from app.core.config import settings


async def verify_internal_api_key(x_api_key: str | None = Header(default=None)):
    """
    FastAPI dependency to verify internal service-to-service API access.

    This function:
    - Extracts the `X-API-KEY` header from the incoming request
    - Compares it with the expected internal API key from configuration
    - Raises a 401 Unauthorized error if validation fails

    Intended usage:
    - Protect internal-only routes
    - Prevent unauthorized access between services
    """

    print("[AUTH] Verifying internal API key...")

    # Log presence of header without exposing sensitive data
    if x_api_key:
        print("[AUTH] X-API-KEY header received")
    else:
        print("[AUTH][WARN] X-API-KEY header missing")

    # Validate API key
    if not x_api_key or x_api_key != settings.internal_api_key:
        print("[AUTH][ERROR] Invalid or unauthorized API key access attempt")
        raise HTTPException(status_code=401, detail="Unauthorized")

    print("[AUTH][SUCCESS] Internal API key validated successfully")
