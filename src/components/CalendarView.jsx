import { calendarDays, events, CATEGORIES } from '../data/events';

export default function CalendarView({ onDateSelect, selectedDate }) {
  const getEventsForDate = (date) => {
    return events.filter(e => e.startDate <= date && e.endDate >= date);
  };

  return (
    <section id="calendar" aria-label="Event calendar for April 15-26, 2026" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Event Calendar</h2>
        <p className="mt-2 text-slate-500">Click a date to filter events</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 divide-x divide-y divide-slate-100">
          {calendarDays.map((d) => {
            const dayEvents = getEventsForDate(d.date);
            const isSelected = selectedDate === d.date;
            const isToday = d.date === '2026-04-12';
            return (
              <button
                key={d.date}
                onClick={() => onDateSelect(isSelected ? null : d.date)}
                aria-label={`${d.day} ${d.label} — ${dayEvents.length} event${dayEvents.length !== 1 ? 's' : ''}`}
                aria-pressed={isSelected}
                className={`p-3 sm:p-4 text-center transition-all hover:bg-primary-50 cursor-pointer group ${isSelected ? 'bg-primary-100 ring-2 ring-inset ring-primary-400' : ''} ${isToday ? 'bg-amber-50' : ''}`}
              >
                <div className="text-xs font-medium text-slate-400 uppercase">{d.day}</div>
                <div className={`text-xl sm:text-2xl font-bold mt-1 ${isSelected ? 'text-primary-700' : 'text-slate-800'}`}>
                  {d.label.split(' ')[1]}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Apr</div>
                <div className="mt-2 flex flex-wrap justify-center gap-1">
                  {dayEvents.slice(0, 4).map((ev, i) => (
                    <span key={i} className={`w-2 h-2 rounded-full ${CATEGORIES[ev.category]?.dot || 'bg-slate-400'}`} />
                  ))}
                  {dayEvents.length > 4 && (
                    <span className="text-[10px] text-slate-400 font-medium">+{dayEvents.length - 4}</span>
                  )}
                </div>
                <div className={`text-xs mt-1 font-medium ${isSelected ? 'text-primary-600' : 'text-slate-500'}`}>
                  {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <span key={key} className="inline-flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${cat.dot}`} />
            {cat.label}
          </span>
        ))}
      </div>
    </section>
  );
}
