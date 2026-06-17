'use client';

import { useSyncExternalStore } from 'react';
import Script from 'next/script';

import { hasAnalyticsConsent } from './CookieConsent';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function getServerConsent(): boolean {
  return false;
}

export default function GoogleAnalytics() {
  const consented = useSyncExternalStore(
    () => () => {},
    hasAnalyticsConsent,
    getServerConsent
  );

  if (!GA_ID || !consented) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy='afterInteractive'
      />
      <Script id='google-analytics' strategy='afterInteractive'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            send_page_view: true,
            cookie_flags: 'SameSite=None;Secure',
          });
        `}
      </Script>
    </>
  );
}
