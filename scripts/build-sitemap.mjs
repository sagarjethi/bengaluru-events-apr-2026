// Regenerate public/sitemap.xml from src/data/events.js + src/data/accelerators.js
// Source of truth: events.js (events array). Run before deploys.
import fs from 'node:fs';

const SITE = 'https://bengaluru-events.sagarjethi.com';
const today = new Date().toISOString().slice(0, 10);

function toSlug(s) {
  return s.toLowerCase().replace(/['']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Pull names from events.js
const eventsText = fs.readFileSync('src/data/events.js', 'utf8');
const eventsStart = eventsText.indexOf('export const events = [');
const eventsEnd = eventsText.indexOf('\n];', eventsStart);
const eventsSlice = eventsText.slice(eventsStart, eventsEnd);
const eventNames = [...eventsSlice.matchAll(/name:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
const eventStartDates = [...eventsSlice.matchAll(/startDate:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);

// Pull accelerator slugs (file may not have an explicit slug field — derive from name)
let acceleratorNames = [];
try {
  const accText = fs.readFileSync('src/data/accelerators.js', 'utf8');
  acceleratorNames = [...accText.matchAll(/name:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
} catch { /* */ }

const urls = [];
function add(path, opts = {}) {
  urls.push({ loc: `${SITE}${path}`, lastmod: opts.lastmod || today, changefreq: opts.changefreq || 'weekly', priority: opts.priority ?? 0.7 });
}

// Top-level
add('/', { changefreq: 'daily', priority: 1.0 });
add('/events', { changefreq: 'daily', priority: 0.95 });
add('/events/april-2026', { changefreq: 'daily', priority: 0.95 });
add('/events/may-2026', { changefreq: 'daily', priority: 0.95 });
add('/hackathons', { changefreq: 'daily', priority: 0.95 });
add('/hackathons/resources', { changefreq: 'weekly', priority: 0.9 });
add('/accelerators', { changefreq: 'weekly', priority: 0.9 });
add('/social', { changefreq: 'weekly', priority: 0.8 });
add('/map', { changefreq: 'weekly', priority: 0.8 });

// SEO landing pages — keyword-rich URLs that target high-intent searches
add('/free-tech-events-bangalore', { changefreq: 'daily', priority: 0.9 });
add('/ai-events-bangalore-2026', { changefreq: 'daily', priority: 0.9 });
add('/conferences-bangalore-2026', { changefreq: 'weekly', priority: 0.85 });
add('/hackathons-bangalore-2026', { changefreq: 'daily', priority: 0.9 });
add('/web3-events-bangalore-2026', { changefreq: 'weekly', priority: 0.8 });
add('/tech-events-this-weekend-bangalore', { changefreq: 'daily', priority: 0.85 });
add('/college-fests-bangalore-2026', { changefreq: 'weekly', priority: 0.85 });

// Per-event
const seen = new Set();
eventNames.forEach((n, i) => {
  const slug = toSlug(n);
  if (seen.has(slug)) return; seen.add(slug);
  const sd = eventStartDates[i];
  add(`/events/${slug}`, { changefreq: 'weekly', priority: 0.75, lastmod: sd || today });
});

// Per-accelerator
const accSeen = new Set();
for (const n of acceleratorNames) {
  const slug = toSlug(n);
  if (accSeen.has(slug)) continue; accSeen.add(slug);
  add(`/accelerators/${slug}`, { changefreq: 'monthly', priority: 0.7 });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync('public/sitemap.xml', xml);
console.log(`Wrote sitemap with ${urls.length} URLs.`);
