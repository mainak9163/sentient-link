from typing import List


def build_rag_prompt(
    base_prompt: str,
    memories: List[dict],
) -> str:
    if not memories:
        return base_prompt

    memory_block = ["\nYou have access to previous related knowledge:\n"]

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

    memory_block.append("\nUse the above knowledge if relevant while answering.\n")

    return base_prompt + "\n".join(memory_block)
