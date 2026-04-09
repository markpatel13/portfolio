import { useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import TitleHeader from "../TitleHeader";
import Computer from "../Models/Computer";

// ─── n8n Webhook ─────────────────────────────────────────
// Add this to your .env:  VITE_N8N_WEBHOOK_URL=https://your-n8n-url/webhook/portfolio-contact
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;
// ─────────────────────────────────────────────────────────

/* ── Inline 3D Scene (was ContactExperience.jsx) ───────── */
const ContactExperience = () => (
  <Canvas shadows camera={{ position: [0, 3, 7], fov: 45 }}>
    <ambientLight intensity={0.5} color="#fff4e6" />
    <directionalLight position={[5, 5, 3]} intensity={2.5} color="#ffd9b3" />
    <directionalLight
      position={[5, 9, 1]}
      castShadow
      intensity={2.5}
      color="#ffd9b3"
    />
    <OrbitControls
      enableZoom={false}
      minPolarAngle={Math.PI / 5}
      maxPolarAngle={Math.PI / 2}
    />
    <group scale={[1, 1, 1]}>
      <mesh
        receiveShadow
        position={[0, -1.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#a46b2d" />
      </mesh>
    </group>
    <group scale={0.03} position={[0, -1.49, -2]} castShadow>
      <Computer />
    </group>
  </Canvas>
);

/* ── Main Contact Section ───────────────────────────────── */
const Contact = () => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState("idle"); // idle | success | error
  const [form, setForm]       = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:    form.name,
          email:   form.email,
          message: form.message,
        }),
      });

      if (!res.ok) throw new Error(`Webhook error: ${res.status}`);

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("n8n Webhook Error:", error);
      setStatus("error");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section id="contact" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">

        <TitleHeader
          title="Get in Touch – Let's Connect"
          sub="💬 Have questions or ideas? Let's talk! 🚀"
        />

        <div className="grid-12-cols mt-16">

          {/* ── Left: Form ── */}
          <div className="xl:col-span-5">
            <div className="flex-center card-border rounded-xl p-10">
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-7"
              >
                {/* Name */}
                <div>
                  <label htmlFor="name">Your name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="What's your good name?"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="What's your email address?"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="How can I help you?"
                    rows="5"
                    required
                  />
                </div>

                {/* Success / Error banners */}
                {status === "success" && (
                  <div className="w-full px-4 py-3 rounded-lg text-sm font-medium"
                    style={{
                      background: "rgba(34,197,94,0.12)",
                      border: "1px solid rgba(34,197,94,0.35)",
                      color: "#4ade80",
                    }}>
                    ✅ Message sent! I'll get back to you soon.
                  </div>
                )}
                {status === "error" && (
                  <div className="w-full px-4 py-3 rounded-lg text-sm font-medium"
                    style={{
                      background: "rgba(239,68,68,0.12)",
                      border: "1px solid rgba(239,68,68,0.35)",
                      color: "#f87171",
                    }}>
                    ❌ Something went wrong. Please try again.
                  </div>
                )}

                {/* Submit Button — keeps your exact cta-button structure */}
                <button type="submit" disabled={loading}>
                  <div className="cta-button group">
                    <div className="bg-circle" />
                    <p className="text">
                      {loading ? "Sending..." : "Send Message"}
                    </p>
                    <div className="arrow-wrapper">
                      {loading ? (
                        <span style={{
                          width: 16, height: 16,
                          border: "2px solid rgba(0,0,0,0.3)",
                          borderTop: "2px solid #000",
                          borderRadius: "50%",
                          display: "inline-block",
                          animation: "spin 0.8s linear infinite",
                        }} />
                      ) : (
                        <img src="/images/arrow-down.svg" alt="arrow" />
                      )}
                    </div>
                  </div>
                </button>

              </form>
            </div>
          </div>

          {/* ── Right: 3D Canvas ── */}
          <div className="xl:col-span-7 min-h-96">
            <div className="bg-[#cd7c2e] w-full h-full hover:cursor-grab rounded-3xl overflow-hidden">
              <ContactExperience />
            </div>
          </div>

        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
};

export default Contact;
