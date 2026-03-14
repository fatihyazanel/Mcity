import type { Locale } from "@/lib/i18n/config";

interface HeroSectionProps {
  dict: Record<string, string>;
  locale: Locale;
}

export default function HeroSection({ dict, locale }: HeroSectionProps) {
  return (
    <section
      className="gradient-hero"
      style={{
        padding: "5rem 1.5rem 4rem",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "800px", marginInline: "auto" }}>
        <h1
          style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", marginBlockEnd: "1rem" }}
          className="text-gradient"
        >
          {dict.hero_title}
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "var(--color-text-secondary)",
            marginBlockEnd: "2rem",
            lineHeight: 1.6,
          }}
        >
          {dict.hero_subtitle}
        </p>
        <a
          href={`/${locale}#news`}
          style={{
            display: "inline-block",
            padding: "0.875rem 2rem",
            background: "var(--color-sky)",
            color: "white",
            borderRadius: "999px",
            fontWeight: 600,
            fontSize: "1rem",
            transition: "background 0.2s",
          }}
        >
          {dict.hero_cta} →
        </a>
      </div>
    </section>
  );
}
