import { useState, useMemo } from 'react';
import { Search, X, Calendar, CalendarClock, Clock, History } from 'lucide-react';
import { events, CATEGORIES } from '../data';
import EventCard from './EventCard';

function pad(n) { return n < 10 ? `0${n}` : `${n}`; }
function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function plusDaysIso(iso, days) {
  const [y, m, d] = iso.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}
function humanDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

const TIME_FILTERS = [
  { id: 'all',       label: 'All',         icon: Calendar },
  { id: 'upcoming',  label: 'Upcoming',    icon: CalendarClock },
  { id: 'this-week', label: 'This week',   icon: Clock },
  { id: 'past',      label: 'Past',        icon: History },
];

export default function EventsGrid({ selectedDate, onClearDate }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [timeFilter, setTimeFilter] = useState('upcoming');

  const filteredEvents = useMemo(() => {
    let filtered = events;
    const today = todayIso();
    const weekEnd = plusDaysIso(today, 7);
    if (timeFilter === 'upcoming') {
      filtered = filtered.filter((e) => e.endDate >= today);
    } else if (timeFilter === 'past') {
      filtered = filtered.filter((e) => e.endDate < today);
    } else if (timeFilter === 'this-week') {
      filtered = filtered.filter((e) => e.startDate <= weekEnd && e.endDate >= today);
    }

    if (selectedDate) {
      filtered = filtered.filter((e) => e.startDate <= selectedDate && e.endDate >= selectedDate);
    }
    if (activeCategory) {
      filtered = filtered.filter((e) => e.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)) ||
          e.venue.toLowerCase().includes(q)
      );
    }

    return [...filtered].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.startDate.localeCompare(b.startDate);
    });
  }, [selectedDate, activeCategory, search, timeFilter]);

  const clearAll = () => {
    setSearch('');
    setActiveCategory(null);
    setTimeFilter('all');
    if (onClearDate) onClearDate();
  };

  const hasActiveFilters = !!search || !!activeCategory || !!selectedDate || timeFilter !== 'all';

  // Categories that actually have events — hide empty pills
  const visibleCategories = useMemo(() => {
    const present = new Set(events.map((e) => e.category));
    return Object.entries(CATEGORIES).filter(([key]) => present.has(key));
  }, []);

  return (
    <section id="events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Heading + count */}
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">All events</h2>
          <p className="mt-1 text-sm text-slate-500">
            <span className="font-semibold text-slate-700 tabular-nums">{filteredEvents.length}</span>
            {hasActiveFilters ? <> matching · </> : <> total · </>}
            <span className="text-slate-400">refreshed weekly</span>
          </p>
        </div>

        {/* Search — right-aligned on desktop, full-width on mobile */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search events, topics, venues…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search events"
            className="w-full pl-9 pr-9 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Active filters</span>
          {selectedDate && (
            <Chip onClear={onClearDate} tone="primary">
              {humanDate(selectedDate)}
            </Chip>
          )}
          {activeCategory && (
            <Chip onClear={() => setActiveCategory(null)} tone="default">
              <span className={`w-1.5 h-1.5 rounded-full ${CATEGORIES[activeCategory]?.dot || 'bg-slate-400'}`} />
              {CATEGORIES[activeCategory]?.label || activeCategory}
            </Chip>
          )}
          {search && (
            <Chip onClear={() => setSearch('')} tone="default">
              "{search}"
            </Chip>
          )}
          <button
            type="button"
            onClick={clearAll}
            className="ml-1 text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Time-filter chips — Upcoming default for the live site */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">When</span>
        {TIME_FILTERS.map((f) => {
          const Icon = f.icon;
          const on = timeFilter === f.id;
          const today = todayIso();
          const weekEnd = plusDaysIso(today, 7);
          const count = f.id === 'all'
            ? events.length
            : f.id === 'upcoming'
              ? events.filter((e) => e.endDate >= today).length
              : f.id === 'past'
                ? events.filter((e) => e.endDate < today).length
                : events.filter((e) => e.startDate <= weekEnd && e.endDate >= today).length;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setTimeFilter(f.id)}
              aria-pressed={on}
              className={[
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition border',
                on ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
              ].join(' ')}
            >
              <Icon className="w-3.5 h-3.5" />
              {f.label}
              <span className={`inline-flex items-center justify-center min-w-[1.25rem] h-4 px-1 rounded-full text-[10px] font-bold tabular-nums ${on ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category pills — single horizontal row, scroll on small screens */}
      <div
        role="tablist"
        aria-label="Filter by category"
        className="mb-8 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0 pb-1"
      >
        <button
          role="tab"
          aria-selected={!activeCategory}
          onClick={() => setActiveCategory(null)}
          className={[
            'shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition border',
            !activeCategory
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
          ].join(' ')}
        >
          All
          <span className={`inline-flex items-center justify-center min-w-[1.25rem] h-4 px-1 rounded-full text-[10px] font-bold tabular-nums ${!activeCategory ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {events.length}
          </span>
        </button>
        {visibleCategories.map(([key, cat]) => {
          const count = events.filter((e) => e.category === key).length;
          const on = activeCategory === key;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={on}
              onClick={() => setActiveCategory(on ? null : key)}
              className={[
                'shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition border',
                on
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
              ].join(' ')}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
              {cat.label}
              <span className={`inline-flex items-center justify-center min-w-[1.25rem] h-4 px-1 rounded-full text-[10px] font-bold tabular-nums ${on ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 p-10 text-center">
          <p className="text-slate-700 font-medium">No events match these filters.</p>
          <p className="text-sm text-slate-500 mt-1">Try clearing one of the chips above.</p>
          <button onClick={clearAll} className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2">
            <X className="w-3.5 h-3.5" /> Clear all filters
          </button>
        </div>
      )}
    </section>
  );
}

// ----------------------------------------------------------------------------

function Chip({ children, onClear, tone = 'default' }) {
  const styles =
    tone === 'primary'
      ? 'bg-primary-50 text-primary-700 ring-primary-100 hover:bg-primary-100'
      : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ring-1 px-3 py-1 text-sm font-medium ${styles}`}>
      {children}
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Remove filter"
          className="-mr-1 ml-0.5 p-0.5 rounded-full hover:bg-black/5"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
