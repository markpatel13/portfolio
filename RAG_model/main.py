"""
main.py — FastAPI RAG server for Mark's portfolio chatbot.

Start with:
    uvicorn main:app --reload --port 8000
"""

import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
from groq import Groq

load_dotenv()

# ── Config ──────────────────────────────────────────────────────────────────
PINECONE_API_KEY  = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX    = os.getenv("PINECONE_INDEX", "mark-cv-rag")
GROQ_API_KEY      = os.getenv("GROQ_API_KEY")
EMBED_MODEL       = "all-MiniLM-L6-v2"
GROQ_MODEL        = "llama-3.1-8b-instant"   # fast + high quality on Groq free tier
TOP_K             = 5
# ────────────────────────────────────────────────────────────────────────────

# ── Initialise clients (once at startup) ────────────────────────────────────
# print("⏳  Loading embedding model…")
# embedder = SentenceTransformer(EMBED_MODEL)

# print("⏳  Connecting to Pinecone…")
# pc    = Pinecone(api_key=PINECONE_API_KEY)
# index = pc.Index(PINECONE_INDEX)

# groq_client = Groq(api_key=GROQ_API_KEY)
# print("✅  All clients ready.")
# # ────────────────────────────────────────────────────────────────────────────
# Global variables (initialize to None)
embedder = None
index = None
groq_client = None

@app.on_event("startup")
async def startup_event():
    """Load models after app starts."""
    global embedder, index, groq_client
    print("⏳  Loading embedding model…")
    from sentence_transformers import SentenceTransformer
    embedder = SentenceTransformer(EMBED_MODEL)
    
    print("⏳  Connecting to Pinecone…")
    from pinecone import Pinecone
    pc = Pinecone(api_key=PINECONE_API_KEY)
    index = pc.Index(PINECONE_INDEX)
    
    print("⏳  Connecting to Groq…")
    from groq import Groq
    groq_client = Groq(api_key=GROQ_API_KEY)
    print("✅  All clients ready.")


app = FastAPI(title="Mark's Portfolio RAG API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten to your Vercel/Netlify domain in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Schemas ──────────────────────────────────────────────────────────────────
class ChatMessage(BaseModel):
    role: str      # "user" | "assistant"
    content: str


class QueryRequest(BaseModel):
    question: str
    chat_history: list[ChatMessage] = []
# ────────────────────────────────────────────────────────────────────────────


SYSTEM_PROMPT = """You are an AI assistant embedded in Mark Patel's personal portfolio website.
Your job is to answer visitors' questions about Mark — his skills, projects, education, experience, and background — in a friendly, concise, and helpful way.

Rules:
- Only answer based on the retrieved context below. If a question is outside that scope, politely say you don't have that information.
- Keep answers brief and conversational unless the visitor asks for detail.
- Never fabricate information about Mark.
- Refer to Mark in the third person (e.g. "Mark has built…", "He has experience with…").
- Do not reveal that you are powered by Groq, Pinecone, or any specific technology unless directly asked.
"""


def retrieve_context(question: str) -> str:
    """Embed question → query Pinecone → return joined context chunks."""
    query_vec = embedder.encode(question).tolist()
    results = index.query(vector=query_vec, top_k=TOP_K, include_metadata=True)
    chunks = [match["metadata"]["text"] for match in results["matches"] if match.get("metadata")]
    return "\n\n---\n\n".join(chunks)


def build_messages(question: str, context: str, chat_history: list[ChatMessage]) -> list[dict]:
    """Assemble the full messages list for Groq."""
    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT + f"\n\n=== RETRIEVED CONTEXT ===\n{context}\n=== END CONTEXT ===",
        }
    ]
    # Include prior turns (last 6 exchanges to stay within context limits)
    for msg in chat_history[-12:]:
        messages.append({"role": msg.role, "content": msg.content})

    messages.append({"role": "user", "content": question})
    return messages


# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
def health():
    return {"status": "ok", "message": "Mark's RAG API is running 🚀"}


@app.post("/query")
async def query(req: QueryRequest):
    """
    Main endpoint consumed by AskAboutMe.jsx.
    Streams the Groq LLM response token-by-token.
    """
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    context  = retrieve_context(req.question)
    messages = build_messages(req.question, context, req.chat_history)

    def token_stream():
        stream = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            max_tokens=1024,
            temperature=0.4,
            stream=True,  # ← standard streaming flag
        )
        for chunk in stream:
            text = chunk.choices[0].delta.content
            if text:
                yield text

    return StreamingResponse(token_stream(), media_type="text/plain")


@app.post("/query/full")
async def query_full(req: QueryRequest):
    """
    Non-streaming variant — returns the complete answer as JSON.
    Useful for testing or server-side rendering.
    """
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    context  = retrieve_context(req.question)
    messages = build_messages(req.question, context, req.chat_history)

    response = groq_client.chat.completions.create(
        model=GROQ_MODEL,
        messages=messages,
        max_tokens=1024,
        temperature=0.4,
    )
    answer = response.choices[0].message.content
    return {"answer": answer, "context_used": context}