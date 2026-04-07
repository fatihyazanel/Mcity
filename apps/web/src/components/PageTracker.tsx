"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PageTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    // Aynı path tekrar track edilmesin (StrictMode double-fire)
    if (pathname === lastTracked.current) return;
    lastTracked.current = pathname;

    // Locale'i path'ten çıkar (/en/news → "en")
    const locale = pathname.split("/")[1] ?? "en";

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, locale }),
      // keepalive: sayfa kapanırken de gönder
      keepalive: true,
    }).catch(() => {
      // Sessizce başarısız ol — tracking kritik değil
    });
  }, [pathname]);

  return null;
}
