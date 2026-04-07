import Link from "next/link";

type Props = { params: Promise<{ locale: string }> };

export default async function UnderConstructionPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      {/* Animated icon */}
      <div style={{ fontSize: "5rem", marginBottom: "1.5rem", animation: "spin 4s linear infinite" }}>
        ⚙️
      </div>

      <h1
        style={{
          fontSize: "clamp(1.8rem, 5vw, 3rem)",
          fontWeight: 800,
          background: "linear-gradient(135deg, #6cabdd, #f0b429)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "1rem",
        }}
      >
        Under Construction
      </h1>

      <p
        style={{
          fontSize: "1.1rem",
          color: "var(--color-text-secondary)",
          maxWidth: "480px",
          lineHeight: 1.7,
          marginBottom: "2.5rem",
        }}
      >
        Bu sayfa yakında hizmetinize açılacak. <br />
        Çalışmalarımız devam ediyor, kısa süre içinde burada olacağız! 🚀
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href={`/${locale}`}
          style={{
            padding: "0.75rem 1.75rem",
            borderRadius: "var(--radius)",
            background: "var(--color-sky)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.95rem",
            textDecoration: "none",
          }}
        >
          ← Ana Sayfa
        </Link>
        <Link
          href={`/${locale}/news`}
          style={{
            padding: "0.75rem 1.75rem",
            borderRadius: "var(--radius)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-secondary)",
            fontWeight: 500,
            fontSize: "0.95rem",
            textDecoration: "none",
          }}
        >
          Haberleri Oku
        </Link>
      </div>

      <style>{`
        @keyframes spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
