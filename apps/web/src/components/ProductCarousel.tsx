import type { Locale } from "@/lib/i18n/config";
import { mockProducts } from "@/lib/mock-data";

interface ProductCarouselProps {
  dict: Record<string, string>;
  locale: Locale;
}

export default function ProductCarousel({ dict, locale }: ProductCarouselProps) {
  return (
    <section id="products" style={{ paddingBlock: "2rem 3rem" }}>
      <h2 className="section-title">🛍️ {dict.products_title}</h2>
      <div className="product-scroll">
        {mockProducts.map((product) => (
          <div key={product.id} className="card product-card">
            <div style={{ position: "relative", paddingBlockStart: "100%", overflow: "hidden", background: "#1e293b" }}>
              <img
                src={product.product_image}
                alt={product.product_name}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div style={{ padding: "1rem" }}>
              <h3
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  marginBlockEnd: "0.5rem",
                  lineHeight: 1.35,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {product.product_name}
              </h3>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--color-text-secondary)",
                  marginBlockEnd: "0.75rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {product.description_short}
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, color: "var(--color-gold)", fontSize: "1.1rem" }}>
                  {product.price_display}
                </span>
                <a
                  href={product.affiliate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "0.8rem",
                    background: "var(--color-sky)",
                    color: "white",
                    padding: "0.4rem 0.85rem",
                    borderRadius: "6px",
                    fontWeight: 600,
                  }}
                >
                  {dict.products_view}
                </a>
              </div>
              <span
                style={{
                  display: "block",
                  marginBlockStart: "0.5rem",
                  fontSize: "0.7rem",
                  color: "var(--color-text-muted)",
                }}
              >
                via {product.partner_name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
