"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { locales, localeNames, localeFlags, type Locale } from "@/lib/i18n/config";
import CartBadge from "@/components/CartBadge";
import { useAuth } from "@/lib/auth-context";

interface HeaderProps {
  locale: Locale;
  dict: Record<string, string>;
}

export default function Header({ locale, dict }: HeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Dışarı tıklayınca dropdown kapansın
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function switchLocale(newLocale: Locale) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    return segments.join("/") || `/${newLocale}`;
  }

  const navLinks = [
    { href: `/${locale}`, label: dict.nav_home },
    { href: `/${locale}/news`, label: dict.nav_news },
    { href: `/${locale}/whats-on`, label: dict.nav_whats_on || "What's On" },
    { href: `/${locale}/where-to-stay`, label: dict.nav_where_to_stay || "Stay" },
    { href: `/${locale}/eat-drink`, label: dict.nav_eat_drink || "Eat & Drink" },
    { href: `/${locale}/deals`, label: dict.nav_deals || "Deals" },
    { href: `/${locale}/neighbourhoods`, label: dict.nav_neighbourhoods || "Areas" },
    { href: `/${locale}/ideas`, label: dict.nav_ideas || "Ideas" },
    { href: `/${locale}/free-things`, label: dict.nav_free_things || "Free" },
    { href: `/${locale}/visitor-info`, label: dict.nav_visitor_info || "Info" },
    { href: `/${locale}/products`, label: dict.nav_products },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === `/${locale}`;
    return pathname.startsWith(href);
  };

  return (
    <header className="glass" style={{ position: "sticky", top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "var(--header-height)" }}>
        {/* Logo */}
        <Link href={`/${locale}`} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="text-gradient" style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Manchester
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.1rem", overflowX: "auto", maxWidth: "60vw" }} className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "0.4rem 0.7rem",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.8rem",
                fontWeight: isActive(link.href) ? 600 : 400,
                color: isActive(link.href) ? "var(--color-sky)" : "var(--color-text-secondary)",
                background: isActive(link.href) ? "rgba(108, 171, 221, 0.08)" : "transparent",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side: cart + locale + mobile toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Cart Link */}
          <CartBadge locale={locale} />

          {/* Auth */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                👤 {user.name}
              </span>
              <button
                onClick={logout}
                style={{
                  fontSize: "0.75rem", fontWeight: 600, padding: "0.3rem 0.75rem",
                  borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)",
                  background: "transparent", color: "var(--color-text-secondary)", cursor: "pointer",
                }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href={`/${locale}/login`}
              style={{
                fontSize: "0.8rem", fontWeight: 600, padding: "0.35rem 0.9rem",
                borderRadius: "var(--radius-sm)", border: "1px solid var(--color-sky)",
                color: "var(--color-sky)", textDecoration: "none", whiteSpace: "nowrap",
              }}
            >
              Sign in
            </Link>
          )}

          {/* Locale Switcher — dropdown */}
          <div ref={langRef} style={{ position: "relative" }}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.3rem 0.6rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                background: "transparent",
                color: "var(--color-text)",
                cursor: "pointer",
                fontSize: "0.82rem",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: "1rem" }}>{localeFlags[locale]}</span>
              <span style={{ color: "var(--color-text-secondary)" }}>{localeNames[locale]}</span>
              <span style={{ fontSize: "0.6rem", color: "var(--color-text-muted)", marginLeft: "0.1rem" }}>
                {langOpen ? "▲" : "▼"}
              </span>
            </button>

            {langOpen && (
              <div
                role="listbox"
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  minWidth: "140px",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  overflow: "hidden",
                  zIndex: 200,
                }}
              >
                {locales.map((l) => (
                  <Link
                    key={l}
                    href={switchLocale(l)}
                    role="option"
                    aria-selected={l === locale}
                    onClick={() => setLangOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      padding: "0.55rem 0.9rem",
                      fontSize: "0.85rem",
                      fontWeight: l === locale ? 600 : 400,
                      color: l === locale ? "var(--color-sky)" : "var(--color-text-secondary)",
                      background: l === locale ? "rgba(108,171,221,0.08)" : "transparent",
                      textDecoration: "none",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) => {
                      if (l !== locale) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      if (l !== locale) (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    <span style={{ fontSize: "1.1rem" }}>{localeFlags[l]}</span>
                    <span>{localeNames[l]}</span>
                    {l === locale && <span style={{ marginLeft: "auto", fontSize: "0.75rem" }}>✓</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-toggle"
            aria-label="Menu"
            style={{
              display: "none",
              background: "transparent",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              padding: "0.4rem 0.6rem",
              color: "var(--color-text)",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="glass mobile-menu"
          style={{
            position: "absolute",
            top: "var(--header-height)",
            left: 0,
            right: 0,
            padding: "1rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-sm)",
                fontSize: "1rem",
                fontWeight: isActive(link.href) ? 600 : 400,
                color: isActive(link.href) ? "var(--color-sky)" : "var(--color-text-secondary)",
                background: isActive(link.href) ? "rgba(108, 171, 221, 0.08)" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
          {/* Mobile Auth */}
          {user ? (
            <div style={{ borderTop: "1px solid var(--color-border)", paddingBlockStart: "0.75rem", marginBlockStart: "0.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>👤 {user.name}</span>
              <button onClick={() => { logout(); setMenuOpen(false); }} style={{ fontSize: "0.85rem", fontWeight: 600, padding: "0.4rem 1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "transparent", color: "var(--color-text-secondary)", cursor: "pointer" }}>
                Sign out
              </button>
            </div>
          ) : (
            <Link href={`/${locale}/login`} onClick={() => setMenuOpen(false)} style={{ padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", fontSize: "1rem", fontWeight: 600, color: "var(--color-sky)", display: "block", borderTop: "1px solid var(--color-border)", marginBlockStart: "0.25rem" }}>
              🔑 Sign In
            </Link>
          )}

          {/* Mobile Language Selector */}
          <div style={{ borderTop: "1px solid var(--color-border)", paddingBlockStart: "0.75rem", marginBlockStart: "0.25rem" }}>
            <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.5rem", paddingInline: "0.5rem" }}>
              🌐 Language
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.35rem" }}>
              {locales.map((l) => (
                <Link
                  key={l}
                  href={switchLocale(l)}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.85rem",
                    fontWeight: l === locale ? 600 : 400,
                    color: l === locale ? "var(--color-sky)" : "var(--color-text-secondary)",
                    background: l === locale ? "rgba(108,171,221,0.08)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${l === locale ? "rgba(108,171,221,0.3)" : "var(--color-border)"}`,
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{localeFlags[l]}</span>
                  <span>{localeNames[l]}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
}
