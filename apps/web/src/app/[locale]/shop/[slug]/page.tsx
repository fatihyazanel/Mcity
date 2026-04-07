import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getProductBySlug, getProducts, getAllProductSlugs } from "@/lib/data";
import AddToCartButton from "@/components/AddToCartButton";
import OptImage from "@/components/OptImage";

export async function generateStaticParams() {
  return (await getAllProductSlugs()).map(({ slug, locale }) => ({ locale, slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(locale, slug);
  if (!product) return { title: "Shop — m.city" };
  const BASE_URL = "https://www.m.city";
  const canonicalUrl = `${BASE_URL}/${locale}/shop/${slug}`;
  return {
    title: product.product_name,
    description: product.description_short,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "m.city",
      title: `${product.product_name} — m.city Shop`,
      description: product.description_short,
      images: [{ url: product.product_image, width: 800, height: 800, alt: product.product_name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.product_name,
      description: product.description_short,
      images: [product.product_image],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);
  const product = await getProductBySlug(locale, slug);

  if (!product) notFound();

  const relatedProducts = (await getProducts(locale, 8)).filter((p) => p.product_slug !== slug).slice(0, 4);

  return (
    <div style={{ maxWidth: 1100, marginInline: "auto", padding: "2rem 1.5rem" }}>
      <Link href={`/${locale}/products`} style={{ display: "inline-block", fontSize: "0.9rem", color: "var(--color-sky)", marginBlockEnd: "1.5rem", fontWeight: 500 }}>
        ← {dict.products_all}
      </Link>

      {/* Product Detail */}
      <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, overflow: "hidden" }}>
        <div style={{ position: "relative", minHeight: 400 }}>
          <OptImage src={product.product_image} alt={product.product_name} priority sizes="50vw" />
          {product.in_stock ? (
            <span style={{ position: "absolute", top: 16, right: 16, background: "#22c55e", color: "#fff", padding: "0.3rem 0.75rem", borderRadius: "var(--radius-sm)", fontSize: "0.8rem", fontWeight: 600 }}>
              {dict.shop_in_stock}
            </span>
          ) : (
            <span style={{ position: "absolute", top: 16, right: 16, background: "#ef4444", color: "#fff", padding: "0.3rem 0.75rem", borderRadius: "var(--radius-sm)", fontSize: "0.8rem", fontWeight: 600 }}>
              {dict.shop_out_of_stock}
            </span>
          )}
        </div>

        <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span className="badge" style={{ marginBlockEnd: "0.75rem", alignSelf: "flex-start" }}>{product.category}</span>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, lineHeight: 1.2, marginBlockEnd: "1rem" }}>{product.product_name}</h1>
          <p style={{ fontSize: "1rem", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBlockEnd: "1.5rem" }}>{product.description_short}</p>

          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-accent)", marginBlockEnd: "0.5rem" }}>{product.price_display}</div>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBlockEnd: "1.5rem" }}>{dict.partner_via} {product.partner_name}</p>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <AddToCartButton
              productId={product.id}
              productSlug={product.product_slug}
              productName={product.product_name}
              priceAmount={product.price_amount}
              productImage={product.product_image}
              label={dict.shop_add_to_cart}
            />
            <a
              href={product.affiliate_link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "0.9rem 2rem", fontSize: "1rem", fontWeight: 600,
                borderRadius: "var(--radius-sm)", textDecoration: "none",
                border: "1px solid var(--color-border)", color: "var(--color-text)",
                display: "inline-flex", alignItems: "center",
              }}
            >
              {dict.products_view} ↗
            </a>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section style={{ marginBlockStart: "3rem" }}>
          <h2 className="section-title" style={{ marginBlockEnd: "1.5rem" }}>{dict.shop_related}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {relatedProducts.map((p) => (
              <Link key={p.id} href={`/${locale}/shop/${p.product_slug}`} className="card" style={{ overflow: "hidden" }}>
                <div style={{ position: "relative", paddingBlockStart: "100%", overflow: "hidden" }}>
                  <OptImage src={p.product_image} alt={p.product_name} sizes="240px" />
                  <span style={{ position: "absolute", bottom: 12, right: 12, zIndex: 1, background: "rgba(0,0,0,0.75)", color: "#fff", padding: "0.3rem 0.75rem", borderRadius: "var(--radius-sm)", fontSize: "0.9rem", fontWeight: 700 }}>{p.price_display}</span>
                </div>
                <div style={{ padding: "1rem" }}>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 600 }}>{p.product_name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
