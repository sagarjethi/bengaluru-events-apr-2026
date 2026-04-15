import { useEffect, useState } from 'react';
import { Lock, Mail, X as XClose } from 'lucide-react';
import EmailCapture from './EmailCapture';

// Once a user subscribes via the reveal flow, they don't have to re-subscribe
// to see other accelerator contacts. Stored per-browser in localStorage.
const UNLOCK_KEY = 'accelerator-contacts-unlocked';

function readUnlocked() {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(UNLOCK_KEY) === '1';
  } catch {
    return false;
  }
}

function markUnlocked() {
  try {
    window.localStorage.setItem(UNLOCK_KEY, '1');
  } catch {
    /* storage unavailable — caller still has in-memory state */
  }
}

/**
 * Gated email-reveal control for accelerator cards.
 *
 * Why gate a publicly listed email behind subscribe?
 *   - These emails are already public on each accelerator's site.
 *   - Showing them as raw `mailto:` chips invites scraping by bots and
 *     gives us nothing back. Gating turns each "I want to email them"
 *     intent into a qualified subscriber on our newsletter — and the
 *     user still gets the contact at the end of the flow.
 *
 * Behaviour:
 *   - First card the user reveals: opens a modal asking them to subscribe.
 *   - On successful subscribe, the same modal shows the email (so the user
 *     gets immediate value), and an unlock flag is persisted in localStorage.
 *   - All future reveals on this browser show the email instantly.
 */
export default function RevealEmailButton({ accelerator }) {
  const [unlocked, setUnlocked] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setUnlocked(readUnlocked());
  }, []);

  if (!accelerator?.publicEmail) return null;

  const handleSubscribed = () => {
    markUnlocked();
    setUnlocked(true);
    // Modal stays open so the user sees the email reveal in context.
  };

  return (
    <>
      {unlocked ? (
        <a
          href={`mailto:${accelerator.publicEmail}`}
          className="inline-flex items-center gap-1 text-slate-600 hover:text-primary-700 font-medium"
          title={`Public contact: ${accelerator.publicEmail}`}
        >
          <Mail className="w-3 h-3" /> Email
        </a>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1 text-slate-500 hover:text-primary-700 transition-colors"
          title={`Subscribe to reveal ${accelerator.name}'s contact email`}
        >
          <Lock className="w-3 h-3" /> Reveal email
        </button>
      )}

      {open && (
        <RevealEmailModal
          accelerator={accelerator}
          unlocked={unlocked}
          onClose={() => setOpen(false)}
          onSubscribed={handleSubscribed}
        />
      )}
    </>
  );
}

function RevealEmailModal({ accelerator, unlocked, onClose, onSubscribed }) {
  // Lock background scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reveal-title"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-[fadeIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 bg-gradient-to-r from-violet-500 via-primary-500 to-amber-400" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <XClose className="w-4 h-4" />
        </button>

        <div className="p-6 pt-5">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center">
              {unlocked ? <Mail className="w-6 h-6 text-emerald-600" /> : <Lock className="w-6 h-6 text-primary-600" />}
            </div>
          </div>

          <h3 id="reveal-title" className="text-lg font-bold text-slate-900 text-center mb-1">
            {unlocked ? `${accelerator.name}'s public contact` : `Reveal ${accelerator.name}'s contact`}
          </h3>
          <p className="text-sm text-slate-500 text-center mb-5 leading-relaxed">
            {unlocked
              ? `You're subscribed — all 13 accelerator contacts are unlocked on this browser.`
              : `Subscribe once and unlock contacts for all 13 accelerators. We'll also email you the moment any of them opens a new cohort.`
            }
          </p>

          {!unlocked && (
            <EmailCapture
              variant="stacked"
              placeholder="founder@yourstartup.com"
              cta="Unlock contact"
              source={`accelerators-reveal:${accelerator.id}`}
              tag="accelerator-leads"
              successMessage="Subscribed — contact unlocked below."
              onSuccess={onSubscribed}
            />
          )}

          {unlocked && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">
                Public contact
              </p>
              <a
                href={`mailto:${accelerator.publicEmail}`}
                className="text-sm font-bold text-emerald-900 hover:text-emerald-700 break-all"
              >
                {accelerator.publicEmail}
              </a>
              <p className="mt-2 text-[11px] text-emerald-700/80">
                This email is publicly listed on {accelerator.name}'s own site. Be courteous — quality outreach beats volume.
              </p>
            </div>
          )}

          <p className="mt-4 text-[11px] text-slate-400 text-center leading-relaxed">
            We never share your email. One unsubscribe click and you're out.
          </p>
        </div>
      </div>
    </div>
  );
}
