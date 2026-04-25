import { useMemo } from 'react';
import { events as ALL_EVENTS, CATEGORIES } from '../data/events';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function pad(n) { return n < 10 ? `0${n}` : `${n}`; }

function buildMonthGrid(year, monthNum) {
  // monthNum is 1-12. JS Date is 0-11.
  const first = new Date(Date.UTC(year, monthNum - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, monthNum, 0)).getUTCDate();
  const startWeekday = first.getUTCDay(); // 0=Sun

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: `${year}-${pad(monthNum)}-${pad(d)}`, day: d });
  }
  // Pad to multiple of 7
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function eventsForDate(date) {
  return ALL_EVENTS.filter((e) => e.startDate <= date && e.endDate >= date);
}

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function MonthCalendar({ year, monthNum, selectedDate, onDateSelect, monthLabel }) {
  const cells = useMemo(() => buildMonthGrid(year, monthNum), [year, monthNum]);
  const today = todayIso();

  const totals = useMemo(() => {
    let count = 0;
    for (const c of cells) if (c) count += eventsForDate(c.date).length;
    return count;
  }, [cells]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-primary-50 to-white border-b border-slate-100">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary-600">{year}</div>
          <div className="text-xl font-bold text-slate-900 leading-tight">{monthLabel}</div>
        </div>
        <div className="text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{totals}</span> event{totals !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid grid-cols-7 text-[11px] font-medium text-slate-400 uppercase tracking-wide bg-slate-50 border-b border-slate-100">
        {WEEKDAYS.map((w) => (
          <div key={w} className="px-2 py-2 text-center">{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((c, i) => {
          if (!c) return <div key={`empty-${i}`} className="aspect-square sm:aspect-[4/3] bg-slate-50/50 border-r border-b border-slate-100 last:border-r-0" />;
          const dayEvents = eventsForDate(c.date);
          const has = dayEvents.length > 0;
          const isSelected = selectedDate === c.date;
          const isToday = c.date === today;
          const isWeekendCol = (i % 7 === 0) || (i % 7 === 6);
          return (
            <button
              key={c.date}
              onClick={() => onDateSelect && onDateSelect(isSelected ? null : c.date)}
              disabled={!has && !onDateSelect}
              aria-label={`${c.date} — ${dayEvents.length} event${dayEvents.length !== 1 ? 's' : ''}`}
              aria-pressed={isSelected}
              className={[
                'group relative aspect-square sm:aspect-[4/3] border-r border-b border-slate-100 last:border-r-0',
                'flex flex-col items-start justify-start p-1.5 sm:p-2 text-left transition-all',
                has ? 'cursor-pointer hover:bg-primary-50/60' : 'cursor-default',
                isSelected ? 'bg-primary-100 ring-2 ring-inset ring-primary-400 z-10' : '',
                isToday && !isSelected ? 'bg-amber-50' : '',
                isWeekendCol && !isSelected && !isToday ? 'bg-slate-50/40' : '',
              ].join(' ')}
            >
              <div className="flex items-center justify-between w-full">
                <span className={[
                  'text-sm sm:text-base font-semibold',
                  isSelected ? 'text-primary-700' : (has ? 'text-slate-900' : 'text-slate-400'),
                ].join(' ')}>
                  {c.day}
                </span>
                {isToday && <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600">Today</span>}
              </div>

              {has && (
                <>
                  <div className="mt-auto flex flex-wrap gap-0.5">
                    {dayEvents.slice(0, 4).map((ev, j) => (
                      <span
                        key={j}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${CATEGORIES[ev.category]?.dot || 'bg-slate-400'}`}
                        title={ev.name}
                      />
                    ))}
                    {dayEvents.length > 4 && (
                      <span className="text-[9px] text-slate-400 font-medium leading-none ml-0.5">+{dayEvents.length - 4}</span>
                    )}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">
                    {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
