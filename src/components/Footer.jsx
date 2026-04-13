import { Heart } from 'lucide-react';

function XIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-slate-800 font-semibold text-lg mb-1">Bengaluru Events Directory</p>
          <p className="text-sm text-slate-500 mb-5">
            April 15–26, 2026 &middot; Your guide to tech events in India's Silicon Valley
          </p>

          {/* Follow CTA */}
          <div className="mb-5">
            <p className="text-sm text-slate-500 mb-3">Found this useful? A follow means a lot!</p>
            <a
              href="https://x.com/intent/follow?screen_name=sagarbjethi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              <XIcon className="w-4 h-4" />
              Follow @sagarbjethi
            </a>
          </div>

          <p className="text-xs text-slate-400">
            Built by{' '}
            <a href="https://sagarjethi.com" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600">
              @sagarjethi
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
