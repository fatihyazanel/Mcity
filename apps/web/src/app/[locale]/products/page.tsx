import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getProducts } from "@/lib/data";
import ProductsClient from "@/components/ProductsClient";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: `${dict.products_all} — m.city`,
    description: dict.hero_subtitle,
  };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const products = await getProducts(locale as Locale, 100);

  return (
    <div style={{ maxWidth: "1200px", marginInline: "auto", padding: "2rem 1.5rem" }}>
      <Link href={`/${locale}`} style={{ display: "inline-block", fontSize: "0.9rem", color: "var(--color-sky)", marginBlockEnd: "1.5rem", fontWeight: 500 }}>
        {dict.back_to_home}
      </Link>

      {/* Hero */}
      <section style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBlockEnd: "2rem", minHeight: 200 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #6cabdd 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "3rem 2.5rem", color: "#fff" }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, lineHeight: 1.15, marginBlockEnd: "0.75rem" }}>
            🛍️ {dict.products_all}
          </h1>
          <p style={{ fontSize: "1rem", opacity: 0.85 }}>{products.length} products</p>
        </div>
      </section>

      {/* Filtreli ürün listesi — Client Component */}
      <ProductsClient products={products} locale={locale} dict={dict} />
    </div>
  );
}
