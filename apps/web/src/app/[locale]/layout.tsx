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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: `${dict.site_name} — ${dict.site_tagline}`,
    description: dict.hero_subtitle,
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
      {locales.map((l) => (
        <link key={l} rel="alternate" hrefLang={l} href={`/${l}`} />
      ))}
      <Header locale={locale as Locale} dict={dict} />
      <main>{children}</main>
      <Footer locale={locale as Locale} dict={dict} />
    </>
  );
}
