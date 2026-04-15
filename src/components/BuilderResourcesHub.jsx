import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Sparkles, Rocket, ShieldCheck, Trophy, BookOpen, ChevronRight } from 'lucide-react';
import {
  tools,
  skills,
  guides,
  winners,
  THEMES,
  FREE_TIERS,
  TOOL_CATEGORIES,
  SKILL_CATEGORIES,
} from '../data/resources';
import ToolCard from './resources/ToolCard';
import SkillCard from './resources/SkillCard';
import GuideCard from './resources/GuideCard';
import WinnerCard from './resources/WinnerCard';

const PAGE_URL = 'https://bengaluru-events.sagarjethi.com/hackathons/resources';

const ALL_TABS = [
  { id: 'tools',   label: 'Tools & Stacks', icon: Rocket,      count: tools.length },
  { id: 'skills',  label: 'Builder Skills', icon: ShieldCheck, count: skills.length },
  { id: 'guides',  label: 'Guides',         icon: BookOpen,    count: guides.length },
  { id: 'winners', label: 'Past Winners',   icon: Trophy,      count: winners.length },
];

const FREE_TIER_FILTER_SET = new Set(['free', 'oss', 'credits', 'student']);

const themeMatch = (activeThemes, itemThemes) =>
  activeThemes.length === 0 ||
  (itemThemes || []).some((t) => t === '*' || activeThemes.includes(t));

const searchMatch = (q, haystacks) => {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return haystacks.some((s) => (s || '').toLowerCase().includes(needle));
};

