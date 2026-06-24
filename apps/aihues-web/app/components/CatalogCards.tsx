'use client';

import Link from 'next/link';

import { type CatalogGame, type CatalogTool } from '@/lib/catalog-types';
import { t, type Locale } from '@/lib/dict';
import { GAME_CARD_COPY, gameGenre } from '@/lib/game-meta';
import { event, GA_EVENTS } from '@/lib/gtag';
import { ToolIcon } from './ToolIcon';
import { gameDetailHref, toolDetailHref } from '@/lib/routes';

/* ─────────────────────────────────────────────
   Tool card — icon + name + description
   ───────────────────────────────────────────── */
export function ToolCardV2({
  tool,
  locale = 'en',
}: {
  tool: CatalogTool;
  locale?: Locale;
}) {
  void locale;
  return (
    <Link
      className='card-lift group relative flex h-full cursor-pointer flex-col rounded-[16px] border border-border bg-surface p-[22px] text-inherit no-underline'
      href={toolDetailHref(tool.slug)}
      onClick={() => {
        event(GA_EVENTS.toolClick, {
          tool: tool.slug,
          category: tool.category,
          name: tool.name,
        });
      }}
    >
      {/* icon-wrap */}
      <div className='mb-3 flex h-[42px] w-[42px] items-center justify-center rounded-[11px] border border-border bg-surface text-secondary transition-colors duration-200 group-hover:border-accent/30 group-hover:bg-accent-bg group-hover:text-accent'>
        <ToolIcon slug={tool.slug} size={20} />
      </div>

      <h3 className='mb-1 line-clamp-1 text-[15px] font-semibold leading-tight text-foreground'>
        {tool.name}
      </h3>
      <p className='m-0 line-clamp-2 text-[12px] leading-[1.45] text-secondary'>
        {tool.description}
      </p>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Game card — matches reference: centered,
   large emoji, gradient play button
   ───────────────────────────────────────────── */
export function GameCard({
  game,
  locale = 'en',
}: {
  game: CatalogGame;
  locale?: Locale;
}) {
  const genre = gameGenre(game.slug);
  const copy = GAME_CARD_COPY[game.slug];
  const zh = locale === 'zh';

  return (
    <Link
      className='card-lift relative flex h-full cursor-pointer flex-col rounded-[16px] border border-border bg-surface px-7 py-7 text-center text-inherit no-underline'
      href={gameDetailHref(game.slug)}
      onClick={() => {
        event(GA_EVENTS.gamePlay, {
          game: game.slug,
          name: game.name,
        });
      }}
    >
      {/* Badge — same genre taxonomy as the Game Center filter */}
      <span className='absolute right-4 top-4 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white'>
        {genre}
      </span>

      <span className='mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-bg text-accent'>
        <ToolIcon slug={game.slug} size={24} />
      </span>
      <h3 className='mb-1.5 line-clamp-1 text-[18px] font-bold text-foreground'>
        {game.name}
      </h3>
      <p className='mb-4 line-clamp-2 text-[13px] leading-relaxed text-secondary'>
        {game.description}
      </p>

      {/* Meta row */}
      {copy && (
        <p className='mb-4 line-clamp-1 text-[12px] leading-relaxed text-muted'>
          {zh ? copy.metaZh : copy.meta}
        </p>
      )}

      <span className='btn-cta btn-cta--sm mt-auto self-center'>
        {copy ? (zh ? copy.ctaZh : copy.cta) : t(locale, 'game.play')}
      </span>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Empty state / API notice
   ───────────────────────────────────────────── */
export function EmptyState({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <div className='empty-state'>
      <h2>{title}</h2>
      <p>{detail}</p>
    </div>
  );
}

export function ApiNotice({ error }: { error: Error | null }) {
  // The catalog falls back to the bundled tool list when the live API is
  // absent (e.g. static deploys), so an "unavailable" banner just reads as
  // broken even though the page works. Keep the prop, surface nothing.
  void error;
  return null;
}
