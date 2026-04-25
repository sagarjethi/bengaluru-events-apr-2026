import { Helmet } from 'react-helmet-async';
import { events } from '../data/events';

function generateAllEventsJsonLd() {
  return events
    .filter((event) => event.startDate && !event.startDate.includes('TBA'))
    .map((event) => ({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.name,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate || event.startDate,
      eventAttendanceMode: event.venue?.toLowerCase().includes('virtual')
        ? 'https://schema.org/OnlineEventAttendanceMode'
        : 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: event.venue?.toLowerCase().includes('virtual')
        ? { '@type': 'VirtualLocation', url: event.link }
        : {
            '@type': 'Place',
            name: event.venue,
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Bengaluru',
              addressRegion: 'Karnataka',
              addressCountry: 'IN',
            },
            ...(event.lat && event.lng ? { geo: { '@type': 'GeoCoordinates', latitude: event.lat, longitude: event.lng } } : {}),
          },
      organizer: { '@type': 'Organization', name: event.tags?.[0] || 'Bengaluru Events' },
      performer: { '@type': 'Organization', name: event.tags?.[0] || 'Bengaluru Events' },
      image: 'https://bengaluru-events.sagarjethi.com/og-image.png',
      ...(event.cost === 'Free' || event.cost?.toLowerCase().includes('free')
        ? {
            isAccessibleForFree: true,
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
              url: event.link,
            },
          }
        : {
            offers: {
              '@type': 'Offer',
              url: event.link,
              availability: 'https://schema.org/InStock',
            },
          }),
      url: event.link,
      ...(event.website ? { sameAs: event.website } : {}),
    }));
}

// Organization + Person JSON-LD — establishes E-E-A-T (Experience, Expertise,
// Authoritativeness, Trustworthiness) signals that LLMs and Google AI
// Overviews weigh when deciding which sources to cite.
const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://bengaluru-events.sagarjethi.com/#organization',
  name: 'Bengaluru Events Directory',
  alternateName: 'BLR Events',
  url: 'https://bengaluru-events.sagarjethi.com',
  logo: 'https://bengaluru-events.sagarjethi.com/og-image.png',
  description:
    "India's most complete, link-verified directory of tech events, hackathons, conferences, and meetups in Bengaluru (Bangalore). Curated by an independent operator, refreshed daily.",
  founder: {
    '@type': 'Person',
    '@id': 'https://bengaluru-events.sagarjethi.com/#sagar',
    name: 'Sagar Jethi',
    url: 'https://x.com/sagarbjethi',
    sameAs: [
      'https://x.com/sagarbjethi',
      'https://www.linkedin.com/in/sagarjethi',
      'https://github.com/sagarjethi',
      'https://topmate.io/sagarjethi',
    ],
  },
  sameAs: [
    'https://github.com/sagarjethi/bengaluru-events-apr-2026',
    'https://x.com/sagarbjethi',
  ],
  areaServed: {
    '@type': 'City',
    name: 'Bengaluru',
    sameAs: 'https://en.wikipedia.org/wiki/Bangalore',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
      addressCountry: 'IN',
    },
  },
};

const WEBSITE_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://bengaluru-events.sagarjethi.com/#website',
  url: 'https://bengaluru-events.sagarjethi.com',
  name: 'Bengaluru Events Directory',
  publisher: { '@id': 'https://bengaluru-events.sagarjethi.com/#organization' },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://bengaluru-events.sagarjethi.com/?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'en-IN',
};

export default function SEO() {
  const allEventsJsonLd = generateAllEventsJsonLd();

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(ORGANIZATION_LD)}</script>
      <script type="application/ld+json">{JSON.stringify(WEBSITE_LD)}</script>
      {allEventsJsonLd.map((eventLd) => (
        <script key={eventLd.name} type="application/ld+json">
          {JSON.stringify(eventLd)}
        </script>
      ))}
    </Helmet>
  );
}