export default function BuilderResourcesHub() {
  const [tab, setTab] = useState('tools');
  const [activeThemes, setActiveThemes] = useState([]);
  const [search, setSearch] = useState('');
  const [showPaidTrial, setShowPaidTrial] = useState(false);

  const toggleTheme = (t) =>
    setActiveThemes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const filteredTools = useMemo(() => {
    return tools.filter((t) => {
      if (!showPaidTrial && !FREE_TIER_FILTER_SET.has(t.freeTier)) return false;
      if (!themeMatch(activeThemes, t.themes)) return false;
      return searchMatch(search, [t.name, t.vendor, t.blurb, ...(t.themes || [])]);
    });
  }, [activeThemes, search, showPaidTrial]);

  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      if (activeThemes.length > 0 && !(s.themes || []).includes('*') && !themeMatch(activeThemes, s.themes)) return false;
      return searchMatch(search, [s.title, s.oneLiner, s.whyItWins]);
    });
  }, [activeThemes, search]);

  const filteredGuides = useMemo(
    () =>
      guides.filter((g) => themeMatch(activeThemes, g.themes) && searchMatch(search, [g.title, g.author, g.blurb])),
    [activeThemes, search]
  );

  const filteredWinners = useMemo(
    () =>
      winners.filter((w) => themeMatch(activeThemes, w.themes) && searchMatch(search, [w.name, w.hackathon, w.builderNote])),
    [activeThemes, search]
  );

  const essentialTools = useMemo(() => {
    const essentials = tools.filter((t) => t.essential && FREE_TIER_FILTER_SET.has(t.freeTier));
    if (essentials.length >= 10) return essentials.slice(0, 10);
    const backfill = tools
      .filter((t) => !t.essential && FREE_TIER_FILTER_SET.has(t.freeTier))
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 10 - essentials.length);
    return [...essentials, ...backfill];
  }, []);

  const title = `Builder Resources for Bengaluru Hackathons — Tools, Skills, Guides`;
  const description = `${tools.length} free-tier tools, ${skills.length} builder skills, ${guides.length} guides and ${winners.length} past hackathon winners — curated for AI, ML, Web3, and vibe-coding hackathons in Bengaluru, April 2026.`;

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: PAGE_URL,
    inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', url: 'https://bengaluru-events.sagarjethi.com/' },
  };

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hackathon builder tools',
    numberOfItems: tools.length,
    itemListElement: tools.map((t, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: t.name,
        url: t.url,
        description: t.blurb,
        applicationCategory: 'DeveloperApplication',
      },
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Bengaluru Events', item: 'https://bengaluru-events.sagarjethi.com/' },
      { '@type': 'ListItem', position: 2, name: 'Hackathons',       item: 'https://bengaluru-events.sagarjethi.com/hackathons' },
      { '@type': 'ListItem', position: 3, name: 'Builder Resources', item: PAGE_URL },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="bengaluru hackathon resources, hackathon tools, hackathon project ideas, AI SDK hackathon, OpenAI python SDK, vercel AI SDK, shadcn UI, supabase hackathon, free hackathon tools" />
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
        <script type="application/ld+json">{JSON.stringify(collectionLd)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="bg-white border-b border-slate-200">
          <ol className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-1.5 text-sm text-slate-500">
            <li><Link to="/" className="hover:text-primary-600 transition-colors">Home</Link></li>
            <li aria-hidden="true"><ChevronRight className="w-4 h-4" /></li>
            <li><Link to="/hackathons" className="hover:text-primary-600 transition-colors">Hackathons</Link></li>
            <li aria-hidden="true"><ChevronRight className="w-4 h-4" /></li>
            <li aria-current="page" className="font-medium text-slate-800">Builder Resources</li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="bg-gradient-to-br from-violet-600 via-primary-600 to-primary-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-xs font-semibold mb-4 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" /> Builder Resources
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-4xl">
              What to build <span className="text-amber-300">this weekend</span>.
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl">
              {tools.length} free-tier tools, {skills.length} ship-fast skills, {guides.length} guides, and {winners.length} past winners — curated for Bengaluru hackathons.
            </p>
            <dl className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 max-w-4xl">
              {ALL_TABS.map((t) => {
                const TabIcon = t.icon;
                return (
                  <div key={t.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <dt className="flex items-center gap-1.5 text-xs font-medium text-white/70 uppercase tracking-wide">
                      <TabIcon className="w-3 h-3" /> {t.label}
                    </dt>
                    <dd className="text-2xl md:text-3xl font-bold text-white mt-1">{t.count}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </header>

        {/* Essential 10 tools */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Essential stack</h2>
              <p className="text-sm text-slate-500 mt-1">
                The 10 tools we reach for on hour zero. All with real free tiers.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {essentialTools.map((t) => (
              <a
                key={t.id}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group bg-white rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-sm transition-all p-3 text-center"
              >
                <div className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                  {t.name}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{t.vendor}</div>
                <div className="mt-2 inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                  {FREE_TIERS[t.freeTier]?.label}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Filters */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <div>
                <h2 className="font-bold text-slate-900">Explore</h2>
                <p className="text-xs text-slate-500">Filter by theme, search by keyword, choose a tab below.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search ideas, tools, skills…"
                    aria-label="Search resources"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <label className="inline-flex items-center gap-2 text-xs text-slate-600 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={showPaidTrial}
                    onChange={(e) => setShowPaidTrial(e.target.checked)}
                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  Include paid-with-trial
                </label>
              </div>
            </div>

            {/* Theme chips */}
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(THEMES).map(([id, meta]) => {
                const isActive = activeThemes.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleTheme(id)}
                    aria-pressed={isActive}
                    className={`inline-flex items-center rounded-full font-semibold transition-colors px-3 py-1 text-xs ${
                      isActive ? 'ring-2 ring-primary-400 ring-offset-1' : 'opacity-80 hover:opacity-100'
                    } ${meta.color}`}
                  >
                    {meta.label}
                  </button>
                );
              })}
              {activeThemes.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveThemes([])}
                  className="inline-flex items-center rounded-full font-medium px-3 py-1 text-xs bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div role="tablist" aria-label="Resource categories" className="flex flex-wrap gap-1 border-b border-slate-200">
            {ALL_TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                    active
                      ? 'border-primary-600 text-primary-700'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                  <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Tab content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-14">
          {tab === 'tools' && (
            <ToolsSection tools={filteredTools} />
          )}

          {tab === 'skills' && (
            filteredSkills.length === 0 ? (
              <EmptyState label="skills" />
            ) : (
              <SkillsByCategory skills={filteredSkills} />
            )
          )}

          {tab === 'guides' && (
            filteredGuides.length === 0 ? (
              <EmptyState label="guides" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGuides.map((g) => <GuideCard key={g.id} guide={g} />)}
              </div>
            )
          )}

          {tab === 'winners' && (
            filteredWinners.length === 0 ? (
              <EmptyState label="winners" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWinners.map((w) => <WinnerCard key={w.id} winner={w} />)}
              </div>
            )
          )}
        </section>

        {/* Footer CTA */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 text-center">
          <Link to="/hackathons" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors">
            ← Back to all hackathons
          </Link>
        </div>
      </div>
    </>
  );
}

function EmptyState({ label }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
      <p className="text-slate-500">No {label} match your filters. Try clearing themes or search.</p>
    </div>
  );
}

function ToolsSection({ tools: list }) {
  const grouped = useMemo(() => {
    const map = {};
    for (const t of list) {
      (map[t.category] ||= []).push(t);
    }
    return Object.entries(map).sort(
      (a, b) => Object.keys(TOOL_CATEGORIES).indexOf(a[0]) - Object.keys(TOOL_CATEGORIES).indexOf(b[0])
    );
  }, [list]);

  if (list.length === 0) return <EmptyState label="tools" />;

  return (
    <div className="space-y-8">
      {grouped.map(([cat, items]) => (
        <div key={cat}>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
            {TOOL_CATEGORIES[cat]?.label || cat}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items
              .slice()
              .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
              .map((t) => <ToolCard key={t.id} tool={t} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillsByCategory({ skills: list }) {
  const grouped = useMemo(() => {
    const map = {};
    for (const s of list) (map[s.category] ||= []).push(s);
    return Object.keys(SKILL_CATEGORIES)
      .filter((k) => map[k])
      .map((k) => [k, map[k]]);
  }, [list]);

  return (
    <div className="space-y-8">
      {grouped.map(([cat, items]) => (
        <div key={cat}>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
            {SKILL_CATEGORIES[cat]?.label}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((s) => <SkillCard key={s.id} skill={s} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
