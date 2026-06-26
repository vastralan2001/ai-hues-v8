import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Noto_Sans, Saira } from 'next/font/google';

import { I18nProvider } from '@/lib/i18n';
import CommandPalette from '@/components/CommandPalette';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import CookieConsent from '@/components/CookieConsent';
import { PageDurationTracker } from '@/components/PageDurationTracker';

// ── Fonts — the ONE place to swap a face. Each loads to a raw CSS variable;
//    globals.css @theme wraps it with a functional fallback chain. ──
// Body face (long-form reading).
const bodyFont = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body-src',
  display: 'swap',
});

// Display face (headings + brand chrome). Saira (OFL) stands in for the
// non-commercial Radiance — sturdier and less condensed than Rajdhani. Swap
// this import + call to try another face; nothing else changes.
const displayFont = Saira({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display-src',
  display: 'swap',
});

import './globals.css';

const SITE_TITLE = 'AIHues — Find your AI vibe';
const SITE_DESCRIPTION =
  'AI tools and lightweight games powered by the AIHues catalog API.';
const BASE_URL = 'https://aihues.com';

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: '%s - AIHues',
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: BASE_URL,
    siteName: 'AIHues',
    locale: 'en_US',
    type: 'website',
    images: ['/icon-512.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/icon-512.png'],
  },
  alternates: {
    canonical: './',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' className={`${bodyFont.variable} ${displayFont.variable}`}>
      <head>
        <GoogleAnalytics />
        <link rel='manifest' href='/manifest.json' />
        <link rel='icon' href='/favicon.ico' sizes='any' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <meta name='theme-color' content='#d97757' />
      </head>
      <body>
        <I18nProvider initialLocale='en'>
          {children}
          <CommandPalette />
          <PageDurationTracker />
          <CookieConsent />
        </I18nProvider>
      </body>
    </html>
  );
}
