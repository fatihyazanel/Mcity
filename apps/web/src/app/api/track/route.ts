import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { execute } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, locale } = body as { path?: string; locale?: string };

    if (!path) return NextResponse.json({ ok: false }, { status: 400 });

    // Bot filtresi — yaygın bot user-agent'ları atla
    const ua = req.headers.get("user-agent") ?? "";
    const isBot = /bot|crawler|spider|slurp|bingpreview|google|baidu|yandex|duckduck/i.test(ua);
    if (isBot) return NextResponse.json({ ok: false, reason: "bot" });

    // IP hash — kişisel veri saklamıyoruz, sadece hash
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";
    const ipHash = createHash("sha256").update(ip + "mcity_salt").digest("hex").slice(0, 16);

    const referrer = req.headers.get("referer") ?? null;

    await execute(
      `INSERT INTO page_views (path, locale, referrer, user_agent, ip_hash)
       VALUES (?, ?, ?, ?, ?)`,
      [
        path.slice(0, 255),
        (locale ?? "en").slice(0, 10),
        referrer ? referrer.slice(0, 255) : null,
        ua.slice(0, 255),
        ipHash,
      ]
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[track]", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
