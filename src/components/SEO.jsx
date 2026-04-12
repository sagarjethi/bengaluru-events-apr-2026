import { Helmet } from 'react-helmet-async';
import { events } from '../data/events';

function generateAllEventsJsonLd() {
  return events.map((event) => ({
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
    ...(event.cost === 'Free' || event.cost.toLowerCase().includes('free')
      ? {
          isAccessibleForFree: true,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'INR',
            availability: 'https://schema.org/LimitedAvailability',
            url: event.link,
          },
        }
      : {
          offers: {
            '@type': 'Offer',
            url: event.link,
            availability: 'https://schema.org/LimitedAvailability',
          },
        }),
    url: event.link,
    ...(event.website ? { sameAs: event.website } : {}),
    keywords: event.tags.join(', '),
  }));
}

export default function SEO() {
  const allEventsJsonLd = generateAllEventsJsonLd();

  return (
    <Helmet>
      {allEventsJsonLd.map((eventLd, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(eventLd)}
        </script>
      ))}
    </Helmet>
  );
}
