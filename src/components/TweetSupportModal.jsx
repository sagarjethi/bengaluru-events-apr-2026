import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Heart, ExternalLink } from 'lucide-react';

const TWEET_URL = 'https://x.com/sagarbjethi/status/2043607049679057396';
const STORAGE_KEY = 'tweet-support-dismissed';

function XIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function TweetSupportModal() {
  const [show, setShow] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    // Only show when navigating away from homepage (to event detail, social, etc.)
    if (location.pathname === '/') return;

    // Small delay so page renders first
    const timer = setTimeout(() => setShow(true), 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleLike = () => {
    window.open(TWEET_URL, '_blank', 'noopener,noreferrer');
    handleDismiss();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={handleDismiss}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-[fadeIn_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient top bar */}
        <div className="h-1.5 bg-gradient-to-r from-primary-500 via-accent-500 to-violet-500" />

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 pt-5">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center">
              <XIcon className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
            Finding this helpful?
          </h3>
          <p className="text-sm text-slate-500 text-center mb-5 leading-relaxed">
            A simple like on the tweet helps more people discover this directory and find events they'd love to attend. It takes 2 seconds and means the world.
          </p>

          {/* CTA */}
          <button
            onClick={handleLike}
            className="w-full flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            <Heart className="w-4 h-4 text-rose-400" />
            Like the tweet on X
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </button>

        </div>
      </div>
    </div>
  );
}
