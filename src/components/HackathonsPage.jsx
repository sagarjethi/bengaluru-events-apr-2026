import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Trophy, Calendar, MapPin, Sparkles, Code, Rocket, ChevronRight, Search, ArrowUpDown, X as XClose, ArrowRight, BookOpen, Clock, History, CalendarClock } from 'lucide-react';
import { events } from '../data';
import EventCard from './EventCard';
import EventDateStrip from './EventDateStrip';
import BuilderResourcesPreview from './BuilderResourcesPreview';
import { toSlug } from '../utils/slug';
import {
  INR_PER_USD,
  parsePrizeUsd,
  parsePrizeBuckets,
  formatUsdCompact,
  formatInrCompact,
} from '../utils/stats';

const PAGE_URL = 'https://bengaluru-events.sagarjethi.com/hackathons';

function formatShortDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}
function pad(n) { return n < 10 ? `0${n}` : `${n}`; }
function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function plusDaysIso(iso, days) {
  const [y, m, d] = iso.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

const TIME_FILTERS = [
  { id: 'all',      label: 'All',         icon: Calendar },
  { id: 'upcoming', label: 'Upcoming',    icon: CalendarClock },
  { id: 'this-week',label: 'This week',   icon: Clock },
  { id: 'past',     label: 'Past',        icon: History },
];

export default function HackathonsPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'prize' | 'date'
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeFilter, setTimeFilter] = useState('upcoming');

  const hackathons = useMemo(() => events.filter((e) => e.category === 'hackathon'), []);

  const selectedDateLabel = useMemo(() => {
    if (!selectedDate) return null;
    const [y, m, d] = selectedDate.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC',
    });
  }, [selectedDate]);

  const totals = useMemo(() => {
    return hackathons.reduce(
      (acc, h) => {
        const { usd, inr } = parsePrizeBuckets(h.prize);
        acc.usd += usd;
        acc.inr += inr;
        if (h.prize) acc.withPrize += 1;
        return acc;
      },
      { usd: 0, inr: 0, withPrize: 0 }
    );
  }, [hackathons]);

  const totalUsdEq = totals.usd + Math.round(totals.inr / INR_PER_USD);

  const dateRange = useMemo(() => {
    if (hackathons.length === 0) return null;
    const sorted = [...hackathons].sort((a, b) => a.startDate.localeCompare(b.startDate));
    return {
      start: sorted[0].startDate,
      end: sorted[sorted.length - 1].endDate || sorted[sorted.length - 1].startDate,
    };
  }, [hackathons]);

  const topThree = useMemo(() => {
    return [...hackathons]
      .filter((h) => h.prize)
      .sort((a, b) => parsePrizeUsd(b.prize) - parsePrizeUsd(a.prize))
      .slice(0, 3);
  }, [hackathons]);

  const filteredSorted = useMemo(() => {
    let list = hackathons;
    const today = todayIso();
    const weekEnd = plusDaysIso(today, 7);
    if (timeFilter === 'upcoming') {
      list = list.filter((h) => h.endDate >= today);
    } else if (timeFilter === 'past') {
      list = list.filter((h) => h.endDate < today);
    } else if (timeFilter === 'this-week') {
      list = list.filter((h) => h.startDate <= weekEnd && h.endDate >= today);
    }
    if (selectedDate) {
      list = list.filter((h) => h.startDate <= selectedDate && h.endDate >= selectedDate);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q) ||
          h.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (sortBy === 'prize') {
      list = [...list].sort((a, b) => {
        const diff = parsePrizeUsd(b.prize) - parsePrizeUsd(a.prize);
        if (diff !== 0) return diff;
        return a.startDate.localeCompare(b.startDate);
      });
    } else {
      list = [...list].sort((a, b) => a.startDate.localeCompare(b.startDate));
    }
    return list;
  }, [hackathons, search, sortBy, selectedDate, timeFilter]);

  // JSON-LD
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Bengaluru Hackathons — April 2026',
    description: `Complete directory of ${hackathons.length} hackathons and buildathons happening in Bengaluru during April 2026, with a combined prize pool of ${formatUsdCompact(totalUsdEq)}+.`,
    numberOfItems: hackathons.length,
    itemListElement: hackathons.map((h, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `https://bengaluru-events.sagarjethi.com/events/${toSlug(h.name)}`,
      item: {
        '@type': 'Event',
        '@id': `https://bengaluru-events.sagarjethi.com/events/${toSlug(h.name)}`,
        name: h.name,
        description: h.description,
        startDate: h.startDate,
        endDate: h.endDate,
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: {
          '@type': 'Place',
          name: h.venue,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Bengaluru',
            addressRegion: 'Karnataka',
            addressCountry: 'IN',
          },
        },
        ...(h.prize
          ? {
              offers: {
                '@type': 'Offer',
                url: h.link,
                price: '0',
                priceCurrency: 'INR',
                availability: 'https://schema.org/InStock',
                description: `Prize pool: ${h.prize}`,
              },
            }
          : {
              offers: {
                '@type': 'Offer',
                url: h.link,
                availability: 'https://schema.org/InStock',
              },
            }),
        organizer: { '@type': 'Organization', name: h.tags?.[0] || 'Bengaluru Events' },
      },
    })),
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How many hackathons are happening in Bengaluru in April 2026?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `There are ${hackathons.length} hackathons and buildathons scheduled in Bengaluru between ${formatShortDate(dateRange?.start)} and ${formatShortDate(dateRange?.end)}, 2026 — including OpenAI Codex Hackathon, OpenCode Buildathon, Meta PyTorch Hackathon, YC × Crustdata ContextCon, Lyzr Agentathon, HackBricks, HackBLR, and more.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the total prize pool for Bengaluru hackathons in April 2026?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The combined prize pool across all hackathons is approximately ${formatUsdCompact(totalUsdEq)}+ — roughly ${formatUsdCompact(totals.usd)} in USD cash & credits plus ${formatInrCompact(totals.inr)} in INR. The biggest prizes are at OpenAI Codex Hackathon and OpenCode Buildathon ($100,000 each).`,
        },
      },
      {
        '@type': 'Question',
        name: `Which hackathon has the biggest prize in Bengaluru April 2026?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The OpenAI Codex Hackathon (April 16) and the OpenCode Buildathon (April 19) are tied with $100,000 prize pools each. Meta's PyTorch Hackathon offers $30,000, and YC × Crustdata ContextCon offers $12,000.`,
        },
      },
      {
        '@type': 'Question',
        name: `Are these hackathons free to attend?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Most hackathons listed are free to apply, though many are selection-based or invite-only given limited capacity. OpenAI Codex, OpenCode Buildathon, VibeCon, Meta PyTorch, HackBricks, HackBLR, and Lyzr Agentathon are all free (application-based).`,
        },
      },
      {
        '@type': 'Question',
        name: `Who can participate in Bengaluru hackathons in April 2026?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Eligibility varies: OpenCode Buildathon is for experienced builders who have shipped before, VibeCon is for top 300 builders with YC interview prizes, and events like HackBLR and GDG Build For Bengaluru welcome students and early-career developers. Check each event's detail page for specific eligibility.`,
        },
      },
    ],
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Bengaluru Events', item: 'https://bengaluru-events.sagarjethi.com/' },
      { '@type': 'ListItem', position: 2, name: 'Hackathons', item: PAGE_URL },
    ],
  };

  const title = `${hackathons.length} Bengaluru Hackathons April 2026 — ${formatUsdCompact(totalUsdEq)}+ Prize Pool`;
  const description = `Curated list of ${hackathons.length} AI, Web3 & developer hackathons in Bengaluru, April 2026. ${formatUsdCompact(totalUsdEq)}+ total prizes — OpenAI Codex ($100K), OpenCode Buildathon ($100K), Meta PyTorch ($30K), YC × Crustdata, Lyzr Agentathon. Apply free.`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content="bengaluru hackathons april 2026, bangalore hackathons 2026, ai hackathon india, openai codex hackathon, opencode buildathon, meta pytorch hackathon, yc hackathon india, crustdata contextcon, lyzr agentathon, hackblr, hackbricks, buildathon bengaluru, tech hackathon india, web3 hackathon bangalore"
        />
        <link rel="canonical" href={PAGE_URL} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:site_name" content="Bengaluru Events" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:image" content="https://bengaluru-events.sagarjethi.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Bengaluru Hackathons April 2026 — Complete directory with prize pools" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://bengaluru-events.sagarjethi.com/og-image.png" />
        <meta name="geo.region" content="IN-KA" />
        <meta name="geo.placename" content="Bengaluru" />
        <meta name="geo.position" content="12.9716;77.5946" />
        <meta name="ICBM" content="12.9716, 77.5946" />
        <script type="application/ld+json">{JSON.stringify(itemListLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="bg-white border-b border-slate-200">
          <ol className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-1.5 text-sm text-slate-500">
            <li>
              <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            </li>
            <li aria-hidden="true"><ChevronRight className="w-4 h-4" /></li>
            <li aria-current="page" className="font-medium text-slate-800">Hackathons</li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="bg-gradient-to-br from-violet-600 via-primary-600 to-primary-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
            {/* Announcement: Builder Resources hub */}
            <Link
              to="/hackathons/resources"
              className="group inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-300/15 hover:bg-amber-300/25 backdrop-blur-sm text-amber-200 text-xs font-semibold mb-3 border border-amber-300/30 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New:</span>
              Builder Resources hub — ideas, tools & guides
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Location pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-xs font-semibold mb-4 ml-0 sm:ml-2 border border-white/10">
              <Code className="w-3.5 h-3.5" />
              Bengaluru · April 2026
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-4xl">
              Every hackathon in Bengaluru, <span className="text-amber-300">April 2026</span>.
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl">
              {hackathons.length} curated hackathons & buildathons — {formatUsdCompact(totalUsdEq)}+ in combined prizes, backed by OpenAI, Meta, Y Combinator, Hashed Emergent, GrowthX and more.
            </p>

            {/* Primary + secondary CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#all-hackathons"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-primary-700 hover:bg-amber-50 hover:text-primary-800 font-semibold text-sm transition-colors shadow-lg shadow-primary-900/20"
              >
                Browse all hackathons
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/hackathons/resources"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold text-sm border border-white/20 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Builder Resources
              </Link>
            </div>

            {/* USP Stats — tightened to a single horizontal row that doesn't compete with the CTAs */}
            <dl className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 max-w-3xl">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2.5 border border-white/10">
                <dt className="text-[10px] font-medium text-white/70 uppercase tracking-wide">Hackathons</dt>
                <dd className="text-xl md:text-2xl font-bold text-white mt-0.5">{hackathons.length}</dd>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2.5 border border-white/10">
                <dt className="text-[10px] font-medium text-white/70 uppercase tracking-wide">Total Prizes</dt>
                <dd className="text-xl md:text-2xl font-bold text-amber-300 mt-0.5">{formatUsdCompact(totalUsdEq)}+</dd>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2.5 border border-white/10">
                <dt className="text-[10px] font-medium text-white/70 uppercase tracking-wide">Dates</dt>
                <dd className="text-base md:text-lg font-bold text-white mt-0.5 leading-tight">
                  {dateRange ? `${formatShortDate(dateRange.start)} – ${formatShortDate(dateRange.end)}` : '—'}
                </dd>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2.5 border border-white/10">
                <dt className="text-[10px] font-medium text-white/70 uppercase tracking-wide">With Prize Pool</dt>
                <dd className="text-xl md:text-2xl font-bold text-white mt-0.5">{totals.withPrize}</dd>
              </div>
            </dl>

            {/* Trust row — backed-by partners */}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-white/70 text-sm">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Backed by</span>
              {['OpenAI', 'Meta', 'Y Combinator', 'Hashed Emergent', 'GrowthX', 'Scaler'].map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-sm text-white/80 text-xs font-medium border border-white/10"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Top 3 by Prize — prize-as-hero hierarchy */}
        {topThree.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Biggest Prize Pools</h2>
              <p className="text-sm text-slate-500 mt-1">Top 3 by prize</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topThree.map((h, idx) => {
                const rankStyles = [
                  { label: '1st', accent: 'text-amber-600',  ring: 'group-hover:ring-amber-300',  amount: 'text-amber-600' },
                  { label: '2nd', accent: 'text-slate-500',  ring: 'group-hover:ring-slate-300',  amount: 'text-slate-800' },
                  { label: '3rd', accent: 'text-orange-600', ring: 'group-hover:ring-orange-300', amount: 'text-orange-700' },
                ][idx];
                return (
                  <Link
                    key={h.id}
                    to={`/events/${toSlug(h.name)}`}
                    aria-label={`${h.name} — ${h.prize} prize pool, ${h.date}`}
                    className={`group relative bg-white rounded-2xl border border-slate-200 hover:shadow-xl ring-1 ring-transparent ${rankStyles.ring} transition-all p-6 flex flex-col`}
                  >
                    {/* Tiny rank label, top-right — non-competing decoration */}
                    <span className={`absolute top-4 right-5 text-[11px] font-bold uppercase tracking-wider ${rankStyles.accent}`}>
                      {rankStyles.label}
                    </span>

                    {/* Prize amount as visual hero */}
                    <div className="mb-5">
                      <div className={`text-3xl md:text-4xl font-extrabold leading-none ${rankStyles.amount}`}>
                        {h.prize}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1.5">
                        Prize pool
                      </div>
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors leading-snug mb-2">
                      {h.name}
                    </h3>

                    {/* One concise meta line — date · cost */}
                    <p className="text-sm text-slate-500 mb-5">
                      {h.date} · {h.cost}
                    </p>

                    {/* Clear primary CTA */}
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:text-primary-700 mt-auto">
                      View details
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Why this page / USP */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Curated, not scraped</h3>
              <p className="text-sm text-slate-500">Hand-verified listings from Luma, Eventbrite, HackerEarth and direct organizer pages — no dead links.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Rocket className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Builder-first detail</h3>
              <p className="text-sm text-slate-500">Every event includes prize pool, eligibility, venue, timing, and direct registration — no walls between you and applying.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Prize transparency</h3>
              <p className="text-sm text-slate-500">
                ≈ {formatUsdCompact(totals.usd)} USD + {formatInrCompact(totals.inr)} INR across {totals.withPrize} hackathons with confirmed prize pools.
              </p>
            </div>
          </div>
        </section>

        {/* Hackathon Calendar — same horizontal strip as the homepage, scoped to hackathons */}
        <section
          id="hackathon-calendar"
          aria-label="Hackathon calendar — April and May 2026"
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10"
        >
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Hackathon calendar</h2>
              <p className="text-xs text-slate-500 mt-0.5">Click any highlighted day to filter</p>
            </div>
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="inline-flex items-center gap-1 rounded-full bg-violet-50 ring-1 ring-violet-100 text-violet-700 px-3 py-1 text-xs font-semibold hover:bg-violet-100"
              >
                {selectedDateLabel}
                <XClose className="w-3 h-3" />
              </button>
            )}
          </div>
          <EventDateStrip
            events={hackathons}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            accent="violet"
            onAfterSelect={() => {
              const el = document.querySelector('#all-hackathons');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          />
        </section>

        {/* Filters + Grid */}
        <section id="all-hackathons" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">All Hackathons</h2>
              <p className="text-sm text-slate-500 mt-1">
                Showing <span className="font-semibold text-slate-700 tabular-nums">{filteredSorted.length}</span> of {hackathons.length}
                {selectedDate && selectedDateLabel ? ` · ${selectedDateLabel}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search hackathons…"
                  aria-label="Search hackathons"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => setSortBy(sortBy === 'prize' ? 'date' : 'prize')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg transition-colors"
                aria-label={`Sort by ${sortBy === 'prize' ? 'date' : 'prize'}`}
              >
                <ArrowUpDown className="w-4 h-4" />
                Sort: {sortBy === 'prize' ? 'Prize' : 'Date'}
              </button>
            </div>
          </div>

          {/* Time-filter chips */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">When</span>
            {TIME_FILTERS.map((f) => {
              const Icon = f.icon;
              const on = timeFilter === f.id;
              const count = f.id === 'all'
                ? hackathons.length
                : f.id === 'upcoming'
                  ? hackathons.filter((h) => h.endDate >= todayIso()).length
                  : f.id === 'past'
                    ? hackathons.filter((h) => h.endDate < todayIso()).length
                    : f.id === 'this-week'
                      ? hackathons.filter((h) => h.startDate <= plusDaysIso(todayIso(), 7) && h.endDate >= todayIso()).length
                      : 0;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setTimeFilter(f.id)}
                  aria-pressed={on}
                  className={[
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition border',
                    on ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                  ].join(' ')}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {f.label}
                  <span className={`inline-flex items-center justify-center min-w-[1.25rem] h-4 px-1 rounded-full text-[10px] font-bold tabular-nums ${on ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="ml-auto inline-flex items-center gap-1 rounded-full bg-violet-50 ring-1 ring-violet-100 text-violet-700 px-3 py-1 text-xs font-semibold hover:bg-violet-100"
              >
                {selectedDateLabel}
                <XClose className="w-3 h-3" />
              </button>
            )}
          </div>

          {filteredSorted.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
              <p className="text-slate-500">No hackathons match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSorted.map((h) => (
                <EventCard key={h.id} event={h} />
              ))}
            </div>
          )}
        </section>

        {/* Builder Resources — placed after the hackathon list, as a secondary reference */}
        <BuilderResourcesPreview />

        {/* FAQ (rendered — reinforces JSON-LD FAQPage) */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqLd.mainEntity.map((q, i) => (
              <details key={i} className="group bg-white rounded-xl border border-slate-200 open:border-primary-200 open:shadow-sm">
                <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-slate-900 text-base">{q.name}</h3>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <p className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">{q.acceptedAnswer.text}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA back to all events */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            Browse all Bengaluru events
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
