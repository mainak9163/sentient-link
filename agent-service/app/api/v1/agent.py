from fastapi import APIRouter, Depends, HTTPException
from app.schemas.agent_request import AgentRequest
from app.schemas.job import AgentJob
from app.queue.enqueue import enqueue_agent_job
from app.api.deps import verify_internal_api_key
from app.results.store import get_agent_result

# Router for internal agent operations
router = APIRouter(
    prefix="/agent",
    tags=["agent"],
    dependencies=[Depends(verify_internal_api_key)],
)


@router.post("/analyze-link")
async def analyze_link(request: AgentRequest):
    """
    Enqueue a link analysis agent job.

    This endpoint:
    - Validates the request payload
    - Wraps it into an AgentJob
    - Enqueues the job for asynchronous processing
    """

    print("[API] Received request to analyze link")
    print(f"[API] Request ID: {request.request_id}")

    # Create agent job
    job = AgentJob(job_type="link_analysis", payload=request)

    # Enqueue job for background processing
    rq_job = enqueue_agent_job(job)

    print(f"[API][SUCCESS] Job enqueued with job_id={rq_job.id}")

    return {
        "status": "queued",
        "job_id": rq_job.id,
        "request_id": request.request_id,
    }


@router.get("/result/{request_id}")
def get_result(request_id: str):
    """
    Retrieve the result of a previously submitted agent job.
    """

    print(f"[API] Fetching result for request_id={request_id}")

    result = get_agent_result(request_id)

    if not result:
        print("[API][WARN] Result not found")
        raise HTTPException(status_code=404, detail="Result not found")

    print("[API][SUCCESS] Result found and returned")
    return result
