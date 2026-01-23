from pydantic import BaseModel, Field
from typing import List


class LinkAnalysisOutput(BaseModel):
    """
    Structured output produced by the agent for link analysis tasks.

    This model defines the exact shape of the agent's analysis result
    and is used to validate and consume LLM-generated output.
    """

    #: Relevant content categories or topics identified in the link
    tags: List[str] = Field(..., description="Relevant content categories or topics")

    #: Risk score between 0.0 (low risk) and 1.0 (high risk)
    risk_score: float = Field(
        ..., ge=0.0, le=1.0, description="Risk score between 0 and 1"
    )

    #: Suggested short alias for the analyzed URL
    suggested_alias: str = Field(..., description="Short URL alias suggestion")

    #: Brief explanation justifying the analysis and scores
    reasoning: str = Field(..., description="Brief explanation of the analysis")
