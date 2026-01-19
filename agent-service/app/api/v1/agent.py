from fastapi import APIRouter, Depends
from app.schemas.agent_request import AgentRequest
from app.schemas.job import AgentJob
from app.queue.enqueue import enqueue_agent_job
from app.api.deps import verify_internal_api_key
from fastapi import HTTPException
from app.results.store import get_agent_result

router = APIRouter(
    prefix="/agent", tags=["agent"], dependencies=[Depends(verify_internal_api_key)]
)


@router.post("/analyze-link")
async def analyze_link(request: AgentRequest):
    """
    Enqueue link analysis job.
    """
    job = AgentJob(job_type="link_analysis", payload=request)

    rq_job = enqueue_agent_job(job)

    return {"status": "queued", "job_id": rq_job.id, "request_id": request.request_id}


@router.get("/result/{request_id}")
def get_result(request_id: str):
    result = get_agent_result(request_id)

    if not result:
        raise HTTPException(status_code=404, detail="Result not found")

    return result
