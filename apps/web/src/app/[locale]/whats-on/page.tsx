import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getEvents, getFeaturedEvents } from "@/lib/data";
import OptImage from "@/components/OptImage";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const BASE_URL = "https://www.m.city";
  const canonicalUrl = `${BASE_URL}/${locale}/whats-on`;
  return {
    title: dict.whats_on_title,
    description: dict.whats_on_desc,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "m.city",
      title: `${dict.whats_on_title} — m.city`,
      description: dict.whats_on_desc,
      images: [{ url: `${BASE_URL}/og-default.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${dict.whats_on_title} — m.city`,
      description: dict.whats_on_desc,
      images: [`${BASE_URL}/og-default.jpg`],
    },
  };
}

export default async function WhatsOnPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const featured = await getFeaturedEvents(locale);
  const allEvents = await getEvents(locale, 50);
  const categories = [...new Set(allEvents.map((e) => e.category))];

  return (
    <div style={{ maxWidth: 1200, marginInline: "auto", padding: "2rem 1.5rem" }}>
      <Link href={`/${locale}`} style={{ display: "inline-block", fontSize: "0.9rem", color: "var(--color-sky)", marginBlockEnd: "1.5rem", fontWeight: 500 }}>
        {dict.back_to_home}
      </Link>

      {/* Hero */}
      <section style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBlockEnd: "3rem", minHeight: 340 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0ea5e9 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "4rem 2.5rem", color: "#fff" }}>
          <span className="badge" style={{ marginBlockEnd: "1rem", display: "inline-block" }}>🎭 {dict.whats_on_title}</span>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, lineHeight: 1.15, marginBlockEnd: "1rem" }}>{dict.whats_on_title}</h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.85, maxWidth: 600 }}>{dict.whats_on_desc}</p>
        </div>
      </section>

      {/* Featured Events Carousel */}
      {featured.length > 0 && (
        <section style={{ marginBlockEnd: "3rem" }}>
          <h2 className="section-title" style={{ marginBlockEnd: "1.5rem" }}>⭐ {dict.whats_on_highlights}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {featured.map((ev) => (
              <Link key={ev.id} href={`/${locale}/events/${ev.slug}`} className="card" style={{ overflow: "hidden", transition: "transform 0.2s" }}>
                <div style={{ position: "relative", paddingBlockStart: "56.25%", overflow: "hidden" }}>
                  <OptImage src={ev.event_image} alt={ev.title} sizes="(max-width: 768px) 100vw, 33vw" />
                  <span className="badge" style={{ position: "absolute", top: 12, left: 12 }}>⭐ {dict.whats_on_featured}</span>
                </div>
                <div style={{ padding: "1.25rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-sky)", fontWeight: 500 }}>
                    📅 {new Date(ev.event_date).toLocaleDateString(locale)} • {ev.venue}
                  </span>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBlockStart: "0.5rem", lineHeight: 1.35 }}>{ev.title}</h3>
                  {ev.price_range && <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBlockStart: "0.25rem" }}>🎟️ {ev.price_range}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Category Filters */}
      <section style={{ marginBlockEnd: "2rem" }}>
        <h2 className="section-title" style={{ marginBlockEnd: "1rem" }}>{dict.whats_on_categories}</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          {categories.map((cat) => (
            <span key={cat} className="badge" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem", cursor: "pointer" }}>
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* All Events Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
        {allEvents.map((ev) => (
          <Link key={ev.id} href={`/${locale}/events/${ev.slug}`} className="card" style={{ overflow: "hidden" }}>
            <div style={{ position: "relative", paddingBlockStart: "56.25%", overflow: "hidden" }}>
              <OptImage src={ev.event_image} alt={ev.title} sizes="(max-width: 768px) 100vw, 33vw" />
              <span className="badge" style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(0,0,0,0.7)" }}>{ev.category}</span>
            </div>
            <div style={{ padding: "1.25rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--color-sky)", fontWeight: 500 }}>
                📅 {new Date(ev.event_date).toLocaleDateString(locale)} • {ev.venue}
              </span>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBlockStart: "0.5rem", lineHeight: 1.35 }}>{ev.title}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBlockStart: "0.25rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{ev.description}</p>
              {ev.price_range && <p style={{ fontSize: "0.85rem", color: "var(--color-accent)", fontWeight: 600, marginBlockStart: "0.5rem" }}>🎟️ {ev.price_range}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
