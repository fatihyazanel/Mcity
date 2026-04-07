import { query, queryOne } from "./db";

// ── Types ──
export interface NewsRow {
  id: number; title: string; slug: string; excerpt: string; content_body: string;
  featured_image: string; source_name: string; source_url: string; published_at: string;
  locale: string; category: string;
}
export interface ProductRow {
  id: number; product_name: string; product_slug: string; product_image: string;
  description_short: string; price_display: string; price_amount: number;
  affiliate_link: string; partner_name: string; locale: string; category: string; in_stock: number;
}
export interface AdRow {
  id: number; spot_name: string; ad_type: string; ad_image_url: string | null;
  click_url: string | null; locale: string; is_active: number;
}
export interface EventRow {
  id: number; title: string; slug: string; description: string; event_image: string;
  venue: string; event_date: string; event_end: string | null; ticket_url: string | null;
  price_range: string | null; category: string; locale: string; is_featured: number;
}
export interface PlaceRow {
  id: number; name: string; slug: string; description: string; image: string;
  category: string; address: string | null; price_range: string | null; rating: number | null;
  stars: number | null; website: string | null; phone: string | null; locale: string; is_featured: number;
}
export interface DealRow {
  id: number; title: string; slug: string; description: string; image: string;
  discount_text: string; original_price: string | null; deal_price: string | null;
  deal_url: string | null; valid_until: string | null; locale: string; category: string; is_active: number;
}
export interface NeighbourhoodRow {
  id: number; name: string; slug: string; description: string; image: string;
  highlights: string; locale: string;
}
export interface IdeaRow {
  id: number; title: string; slug: string; excerpt: string; content_body: string;
  image: string; category: string; read_time: number; published_at: string; locale: string;
}
export interface FreeThingRow {
  id: number; title: string; slug: string; description: string; image: string;
  location: string; category: string; locale: string;
}
export interface VisitorInfoRow {
  id: number; title: string; slug: string; content: string; icon: string;
  category: string; locale: string; sort_order: number;
}

// ── News ──
export async function getNews(locale: string, limit = 20): Promise<NewsRow[]> {
  return query<NewsRow>("SELECT * FROM news WHERE locale = ? ORDER BY published_at DESC LIMIT ?", [locale, limit]);
}
export async function getNewsBySlug(locale: string, slug: string): Promise<NewsRow | undefined> {
  return queryOne<NewsRow>("SELECT * FROM news WHERE locale = ? AND slug = ?", [locale, slug]);
}
export async function getAllNewsSlugs(): Promise<{ slug: string; locale: string }[]> {
  return query<{ slug: string; locale: string }>("SELECT DISTINCT slug, locale FROM news", []);
}

// ── Products ──
export async function getProducts(locale: string, limit = 20): Promise<ProductRow[]> {
  return query<ProductRow>("SELECT * FROM products WHERE locale = ? ORDER BY id LIMIT ?", [locale, limit]);
}
export async function getProductBySlug(locale: string, slug: string): Promise<ProductRow | undefined> {
  return queryOne<ProductRow>("SELECT * FROM products WHERE locale = ? AND product_slug = ?", [locale, slug]);
}
export async function getAllProductSlugs(): Promise<{ slug: string; locale: string }[]> {
  return query<{ slug: string; locale: string }>("SELECT DISTINCT product_slug as slug, locale FROM products", []);
}

// ── Ads ──
export async function getAdBySpot(spotName: string, locale: string): Promise<AdRow | undefined> {
  return queryOne<AdRow>("SELECT * FROM ad_spots WHERE spot_name = ? AND locale = ? AND is_active = 1", [spotName, locale]);
}

// ── Events ──
export async function getEvents(locale: string, limit = 20): Promise<EventRow[]> {
  return query<EventRow>("SELECT * FROM events WHERE locale = ? ORDER BY event_date ASC LIMIT ?", [locale, limit]);
}
export async function getFeaturedEvents(locale: string): Promise<EventRow[]> {
  return query<EventRow>("SELECT * FROM events WHERE locale = ? AND is_featured = 1 ORDER BY event_date ASC", [locale]);
}
export async function getEventBySlug(locale: string, slug: string): Promise<EventRow | undefined> {
  return queryOne<EventRow>("SELECT * FROM events WHERE locale = ? AND slug = ?", [locale, slug]);
}
export async function getAllEventSlugs(): Promise<{ slug: string; locale: string }[]> {
  return query<{ slug: string; locale: string }>("SELECT DISTINCT slug, locale FROM events", []);
}

// ── Places ──
export async function getPlaces(locale: string, category?: string, limit = 50): Promise<PlaceRow[]> {
  if (category)
    return query<PlaceRow>("SELECT * FROM places WHERE locale = ? AND category = ? ORDER BY is_featured DESC, rating DESC LIMIT ?", [locale, category, limit]);
  return query<PlaceRow>("SELECT * FROM places WHERE locale = ? ORDER BY is_featured DESC, rating DESC LIMIT ?", [locale, limit]);
}
export async function getFeaturedPlaces(locale: string, category?: string): Promise<PlaceRow[]> {
  if (category)
    return query<PlaceRow>("SELECT * FROM places WHERE locale = ? AND category = ? AND is_featured = 1 ORDER BY rating DESC", [locale, category]);
  return query<PlaceRow>("SELECT * FROM places WHERE locale = ? AND is_featured = 1 ORDER BY rating DESC", [locale]);
}
export async function getPlaceBySlug(locale: string, slug: string): Promise<PlaceRow | undefined> {
  return queryOne<PlaceRow>("SELECT * FROM places WHERE locale = ? AND slug = ?", [locale, slug]);
}

// ── Deals ──
export async function getDeals(locale: string, limit = 20): Promise<DealRow[]> {
  return query<DealRow>("SELECT * FROM deals WHERE locale = ? AND is_active = 1 ORDER BY id LIMIT ?", [locale, limit]);
}

// ── Neighbourhoods ──
export async function getNeighbourhoods(locale: string): Promise<NeighbourhoodRow[]> {
  return query<NeighbourhoodRow>("SELECT * FROM neighbourhoods WHERE locale = ? ORDER BY id", [locale]);
}
export async function getNeighbourhoodBySlug(locale: string, slug: string): Promise<NeighbourhoodRow | undefined> {
  return queryOne<NeighbourhoodRow>("SELECT * FROM neighbourhoods WHERE locale = ? AND slug = ?", [locale, slug]);
}

// ── Ideas ──
export async function getIdeas(locale: string, limit = 20): Promise<IdeaRow[]> {
  return query<IdeaRow>("SELECT * FROM ideas WHERE locale = ? ORDER BY published_at DESC LIMIT ?", [locale, limit]);
}
export async function getIdeaBySlug(locale: string, slug: string): Promise<IdeaRow | undefined> {
  return queryOne<IdeaRow>("SELECT * FROM ideas WHERE locale = ? AND slug = ?", [locale, slug]);
}

// ── Free Things ──
export async function getFreeThings(locale: string): Promise<FreeThingRow[]> {
  return query<FreeThingRow>("SELECT * FROM free_things WHERE locale = ? ORDER BY id", [locale]);
}

// ── Visitor Info ──
export async function getVisitorInfo(locale: string): Promise<VisitorInfoRow[]> {
  return query<VisitorInfoRow>("SELECT * FROM visitor_info WHERE locale = ? ORDER BY sort_order ASC", [locale]);
}
