/**
 * fetch-real-news.cjs
 * 
 * Gerçek haber kaynaklarından Manchester City haberleri çeker:
 * - NewsAPI.org (ücretsiz tier)
 * - Guardian API (ücretsiz)
 * - BBC Sport RSS
 * - Manchester Evening News RSS
 * 
 * Kullanım:
 *   node fetch-real-news.cjs --apikey=YOUR_NEWSAPI_KEY --guardian=YOUR_GUARDIAN_KEY
 * 
 * Ücretsiz API key al:
 *   NewsAPI:  https://newsapi.org/register  (100 req/gün ücretsiz)
 *   Guardian: https://open-platform.theguardian.com/access/  (anında ücretsiz)
 */

const { createClient } = require('@libsql/client');
const https = require('https');

const db = createClient({ url: 'file:D:/m.city/apps/web/data.db' });

// CLI args parse
const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => a.slice(2).split('='))
);

const NEWS_API_KEY = args.apikey || process.env.NEWS_API_KEY || '';
const GUARDIAN_KEY = args.guardian || process.env.GUARDIAN_API_KEY || '';

// ── Helpers ──────────────────────────────────────────────
function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Manchester-City-News-Aggregator/1.0' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(data); }
      });
    }).on('error', reject);
  });
}

function fetchRSS(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Manchester-City-News-Aggregator/1.0' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseRSSItems(xml) {
  const items = [];
  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
  for (const match of itemMatches) {
    const item = match[1];
    const title   = (item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)    || item.match(/<title>(.*?)<\/title>/))?.[1]?.trim() || '';
    const link    = (item.match(/<link>(.*?)<\/link>/)                       || item.match(/<guid[^>]*>(.*?)<\/guid>/))?.[1]?.trim() || '';
    const desc    = (item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/))?.[1]?.trim() || '';
    const pubDate = (item.match(/<pubDate>(.*?)<\/pubDate>/))?.[1]?.trim() || new Date().toISOString();
    const image   = (item.match(/<media:content[^>]+url="([^"]+)"/)         || item.match(/<enclosure[^>]+url="([^"]+)"/))?.[1] || '';
    if (title && link) items.push({ title, link, desc, pubDate, image });
  }
  return items;
}

// ── News sources ─────────────────────────────────────────

async function fetchGuardian() {
  if (!GUARDIAN_KEY) {
    console.log('⚠️  Guardian API key yok — atlanıyor');
    return [];
  }
  console.log('📰 Guardian API\'den çekiliyor...');
  const url = `https://content.guardianapis.com/search?q=manchester+city&section=football&order-by=newest&page-size=20&show-fields=trailText,thumbnail,bodyText&api-key=${GUARDIAN_KEY}`;
  const data = await fetch(url);
  if (!data?.response?.results) { console.log('Guardian: veri yok'); return []; }
  
  return data.response.results.map(a => ({
    title:         a.webTitle,
    excerpt:       a.fields?.trailText?.replace(/<[^>]+>/g, '').slice(0, 300) || '',
    content_body:  a.fields?.bodyText?.replace(/<[^>]+>/g, '').slice(0, 3000) || a.fields?.trailText || '',
    featured_image: a.fields?.thumbnail || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
    source_name:   'The Guardian',
    source_url:    a.webUrl,
    published_at:  new Date(a.webPublicationDate).toISOString(),
    category:      'football',
  }));
}

async function fetchNewsAPI() {
  if (!NEWS_API_KEY) {
    console.log('⚠️  NewsAPI key yok — atlanıyor');
    return [];
  }
  console.log('📰 NewsAPI\'den çekiliyor...');
  const url = `https://newsapi.org/v2/everything?q=%22manchester+city%22&language=en&sortBy=publishedAt&pageSize=20&apiKey=${NEWS_API_KEY}`;
  const data = await fetch(url);
  if (!data?.articles) { console.log('NewsAPI: veri yok'); return []; }

  return data.articles
    .filter(a => a.title && !a.title.includes('[Removed]'))
    .map(a => ({
      title:         a.title.replace(/ - [^-]+$/, ''), // kaynak adını başlıktan çıkar
      excerpt:       (a.description || '').slice(0, 300),
      content_body:  (a.content || a.description || '').replace(/\[\+\d+ chars\]/, '').slice(0, 3000),
      featured_image: a.urlToImage || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
      source_name:   a.source?.name || 'NewsAPI',
      source_url:    a.url,
      published_at:  new Date(a.publishedAt).toISOString(),
      category:      'football',
    }));
}

async function fetchBBCSportRSS() {
  console.log('📰 BBC Sport RSS\'den çekiliyor...');
  try {
    const xml = await fetchRSS('https://feeds.bbci.co.uk/sport/football/rss.xml');
    const items = parseRSSItems(xml);
    return items
      .filter(i => i.title.toLowerCase().includes('manchester') || i.title.toLowerCase().includes('city'))
      .slice(0, 10)
      .map(i => ({
        title:         i.title,
        excerpt:       i.desc.replace(/<[^>]+>/g, '').slice(0, 300),
        content_body:  i.desc.replace(/<[^>]+>/g, ''),
        featured_image: i.image || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
        source_name:   'BBC Sport',
        source_url:    i.link,
        published_at:  new Date(i.pubDate).toISOString(),
        category:      'football',
      }));
  } catch(e) {
    console.log('BBC RSS hatası:', e.message);
    return [];
  }
}

