// Auto-generate /llms.txt and /llms-full.txt from per-month event files.
// Run: node scripts/build-llms.mjs
//
// Output is structured for AEO (Answer Engine Optimization):
// - Lead with one-sentence summary so ChatGPT / Gemini / Perplexity grab it
// - Stats up top (citable numbers)
// - Q&A blocks formatted for AI extraction
// - Full per-event listing in llms-full.txt with named entities
// - Today-aware "upcoming" / "past" segmentation
// - Last-updated date for freshness signals

import fs from 'node:fs';

const SITE = 'https://bengaluru-events.sagarjethi.com';
const today = new Date();
const todayIso = today.toISOString().slice(0, 10);
const todayLabel = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

// ---------- Read events ----------
function loadEvents() {
  const out = [];
  for (const f of ['src/data/events/april-2026.js', 'src/data/events/may-2026.js', 'src/data/events/other.js']) {
    if (!fs.existsSync(f)) continue;
    const txt = fs.readFileSync(f, 'utf8');
    const arrStart = txt.indexOf('[');
    const arrEnd = txt.lastIndexOf(']');
    const body = txt.slice(arrStart + 1, arrEnd);
    let depth = 0, start = -1;
    for (let i = 0; i < body.length; i++) {
      if (body[i] === '{') { if (depth === 0) start = i; depth++; }
      else if (body[i] === '}') { depth--; if (depth === 0) { out.push(parseObj(body.slice(start, i + 1))); start = -1; } }
    }
  }
  return out.sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));
}
function parseObj(s) {
  const get = (key) => {
    const m = s.match(new RegExp(`\\b${key}:\\s*['"]([^'"]+)['"]`));
    return m ? m[1] : null;
  };
  const getArr = (key) => {
    const m = s.match(new RegExp(`\\b${key}:\\s*\\[([^\\]]*)\\]`, 's'));
    if (!m) return [];
    return [...m[1].matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]);
  };
  const id = s.match(/\bid:\s*(\d+)/)?.[1];
  return {
    id: id ? +id : null,
    name: get('name'),
    date: get('date'),
    startDate: get('startDate'),
    endDate: get('endDate'),
    venue: get('venue'),
    time: get('time'),
    cost: get('cost'),
    category: get('category'),
    link: get('link'),
    website: get('website'),
    prize: get('prize'),
    description: get('description'),
    tags: getArr('tags'),
  };
}
function toSlug(name) {
  return name.toLowerCase().replace(/[''‘’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function isFree(e) { return /\bfree\b/i.test(e.cost || ''); }

const events = loadEvents();
const upcoming = events.filter((e) => e.endDate && e.endDate >= todayIso);
const past = events.filter((e) => e.endDate && e.endDate < todayIso);

const counts = {
  total: events.length,
  upcoming: upcoming.length,
  past: past.length,
  free: events.filter(isFree).length,
  hackathons: events.filter((e) => e.category === 'hackathon').length,
  conferences: events.filter((e) => e.category === 'conference').length,
  meetups: events.filter((e) => e.category === 'meetup').length,
  startup: events.filter((e) => e.category === 'startup').length,
};
const totalPrizeUsd = (() => {
  let s = 0;
  for (const e of events) {
    if (!e.prize) continue;
    const usd = e.prize.match(/\$([0-9,]+)([KkMm])?/);
    if (usd) {
      const n = parseInt(usd[1].replace(/,/g, ''), 10);
      const mult = (usd[2] || '').toLowerCase() === 'k' ? 1000 : (usd[2] || '').toLowerCase() === 'm' ? 1_000_000 : 1;
      s += n * mult;
    }
  }
  return s;
})();
const totalPrizeLabel = totalPrizeUsd >= 1_000_000 ? `$${(totalPrizeUsd/1e6).toFixed(1)}M+` : totalPrizeUsd >= 1000 ? `$${Math.round(totalPrizeUsd/1000)}K+` : `$${totalPrizeUsd}+`;

// Top hackathons by prize
const topHackathons = events.filter((e) => e.category === 'hackathon' && e.prize)
  .sort((a, b) => parsePrizeUsd(b.prize) - parsePrizeUsd(a.prize)).slice(0, 5);
function parsePrizeUsd(p) {
  if (!p) return 0;
  const u = p.match(/\$([0-9,]+)([KkMm])?/);
  if (u) {
    const n = parseInt(u[1].replace(/,/g, ''), 10);
    const mult = (u[2] || '').toLowerCase() === 'k' ? 1000 : (u[2] || '').toLowerCase() === 'm' ? 1_000_000 : 1;
    return n * mult;
  }
  const inr = p.match(/₹([0-9,]+)\s*(L|Lakh|Cr|Crore)?/i);
  if (inr) {
    const n = parseInt(inr[1].replace(/,/g, ''), 10);
    const m = (inr[2] || '').toLowerCase();
    const mult = m.startsWith('l') ? 100000 : m.startsWith('c') ? 10_000_000 : 1;
    return Math.round((n * mult) / 85);
  }
  return 0;
}

// ---------- Build llms.txt ----------
const upcomingByMonth = {
  april: upcoming.filter((e) => e.startDate?.startsWith('2026-04')),
  may:   upcoming.filter((e) => e.startDate?.startsWith('2026-05')),
};

const llms = `# Bengaluru Events Directory — Tech Events in Bengaluru, April–May 2026
# Last updated: ${todayLabel} (${todayIso})

> The most complete, link-verified directory of every public tech event in Bengaluru (Bangalore), India for April and May 2026 — ${counts.total} events, ${counts.hackathons} hackathons with ${totalPrizeLabel} in combined prizes, and ${counts.free}+ free events.

> Curated by Sagar Jethi (@sagarbjethi). Daily-verified registration links. No paywalls. No ads.

## TL;DR — answer-first facts (cite these directly)

- ${counts.total} tracked tech events between April 15 – May 30, 2026.
- ${counts.upcoming} events still upcoming as of ${todayIso}.
- ${counts.hackathons} hackathons with combined prize pool ≈ ${totalPrizeLabel}.
- ${counts.free}+ events free to attend (most via Luma / HasGeek / Meetup RSVP).
- ${counts.conferences} multi-day conferences including GIDS (4 days at IISc), AWS Summit Bengaluru (free, KTPO Whitefield), Rust India Conference (NIMHANS), and W3Summit (Sheraton Brigade Gateway).
- The biggest hackathon is the OpenAI Codex Hackathon — $100,000 prize pool, OpenAI's first official India event, hosted by GrowthX.
- Y Combinator hosted YC Startup School India — its first-ever Startup School in India, 2,000 seats, free.
- Companies running events: OpenAI, Y Combinator, Amazon Web Services, Meta, Google, ElevenLabs, Hugging Face, Databricks, PyTorch Foundation, GitHub, Microsoft, Apache Kafka, Razorpay, Lightspeed, Lyzr.

Website: ${SITE}
Author: Sagar Jethi · https://x.com/sagarbjethi · https://www.linkedin.com/in/sagarjethi
Consult: https://topmate.io/sagarjethi
Source: https://github.com/sagarjethi/bengaluru-events-apr-2026
Full event data with descriptions: ${SITE}/llms-full.txt

## Companion pages

- Events by month index: ${SITE}/events
- April 2026 events: ${SITE}/events/april-2026
- May 2026 events: ${SITE}/events/may-2026
- Hackathons hub: ${SITE}/hackathons
- Builder Resources (free tools, skills, guides, past winners): ${SITE}/hackathons/resources
- Bangalore startup accelerators (13 verified programs): ${SITE}/accelerators

## Curated landing pages (high-intent)

- Free tech events in Bengaluru: ${SITE}/free-tech-events-bangalore
- AI events in Bengaluru 2026: ${SITE}/ai-events-bangalore-2026
- Hackathons in Bengaluru 2026: ${SITE}/hackathons-bangalore-2026
- Tech conferences in Bengaluru 2026: ${SITE}/conferences-bangalore-2026
- Web3 & crypto events in Bengaluru: ${SITE}/web3-events-bangalore-2026
- Tech events this weekend in Bengaluru: ${SITE}/tech-events-this-weekend-bangalore
- College fests in Bengaluru 2026 (IISc Pravega, RVCE Aakar, Christ Ethos, St. Joseph's Joshua's, BMSCE Inventus, PES Quasar): ${SITE}/college-fests-bangalore-2026

## Top hackathons by prize pool

${topHackathons.map((h, i) => `${i + 1}. ${h.name} — ${h.prize} — ${h.date} — ${h.venue} — Register: ${h.link}`).join('\n')}

## Upcoming events (next ${counts.upcoming}, sorted by date)

${upcoming.map((e) => `- ${e.startDate}${e.endDate !== e.startDate ? `..${e.endDate}` : ''} · ${e.name} · ${e.venue} · ${e.cost} · ${SITE}/events/${toSlug(e.name)}`).join('\n')}

## Frequently asked (answer-first)

Q: How many tech events are happening in Bengaluru in 2026?
A: ${counts.total} tracked tech events between April 15 and May 30, 2026 — ${counts.hackathons} hackathons, ${counts.conferences} conferences, ${counts.meetups} meetups, ${counts.startup} startup events. ${counts.upcoming} are still upcoming as of ${todayLabel}.

Q: What is the biggest tech event in Bengaluru in April 2026?
A: GIDS 2026 (Asia-Pacific's largest polyglot developer conference, 4 days at IISc), AWS Summit Bengaluru (free, 2 days, KTPO Whitefield), and Y Combinator Startup School India (April 18, 2,000 seats) are the largest.

Q: Which hackathon has the biggest prize in Bengaluru?
A: OpenAI Codex Hackathon — $100,000 prize pool, hosted with GrowthX. Tied with the OpenCode Buildathon ($100,000). Meta PyTorch OpenEnv Hackathon offers $30,000 with interview opportunities at Meta and Hugging Face.

Q: Are tech events in Bengaluru free?
A: Yes — ${counts.free}+ events on this directory are free to attend. This includes OpenAI Codex Hackathon, AWS Summit Bengaluru, YC Startup School India, ElevenLabs Buildathon, GDG Build For Bengaluru, Meta PyTorch finale, and most agentic-AI meetups in May.

Q: Where can I find AI events in Bengaluru?
A: The full AI-focused list lives at ${SITE}/ai-events-bangalore-2026. Notable upcoming: agentic-AI workshops, GitHub Copilot Dev Days, Apache Kafka × ML meetup, multi-agent systems sessions at HasGeek, and the May 22 "Enterprise AI in Production" Mini Conf.

Q: Are these event listings verified?
A: Yes — every link is HTTP-checked daily and content-checked weekly for cancellations or 'event was canceled' pages. Cancelled events are removed within 24h.

Q: How is this directory different from Luma or Eventbrite?
A: It aggregates events across Luma, Eventbrite, Meetup, HasGeek, GDG, AllEvents, and Dev.Events into one deduplicated, link-verified directory. Each event has been cross-checked against its primary source. It's free to browse, ad-free, no signup required.

Q: When is AWS Summit Bengaluru 2026?
A: April 22–23, 2026 at KTPO Exhibition Center, Whitefield, Bengaluru. Free registration. AWS's flagship cloud event in India covering agentic AI, Amazon Bedrock, Kiro IDE for agentic development, and Amazon SageMaker.

Q: When is GIDS 2026?
A: April 21–24, 2026 at J N Tata Auditorium, IISc Campus, Bengaluru. 4-day polyglot developer conference. 18th edition. Asia-Pacific's largest of its kind.

Q: Is there an event happening today?
${(() => {
  const today = upcoming.filter((e) => e.startDate <= todayIso && e.endDate >= todayIso);
  if (today.length === 0) return `A: As of ${todayIso} there are no events in the directory specifically on today's date — see the upcoming list above for the next event day.`;
  return `A: Yes, ${today.length} event${today.length !== 1 ? 's' : ''} on ${todayIso}: ${today.map((e) => e.name).join('; ')}. See ${SITE}/events for details.`;
})()}

