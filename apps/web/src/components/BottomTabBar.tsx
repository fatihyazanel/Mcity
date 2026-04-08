"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import type { Locale } from "@/lib/i18n/config";

interface BottomTabBarProps {
  locale: Locale;
  dict: Record<string, string>;
}

export default function BottomTabBar({ locale, dict }: BottomTabBarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Menü açıkken body scroll kilitle
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Sayfa değişince menüyü kapat
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === `/${locale}` ? pathname === `/${locale}` : pathname.startsWith(href);

  const tabs = [
    { href: `/${locale}`,        icon: "🏠", label: dict.nav_home      || "Home"   },
    { href: `/${locale}/news`,   icon: "📰", label: dict.nav_news      || "News"   },
    { href: `/${locale}/whats-on`, icon: "🎫", label: dict.nav_whats_on || "Events" },
    { href: `/${locale}/deals`,  icon: "🏷️", label: dict.nav_deals     || "Deals"  },
  ];

  const menuLinks = [
    { href: `/${locale}/eat-drink`,       icon: "🍽️", label: dict.nav_eat_drink        || "Eat & Drink"   },
    { href: `/${locale}/where-to-stay`,   icon: "🏨", label: dict.nav_where_to_stay    || "Stay"          },
    { href: `/${locale}/neighbourhoods`,  icon: "🗺️", label: dict.nav_neighbourhoods   || "Areas"         },
    { href: `/${locale}/ideas`,           icon: "💡", label: dict.nav_ideas            || "Ideas"         },
    { href: `/${locale}/free-things`,     icon: "🎁", label: dict.nav_free_things      || "Free Things"   },
    { href: `/${locale}/visitor-info`,    icon: "ℹ️", label: dict.nav_visitor_info     || "Visitor Info"  },
    { href: `/${locale}/products`,        icon: "🛍️", label: dict.nav_products         || "Shop"          },
    { href: `/${locale}/events`,          icon: "📅", label: "Events"                                     },
  ];

  return (
    <>
      {/* ── Bottom Tab Bar ── */}
      <nav className="bottom-tab-bar">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`tab-item${isActive(tab.href) ? " active" : ""}`}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </Link>
        ))}

        {/* "More" butonu — drawer açar */}
        <button
          className={`tab-item${menuOpen ? " active" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="More"
        >
          <span className="tab-icon">{menuOpen ? "✕" : "☰"}</span>
          <span className="tab-label">{dict.nav_more || "More"}</span>
        </button>
      </nav>

      {/* ── Mobile Drawer ── */}
      {menuOpen && (
        <>
          {/* Overlay */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              zIndex: 95,
            }}
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer panel */}
          <div
            style={{
              position: "fixed",
              bottom: "62px",
              left: 0,
              right: 0,
              background: "#0a0e1a",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px 16px 0 0",
              zIndex: 96,
              padding: "1rem 0 1.5rem",
              boxShadow: "0 -8px 32px rgba(0,0,0,0.6)",
            }}
          >
            {/* Drag handle */}
            <div
              style={{
                width: 36,
                height: 4,
                background: "rgba(255,255,255,0.15)",
                borderRadius: 2,
                margin: "0 auto 1rem",
              }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.25rem",
                padding: "0 0.75rem",
              }}
            >
              {menuLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    padding: "0.75rem 1rem",
                    borderRadius: 10,
                    textDecoration: "none",
                    color: isActive(link.href) ? "#6cabdd" : "#94a3b8",
                    fontWeight: isActive(link.href) ? 600 : 400,
                    background: isActive(link.href)
                      ? "rgba(108,171,221,0.08)"
                      : "rgba(255,255,255,0.03)",
                    fontSize: "0.88rem",
                    transition: "background 0.12s",
                  }}
                >
                  <span style={{ fontSize: "1.15rem" }}>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
