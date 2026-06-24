'use client';

import Link from 'next/link';

import { type CatalogGame, type CatalogTool } from '@/lib/catalog-types';
import { t, type Locale } from '@/lib/dict';
import { GAME_CARD_COPY, gameGenre } from '@/lib/game-meta';
import { event, GA_EVENTS } from '@/lib/gtag';
import { ToolIcon } from './ToolIcon';
import { gameDetailHref, toolDetailHref } from '@/lib/routes';

/* ─────────────────────────────────────────────
   Tool card — one unified card for every tool
   category: icon tile, category chip, name, desc
   ───────────────────────────────────────────── */
const TOOL_CAT_LABEL: Record<string, string> = {
  developer: 'Dev',
  utility: 'Utility',
  'ai-writing': 'AI Writing',
  image: 'Image',
};

export function ToolCardV2({
  tool,
  locale = 'en',
}: {
  tool: CatalogTool;
  locale?: Locale;
}) {
  const catLabel = TOOL_CAT_LABEL[tool.category];
  return (
    <Link
      className='card-lift group relative flex h-full cursor-pointer flex-col rounded-[16px] border border-border bg-surface p-[22px] text-inherit no-underline transition-colors hover:border-accent/40'
      href={toolDetailHref(tool.slug)}
      onClick={() => {
        event(GA_EVENTS.toolClick, {
          tool: tool.slug,
          category: tool.category,
          name: tool.name,
        });
      }}
    >
      {catLabel ? (
        <span className='absolute right-3.5 top-3.5 rounded-full border border-border bg-white/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted backdrop-blur-sm'>
          {catLabel}
        </span>
      ) : null}

      <div className='mb-3.5 flex h-[44px] w-[44px] items-center justify-center rounded-[12px] border border-border bg-accent-bg text-accent transition-colors duration-200 group-hover:border-accent/40'>
        <ToolIcon slug={tool.slug} size={21} />
      </div>

      <h3 className='mb-1 line-clamp-1 pr-12 text-[15px] font-semibold leading-tight text-foreground'>
        {tool.name}
      </h3>
      <p className='m-0 line-clamp-2 text-[12.5px] leading-[1.5] text-secondary'>
        {tool.description}
      </p>

      <span className='mt-3.5 inline-flex items-center gap-1 text-[12px] font-semibold text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
        {locale === 'zh' ? '打开' : 'Open'}
        <span
          aria-hidden='true'
          className='transition-transform group-hover:translate-x-0.5'
        >
          →
        </span>
      </span>
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
