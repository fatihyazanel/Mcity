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
  return { title: `${dict.eat_drink_title} — m.city` };
}

export default async function EatDrinkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const featuredRestaurants = await getFeaturedPlaces(locale, "restaurant");
  const allRestaurants = await getPlaces(locale, "restaurant");
  const bars = await getPlaces(locale, "bar");

  return (
    <div style={{ maxWidth: 1200, marginInline: "auto", padding: "2rem 1.5rem" }}>
      <Link href={`/${locale}`} style={{ display: "inline-block", fontSize: "0.9rem", color: "var(--color-sky)", marginBlockEnd: "1.5rem", fontWeight: 500 }}>
        {dict.back_to_home}
      </Link>

      {/* Hero */}
      <section style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBlockEnd: "3rem", minHeight: 340 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #2d1b00 0%, #5a2d00 50%, #e65100 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "4rem 2.5rem", color: "#fff" }}>
          <span className="badge" style={{ marginBlockEnd: "1rem", display: "inline-block" }}>🍽️ {dict.eat_drink_title}</span>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, lineHeight: 1.15, marginBlockEnd: "1rem" }}>{dict.eat_drink_title}</h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.85, maxWidth: 600 }}>{dict.eat_drink_desc}</p>
        </div>
      </section>

      {/* Featured Restaurants */}
      {featuredRestaurants.length > 0 && (
        <section style={{ marginBlockEnd: "3rem" }}>
          <h2 className="section-title" style={{ marginBlockEnd: "1.5rem" }}>⭐ {dict.eat_drink_featured}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {featuredRestaurants.map((place) => (
              <div key={place.id} className="card" style={{ overflow: "hidden" }}>
                <div style={{ position: "relative", paddingBlockStart: "56.25%", overflow: "hidden" }}>
                  <OptImage src={place.image} alt={place.name} sizes="300px" />
                  <span className="badge" style={{ position: "absolute", top: 12, left: 12, zIndex: 1 }}>⭐</span>
                </div>
                <div style={{ padding: "1.25rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBlockEnd: "0.5rem" }}>{place.name}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBlockEnd: "0.5rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{place.description}</p>
                  {place.address && <p style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>📍 {place.address}</p>}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlockStart: "0.75rem" }}>
                    {place.price_range && <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-accent)" }}>{place.price_range}</span>}
                    {place.rating && <span style={{ fontSize: "0.85rem", color: "#f59e0b" }}>⭐ {place.rating}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Restaurants */}
      <section style={{ marginBlockEnd: "3rem" }}>
        <h2 className="section-title" style={{ marginBlockEnd: "1.5rem" }}>🍴 {dict.eat_drink_restaurants}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {allRestaurants.map((place) => (
            <div key={place.id} className="card" style={{ overflow: "hidden" }}>
              <div style={{ position: "relative", paddingBlockStart: "56.25%", overflow: "hidden" }}>
                <OptImage src={place.image} alt={place.name} sizes="280px" />
              </div>
              <div style={{ padding: "1rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBlockEnd: "0.25rem" }}>{place.name}</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>{place.address}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlockStart: "0.5rem" }}>
                  {place.price_range && <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-accent)" }}>{place.price_range}</span>}
                  {place.rating && <span style={{ fontSize: "0.8rem", color: "#f59e0b" }}>⭐ {place.rating}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bars */}
      {bars.length > 0 && (
        <section>
          <h2 className="section-title" style={{ marginBlockEnd: "1.5rem" }}>🍸 {dict.eat_drink_bars}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {bars.map((place) => (
              <div key={place.id} className="card" style={{ overflow: "hidden" }}>
                <div style={{ position: "relative", paddingBlockStart: "56.25%", overflow: "hidden" }}>
                  <OptImage src={place.image} alt={place.name} sizes="280px" />
                </div>
                <div style={{ padding: "1rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBlockEnd: "0.25rem" }}>{place.name}</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>{place.address}</p>
                  {place.price_range && <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-accent)" }}>{place.price_range}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
