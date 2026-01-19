from pydantic import BaseModel, Field
from typing import List


class LinkAnalysisOutput(BaseModel):
    tags: List[str] = Field(..., description="Relevant content categories or topics")
    risk_score: float = Field(
        ..., ge=0.0, le=1.0, description="Risk score between 0 and 1"
    )
    suggested_alias: str = Field(..., description="Short URL alias suggestion")
    reasoning: str = Field(..., description="Brief explanation of the analysis")
