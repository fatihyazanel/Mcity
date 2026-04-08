"use client";

import { useState, useEffect, useCallback } from "react";

interface Review {
  id: number;
  reviewer_name: string;
  rating: number;
  review_text: string;
  locale: string;
  created_at: string;
}

interface Props {
  productId: number;
  locale: string;
  dict: Record<string, string>;
}

function Stars({ rating, interactive = false, onSelect }: {
  rating: number;
  interactive?: boolean;
  onSelect?: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <span style={{ display: "inline-flex", gap: "0.15rem" }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= (interactive ? (hovered || rating) : rating);
        return (
          <span
            key={n}
            onClick={() => interactive && onSelect?.(n)}
            onMouseEnter={() => interactive && setHovered(n)}
            onMouseLeave={() => interactive && setHovered(0)}
            style={{
              fontSize: "1.3rem",
              lineHeight: 1,
              cursor: interactive ? "pointer" : "default",
              color: filled ? "#f59e0b" : "rgba(255,255,255,0.15)",
              transition: "color 0.1s",
              userSelect: "none",
            }}
          >
            ★
          </span>
        );
      })}
    </span>
  );
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function ProductReviews({ productId, locale, dict }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews/${productId}`);
      const data = await res.json();
      setReviews(data.reviews ?? []);
      setAvg(data.avg ?? 0);
      setTotal(data.total ?? 0);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (rating === 0) { setFormError(dict.review_error_rating || "Please select a rating."); return; }
    if (name.trim().length < 2) { setFormError(dict.review_error_name || "Please enter your name."); return; }
    if (text.trim().length < 5) { setFormError(dict.review_error_text || "Review is too short."); return; }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/reviews/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewer_name: name, rating, review_text: text, locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Something went wrong.");
      } else {
        setSubmitted(true);
        setName(""); setRating(0); setText("");
        setShowForm(false);
        await fetchReviews();
      }
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Dağılım sayıları (1-5 yıldız)
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <section style={{ marginBlockStart: "3rem" }}>
      <style>{`
        .reviews-wrap { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 2rem; }
        .reviews-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 2rem; }
        .reviews-avg-block { display: flex; align-items: center; gap: 1.25rem; }
        .reviews-avg-num { font-size: 3.5rem; font-weight: 800; color: #f59e0b; line-height: 1; }
        .reviews-dist { flex: 1; min-width: 180px; display: flex; flex-direction: column; gap: 0.3rem; }
        .dist-row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #94a3b8; }
        .dist-bar-bg { flex: 1; height: 6px; background: rgba(255,255,255,0.07); border-radius: 3px; overflow: hidden; }
        .dist-bar-fill { height: 100%; background: #f59e0b; border-radius: 3px; transition: width 0.4s; }
        .write-review-btn {
          padding: 0.65rem 1.4rem; border-radius: 10px; font-size: 0.9rem; font-weight: 600;
          background: linear-gradient(135deg, #6cabdd, #4f8db8); color: #fff;
          border: none; cursor: pointer; white-space: nowrap;
        }
        .write-review-btn:hover { opacity: 0.88; }
        .review-form { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; }
        .review-form label { display: block; font-size: 0.82rem; color: #94a3b8; margin-bottom: 0.35rem; font-weight: 500; }
        .review-form input, .review-form textarea {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
          padding: 0.65rem 0.9rem; color: #e2e8f0; font-size: 0.9rem;
          outline: none; transition: border-color 0.15s; box-sizing: border-box;
          font-family: inherit;
        }
        .review-form input:focus, .review-form textarea:focus { border-color: #6cabdd; }
        .review-form textarea { resize: vertical; min-height: 90px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
        .submit-btn {
          padding: 0.7rem 2rem; border-radius: 8px; font-size: 0.9rem; font-weight: 600;
          background: #6cabdd; color: #fff; border: none; cursor: pointer;
        }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .form-error { color: #f87171; font-size: 0.82rem; margin-top: 0.5rem; }
        .review-card {
          padding: 1.25rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .review-card:last-child { border-bottom: none; }
        .review-meta { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
        .reviewer-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, #6cabdd, #3b6ea8);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.9rem; font-weight: 700; color: #fff; flex-shrink: 0;
        }
        .reviewer-name { font-size: 0.95rem; font-weight: 600; color: #e2e8f0; }
        .review-date { font-size: 0.78rem; color: #475569; margin-left: auto; }
        .review-text { font-size: 0.9rem; color: #94a3b8; line-height: 1.6; }
        .empty-state { text-align: center; padding: 2rem; color: #475569; font-size: 0.9rem; }
        .success-banner {
          background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25);
          border-radius: 8px; padding: 0.75rem 1rem; color: #4ade80;
          font-size: 0.88rem; margin-bottom: 1.5rem;
        }
      `}</style>

      <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.25rem" }}>
        {dict.reviews_title || "Customer Reviews"}
      </h2>

      <div className="reviews-wrap">

        {/* Özet + Yorum Yaz butonu */}
        <div className="reviews-header">
          <div className="reviews-avg-block">
            <div className="reviews-avg-num">{avg > 0 ? avg.toFixed(1) : "—"}</div>
            <div>
              <Stars rating={Math.round(avg)} />
              <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "0.3rem" }}>
                {total} {dict.reviews_count || "reviews"}
              </div>
            </div>
            {total > 0 && (
              <div className="reviews-dist">
                {dist.map(({ star, count }) => (
                  <div key={star} className="dist-row">
                    <span>{star}★</span>
                    <div className="dist-bar-bg">
                      <div
                        className="dist-bar-fill"
                        style={{ width: total > 0 ? `${(count / total) * 100}%` : "0%" }}
                      />
                    </div>
                    <span style={{ minWidth: 16, textAlign: "right" }}>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!submitted && (
            <button className="write-review-btn" onClick={() => setShowForm((v) => !v)}>
              {showForm
                ? (dict.reviews_cancel || "Cancel")
                : (dict.reviews_write || "Write a Review")}
            </button>
          )}
        </div>

        {/* Başarı mesajı */}
        {submitted && (
          <div className="success-banner">
            ✓ {dict.reviews_thanks || "Thank you! Your review has been submitted."}
          </div>
        )}

        {/* Yorum Formu */}
        {showForm && !submitted && (
          <form className="review-form" onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label>{dict.reviews_rating || "Your Rating"} *</label>
              <div style={{ marginTop: "0.25rem" }}>
                <Stars rating={rating} interactive onSelect={setRating} />
                {rating > 0 && (
                  <span style={{ fontSize: "0.78rem", color: "#94a3b8", marginLeft: "0.5rem" }}>
                    {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                  </span>
                )}
              </div>
            </div>

            <div className="form-row" style={{ marginBottom: "1rem" }}>
              <div>
                <label>{dict.reviews_name || "Your Name"} *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John D."
                  maxLength={80}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label>{dict.reviews_comment || "Your Review"} *</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={dict.reviews_placeholder || "Share your experience with this product..."}
                maxLength={1000}
              />
              <div style={{ fontSize: "0.72rem", color: "#475569", marginTop: "0.25rem", textAlign: "right" }}>
                {text.length}/1000
              </div>
            </div>

            {formError && <div className="form-error">{formError}</div>}

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting
                ? (dict.reviews_submitting || "Submitting...")
                : (dict.reviews_submit || "Submit Review")}
            </button>
          </form>
        )}

        {/* Yorum listesi */}
        {loading ? (
          <div className="empty-state">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="empty-state">
            {dict.reviews_empty || "No reviews yet. Be the first to share your thoughts!"}
          </div>
        ) : (
          <div>
            {reviews.map((r) => (
              <div key={r.id} className="review-card">
                <div className="review-meta">
                  <div className="reviewer-avatar">
                    {r.reviewer_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="reviewer-name">{r.reviewer_name}</div>
                    <Stars rating={r.rating} />
                  </div>
                  <div className="review-date">{formatDate(r.created_at)}</div>
                </div>
                <p className="review-text">{r.review_text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
