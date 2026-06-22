'use client';

import { useEffect } from 'react';

import { PageShell } from '@/components/SiteChrome';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to monitoring service when available
    console.error('Global error:', error);
  }, [error]);

  return (
    <PageShell>
      <div className='flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center'>
        <h1 className='text-[80px] font-extrabold leading-none tracking-[-2px] text-[#e8e2d9]'>
          Oops
        </h1>
        <h2 className='mt-4 text-2xl font-bold text-[#1c1917]'>
          Something went wrong
        </h2>
        <p className='mt-2 max-w-[400px] text-[15px] text-[#78716c]'>
          We encountered an unexpected error. Please try again or contact
          support if the problem persists.
        </p>
        {error.digest && (
          <p className='mt-2 font-mono text-xs text-[#a8a29e]'>
            Error ID: {error.digest}
          </p>
        )}
        <div className='mt-8 flex flex-wrap justify-center gap-3'>
          <button
            className='rounded-[10px] bg-[#b45309] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#d97706]'
            onClick={reset}
            type='button'
          >
            Try again
          </button>
        </div>
      </div>
    </PageShell>
  );
}
