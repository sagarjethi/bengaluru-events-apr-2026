import { Link } from 'react-router-dom';
import { MapPin, Clock, Tag, ExternalLink, Trophy } from 'lucide-react';
import { CATEGORIES } from '../data/events';
import { toSlug } from '../utils/slug';

export default function EventCard({ event }) {
  const cat = CATEGORIES[event.category];

  return (
    <article
      itemScope
      itemType="https://schema.org/Event"
      className={`group bg-white rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all duration-200 overflow-hidden ${event.featured ? 'ring-2 ring-primary-200' : ''}`}
    >
      {event.featured && (
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-semibold px-4 py-1 text-center" aria-label="Featured event">
          Featured Event
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cat?.color || 'bg-slate-100 text-slate-600'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cat?.dot || 'bg-slate-400'}`} />
                {cat?.label || event.category}
              </span>
              {event.cost === 'Free' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                  Free
                </span>
              )}
              {event.prize && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                  <Trophy className="w-3 h-3" aria-hidden="true" />
                  {event.prize}
                </span>
              )}
            </div>
            <Link to={`/events/${toSlug(event.name)}`}>
              <h3 itemProp="name" className="text-lg font-semibold text-slate-900 group-hover:text-primary-600 transition-colors leading-snug">
                {event.name}
              </h3>
            </Link>
          </div>
        </div>

        <p itemProp="description" className="text-sm text-slate-500 mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-1.5 text-sm text-slate-600 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <time itemProp="startDate" dateTime={event.startDate}>{event.date}</time>
            <span aria-hidden="true">&middot;</span>
            <span>{event.time}</span>
            <meta itemProp="endDate" content={event.endDate} />
          </div>
          <div className="flex items-center gap-2" itemProp="location" itemScope itemType="https://schema.org/Place">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span itemProp="name" className="truncate">{event.venue}</span>
            <meta itemProp="address" content="Bengaluru, Karnataka, India" />
          </div>
          {event.cost !== 'Free' && (
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span>{event.cost}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4" aria-label="Tags">
          {event.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded text-xs border border-slate-100">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          <Link
            to={`/events/${toSlug(event.name)}`}
            aria-label={`View details for ${event.name}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            View Details
          </Link>
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer nofollow ugc"
            itemProp="url"
            aria-label={`Register for ${event.name}`}
            className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium px-3 py-2 rounded-lg transition-colors"
          >
            Register
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
