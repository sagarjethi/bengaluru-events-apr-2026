// Homepage calendar — ONE continuous horizontal row showing every day
// across April + May 2026. Subtle styling, scrollable, with month-jump
// anchors and a pivot to the full /events/<month-2026> grid.

import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, CalendarRange } from 'lucide-react';
import { events as ALL_EVENTS, CATEGORIES } from '../data/events';

const MONTHS = [
  { key: 'apr', slug: 'april-2026', year: 2026, monthNum: 4, short: 'April' },
  { key: 'may', slug: 'may-2026', year: 2026, monthNum: 5, short: 'May' },
];

function pad(n) { return n < 10 ? `0${n}` : `${n}`; }
function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Build a flat list of every day across both months, with a `firstOfMonth`
// flag we use to insert in-strip month dividers.
function buildAllDays() {
  const out = [];
  for (const m of MONTHS) {
    const daysInMonth = new Date(Date.UTC(m.year, m.monthNum, 0)).getUTCDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${m.year}-${pad(m.monthNum)}-${pad(d)}`;
      const date = new Date(Date.UTC(m.year, m.monthNum - 1, d));
      out.push({
        iso,
        day: d,
        month: m.short,
        monthKey: m.key,
        slug: m.slug,
        firstOfMonth: d === 1,
        dow: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }).toUpperCase(),
      });
    }
  }
  return out;
}

function eventsForDate(date) {
  return ALL_EVENTS.filter((e) => e.startDate <= date && e.endDate >= date);
}

export default function HomeCalendar({ selectedDate, onDateSelect }) {
  const today = todayIso();
  const scrollerRef = useRef(null);

  const days = useMemo(buildAllDays, []);
  const monthCounts = useMemo(() => {
    const out = {};
    for (const m of MONTHS) {
      out[m.key] = ALL_EVENTS.filter((e) =>
        (e.startDate || '').startsWith(`${m.year}-${pad(m.monthNum)}`)
      ).length;
    }
    return out;
  }, []);

  // Auto-center to selectedDate / today / first-event-day
  useEffect(() => {
    const target = (() => {
      if (selectedDate) return selectedDate;
      if (days.some((d) => d.iso === today)) return today;
      return days.find((d) => eventsForDate(d.iso).length > 0)?.iso;
    })();
    if (!target) return;
    const el = scrollerRef.current?.querySelector(`[data-iso="${target}"]`);
    if (el && scrollerRef.current) {
      const offset = el.offsetLeft - scrollerRef.current.clientWidth / 2 + el.clientWidth / 2;
      scrollerRef.current.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
    }
  }, [selectedDate, today, days]);

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
    s.scrollBy({ left: dir * (s.clientWidth * 0.85), behavior: 'smooth' });
  };

  const jumpToMonth = (monthKey) => {
    const first = days.find((d) => d.monthKey === monthKey);
    if (!first) return;
    const el = scrollerRef.current?.querySelector(`[data-iso="${first.iso}"]`);
    if (el && scrollerRef.current) {
      scrollerRef.current.scrollTo({ left: el.offsetLeft - 16, behavior: 'smooth' });
    }
  };

  return (
    <section id="calendar" aria-label="Event calendar — April and May 2026" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header — single row, compact */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="inline-flex items-center gap-2 text-sm text-slate-500">
          <CalendarRange className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-700">Event calendar</span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-500">Apr–May 2026</span>
        </div>

        {/* Jump-to-month anchors (NOT tabs — strip stays continuous) */}
        <div className="hidden sm:inline-flex items-center gap-1.5">
          {MONTHS.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => jumpToMonth(m.key)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 transition"
            >
              {m.short}
              <span className="inline-flex items-center justify-center min-w-[1.25rem] h-4 px-1 rounded-full bg-slate-100 text-[10px] font-bold tabular-nums text-slate-600">
                {monthCounts[m.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Continuous strip with side arrows */}
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

        <div aria-hidden="true" className="hidden sm:block absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-[5] pointer-events-none" />
        <div aria-hidden="true" className="hidden sm:block absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-[5] pointer-events-none" />

        <div
          ref={scrollerRef}
          className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 sm:-mx-1 px-4 sm:px-1"
        >
          <div className="flex gap-1.5 snap-x pb-2">
            {days.map((d) => {
              const list = eventsForDate(d.iso);
              const has = list.length > 0;
              const isSelected = selectedDate === d.iso;
              const isToday = d.iso === today;
              const cats = [...new Set(list.map((e) => e.category))].slice(0, 3);

              return (
                <div key={d.iso} className="flex items-stretch gap-1.5">
                  {/* In-strip month divider — appears before May 1 */}
                  {d.firstOfMonth && d.monthKey === 'may' && (
                    <div className="self-stretch flex flex-col items-center justify-center px-2">
                      <div className="w-px flex-1 bg-slate-200" />
                      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 my-1.5 whitespace-nowrap">May</div>
                      <div className="w-px flex-1 bg-slate-200" />
                    </div>
                  )}

                  <button
                    data-iso={d.iso}
                    onClick={() => has && onSelect(d.iso)}
                    disabled={!has}
                    aria-pressed={isSelected}
                    aria-label={`${d.dow} ${d.month} ${d.day} — ${list.length} event${list.length !== 1 ? 's' : ''}`}
                    className={[
                      'snap-start shrink-0 w-[60px] sm:w-[68px] py-3 px-1.5 rounded-xl text-center transition border',
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
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer — legend + pivot */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-500">
          {Object.entries(CATEGORIES)
            .filter(([key]) => ALL_EVENTS.some((e) => e.category === key))
            .map(([key, cat]) => (
              <span key={key} className="inline-flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                {cat.label}
              </span>
            ))}
        </div>
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 group"
        >
          Open full calendar
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
