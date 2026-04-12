import { Calendar, MapPin, Sparkles, Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-50 via-white to-accent-50 opacity-60" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            33+ Events in 12 Days
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
            Bengaluru Events
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
              April 15–26, 2026
            </span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto">
            Your complete guide to tech conferences, hackathons, startup events, and more in India's tech capital.
          </p>
          <div className="mt-4 text-sm text-slate-400">
            by{' '}
            <a href="https://sagarjethi.com" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600 font-medium transition-colors">
              @sagarjethi
            </a>
          </div>

          {/* Quick highlights */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium border border-emerald-100">
              <Zap className="w-3 h-3" />
              18 Free Events
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 text-violet-700 rounded-full font-medium border border-violet-100">
              8 Hackathons
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full font-medium border border-amber-100">
              $150K+ Prizes
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary-500" />
              Bengaluru, India
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary-500" />
              Apr 15 – Apr 26, 2026
            </span>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#calendar" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
              <Calendar className="w-4 h-4" />
              View Calendar
            </a>
            <a href="#events" className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
              Browse Events
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
