import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Stats from './components/Stats';
import UpcomingDaysStrip from './components/UpcomingDaysStrip';
import EventsGrid from './components/EventsGrid';
import SocialBuzz from './components/SocialBuzz';
import Platforms from './components/Platforms';
import Footer from './components/Footer';
import SEO from './components/SEO';
import EventDetail from './components/EventDetail';
import MonthEventsPage, { MonthsIndexPage } from './components/MonthEventsPage';
import CollectionPage from './components/CollectionPage';
import CollegeFestsPage from './components/CollegeFestsPage';
import SocialPage from './components/SocialPage';
import TweetSupportModal from './components/TweetSupportModal';
import MapPage from './components/MapPage';
import HappeningNow from './components/HappeningNow';
import HackathonsPage from './components/HackathonsPage';
import BuilderResourcesHub from './components/BuilderResourcesHub';
import AcceleratorsPage from './components/AcceleratorsPage';
import AcceleratorDetail from './components/AcceleratorDetail';

function HomePage() {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="min-h-screen">
      <SEO />
      <Header />
      <HappeningNow />
      <Stats />
      <UpcomingDaysStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      <EventsGrid selectedDate={selectedDate} />
      <SocialBuzz />
      <Platforms />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <>
      <Navigation />
      <TweetSupportModal />
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
    </>
  );
}
