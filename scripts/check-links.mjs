// Link-check every event in src/data/events.js. Flag 404/410/timeouts.
// Usage: node scripts/check-links.mjs
// Output: scripts/link-check.json + console summary.
import fs from 'node:fs';

const file = fs.readFileSync('src/data/events.js', 'utf8');

// Extract id + name + link triples by matching event objects
const events = [];
// Walk character-by-character to find balanced { ... } objects in the events array
const start = file.indexOf('export const events = [');
const end = file.indexOf('\n];', start);
const slice = file.slice(start, end);
const objRe = /\{[^{}]*\bid:\s*(\d+)[^{}]*?\bname:\s*['"]([^'"]+)['"][^{}]*?\blink:\s*['"]([^'"]+)['"][^{}]*?\}/gs;
let m;
while ((m = objRe.exec(slice))) {
  events.push({ id: +m[1], name: m[2], link: m[3] });
}
console.log(`Found ${events.length} events with id+name+link`);

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const TIMEOUT_MS = 12000;

async function check(url) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    // Many sites reject HEAD; use GET with Range to avoid full download
    const r = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: ac.signal,
      headers: { 'User-Agent': UA, 'Range': 'bytes=0-1024', Accept: 'text/html,*/*' },
    });
    return { status: r.status, ok: r.status < 400, finalUrl: r.url };
  } catch (e) {
    return { status: 0, ok: false, error: e.name === 'AbortError' ? 'timeout' : e.message };
  } finally { clearTimeout(t); }
}

const POOL = 8;
const results = [];
let i = 0;
async function worker() {
  while (i < events.length) {
    const e = events[i++];
    const r = await check(e.link);
    results.push({ ...e, ...r });
    process.stdout.write(`[${results.length}/${events.length}] ${r.status || 'ERR'} ${e.id} ${e.name.slice(0, 50)}\n`);
  }
}
await Promise.all(Array.from({ length: POOL }, worker));

results.sort((a, b) => a.id - b.id);
fs.writeFileSync('scripts/link-check.json', JSON.stringify(results, null, 2));

const broken = results.filter((r) => !r.ok);
console.log('\n=== SUMMARY ===');
console.log('Total:', results.length);
console.log('OK:', results.filter((r) => r.ok).length);
console.log('Broken:', broken.length);
for (const b of broken) console.log(`  [${b.id}] ${b.status || b.error} — ${b.name}\n        ${b.link}`);
