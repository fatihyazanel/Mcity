"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function CartBadge({ locale }: { locale: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const stored = localStorage.getItem("mcity-cart");
      if (stored) {
        const items = JSON.parse(stored);
        setCount(items.reduce((sum: number, i: { quantity: number }) => sum + i.quantity, 0));
      } else {
        setCount(0);
      }
    };

    updateCount();
    window.addEventListener("cart-updated", updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("cart-updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  return (
    <Link
      href={`/${locale}/cart`}
      style={{
        position: "relative",
        fontSize: "1.3rem",
        color: "var(--color-text-secondary)",
        transition: "color 0.15s",
        textDecoration: "none",
      }}
      title="Cart"
    >
      🛒
      {count > 0 && (
        <span
          style={{
            position: "absolute",
            top: -6,
            right: -8,
            background: "#ef4444",
            color: "#fff",
            fontSize: "0.65rem",
            fontWeight: 700,
            borderRadius: "100px",
            minWidth: 16,
            height: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 4px",
          }}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
