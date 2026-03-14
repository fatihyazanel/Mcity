import type { Locale } from "@/lib/i18n/config";
import { mockNews } from "@/lib/mock-data";

interface NewsGridProps {
  dict: Record<string, string>;
  locale: Locale;
}

export default function NewsGrid({ dict, locale }: NewsGridProps) {
  const articles = mockNews.slice(0, 6);

  return (
    <section id="news" style={{ paddingBlock: "3rem 2rem" }}>
      <h2 className="section-title">📰 {dict.news_title}</h2>
      <div className="news-grid">
        {articles.map((article) => (
          <article key={article.id} className="card">
            <div style={{ position: "relative", paddingBlockStart: "56.25%", overflow: "hidden" }}>
              <img
                src={article.featured_image}
                alt={article.title}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div style={{ padding: "1.25rem" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-sky)",
                  fontWeight: 500,
                  marginBlockEnd: "0.5rem",
                  display: "block",
                }}
              >
                {article.source_name} • {new Date(article.published_at).toLocaleDateString(locale)}
              </span>
              <h3
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  lineHeight: 1.35,
                  marginBlockEnd: "0.75rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {article.title}
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  marginBlockEnd: "1rem",
                }}
              >
                {article.excerpt}
              </p>
              <a
                href={`/${locale}/news/${article.slug}`}
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--color-sky)",
                }}
              >
                {dict.news_read_more} →
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
