import type { Metadata } from 'next';

import { GameCard } from '@/components/CatalogCards';
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
        eyebrow='Game Center'
        title='Mini Games'
        subtitle={`${games.length} mini games. Open and play.`}
        stats={[
          { num: `${games.length}`, label: 'Games' },
          { num: '∞', label: 'Free play' },
        ]}
      />

      <section className='section section--compact'>
        <div className='games-grid'>
          {games.map((game) => (
            <GameCard game={game} key={game.id} locale={locale} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
