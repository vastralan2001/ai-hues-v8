'use client';

import { useEffect, useRef } from 'react';

import { event, GA_EVENTS } from '@/lib/gtag';

export function PageDurationTracker() {
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = performance.now();

    const handleUnload = () => {
      const duration = Math.round(
        (performance.now() - startTimeRef.current) / 1000
      );
      if (duration > 1) {
        event(GA_EVENTS.pageDuration, {
          page: window.location.pathname,
          duration_seconds: duration,
        });
      }
    };

    window.addEventListener('beforeunload', handleUnload);

    // Also report on visibility change (tab switch / mobile background)
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        const duration = Math.round(
          (performance.now() - startTimeRef.current) / 1000
        );
        if (duration > 1) {
          event(GA_EVENTS.pageDuration, {
            page: window.location.pathname,
            duration_seconds: duration,
          });
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return null;
}
