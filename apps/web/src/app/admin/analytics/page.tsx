import { query } from "@/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Analytics — Admin" };
export const revalidate = 0; // Her istekte taze veri

type Row = Record<string, string | number | null>;

export default async function AdminAnalyticsPage() {
  // ── Özet kartlar ──
  const [totals] = await query<Row>(`
    SELECT
      COUNT(*) AS total,
      COUNT(CASE WHEN date(created_at) = date('now') THEN 1 END) AS today,
      COUNT(CASE WHEN date(created_at) >= date('now', '-7 days') THEN 1 END) AS week,
      COUNT(CASE WHEN date(created_at) >= date('now', '-30 days') THEN 1 END) AS month,
      COUNT(DISTINCT ip_hash) AS unique_ips
    FROM page_views
  `);

  // ── Son 30 günlük günlük trafik ──
  const daily = await query<Row>(`
    SELECT date(created_at) AS day, COUNT(*) AS views
    FROM page_views
    WHERE created_at >= datetime('now', '-30 days')
    GROUP BY day
    ORDER BY day ASC
  `);

  // ── En çok ziyaret edilen sayfalar (top 20) ──
  const topPages = await query<Row>(`
    SELECT path, COUNT(*) AS views
    FROM page_views
    GROUP BY path
    ORDER BY views DESC
    LIMIT 20
  `);

  // ── Locale dağılımı ──
  const byLocale = await query<Row>(`
    SELECT locale, COUNT(*) AS views
    FROM page_views
    GROUP BY locale
    ORDER BY views DESC
  `);

  // ── Son 50 ziyaret ──
  const recent = await query<Row>(`
    SELECT path, locale, referrer, created_at
    FROM page_views
    ORDER BY created_at DESC
    LIMIT 50
  `);

  const maxDaily = Math.max(...daily.map((r) => Number(r.views)), 1);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: "1100px", margin: "0 auto", color: "#e2e8f0" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff" }}>📊 Site Analytics</h1>
        <p style={{ color: "#94a3b8", marginTop: "0.25rem" }}>Kendi veritabanından, üçüncü taraf yok</p>
      </div>

      {/* ── Özet Kartlar ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Bugün", value: totals?.today ?? 0, icon: "📅" },
          { label: "Bu Hafta", value: totals?.week ?? 0, icon: "📆" },
          { label: "Bu Ay", value: totals?.month ?? 0, icon: "🗓️" },
          { label: "Toplam", value: totals?.total ?? 0, icon: "📈" },
          { label: "Tekil IP", value: totals?.unique_ips ?? 0, icon: "👤" },
        ].map((card) => (
          <div key={card.label} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "1.25rem" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{card.icon}</div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#6cabdd" }}>{Number(card.value).toLocaleString()}</div>
            <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.25rem" }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* ── Günlük Trafik Grafiği (CSS bar chart) ── */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "#cbd5e1" }}>Son 30 Gün — Günlük Trafik</h2>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "120px" }}>
          {daily.map((row) => {
            const pct = (Number(row.views) / maxDaily) * 100;
            const day = String(row.day).slice(5); // MM-DD
            return (
              <div key={String(row.day)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <span style={{ fontSize: "0.6rem", color: "#64748b" }}>{Number(row.views)}</span>
                <div
                  title={`${row.day}: ${row.views} görüntüleme`}
                  style={{ width: "100%", height: `${Math.max(pct, 2)}%`, background: "linear-gradient(to top, #6cabdd, #a5d0f0)", borderRadius: "3px 3px 0 0", minHeight: "4px" }}
                />
                <span style={{ fontSize: "0.55rem", color: "#475569", writingMode: "vertical-lr", transform: "rotate(180deg)", height: "28px" }}>{day}</span>
              </div>
            );
          })}
          {daily.length === 0 && <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Henüz veri yok</p>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* ── Top Sayfalar ── */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "#cbd5e1" }}>🔝 En Çok Ziyaret Edilen Sayfalar</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <th style={{ textAlign: "left", padding: "0.4rem 0.5rem", color: "#64748b", fontWeight: 500 }}>Sayfa</th>
                <th style={{ textAlign: "right", padding: "0.4rem 0.5rem", color: "#64748b", fontWeight: 500 }}>Görüntüleme</th>
              </tr>
            </thead>
            <tbody>
              {topPages.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "0.4rem 0.5rem", color: "#94a3b8", fontFamily: "monospace", fontSize: "0.78rem", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {String(row.path)}
                  </td>
                  <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", color: "#6cabdd", fontWeight: 600 }}>
                    {Number(row.views).toLocaleString()}
                  </td>
                </tr>
              ))}
              {topPages.length === 0 && (
                <tr><td colSpan={2} style={{ color: "#64748b", padding: "1rem 0.5rem", textAlign: "center" }}>Henüz veri yok</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Locale Dağılımı ── */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "#cbd5e1" }}>🌐 Dil Dağılımı</h2>
          {byLocale.map((row) => {
            const pct = totals?.total ? Math.round((Number(row.views) / Number(totals.total)) * 100) : 0;
            const flags: Record<string, string> = { en: "🇬🇧", ar: "🇸🇦", he: "🇮🇱", es: "🇪🇸" };
            return (
              <div key={String(row.locale)} style={{ marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", fontSize: "0.85rem" }}>
                  <span>{flags[String(row.locale)] ?? "🌐"} {String(row.locale).toUpperCase()}</span>
                  <span style={{ color: "#6cabdd", fontWeight: 600 }}>{Number(row.views).toLocaleString()} <span style={{ color: "#475569", fontWeight: 400 }}>({pct}%)</span></span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "4px", height: "6px" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "#6cabdd", borderRadius: "4px" }} />
                </div>
              </div>
            );
          })}
          {byLocale.length === 0 && <p style={{ color: "#64748b", fontSize: "0.85rem" }}>Henüz veri yok</p>}
        </div>
      </div>

      {/* ── Son Ziyaretler ── */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "#cbd5e1" }}>🕐 Son 50 Ziyaret</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["Zaman", "Sayfa", "Dil", "Referrer"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "0.4rem 0.75rem", color: "#64748b", fontWeight: 500, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "0.4rem 0.75rem", color: "#475569", whiteSpace: "nowrap" }}>{String(row.created_at).replace("T", " ").slice(0, 16)}</td>
                  <td style={{ padding: "0.4rem 0.75rem", color: "#94a3b8", fontFamily: "monospace", maxWidth: "280px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{String(row.path)}</td>
                  <td style={{ padding: "0.4rem 0.75rem", color: "#cbd5e1" }}>{String(row.locale).toUpperCase()}</td>
                  <td style={{ padding: "0.4rem 0.75rem", color: "#475569", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.referrer ? String(row.referrer) : "—"}</td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr><td colSpan={4} style={{ color: "#64748b", padding: "1rem 0.75rem", textAlign: "center" }}>Henüz veri yok — sayfaları ziyaret et</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "#334155", textAlign: "center" }}>
        Bu sayfa sadece sen görebilirsin — /admin/analytics
      </p>
    </div>
  );
}
