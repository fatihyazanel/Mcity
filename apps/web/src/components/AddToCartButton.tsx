"use client";

import { useState } from "react";

interface AddToCartButtonProps {
  productId: number;
  productSlug: string;
  productName: string;
  priceAmount: number;
  productImage: string;
  label: string;
}

interface CartItem {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function AddToCartButton({
  productId,
  productSlug,
  productName,
  priceAmount,
  productImage,
  label,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    const stored = localStorage.getItem("mcity-cart");
    const cart: CartItem[] = stored ? JSON.parse(stored) : [];

    const existing = cart.find((item) => item.slug === productSlug);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: productId,
        slug: productSlug,
        name: productName,
        price: priceAmount,
        image: productImage,
        quantity: 1,
      });
    }

    localStorage.setItem("mcity-cart", JSON.stringify(cart));

    // Dispatch custom event so cart badge can update
    window.dispatchEvent(new Event("cart-updated"));

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="btn-primary"
      style={{
        padding: "0.9rem 2rem",
        fontSize: "1rem",
        fontWeight: 600,
        borderRadius: "var(--radius-sm)",
        cursor: "pointer",
        border: "none",
        transition: "all 0.2s ease",
        background: added ? "#22c55e" : undefined,
      }}
    >
      {added ? "✅ Added!" : `🛒 ${label}`}
    </button>
  );
}
