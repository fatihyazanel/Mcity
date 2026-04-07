"use client";

import type { Locale } from "@/lib/i18n/config";

interface NewsletterSectionProps {
  dict: Record<string, string>;
  locale: Locale;
}

export default function NewsletterSection({ dict, locale }: NewsletterSectionProps) {
  return (
    <section className="section">
      <div className="newsletter-section">
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBlockEnd: "0.5rem" }}>
          ✉️ {dict.newsletter_title}
        </h2>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", maxWidth: "500px", marginInline: "auto" }}>
          {dict.newsletter_desc}
        </p>
        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder={dict.newsletter_placeholder}
            className="newsletter-input"
            required
          />
          <button type="submit" className="btn btn-primary">
            {dict.newsletter_btn}
          </button>
        </form>
        <p style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", marginBlockStart: "0.75rem" }}>
          {dict.newsletter_privacy}
        </p>
      </div>
    </section>
  );
}
