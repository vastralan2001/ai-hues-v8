import type { Metadata } from 'next';

import { GameCard } from '@/components/CatalogCards';
import { PageShell } from '@/components/SiteChrome';
import { safeListGames } from '@/lib/catalog-api';

export const metadata: Metadata = {
  title: 'Games',
};

export const dynamic = 'force-dynamic';

export default async function GamesPage() {
  const {
    data: { games },
  } = await safeListGames({ pageSize: 20 });

  return (
    <PageShell variant='games'>
      <section className='page-hero'>
        <h1>🎮 Game Center</h1>
        <p>3 mini games. Play and earn free Credits!</p>

        {/* Stats badges */}
        <div className='game-stats-row'>
          <div className='game-stat-badge'>
            <span className='game-stat-badge__num'>3</span>
            <span className='game-stat-badge__label'>Games</span>
          </div>
          <div className='game-stat-badge'>
            <span className='game-stat-badge__num'>∞</span>
            <span className='game-stat-badge__label'>Free Play</span>
          </div>
          <div className='game-stat-badge'>
            <span className='game-stat-badge__icon'>🪙</span>
            <span className='game-stat-badge__label'>Earn Credits</span>
          </div>
        </div>
      </section>

      <section className='section section--compact'>
        <div className='games-grid'>
          {games.map((game) => (
            <GameCard game={game} key={game.id} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
