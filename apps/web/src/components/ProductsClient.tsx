"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { ProductRow } from "@/lib/data";
import OptImage from "@/components/OptImage";

interface ProductsClientProps {
  products: ProductRow[];
  locale: string;
  dict: Record<string, string>;
}

export default function ProductsClient({ products, locale, dict }: ProductsClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  );

  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? products
        : products.filter((p) => p.category === activeCategory),
    [products, activeCategory]
  );

  return (
    <>
      {/* Category Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBlockEnd: "2rem" }}>
        {/* "Tümü" butonu */}
        <button
          onClick={() => setActiveCategory("all")}
          className="badge"
          style={{
            fontSize: "0.85rem",
            padding: "0.5rem 1rem",
            textTransform: "capitalize",
            cursor: "pointer",
            border: "none",
            background: activeCategory === "all" ? "var(--color-sky)" : undefined,
            color: activeCategory === "all" ? "#fff" : undefined,
            fontWeight: activeCategory === "all" ? 700 : 400,
          }}
        >
          All ({products.length})
        </button>

        {categories.map((cat) => {
          const count = products.filter((p) => p.category === cat).length;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="badge"
              style={{
                fontSize: "0.85rem",
                padding: "0.5rem 1rem",
                textTransform: "capitalize",
                cursor: "pointer",
                border: "none",
                background: isActive ? "var(--color-sky)" : undefined,
                color: isActive ? "#fff" : undefined,
                fontWeight: isActive ? 700 : 400,
                transition: "all 0.15s ease",
              }}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Sonuç sayısı */}
      <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBlockEnd: "1.25rem" }}>
        {filtered.length} {filtered.length === 1 ? "product" : "products"}
        {activeCategory !== "all" && ` in "${activeCategory}"`}
      </p>

      {/* Products Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {filtered.map((product) => (
          <Link
            key={product.id}
            href={`/${locale}/shop/${product.product_slug}`}
            className="card"
            style={{ overflow: "hidden", textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                position: "relative",
                paddingBlockStart: "100%",
                overflow: "hidden",
                background: "#1e293b",
              }}
            >
              <OptImage
                src={product.product_image}
                alt={product.product_name}
                sizes="240px"
              />
              <span
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  zIndex: 1,
                  background: "rgba(0,0,0,0.8)",
                  color: "#f0b429",
                  padding: "0.3rem 0.75rem",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                }}
              >
                {product.price_display}
              </span>
              <span
                className="badge"
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  zIndex: 1,
                  fontSize: "0.7rem",
                  textTransform: "capitalize",
                }}
              >
                {product.category}
              </span>
              {!product.in_stock && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                  }}
                >
                  {dict.shop_out_of_stock}
                </div>
              )}
            </div>
            <div style={{ padding: "1rem" }}>
              <h3
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  marginBlockEnd: "0.3rem",
                  lineHeight: 1.35,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {product.product_name}
              </h3>
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                {dict.partner_via} {product.partner_name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
