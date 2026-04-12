import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  MapPin,
  Clock,
  Calendar,
  Tag,
  ExternalLink,
  Trophy,
  ArrowLeft,
  Share2,
  Globe,
  Users,
  Sparkles,
  Navigation2,
} from 'lucide-react';
import EventMap from './EventMap';
import { events, CATEGORIES } from '../data/events';
import { findEventBySlug, toSlug } from '../utils/slug';

function getCategoryGradient(category) {
  const gradients = {
    conference: 'from-primary-600 to-primary-800',
    hackathon: 'from-violet-600 to-violet-800',
    startup: 'from-emerald-600 to-emerald-800',
    web3: 'from-amber-500 to-amber-700',
    meetup: 'from-cyan-600 to-cyan-800',
    music: 'from-rose-500 to-rose-700',
    sports: 'from-emerald-500 to-emerald-700',
    expo: 'from-slate-600 to-slate-800',
    cybersecurity: 'from-rose-600 to-rose-800',
  };
  return gradients[category] || 'from-primary-600 to-primary-800';
}

function getCategoryIcon(category) {
  const icons = {
    hackathon: '{ }',
    conference: '🎤',
    startup: '🚀',
    web3: '⛓️',
    meetup: '👥',
    music: '🎵',
    sports: '🏃',
    expo: '🏛️',
    cybersecurity: '🔒',
  };
  return icons[category] || '📅';
}

