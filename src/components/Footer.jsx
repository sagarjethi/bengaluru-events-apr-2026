import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-slate-800 font-semibold text-lg mb-1">Bengaluru Events Directory</p>
          <p className="text-sm text-slate-500 mb-4">
            April 15–26, 2026 &middot; Your guide to tech events in India's Silicon Valley
          </p>
          <p className="text-xs text-slate-400">
            Built by{' '}
            <a href="https://x.com/sagarbjethi" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600">
              @sagarbjethi
            </a>
            {' '}&middot;{' '}
            <a href="https://www.linkedin.com/in/sagarjethi" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600">
              LinkedIn
            </a>
            {' '}&middot;{' '}
            <a href="https://github.com/sagarjethi/bengaluru-events-apr-2026" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600">
              GitHub
            </a>
          </p>
          <p className="text-xs text-slate-400 mt-2 flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-400" /> for the Bengaluru tech community
          </p>
          <p className="text-xs text-slate-300 mt-3">
            Dates, venues, and prices may change — always verify on the official event page.
          </p>
        </div>
      </div>
    </footer>
  );
}
