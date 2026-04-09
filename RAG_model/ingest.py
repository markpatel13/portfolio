"""
ingest.py — One-time script to chunk, embed, and upsert CV knowledge base into Pinecone.

Run once (or whenever cv_knowledge_base.txt changes):
    python ingest.py
"""

import os
import time
import hashlib
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone, ServerlessSpec

load_dotenv()

# ── Config ──────────────────────────────────────────────────────────────────
PINECONE_API_KEY  = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX    = os.getenv("PINECONE_INDEX", "mark-cv-rag")
PINECONE_REGION   = os.getenv("PINECONE_REGION", "us-east-1")   # free-tier region
EMBED_MODEL       = "all-MiniLM-L6-v2"   # 384-dim, matches your LegalAI pipeline
CHUNK_SIZE        = 500   # characters
CHUNK_OVERLAP     = 100
CV_FILE           = "cv_knowledge_base.txt"
# ────────────────────────────────────────────────────────────────────────────


def load_text(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def chunk_text(text: str, size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """Split text into overlapping character-level chunks."""
    chunks, start = [], 0
    while start < len(text):
        end = min(start + size, len(text))
        chunks.append(text[start:end].strip())
        start += size - overlap
    return [c for c in chunks if c]


def make_id(chunk: str, idx: int) -> str:
    """Deterministic ID so re-ingesting doesn't duplicate vectors."""
    return hashlib.md5(f"{idx}:{chunk[:80]}".encode()).hexdigest()


def main():
    print("⏳  Loading CV knowledge base…")
    text = load_text(CV_FILE)
    chunks = chunk_text(text)
    print(f"✅  {len(chunks)} chunks created from {len(text)} characters.")

    print("⏳  Loading embedding model…")
    model = SentenceTransformer(EMBED_MODEL)
    embeddings = model.encode(chunks, show_progress_bar=True, convert_to_list=True)
    print(f"✅  Embeddings generated — dim={len(embeddings[0])}")

    print("⏳  Connecting to Pinecone…")
    pc = Pinecone(api_key=PINECONE_API_KEY)

    existing = [i.name for i in pc.list_indexes()]
    if PINECONE_INDEX not in existing:
        print(f"🆕  Creating index '{PINECONE_INDEX}'…")
        pc.create_index(
            name=PINECONE_INDEX,
            dimension=len(embeddings[0]),
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region=PINECONE_REGION),
        )
        # Wait for index to be ready
        while not pc.describe_index(PINECONE_INDEX).status["ready"]:
            time.sleep(1)
        print("✅  Index ready.")
    else:
        print(f"✅  Index '{PINECONE_INDEX}' already exists.")

    index = pc.Index(PINECONE_INDEX)

    # Build vectors with metadata
    vectors = [
        {
            "id":       make_id(chunk, i),
            "values":   embeddings[i],
            "metadata": {"text": chunk, "chunk_index": i},
        }
        for i, chunk in enumerate(chunks)
    ]

    # Upsert in batches of 100
    batch_size = 100
    for start in range(0, len(vectors), batch_size):
        batch = vectors[start : start + batch_size]
        index.upsert(vectors=batch)
        print(f"  Upserted batch {start // batch_size + 1} / {-(-len(vectors)//batch_size)}")

    print(f"\n🎉  Done! {len(vectors)} vectors upserted to '{PINECONE_INDEX}'.")


if __name__ == "__main__":
    main()