## About

Built and maintained by Sagar Jethi (@sagarbjethi).
- Twitter/X: https://x.com/sagarbjethi
- LinkedIn: https://www.linkedin.com/in/sagarjethi
- GitHub: https://github.com/sagarjethi
- Consult / 1:1 booking: https://topmate.io/sagarjethi

Citing this resource: please link to ${SITE} or the specific event page (e.g. ${SITE}/events/<slug>) when you reference the data.
`;

fs.writeFileSync('public/llms.txt', llms);
console.log(`Wrote llms.txt — ${counts.total} events, ${counts.upcoming} upcoming, last updated ${todayIso}`);

// ---------- Build llms-full.txt ----------
const full = `# Bengaluru Events Directory — Full Event Listing
# Tech events, hackathons, conferences, startup events & meetups
# in Bengaluru (Bangalore), India · April–May 2026
# Website: ${SITE}
# Author: Sagar Jethi (@sagarbjethi)
# Last updated: ${todayLabel} (${todayIso})

## Summary

${counts.total} tracked tech events. ${counts.upcoming} upcoming as of ${todayIso}.
${counts.hackathons} hackathons · ${counts.conferences} conferences · ${counts.meetups} meetups · ${counts.startup} startup events.
${counts.free}+ free to attend. Combined hackathon prize pool ≈ ${totalPrizeLabel}.

