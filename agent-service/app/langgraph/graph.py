from langgraph.graph import StateGraph, END
from app.langgraph.state import AgentState
from app.langgraph.nodes import retrieve_node, generate_node


def build_agent_graph():
    """
    Builds and compiles the LangGraph agent workflow.

    Graph flow:
        retrieve_node → generate_node → END

    - AgentState is the shared state passed between nodes
    """

    print("[GRAPH] Initializing agent state graph...")

    # Create a new state graph using AgentState as the shared state schema
    graph = StateGraph(AgentState)
    print("[GRAPH] StateGraph created with AgentState")

    # Register graph nodes
    print("[GRAPH] Registering nodes...")
    graph.add_node("retrieve", retrieve_node)
    print("[GRAPH] Node registered: retrieve")

    graph.add_node("generate", generate_node)
    print("[GRAPH] Node registered: generate")

    # Define graph execution flow
    print("[GRAPH] Defining graph execution flow...")
    graph.set_entry_point("retrieve")
    print("[GRAPH] Entry point set to: retrieve")

    graph.add_edge("retrieve", "generate")
    print("[GRAPH] Edge added: retrieve → generate")

    graph.add_edge("generate", END)
    print("[GRAPH] Edge added: generate → END")

    # Compile the graph into an executable workflow
    print("[GRAPH] Compiling agent graph...")
    compiled_graph = graph.compile()

    print("[GRAPH][SUCCESS] Agent graph compiled successfully")

    return compiled_graph
