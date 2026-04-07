import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getDeals } from "@/lib/data";
import OptImage from "@/components/OptImage";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const BASE_URL = "https://www.m.city";
  const canonicalUrl = `${BASE_URL}/${locale}/deals`;
  return {
    title: dict.deals_title,
    description: dict.deals_desc,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "m.city",
      title: `${dict.deals_title} — m.city`,
      description: dict.deals_desc,
      images: [{ url: `${BASE_URL}/og-default.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${dict.deals_title} — m.city`,
      description: dict.deals_desc,
      images: [`${BASE_URL}/og-default.jpg`],
    },
  };
}

export default async function DealsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const deals = await getDeals(locale);

  return (
    <div style={{ maxWidth: 1200, marginInline: "auto", padding: "2rem 1.5rem" }}>
      <Link href={`/${locale}`} style={{ display: "inline-block", fontSize: "0.9rem", color: "var(--color-sky)", marginBlockEnd: "1.5rem", fontWeight: 500 }}>
        {dict.back_to_home}
      </Link>

      {/* Hero */}
      <section style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBlockEnd: "3rem", minHeight: 300 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a0a2e 0%, #5b21b6 50%, #7c3aed 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "4rem 2.5rem", color: "#fff" }}>
          <span className="badge" style={{ marginBlockEnd: "1rem", display: "inline-block" }}>🏷️ {dict.deals_title}</span>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, lineHeight: 1.15, marginBlockEnd: "1rem" }}>{dict.deals_title}</h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.85, maxWidth: 600 }}>{dict.deals_desc}</p>
        </div>
      </section>

      {/* Deals Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {deals.map((deal) => (
          <div key={deal.id} className="card" style={{ overflow: "hidden", position: "relative" }}>
            <div style={{ position: "relative", paddingBlockStart: "56.25%", overflow: "hidden" }}>
              <OptImage src={deal.image} alt={deal.title} sizes="320px" />
              {/* Discount badge */}
              <span style={{
                position: "absolute", top: 12, right: 12,
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                color: "#fff", fontWeight: 800, fontSize: "0.95rem",
                padding: "0.5rem 1rem", borderRadius: "var(--radius-sm)",
                boxShadow: "0 4px 12px rgba(239,68,68,0.4)",
              }}>
                {deal.discount_text}
              </span>
            </div>
            <div style={{ padding: "1.25rem" }}>
              <span className="badge" style={{ marginBlockEnd: "0.5rem", display: "inline-block" }}>{deal.category}</span>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBlockEnd: "0.5rem" }}>{deal.title}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBlockEnd: "0.75rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{deal.description}</p>
              
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBlockEnd: "0.75rem" }}>
                {deal.original_price && <span style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", textDecoration: "line-through" }}>{deal.original_price}</span>}
                {deal.deal_price && <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-accent)" }}>{deal.deal_price}</span>}
              </div>
              
              {deal.valid_until && <p style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>⏰ {dict.deals_valid_until} {new Date(deal.valid_until).toLocaleDateString(locale)}</p>}
              
              {deal.deal_url && (
                <a href={deal.deal_url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: "inline-block", marginBlockStart: "1rem", padding: "0.6rem 1.5rem", fontSize: "0.9rem", borderRadius: "var(--radius-sm)", textDecoration: "none" }}>
                  {dict.deals_get_deal}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
