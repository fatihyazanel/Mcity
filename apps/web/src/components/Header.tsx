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

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function switchLocale(newLocale: Locale) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    return segments.join("/") || "/" + newLocale;
  }

  const navLinks = [
    { href: "/" + locale,                label: dict.nav_home           || "Home"        },
    { href: "/" + locale + "/news",           label: dict.nav_news           || "News"        },
    { href: "/" + locale + "/whats-on",       label: dict.nav_whats_on       || "What'\''s On"   },
    { href: "/" + locale + "/where-to-stay",  label: dict.nav_where_to_stay  || "Stay"        },
    { href: "/" + locale + "/eat-drink",      label: dict.nav_eat_drink      || "Eat & Drink" },
    { href: "/" + locale + "/deals",          label: dict.nav_deals          || "Deals"       },
    { href: "/" + locale + "/neighbourhoods", label: dict.nav_neighbourhoods || "Areas"       },
    { href: "/" + locale + "/ideas",          label: dict.nav_ideas          || "Ideas"       },
    { href: "/" + locale + "/free-things",    label: dict.nav_free_things    || "Free"        },
    { href: "/" + locale + "/visitor-info",   label: dict.nav_visitor_info   || "Info"        },
    { href: "/" + locale + "/products",       label: dict.nav_products       || "Shop"        },
  ];

  const isActive = (href: string) =>
    href === "/" + locale ? pathname === "/" + locale : pathname.startsWith(href);

  return (
    <>
      <style>{`
        .mcity-header {
          position: sticky; top: 0; z-index: 100;
          background: rgba(10,14,26,0.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .mcity-header-inner {
          max-width: 1280px; margin: 0 auto; padding: 0 1.25rem;
          height: 60px; display: flex; align-items: center;
          justify-content: space-between; gap: 1rem;
        }
        .mcity-logo {
          font-size: 1.4rem; font-weight: 800; letter-spacing: -0.02em;
          background: linear-gradient(135deg, #6cabdd 0%, #a5d0f0 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          white-space: nowrap; flex-shrink: 0; text-decoration: none;
        }
        .mcity-nav {
          display: flex; align-items: center; gap: 0.1rem;
          overflow-x: auto; scrollbar-width: none; flex: 1; max-width: 55vw;
        }
        .mcity-nav::-webkit-scrollbar { display: none; }
        .mcity-nav-link {
          padding: 0.35rem 0.6rem; border-radius: 6px; font-size: 0.78rem;
          white-space: nowrap; text-decoration: none; color: #94a3b8;
          transition: all 0.15s; flex-shrink: 0;
        }
        .mcity-nav-link:hover { color: #e2e8f0; background: rgba(255,255,255,0.05); }
        .mcity-nav-link.active { color: #6cabdd; font-weight: 600; background: rgba(108,171,221,0.1); }
        .mcity-right {
          display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0;
        }
        .mcity-signin {
          font-size: 0.78rem; font-weight: 600; padding: 0.3rem 0.75rem;
          border-radius: 6px; border: 1px solid #6cabdd; color: #6cabdd;
          text-decoration: none; white-space: nowrap;
        }
        .mcity-lang-btn {
          display: flex; align-items: center; gap: 0.3rem;
          padding: 0.3rem 0.55rem; border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.12);
          background: transparent; color: #e2e8f0;
          cursor: pointer; font-size: 0.78rem; font-weight: 500; white-space: nowrap;
        }
        .mcity-lang-name { color: #94a3b8; }
        .mcity-lang-dropdown {
          position: absolute; top: calc(100% + 8px); right: 0; min-width: 145px;
          background: #0f172a; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; box-shadow: 0 8px 32px rgba(0,0,0,0.5);
          overflow: hidden; z-index: 300;
        }
        .mcity-lang-option {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.55rem 0.9rem; font-size: 0.85rem; color: #94a3b8;
          text-decoration: none; transition: background 0.12s;
        }
        .mcity-lang-option:hover { background: rgba(255,255,255,0.06); }
        .mcity-lang-option.active { color: #6cabdd; font-weight: 600; background: rgba(108,171,221,0.08); }
        .mcity-hamburger {
          display: none; align-items: center; gap: 0.35rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.13);
          border-radius: 8px; padding: 0.38rem 0.65rem;
          color: #e2e8f0; cursor: pointer; line-height: 1;
          font-size: 0.74rem; font-weight: 600; letter-spacing: 0.02em;
        }
        .mcity-hamburger-label { color: #cbd5e1; }
        .mcity-mobile-menu {
          display: none; position: fixed; top: 60px; left: 0; right: 0; bottom: 0;
          background: #0a0e1a; z-index: 200; overflow-y: auto;
          padding: 0.5rem 0 2rem; border-top: 1px solid rgba(255,255,255,0.08);
          flex-direction: column;
        }
        .mcity-mobile-link {
          display: flex; align-items: center; padding: 0.85rem 1.5rem;
          font-size: 1rem; color: #94a3b8; text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.12s, color 0.12s;
        }
        .mcity-mobile-link:hover { background: rgba(255,255,255,0.04); color: #e2e8f0; }
        .mcity-mobile-link.active { color: #6cabdd; font-weight: 600; background: rgba(108,171,221,0.06); }
        .mcity-mobile-section {
          padding: 1rem 1.5rem 0.5rem; font-size: 0.7rem;
          text-transform: uppercase; letter-spacing: 0.1em;
          color: #475569; font-weight: 600;
        }
        .mcity-mobile-lang-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 0.5rem; padding: 0 1.5rem;
        }
        .mcity-mobile-lang-btn {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.6rem 0.75rem; border-radius: 8px; font-size: 0.85rem;
          color: #94a3b8; text-decoration: none;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
        }
        .mcity-mobile-lang-btn.active {
          color: #6cabdd; font-weight: 600;
          background: rgba(108,171,221,0.08); border-color: rgba(108,171,221,0.3);
        }
        @media (max-width: 768px) {
          .mcity-nav { display: none; }
          .mcity-signin { display: none; }
          .mcity-lang-name { display: none; }
          .mcity-hamburger { display: flex; }
          .mcity-mobile-menu.open { display: flex; }
          .mcity-logo { font-size: 1.2rem; }
        }
      `}</style>

      <header className="mcity-header">
        <div className="mcity-header-inner">

          <Link href={"/" + locale} className="mcity-logo">Manchester</Link>

          <nav className="mcity-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={"mcity-nav-link" + (isActive(link.href) ? " active" : "")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Sıralama: Dil → Sepet → Giriş → Menu */}
          <div className="mcity-right">

            {/* 1. Dil seçici */}
            <div ref={langRef} style={{ position: "relative" }}>
              <button className="mcity-lang-btn" onClick={() => setLangOpen((v) => !v)}>
                <span style={{ fontSize: "1.1rem" }}>{localeFlags[locale]}</span>
                <span className="mcity-lang-name">{localeNames[locale]}</span>
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" style={{ opacity: 0.4 }}>
                  <path
                    d={langOpen ? "M1 6.5l3.5-4 3.5 4" : "M1 2.5l3.5 4 3.5-4"}
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </button>
              {langOpen && (
                <div className="mcity-lang-dropdown">
                  {locales.map((l) => (
                    <Link
                      key={l}
                      href={switchLocale(l)}
                      className={"mcity-lang-option" + (l === locale ? " active" : "")}
                      onClick={() => setLangOpen(false)}
                    >
                      <span style={{ fontSize: "1.1rem" }}>{localeFlags[l]}</span>
                      <span>{localeNames[l]}</span>
                      {l === locale && (
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ marginLeft: "auto" }}>
                          <path d="M1.5 5.5l3 3L9.5 2" stroke="#6cabdd" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Sepet */}
            <CartBadge locale={locale} />

            {/* 3. Giriş / Çıkış */}
            {user ? (
              <button
                onClick={logout}
                style={{
                  fontSize: "0.75rem", fontWeight: 600, padding: "0.3rem 0.75rem",
                  borderRadius: "6px", border: "1px solid rgba(255,255,255,0.15)",
                  background: "transparent", color: "#94a3b8", cursor: "pointer",
                }}
              >
                Sign out
              </button>
            ) : (
              <Link href={"/" + locale + "/login"} className="mcity-signin">Sign in</Link>
            )}

            {/* 4. Menu butonu — yalnızca mobil */}
            <button
              className="mcity-hamburger"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M2.5 2.5l10 10M12.5 2.5l-10 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                  </svg>
                  <span className="mcity-hamburger-label">Close</span>
                </>
              ) : (
                <>
                  <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
                    <path d="M1 1h13M1 6h13M1 11h13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                  </svg>
                  <span className="mcity-hamburger-label">Menu</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Menu */}
      <div className={"mcity-mobile-menu" + (menuOpen ? " open" : "")}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={"mcity-mobile-link" + (isActive(link.href) ? " active" : "")}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}

        <div className="mcity-mobile-section">Account</div>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1.5rem" }}>
            <span style={{ fontSize: "0.9rem", color: "#94a3b8" }}>&#128100; {user.name}</span>
            <button
              onClick={() => { logout(); setMenuOpen(false); }}
              style={{ fontSize: "0.85rem", fontWeight: 600, padding: "0.4rem 1rem", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#94a3b8", cursor: "pointer" }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            href={"/" + locale + "/login"}
            className="mcity-mobile-link"
            onClick={() => setMenuOpen(false)}
            style={{ color: "#6cabdd", fontWeight: 600 }}
          >
            &#128273; Sign In
          </Link>
        )}

        <div className="mcity-mobile-section">Language</div>
        <div className="mcity-mobile-lang-grid">
          {locales.map((l) => (
            <Link
              key={l}
              href={switchLocale(l)}
              className={"mcity-mobile-lang-btn" + (l === locale ? " active" : "")}
              onClick={() => setMenuOpen(false)}
            >
              <span style={{ fontSize: "1.1rem" }}>{localeFlags[l]}</span>
              <span>{localeNames[l]}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
