// Deep link check — fetches the full HTML and looks for "this event was
// cancelled / no longer available / page not found / draft" patterns that
// reveal a 200 page actually showing a dead event.
//
// Usage: node scripts/check-links-deep.mjs

import fs from 'node:fs';

const FILES = ['src/data/events/april-2026.js', 'src/data/events/may-2026.js'];

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const TODAY = todayIso();

const events = [];
for (const f of FILES) {
  if (!fs.existsSync(f)) continue;
  const txt = fs.readFileSync(f, 'utf8');
  const re = /\{[^{}]*?\bid:\s*(\d+)[^{}]*?\bname:\s*['"]([^'"]+)['"][^{}]*?\bstartDate:\s*['"]([^'"]+)['"][^{}]*?\bendDate:\s*['"]([^'"]+)['"][^{}]*?\blink:\s*['"]([^'"]+)['"][^{}]*?\}/gs;
  let m;
  while ((m = re.exec(txt))) {
    events.push({ id: +m[1], name: m[2], startDate: m[3], endDate: m[4], link: m[5] });
  }
}

const upcoming = events.filter((e) => e.endDate >= TODAY).sort((a, b) => a.startDate.localeCompare(b.startDate));
console.log(`Today: ${TODAY} · Deep-checking ${upcoming.length} upcoming events…\n`);

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// Strings that suggest the event page is dead/cancelled even with 200 status
const DEAD_PATTERNS = [
  /event (?:was )?cancell?ed/i,
  /event has been cancell?ed/i,
  /no longer (?:available|active|on sale)/i,
  /this event has ended/i,
  /past event/i,                            // sometimes literal text
  /sorry,? (?:this )?(?:page|event) (?:doesn'?t exist|not found|isn'?t available)/i,
  /404[^0-9]/i,
  /page not found/i,
  /event not found/i,
  /this draft has expired/i,
  /unavailable in your region/i,
];

async function deepCheck(url) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 20000);
  try {
    const r = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: ac.signal,
      headers: {
        'User-Agent': UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-IN,en;q=0.9',
      },
    });
    if (!r.ok && r.status !== 206) return { status: r.status, ok: false };
    const html = await r.text();
    const sample = html.slice(0, 250000);
    for (const rx of DEAD_PATTERNS) {
      const m = sample.match(rx);
      if (m) return { status: r.status, ok: false, deadHint: m[0].slice(0, 80) };
    }
    return { status: r.status, ok: true };
  } catch (e) {
    return { status: 0, ok: false, error: e.name === 'AbortError' ? 'timeout' : e.message };
  } finally { clearTimeout(t); }
}

const POOL = 4;
const results = [];
let i = 0;
async function worker() {
  while (i < upcoming.length) {
    const e = upcoming[i++];
    const r = await deepCheck(e.link);
    results.push({ ...e, ...r });
    const sym = r.ok ? '✅' : '⚠️ ';
    const note = r.error || r.deadHint || (r.ok ? '' : `${r.status}`);
    console.log(`${sym} [${r.status || 'ERR'}] ${e.name.slice(0, 55).padEnd(55)} ${note}`);
  }
}
await Promise.all(Array.from({ length: POOL }, worker));

results.sort((a, b) => a.startDate.localeCompare(b.startDate));
fs.writeFileSync('scripts/link-check-deep.json', JSON.stringify(results, null, 2));

const flagged = results.filter((r) => !r.ok);
console.log('\n═══════════════════════════════════════════════');
console.log('DEEP CHECK SUMMARY');
console.log('═══════════════════════════════════════════════');
console.log(`Reachable & content-OK : ${results.filter((r) => r.ok).length}`);
console.log(`Flagged                : ${flagged.length}`);

if (flagged.length) {
  console.log('\n=== FLAGGED FOR MANUAL VERIFY ===');
  for (const f of flagged) {
    console.log(`\n[${f.id}] ${f.name}  (${f.startDate})`);
    console.log(`  ${f.link}`);
    console.log(`  status=${f.status || 'ERR'}${f.deadHint ? ' · hint="' + f.deadHint + '"' : ''}${f.error ? ' · err=' + f.error : ''}`);
  }
}
