"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface CartItem {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState("en");
  const [items, setItems] = useState<CartItem[]>([]);
  const [step, setStep] = useState<"details" | "payment" | "confirmation">("details");
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", postcode: "", phone: "" });
  const [cardForm, setCardForm] = useState({ number: "", expiry: "", cvv: "" });

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
    const stored = localStorage.getItem("mcity-cart");
    if (stored) setItems(JSON.parse(stored));
  }, [params]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.removeItem("mcity-cart");
    setItems([]);
    // Notify CartBadge to refresh count
    window.dispatchEvent(new Event("cart-updated"));
    setStep("confirmation");
  };

  if (step === "confirmation") {
    return (
      <div style={{ maxWidth: 600, marginInline: "auto", padding: "4rem 1.5rem", textAlign: "center" }}>
        <div className="card" style={{ padding: "3rem" }}>
          <span style={{ fontSize: "4rem", display: "block", marginBlockEnd: "1rem" }}>✅</span>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBlockEnd: "0.75rem" }}>Order Confirmed!</h1>
          <p style={{ color: "var(--color-text-secondary)", marginBlockEnd: "0.5rem" }}>Thank you for your order, {form.name}.</p>
          <p style={{ color: "var(--color-text-secondary)", marginBlockEnd: "1.5rem" }}>A confirmation email has been sent to {form.email}.</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-accent)", marginBlockEnd: "1.5rem" }}>Total: £{total.toFixed(2)}</p>
          <Link href={`/${locale}`} className="btn-primary" style={{ display: "inline-block", padding: "0.8rem 2rem", textDecoration: "none", borderRadius: "var(--radius-sm)" }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, marginInline: "auto", padding: "2rem 1.5rem" }}>
      <Link href={`/${locale}/cart`} style={{ display: "inline-block", fontSize: "0.9rem", color: "var(--color-sky)", marginBlockEnd: "1.5rem", fontWeight: 500 }}>
        ← Back to Cart
      </Link>

      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBlockEnd: "2rem" }}>💳 Checkout</h1>

      {/* Progress Steps */}
      <div style={{ display: "flex", gap: "1rem", marginBlockEnd: "2rem" }}>
        <div style={{ flex: 1, padding: "0.75rem", borderRadius: "var(--radius-sm)", background: step === "details" ? "var(--color-sky)" : "var(--color-surface)", color: step === "details" ? "#fff" : "var(--color-text-secondary)", textAlign: "center", fontWeight: 600 }}>
          1. Details
        </div>
        <div style={{ flex: 1, padding: "0.75rem", borderRadius: "var(--radius-sm)", background: step === "payment" ? "var(--color-sky)" : "var(--color-surface)", color: step === "payment" ? "#fff" : "var(--color-text-secondary)", textAlign: "center", fontWeight: 600 }}>
          2. Payment
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem" }}>
        {/* Form */}
        <div>
          {step === "details" && (
            <form onSubmit={handleDetailsSubmit} className="card" style={{ padding: "2rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBlockEnd: "1.5rem" }}>Delivery Details</h2>
              {(["name", "email", "phone", "address", "city", "postcode"] as const).map((field) => (
                <div key={field} style={{ marginBlockEnd: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBlockEnd: "0.25rem", textTransform: "capitalize" }}>{field}</label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    required
                    style={{
                      width: "100%", padding: "0.7rem 0.9rem", borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--color-border)", background: "var(--color-surface)",
                      color: "var(--color-text)", fontSize: "0.95rem",
                    }}
                  />
                </div>
              ))}
              <button type="submit" className="btn-primary" style={{ width: "100%", padding: "0.9rem", fontSize: "1rem", fontWeight: 600, borderRadius: "var(--radius-sm)", cursor: "pointer", border: "none", marginBlockStart: "0.5rem" }}>
                Continue to Payment →
              </button>
            </form>
          )}

          {step === "payment" && (
            <form onSubmit={handlePaymentSubmit} className="card" style={{ padding: "2rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBlockEnd: "1.5rem" }}>Payment Information</h2>
              <div style={{ marginBlockEnd: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBlockEnd: "0.25rem" }}>Card Number</label>
                <input
                  type="text" placeholder="4242 4242 4242 4242" maxLength={19}
                  value={cardForm.number} onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                  required
                  style={{ width: "100%", padding: "0.7rem 0.9rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text)", fontSize: "0.95rem" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBlockEnd: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBlockEnd: "0.25rem" }}>Expiry Date</label>
                  <input
                    type="text" placeholder="MM/YY" maxLength={5}
                    value={cardForm.expiry} onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                    required
                    style={{ width: "100%", padding: "0.7rem 0.9rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text)", fontSize: "0.95rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBlockEnd: "0.25rem" }}>CVV</label>
                  <input
                    type="text" placeholder="123" maxLength={3}
                    value={cardForm.cvv} onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                    required
                    style={{ width: "100%", padding: "0.7rem 0.9rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text)", fontSize: "0.95rem" }}
                  />
                </div>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", marginBlockEnd: "1rem" }}>🔒 Your payment information is secure and encrypted.</p>
              <button type="submit" className="btn-primary" style={{ width: "100%", padding: "0.9rem", fontSize: "1rem", fontWeight: 600, borderRadius: "var(--radius-sm)", cursor: "pointer", border: "none" }}>
                Pay £{total.toFixed(2)} →
              </button>
            </form>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="card" style={{ padding: "1.5rem", alignSelf: "start" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBlockEnd: "1rem" }}>Order Summary</h3>
          {items.map((item) => (
            <div key={item.slug} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlockEnd: "0.75rem", fontSize: "0.85rem" }}>
              <span style={{ flex: 1, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{item.name} × {item.quantity}</span>
              <span style={{ fontWeight: 600, marginInlineStart: "0.5rem" }}>£{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <hr style={{ border: "none", borderTop: "1px solid var(--color-border)", margin: "1rem 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700 }}>Total</span>
            <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--color-accent)" }}>£{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
