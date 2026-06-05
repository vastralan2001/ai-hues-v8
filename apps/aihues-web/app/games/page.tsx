import type { Metadata } from 'next';

import { GameCard } from '@/components/CatalogCards';
import { PageShell } from '@/components/SiteChrome';
import { safeListGames } from '@/lib/catalog-api';
import { t, type Locale } from '@/lib/dict';

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
      <section className='page-hero'>
        <h1>{t(locale, 'section.gameCenter')}</h1>
        <p>
          {locale === 'zh'
            ? `${games.length} 款轻量小游戏，打开即玩。`
            : `${games.length} mini games. Open and play.`}
        </p>

        {/* Stats badges */}
        <div className='game-stats-row'>
          <div className='game-stat-badge'>
            <span className='game-stat-badge__num'>{games.length}</span>
            <span className='game-stat-badge__label'>
              {locale === 'zh' ? '游戏' : 'Games'}
            </span>
          </div>
          <div className='game-stat-badge'>
            <span className='game-stat-badge__num'>∞</span>
            <span className='game-stat-badge__label'>
              {locale === 'zh' ? '免费游玩' : 'Free Play'}
            </span>
          </div>
        </div>
      </section>

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
