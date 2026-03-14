import type { Locale } from "@/lib/i18n/config";
import { locales, localeNames } from "@/lib/i18n/config";

interface FooterProps {
  locale: Locale;
  dict: Record<string, string>;
}

export default function Footer({ locale, dict }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderBlockStart: "1px solid var(--color-border)",
        background: "var(--color-bg-card)",
        marginBlockStart: "3rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          marginInline: "auto",
          padding: "2.5rem 1.5rem",
        }}
      >
        {/* Top */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "2rem",
            marginBlockEnd: "2rem",
          }}
        >
          {/* Brand */}
          <div>
            <span className="text-gradient" style={{ fontSize: "1.5rem", fontWeight: 800 }}>
              m.city
            </span>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem", marginBlockStart: "0.5rem", maxWidth: "300px" }}>
              {dict.site_tagline}
            </p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>
            <div>
              <h4 style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginBlockEnd: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Navigation
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <a href={`/${locale}`} style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>{dict.nav_home}</a>
                <a href={`/${locale}#news`} style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>{dict.nav_news}</a>
                <a href={`/${locale}#products`} style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>{dict.nav_products}</a>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginBlockEnd: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {dict.language_switch}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {locales.map((l) => (
                  <a key={l} href={`/${l}`} style={{ fontSize: "0.85rem", color: locale === l ? "var(--color-sky)" : "var(--color-text-secondary)" }}>
                    {localeNames[l]}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div
          style={{
            borderBlockStart: "1px solid var(--color-border)",
            paddingBlockStart: "1.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--color-text-muted)",
              lineHeight: 1.6,
              maxWidth: "700px",
              marginBlockEnd: "0.75rem",
            }}
          >
            ⚠️ {dict.footer_disclaimer}
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
            © {year} m.city — {dict.footer_rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
