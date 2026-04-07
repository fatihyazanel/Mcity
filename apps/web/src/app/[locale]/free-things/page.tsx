import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getFreeThings } from "@/lib/data";
import OptImage from "@/components/OptImage";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return { title: `${dict.free_things_title} — m.city` };
}

export default async function FreeThingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const freeThings = await getFreeThings(locale);
  const categories = [...new Set(freeThings.map((f) => f.category))];

  return (
    <div style={{ maxWidth: 1200, marginInline: "auto", padding: "2rem 1.5rem" }}>
      <Link href={`/${locale}`} style={{ display: "inline-block", fontSize: "0.9rem", color: "var(--color-sky)", marginBlockEnd: "1.5rem", fontWeight: 500 }}>
        {dict.back_to_home}
      </Link>

      {/* Hero */}
      <section style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBlockEnd: "3rem", minHeight: 300 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #14532d 0%, #15803d 50%, #22c55e 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "4rem 2.5rem", color: "#fff" }}>
          <span className="badge" style={{ marginBlockEnd: "1rem", display: "inline-block" }}>🆓 {dict.free_things_title}</span>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, lineHeight: 1.15, marginBlockEnd: "1rem" }}>{dict.free_things_title}</h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.85, maxWidth: 600 }}>{dict.free_things_desc}</p>
        </div>
      </section>

      {/* Category Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBlockEnd: "2rem" }}>
        {categories.map((cat) => (
          <span key={cat} className="badge" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem", textTransform: "capitalize" }}>{cat}</span>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {freeThings.map((item) => (
          <div key={item.id} className="card" style={{ overflow: "hidden" }}>
            <div style={{ position: "relative", paddingBlockStart: "56.25%", overflow: "hidden" }}>
              <OptImage src={item.image} alt={item.title} sizes="300px" />
              <span style={{
                position: "absolute", top: 12, right: 12,
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                color: "#fff", fontWeight: 700, fontSize: "0.85rem",
                padding: "0.4rem 0.8rem", borderRadius: "var(--radius-sm)",
              }}>
                🆓 FREE
              </span>
              <span className="badge" style={{ position: "absolute", bottom: 12, left: 12 }}>{item.category}</span>
            </div>
            <div style={{ padding: "1.25rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBlockEnd: "0.5rem" }}>{item.title}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.5, marginBlockEnd: "0.5rem" }}>{item.description}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>📍 {item.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
