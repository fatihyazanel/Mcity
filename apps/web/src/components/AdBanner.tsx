import type { Locale } from "@/lib/i18n/config";
import { mockAds } from "@/lib/mock-data";

interface AdBannerProps {
  spotName: string;
  locale: Locale;
}

export default function AdBanner({ spotName, locale }: AdBannerProps) {
  const ad = mockAds.find((a) => a.spot_name === spotName && a.is_active);

  if (!ad) return null;

  return (
    <div className="ad-banner" style={{ marginBlock: "1.5rem", textAlign: "center" }}>
      <a href={ad.click_url || "#"} target="_blank" rel="noopener noreferrer sponsored">
        <img
          src={ad.ad_image_url || ""}
          alt="Advertisement"
          style={{
            width: "100%",
            maxHeight: spotName === "header-banner" ? "120px" : "200px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      </a>
      <span style={{ fontSize: "0.65rem", color: "var(--color-text-muted)", display: "block", marginBlockStart: "0.25rem" }}>
        Ad
      </span>
    </div>
  );
}
