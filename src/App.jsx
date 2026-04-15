import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Stats from './components/Stats';
import CalendarView from './components/CalendarView';
import EventsGrid from './components/EventsGrid';
import SocialBuzz from './components/SocialBuzz';
import Platforms from './components/Platforms';
import Footer from './components/Footer';
import SEO from './components/SEO';
import EventDetail from './components/EventDetail';
import SocialPage from './components/SocialPage';
import TweetSupportModal from './components/TweetSupportModal';
import MapPage from './components/MapPage';
import HappeningNow from './components/HappeningNow';
import HackathonsPage from './components/HackathonsPage';
import BuilderResourcesHub from './components/BuilderResourcesHub';

function HomePage() {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="min-h-screen">
      <SEO />
      <Header />
      <HappeningNow />
      <Stats />
      <CalendarView selectedDate={selectedDate} onDateSelect={setSelectedDate} />
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
        <Route path="/events/:slug" element={<EventDetail />} />
        <Route path="/hackathons" element={<HackathonsPage />} />
        <Route path="/hackathons/resources" element={<BuilderResourcesHub />} />
        <Route path="/social" element={<SocialPage />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </>
  );
}
