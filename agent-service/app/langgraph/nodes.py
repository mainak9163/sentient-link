from app.langgraph.state import AgentState
from app.vector.retrieve import retrieve_memories
from app.llm.prompt_builder import build_rag_prompt
from app.llm.service import run_gemini


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
