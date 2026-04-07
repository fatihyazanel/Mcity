import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import { getAdBySpot } from "@/lib/data";

interface AdBannerProps {
  spotName: string;
  locale: Locale;
  dict?: Record<string, string>;
}

export default async function AdBanner({ spotName, locale, dict }: AdBannerProps) {
  const ad = await getAdBySpot(spotName, locale);

  if (!ad || !ad.ad_image_url) return null;

  return (
    <div className="ad-banner" style={{ marginBlock: "1.5rem", textAlign: "center" }}>
      <a href={ad.click_url || "#"} target="_blank" rel="noopener noreferrer sponsored" style={{ display: "block", position: "relative", width: "100%", height: spotName === "header-banner" ? 120 : 200 }}>
        <Image
          src={ad.ad_image_url}
          alt="Advertisement"
          fill
          style={{ objectFit: "cover", borderRadius: "8px" }}
          sizes="(max-width: 768px) 100vw, 1200px"
          unoptimized={ad.ad_image_url.startsWith("http")}
        />
      </a>
      <span style={{ fontSize: "0.65rem", color: "var(--color-text-muted)", display: "block", marginBlockStart: "0.25rem" }}>
        {dict?.ad_label || "Ad"}
      </span>
    </div>
  );
}
