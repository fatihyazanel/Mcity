import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { NewsRow } from "@/lib/data";
import OptImage from "@/components/OptImage";

interface NewsGridProps {
  dict: Record<string, string>;
  locale: Locale;
  articles: NewsRow[];
}

export default function NewsGrid({ dict, locale, articles }: NewsGridProps) {
  const featured = articles[1];
  const rest = articles.slice(2);

  if (!featured) return null;

  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">{dict.news_title}</h2>
        <Link href={`/${locale}/news`} className="section-link">
          {dict.news_all} →
        </Link>
      </div>

      <div className="news-magazine">
        {/* Featured Card */}
        <Link href={`/${locale}/news/${featured.slug}`} className="card card-featured" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ position: "relative", flex: 1, minHeight: "220px", overflow: "hidden" }}>
            <OptImage src={featured.featured_image} alt={featured.title} sizes="(max-width: 768px) 100vw, 50vw" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,14,26,0.85) 0%, transparent 60%)", zIndex: 1 }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.5rem", zIndex: 2 }}>
              <span className="badge badge-sky" style={{ marginBlockEnd: "0.75rem" }}>
                {featured.source_name}
              </span>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 700, lineHeight: 1.25, marginBlockEnd: "0.5rem" }}>
                {featured.title}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {featured.excerpt}
              </p>
            </div>
          </div>
        </Link>

        {/* Smaller Cards */}
        {rest.map((article) => (
          <Link href={`/${locale}/news/${article.slug}`} key={article.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ position: "relative", paddingBlockStart: "56.25%", overflow: "hidden" }}>
              <OptImage src={article.featured_image} alt={article.title} sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <div style={{ padding: "1rem 1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
              <div className="meta-row" style={{ marginBlockEnd: "0.5rem" }}>
                <span style={{ color: "var(--color-sky)", fontWeight: 600, fontSize: "0.75rem" }}>{article.source_name}</span>
                <span className="meta-dot" />
                <span style={{ fontSize: "0.75rem" }}>{new Date(article.published_at).toLocaleDateString(locale)}</span>
              </div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 600, lineHeight: 1.35, marginBlockEnd: "0.5rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {article.title}
              </h3>
              <span style={{ marginBlockStart: "auto", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-sky)" }}>
                {dict.news_read_more} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