function formatDate(startDate, endDate) {
  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');
  const opts = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  if (startDate === endDate) {
    return start.toLocaleDateString('en-IN', opts);
  }
  const startStr = start.toLocaleDateString('en-IN', { weekday: 'short', month: 'long', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-IN', opts);
  return `${startStr} – ${endStr}`;
}

function getDaysUntil(startDate) {
  const now = new Date();
  const start = new Date(startDate + 'T00:00:00');
  const diff = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'Event has passed';
  if (diff === 0) return 'Happening today!';
  if (diff === 1) return 'Tomorrow!';
  return `In ${diff} days`;
}

function getRelatedEvents(event) {
  return events
    .filter((e) => e.id !== event.id && (e.category === event.category || e.tags.some((t) => event.tags.includes(t))))
    .slice(0, 3);
}

export default function EventDetail() {
  const { slug } = useParams();
  const event = findEventBySlug(events, slug);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Event Not Found</h1>
          <p className="text-slate-500 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const cat = CATEGORIES[event.category];
  const gradient = getCategoryGradient(event.category);
  const icon = getCategoryIcon(event.category);
  const daysUntil = getDaysUntil(event.startDate);
  const related = getRelatedEvents(event);
  const eventUrl = `https://bengaluru-events.sagarjethi.com/events/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: event.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bengaluru',
        addressRegion: 'Karnataka',
        addressCountry: 'IN',
      },
    },
    ...(event.cost === 'Free' || event.cost?.toLowerCase().includes('free')
      ? {
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', availability: 'https://schema.org/LimitedAvailability', url: event.link },
        }
      : {
          offers: { '@type': 'Offer', url: event.link, availability: 'https://schema.org/LimitedAvailability' },
        }),
    url: eventUrl,
    ...(event.website ? { sameAs: event.website } : {}),
    keywords: event.tags.join(', '),
    image: 'https://bengaluru-events.sagarjethi.com/og-image.svg',
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: event.name, text: event.description, url: eventUrl });
    } else {
      await navigator.clipboard.writeText(eventUrl);
    }
  };

  return (
    <>
      <Helmet>
        <title>{event.name} — Bengaluru Events April 2026</title>
        <meta name="description" content={`${event.description} | ${event.date} at ${event.venue}, Bengaluru.`} />
        <meta name="keywords" content={`${event.tags.join(', ')}, Bengaluru, ${event.category}, April 2026`} />
        <link rel="canonical" href={eventUrl} />
        <meta property="og:title" content={`${event.name} — Bengaluru Events`} />
        <meta property="og:description" content={`${event.description} | ${event.date} at ${event.venue}`} />
        <meta property="og:url" content={eventUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://bengaluru-events.sagarjethi.com/og-image.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${event.name} — Bengaluru Events`} />
        <meta name="twitter:description" content={event.description} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen">
        {/* Top Nav */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 font-medium text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Events
            </Link>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-primary-600 text-sm font-medium transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </nav>

        {/* Hero Banner */}
        <div className={`bg-gradient-to-br ${gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-5xl mx-auto px-4 py-12 md:py-16">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                {/* Category + Status */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                    {cat?.label || event.category}
                  </span>
                  {event.featured && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-100 backdrop-blur-sm">
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                  {(event.cost === 'Free' || event.cost?.toLowerCase().includes('free')) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-100 backdrop-blur-sm">
                      Free
                    </span>
                  )}
                </div>

                {/* Event Name */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                  {event.name}
                </h1>

                {/* Quick Info */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-white/80 text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.startDate, event.endDate)}
                  </span>
                  <span className="hidden sm:inline" aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {event.venue}
                  </span>
                </div>
              </div>

              {/* Large Icon */}
              <div className="hidden md:flex items-center justify-center w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm text-5xl shrink-0">
                {icon}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 -mt-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Countdown Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${daysUntil === 'Event has passed' ? 'bg-slate-400' : daysUntil === 'Happening today!' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  <span className={`text-sm font-semibold ${daysUntil === 'Happening today!' ? 'text-emerald-600' : 'text-slate-600'}`}>
                    {daysUntil}
                  </span>
                </div>
              </div>

              {/* About */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-3">About this event</h2>
                <p className="text-slate-600 leading-relaxed text-base">{event.description}</p>

                {event.prize && (
                  <div className="mt-4 flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <Trophy className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-800">Prize Pool: {event.prize}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-3">Topics</h2>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium border border-slate-200 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Location & Map */}
              {event.lat && event.lng && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Location</h2>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      <Navigation2 className="w-4 h-4" />
                      Get Directions
                    </a>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{event.venue}, Bengaluru, Karnataka</p>
                  <EventMap events={[event]} height="280px" zoom={15} center={[event.lat, event.lng]} showLinks={false} />
                </div>
              )}

              {/* Related Events */}
              {related.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Related Events</h2>
                  <div className="space-y-3">
                    {related.map((r) => {
                      const rCat = CATEGORIES[r.category];
                      return (
                        <Link
                          key={r.id}
                          to={`/events/${toSlug(r.name)}`}
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getCategoryGradient(r.category)} flex items-center justify-center text-lg shrink-0`}>
                            {getCategoryIcon(r.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-primary-600 transition-colors truncate">
                              {r.name}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {r.date} · {r.venue}
                            </p>
                          </div>
                          <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${rCat?.color || 'bg-slate-100 text-slate-600'}`}>
                            {rCat?.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Register Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-16">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Event Details</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{event.date}</p>
                      <p className="text-xs text-slate-500">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{event.venue}</p>
                      <p className="text-xs text-slate-500">Bengaluru, Karnataka, India</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Tag className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{event.cost}</p>
                    </div>
                  </div>

                  {event.prize && (
                    <div className="flex items-start gap-3">
                      <Trophy className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Prize: {event.prize}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2">
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                  >
                    Register Now
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {event.website && (
                    <a
                      href={event.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-6 py-3 rounded-xl transition-colors text-sm"
                    >
                      <Globe className="w-4 h-4" />
                      Official Website
                    </a>
                  )}
                </div>

                {event.lat && event.lng && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium px-6 py-3 rounded-xl transition-colors text-sm"
                  >
                    <Navigation2 className="w-4 h-4" />
                    Get Directions
                  </a>
                )}

                {/* Share */}
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 w-full mt-2 text-slate-500 hover:text-primary-600 text-sm font-medium py-2 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share this event
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-5xl mx-auto px-4 py-12 mt-6">
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse all Bengaluru events
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
