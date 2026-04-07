-- CreateTable
CREATE TABLE "news" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content_body" TEXT NOT NULL,
    "featured_image" TEXT NOT NULL,
    "source_name" TEXT NOT NULL,
    "source_url" TEXT NOT NULL,
    "published_at" DATETIME NOT NULL,
    "locale" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'news',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_name" TEXT NOT NULL,
    "product_slug" TEXT NOT NULL,
    "product_image" TEXT NOT NULL,
    "description_short" TEXT NOT NULL,
    "price_display" TEXT NOT NULL,
    "price_amount" REAL NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "affiliate_link" TEXT NOT NULL,
    "partner_name" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "in_stock" BOOLEAN NOT NULL DEFAULT true,
    "category" TEXT NOT NULL DEFAULT 'merchandise',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ad_spots" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "spot_name" TEXT NOT NULL,
    "ad_type" TEXT NOT NULL,
    "ad_content_code" TEXT,
    "ad_image_url" TEXT,
    "click_url" TEXT,
    "locale" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "event_image" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "event_date" DATETIME NOT NULL,
    "event_end" DATETIME,
    "ticket_url" TEXT,
    "price_range" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "locale" TEXT NOT NULL,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "news_locale_idx" ON "news"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "news_slug_locale_key" ON "news"("slug", "locale");

-- CreateIndex
CREATE INDEX "products_locale_idx" ON "products"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "products_product_slug_locale_key" ON "products"("product_slug", "locale");

-- CreateIndex
CREATE INDEX "ad_spots_spot_name_locale_idx" ON "ad_spots"("spot_name", "locale");

-- CreateIndex
CREATE INDEX "events_locale_idx" ON "events"("locale");

-- CreateIndex
CREATE INDEX "events_event_date_idx" ON "events"("event_date");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_locale_key" ON "events"("slug", "locale");
