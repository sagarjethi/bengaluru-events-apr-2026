import { Suspense, lazy, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// Above-the-fold: keep eager so first paint is fast and SEO crawlers see them.
import Header from './components/Header';
import Navigation from './components/Navigation';
import Stats from './components/Stats';
import HomeCalendar from './components/HomeCalendar';
import EventsGrid from './components/EventsGrid';
import CuratorCTA from './components/CuratorCTA';
import Footer from './components/Footer';
import SEO from './components/SEO';
import TweetSupportModal from './components/TweetSupportModal';

// Below-the-fold on home: lazy so the homepage TTI is faster.
const SocialBuzz = lazy(() => import('./components/SocialBuzz'));
const Platforms = lazy(() => import('./components/Platforms'));

// Per-route components: lazy-loaded so each route is its own chunk.
// Saves ~200KB+ from the homepage bundle (Leaflet alone ships ~150KB).
const EventDetail = lazy(() => import('./components/EventDetail'));
const MonthsIndexPage = lazy(() => import('./components/MonthEventsPage').then((m) => ({ default: m.MonthsIndexPage })));
const MonthEventsPage = lazy(() => import('./components/MonthEventsPage'));
const CollectionPage = lazy(() => import('./components/CollectionPage'));
const CollegeFestsPage = lazy(() => import('./components/CollegeFestsPage'));
const SocialPage = lazy(() => import('./components/SocialPage'));
const MapPage = lazy(() => import('./components/MapPage'));
const HackathonsPage = lazy(() => import('./components/HackathonsPage'));
const BuilderResourcesHub = lazy(() => import('./components/BuilderResourcesHub'));
const AcceleratorsPage = lazy(() => import('./components/AcceleratorsPage'));
const AcceleratorDetail = lazy(() => import('./components/AcceleratorDetail'));

// Minimal route-level loading fallback. Keeps CLS low — same height as a hero.
function RouteFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-primary-500 animate-spin" aria-label="Loading" />
    </div>
  );
}

function HomePage() {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="min-h-screen">
      <SEO />
      <Header />
      <Stats />
      <HomeCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      <EventsGrid selectedDate={selectedDate} onClearDate={() => setSelectedDate(null)} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <CuratorCTA variant="default" source="home" />
      </div>
      <Suspense fallback={null}>
        <SocialBuzz />
        <Platforms />
      </Suspense>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <>
      <Navigation />
      <TweetSupportModal />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<MonthsIndexPage />} />
          <Route path="/events/april-2026" element={<MonthEventsPage month="april-2026" />} />
          <Route path="/events/may-2026" element={<MonthEventsPage month="may-2026" />} />
          <Route path="/events/:slug" element={<EventDetail />} />

          {/* SEO landing pages — generic CollectionPage with config-driven filters */}
          <Route path="/free-tech-events-bangalore" element={<CollectionPage slug="free-tech-events-bangalore" />} />
          <Route path="/ai-events-bangalore-2026" element={<CollectionPage slug="ai-events-bangalore-2026" />} />
          <Route path="/conferences-bangalore-2026" element={<CollectionPage slug="conferences-bangalore-2026" />} />
          <Route path="/hackathons-bangalore-2026" element={<CollectionPage slug="hackathons-bangalore-2026" />} />
          <Route path="/web3-events-bangalore-2026" element={<CollectionPage slug="web3-events-bangalore-2026" />} />
          <Route path="/tech-events-this-weekend-bangalore" element={<CollectionPage slug="tech-events-this-weekend-bangalore" />} />
          <Route path="/college-fests-bangalore-2026" element={<CollegeFestsPage />} />
          <Route path="/hackathons" element={<HackathonsPage />} />
          <Route path="/hackathons/resources" element={<BuilderResourcesHub />} />
          <Route path="/accelerators" element={<AcceleratorsPage />} />
          <Route path="/accelerators/:slug" element={<AcceleratorDetail />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </Suspense>
    </>
  );
}
