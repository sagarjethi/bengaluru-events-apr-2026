import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, LayoutGrid, MessageCircle, Link2, MapPin, Menu, X, Home, Code, Rocket } from 'lucide-react';

const anchorItems = [
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'events', label: 'Events', icon: LayoutGrid },
];

const pageItems = [
  { to: '/hackathons', label: 'Hackathons', icon: Code },
  { to: '/accelerators', label: 'Accelerators', icon: Rocket },
  { to: '/map', label: 'Map', icon: MapPin },
  { to: '/social', label: 'Social', icon: MessageCircle },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // On inner pages, anchor links go to homepage sections
  const getAnchorHref = (id) => isHomePage ? `#${id}` : `/#${id}`;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200' : 'bg-white/80 backdrop-blur-sm border-b border-slate-200/60'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="font-bold text-slate-800 text-lg hover:text-primary-600 transition-colors">BLR Events</Link>
          <div className="hidden sm:flex items-center gap-1">
            {!isHomePage && (
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors font-medium"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
            )}
            {anchorItems.map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={getAnchorHref(id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors font-medium"
              >
                <Icon className="w-4 h-4" />
                {label}
              </a>
            ))}
            {pageItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-md transition-colors font-medium ${location.pathname === to ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
          <button className="sm:hidden p-2 text-slate-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="sm:hidden pb-3 space-y-1">
            {!isHomePage && (
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
            )}
            {anchorItems.map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={getAnchorHref(id)}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
              >
                <Icon className="w-4 h-4" />
                {label}
              </a>
            ))}
            {pageItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${location.pathname === to ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
