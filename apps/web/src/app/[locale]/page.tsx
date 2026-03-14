import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import HeroSection from "@/components/HeroSection";
import NewsGrid from "@/components/NewsGrid";
import ProductCarousel from "@/components/ProductCarousel";
import AdBanner from "@/components/AdBanner";

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <HeroSection dict={dict} locale={locale as Locale} />
      <div style={{ maxWidth: "1200px", marginInline: "auto", padding: "0 1.5rem" }}>
        <AdBanner spotName="header-banner" locale={locale as Locale} dict={dict} />
        <NewsGrid dict={dict} locale={locale as Locale} />
        <AdBanner spotName="content-inline" locale={locale as Locale} dict={dict} />
        <ProductCarousel dict={dict} locale={locale as Locale} />
      </div>
    </>
  );
}
