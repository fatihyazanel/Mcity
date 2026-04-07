import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getNews, getNewsBySlug } from "@/lib/data";
import OptImage from "@/components/OptImage";

// Yeni haberler DB'ye eklenince yenile
export const revalidate = 3600;

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    const articles = await getNews(locale);
    for (const article of articles) {
      params.push({ locale, slug: article.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getNewsBySlug(locale as Locale, slug);
  if (!article) return { title: "Not Found" };

  const BASE_URL = "https://www.m.city";
  const canonicalUrl = `${BASE_URL}/${locale}/news/${slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      siteName: "m.city",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.published_at,
      authors: [article.source_name],
      images: [
        {
          url: article.featured_image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.featured_image],
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);
  const article = await getNewsBySlug(locale as Locale, slug);

  if (!article) {
    notFound();
  }

  const BASE_URL = "https://www.m.city";
  const publishedDate = new Date(article.published_at).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Article JSON-LD for Google News / rich results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [article.featured_image],
    datePublished: article.published_at,
    dateModified: article.published_at,
    author: [{ "@type": "Organization", name: article.source_name, url: article.source_url }],
    publisher: {
      "@type": "Organization",
      name: "m.city",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/${locale}/news/${slug}` },
    inLanguage: locale,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article style={{ maxWidth: "800px", marginInline: "auto", padding: "2rem 1.5rem" }}>
      {/* Back link */}
      <Link
        href={`/${locale}/news`}
        style={{
          display: "inline-block",
          fontSize: "0.9rem",
          color: "var(--color-sky)",
          marginBlockEnd: "1.5rem",
          fontWeight: 500,
        }}
      >
        {dict.news_back}
      </Link>

      {/* Featured image */}
      <div
        style={{
          position: "relative",
          paddingBlockStart: "56.25%",
          overflow: "hidden",
          borderRadius: "12px",
          marginBlockEnd: "2rem",
        }}
      >
        <OptImage
          src={article.featured_image}
          alt={article.title}
          priority
          sizes="(max-width: 800px) 100vw, 800px"
        />
      </div>

      {/* Meta */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          fontSize: "0.85rem",
          color: "var(--color-text-secondary)",
          marginBlockEnd: "1rem",
          flexWrap: "wrap",
        }}
      >
        <span style={{ color: "var(--color-sky)", fontWeight: 600 }}>
          {article.source_name}
        </span>
        <span>•</span>
        <span>{publishedDate}</span>
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 800,
          lineHeight: 1.25,
          marginBlockEnd: "1rem",
        }}
      >
        {article.title}
      </h1>

      {/* Excerpt */}
      <p
        style={{
          fontSize: "1.15rem",
          color: "var(--color-text-secondary)",
          lineHeight: 1.6,
          marginBlockEnd: "2rem",
          fontStyle: "italic",
        }}
      >
        {article.excerpt}
      </p>

      {/* Body */}
      <div
        style={{
          fontSize: "1.05rem",
          lineHeight: 1.8,
          color: "var(--color-text)",
          marginBlockEnd: "2.5rem",
        }}
      >
        <p>{article.content_body}</p>
      </div>

      {/* Source link */}
      <div
        style={{
          borderBlockStart: "1px solid var(--color-border)",
          paddingBlockStart: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <a
          href={article.source_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "0.9rem",
            color: "var(--color-sky)",
            fontWeight: 600,
          }}
        >
          {dict.news_source}: {article.source_name} ↗
        </a>
        <Link
          href={`/${locale}/news`}
          style={{
            fontSize: "0.9rem",
            background: "var(--color-sky)",
            color: "white",
            padding: "0.5rem 1.25rem",
            borderRadius: "8px",
            fontWeight: 600,
          }}
        >
          {dict.news_all}
        </Link>
      </div>
    </article>
    </>
  );
}
