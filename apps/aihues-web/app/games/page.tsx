import type { Metadata } from 'next';

import GamesBrowser from '@/components/GamesBrowser';
import { PageMasthead } from '@/components/PageMasthead';
import { PageShell } from '@/components/SiteChrome';
import { safeListGames } from '@/lib/catalog-api';
import { type Locale } from '@/lib/dict';

export const metadata: Metadata = {
  title: 'Games',
};

export const dynamic = 'force-dynamic';

export default async function GamesPage() {
  const locale = 'en' as Locale;

  const {
    data: { games },
  } = await safeListGames({ pageSize: 20 });

  return (
    <PageShell variant='games' locale={locale}>
      <PageMasthead
        category='games'
        eyebrow='Game Center'
        title='Mini Games'
        subtitle='Open a tab, play a minute, close it. No install, just play.'
        features={['Play in one tap', 'No install', 'Quick breaks']}
      />

      <GamesBrowser games={games} locale={locale} />
    </PageShell>
  );
}
