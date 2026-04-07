import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getNews } from "@/lib/data";
import HeroSection from "@/components/HeroSection";
import NewsGrid from "@/components/NewsGrid";
import ProductCarousel from "@/components/ProductCarousel";
import AdBanner from "@/components/AdBanner";
import NewsletterSection from "@/components/NewsletterSection";

// Sayfayı her 1 saatte bir yeniden oluştur (ISR)
export const revalidate = 3600;

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  // Single DB query shared across HeroSection and NewsGrid
  const articles = await getNews(locale as Locale, 20);

  return (
    <>
      {/* Featured Hero Article + Trending Bar */}
      <HeroSection dict={dict} locale={locale as Locale} articles={articles} />

      <div className="container">
        {/* Ad Banner */}
        <div style={{ marginBlock: "1.5rem" }}>
          <AdBanner spotName="header-banner" locale={locale as Locale} dict={dict} />
        </div>

        {/* News — Magazine Layout */}
        <NewsGrid dict={dict} locale={locale as Locale} articles={articles} />

        {/* Ad Banner Inline */}
        <AdBanner spotName="content-inline" locale={locale as Locale} dict={dict} />

        {/* Shop / Products */}
        <ProductCarousel dict={dict} locale={locale as Locale} />

        {/* Newsletter Signup */}
        <NewsletterSection dict={dict} locale={locale as Locale} />
      </div>
    </>
  );
}
