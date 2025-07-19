from sentence_transformers import SentenceTransformer
import textwrap

MODEL = SentenceTransformer("all-MiniLM-L6-v2")

def split_text(text: str, max_length: int = 300) -> list[str]:
    return textwrap.wrap(text, width=max_length)

def embed_text(text: str) -> list[float]:
    return MODEL.encode(text).tolist()
