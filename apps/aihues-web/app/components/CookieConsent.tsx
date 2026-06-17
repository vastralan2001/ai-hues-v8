'use client';

import { useSyncExternalStore } from 'react';

const CONSENT_KEY = 'aihues-cookie-consent';

function getConsent(): boolean | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(CONSENT_KEY);
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  return null;
}

function getServerConsent(): null {
  return null;
}

export function hasAnalyticsConsent(): boolean {
  return getConsent() === true;
}

export default function CookieConsent() {
  const consent = useSyncExternalStore(
    () => () => {},
    getConsent,
    getServerConsent
  );

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'true');
    window.location.reload();
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'false');
  };

  if (consent !== null) return null;

  return (
    <div className='fixed bottom-0 left-0 right-0 z-[200] border-t border-border bg-surface p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]'>
      <div className='mx-auto flex max-w-[1300px] flex-col items-center justify-between gap-4 md:flex-row'>
        <p className='text-[14px] text-muted'>
          We use cookies and Google Analytics to improve AIHues. You can accept
          analytics or continue with minimal cookies.
        </p>
        <div className='flex shrink-0 gap-3'>
          <button
            onClick={decline}
            className='rounded-lg border border-border bg-white px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-neutral-50'
          >
            Decline
          </button>
          <button
            onClick={accept}
            className='rounded-lg bg-foreground px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:opacity-90'
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
