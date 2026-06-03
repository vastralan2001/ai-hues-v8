'use client';

import { useSyncExternalStore } from 'react';

function getCredits(): number {
  if (typeof window === 'undefined') return 100;
  const stored = localStorage.getItem('aihues-credits');
  return stored ? parseInt(stored, 10) : 100;
}

export function CreditDisplay() {
  const credits = useSyncExternalStore(
    () => () => {}, // no subscription needed for localStorage
    getCredits,
    () => 100 // server snapshot
  );

  return (
    <div className='flex items-center gap-1.5 rounded-full border border-border bg-bg px-3 py-1.5 text-[13px] font-semibold text-foreground'>
      <span className='text-[16px]'>🪙</span>
      <span>{credits}</span>
    </div>
  );
}
