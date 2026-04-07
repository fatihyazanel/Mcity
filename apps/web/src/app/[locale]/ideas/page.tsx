import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getIdeas } from "@/lib/data";
import OptImage from "@/components/OptImage";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return { title: `${dict.ideas_title} — m.city` };
}

export default async function IdeasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const ideas = await getIdeas(locale);

  return (
    <div style={{ maxWidth: 1200, marginInline: "auto", padding: "2rem 1.5rem" }}>
      <Link href={`/${locale}`} style={{ display: "inline-block", fontSize: "0.9rem", color: "var(--color-sky)", marginBlockEnd: "1.5rem", fontWeight: 500 }}>
        {dict.back_to_home}
      </Link>

      {/* Hero */}
      <section style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBlockEnd: "3rem", minHeight: 300 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #3b0764 0%, #7c3aed 50%, #a78bfa 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "4rem 2.5rem", color: "#fff" }}>
          <span className="badge" style={{ marginBlockEnd: "1rem", display: "inline-block" }}>💡 {dict.ideas_title}</span>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, lineHeight: 1.15, marginBlockEnd: "1rem" }}>{dict.ideas_title}</h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.85, maxWidth: 600 }}>{dict.ideas_desc}</p>
        </div>
      </section>

      {/* Featured (first article big) */}
      {ideas.length > 0 && (
        <section style={{ marginBlockEnd: "3rem" }}>
          <Link href={`/${locale}/ideas/${ideas[0].slug}`} className="card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden", gap: 0 }}>
            <div style={{ position: "relative", minHeight: 280 }}>
              <OptImage src={ideas[0].image} alt={ideas[0].title} sizes="50vw" />
            </div>
            <div style={{ padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span className="badge" style={{ marginBlockEnd: "0.75rem", alignSelf: "flex-start" }}>{ideas[0].category}</span>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.3, marginBlockEnd: "0.75rem" }}>{ideas[0].title}</h2>
              <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBlockEnd: "0.75rem" }}>{ideas[0].excerpt}</p>
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>📖 {ideas[0].read_time} min read • {new Date(ideas[0].published_at).toLocaleDateString(locale)}</span>
            </div>
          </Link>
        </section>
      )}

      {/* Blog Grid */}
      <h2 className="section-title" style={{ marginBlockEnd: "1.5rem" }}>{dict.ideas_latest}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {ideas.slice(1).map((idea) => (
          <Link key={idea.id} href={`/${locale}/ideas/${idea.slug}`} className="card" style={{ overflow: "hidden" }}>
            <div style={{ position: "relative", paddingBlockStart: "56.25%", overflow: "hidden" }}>
              <OptImage src={idea.image} alt={idea.title} sizes="300px" />
              <span className="badge" style={{ position: "absolute", top: 12, left: 12 }}>{idea.category}</span>
            </div>
            <div style={{ padding: "1.25rem" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBlockEnd: "0.5rem", lineHeight: 1.35 }}>{idea.title}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{idea.excerpt}</p>
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", display: "block", marginBlockStart: "0.5rem" }}>📖 {idea.read_time} min read</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
