from app.langgraph.state import AgentState
from app.vector.retrieve import retrieve_memories
from app.llm.prompt_builder import build_rag_prompt
from app.llm.service import run_gemini
import json


def retrieve_node(state: AgentState) -> AgentState:
    """
    LangGraph node responsible for:
    - Building the base analysis prompt
    - Retrieving relevant memories from the vector store
    - Storing prompt and memories into the shared AgentState
    """

    print("[NODE:RETRIEVE] Entered retrieve_node")

    # Retrieve relevant memories using vector similarity search
    print("[NODE:RETRIEVE] Retrieving memories from vector store...")
    memories = retrieve_memories(
        query_text=state.prompt,
        user_id=state.user_id,
        limit=5,
    )

    print(f"[NODE:RETRIEVE] Retrieved {len(memories)} memories")

    # Update shared agent state
    state.retrieved_memories = memories
    state.prompt = state.prompt

    print("[NODE:RETRIEVE][SUCCESS] State updated with prompt and memories")

    return state


def generate_node(state: AgentState) -> AgentState:
    """
    LangGraph node responsible for:
    - Building a RAG-enhanced prompt
    - Invoking the Gemini LLM
    - Storing the final result into the shared AgentState
    """

    print("[NODE:GENERATE] Entered generate_node")

    # Build final prompt using retrieved memories
    print("[NODE:GENERATE] Building RAG prompt...")
    final_prompt = build_rag_prompt(
        base_prompt=state.prompt,
        memories=state.retrieved_memories,
    )

    print("[NODE:GENERATE] RAG prompt built successfully")

    # Invoke LLM to generate final output
    print("[NODE:GENERATE] Invoking Gemini LLM...")
    result = run_gemini(final_prompt, deep=False)

    print("[NODE:GENERATE] LLM response received")

    # Update shared agent state with result
    state.result = result

    print("[NODE:GENERATE][SUCCESS] State updated with final result")

    return state


def reflect_node(state: AgentState) -> AgentState:
    """
    Reflection node responsible for improving shortcode quality.

    It evaluates whether the suggested alias is:
    - human-friendly
    - intent-aligned
    - semantically meaningful

    If not, it refines it.
    """

    print("[NODE:REFLECT] Entered reflect_node")

    if not state.result:
        print("[NODE:REFLECT][WARN] No result found — skipping reflection")
        return state

    try:
        parsed = json.loads(state.result)
    except Exception:
        print("[NODE:REFLECT][ERROR] Result is not valid JSON — skipping reflection")
        return state

    original_alias = parsed.get("suggested_alias")
    print(f"[NODE:REFLECT] Original alias: {original_alias}")

    reflection_prompt = f"""
You are reviewing a generated shortcode for a shortened URL.

-----------------------------------
URL: {state.original_url}
User intent: {state.user_intent}

Current suggested alias:
"{original_alias}"

-----------------------------------
REFLECTION TASK
-----------------------------------

Evaluate whether this alias is:
- human-readable
- meaningful
- aligned with the user intent
- appropriate for the URL type

If the alias is GOOD, return it unchanged.
If it can be IMPROVED, suggest a better one.

-----------------------------------
OUTPUT FORMAT (JSON ONLY)
-----------------------------------

{{
  "suggested_alias": "string",
  "reasoning": "string"
}}

Rules:
- suggested_alias must be lowercase, URL-safe
- Return ONLY JSON
"""

    print("[NODE:REFLECT] Invoking LLM for reflection")
    reflection_output = run_gemini(reflection_prompt, deep=False)

    try:
        reflection = json.loads(reflection_output)
        improved_alias = reflection.get("suggested_alias", original_alias)

        parsed["suggested_alias"] = improved_alias
        parsed["reasoning"] = reflection.get("reasoning", parsed.get("reasoning"))

        state.result = json.dumps(parsed)
        print(f"[NODE:REFLECT][SUCCESS] Final alias: {improved_alias}")

    except Exception as e:
        print(f"[NODE:REFLECT][WARN] Reflection failed: {e}")

    return state
