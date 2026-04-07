import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { locales, localeNames } from "@/lib/i18n/config";

interface FooterProps {
  locale: Locale;
  dict: Record<string, string>;
}

export default function Footer({ locale, dict }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "var(--color-bg-card)", marginBlockStart: "2rem" }}>
      <div className="container" style={{ paddingBlock: "3rem" }}>
        <div className="footer-grid">
          {/* Brand Column */}
          <div>
            <Link href={`/${locale}`} style={{ display: "inline-block", marginBlockEnd: "1rem" }}>
              <span className="text-gradient" style={{ fontSize: "1.75rem", fontWeight: 800 }}>m.city</span>
            </Link>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem", lineHeight: 1.6, maxWidth: "300px", marginBlockEnd: "1.5rem" }}>
              {dict.site_tagline}
            </p>
            {/* Social Icons */}
            <div className="social-icons">
              <a href="#" className="social-icon" title="X (Twitter)" aria-label="Twitter">𝕏</a>
              <a href="#" className="social-icon" title="Instagram" aria-label="Instagram">📷</a>
              <a href="#" className="social-icon" title="YouTube" aria-label="YouTube">▶</a>
              <a href="#" className="social-icon" title="TikTok" aria-label="TikTok">♪</a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="footer-title">{dict.footer_nav}</h4>
            <div className="footer-links">
              <Link href={`/${locale}`}>{dict.nav_home}</Link>
              <Link href={`/${locale}/news`}>{dict.nav_news}</Link>
              <Link href={`/${locale}/whats-on`}>{dict.nav_whats_on || "What's On"}</Link>
              <Link href={`/${locale}/where-to-stay`}>{dict.nav_where_to_stay || "Stay"}</Link>
              <Link href={`/${locale}/eat-drink`}>{dict.nav_eat_drink || "Eat & Drink"}</Link>
              <Link href={`/${locale}/deals`}>{dict.nav_deals || "Deals"}</Link>
              <Link href={`/${locale}/neighbourhoods`}>{dict.nav_neighbourhoods || "Areas"}</Link>
              <Link href={`/${locale}/free-things`}>{dict.nav_free_things || "Free"}</Link>
              <Link href={`/${locale}/ideas`}>{dict.nav_ideas || "Ideas"}</Link>
              <Link href={`/${locale}/visitor-info`}>{dict.nav_visitor_info || "Info"}</Link>
              <Link href={`/${locale}/products`}>{dict.nav_products}</Link>
            </div>
          </div>

          {/* Languages */}
          <div>
            <h4 className="footer-title">{dict.language_switch}</h4>
            <div className="footer-links">
              {locales.map((l) => (
                <Link key={l} href={`/${l}`} style={{ color: locale === l ? "var(--color-sky)" : undefined }}>
                  {localeNames[l]}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="footer-title">Legal</h4>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <hr className="divider" style={{ marginBlock: "2rem" }} />

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", maxWidth: "600px", lineHeight: 1.6 }}>
            {dict.footer_disclaimer}
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
            © {year} m.city Media. {dict.footer_rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
