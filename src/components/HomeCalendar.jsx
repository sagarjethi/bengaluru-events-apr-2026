// Homepage calendar — horizontal scrollable strip of every day in the active
// month (NOT a 6×7 grid; that's reserved for /events/<month-2026>).
// Clean, compact cards. Subtle category dots. Click → filter EventsGrid below.
//
// Design notes:
// - Single accent color (slate) for selection. No big color blocks.
// - All days of the month are scrollable horizontally; tab between months.
// - "Today" gets a soft amber tint, not a heavy ring.

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, CalendarRange } from 'lucide-react';
import { events as ALL_EVENTS, CATEGORIES } from '../data/events';

const MONTHS = [
  { key: 'apr', slug: 'april-2026', year: 2026, monthNum: 4, short: 'April', long: 'April 2026' },
  { key: 'may', slug: 'may-2026', year: 2026, monthNum: 5, short: 'May', long: 'May 2026' },
];

function pad(n) { return n < 10 ? `0${n}` : `${n}`; }
function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function buildDays(year, monthNum) {
  const daysInMonth = new Date(Date.UTC(year, monthNum, 0)).getUTCDate();
  const out = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${pad(monthNum)}-${pad(d)}`;
    const date = new Date(Date.UTC(year, monthNum - 1, d));
    out.push({
      iso,
      day: d,
      dow: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }).toUpperCase(),
    });
  }
  return out;
}
function eventsForDate(date) {
  return ALL_EVENTS.filter((e) => e.startDate <= date && e.endDate >= date);
}
function defaultMonthKey(selectedDate) {
  if (selectedDate?.startsWith('2026-05')) return 'may';
  if (selectedDate?.startsWith('2026-04')) return 'apr';
  const d = new Date();
  if (d.getFullYear() === 2026 && d.getMonth() + 1 === 5) return 'may';
  return 'apr';
}

export default function HomeCalendar({ selectedDate, onDateSelect }) {
  const [activeKey, setActiveKey] = useState(() => defaultMonthKey(selectedDate));
  const active = MONTHS.find((m) => m.key === activeKey) || MONTHS[0];
  const today = todayIso();
  const scrollerRef = useRef(null);

  const days = useMemo(() => buildDays(active.year, active.monthNum), [active]);
  const counts = useMemo(() => {
    const byKey = {};
    for (const m of MONTHS) {
      byKey[m.key] = ALL_EVENTS.filter((e) => {
        const sd = e.startDate || '';
        return sd.startsWith(`${m.year}-${pad(m.monthNum)}`);
      }).length;
    }
    return byKey;
  }, []);

  // Auto-scroll to the first day with events (or today, whichever is earlier and present)
  useEffect(() => {
    const target = (() => {
      if (selectedDate?.startsWith(`${active.year}-${pad(active.monthNum)}`)) return selectedDate;
      const todayInMonth = today.startsWith(`${active.year}-${pad(active.monthNum)}`) ? today : null;
      if (todayInMonth) return todayInMonth;
      // First day with events
      const firstWith = days.find((d) => eventsForDate(d.iso).length > 0);
      return firstWith?.iso;
    })();
    if (!target) return;
    const el = scrollerRef.current?.querySelector(`[data-iso="${target}"]`);
    if (el && scrollerRef.current) {
      const offset = el.offsetLeft - scrollerRef.current.clientWidth / 2 + el.clientWidth / 2;
      scrollerRef.current.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
    }
  }, [active.key, days, selectedDate, today, active.year, active.monthNum]);

  const onSelect = (iso) => {
    const next = selectedDate === iso ? null : iso;
    onDateSelect(next);
    if (next) {
      requestAnimationFrame(() => {
        const el = document.querySelector('#events');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  const scrollBy = (dir) => {
    const s = scrollerRef.current;
    if (!s) return;
    s.scrollBy({ left: dir * (s.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <section id="calendar" aria-label="Event calendar" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header — single row, compact */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="inline-flex items-center gap-2 text-sm text-slate-500">
          <CalendarRange className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-700">Event calendar</span>
        </div>

        <div role="tablist" aria-label="Pick month" className="inline-flex p-0.5 rounded-full bg-slate-100 border border-slate-200">
          {MONTHS.map((m) => {
            const on = m.key === activeKey;
            return (
              <button
                key={m.key}
                role="tab"
                aria-selected={on}
                onClick={() => {
                  setActiveKey(m.key);
                  if (selectedDate && !selectedDate.startsWith(`${m.year}-${pad(m.monthNum)}`)) {
                    onDateSelect(null);
                  }
                }}
                className={[
                  'inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition',
                  on ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800',
                ].join(' ')}
              >
                {m.short}
                <span className={[
                  'inline-flex items-center justify-center min-w-[1.25rem] h-4 px-1 rounded-full text-[10px] font-bold tabular-nums',
                  on ? 'bg-primary-100 text-primary-700' : 'bg-slate-200/70 text-slate-600',
                ].join(' ')}>
                  {counts[m.key]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Strip with side arrows */}
      <div className="relative">
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollBy(-1)}
          className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm items-center justify-center text-slate-600 hover:text-slate-900 hover:shadow-md transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollBy(1)}
          className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm items-center justify-center text-slate-600 hover:text-slate-900 hover:shadow-md transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Edge fades */}
        <div aria-hidden="true" className="hidden sm:block absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-[5] pointer-events-none" />
        <div aria-hidden="true" className="hidden sm:block absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-[5] pointer-events-none" />

        <div
          ref={scrollerRef}
          className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 sm:-mx-1 px-4 sm:px-1"
        >
          <div className="flex gap-1.5 snap-x snap-mandatory pb-2">
            {days.map((d) => {
              const list = eventsForDate(d.iso);
              const has = list.length > 0;
              const isSelected = selectedDate === d.iso;
              const isToday = d.iso === today;
              const cats = [...new Set(list.map((e) => e.category))].slice(0, 3);

              return (
                <button
                  key={d.iso}
                  data-iso={d.iso}
                  onClick={() => has && onSelect(d.iso)}
                  disabled={!has}
                  aria-pressed={isSelected}
                  aria-label={`${d.dow} ${d.day} — ${list.length} event${list.length !== 1 ? 's' : ''}`}
                  className={[
                    'snap-start shrink-0 w-[64px] sm:w-[72px] py-3 px-1.5 rounded-xl text-center transition border',
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : has
                        ? 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-900'
                        : 'bg-white border-slate-100 text-slate-300 cursor-default',
                    isToday && !isSelected ? 'ring-1 ring-amber-300 bg-amber-50/60' : '',
                  ].join(' ')}
                >
                  <div className={[
                    'text-[10px] font-bold uppercase tracking-[0.1em]',
                    isSelected ? 'text-white/70' : (isToday ? 'text-amber-700' : 'text-slate-400'),
                  ].join(' ')}>
                    {d.dow}
                  </div>
                  <div className={[
                    'mt-0.5 text-xl font-bold tabular-nums leading-none',
                    isSelected ? 'text-white' : (has ? 'text-slate-900' : 'text-slate-300'),
                  ].join(' ')}>
                    {d.day}
                  </div>
                  {/* Single subtle indicator: thin underline if events exist, dots only if multiple categories */}
                  <div className="mt-2 h-2 flex items-center justify-center gap-0.5">
                    {has ? (
                      cats.length > 1 ? (
                        cats.map((cat, i) => (
                          <span
                            key={i}
                            className={[
                              'w-1 h-1 rounded-full',
                              isSelected ? 'bg-white/70' : (CATEGORIES[cat]?.dot || 'bg-slate-400'),
                            ].join(' ')}
                          />
                        ))
                      ) : (
                        <span className={[
                          'w-3 h-0.5 rounded-full',
                          isSelected ? 'bg-white/70' : (CATEGORIES[cats[0]]?.dot || 'bg-slate-400'),
                        ].join(' ')} />
                      )
                    ) : null}
                  </div>
                  {has && (
                    <div className={[
                      'mt-1 text-[10px] font-semibold tabular-nums',
                      isSelected ? 'text-white/80' : 'text-slate-500',
                    ].join(' ')}>
                      {list.length}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer row — legend + pivot to deep calendar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-500">
          {Object.entries(CATEGORIES)
            .filter(([key]) =>
              ALL_EVENTS.some((e) =>
                e.category === key && (e.startDate || '').startsWith(`${active.year}-${pad(active.monthNum)}`)
              )
            )
            .map(([key, cat]) => (
              <span key={key} className="inline-flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                {cat.label}
              </span>
            ))}
        </div>
        <Link
          to={`/events/${active.slug}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 group"
        >
          Open {active.short} calendar
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
