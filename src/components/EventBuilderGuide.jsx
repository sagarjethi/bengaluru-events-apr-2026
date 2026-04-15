import { Link } from 'react-router-dom';
import { Sparkles, Rocket, ShieldCheck, Trophy, BookOpen, ArrowRight } from 'lucide-react';
import { bundleFor, THEMES } from '../data/resources';
import ToolCard from './resources/ToolCard';
import SkillCard from './resources/SkillCard';
import GuideCard from './resources/GuideCard';
import WinnerCard from './resources/WinnerCard';

export default function EventBuilderGuide({ event }) {
  if (!event?.themes?.length) return null;

  const bundle = bundleFor(event, {
    toolsLimit: 8,
    ideasLimit: 0,
    skillsLimit: 6,
    guidesLimit: 4,
    winnersLimit: 3,
  });

  const hasAny =
    bundle.tools.length +
      bundle.skills.length +
      bundle.guides.length +
      bundle.winners.length >
    0;

  if (!hasAny) return null;

  return (
    <section
      aria-labelledby="event-builder-guide"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <div className="bg-gradient-to-br from-violet-50 to-primary-50/30 rounded-2xl border border-slate-200 p-5 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-bold mb-2">
              <Sparkles className="w-3 h-3" /> Builder Guide
            </div>
            <h2 id="event-builder-guide" className="text-2xl md:text-3xl font-bold text-slate-900">
              Recommended for this hackathon
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Auto-tailored based on themes: {' '}
              {event.themes.map((t, i) => (
                <span key={t}>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${THEMES[t]?.color || 'bg-slate-100 text-slate-700'}`}>
                    {THEMES[t]?.label || t}
                  </span>
                  {i < event.themes.length - 1 && ' '}
                </span>
              ))}
            </p>
          </div>
          <Link
            to="/hackathons/resources"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-primary-300 hover:text-primary-700 transition-colors shrink-0"
          >
            Full hub <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {bundle.tools.length > 0 && (
          <Group icon={Rocket} title="Recommended stack" subtitle="Free-tier tools that match this hackathon's themes.">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {bundle.tools.map((t) => <ToolCard key={t.id} tool={t} />)}
            </div>
          </Group>
        )}

        {bundle.skills.length > 0 && (
          <Group icon={ShieldCheck} title="Essential skills for this hackathon" subtitle="Ship-fast + security essentials. Read in 5 minutes.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bundle.skills.map((s) => <SkillCard key={s.id} skill={s} />)}
            </div>
          </Group>
        )}

        {bundle.winners.length > 0 && (
          <Group icon={Trophy} title="Past winners in this theme" subtitle="Inspiration, not copying.">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bundle.winners.map((w) => <WinnerCard key={w.id} winner={w} />)}
            </div>
          </Group>
        )}

        {bundle.guides.length > 0 && (
          <Group icon={BookOpen} title="Must-read before kickoff" subtitle="Official docs + sharpest tutorials.">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {bundle.guides.map((g) => <GuideCard key={g.id} guide={g} />)}
            </div>
          </Group>
        )}

        <div className="mt-8 text-center md:hidden">
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

function Group(props) {
  const Icon = props.icon;
  return (
    <section className="mb-8 last:mb-0">
      <header className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5 text-primary-600" />
        <div>
          <h3 className="font-bold text-slate-900">{props.title}</h3>
          <p className="text-xs text-slate-500">{props.subtitle}</p>
        </div>
      </header>
      {props.children}
    </section>
  );
}
