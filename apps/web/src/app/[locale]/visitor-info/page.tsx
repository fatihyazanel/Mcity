import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getVisitorInfo } from "@/lib/data";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return { title: `${dict.visitor_info_title} — m.city` };
}

export default async function VisitorInfoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const info = await getVisitorInfo(locale);
  const categories = [...new Set(info.map((i) => i.category))];

  return (
    <div style={{ maxWidth: 1000, marginInline: "auto", padding: "2rem 1.5rem" }}>
      <Link href={`/${locale}`} style={{ display: "inline-block", fontSize: "0.9rem", color: "var(--color-sky)", marginBlockEnd: "1.5rem", fontWeight: 500 }}>
        {dict.back_to_home}
      </Link>

      {/* Hero */}
      <section style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBlockEnd: "3rem", minHeight: 300 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1e3a5f 0%, #0ea5e9 50%, #38bdf8 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "4rem 2.5rem", color: "#fff" }}>
          <span className="badge" style={{ marginBlockEnd: "1rem", display: "inline-block" }}>ℹ️ {dict.visitor_info_title}</span>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, lineHeight: 1.15, marginBlockEnd: "1rem" }}>{dict.visitor_info_title}</h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.85, maxWidth: 600 }}>{dict.visitor_info_desc}</p>
        </div>
      </section>

      {/* Info by Category */}
      {categories.map((cat) => (
        <section key={cat} style={{ marginBlockEnd: "2.5rem" }}>
          <h2 className="section-title" style={{ marginBlockEnd: "1rem", textTransform: "capitalize" }}>
            {cat === "transport" ? "🚆" : cat === "safety" ? "🛡️" : "📋"} {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </h2>
          <div style={{ display: "grid", gap: "1rem" }}>
            {info.filter((i) => i.category === cat).map((item) => (
              <div key={item.id} className="card" style={{ padding: "1.5rem", display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", alignItems: "start" }}>
                <span style={{ fontSize: "2rem" }}>{item.icon}</span>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBlockEnd: "0.5rem" }}>{item.title}</h3>
                  <p style={{ fontSize: "0.95rem", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
