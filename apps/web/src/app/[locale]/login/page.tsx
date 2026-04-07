"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState("en");
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, login, register } = useAuth();
  const router = useRouter();

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
  }, [params]);

  useEffect(() => {
    if (user) {
      router.push(`/${locale}`);
    }
  }, [user, locale, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result =
        tab === "login"
          ? await login(email, password)
          : await register(name, email, password);

      if (!result.ok) {
        setError(result.error || "An error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, marginInline: "auto", padding: "4rem 1.5rem" }}>
      <div className="card" style={{ padding: "2.5rem" }}>
        {/* Tabs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBlockEnd: "2rem" }}>
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(""); }}
              style={{
                padding: "0.7rem",
                borderRadius: "var(--radius-sm)",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.9rem",
                background: tab === t ? "var(--color-sky)" : "var(--color-surface, #1a2236)",
                color: tab === t ? "#fff" : "var(--color-text-secondary)",
                transition: "all 0.15s",
              }}
            >
              {t === "login" ? "🔑 Sign In" : "✨ Register"}
            </button>
          ))}
        </div>

        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBlockEnd: "1.5rem" }}>
          {tab === "login" ? "Welcome back!" : "Create account"}
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {tab === "register" && (
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBlockEnd: "0.3rem" }}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                style={inputStyle}
              />
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBlockEnd: "0.3rem" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBlockEnd: "0.3rem" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={tab === "register" ? "Min 6 characters" : "Your password"}
              required
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#ef4444" }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ padding: "0.9rem", fontWeight: 700, fontSize: "1rem", borderRadius: "var(--radius-sm)", cursor: loading ? "not-allowed" : "pointer", border: "none", opacity: loading ? 0.7 : 1, marginBlockStart: "0.5rem" }}
          >
            {loading ? "Please wait…" : tab === "login" ? "Sign In →" : "Create Account →"}
          </button>
        </form>

        <p style={{ marginBlockStart: "1.5rem", textAlign: "center", fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
          {tab === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(""); }}
            style={{ background: "none", border: "none", color: "var(--color-sky)", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}
          >
            {tab === "login" ? "Register" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem 0.9rem",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--color-border)",
  background: "var(--color-bg-elevated, #1a2236)",
  color: "var(--color-text)",
  fontSize: "0.95rem",
  boxSizing: "border-box",
};
