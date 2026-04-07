import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import CookieBanner from "@/components/CookieBanner";
import PageTracker from "@/components/PageTracker";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.m.city"),
  title: {
    default: "m.city — Your City. Your Football. Your Culture.",
    template: "%s | m.city",
  },
  description:
    "The ultimate city & football culture guide for Manchester. Live news, events, dining, deals, and curated products — all in one place.",
  keywords: [
    "Manchester",
    "Manchester City",
    "football",
    "Manchester news",
    "things to do Manchester",
    "Manchester events",
    "Manchester restaurants",
    "Manchester deals",
    "Manchester guide",
    "m.city",
  ],
  authors: [{ name: "m.city Media" }],
  creator: "m.city Media",
  publisher: "m.city Media",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    alternateLocale: ["ar_SA", "he_IL", "es_ES"],
    url: "https://www.m.city",
    siteName: "m.city",
    title: "m.city — Your City. Your Football. Your Culture.",
    description:
      "The ultimate city & football culture guide for Manchester. Live news, events, dining, deals, and curated products.",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "m.city — Manchester City & Football Culture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mcitymedia",
    creator: "@mcitymedia",
    title: "m.city — Your City. Your Football. Your Culture.",
    description:
      "The ultimate city & football culture guide for Manchester. Live news, events, dining, deals, and curated products.",
    images: ["/og-default.jpg"],
  },
  // verification: { google: "EKLE_YAYINA_GIRDIKTEN_SONRA" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Noto+Sans+Arabic:wght@400;600;700&family=Noto+Sans+Hebrew:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AnalyticsScripts />
        <PageTracker />
        <Providers>{children}</Providers>
        <CookieBanner />
      </body>
    </html>
  );
}