async function fetchMENRSS() {
  console.log('📰 Manchester Evening News RSS\'den çekiliyor...');
  try {
    const xml = await fetchRSS('https://www.manchestereveningnews.co.uk/sport/football/manchester-city-fc/?service=rss');
    const items = parseRSSItems(xml);
    return items.slice(0, 10).map(i => ({
      title:         i.title,
      excerpt:       i.desc.replace(/<[^>]+>/g, '').slice(0, 300),
      content_body:  i.desc.replace(/<[^>]+>/g, ''),
      featured_image: i.image || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
      source_name:   'Manchester Evening News',
      source_url:    i.link,
      published_at:  new Date(i.pubDate).toISOString(),
      category:      'news',
    }));
  } catch(e) {
    console.log('MEN RSS hatası:', e.message);
    return [];
  }
}

async function fetchSkyRSS() {
  console.log('📰 Sky Sports RSS\'den çekiliyor...');
  try {
    const xml = await fetchRSS('https://www.skysports.com/rss/12040');
    const items = parseRSSItems(xml);
    return items
      .filter(i => i.title.toLowerCase().includes('manchester') || i.title.toLowerCase().includes('city'))
      .slice(0, 8)
      .map(i => ({
        title:         i.title,
        excerpt:       i.desc.replace(/<[^>]+>/g, '').slice(0, 300),
        content_body:  i.desc.replace(/<[^>]+>/g, ''),
        featured_image: i.image || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
        source_name:   'Sky Sports',
        source_url:    i.link,
        published_at:  new Date(i.pubDate).toISOString(),
        category:      'football',
      }));
  } catch(e) {
    console.log('Sky RSS hatası:', e.message);
    return [];
  }
}

// ── Translation stubs (TR içeriği için başlık çevirisi) ──
function translateTitle(title, lang) {
  // Gerçek çeviri API olmadan basit locale marker ekle
  const markers = { ar: '[AR] ', he: '[HE] ', es: '[ES] ' };
  return (markers[lang] || '') + title;
}

// ── Main ──────────────────────────────────────────────────
async function main() {
  console.log('\n🚀 Gerçek haber çekme başlıyor...\n');

  if (!NEWS_API_KEY && !GUARDIAN_KEY && !args['rss-only']) {
    console.log(`
❌ API KEY GEREKLİ!

Ücretsiz key al:
  1. NewsAPI:  https://newsapi.org/register
  2. Guardian: https://open-platform.theguardian.com/access/

Sonra çalıştır:
  node fetch-real-news.cjs --apikey=NEWSAPI_KEY --guardian=GUARDIAN_KEY

BBC Sport ve Manchester Evening News RSS keysiz çalışır ama az içerik verir.
Devam etmek için sadece RSS dene:
  node fetch-real-news.cjs --rss-only
`);
    process.exit(1);
  }

  // Fetch from all sources
  const [guardian, newsapi, bbc, men, sky] = await Promise.all([
    fetchGuardian().catch(() => []),
    fetchNewsAPI().catch(() => []),
    fetchBBCSportRSS().catch(() => []),
    fetchMENRSS().catch(() => []),
    fetchSkyRSS().catch(() => []),
  ]);

  const allEN = [...guardian, ...newsapi, ...bbc, ...men, ...sky];
  console.log(`\n✅ Toplam ${allEN.length} EN haber çekildi\n`);

  if (allEN.length === 0) {
    console.log('❌ Hiç haber çekilemedi. API key kontrol et.');
    process.exit(1);
  }

  // Deduplicate by title similarity
  const seen = new Set();
  const unique = allEN.filter(a => {
    const key = a.title.slice(0, 40).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`📊 Tekrar temizleme sonrası: ${unique.length} benzersiz haber\n`);

  // Mevcut haberleri temizle
  console.log('🗑️  Eski haberler temizleniyor...');
  await db.execute("DELETE FROM news");
  console.log('✓ Eski haberler silindi\n');

  // Insert EN
  let inserted = 0;
  for (const article of unique) {
    const slug = slugify(article.title) + '-' + Date.now() % 10000;
    try {
      await db.execute({
        sql: `INSERT INTO news (title, slug, excerpt, content_body, featured_image, source_name, source_url, published_at, locale, category)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'en', ?)`,
        args: [
          article.title,
          slug,
          article.excerpt || article.title,
          article.content_body || article.excerpt || article.title,
          article.featured_image,
          article.source_name,
          article.source_url,
          article.published_at,
          article.category || 'football',
        ]
      });

      // AR, HE, ES için aynı haberi locale marker ile ekle
      for (const lang of ['ar', 'he', 'es']) {
        await db.execute({
          sql: `INSERT INTO news (title, slug, excerpt, content_body, featured_image, source_name, source_url, published_at, locale, category)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            translateTitle(article.title, lang),
            slug + '-' + lang,
            article.excerpt || article.title,
            article.content_body || article.excerpt,
            article.featured_image,
            article.source_name,
            article.source_url,
            article.published_at,
            lang,
            article.category || 'football',
          ]
        });
      }

      inserted++;
      console.log(`  ✓ [${article.source_name}] ${article.title.slice(0, 60)}`);
    } catch(e) {
      console.log(`  ✗ HATA: ${e.message} — ${article.title.slice(0, 40)}`);
    }
  }

  console.log(`\n🎉 ${inserted} haber 4 dilde eklendi (toplam ${inserted * 4} kayıt)\n`);

  // Verify
  const cnt = await db.execute("SELECT locale, COUNT(*) as c FROM news GROUP BY locale");
  console.log('📊 DB özeti:');
  cnt.rows.forEach(r => console.log(`   ${r.locale}: ${r.c} haber`));
  console.log('');
}

main().catch(console.error);
