export interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content_body: string;
  featured_image: string;
  source_name: string;
  source_url: string;
  published_at: string;
  locale: string;
}

export interface ProductShowcase {
  id: number;
  product_name: string;
  product_slug: string;
  product_image: string;
  description_short: string;
  price_display: string;
  affiliate_link: string;
  partner_name: string;
  locale: string;
}

export interface AdSpot {
  id: number;
  spot_name: string;
  ad_type: "image" | "script_code";
  ad_content_code?: string;
  ad_image_url?: string;
  click_url?: string;
  locale: string;
  is_active: boolean;
}
