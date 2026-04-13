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

export default function SEO() {
  const allEventsJsonLd = generateAllEventsJsonLd();

  return (
    <Helmet>
      {allEventsJsonLd.map((eventLd) => (
        <script key={eventLd.name} type="application/ld+json">
          {JSON.stringify(eventLd)}
        </script>
      ))}
    </Helmet>
  );
}
