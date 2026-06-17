'use client';

import { useState, useSyncExternalStore } from 'react';

import { event, GA_EVENTS } from '@/lib/gtag';

interface SubscriptionRecord {
  email: string;
  subscribedAt: string;
}

function getSubscription(): SubscriptionRecord | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('aihues-newsletter-subscribed');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SubscriptionRecord;
  } catch {
    return null;
  }
}

export default function NewsletterSubscribe() {
  const subscription = useSyncExternalStore(
    () => () => {},
    getSubscription,
    () => null
  );

  const [email, setEmail] = useState('');
  const [justSubscribed, setJustSubscribed] = useState(false);

  const isSubscribed = subscription !== null || justSubscribed;
  const displayEmail = subscription?.email || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    const record: SubscriptionRecord = {
      email,
      subscribedAt: new Date().toISOString(),
    };
    localStorage.setItem(
      'aihues-newsletter-subscribed',
      JSON.stringify(record)
    );
    setJustSubscribed(true);
    setEmail('');
    event(GA_EVENTS.newsletterSubscribe);
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

        {isSubscribed ? (
          <div className='mt-5 rounded-lg bg-[rgba(180,83,9,0.08)] px-4 py-3 text-sm font-medium text-[#b45309]'>
            Thanks for your interest! Newsletter emails aren&apos;t live yet —
            we&apos;ll let you know when they are.{' '}
            {displayEmail ? `(${displayEmail})` : ''}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className='mt-5 flex flex-col gap-3 sm:flex-row'
          >
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
