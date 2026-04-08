import { NextRequest, NextResponse } from "next/server";
import { query, execute } from "@/lib/db";
import { createHash } from "crypto";

interface Review {
  id: number;
  reviewer_name: string;
  rating: number;
  review_text: string;
  locale: string;
  created_at: string;
}

// GET /api/reviews/[productId]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const id = parseInt(productId);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const reviews = await query<Review>(
    `SELECT id, reviewer_name, rating, review_text, locale, created_at
     FROM product_reviews
     WHERE product_id = ?
     ORDER BY created_at DESC
     LIMIT 50`,
    [id]
  );

  // Ortalama hesapla
  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  return NextResponse.json({ reviews, avg: Math.round(avg * 10) / 10, total: reviews.length });
}

// POST /api/reviews/[productId]
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const id = parseInt(productId);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  let body: { reviewer_name?: string; rating?: number; review_text?: string; locale?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { reviewer_name, rating, review_text, locale = "en" } = body;

  // Validasyon
  if (!reviewer_name || typeof reviewer_name !== "string" || reviewer_name.trim().length < 2) {
    return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 422 });
  }
  if (!review_text || typeof review_text !== "string" || review_text.trim().length < 5) {
    return NextResponse.json({ error: "Review must be at least 5 characters" }, { status: 422 });
  }
  if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1-5" }, { status: 422 });
  }

  // Basit IP hash (gizlilik)
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const ipHash = createHash("sha256").update(ip + "reviews-salt").digest("hex").slice(0, 16);

  // Aynı IP'den aynı ürüne günde 3'ten fazla yorum engelle
  const recentCount = await query<{ cnt: number }>(
    `SELECT COUNT(*) as cnt FROM product_reviews
     WHERE product_id = ? AND ip_hash = ? AND created_at > datetime('now', '-1 day')`,
    [id, ipHash]
  );
  if ((recentCount[0]?.cnt ?? 0) >= 3) {
    return NextResponse.json({ error: "Too many reviews from this IP" }, { status: 429 });
  }

  await execute(
    `INSERT INTO product_reviews (product_id, reviewer_name, rating, review_text, locale, ip_hash)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, reviewer_name.trim().slice(0, 80), rating, review_text.trim().slice(0, 1000), locale, ipHash]
  );

  return NextResponse.json({ success: true }, { status: 201 });
}
