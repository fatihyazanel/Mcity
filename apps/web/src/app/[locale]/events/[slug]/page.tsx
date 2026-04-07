import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getEventBySlug, getAllEventSlugs } from "@/lib/data";
import OptImage from "@/components/OptImage";

export async function generateStaticParams() {
  return (await getAllEventSlugs()).map(({ slug, locale }) => ({ locale, slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const event = await getEventBySlug(locale, slug);
  if (!event) return { title: "Event — m.city" };
  const BASE_URL = "https://www.m.city";
  const canonicalUrl = `${BASE_URL}/${locale}/events/${slug}`;
  return {
    title: event.title,
    description: event.description.slice(0, 160),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      siteName: "m.city",
      title: `${event.title} — m.city`,
      description: event.description.slice(0, 160),
      images: [{ url: event.event_image, width: 1200, height: 630, alt: event.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.description.slice(0, 160),
      images: [event.event_image],
    },
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);
  const event = await getEventBySlug(locale, slug);

  if (!event) notFound();

  return (
    <div style={{ maxWidth: 900, marginInline: "auto", padding: "2rem 1.5rem" }}>
      <Link href={`/${locale}/whats-on`} style={{ display: "inline-block", fontSize: "0.9rem", color: "var(--color-sky)", marginBlockEnd: "1.5rem", fontWeight: 500 }}>
        ← {dict.whats_on_title}
      </Link>

      <article className="card" style={{ overflow: "hidden" }}>
        <div style={{ position: "relative", paddingBlockStart: "50%", overflow: "hidden" }}>
          <OptImage src={event.event_image} alt={event.title} priority sizes="(max-width: 900px) 100vw, 900px" />
          <span className="badge" style={{ position: "absolute", top: 16, left: 16, zIndex: 1 }}>{event.category}</span>
        </div>

        <div style={{ padding: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.2, marginBlockEnd: "1rem" }}>{event.title}</h1>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginBlockEnd: "1.5rem", fontSize: "0.95rem", color: "var(--color-text-secondary)" }}>
            <span>📅 {new Date(event.event_date).toLocaleDateString(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            {event.event_end && <span>→ {new Date(event.event_end).toLocaleDateString(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>}
            <span>📍 {event.venue}</span>
            {event.price_range && <span>🎟️ {event.price_range}</span>}
          </div>

          <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--color-text-secondary)" }}>{event.description}</p>

          {event.ticket_url && (
            <a
              href={event.ticket_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: "inline-block", marginBlockStart: "2rem", padding: "0.9rem 2rem", fontSize: "1rem", fontWeight: 600, borderRadius: "var(--radius-sm)", textDecoration: "none" }}
            >
              🎫 {dict.events_get_tickets}
            </a>
          )}
        </div>
      </article>
    </div>
  );
}
