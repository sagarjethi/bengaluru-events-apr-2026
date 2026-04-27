// Post-build static HTML prerenderer.
// Why: the SPA's index.html ships an empty <div id="root"></div>. Crawlers
// (especially LLM crawlers like GPTBot/ClaudeBot, plus Googlebot when under
// crawl-budget pressure) often don't run JS — they see no content and
// "Discover but don't index" the page. Prerendering writes a real HTML
// snapshot of each route so the first byte already contains the H1, the
// meta tags, and the visible content.
//
// Pipeline:
//   1. `vite build` produces dist/index.html + dist/assets/*
//   2. We start `vite preview` on a free port
//   3. Playwright visits each route, waits for content to render
//   4. The rendered HTML is written to dist/<route>/index.html
//   5. Vercel serves these static files first; SPA hydration takes over
//      on the client.
//
// Run: node scripts/prerender.mjs   (or chained after vite build)

import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';

// ---------- routes ----------
function loadEventSlugs() {
  const out = [];
  for (const f of ['src/data/events/april-2026.js', 'src/data/events/may-2026.js', 'src/data/events/other.js']) {
    if (!fs.existsSync(f)) continue;
    const txt = fs.readFileSync(f, 'utf8');
    for (const m of txt.matchAll(/\bname:\s*['"]([^'"]+)['"]/g)) {
      out.push(m[1]
        .toLowerCase()
        .replace(/[''‘’]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''));
    }
  }
  return out;
}
function loadAcceleratorIds() {
  const out = [];
  if (!fs.existsSync('src/data/accelerators.js')) return out;
  const txt = fs.readFileSync('src/data/accelerators.js', 'utf8');
  for (const m of txt.matchAll(/\bid:\s*['"]([^'"]+)['"]/g)) out.push(m[1]);
  return out;
}

const STATIC_ROUTES = [
  '/',
  '/events',
  '/events/april-2026',
  '/events/may-2026',
  '/hackathons',
  '/hackathons/resources',
  '/accelerators',
  '/social',
  '/map',
  '/free-tech-events-bangalore',
  '/ai-events-bangalore-2026',
  '/conferences-bangalore-2026',
  '/hackathons-bangalore-2026',
  '/web3-events-bangalore-2026',
  '/tech-events-this-weekend-bangalore',
  '/college-fests-bangalore-2026',
];
const eventSlugs = loadEventSlugs();
const acceleratorIds = loadAcceleratorIds();
const routes = [
  ...STATIC_ROUTES,
  ...eventSlugs.map((s) => `/events/${s}`),
  ...acceleratorIds.map((id) => `/accelerators/${id}`),
];
console.log(`Prerendering ${routes.length} routes (${eventSlugs.length} events + ${acceleratorIds.length} accelerators + ${STATIC_ROUTES.length} static)…`);

// ---------- find free port ----------
function freePort() {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.listen(0, () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

// ---------- start vite preview ----------
const PORT = await freePort();
const previewProc = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  stdio: ['ignore', 'pipe', 'inherit'],
});
await new Promise((resolve, reject) => {
  const onData = (chunk) => {
    if (String(chunk).includes(`localhost:${PORT}`)) {
      previewProc.stdout.off('data', onData);
      resolve();
    }
  };
  previewProc.stdout.on('data', onData);
  setTimeout(() => reject(new Error('vite preview did not start')), 15000);
});
console.log(`✓ vite preview ready on http://localhost:${PORT}`);

// ---------- launch chromium ----------
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  userAgent: 'Mozilla/5.0 (compatible; PrerenderBot/1.0; +https://bengaluru-events.sagarjethi.com)',
  locale: 'en-IN',
  timezoneId: 'Asia/Kolkata',
  viewport: { width: 1280, height: 720 },
});
const page = await ctx.newPage();

let okCount = 0;
let failCount = 0;

for (let i = 0; i < routes.length; i++) {
  const route = routes[i];
  const url = `http://localhost:${PORT}${route}`;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    // Give react-helmet a tick to flush <title> / <meta>
    await page.waitForTimeout(200);
    let html = await page.content();

    // Strip the prerender bot UA hint that we set so production HTML doesn't
    // expose our internal crawl name.
    html = html.replace(/\s+data-prerender(?:ed)?="[^"]*"/g, '');

    // Where to write: route '/' → dist/index.html (already exists, but we
    // overwrite with the prerendered version so home is also full-content).
    // Other routes → dist/<route>/index.html
    const destDir = route === '/' ? 'dist' : `dist${route}`;
    fs.mkdirSync(destDir, { recursive: true });
    fs.writeFileSync(path.join(destDir, 'index.html'), html);
    okCount++;
    if (i < 5 || i % 20 === 0) console.log(`  [${i + 1}/${routes.length}] ${route}`);
  } catch (e) {
    failCount++;
    console.warn(`  ✗ ${route}: ${e.message}`);
  }
}

await browser.close();
previewProc.kill();

console.log(`\nPrerender done: ${okCount} OK, ${failCount} failed`);
process.exit(failCount ? 1 : 0);
