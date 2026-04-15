import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Rocket, Search, ChevronRight, ArrowRight, ExternalLink as LinkIcon,
  Building2, Mail, ShieldCheck,
} from 'lucide-react';
import ExternalLink from './ExternalLink';
import {
  accelerators,
  ACCELERATOR_SECTORS,
  ACCELERATOR_STAGES,
  ACCELERATOR_EQUITY,
} from '../data/accelerators';

const PAGE_URL = 'https://bengaluru-events.sagarjethi.com/accelerators';

export default function AcceleratorsPage() {
  const [activeSectors, setActiveSectors] = useState([]);
  const [activeStage, setActiveStage] = useState(null);
  const [equityFilter, setEquityFilter] = useState(null); // null | 'non-dilutive' | 'equity-required' | 'mixed'
  const [search, setSearch] = useState('');

  const toggleSector = (s) =>
    setActiveSectors((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const sectorCounts = useMemo(() => {
    const counts = {};
    for (const key of Object.keys(ACCELERATOR_SECTORS)) counts[key] = 0;
    for (const a of accelerators) for (const s of a.sectorFocus || []) if (counts[s] !== undefined) counts[s]++;
    return counts;
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return accelerators.filter((a) => {
      if (activeSectors.length > 0 && !activeSectors.some((s) => (a.sectorFocus || []).includes(s))) return false;
      if (activeStage && a.stage !== activeStage && a.stage !== 'all') return false;
      if (equityFilter && a.equity !== equityFilter) return false;
      if (q) {
        const hay = [a.name, a.vendor, a.programName, a.tagline, ...(a.sectorFocus || [])]
          .filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [activeSectors, activeStage, equityFilter, search]);

  const title = `${accelerators.length}+ Bangalore Accelerators & Programs for Founders`;
  const description = `Curated directory of ${accelerators.length} Bangalore and India accelerators for founders — Axilor, NSRCEL, Sequoia Surge, Accel Atoms, Techstars, Rainmatter, Flipkart Leap, Google for Startups, Microsoft for Startups, and more. Verified program links, sector focus, equity terms.`;

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Bangalore accelerators',
    numberOfItems: accelerators.length,
    itemListElement: accelerators.map((a, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Organization',
        name: a.name,
        url: a.url,
        description: a.tagline,
      },
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Bengaluru Events', item: 'https://bengaluru-events.sagarjethi.com/' },
      { '@type': 'ListItem', position: 2, name: 'Accelerators',     item: PAGE_URL },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="bangalore accelerators, india startup accelerators, YC alternative india, sequoia surge, accel atoms, techstars bangalore, flipkart leap, google for startups india, microsoft for startups, rainmatter, axilor ventures, NSRCEL" />
        <link rel="canonical" href={PAGE_URL} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:image" content="https://bengaluru-events.sagarjethi.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">{JSON.stringify(itemListLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="bg-white border-b border-slate-200">
          <ol className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-1.5 text-sm text-slate-500">
            <li><Link to="/" className="hover:text-primary-600 transition-colors">Home</Link></li>
            <li aria-hidden="true"><ChevronRight className="w-4 h-4" /></li>
            <li aria-current="page" className="font-medium text-slate-800">Accelerators</li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="bg-gradient-to-br from-indigo-600 via-primary-600 to-violet-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-xs font-semibold mb-4 border border-white/10">
              <Rocket className="w-3.5 h-3.5" />
              Bangalore · 2026
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-4xl">
              Don't bet on one door. <span className="text-amber-300">Apply to all {accelerators.length}.</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl">
              Every major accelerator with a Bangalore presence — sector focus, stage, equity terms, and direct apply links. Verified.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#all-accelerators"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-primary-700 hover:bg-amber-50 hover:text-primary-800 font-semibold text-sm transition-colors shadow-lg shadow-primary-900/20"
              >
                Browse all accelerators
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/hackathons"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold text-sm border border-white/20 transition-colors"
              >
                ← Back to hackathons
              </Link>
            </div>
          </div>
        </header>

        {/* Sector navigator — scannable row like the hackathon calendar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Browse by sector</h2>
            <p className="mt-1 text-sm text-slate-500">Click a sector to filter</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 divide-x divide-y divide-slate-100">
              {Object.entries(ACCELERATOR_SECTORS).map(([key, meta]) => {
                const count = sectorCounts[key] || 0;
                const isSelected = activeSectors.includes(key);
                const clickable = count > 0;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => clickable && toggleSector(key)}
                    disabled={!clickable}
                    aria-pressed={isSelected}
                    aria-label={`${meta.label} — ${count} accelerator${count !== 1 ? 's' : ''}`}
                    className={`p-3 sm:p-4 text-center transition-all ${
                      clickable ? 'hover:bg-indigo-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                    } ${isSelected ? 'bg-indigo-100 ring-2 ring-inset ring-indigo-400' : ''}`}
                  >
                    <div className={`text-[11px] font-semibold uppercase tracking-wide ${isSelected ? 'text-indigo-700' : 'text-slate-500'}`}>
                      {meta.label}
                    </div>
                    <div className={`text-xl font-bold mt-1 ${isSelected ? 'text-indigo-700' : 'text-slate-800'}`}>
                      {count}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Filters + grid */}
        <section id="all-accelerators" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">All accelerators</h2>
              <p className="text-sm text-slate-500 mt-1">
                Showing {filtered.length} of {accelerators.length}
                {activeSectors.length > 0 ? ` in ${activeSectors.map((s) => ACCELERATOR_SECTORS[s]?.label).filter(Boolean).join(', ')}` : ''}
                {activeStage ? ` · ${ACCELERATOR_STAGES[activeStage]?.label}` : ''}
                {equityFilter ? ` · ${ACCELERATOR_EQUITY[equityFilter]?.label}` : ''}
              </p>
              {(activeSectors.length > 0 || activeStage || equityFilter) && (
                <button
                  type="button"
                  onClick={() => { setActiveSectors([]); setActiveStage(null); setEquityFilter(null); }}
                  className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 sm:w-56">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search accelerators…"
                  aria-label="Search accelerators"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <select
                value={activeStage || ''}
                onChange={(e) => setActiveStage(e.target.value || null)}
                className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Filter by stage"
              >
                <option value="">Any stage</option>
                {Object.entries(ACCELERATOR_STAGES).map(([key, meta]) => (
                  <option key={key} value={key}>{meta.label}</option>
                ))}
              </select>
              <select
                value={equityFilter || ''}
                onChange={(e) => setEquityFilter(e.target.value || null)}
                className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Filter by equity terms"
              >
                <option value="">Any terms</option>
                {Object.entries(ACCELERATOR_EQUITY).map(([key, meta]) => (
                  <option key={key} value={key}>{meta.label}</option>
                ))}
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
              <p className="text-slate-500">No accelerators match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((a) => (
                <AcceleratorCard key={a.id} accelerator={a} />
              ))}
            </div>
          )}
        </section>

        {/* Footer CTA */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 text-center">
          <Link to="/hackathons" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors">
            ← Browse Bengaluru hackathons
          </Link>
        </div>
      </div>
    </>
  );
}

function AcceleratorCard({ accelerator: a }) {
  return (
    <article className="bg-white rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-sm transition-all p-5 flex flex-col gap-3">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900 leading-tight">{a.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {a.programName && a.programName !== a.name ? `${a.programName} · ` : ''}
            {a.vendor || 'Independent'}
          </p>
        </div>
        {a.equity && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
              a.equity === 'non-dilutive'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : a.equity === 'equity-required'
                  ? 'bg-violet-50 text-violet-700 border-violet-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title={ACCELERATOR_EQUITY[a.equity]?.label}
          >
            {ACCELERATOR_EQUITY[a.equity]?.label}
          </span>
        )}
      </header>

      {a.tagline && (
        <p className="text-sm text-slate-600 leading-relaxed">{a.tagline}</p>
      )}

      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        {a.ticketSize && (
          <>
            <dt className="text-slate-400 font-medium uppercase tracking-wide text-[10px]">Ticket</dt>
            <dd className="text-slate-700 font-medium text-right">{a.ticketSize}</dd>
          </>
        )}
        {a.programLength && (
          <>
            <dt className="text-slate-400 font-medium uppercase tracking-wide text-[10px]">Duration</dt>
            <dd className="text-slate-700 font-medium text-right">{a.programLength}</dd>
          </>
        )}
        {a.stage && (
          <>
            <dt className="text-slate-400 font-medium uppercase tracking-wide text-[10px]">Stage</dt>
            <dd className="text-slate-700 font-medium text-right">{ACCELERATOR_STAGES[a.stage]?.label || a.stage}</dd>
          </>
        )}
      </dl>

      {a.sectorFocus?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {a.sectorFocus.map((s) => {
            const meta = ACCELERATOR_SECTORS[s];
            if (!meta) return null;
            return (
              <span key={s} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                {meta.label}
              </span>
            );
          })}
        </div>
      )}

      <footer className="flex items-center justify-between pt-2 mt-auto border-t border-slate-100 text-xs">
        <div className="flex items-center gap-3">
          <ExternalLink
            href={a.applyUrl || a.url}
            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold"
          >
            {a.applyUrl ? 'Apply' : 'Visit'}
            <LinkIcon className="w-3 h-3" />
          </ExternalLink>
          {a.publicEmail && (
            <ExternalLink
              href={`mailto:${a.publicEmail}`}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700"
              title={`Public contact: ${a.publicEmail}`}
            >
              <Mail className="w-3 h-3" /> Email
            </ExternalLink>
          )}
          {a.linkedin && (
            <ExternalLink
              href={a.linkedin}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700"
              aria-label="LinkedIn"
            >
              <Building2 className="w-3 h-3" />
            </ExternalLink>
          )}
        </div>
        {a.verifiedOn && (
          <span className="inline-flex items-center gap-1 text-[10px] text-slate-400" title={`Last verified ${a.verifiedOn}`}>
            <ShieldCheck className="w-3 h-3" /> {a.verifiedOn}
          </span>
        )}
      </footer>
    </article>
  );
}
