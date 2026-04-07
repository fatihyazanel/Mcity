import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { NewsRow } from "@/lib/data";
import OptImage from "@/components/OptImage";

interface HeroSectionProps {
  dict: Record<string, string>;
  locale: Locale;
  articles: NewsRow[];
}

export default function HeroSection({ dict, locale, articles }: HeroSectionProps) {
  const featured = articles[0];
  const trending = articles.slice(1, 5);

  if (!featured) return null;

  return (
    <section style={{ padding: "1rem 0 0" }}>
      <div className="container">
        {/* Featured Article Hero */}
        <Link href={`/${locale}/news/${featured.slug}`} className="featured-hero" style={{ display: "block" }}>
          <OptImage src={featured.featured_image} alt={featured.title} priority sizes="100vw" />
          <div className="featured-hero-overlay">
            <span className="badge badge-accent" style={{ marginBlockEnd: "0.75rem", alignSelf: "flex-start" }}>
              ⚡ {dict.news_title}
            </span>
            <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.75rem)", fontWeight: 800, lineHeight: 1.15, marginBlockEnd: "0.75rem", maxWidth: "700px" }}>
              {featured.title}
            </h1>
            <p style={{ fontSize: "1rem", color: "var(--color-text-secondary)", maxWidth: "600px", marginBlockEnd: "1rem", lineHeight: 1.5 }}>
              {featured.excerpt}
            </p>
            <div className="meta-row">
              <span style={{ color: "var(--color-sky)", fontWeight: 600 }}>{featured.source_name}</span>
              <span className="meta-dot" />
              <span>{new Date(featured.published_at).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
          </div>
        </Link>

        {/* Trending Tags */}
        <div className="trending-bar" style={{ marginBlockStart: "1rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-gold)", whiteSpace: "nowrap" }}>🔥 Trending</span>
          {trending.map((article) => (
            <Link key={article.id} href={`/${locale}/news/${article.slug}`} className="trending-tag">
              {article.title.length > 40 ? article.title.slice(0, 40) + "…" : article.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
