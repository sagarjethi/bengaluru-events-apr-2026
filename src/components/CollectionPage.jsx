// Generic SEO-tuned filtered listing page.
// Used for /free-tech-events-bangalore, /ai-events-bangalore-2026, etc.
// Each route passes a `slug` prop; CONFIGS[slug] describes the filter + copy + meta.

import { useMemo, useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft, ChevronRight, Mail, Sparkles, MapPin,
  Tag, Trophy, Code, Calendar as CalIcon, Bot, Coins,
} from 'lucide-react';
import { events, CATEGORIES } from '../data/events';
import { toSlug } from '../utils/slug';
import EventCard from './EventCard';
import EmailCapture from './EmailCapture';
import Footer from './Footer';

const SITE = 'https://bengaluru-events.sagarjethi.com';

function pad(n) { return n < 10 ? `0${n}` : `${n}`; }
function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function nextWeekendRange() {
  const d = new Date();
  const dow = d.getDay(); // 0 Sun .. 6 Sat
  const daysUntilSat = (6 - dow + 7) % 7; // 0 if today is Sat
  const sat = new Date(d); sat.setDate(d.getDate() + (daysUntilSat || (dow === 6 ? 0 : 7)));
  const sun = new Date(sat); sun.setDate(sat.getDate() + 1);
  const fri = new Date(sat); fri.setDate(sat.getDate() - 1);
  const iso = (x) => `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
  return { fri: iso(fri), sat: iso(sat), sun: iso(sun) };
}
function isFree(e) { return /\bfree\b/i.test(e.cost || ''); }
function matchesAi(e) {
  const blob = `${e.name || ''} ${(e.tags || []).join(' ')} ${e.description || ''}`;
  return /\b(AI|GenAI|gen ai|LLM|GPT|machine learning|ML|deep learning|agentic|agent|RAG)\b/i.test(blob);
}
function matchesWeb3(e) {
  if (e.category === 'web3') return true;
  const blob = `${e.name || ''} ${(e.tags || []).join(' ')}`;
  return /\b(web3|blockchain|crypto|nft|defi|ethereum|solana|polygon|chainlink|dao)\b/i.test(blob);
}

// ---------------------------------------------------------------------------
// SEO config — one entry per route. Keep titles ≤60 chars, descriptions ≤155.
// ---------------------------------------------------------------------------

export const COLLECTIONS = {
  'free-tech-events-bangalore': {
    h1: ['Free Tech Events in', 'Bengaluru — 2026'],
    eyebrow: 'Curated · No ticket cost',
    icon: Tag,
    accent: 'emerald',
    intro:
      'Every free-to-attend tech event in Bengaluru — hackathons, conferences, AI workshops, dev meetups. No tickets. No paywalls.',
    title: 'Free Tech Events in Bengaluru 2026 — Hackathons, AI, Dev Meetups',
    description:
      'Free-to-attend tech events in Bengaluru: hackathons, conferences, AI workshops, dev meetups. Curated. Verified links. April + May 2026.',
    keywords: ['free tech events bangalore', 'free hackathons bangalore', 'free ai events bengaluru', 'free dev meetups bangalore'],
    filter: isFree,
    faqs: [
      { q: 'Are there really free tech events in Bengaluru?', a: 'Yes — over half the events on this site are free, including OpenAI Codex Hackathon, AWS Summit, YC Startup School, GDG Build For Bengaluru, and dozens of meetups.' },
      { q: 'How do I attend a free hackathon in Bangalore?', a: 'Click any hackathon on this page. Most use Luma or HasGeek for free RSVP. Bring your laptop, charger, and a project idea.' },
      { q: 'Do free tech events in Bengaluru have prizes?', a: 'Many do. OpenAI Codex Hackathon has $100K, Meta PyTorch has $30K, Aya AI Hackathon has $20K+ — all with free entry.' },
    ],
  },

  'ai-events-bangalore-2026': {
    h1: ['AI Events in', 'Bengaluru — 2026'],
    eyebrow: 'AI · GenAI · LLMs · Agents',
    icon: Bot,
    accent: 'violet',
    intro:
      'India\'s densest AI calendar. From OpenAI hackathons to agentic-AI meetups, GitHub Copilot Dev Days to Apache Kafka × ML — every Bengaluru AI event in one place.',
    title: 'AI Events in Bengaluru 2026 — Hackathons, Meetups, Workshops',
    description:
      'AI events in Bengaluru 2026: OpenAI Codex Hackathon, ElevenLabs Buildathon, agentic-AI workshops, GitHub Copilot Dev Days, Meta PyTorch finale and more.',
    keywords: ['ai events bangalore', 'genai meetups bengaluru', 'llm hackathons bangalore', 'agentic ai bangalore', 'ai workshops bengaluru'],
    filter: matchesAi,
    faqs: [
      { q: 'What AI events are happening in Bengaluru in 2026?', a: 'OpenAI\'s first Codex Hackathon (Apr 16, $100K), ElevenLabs Buildathon, Meta PyTorch finale, Aya AI Hackathon, JioHotstar ScaleUp, GitHub Copilot Dev Days, plus 30+ agentic-AI workshops in May.' },
      { q: 'Are AI events in Bangalore free?', a: 'Most are. OpenAI Codex Hackathon, ElevenLabs Buildathon, Meta PyTorch finale, AWS Summit, and most agentic-AI meetups are free.' },
      { q: 'How do I find AI hackathons in Bengaluru?', a: 'Use the Hackathons page or filter "Hackathons" on any month page. We track every public AI hackathon happening in Bengaluru.' },
    ],
  },

  'conferences-bangalore-2026': {
    h1: ['Tech Conferences in', 'Bengaluru — 2026'],
    eyebrow: 'Polyglot · Enterprise · Multi-day',
    icon: Code,
    accent: 'primary',
    intro:
      'Multi-day developer and enterprise conferences in Bengaluru — GIDS, AWS Summit, Rust India, W3Summit, Tech & Innovation Summit, plus HasGeek Mini Confs through May.',
    title: 'Tech Conferences in Bengaluru 2026 — GIDS, AWS Summit, Rust India',
    description:
      'Major tech conferences in Bengaluru 2026: GIDS (Asia-Pacific\'s largest dev conf), AWS Summit, Rust India, W3Summit. Dates, venues, registration links.',
    keywords: ['conferences in bangalore 2026', 'tech conferences bengaluru', 'developer conferences india', 'gids 2026', 'aws summit bengaluru'],
    filter: (e) => e.category === 'conference',
    faqs: [
      { q: 'What is the biggest tech conference in Bengaluru in 2026?', a: 'GIDS 2026 (Asia-Pacific\'s largest polyglot developer conference, 4 days at IISc) and AWS Summit Bengaluru (2 days, free, KTPO Whitefield) are the largest.' },
      { q: 'When is AWS Summit Bengaluru 2026?', a: 'April 22–23, 2026 at KTPO Exhibition Center, Whitefield. Registration is free.' },
      { q: 'Are tech conferences in Bangalore worth attending?', a: 'GIDS, AWS Summit, and Rust India consistently rank among India\'s most valuable tech conferences. Most have student discounts; AWS Summit is fully free.' },
    ],
  },

  'hackathons-bangalore-2026': {
    h1: ['Hackathons in', 'Bengaluru — 2026'],
    eyebrow: 'Build · Win · Network',
    icon: Trophy,
    accent: 'violet',
    intro:
      'Every public hackathon happening in Bengaluru this season — OpenAI Codex ($100K), Meta PyTorch ($30K), VibeCon, ElevenLabs Buildathon, HackBLR, and more.',
    title: 'Hackathons in Bengaluru 2026 — $145K+ in Prizes',
    description:
      'Every Bengaluru hackathon for 2026: OpenAI Codex ($100K), Meta PyTorch ($30K), VibeCon (YC interview), ElevenLabs Buildathon, HackBLR, HackBricks. Free entry.',
    keywords: ['hackathons bangalore 2026', 'openai hackathon india', 'free hackathons bengaluru', 'ai hackathons bangalore', 'hackathons with prizes india'],
    filter: (e) => e.category === 'hackathon',
    faqs: [
      { q: 'How many hackathons are in Bengaluru in 2026?', a: '10+ verified public hackathons with $145K+ in total prizes. OpenAI Codex ($100K), Meta PyTorch ($30K), Aya AI Hackathon ($20K+), VibeCon (YC interview prize), and more.' },
      { q: 'What is the biggest hackathon in Bangalore?', a: 'OpenAI Codex Hackathon — $100,000 in prizes, hosted with GrowthX. April 16, 2026.' },
      { q: 'Are Bangalore hackathons free?', a: 'Yes. All 10 listed hackathons are free to enter. You only pay for travel and food.' },
    ],
  },

  'web3-events-bangalore-2026': {
    h1: ['Web3 & Crypto Events in', 'Bengaluru — 2026'],
    eyebrow: 'Blockchain · DeFi · NFT · DAO',
    icon: Coins,
    accent: 'amber',
    intro:
      'Web3, blockchain, DeFi, and crypto events happening across Bengaluru — W3Summit, Aya AI × DeFi Hackathon, Chainlink builder meetup, and more.',
    title: 'Web3 & Crypto Events in Bengaluru 2026 — W3Summit, DeFi, NFT',
    description:
      'Web3 events in Bengaluru 2026: W3Summit (India\'s biggest Web3 fest), Aya AI × DeFi Hackathon, Chainlink meetup, blockchain builder events.',
    keywords: ['web3 events bangalore', 'crypto events bengaluru', 'blockchain meetups bangalore', 'defi events india', 'w3summit 2026'],
    filter: matchesWeb3,
    faqs: [
      { q: 'Are there Web3 events in Bengaluru?', a: 'Yes. W3Summit 2026 (2,000+ attendees, 50+ speakers) is India\'s biggest Web3 festival. Plus Aya AI × DeFi Hackathon and Chainlink builder meetups.' },
      { q: 'When is W3Summit 2026?', a: 'April 16–17, 2026 at Sheraton Grand Bangalore, Brigade Gateway.' },
    ],
  },
};

// ---------------------------------------------------------------------------

const ACCENT_CLASSES = {
  primary: { iconBg: 'bg-primary-600', dot: 'bg-primary-500', text: 'text-primary-700', soft: 'bg-primary-50', ring: 'ring-primary-100' },
  emerald: { iconBg: 'bg-emerald-600', dot: 'bg-emerald-500', text: 'text-emerald-700', soft: 'bg-emerald-50', ring: 'ring-emerald-100' },
  violet:  { iconBg: 'bg-violet-600',  dot: 'bg-violet-500',  text: 'text-violet-700',  soft: 'bg-violet-50',  ring: 'ring-violet-100' },
  amber:   { iconBg: 'bg-amber-600',   dot: 'bg-amber-500',   text: 'text-amber-700',   soft: 'bg-amber-50',   ring: 'ring-amber-100' },
};

export default function CollectionPage({ slug: propSlug }) {
  const params = useParams();
  const slug = propSlug || params.slug;
  const config = COLLECTIONS[slug];

  // For /this-weekend, generate dynamic config (depends on today's date)
  const dynConfig = useMemo(() => {
    if (slug !== 'tech-events-this-weekend-bangalore') return null;
    const w = nextWeekendRange();
    return {
      h1: ['This Weekend in', 'Bengaluru — Tech Events'],
      eyebrow: 'Friday → Sunday',
      icon: CalIcon,
      accent: 'primary',
      intro: `Every tech event happening in Bengaluru ${w.fri} → ${w.sun}. Refreshes daily.`,
      title: 'Tech Events in Bengaluru This Weekend — Hackathons, Meetups',
      description: `Curated weekend tech events in Bengaluru. ${w.fri} to ${w.sun}. Hackathons, meetups, conferences. Updated daily.`,
      keywords: ['tech events bangalore this weekend', 'this weekend bengaluru', 'weekend hackathons bangalore'],
      filter: (e) => e.startDate <= w.sun && e.endDate >= w.fri,
      faqs: [
        { q: 'What tech events are happening in Bengaluru this weekend?', a: 'See the list above — refreshed daily. Most events are on Saturday or Sunday and have free entry.' },
        { q: 'Are weekend hackathons in Bengaluru free?', a: 'Most are. RSVP via Luma, Meetup, or HasGeek using the link on each event page.' },
      ],
    };
  }, [slug]);

  const cfg = config || dynConfig;
  if (!cfg) return <Navigate to="/events" replace />;

  const filtered = useMemo(() => {
    return events
      .filter(cfg.filter)
      .sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));
  }, [cfg]);

  const accent = ACCENT_CLASSES[cfg.accent] || ACCENT_CLASSES.primary;
  const Icon = cfg.icon;

  // Scroll to top on slug change
  useEffect(() => { window.scrollTo({ top: 0 }); }, [slug]);

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: cfg.title,
    description: cfg.description,
    numberOfItems: filtered.length,
    itemListElement: filtered.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE}/events/${toSlug(e.name)}`,
      name: e.name,
    })),
  };
  const faqJsonLd = cfg.faqs?.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cfg.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null;

  // Group by category for content density
  const byCategory = {};
  for (const e of filtered) (byCategory[e.category] = byCategory[e.category] || []).push(e);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{cfg.title}</title>
        <meta name="description" content={cfg.description} />
        <meta name="keywords" content={cfg.keywords?.join(', ')} />
        <link rel="canonical" href={`${SITE}/${slug}`} />
        <meta property="og:title" content={cfg.title} />
        <meta property="og:description" content={cfg.description} />
        <meta property="og:url" content={`${SITE}/${slug}`} />
        <meta property="og:image" content={`${SITE}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(itemListJsonLd)}</script>
        {faqJsonLd && <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>}
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <Link to="/events" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-5">
          <ArrowLeft className="w-4 h-4" /> All event categories
        </Link>

        {/* Hero */}
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className={`inline-flex items-center gap-2 ${accent.text} text-xs font-bold uppercase tracking-[0.12em]`}>
              <span className={`inline-flex w-7 h-7 items-center justify-center rounded-lg ${accent.iconBg} text-white`}>
                <Icon className="w-4 h-4" />
              </span>
              {cfg.eyebrow}
            </div>
            <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.05]">
              {cfg.h1[0]} <span className={accent.text}>{cfg.h1[1]}</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl leading-relaxed">{cfg.intro}</p>
          </div>
          <div className={`shrink-0 rounded-2xl ${accent.soft} ring-1 ${accent.ring} px-5 py-4 text-center`}>
            <div className={`text-4xl font-bold tabular-nums ${accent.text}`}>{filtered.length}</div>
            <div className={`text-[11px] uppercase tracking-wider font-semibold mt-0.5 ${accent.text} opacity-80`}>events</div>
          </div>
        </div>

        {/* Cross-collection chips */}
        <div className="mt-8 flex flex-wrap gap-2">
          {Object.entries(COLLECTIONS).filter(([s]) => s !== slug).map(([s, c]) => {
            const a = ACCENT_CLASSES[c.accent] || ACCENT_CLASSES.primary;
            return (
              <Link
                key={s}
                to={`/${s}`}
                className={`inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition`}
              >
                <span className={`w-2 h-2 rounded-full ${a.dot}`} />
                {c.h1[0].replace(/ in$/, '')} {c.h1[1].split(' — ')[0]}
              </Link>
            );
          })}
        </div>

        {/* Subscribe */}
        <div className="mt-8 rounded-2xl bg-gradient-to-br from-primary-50 via-white to-violet-50 border border-primary-100 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="hidden sm:flex w-10 h-10 rounded-xl bg-primary-600 text-white items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary-700">
                  <Sparkles className="w-3 h-3" /> Get weekly updates
                </div>
                <p className="text-sm text-slate-700 mt-0.5">
                  Bengaluru's tech week, summarised every Monday. {filtered.length} curated events and counting.
                </p>
              </div>
            </div>
            <div className="sm:max-w-md sm:w-[420px]">
              <EmailCapture variant="inline" placeholder="you@example.com" cta="Subscribe" source={`collection:${slug}`} successMessage="Subscribed 🙏" />
            </div>
          </div>
        </div>

        {/* Events */}
        {filtered.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 p-10 text-center">
            <MapPin className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-700 font-medium">No events match this collection right now.</p>
            <p className="text-sm text-slate-500 mt-1">Subscribe above to get notified when we add new ones.</p>
          </div>
        ) : (
          <div className="mt-10">
            {Object.keys(byCategory).length > 1 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(byCategory).map(([cat, list]) => (
                  <a key={cat} href={`#cat-${cat}`} className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${CATEGORIES[cat]?.color || 'bg-slate-100 text-slate-700'}`}>
                    <span className={`w-2 h-2 rounded-full ${CATEGORIES[cat]?.dot || 'bg-slate-500'}`} />
                    {CATEGORIES[cat]?.label || cat} <span className="opacity-70">({list.length})</span>
                  </a>
                ))}
              </div>
            )}
            {Object.entries(byCategory).map(([cat, list]) => (
              <section key={cat} id={`cat-${cat}`} className="mt-10 first:mt-0 scroll-mt-20">
                <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${CATEGORIES[cat]?.dot || 'bg-slate-500'}`} />
                  {CATEGORIES[cat]?.label || cat}
                  <span className="text-sm text-slate-500 font-normal">({list.length})</span>
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {list.map((e) => <EventCard key={e.id} event={e} />)}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* FAQs */}
        {cfg.faqs?.length > 0 && (
          <section className="mt-16 border-t border-slate-200 pt-10" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-bold text-slate-900 mb-6">Frequently asked</h2>
            <div className="space-y-4">
              {cfg.faqs.map((f, i) => (
                <details key={i} className="group rounded-xl border border-slate-200 bg-white px-5 py-4 hover:border-slate-300">
                  <summary className="flex items-center justify-between cursor-pointer font-semibold text-slate-900 list-none">
                    <span>{f.q}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
}
