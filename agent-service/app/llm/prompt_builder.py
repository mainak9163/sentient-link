from typing import List


def build_rag_prompt(
    base_prompt: str,
    memories: List[dict],
) -> str:
    """
    Build a Retrieval-Augmented Generation (RAG) prompt.

    If memories are provided, they are appended to the base prompt
    as contextual knowledge. If no memories exist, the base prompt
    is returned unchanged.
    """

    # If no memories were retrieved, return the base prompt as-is
    if not memories:
        print("[PROMPT] No memories provided — using base prompt only")
        return base_prompt

    print(f"[PROMPT] Building RAG prompt using {len(memories)} memories")

    # Initialize memory context block
    memory_block = ["\nYou have access to previous related knowledge:\n"]

    # Append each memory with structured formatting
    for i, mem in enumerate(memories, start=1):
        payload = mem["payload"]

        memory_block.append(
            f"""
Memory {i}:
Source: {payload.get('source')}
Created at: {payload.get('created_at')}
Metadata: {payload}
"""
        )

    # Instruction to guide model usage of retrieved knowledge
    memory_block.append("\nUse the above knowledge if relevant while answering.\n")

    print("[PROMPT][SUCCESS] RAG prompt constructed successfully")

    return base_prompt + "\n".join(memory_block)
