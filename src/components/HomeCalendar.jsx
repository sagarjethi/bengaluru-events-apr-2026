// Homepage calendar — single-month MonthCalendar with a tiny month switcher.
// Compact header, cool grid, "Open full calendar" pivot to /events.
// Same visual language as /events/<month-2026> so users feel consistency.

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarRange } from 'lucide-react';
import { events, CATEGORIES } from '../data/events';
import MonthCalendar from './MonthCalendar';

const MONTHS = [
  { key: 'apr', slug: 'april-2026', year: 2026, monthNum: 4, short: 'April', long: 'April 2026' },
  { key: 'may', slug: 'may-2026', year: 2026, monthNum: 5, short: 'May', long: 'May 2026' },
];

function defaultMonthKey(selectedDate) {
  if (selectedDate?.startsWith('2026-05')) return 'may';
  if (selectedDate?.startsWith('2026-04')) return 'apr';
  // Use the month with the most upcoming events (if today is past April).
  const today = new Date();
  const m = today.getMonth() + 1;
  if (today.getFullYear() === 2026 && m === 5) return 'may';
  return 'apr';
}

export default function HomeCalendar({ selectedDate, onDateSelect }) {
  const [activeKey, setActiveKey] = useState(() => defaultMonthKey(selectedDate));
  const active = MONTHS.find((m) => m.key === activeKey) || MONTHS[0];

  const counts = useMemo(() => {
    const byKey = {};
    for (const m of MONTHS) {
      byKey[m.key] = events.filter((e) => {
        const sd = e.startDate || '';
        const [y, mm] = sd.split('-').map(Number);
        return y === m.year && mm === m.monthNum;
      }).length;
    }
    return byKey;
  }, []);

  const onSelect = (date) => {
    onDateSelect(date);
    if (date) {
      // Smooth-scroll to events grid below
      requestAnimationFrame(() => {
        const el = document.querySelector('#events');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  return (
    <section id="calendar" aria-label="Event calendar" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header row — compact, no big H2. Visual weight is on the calendar itself. */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="inline-flex items-center gap-2 text-sm text-slate-500">
          <CalendarRange className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-700">Event calendar</span>
        </div>

        {/* Month tabs */}
        <div role="tablist" aria-label="Pick month" className="inline-flex p-0.5 rounded-full bg-slate-100 border border-slate-200">
          {MONTHS.map((m) => {
            const active = m.key === activeKey;
            return (
              <button
                key={m.key}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setActiveKey(m.key);
                  // Clear stale cross-month selection
                  if (selectedDate && !selectedDate.startsWith(`${m.year}-${String(m.monthNum).padStart(2, '0')}`)) {
                    onDateSelect(null);
                  }
                }}
                className={[
                  'inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition',
                  active ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800',
                ].join(' ')}
              >
                {m.short}
                <span className={[
                  'inline-flex items-center justify-center min-w-[1.25rem] h-4 px-1 rounded-full text-[10px] font-bold tabular-nums',
                  active ? 'bg-primary-100 text-primary-700' : 'bg-slate-200/70 text-slate-600',
                ].join(' ')}>
                  {counts[m.key]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <MonthCalendar
        year={active.year}
        monthNum={active.monthNum}
        monthLabel={active.long}
        selectedDate={selectedDate}
        onDateSelect={onSelect}
      />

      {/* Legend + pivot to deep calendar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-500">
          {Object.entries(CATEGORIES)
            .filter(([key]) => events.some((e) => {
              if (e.category !== key) return false;
              const sd = e.startDate || '';
              return sd.startsWith(`${active.year}-${String(active.monthNum).padStart(2, '0')}`);
            }))
            .map(([key, cat]) => (
              <span key={key} className="inline-flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${cat.dot}`} />
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
