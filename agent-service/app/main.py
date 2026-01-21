from fastapi import FastAPI
from app.core.config import settings
from app.api.v1.health import router as health_router
from app.api.v1.agent import router as agent_router
from app.vector.init_collection import ensure_collection

ensure_collection()  # Initialize Qdrant collection on startup

app = FastAPI(
    title="Agent Service",
    version="0.1.0",
)

app.include_router(health_router, prefix="/api/v1")
app.include_router(agent_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "service": settings.service_name,
        "env": settings.env,
        "status": "running",
    }
