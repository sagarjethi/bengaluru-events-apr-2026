import { Calendar, Sparkles, Zap, MapPin } from 'lucide-react';
import EmailCapture from './EmailCapture';

export default function Header() {
  return (
    <header className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-50 via-white to-accent-50 opacity-60" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="text-center">
          {/* Badge with dates merged */}
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            38+ events · Apr 15–26, 2026 · Bengaluru
          </div>

          {/* Compact H1 — single line on desktop, tight on mobile */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Bengaluru Tech Events{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
              April 2026
            </span>
          </h1>

          {/* Description — tightened, credit inline */}
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Your complete guide to tech conferences, hackathons, and startup events — curated by{' '}
            <a
              href="https://sagarjethi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              @sagarjethi
            </a>
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
              27 Free
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 text-violet-700 rounded-full font-semibold border border-violet-100">
              10 Hackathons
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full font-semibold border border-amber-100">
              $145K+ Prizes
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
