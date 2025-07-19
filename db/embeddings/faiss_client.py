from datetime import datetime
import faiss
import numpy as np
from db.embeddings.utils import split_text, embed_text
import db.crud as crud

class FaissMemory:
    def __init__(self, dim=384):
        self.index = faiss.IndexFlatL2(dim)
        self.id_map = {}

    def add(self, chunk_id: str, embedding: list[float]):
        idx = len(self.id_map)
        self.id_map[idx] = chunk_id
        self.index.add(np.array([embedding]).astype("float32"))

    def search(self, query_embedding: list[float], top_k=5):
        D, I = self.index.search(np.array([query_embedding]).astype("float32"), top_k)
        return [self.id_map[i] for i in I[0] if i in self.id_map]

faiss_memory = FaissMemory()

async def load_embeddings():
    memory_chunks = await crud.load_embeddings()
    for chunk in memory_chunks:
        faiss_memory.add(
            chunk_id=chunk["_id"],
            embedding=chunk["embedding"]
        )

async def chunk_and_store(text: str, user_id: str, conversation_id: str = None, card_id: str = None):
    chunks = split_text(text)
    for i, chunk in enumerate(chunks):
        emb = embed_text(chunk)
        chunk_id = f"{user_id}_{conversation_id}_{i}"
        faiss_memory.add(chunk_id, emb)

        # save chunk in db
        await crud.save_chunk({
            "_id": chunk_id,
            "user_id": user_id,
            "conversation_id": conversation_id,
            "card_id": card_id,
            "text": chunk,
            "embedding": emb,
            "metadata": {
                "created_at": datetime.utcnow(),
                "source": "card" if card_id else "conversation"
            },
        })