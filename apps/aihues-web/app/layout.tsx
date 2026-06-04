import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { I18nProvider } from '@/lib/i18n';
import { ThemeProvider } from '@/lib/theme';
import type { Locale } from '@/lib/dict';
import type { Theme } from '@/lib/theme';
import CommandPalette from '@/components/CommandPalette';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { PageDurationTracker } from '@/components/PageDurationTracker';

import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale =
    (cookieStore.get('aihues-locale')?.value as Locale | undefined) || 'en';

  const isZh = locale === 'zh';

  return {
    title: {
      default: isZh
        ? 'AIHues — 找到你的 AI vibe'
        : 'AIHues — Find your AI vibe',
      template: isZh ? '%s - AIHues' : '%s - AIHues',
    },
    description: isZh
      ? 'AI 工具、小游戏和实用工具导航平台。'
      : 'AI tools and lightweight games powered by the AIHues catalog API.',
  };
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const locale: Locale =
    (cookieStore.get('aihues-locale')?.value as Locale | undefined) || 'en';
  const theme: Theme =
    (cookieStore.get('aihues-theme')?.value as Theme | undefined) || 'light';

  return (
    <html data-theme={theme} lang={locale === 'zh' ? 'zh-CN' : 'en'}>
      <head>
        <GoogleAnalytics />
        <link rel='manifest' href='/manifest.json' />
        <link rel='icon' href='/favicon.ico' sizes='any' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <meta name='theme-color' content='#b45309' />
      </head>
      <body>
        <I18nProvider initialLocale={locale}>
          <ThemeProvider initialTheme={theme}>
            {children}
            <CommandPalette />
            <PageDurationTracker />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
