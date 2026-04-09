# 🌐 Mark Patel — Personal Portfolio

A modern, AI-powered personal portfolio website built with React and a custom RAG (Retrieval-Augmented Generation) chatbot backend — letting visitors ask real questions about my skills, projects, and experience.

---

## ✨ Features

- **AI Chatbot** — RAG pipeline powered by HuggingFace embeddings, Pinecone vector DB, and Groq LLM
- **Streaming Responses** — Token-by-token response streaming from the FastAPI backend
- **Animated UI** — GSAP scroll animations and smooth transitions throughout
- **Project Showcase** — Interactive showcase of all major projects
- **Tech Stack Section** — Visual display of tools and technologies
- **Contact Section** — Integrated with n8n workflow automation
- **Fully Responsive** — Mobile-first design with Tailwind CSS

---

## 🧠 RAG Chatbot Architecture

```
Visitor Question
      │
      ▼
AskAboutMe.jsx  ──HTTP──▶  FastAPI /query
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
          Embed with                  Pinecone Query
        all-MiniLM-L6-v2             (top 5 chunks)
                    └───────────┬───────────┘
                                ▼
                         Groq LLM Inference
                      (llama-3.3-70b-versatile)
                                │
                                ▼
                     Streamed response back
                        to the frontend
```

---

## 🗂️ Project Structure

```
Portfolio/
├── public/
├── src/
│   ├── components/
│   │   ├── HeroModels/
│   │   ├── Models/
│   │   └── sections/
│   │       ├── AskAboutMe.jsx      # RAG chatbot UI
│   │       ├── Contact.jsx
│   │       ├── ExperienceSection.jsx
│   │       ├── FeatureCards.jsx
│   │       ├── Hero.jsx
│   │       ├── LogoSection.jsx
│   │       ├── ShowcaseSection.jsx
│   │       └── TechStack.jsx
│   ├── constants/
│   │   └── index.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── RAG_model/
│   ├── cv_knowledge_base.txt       # CV data used for embeddings
│   ├── ingest.py                   # One-time ingestion script
│   ├── main.py                     # FastAPI server
│   └── requirements.txt
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework and build tool |
| Tailwind CSS | Styling |
| GSAP | Scroll animations |
| Three.js | 3D hero models |

### RAG Backend
| Technology | Purpose |
|---|---|
| FastAPI | API server with streaming |
| Sentence Transformers | `all-MiniLM-L6-v2` embeddings (384-dim) |
| Pinecone | Vector database |
| Groq | LLM inference (`llama-3.3-70b-versatile`) |
| Python-dotenv | Environment variable management |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Pinecone account (free tier)
- Groq API key (free)

---

### 1. Clone the repository

```bash
git clone https://github.com/markpatel13/portfolio.git
cd portfolio
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Set up the RAG backend

```bash
cd RAG_model

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file inside `RAG_model/`:

```env
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=mark-cv-rag
PINECONE_REGION=us-east-1
GROQ_API_KEY=your_groq_api_key
```

| Key | Where to get it |
|---|---|
| `PINECONE_API_KEY` | [app.pinecone.io](https://app.pinecone.io) → API Keys |
| `GROQ_API_KEY` | [console.groq.com/keys](https://console.groq.com/keys) |

### 5. Ingest CV data into Pinecone (run once)

```bash
python ingest.py
```

This will chunk `cv_knowledge_base.txt`, generate 384-dim embeddings, and upsert them into your Pinecone index.

### 6. Start the RAG server

```bash
uvicorn main:app --reload --port 8000
```

Server will be live at `http://localhost:8000`

### 7. Start the frontend

Open a new terminal from the root folder:

```bash
npm run dev
```

Frontend will be live at `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/query` | Streaming chat response |
| `POST` | `/query/full` | Full JSON response (for testing) |

### Example request body

```json
{
  "question": "What projects has Mark built?",
  "chat_history": []
}
```

---

## 🌍 Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| RAG Backend | Render |
| Workflow Automation | n8n Cloud |

For production, update the API URL in `AskAboutMe.jsx`:
```js
const API_URL = "https://your-render-app.onrender.com/query";
```

And update CORS in `RAG_model/main.py`:
```python
allow_origins=["https://your-portfolio.vercel.app"]
```

---

## 📬 Contact

- **Email** — markpatel044@gmail.com
- **LinkedIn** — [patel-mark-7b813928b](https://www.linkedin.com/in/patel-mark-7b813928b/)
- **GitHub** — [markpatel13](https://github.com/markpatel13)

---

> Built by Mark Patel — CS & AI/ML student @ Charusat University, Gujarat, India
