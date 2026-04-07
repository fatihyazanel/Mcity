import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getProducts } from "@/lib/data";
import OptImage from "@/components/OptImage";

interface ProductCarouselProps {
  dict: Record<string, string>;
  locale: Locale;
}

export default async function ProductCarousel({ dict, locale }: ProductCarouselProps) {
  const products = await getProducts(locale, 12);

  const featured = products[0];
  const rest = products.slice(1);

  if (!featured) return null;

  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">{dict.products_title}</h2>
        <Link href={`/${locale}/products`} className="section-link">
          {dict.products_all} →
        </Link>
      </div>

      <div className="news-magazine">
        {/* Featured Product — büyük kart */}
        <div className="card card-featured" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ position: "relative", flex: 1, minHeight: "260px", overflow: "hidden", background: "#0f1629" }}>
            <OptImage src={featured.product_image} alt={featured.product_name} sizes="(max-width: 768px) 100vw, 50vw" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,14,26,0.9) 0%, transparent 55%)", zIndex: 1 }} />
            {/* Fiyat badge */}
            <div style={{
              position: "absolute", top: "0.75rem", right: "0.75rem", zIndex: 2,
              background: "rgba(10,14,26,0.85)", backdropFilter: "blur(8px)",
              padding: "0.35rem 0.85rem", borderRadius: "100px",
              border: "1px solid rgba(240,180,41,0.4)",
            }}>
              <span className="price-tag" style={{ fontSize: "1rem" }}>{featured.price_display}</span>
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.5rem", zIndex: 2 }}>
              {/* Etsy badge */}
              {featured.affiliate_link && (
                <span className="badge badge-sky" style={{ marginBlockEnd: "0.75rem", display: "inline-block" }}>
                  🛍 {featured.partner_name}
                </span>
              )}
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, lineHeight: 1.25, marginBlockEnd: "0.5rem" }}>
                {featured.product_name}
              </h3>
              <p style={{
                fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.5,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                marginBlockEnd: "1rem",
              }}>
                {featured.description_short}
              </p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {featured.affiliate_link && (
                  <a
                    href={featured.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="btn btn-primary"
                    style={{ padding: "0.45rem 1.2rem", fontSize: "0.85rem" }}
                  >
                    🛒 Etsy&apos;de Gör →
                  </a>
                )}
                <Link
                  href={`/${locale}/shop/${featured.product_slug}`}
                  className="btn"
                  style={{ padding: "0.45rem 1rem", fontSize: "0.85rem", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  {dict.products_view}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Küçük ürün kartları */}
        {rest.map((product) => (
          <div key={product.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ position: "relative", paddingBlockStart: "65%", overflow: "hidden", background: "#0f1629" }}>
              <OptImage src={product.product_image} alt={product.product_name} sizes="(max-width: 768px) 100vw, 33vw" />
              <div style={{
                position: "absolute", top: "0.6rem", right: "0.6rem", zIndex: 1,
                background: "rgba(10,14,26,0.85)", backdropFilter: "blur(8px)",
                padding: "0.25rem 0.65rem", borderRadius: "100px",
                border: "1px solid rgba(240,180,41,0.35)",
              }}>
                <span className="price-tag" style={{ fontSize: "0.85rem" }}>{product.price_display}</span>
              </div>
            </div>
            <div style={{ padding: "1rem 1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
              <div className="meta-row" style={{ marginBlockEnd: "0.4rem" }}>
                <span style={{ color: "var(--color-sky)", fontWeight: 600, fontSize: "0.72rem" }}>
                  🛍 {product.partner_name}
                </span>
              </div>
              <h3 style={{
                fontSize: "0.9rem", fontWeight: 600, lineHeight: 1.35, marginBlockEnd: "0.5rem",
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {product.product_name}
              </h3>
              <p style={{
                fontSize: "0.78rem", color: "var(--color-text-secondary)", lineHeight: 1.45,
                marginBlockEnd: "0.75rem",
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {product.description_short}
              </p>
              <div style={{ marginBlockStart: "auto", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {product.affiliate_link && (
                  <a
                    href={product.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="btn btn-primary"
                    style={{ flex: 1, textAlign: "center", padding: "0.35rem 0.75rem", fontSize: "0.78rem" }}
                  >
                    🛒 Etsy →
                  </a>
                )}
                <Link
                  href={`/${locale}/shop/${product.product_slug}`}
                  className="btn"
                  style={{ flex: 1, textAlign: "center", padding: "0.35rem 0.75rem", fontSize: "0.78rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  {dict.products_view}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
