import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isRTL, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HtmlDirSetter from "@/components/HtmlDirSetter";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const BASE_URL = "https://www.m.city";

const OG_LOCALE_MAP: Record<Locale, string> = {
  en: "en_GB",
  ar: "ar_SA",
  he: "he_IL",
  es: "es_ES",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const l = locale as Locale;
  const canonicalUrl = `${BASE_URL}/${locale}`;

  // Build hreflang alternates
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = `${BASE_URL}/${loc}`;
  }
  languages["x-default"] = `${BASE_URL}/en`;

  return {
    title: `${dict.site_name} — ${dict.site_tagline}`,
    description: dict.hero_subtitle,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALE_MAP[l],
      url: canonicalUrl,
      siteName: "m.city",
      title: `${dict.site_name} — ${dict.site_tagline}`,
      description: dict.hero_subtitle,
      images: [
        {
          url: `${BASE_URL}/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: "m.city",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${dict.site_name} — ${dict.site_tagline}`,
      description: dict.hero_subtitle,
      images: [`${BASE_URL}/og-default.jpg`],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);
  const rtl = isRTL(locale as Locale);

  return (
    <>
      <HtmlDirSetter locale={locale} dir={rtl ? "rtl" : "ltr"} />
      <Header locale={locale as Locale} dict={dict} />
      <main>{children}</main>
      <Footer locale={locale as Locale} dict={dict} />
    </>
  );
}
