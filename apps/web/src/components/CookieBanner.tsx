"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type ConsentState = {
  analytics: boolean;
  marketing: boolean;
  decided: boolean;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    loadGA?: () => void;
    loadMeta?: () => void;
  }
}

export default function CookieBanner({ locale = "en" }: { locale?: string }) {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    analytics: false,
    marketing: false,
    decided: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("cookie_consent");
    if (saved) {
      const parsed = JSON.parse(saved) as ConsentState;
      setConsent(parsed);
      if (parsed.analytics) window.loadGA?.();
      if (parsed.marketing) window.loadMeta?.();
    } else {
      // Banner'ı 1 saniye sonra göster (sayfa yüklenmesini bekle)
      setTimeout(() => setVisible(true), 1000);
    }
  }, []);

  function saveConsent(analytics: boolean, marketing: boolean) {
    const state: ConsentState = { analytics, marketing, decided: true };
    localStorage.setItem("cookie_consent", JSON.stringify(state));
    setConsent(state);
    setVisible(false);

    if (analytics) window.loadGA?.();
    if (marketing) window.loadMeta?.();

    // GA4'e consent bildir
    window.gtag?.("consent", "update", {
      analytics_storage: analytics ? "granted" : "denied",
      ad_storage: marketing ? "granted" : "denied",
    });
  }

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "rgba(4, 9, 26, 0.97)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(108, 171, 221, 0.2)",
        padding: "1.25rem 1.5rem",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          marginInline: "auto",
        }}
      >
        {/* Main row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          {/* Text */}
          <div style={{ flex: 1, minWidth: "260px" }}>
            <p style={{ fontSize: "0.85rem", color: "#e2e8f0", lineHeight: 1.6, marginBottom: "0.25rem" }}>
              🍪 <strong style={{ color: "#fff" }}>We use cookies</strong> to improve your experience,
              analyse traffic and personalise content. You can choose which cookies to accept.{" "}
              <Link
                href={`/${locale}/cookie-policy`}
                style={{ color: "#6cabdd", textDecoration: "underline", fontSize: "0.8rem" }}
              >
                Learn more
              </Link>
            </p>
            <button
              onClick={() => setShowDetails(!showDetails)}
              style={{
                background: "none",
                border: "none",
                color: "#6cabdd",
                fontSize: "0.78rem",
                cursor: "pointer",
                padding: 0,
                textDecoration: "underline",
              }}
            >
              {showDetails ? "▲ Hide details" : "▼ Manage preferences"}
            </button>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={() => saveConsent(false, false)}
              style={{
                padding: "0.5rem 1.25rem",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "transparent",
                color: "#94a3b8",
                fontSize: "0.85rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Reject All
            </button>
            <button
              onClick={() => saveConsent(true, false)}
              style={{
                padding: "0.5rem 1.25rem",
                borderRadius: "8px",
                border: "1px solid rgba(108,171,221,0.4)",
                background: "rgba(108,171,221,0.1)",
                color: "#6cabdd",
                fontSize: "0.85rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Analytics Only
            </button>
            <button
              onClick={() => saveConsent(true, true)}
              style={{
                padding: "0.5rem 1.5rem",
                borderRadius: "8px",
                border: "none",
                background: "linear-gradient(135deg, #f0b429, #e8950a)",
                color: "#000",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Accept All
            </button>
          </div>
        </div>

        {/* Details panel */}
        {showDetails && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              background: "rgba(255,255,255,0.04)",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {/* Necessary */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "#fff", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.2rem" }}>
                  ✅ Necessary Cookies
                </p>
                <p style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                  Session, language preference, shopping cart. Always active.
                </p>
              </div>
              <span style={{ color: "#22c55e", fontSize: "0.75rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                Always On
              </span>
            </div>

            {/* Analytics */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "#fff", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.2rem" }}>
                  📊 Analytics Cookies
                </p>
                <p style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                  Google Analytics 4 — page views, sessions, user behaviour.
                </p>
              </div>
              <label style={{ cursor: "pointer", flexShrink: 0 }}>
                <input
                  type="checkbox"
                  defaultChecked={consent.analytics}
                  id="cb-analytics"
                  style={{ accentColor: "#6cabdd", width: "16px", height: "16px" }}
                />
              </label>
            </div>

            {/* Marketing */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "#fff", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.2rem" }}>
                  🎯 Marketing Cookies
                </p>
                <p style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                  Meta Pixel — ad targeting, campaign measurement.
                </p>
              </div>
              <label style={{ cursor: "pointer", flexShrink: 0 }}>
                <input
                  type="checkbox"
                  defaultChecked={consent.marketing}
                  id="cb-marketing"
                  style={{ accentColor: "#f0b429", width: "16px", height: "16px" }}
                />
              </label>
            </div>

            {/* Save custom */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  const analytics = (document.getElementById("cb-analytics") as HTMLInputElement)?.checked ?? false;
                  const marketing = (document.getElementById("cb-marketing") as HTMLInputElement)?.checked ?? false;
                  saveConsent(analytics, marketing);
                }}
                style={{
                  padding: "0.45rem 1.25rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(108,171,221,0.4)",
                  background: "rgba(108,171,221,0.15)",
                  color: "#6cabdd",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Save My Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
