import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const API_URL = "http://localhost:8000/query";

const SUGGESTED_QUESTIONS = [
  "What tech stack does Mark use?",
  "Tell me about his projects",
  "Is Mark available for hire?",
  "What is his CGPA?",
];

const TypingIndicator = () => (
  <div className="aab-bubble aab-bubble--bot">
    <div className="aab-typing">
      <span /><span /><span />
    </div>
  </div>
);

const AskAboutMe = () => {
  const sectionRef = useRef(null);
  const chatEndRef  = useRef(null);
  const inputRef    = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey! 👋 I'm Mark's AI assistant. Ask me anything about his skills, projects, or experience — I'm powered by a real RAG pipeline built on his CV!",
    },
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);

  useGSAP(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1, y: 0, duration: 1,
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom-=100" },
      }
    );
  }, []);

  useEffect(() => {
    // Scroll inside the messages container only, not the whole page
    const messagesContainer = chatEndRef.current?.closest('.aab-messages');
    if (messagesContainer) {
      setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 0);
    }
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    setInput("");

    // Append user message
    const updatedMessages = [...messages, { role: "user", content: userText }];
    setMessages(updatedMessages);
    setLoading(true);

    // Prepare chat history (exclude the initial greeting for the API)
    const chatHistory = updatedMessages
      .slice(1)                          // skip the opening bot greeting
      .slice(0, -1)                      // exclude the message we just added
      .map(({ role, content }) => ({ role, content }));

    try {
      const res = await fetch(API_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ question: userText, chat_history: chatHistory }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Server error: ${res.status}`);
      }

      // Stream the response token by token
      setLoading(false);
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value, { stream: true });
        if (chunk) {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role:    "assistant",
              content: updated[updated.length - 1].content + chunk,
            };
            return updated;
          });
        }
      }
    } catch (err) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Couldn't reach the RAG server. Make sure it's running:\n`uvicorn main:app --reload --port 8000`",
        },
      ]);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section id="about-me" ref={sectionRef} className="aab-section" style={{ padding: '1rem 1.5rem' }}>
      <div className="aab-container" >

        {/* Header */}
        <div className="aab-header">
          <span className="aab-badge">✦ About Me</span>
          <h2 className="aab-title">Ask Me Anything</h2>
          <p className="aab-subtitle">
            Powered by a real RAG pipeline — HuggingFace embeddings · Pinecone · Groq
          </p>
        </div>

        {/* Chat window */}
        <div className="aab-chat-window">

          {/* Top bar */}
          <div className="aab-topbar">
            <div className="aab-avatar">MP</div>
            <div>
              <div className="aab-topbar-name">Mark's AI Assistant</div>
              <div className="aab-topbar-status">
                <span className="aab-dot" /> RAG · Groq · Pinecone
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="aab-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`aab-bubble ${
                  msg.role === "user" ? "aab-bubble--user" : "aab-bubble--bot"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && <TypingIndicator />}
            <div ref={chatEndRef} />
          </div>

          {/* Suggestion chips — show while first question hasn't been asked */}
          {messages.length <= 1 && (
            <div className="aab-suggestions">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  className="aab-suggestion-chip"
                  onClick={() => sendMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input row */}
          <div className="aab-input-row">
            <input
              ref={inputRef}
              className="aab-input"
              placeholder="Ask about Mark's skills, projects, education…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button
              className="aab-send-btn"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              <svg
                width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .aab-section {
          width: 100%;
          padding: 6rem 1.5rem;
          background: #000;
          display: flex;
          justify-content: center;
        }
        .aab-container {
          width: 100%;
          max-width: 680px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2.5rem;
        }
        .aab-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        .aab-badge {
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 0.3rem 0.9rem;
          border-radius: 999px;
        }
        .aab-title {
          font-size: clamp(2rem, 5vw, 2.8rem);
          font-weight: 800;
          color: #fff;
          margin: 0;
          line-height: 1.1;
        }
        .aab-subtitle {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.35);
          margin: 0;
          letter-spacing: 0.02em;
        }
        .aab-chat-window {
          width: 100%;
          background: #111;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6);
        }
        .aab-topbar {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: #161616;
        }
        .aab-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }
        .aab-topbar-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #fff;
        }
        .aab-topbar-status {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.35);
          display: flex;
          align-items: center;
          gap: 0.35rem;
          letter-spacing: 0.03em;
        }
        .aab-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          display: inline-block;
        }
        .aab-messages {
          flex: 1;
          min-height: 300px;
          max-height: 400px;
          overflow-y: auto;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.08) transparent;
        }
        .aab-bubble {
          max-width: 82%;
          padding: 0.75rem 1rem;
          border-radius: 16px;
          font-size: 0.92rem;
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-word;
          animation: aab-pop 0.22s ease;
        }
        @keyframes aab-pop {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .aab-bubble--bot {
          background: #1e1e1e;
          color: rgba(255,255,255,0.88);
          align-self: flex-start;
          border-bottom-left-radius: 4px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .aab-bubble--user {
          background: #fff;
          color: #111;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
          font-weight: 500;
        }
        .aab-typing {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 2px;
        }
        .aab-typing span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          animation: aab-bounce 1.2s infinite ease-in-out;
        }
        .aab-typing span:nth-child(2) { animation-delay: 0.2s; }
        .aab-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes aab-bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40%           { transform: scale(1);   opacity: 1; }
        }
        .aab-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding: 0 1.25rem 1rem;
        }
        .aab-suggestion-chip {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.6);
          font-size: 0.8rem;
          padding: 0.4rem 0.85rem;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .aab-suggestion-chip:hover {
          border-color: rgba(255,255,255,0.4);
          color: #fff;
          background: rgba(255,255,255,0.05);
        }
        .aab-input-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.9rem 1.25rem;
          border-top: 1px solid rgba(255,255,255,0.07);
          background: #161616;
        }
        .aab-input {
          flex: 1;
          background: #222;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 0.7rem 1rem;
          color: #fff;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .aab-input::placeholder { color: rgba(255,255,255,0.28); }
        .aab-input:focus { border-color: rgba(255,255,255,0.28); }
        .aab-input:disabled { opacity: 0.5; cursor: not-allowed; }
        .aab-send-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #fff;
          color: #111;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: opacity 0.2s, transform 0.15s;
        }
        .aab-send-btn:hover:not(:disabled) { opacity: 0.85; transform: scale(1.06); }
        .aab-send-btn:disabled { opacity: 0.25; cursor: not-allowed; }
      `}</style>
    </section>
  );
};

export default AskAboutMe;