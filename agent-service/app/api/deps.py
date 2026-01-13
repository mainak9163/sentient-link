from fastapi import Header, HTTPException
from app.core.config import settings

async def verify_internal_api_key(x_api_key: str = Header(None)):
    print("[DEBUG] Received X-API-KEY:", repr(x_api_key))
    print("[DEBUG] Expected API KEY:", repr(settings.internal_api_key))

    if not x_api_key or x_api_key != settings.internal_api_key:
        raise HTTPException(status_code=401, detail="Unauthorized")
