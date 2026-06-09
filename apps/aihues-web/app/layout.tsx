import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Noto_Sans } from 'next/font/google';

import { I18nProvider } from '@/lib/i18n';
import CommandPalette from '@/components/CommandPalette';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { PageDurationTracker } from '@/components/PageDurationTracker';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans',
  display: 'swap',
});

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'AIHues — Find your AI vibe',
    template: '%s - AIHues',
  },
  description:
    'AI tools and lightweight games powered by the AIHues catalog API.',
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
        </I18nProvider>
      </body>
    </html>
  );
}
