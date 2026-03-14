"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, localeFlags, type Locale } from "@/lib/i18n/config";

interface HeaderProps {
  locale: Locale;
  dict: Record<string, string>;
}

export default function Header({ locale, dict }: HeaderProps) {
  const pathname = usePathname();

  function switchLocale(newLocale: Locale) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    return segments.join("/") || `/${newLocale}`;
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(10, 14, 26, 0.95)",
        backdropFilter: "blur(12px)",
        borderBlockEnd: "1px solid var(--color-border)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          marginInline: "auto",
          padding: "0.75rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href={`/${locale}`} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.75rem", fontWeight: 800 }} className="text-gradient">
            m.city
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link href={`/${locale}`} style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
            {dict.nav_home}
          </Link>
          <Link href={`/${locale}#news`} style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
            {dict.nav_news}
          </Link>
          <Link href={`/${locale}#products`} style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
            {dict.nav_products}
          </Link>

          {/* Locale Switcher */}
          <div className="locale-switcher">
            {locales.map((l) => (
              <Link
                key={l}
                href={switchLocale(l)}
                className={`locale-btn ${l === locale ? "active" : ""}`}
                title={localeNames[l]}
              >
                {localeFlags[l]}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
