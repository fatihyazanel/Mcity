import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPlaces, getFeaturedPlaces } from "@/lib/data";
import OptImage from "@/components/OptImage";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return { title: `${dict.where_to_stay_title} — m.city` };
}

export default async function WhereToStayPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const featured = await getFeaturedPlaces(locale, "hotel");
  const hotels = await getPlaces(locale, "hotel");
  const hostels = await getPlaces(locale, "hostel");

  const renderStars = (stars: number | null) => {
    if (!stars) return null;
    return "★".repeat(stars) + "☆".repeat(5 - stars);
  };

  return (
    <div style={{ maxWidth: 1200, marginInline: "auto", padding: "2rem 1.5rem" }}>
      <Link href={`/${locale}`} style={{ display: "inline-block", fontSize: "0.9rem", color: "var(--color-sky)", marginBlockEnd: "1.5rem", fontWeight: 500 }}>
        {dict.back_to_home}
      </Link>

      {/* Hero */}
      <section style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBlockEnd: "3rem", minHeight: 340 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "4rem 2.5rem", color: "#fff" }}>
          <span className="badge" style={{ marginBlockEnd: "1rem", display: "inline-block" }}>🏨 {dict.where_to_stay_title}</span>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, lineHeight: 1.15, marginBlockEnd: "1rem" }}>{dict.where_to_stay_title}</h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.85, maxWidth: 600 }}>{dict.where_to_stay_desc}</p>
        </div>
      </section>

      {/* Top Picks */}
      {featured.length > 0 && (
        <section style={{ marginBlockEnd: "3rem" }}>
          <h2 className="section-title" style={{ marginBlockEnd: "1.5rem" }}>⭐ {dict.where_to_stay_top_picks}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {featured.map((place) => (
              <div key={place.id} className="card" style={{ overflow: "hidden" }}>
                <div style={{ position: "relative", paddingBlockStart: "56.25%", overflow: "hidden" }}>
                  <OptImage src={place.image} alt={place.name} sizes="(max-width: 768px) 100vw, 33vw" />
                  {place.stars && place.stars > 0 && (
                    <span style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.75)", color: "#f59e0b", padding: "0.25rem 0.5rem", borderRadius: "var(--radius-sm)", fontSize: "0.85rem" }}>
                      {renderStars(place.stars)}
                    </span>
                  )}
                </div>
                <div style={{ padding: "1.25rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBlockEnd: "0.5rem" }}>{place.name}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBlockEnd: "0.5rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{place.description}</p>
                  {place.address && <p style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>📍 {place.address}</p>}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlockStart: "0.75rem" }}>
                    {place.price_range && <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-accent)" }}>{place.price_range}</span>}
                    {place.rating && <span style={{ fontSize: "0.85rem", color: "#f59e0b" }}>⭐ {place.rating}</span>}
                  </div>
                  {place.website && (
                    <a href={place.website} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: "inline-block", marginBlockStart: "1rem", padding: "0.5rem 1.25rem", fontSize: "0.85rem", borderRadius: "var(--radius-sm)", textDecoration: "none" }}>
                      {dict.where_to_stay_book}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Hotels */}
      <section style={{ marginBlockEnd: "3rem" }}>
        <h2 className="section-title" style={{ marginBlockEnd: "1.5rem" }}>🏨 {dict.where_to_stay_hotels}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {hotels.map((place) => (
            <div key={place.id} className="card" style={{ overflow: "hidden" }}>
              <div style={{ position: "relative", paddingBlockStart: "56.25%", overflow: "hidden" }}>
                <OptImage src={place.image} alt={place.name} sizes="280px" />
              </div>
              <div style={{ padding: "1rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>{place.name}</h3>
                {place.stars && place.stars > 0 && <span style={{ fontSize: "0.8rem", color: "#f59e0b" }}>{renderStars(place.stars)}</span>}
                {place.price_range && <p style={{ fontSize: "0.85rem", color: "var(--color-accent)", fontWeight: 600, marginBlockStart: "0.25rem" }}>{place.price_range}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hostels */}
      {hostels.length > 0 && (
        <section>
          <h2 className="section-title" style={{ marginBlockEnd: "1.5rem" }}>🎒 {dict.where_to_stay_hostels}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {hostels.map((place) => (
              <div key={place.id} className="card" style={{ overflow: "hidden" }}>
                <div style={{ position: "relative", paddingBlockStart: "56.25%", overflow: "hidden" }}>
                  <OptImage src={place.image} alt={place.name} sizes="280px" />
                </div>
                <div style={{ padding: "1rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>{place.name}</h3>
                  {place.price_range && <p style={{ fontSize: "0.85rem", color: "var(--color-accent)", fontWeight: 600, marginBlockStart: "0.25rem" }}>{place.price_range}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
