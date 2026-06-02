'use client';

import { useState } from 'react';

import { event, GA_EVENTS } from '@/lib/gtag';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }
    // Simulate subscription — replace with real API call later
    event(GA_EVENTS.newsletterSubscribe);
    setStatus('success');
    setEmail('');
  };

  return (
    <div className='mt-16 rounded-[14px] border border-[#e8e2d9] bg-white p-8 md:p-10'>
      <div className='mx-auto max-w-[420px] text-center'>
        <h3 className='text-xl font-bold tracking-tight text-[#1c1917]'>
          Subscribe to AIHues Newsletter
        </h3>
        <p className='mt-2 text-sm leading-relaxed text-[#78716c]'>
          Enter your email to get weekly AI tool reviews and growth strategies
          delivered to your inbox.
        </p>

        {status === 'success' ? (
          <div className='mt-5 rounded-lg bg-[rgba(180,83,9,0.08)] px-4 py-3 text-sm font-medium text-[#b45309]'>
            Thanks for subscribing! Check your inbox soon.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className='mt-5 flex flex-col gap-3 sm:flex-row'
          >
            <input
              type='email'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder='Your email address'
              className='flex-1 rounded-lg border border-[#e8e2d9] bg-[#faf9f6] px-4 py-2.5 text-sm text-[#1c1917] outline-none transition-colors placeholder:text-[#a8a29e] focus:border-[#d97706] focus:bg-white'
              required
            />
            <button
              type='submit'
              className='rounded-lg bg-[#b45309] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#92400e] active:scale-[0.98]'
            >
              Subscribe
            </button>
          </form>
        )}
        <p className='mt-3 text-xs text-[#a8a29e]'>
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
