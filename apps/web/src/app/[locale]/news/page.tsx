import type { Metadata } from "next";
import Link from "next/link";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getNews } from "@/lib/data";
import OptImage from "@/components/OptImage";

// Her 1 saatte yenile
export const revalidate = 3600;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const BASE_URL = "https://www.m.city";
  const canonicalUrl = `${BASE_URL}/${locale}/news`;
  return {
    title: dict.news_all,
    description: dict.hero_subtitle,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "m.city",
      title: `${dict.news_all} — m.city`,
      description: dict.hero_subtitle,
      images: [{ url: `${BASE_URL}/og-default.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${dict.news_all} — m.city`,
      description: dict.hero_subtitle,
      images: [`${BASE_URL}/og-default.jpg`],
    },
  };
}

export default async function NewsListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const articles = await getNews(locale as Locale);

  return (
    <div style={{ maxWidth: "1200px", marginInline: "auto", padding: "2rem 1.5rem" }}>
      <Link
        href={`/${locale}`}
        style={{ display: "inline-block", fontSize: "0.9rem", color: "var(--color-sky)", marginBlockEnd: "1.5rem", fontWeight: 500 }}
      >
        {dict.back_to_home}
      </Link>

      <h1 className="section-title" style={{ marginBlockEnd: "2rem" }}>
        📰 {dict.news_all}
      </h1>

      <div className="news-grid">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/${locale}/news/${article.slug}`}
            className="card"
            style={{ display: "flex", flexDirection: "column", textDecoration: "none", color: "inherit" }}
          >
            <div style={{ position: "relative", paddingBlockStart: "56.25%", overflow: "hidden" }}>
              <OptImage
                src={article.featured_image}
                alt={article.title}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--color-sky)", fontWeight: 500, marginBlockEnd: "0.5rem", display: "block" }}>
                {article.source_name} • {new Date(article.published_at).toLocaleDateString(locale)}
              </span>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 600, lineHeight: 1.35, marginBlockEnd: "0.75rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                {article.title}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden", marginBlockEnd: "1rem", flex: 1 }}>
                {article.excerpt}
              </p>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-sky)", marginBlockStart: "auto" }}>
                {dict.news_read_more} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
