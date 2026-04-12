import { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { events, CATEGORIES } from '../data/events';
import EventCard from './EventCard';

export default function EventsGrid({ selectedDate }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (selectedDate) {
      filtered = filtered.filter(e => e.startDate <= selectedDate && e.endDate >= selectedDate);
    }

    if (activeCategory) {
      filtered = filtered.filter(e => e.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.tags.some(t => t.toLowerCase().includes(q)) ||
        e.venue.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [selectedDate, activeCategory, search]);

  const clearFilters = () => {
    setSearch('');
    setActiveCategory(null);
  };

  const hasFilters = search || activeCategory || selectedDate;

  return (
    <section id="events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">All Events</h2>
        <p className="mt-2 text-slate-500">{filteredEvents.length} events found</p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search events, topics, venues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!activeCategory ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            All
          </button>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(activeCategory === key ? null : key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === key ? 'bg-primary-600 text-white' : `${cat.color} hover:opacity-80`}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {hasFilters && (
          <div className="text-center">
            <button onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-slate-400 text-lg">No events found matching your filters.</p>
          <button onClick={clearFilters} className="mt-3 text-primary-600 hover:text-primary-700 font-medium">
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
