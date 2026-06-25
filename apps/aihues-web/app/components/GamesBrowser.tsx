'use client';

import { useState } from 'react';

import { GameCard } from '@/components/CatalogCards';
import { FilterPills } from '@/components/FilterPills';
import type { CatalogGame } from '@/lib/catalog-types';
import type { Locale } from '@/lib/dict';
import { GAME_GENRES, gameGenre, type GameGenre } from '@/lib/game-meta';

const FILTERS = ['All', ...GAME_GENRES] as const;
type Filter = (typeof FILTERS)[number];

export default function GamesBrowser({
  games,
  locale = 'en',
  initialGenre,
}: {
  games: CatalogGame[];
  locale?: Locale;
  initialGenre?: string;
}) {
  const [active, setActive] = useState<Filter>(
    initialGenre && (GAME_GENRES as readonly string[]).includes(initialGenre)
      ? (initialGenre as Filter)
      : 'All'
  );

  const visible =
    active === 'All'
      ? games
      : games.filter((g) => gameGenre(g.slug) === (active as GameGenre));

  const count = (g: Filter) =>
    g === 'All'
      ? games.length
      : games.filter((x) => gameGenre(x.slug) === (g as GameGenre)).length;

  return (
    <div className='mx-auto w-full max-w-[1320px] px-6'>
      <FilterPills
        ariaLabel='Game genres'
        className='mb-6'
        activeKey={active}
        onSelect={(k) => setActive(k as Filter)}
        items={FILTERS.map((g) => ({ key: g, label: g, count: count(g) }))}
      />

      <div className='games-grid pb-16'>
        {visible.map((game) => (
          <GameCard game={game} key={game.id} locale={locale} />
        ))}
      </div>
    </div>
  );
}
