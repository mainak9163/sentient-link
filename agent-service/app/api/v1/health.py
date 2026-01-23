from fastapi import APIRouter

# Router for health and liveness checks
router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check():
    """
    Health check endpoint.

    Used by load balancers, orchestration systems,
    and monitoring tools to verify service availability.
    """

    print("[HEALTH] Health check requested")

    return {"status": "ok"}
