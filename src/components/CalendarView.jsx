import { useState } from 'react';
import { calendarDays, events, CATEGORIES } from '../data/events';
import { ExternalLink, Heart, X } from 'lucide-react';

const TWEET_URL = 'https://x.com/sagarbjethi/status/2043607049679057396';
const FOLLOW_URL = 'https://x.com/intent/follow?screen_name=sagarbjethi';
const STORAGE_KEY = 'calendar-support-shown';

function XIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function CalendarView({ onDateSelect, selectedDate }) {
  const [showSupport, setShowSupport] = useState(false);
  const [pendingDate, setPendingDate] = useState(null);

  const getEventsForDate = (date) => {
    return events.filter(e => e.startDate <= date && e.endDate >= date);
  };

  const handleDateClick = (date, isSelected) => {
    const nextDate = isSelected ? null : date;

    // Show support popup once per session on first calendar click
    if (!isSelected && !sessionStorage.getItem(STORAGE_KEY)) {
      setPendingDate(nextDate);
      setShowSupport(true);
      sessionStorage.setItem(STORAGE_KEY, 'true');
      return;
    }

    onDateSelect(nextDate);
  };

  const handleDismiss = () => {
    setShowSupport(false);
    if (pendingDate !== null) {
      onDateSelect(pendingDate);
    }
    setPendingDate(null);
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
            const isToday = d.date === '2026-04-13';
            return (
              <button
                key={d.date}
                onClick={() => handleDateClick(d.date, isSelected)}
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

      {/* Support Popup */}
      {showSupport && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" onClick={handleDismiss}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-[fadeIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 bg-gradient-to-r from-amber-400 via-rose-500 to-violet-500" />

            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 pt-5 text-center">
              {/* Namaste */}
              <div className="text-5xl mb-3">🙏</div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Namaste! Enjoying this?
              </h3>
              <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                This directory is free and took hours to build. A quick like or follow helps more people discover these amazing events!
              </p>

              <div className="space-y-2">
                <a
                  href={TWEET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleDismiss}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                >
                  <Heart className="w-4 h-4 text-rose-400" />
                  Like the tweet
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
                <a
                  href={FOLLOW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleDismiss}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                >
                  <XIcon className="w-4 h-4" />
                  Follow @sagarbjethi
                </a>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
}
