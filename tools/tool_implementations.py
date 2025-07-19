""" TOOL DEFINITIONS AND IMPLEMENTATIONS """

from db.embeddings.faiss_client import faiss_memory
from db.embeddings.utils import embed_text
import db.crud as crud
import services.card_service as card_service

""" Creates a card """
async def create_card(data: dict, completeness: float = 1.0):
    data["completeness"] = completeness
    card = await card_service.create_card(data)
    return f"Card created successfully with ID: {card.id}"

""" Searches for similar texts as the query in the DB """
async def search_memory(query: str, top_k: int = 5) -> str:
    query_embedding = embed_text(query)
    chunk_ids = faiss_memory.search(query_embedding, top_k=top_k)

    chunks = await crud.get_memory_chunks_by_ids(chunk_ids)

    if not chunks:
        return "No relevant memory found."

    return "\n\n".join([f"- {chunk['text']}" for chunk in chunks])

""" Searches specifically for cards in the DB """
async def search_cards(query: str, top_k: int = 5) -> str:
    query_embedding = embed_text(query)
    chunk_ids = faiss_memory.search(query_embedding, top_k=top_k)

    chunks = await crud.get_card_chunks_by_ids(chunk_ids)

    if not chunks:
        return "No similar cards found."

    return "\n\n".join([f"- {chunk['text']}" for chunk in chunks])

""" Searches for similar information in the same conversation """
async def search_conversation(query: str, id_conversation: str, top_k: int = 5) -> str:
    query_embedding = embed_text(query)
    chunk_ids = faiss_memory.search(query_embedding, top_k=top_k)

    chunks = await crud.get_chunks_by_conversation(chunk_ids, id_conversation)

    if not chunks:
        return "No similar information found in this conversation."

    return "\n\n".join([f"- {chunk['text']}" for chunk in chunks])


TOOLS_IMPL = {
    "create_card": create_card,
    "search_memory": search_memory,
    "search_cards": search_cards,
    "search_conversation": search_conversation
}

TOOL_ARGUMENT_INJECTIONS = {
    "create_card": ["data.chat_id", "data.user_id"],
    "search_conversation": ["id_conversation"],
}


async def call_tool(tool_name: str, arguments: dict) -> str:
    if not isinstance(arguments, dict):
        return f"Invalid arguments for {tool_name}: expected a dictionary."

    tool_fn = TOOLS_IMPL.get(tool_name)
    if not tool_fn:
        return f"Tool {tool_name} not found."

    return await tool_fn(**arguments)

def inject_tool_args(tool_name: str, args: dict, context: dict) -> dict:
    injections = TOOL_ARGUMENT_INJECTIONS.get(tool_name, [])

    for path in injections:
        keys = path.split(".")
        value = context.get(keys[-1])
        if value is None:
            continue  # O lanza error si es obligatorio

        d = args
        for k in keys[:-1]:
            d = d.setdefault(k, {})
        d[keys[-1]] = value

    return args


def list_available_tools():
    return list(TOOLS_IMPL.keys())
