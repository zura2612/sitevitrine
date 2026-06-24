// fichier scripts/genererSitemapCloudflare.mjs
import 'dotenv/config';
import { SitemapStream, streamToPromise } from 'sitemap';
import { writeFileSync } from 'node:fs';
import { Readable } from 'node:stream';

// Configuration par environnement (injectée via variables d'env)
const SITE_URL = process.env.SITE_URL_CLOUDFLARE;
const OUTPUT_PATH = process.env.OUTPUT_PATH_CLOUDFLARE;

if (!SITE_URL || !OUTPUT_PATH) {
  console.error('❌ Variables d\'environnement manquantes :');
  console.error('  - SITE_URL_CLOUDFLARE:', SITE_URL);
  console.error('  - OUTPUT_PATH_CLOUDFLARE:', OUTPUT_PATH);
  process.exit(1);
}

// Source de données
async function fetchUrls() {
  return [
    { url: '/', lastmod: '2026-06-01', changefreq: 'monthly', priority: 1.0 },
    { url: '/about', lastmod: '2026-06-01', changefreq: 'yearly', priority: 0.8 },
    { url: '/contact', lastmod: '2026-06-01', changefreq: 'yearly', priority: 0.8 },
    { url: '/services', lastmod: '2026-06-01', changefreq: 'yearly', priority: 0.8 },
    { url: '/legal/legal.html', lastmod: '2026-06-01', changefreq: 'yearly', priority: 0.3 },
    { url: '/legal/privacy.html', lastmod: '2026-06-01', changefreq: 'yearly', priority: 0.3 },
  ];
}

async function generateSitemap() {
  const urls = await fetchUrls();

  // création du stream 
  const stream = new SitemapStream({ hostname: SITE_URL });

  // Dans sitemap v9, streamToPromise retourne un Buffer directement
  const xmlBuffer = await streamToPromise( Readable.from(urls).pipe(stream) );

  // écriture du fichier
  writeFileSync(OUTPUT_PATH, xmlBuffer.toString());
  console.log(`✓ Sitemap généré : ${OUTPUT_PATH} (${urls.length} URLs)`);
}

generateSitemap().catch(console.error);