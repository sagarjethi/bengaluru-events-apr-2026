import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Rocket, ShieldCheck, BookOpen, ArrowRight, Code } from 'lucide-react';
import {
  tools,
  skills,
  guides,
  THEMES,
} from '../data/resources';
import ToolCard from './resources/ToolCard';
import SkillCard from './resources/SkillCard';
import GuideCard from './resources/GuideCard';

const TABS = [
  { id: 'boilerplates', label: 'Boilerplates',   icon: Code },
  { id: 'tools',        label: 'Tools & Stacks', icon: Rocket },
  { id: 'skills',       label: 'Builder Skills', icon: ShieldCheck },
  { id: 'guides',       label: 'Guides',         icon: BookOpen },
];

const FREE_TIER_SET = new Set(['free', 'oss', 'credits', 'student']);

const themeMatch = (activeTheme, itemThemes) =>
  !activeTheme || (itemThemes || []).includes('*') || (itemThemes || []).includes(activeTheme);

export default function BuilderResourcesPreview() {
  const [tab, setTab] = useState('boilerplates');
  const [activeTheme, setActiveTheme] = useState(null);

  const previewBoilerplates = useMemo(() =>
    tools.filter((t) => t.category === 'boilerplate' && themeMatch(activeTheme, t.themes))
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0)), [activeTheme]);
  const previewTools = useMemo(() =>
    tools.filter((t) => t.category !== 'boilerplate' && FREE_TIER_SET.has(t.freeTier) && themeMatch(activeTheme, t.themes))
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 8), [activeTheme]);
  const previewSkills = useMemo(() =>
    skills.filter((s) => themeMatch(activeTheme, s.themes)).slice(0, 4), [activeTheme]);
  const previewGuides = useMemo(() =>
    guides.filter((g) => themeMatch(activeTheme, g.themes)).slice(0, 6), [activeTheme]);

  return (
    <section
      aria-labelledby="builder-resources-preview"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <div className="bg-gradient-to-br from-slate-50 to-violet-50/50 rounded-2xl border border-slate-200 p-5 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-bold mb-2">
              <Sparkles className="w-3 h-3" /> Builder Resources
            </div>
            <h2 id="builder-resources-preview" className="text-2xl md:text-3xl font-bold text-slate-900">
              What to build, how to ship, where to start
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {tools.length} free-tier tools · {skills.length} builder skills · {guides.length} guides. Curated for Bengaluru hackathons.
            </p>
          </div>
          <Link
            to="/hackathons/resources"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors shrink-0"
          >
            Full hub <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Tabs */}
        <div role="tablist" className="flex flex-wrap gap-1 border-b border-slate-200 mb-5">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                  active ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Theme chips */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          <button
            type="button"
            onClick={() => setActiveTheme(null)}
            aria-pressed={activeTheme === null}
            className={`inline-flex items-center rounded-full font-semibold transition-colors px-2.5 py-0.5 text-[11px] ${
              activeTheme === null
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {Object.entries(THEMES).map(([id, meta]) => {
            const isActive = activeTheme === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTheme(isActive ? null : id)}
                aria-pressed={isActive}
                className={`inline-flex items-center rounded-full font-semibold transition-colors px-2.5 py-0.5 text-[11px] ${
                  isActive ? 'ring-2 ring-primary-400 ring-offset-1' : 'opacity-80 hover:opacity-100'
                } ${meta.color}`}
              >
                {meta.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {tab === 'boilerplates' && (
          previewBoilerplates.length === 0 ? (
            <EmptyHint label="boilerplates" />
          ) : (
            <>
              <p className="text-xs text-slate-500 mb-3">Fork these on hour zero. Every one deploys with a single click.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {previewBoilerplates.map((t) => <ToolCard key={t.id} tool={t} />)}
              </div>
            </>
          )
        )}

        {tab === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {previewTools.map((t) => <ToolCard key={t.id} tool={t} />)}
          </div>
        )}

        {tab === 'skills' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previewSkills.map((s) => <SkillCard key={s.id} skill={s} />)}
          </div>
        )}

        {tab === 'guides' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {previewGuides.map((g) => <GuideCard key={g.id} guide={g} />)}
          </div>
        )}

        {/* Mobile full-hub CTA */}
        <div className="mt-6 text-center md:hidden">
          <Link
            to="/hackathons/resources"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700"
          >
            Open full hub <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function EmptyHint({ label }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-500">
      No {label} match the selected theme. Clear the theme filter or try a different tab.
    </div>
  );
}
