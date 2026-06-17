import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Noto_Sans } from 'next/font/google';

import { I18nProvider } from '@/lib/i18n';
import CommandPalette from '@/components/CommandPalette';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import CookieConsent from '@/components/CookieConsent';
import { PageDurationTracker } from '@/components/PageDurationTracker';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans',
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
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: './',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' className={`${notoSans.variable}`}>
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
