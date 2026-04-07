import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getIdeaBySlug } from "@/lib/data";
import OptImage from "@/components/OptImage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const idea = await getIdeaBySlug(locale, slug);
  if (!idea) return { title: "Ideas — m.city" };
  const BASE_URL = "https://www.m.city";
  const canonicalUrl = `${BASE_URL}/${locale}/ideas/${slug}`;
  return {
    title: idea.title,
    description: idea.excerpt,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      siteName: "m.city",
      title: `${idea.title} — m.city`,
      description: idea.excerpt,
      publishedTime: idea.published_at,
      images: [{ url: idea.image, width: 1200, height: 630, alt: idea.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: idea.title,
      description: idea.excerpt,
      images: [idea.image],
    },
  };
}

export default async function IdeaDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);
  const idea = await getIdeaBySlug(locale, slug);

  if (!idea) notFound();

  return (
    <div style={{ maxWidth: 800, marginInline: "auto", padding: "2rem 1.5rem" }}>
      <Link href={`/${locale}/ideas`} style={{ display: "inline-block", fontSize: "0.9rem", color: "var(--color-sky)", marginBlockEnd: "1.5rem", fontWeight: 500 }}>
        ← {dict.ideas_title}
      </Link>

      <article>
        <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", marginBlockEnd: "2rem", position: "relative", height: 400 }}>
          <OptImage src={idea.image} alt={idea.title} priority sizes="(max-width: 800px) 100vw, 800px" />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBlockEnd: "1rem" }}>
          <span className="badge">{idea.category}</span>
          <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>📖 {idea.read_time} min read</span>
          <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>{new Date(idea.published_at).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}</span>
        </div>

        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, lineHeight: 1.2, marginBlockEnd: "1rem" }}>{idea.title}</h1>
        <p style={{ fontSize: "1.1rem", color: "var(--color-text-secondary)", fontStyle: "italic", marginBlockEnd: "2rem", lineHeight: 1.6 }}>{idea.excerpt}</p>
        <div style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
          {idea.content_body.split("\n").map((paragraph, i) => (
            <p key={i} style={{ marginBlockEnd: "1.25rem" }}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
}
