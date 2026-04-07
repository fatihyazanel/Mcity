import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getNeighbourhoods } from "@/lib/data";
import OptImage from "@/components/OptImage";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return { title: `${dict.neighbourhoods_title} — m.city` };
}

export default async function NeighbourhoodsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const neighbourhoods = await getNeighbourhoods(locale);

  return (
    <div style={{ maxWidth: 1200, marginInline: "auto", padding: "2rem 1.5rem" }}>
      <Link href={`/${locale}`} style={{ display: "inline-block", fontSize: "0.9rem", color: "var(--color-sky)", marginBlockEnd: "1.5rem", fontWeight: 500 }}>
        {dict.back_to_home}
      </Link>

      {/* Hero */}
      <section style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBlockEnd: "3rem", minHeight: 340 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #10b981 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "4rem 2.5rem", color: "#fff" }}>
          <span className="badge" style={{ marginBlockEnd: "1rem", display: "inline-block" }}>🏘️ {dict.neighbourhoods_title}</span>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, lineHeight: 1.15, marginBlockEnd: "1rem" }}>{dict.neighbourhoods_title}</h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.85, maxWidth: 600 }}>{dict.neighbourhoods_desc}</p>
        </div>
      </section>

      {/* Neighbourhood Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "2rem" }}>
        {neighbourhoods.map((nh) => {
          const highlights = nh.highlights.split("|");
          return (
            <div key={nh.id} className="card" style={{ overflow: "hidden" }}>
              <div style={{ position: "relative", paddingBlockStart: "56.25%", overflow: "hidden" }}>
                <OptImage src={nh.image} alt={nh.name} sizes="350px" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent 60%)" }} />
                <h3 style={{ position: "absolute", bottom: 16, left: 20, right: 20, color: "#fff", fontSize: "1.5rem", fontWeight: 700, zIndex: 1 }}>{nh.name}</h3>
              </div>
              <div style={{ padding: "1.25rem" }}>
                <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBlockEnd: "1rem" }}>{nh.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {highlights.map((h, i) => (
                    <span key={i} className="badge" style={{ fontSize: "0.8rem" }}>{h.trim()}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