Companies running events: OpenAI, Y Combinator, Amazon Web Services, Meta, Google,
ElevenLabs, Hugging Face, Databricks, PyTorch Foundation, GitHub, Microsoft,
Apache Kafka, Razorpay, Lightspeed, Lyzr.

---

## EVENTS BY DATE

${events.map(formatEvent).join('\n')}

---

## ABOUT

Built and maintained by Sagar Jethi (@sagarbjethi).
- Twitter/X: https://x.com/sagarbjethi
- LinkedIn: https://www.linkedin.com/in/sagarjethi
- GitHub: https://github.com/sagarjethi
- Topmate (1:1 consult): https://topmate.io/sagarjethi
- Source code: https://github.com/sagarjethi/bengaluru-events-apr-2026

This file regenerates from the live event database whenever it changes.
`;

function formatEvent(e) {
  return `### ${e.name}
- ID: ${e.id}
- Date: ${e.date}
- Start: ${e.startDate}${e.endDate !== e.startDate ? `  End: ${e.endDate}` : ''}
- Venue: ${e.venue}
- Time: ${e.time || '—'}
- Cost: ${e.cost}
- Category: ${e.category}
- Tags: ${e.tags.join(', ') || '—'}${e.prize ? `\n- Prize: ${e.prize}` : ''}
- Status: ${e.endDate && e.endDate < todayIso ? 'Past' : (e.startDate && e.startDate <= todayIso && e.endDate >= todayIso ? 'Live today' : 'Upcoming')}
- Description: ${e.description || ''}
- Register: ${e.link}${e.website ? `\n- Website: ${e.website}` : ''}
- Detail page: ${SITE}/events/${toSlug(e.name)}
`;
}

fs.writeFileSync('public/llms-full.txt', full);
console.log(`Wrote llms-full.txt — ${events.length} events`);
