import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { getNews, getEvents, getIdeas, getProducts } from "@/lib/data";

const BASE_URL = "https://www.m.city";

// Static pages per locale
const staticPages = [
  "",
  "/news",
  "/whats-on",
  "/eat-drink",
  "/where-to-stay",
  "/deals",
  "/neighbourhoods",
  "/ideas",
  "/free-things",
  "/visitor-info",
  "/products",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // Static pages
    for (const page of staticPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}${page}`])
          ),
        },
      });
    }

    // News articles
    const newsArticles = await getNews(locale, 100);
    for (const article of newsArticles) {
      entries.push({
        url: `${BASE_URL}/${locale}/news/${article.slug}`,
        lastModified: new Date(article.published_at),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    // Events
    const events = await getEvents(locale, 100);
    for (const event of events) {
      entries.push({
        url: `${BASE_URL}/${locale}/events/${event.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    // Ideas
    const ideas = await getIdeas(locale, 100);
    for (const idea of ideas) {
      entries.push({
        url: `${BASE_URL}/${locale}/ideas/${idea.slug}`,
        lastModified: new Date(idea.published_at),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }

    // Products
    const products = await getProducts(locale, 100);
    for (const product of products) {
      entries.push({
        url: `${BASE_URL}/${locale}/shop/${product.product_slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
