import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight, Zap } from 'lucide-react';
import { events, CATEGORIES } from '../data/events';
import { toSlug } from '../utils/slug';

function formatLocalDate(date) {
  return date.toISOString().split('T')[0];
}

function getTimeUntil(startDate) {
  const now = new Date();
  const start = new Date(startDate + 'T09:00:00+05:30'); // assume 9 AM IST start if no time
  const diff = start - now;
  if (diff <= 0) return 'live now';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days >= 1) return `in ${days}d`;
  if (hours >= 1) return `in ${hours}h`;
  const mins = Math.floor(diff / (1000 * 60));
  return `in ${mins}m`;
}

export default function HappeningNow() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const today = formatLocalDate(now);
  const tomorrow = formatLocalDate(new Date(now.getTime() + 24 * 60 * 60 * 1000));

  const happening = events
    .filter((e) => e.startDate <= today && e.endDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  const upcoming = events
    .filter((e) => e.startDate === tomorrow)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  const combined = [...happening, ...upcoming];

  if (combined.length === 0) return null;

  return (
    <section aria-label="Events happening now and tomorrow" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-gradient-to-r from-primary-50 via-white to-accent-50 rounded-2xl border border-primary-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-amber-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                {happening.length > 0 ? 'Happening now' : 'Starting tomorrow'}
              </h2>
              <p className="text-xs text-slate-500">
                {happening.length > 0 && `${happening.length} live today`}
                {happening.length > 0 && upcoming.length > 0 && ' · '}
                {upcoming.length > 0 && `${upcoming.length} tomorrow`}
              </p>
            </div>
          </div>
          <a href="#calendar" className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700">
            View all
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide">
          {combined.map((event) => {
            const cat = CATEGORIES[event.category];
            const isLive = event.startDate <= today && event.endDate >= today;
            return (
              <Link
                key={event.id}
                to={`/events/${toSlug(event.name)}`}
                className="flex-shrink-0 w-64 sm:w-72 snap-start bg-white rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all p-4 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cat?.color || 'bg-slate-100 text-slate-600'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cat?.dot || 'bg-slate-400'}`} />
                    {cat?.label}
                  </span>
                  {isLive ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      LIVE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                      <Clock className="w-3 h-3" />
                      {getTimeUntil(event.startDate)}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-primary-700 transition-colors">
                  {event.name}
                </h3>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Calendar className="w-3 h-3" />
                  {event.date}
                  {event.time && event.time !== '2 days' && event.time !== '3 days' && (
                    <>
                      <span className="text-slate-300">·</span>
                      <span className="truncate">{event.time}</span>
                    </>
                  )}
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 group-hover:gap-2 transition-all">
                  View details
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
