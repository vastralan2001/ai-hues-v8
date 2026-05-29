import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { I18nProvider } from '@/lib/i18n';
import type { Locale } from '@/lib/dict';

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

  return (
    <html lang={locale === 'zh' ? 'zh-CN' : 'en'}>
      <body>
        <I18nProvider initialLocale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
