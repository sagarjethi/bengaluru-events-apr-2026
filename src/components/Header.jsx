import { Calendar, Sparkles, Zap, MapPin } from 'lucide-react';
import EmailCapture from './EmailCapture';
import { EVENT_COUNT, FREE_COUNT, HACKATHON_COUNT, TOTAL_PRIZE_LABEL } from '../utils/stats';

export default function Header() {
  return (
    <header className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-50 via-white to-accent-50 opacity-60" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="text-center">
          {/* Badge with dates merged */}
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {EVENT_COUNT}+ events · Apr–May 2026 · Bengaluru
          </div>

          {/* Hero H1 — keyword-rich, brand-led, hierarchy-tight */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.05]">
            Every tech event in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
              Bengaluru
            </span>
            <span className="block text-slate-700 text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 tracking-tight">
              Hackathons, conferences &amp; meetups · Spring 2026
            </span>
          </h1>

          {/* Description — value-led, link to month index */}
          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            One link-verified directory of every public tech event in Bengaluru.
            {' '}
            <a href="/events" className="text-primary-600 hover:text-primary-700 font-semibold">Browse by month</a>
            {' · '}
            <a href="/free-tech-events-bangalore" className="text-primary-600 hover:text-primary-700 font-semibold">free events</a>
            {' · '}
            <a href="/ai-events-bangalore-2026" className="text-primary-600 hover:text-primary-700 font-semibold">AI events</a>
            . Curated by{' '}
            <a href="https://topmate.io/sagarjethi" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-semibold">
              @sagarjethi
            </a>.
          </p>

          {/* Primary action: email + browse button in one row */}
          <div className="mt-5 max-w-lg mx-auto">
            <EmailCapture
              variant="compact"
              placeholder="Get event drops in your inbox"
              cta="Subscribe"
              source="header"
              successMessage="You're in! Check your inbox."
            />
            <div className="mt-3 flex items-center justify-center gap-4 text-xs sm:text-sm">
              <a href="#calendar" className="inline-flex items-center gap-1.5 text-slate-700 hover:text-primary-600 font-medium transition-colors">
                <Calendar className="w-4 h-4" />
                View Calendar
              </a>
              <span className="text-slate-300">·</span>
              <a href="#events" className="text-slate-700 hover:text-primary-600 font-medium transition-colors">
                Browse Events
              </a>
              <span className="text-slate-300">·</span>
              <a href="/map" className="inline-flex items-center gap-1.5 text-slate-700 hover:text-primary-600 font-medium transition-colors">
                <MapPin className="w-4 h-4" />
                Map
              </a>
            </div>
          </div>

          {/* Social proof bar — compact, single row */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-semibold border border-emerald-100">
              <Zap className="w-3 h-3" />
              {FREE_COUNT} Free
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 text-violet-700 rounded-full font-semibold border border-violet-100">
              {HACKATHON_COUNT} Hackathons
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full font-semibold border border-amber-100">
              {TOTAL_PRIZE_LABEL} Prizes
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
