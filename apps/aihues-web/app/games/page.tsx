import { cookies } from 'next/headers';
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
  const cookieStore = await cookies();
  const locale = (cookieStore.get('aihues-locale')?.value as Locale) || 'en';

  const {
    data: { games },
  } = await safeListGames({ pageSize: 20 });

  return (
    <PageShell variant='games' locale={locale}>
      <section className='page-hero'>
        <h1>🎮 {t(locale, 'section.gameCenter')}</h1>
        <p>3 mini games. Play and earn free Credits!</p>

        {/* Credit balance bar */}
        <div className='mt-4 inline-flex items-center gap-3 rounded-full border border-border bg-bg px-5 py-2.5 text-sm font-semibold text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.04)]'>
          <span className='text-lg'>🪙</span>
          <span>{t(locale, 'credit.yourCredits')}</span>
          <span className='rounded-full bg-accent px-3 py-0.5 text-sm font-bold text-white'>
            100
          </span>
        </div>

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

      {/* Credit rules collapsible panel */}
      <section className='section section--compact'>
        <details className='rounded-[14px] border border-border bg-surface'>
          <summary className='flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-semibold text-foreground select-none'>
            <span className='flex items-center gap-2'>
              <span>📋</span> {t(locale, 'credit.title')}
            </span>
            <span className='text-muted'>▼</span>
          </summary>
          <div className='grid gap-3 border-t border-border px-6 py-4 sm:grid-cols-2'>
            <div className='flex items-start gap-3'>
              <span className='mt-0.5 text-lg'>🎁</span>
              <div>
                <p className='text-sm font-semibold text-foreground'>
                  {t(locale, 'credit.initial')}
                </p>
                <p className='text-xs text-secondary'>
                  {t(locale, 'credit.initialDesc')}
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <span className='mt-0.5 text-lg'>🎮</span>
              <div>
                <p className='text-sm font-semibold text-foreground'>
                  {t(locale, 'credit.playToEarn')}
                </p>
                <p className='text-xs text-secondary'>
                  {t(locale, 'credit.playToEarnDesc')}
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <span className='mt-0.5 text-lg'>🛠️</span>
              <div>
                <p className='text-sm font-semibold text-foreground'>
                  {t(locale, 'credit.useTools')}
                </p>
                <p className='text-xs text-secondary'>
                  {t(locale, 'credit.useToolsDesc')}
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <span className='mt-0.5 text-lg'>📅</span>
              <div>
                <p className='text-sm font-semibold text-foreground'>
                  {t(locale, 'credit.dailyCheckin')}
                </p>
                <p className='text-xs text-secondary'>
                  {t(locale, 'credit.dailyCheckinDesc')}
                </p>
              </div>
            </div>
          </div>
        </details>
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
