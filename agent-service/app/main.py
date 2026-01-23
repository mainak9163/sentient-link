from fastapi import FastAPI
from app.core.config import settings
from app.api.v1.health import router as health_router
from app.api.v1.agent import router as agent_router
from app.vector.init_collection import ensure_collection

# ======================================
# Application startup initialization
# ======================================

print("[APP] Starting Agent Service...")
print(f"[APP] Environment: {settings.env}")

# Ensure Qdrant collection exists before handling requests
print("[APP] Initializing vector database...")
ensure_collection()
print("[APP] Vector database initialization complete")

# ======================================
# FastAPI application setup
# ======================================

app = FastAPI(
    title="Agent Service",
    version="0.1.0",
)

print("[APP] FastAPI application created")

# Register API routers
app.include_router(health_router, prefix="/api/v1")
print("[APP] Health router registered")

app.include_router(agent_router, prefix="/api/v1")
print("[APP] Agent router registered")

# ======================================
# Root endpoint
# ======================================


@app.get("/")
async def root():
    """
    Root endpoint providing basic service information.
    """

    return {
        "service": settings.service_name,
        "env": settings.env,
        "status": "running",
    }
