from langgraph.graph import StateGraph, END
from app.langgraph.state import AgentState
from app.langgraph.nodes import retrieve_node, generate_node


def build_agent_graph():
    graph = StateGraph(AgentState)

    graph.add_node("retrieve", retrieve_node)
    graph.add_node("generate", generate_node)

    graph.set_entry_point("retrieve")
    graph.add_edge("retrieve", "generate")
    graph.add_edge("generate", END)

    return graph.compile()
