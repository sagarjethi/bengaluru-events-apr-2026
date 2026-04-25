import { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { events, CATEGORIES } from '../data/events';
import { toSlug } from '../utils/slug';
import EventCard from './EventCard';
import Footer from './Footer';

const SITE = 'https://bengaluru-events.sagarjethi.com';

const MONTHS = {
  'april-2026': {
    label: 'April 2026',
    short: 'April',
    year: 2026,
    monthNum: 4,
    range: '2026-04-01..2026-04-30',
    blurb: 'Bengaluru\'s biggest tech month — YC Startup School, Rust India, GIDS, AWS Summit, OpenAI Codex Hackathon, ElevenLabs Buildathon, Meta PyTorch Hackathon and dozens more.',
  },
  'may-2026': {
    label: 'May 2026',
    short: 'May',
    year: 2026,
    monthNum: 5,
    range: '2026-05-01..2026-05-31',
    blurb: 'After April\'s mega conferences, May 2026 keeps the momentum — agentic AI workshops, platform engineering meetups, React #103, Apache Kafka, GitHub Copilot Dev Days and more.',
  },
};

function eventsForMonth(monthNum, year) {
  return events
    .filter((e) => {
      if (!e.startDate) return false;
      const [y, m] = e.startDate.split('-').map(Number);
      return y === year && m === monthNum;
    })
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function MonthsIndexPage() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Bengaluru Tech Events by Month | April 2026 + May 2026</title>
        <meta
          name="description"
          content="Browse Bengaluru tech events by month. April 2026 features YC Startup School, GIDS, AWS Summit, Rust India, OpenAI Codex Hackathon. May 2026 covers agentic AI, platform engineering, React, and Kafka meetups."
        />
        <link rel="canonical" href={`${SITE}/events`} />
        <meta property="og:title" content="Bengaluru Tech Events — Month-by-Month Index" />
        <meta property="og:description" content="April 2026 + May 2026 tech events in Bengaluru — conferences, hackathons, AI/ML meetups." />
        <meta property="og:url" content={`${SITE}/events`} />
        <meta property="og:image" content={`${SITE}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Bengaluru Tech Events <span className="text-primary-600">by Month</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl">
          Pick a month to see every conference, hackathon, and meetup happening in Bengaluru.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mt-12">
          {Object.entries(MONTHS).map(([slug, m]) => {
            const list = eventsForMonth(m.monthNum, m.year);
            return (
              <Link
                key={slug}
                to={`/events/${slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-primary-400 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium text-primary-600">{m.year}</div>
                    <h2 className="text-2xl font-bold text-slate-900 mt-1 group-hover:text-primary-700">
                      {m.short}
                    </h2>
                  </div>
                  <span className="inline-flex items-center justify-center min-w-[3rem] h-10 px-3 rounded-full bg-primary-50 text-primary-700 font-semibold">
                    {list.length}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{m.blurb}</p>
                <div className="mt-4 text-sm font-medium text-primary-600 group-hover:underline">
                  See all {list.length} {m.short} events →
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function MonthEventsPage({ month: propMonth }) {
  const params = useParams();
  const month = propMonth || params.month;
  const meta = MONTHS[month];

  const monthEvents = useMemo(() => meta ? eventsForMonth(meta.monthNum, meta.year) : [], [meta]);

  const byCategory = useMemo(() => {
    const groups = {};
    for (const e of monthEvents) {
      (groups[e.category] = groups[e.category] || []).push(e);
    }
    return groups;
  }, [monthEvents]);

  if (!meta) return <Navigate to="/events" replace />;

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Bengaluru Tech Events — ${meta.label}`,
    description: meta.blurb,
    numberOfItems: monthEvents.length,
    itemListElement: monthEvents.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE}/events/${toSlug(e.name)}`,
      name: e.name,
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{`Bengaluru Tech Events — ${meta.label} | ${monthEvents.length} Events`}</title>
        <meta
          name="description"
          content={`Complete list of ${monthEvents.length} tech events in Bengaluru, ${meta.label}. ${meta.blurb}`}
        />
        <link rel="canonical" href={`${SITE}/events/${month}`} />
        <meta property="og:title" content={`Bengaluru Tech Events — ${meta.label}`} />
        <meta property="og:description" content={`${monthEvents.length} tech events in Bengaluru, ${meta.label}.`} />
        <meta property="og:url" content={`${SITE}/events/${month}`} />
        <meta property="og:image" content={`${SITE}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(itemListJsonLd)}</script>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link to="/events" className="hover:text-slate-900">Events by month</Link>
          <span>/</span>
          <span className="text-slate-900">{meta.label}</span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-primary-600">{meta.year}</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mt-1">
              {meta.short} Tech Events in <span className="text-primary-600">Bengaluru</span>
            </h1>
            <p className="mt-3 text-lg text-slate-600 max-w-3xl">{meta.blurb}</p>
          </div>
          <div className="rounded-xl bg-primary-50 px-5 py-3 text-primary-700">
            <div className="text-3xl font-bold">{monthEvents.length}</div>
            <div className="text-xs uppercase tracking-wide font-medium">events</div>
          </div>
        </div>

        {/* Other-month link */}
        <div className="mt-6 flex flex-wrap gap-2">
          {Object.entries(MONTHS)
            .filter(([slug]) => slug !== month)
            .map(([slug, m]) => (
              <Link
                key={slug}
                to={`/events/${slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-1.5 text-sm hover:border-primary-400 hover:text-primary-700"
              >
                <Calendar className="w-3.5 h-3.5" />
                See {m.label} events
              </Link>
            ))}
        </div>

        {/* Category jump-list */}
        {Object.keys(byCategory).length > 1 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {Object.entries(byCategory).map(([cat, list]) => (
              <a
                key={cat}
                href={`#cat-${cat}`}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${CATEGORIES[cat]?.color || 'bg-slate-100 text-slate-700'}`}
              >
                <span className={`w-2 h-2 rounded-full ${CATEGORIES[cat]?.dot || 'bg-slate-500'}`} />
                {CATEGORIES[cat]?.label || cat} ({list.length})
              </a>
            ))}
          </div>
        )}

        {/* Sections by category */}
        {Object.entries(byCategory).map(([cat, list]) => (
          <section key={cat} id={`cat-${cat}`} className="mt-12 scroll-mt-24">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${CATEGORIES[cat]?.dot || 'bg-slate-500'}`} />
              {CATEGORIES[cat]?.label || cat}
              <span className="text-sm text-slate-500 font-normal">({list.length})</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {list.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          </section>
        ))}

        {monthEvents.length === 0 && (
          <div className="mt-16 text-center text-slate-500">
            <MapPin className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            No events listed for {meta.label} yet.
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

