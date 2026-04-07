"use client";

import Link from "next/link";
import { useState } from "react";

interface NewsletterPageProps {
  params: Promise<{ locale: string }>;
}

// NOTE: Since this is a client component, we'll use the locale from params
// and inline the text content since dictionaries need async

export default function NewsletterPage({ params }: NewsletterPageProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [locale, setLocale] = useState("en");

  // Resolve params
  useState(() => {
    params.then((p) => setLocale(p.locale));
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <div style={{ maxWidth: 800, marginInline: "auto", padding: "2rem 1.5rem" }}>
      <Link href={`/${locale}`} style={{ display: "inline-block", fontSize: "0.9rem", color: "var(--color-sky)", marginBlockEnd: "1.5rem", fontWeight: 500 }}>
        ← Home
      </Link>

      {/* Hero */}
      <section style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBlockEnd: "3rem", minHeight: 300 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 50%, #6cabdd 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "4rem 2.5rem", color: "#fff", textAlign: "center" }}>
          <span style={{ fontSize: "3rem", display: "block", marginBlockEnd: "1rem" }}>📬</span>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, lineHeight: 1.15, marginBlockEnd: "1rem" }}>Stay in the Loop</h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.85, maxWidth: 500, marginInline: "auto" }}>
            Get the best of m.city delivered to your inbox — breaking news, culture picks, events, and exclusive deals.
          </p>
        </div>
      </section>

      {/* Signup Form */}
      <div className="card" style={{ padding: "3rem 2rem", textAlign: "center" }}>
        {subscribed ? (
          <div>
            <span style={{ fontSize: "3rem", display: "block", marginBlockEnd: "1rem" }}>🎉</span>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBlockEnd: "0.5rem" }}>You&apos;re in!</h2>
            <p style={{ color: "var(--color-text-secondary)" }}>Check your inbox — we&apos;ll keep you posted on everything m.city.</p>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBlockEnd: "0.75rem" }}>Subscribe to our newsletter</h2>
            <p style={{ color: "var(--color-text-secondary)", marginBlockEnd: "1.5rem" }}>
              Weekly updates on events, deals, and city culture. No spam — unsubscribe anytime.
            </p>
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.75rem", maxWidth: 450, marginInline: "auto" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{
                  flex: 1, padding: "0.8rem 1rem", borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)", background: "var(--color-surface)",
                  color: "var(--color-text)", fontSize: "1rem",
                }}
              />
              <button type="submit" className="btn-primary" style={{ padding: "0.8rem 1.5rem", fontSize: "0.95rem", fontWeight: 600, borderRadius: "var(--radius-sm)", cursor: "pointer" }}>
                Subscribe
              </button>
            </form>
          </>
        )}
      </div>

      {/* Community Links */}
      <section style={{ marginBlockStart: "3rem" }}>
        <h2 className="section-title" style={{ marginBlockEnd: "1.5rem", textAlign: "center" }}>Join the Community</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
          {[
            { icon: "💬", label: "Discord", desc: "Chat with fans" },
            { icon: "📷", label: "Instagram", desc: "@m.city" },
            { icon: "🐦", label: "Twitter / X", desc: "@mcity" },
            { icon: "📺", label: "YouTube", desc: "Videos & highlights" },
          ].map((social) => (
            <div key={social.label} className="card" style={{ padding: "1.5rem", textAlign: "center", cursor: "pointer" }}>
              <span style={{ fontSize: "2rem", display: "block", marginBlockEnd: "0.5rem" }}>{social.icon}</span>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBlockEnd: "0.25rem" }}>{social.label}</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>{social.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
