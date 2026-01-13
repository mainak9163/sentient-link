from app.langgraph.state import AgentState
from app.vector.retrieve import retrieve_memories
from app.llm.prompt_builder import build_rag_prompt
from app.llm.service import run_gemini


def retrieve_node(state: AgentState) -> AgentState:
    base_prompt = f"""
Analyze this URL for intent, safety, and categorization.

URL: {state.original_url}
User intent: {state.user_intent}

Return:
- tags
- risk score (0 to 1)
- suggested short alias
"""

    memories = retrieve_memories(
        query_text=base_prompt,
        user_id=state.user_id,
        limit=5,
    )

    state.retrieved_memories = memories
    state.prompt = base_prompt
    return state


def generate_node(state: AgentState) -> AgentState:
    final_prompt = build_rag_prompt(
        base_prompt=state.prompt,
        memories=state.retrieved_memories,
    )

    result = run_gemini(final_prompt, deep=False)
    state.result = result
    return state
