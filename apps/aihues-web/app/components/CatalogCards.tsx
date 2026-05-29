import Link from 'next/link';

import type {
  CatalogGame,
  CatalogTool,
  ToolCategoryKey,
} from '@/lib/catalog-types';
import { toolCategories } from '@/lib/catalog-types';
import {
  gameDetailHref,
  toolDetailHref,
  toolsCategoryHref,
} from '@/lib/routes';

/* ─────────────────────────────────────────────
   Tool card  — matches reference site design
   Icon-wrap turns gradient on hover, NEW badge
   ───────────────────────────────────────────── */
export function ToolCard({
  tool,
  showNew = false,
}: {
  tool: CatalogTool;
  showNew?: boolean;
}) {
  return (
    <Link
      className='group relative block cursor-pointer rounded-[14px] border border-border bg-bg p-[22px] text-inherit no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-light hover:shadow-[0_4px_12px_rgba(109,40,217,0.12),0_8px_32px_rgba(0,0,0,0.08)]'
      href={toolDetailHref(tool.slug)}
    >
      {/* NEW badge */}
      {showNew && (
        <span className='absolute right-3 top-3 rounded-full bg-accent px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white'>
          NEW
        </span>
      )}

      {/* Icon */}
      <div
        className='mb-3 flex h-[42px] w-[42px] items-center justify-center rounded-[11px] border border-border bg-surface text-xl transition-all duration-200 group-hover:border-transparent group-hover:text-white'
        style={
          {
            // gradient applied via JS so it can be toggled on hover via Tailwind
          }
        }
      >
        <span
          className='transition-all duration-200 group-hover:[filter:brightness(10)]'
          style={{ display: 'contents' }}
        >
          {tool.icon}
        </span>
      </div>

      {/* Text */}
      <h3 className='mb-1 text-[15px] font-semibold leading-tight text-foreground'>
        {tool.name}
      </h3>
      <p className='m-0 text-[12px] leading-[1.45] text-secondary'>
        {tool.description}
      </p>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Tool card with hover-gradient icon
   Uses CSS group hack for the icon background
   ───────────────────────────────────────────── */
export function ToolCardV2({
  tool,
  showNew = false,
}: {
  tool: CatalogTool;
  showNew?: boolean;
}) {
  return (
    <Link
      className='group relative block cursor-pointer rounded-[14px] border border-border bg-bg p-[22px] text-inherit no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-light hover:shadow-[0_4px_12px_rgba(109,40,217,0.12),0_8px_32px_rgba(0,0,0,0.08)]'
      href={toolDetailHref(tool.slug)}
    >
      {showNew && (
        <span className='absolute right-3 top-3 rounded-full bg-accent px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white'>
          NEW
        </span>
      )}

      {/* icon-wrap: bg becomes accent gradient on hover */}
      <div className='mb-3 flex h-[42px] w-[42px] items-center justify-center rounded-[11px] border border-border bg-surface text-xl transition-all duration-200 group-hover:border-transparent group-hover:[background:linear-gradient(135deg,#6d28d9,#8b5cf6)]'>
        {tool.icon}
      </div>

      <h3 className='mb-1 text-[15px] font-semibold leading-tight text-foreground'>
        {tool.name}
      </h3>
      <p className='m-0 text-[12px] leading-[1.45] text-secondary'>
        {tool.description}
      </p>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Game card — matches reference: centered,
   large emoji, gradient play button
   ───────────────────────────────────────────── */
const GAME_PLAY_LABELS: Record<string, string> = {
  'daily-luck': 'Draw Now →',
  'slot-machine': 'Spin Now →',
  basketball: 'Play Now →',
};

const GAME_BADGES: Record<string, string> = {
  'daily-luck': 'DAILY',
  'slot-machine': 'POPULAR',
  basketball: 'SKILL',
};

const GAME_META: Record<string, string> = {
  'daily-luck': '🧧 30 fortunes  🪙 +10 Credits  🔥 Streak bonus',
  'slot-machine': '🎰 3×3 reels  🆓 3 spins/day  🏆 Leaderboard',
  basketball: '⏱️ 60 seconds  🏀 Physics  🏆 Leaderboard',
};

export function GameCard({ game }: { game: CatalogGame }) {
  const playLabel = GAME_PLAY_LABELS[game.slug] ?? 'Play Now →';
  const badge = GAME_BADGES[game.slug];
  const meta = GAME_META[game.slug];

  return (
    <Link
      className='relative block cursor-pointer rounded-[14px] border border-border bg-bg px-7 py-7 text-center text-inherit no-underline transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(109,40,217,0.12),0_8px_32px_rgba(0,0,0,0.08)]'
      href={gameDetailHref(game.slug)}
    >
      {/* Badge */}
      {badge && (
        <span className='absolute right-4 top-4 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white'>
          {badge}
        </span>
      )}

      <span className='mb-3 block text-[48px] leading-none'>{game.icon}</span>
      <h3 className='mb-1.5 text-[18px] font-bold text-foreground'>
        {game.name}
      </h3>
      <p className='mb-4 text-[13px] leading-relaxed text-secondary'>
        {game.description}
      </p>

      {/* Meta row */}
      {meta && (
        <p className='mb-4 text-[12px] leading-relaxed text-muted'>{meta}</p>
      )}

      <span
        className='inline-block rounded-[10px] px-7 py-[11px] text-[14px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(109,40,217,0.35)]'
        style={{ background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)' }}
      >
        {playLabel}
      </span>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Category pills (tools page filter bar)
   ───────────────────────────────────────────── */
export function CategoryPills({
  active,
  q,
  counts,
}: {
  active: ToolCategoryKey;
  q?: string;
  counts?: Record<ToolCategoryKey, number>;
}) {
  const labels: Record<ToolCategoryKey, string> = {
    all: 'All',
    developer: '🛠️ Dev',
    utility: '✍️ Utility',
    'ai-writing': '🤖 AI Writing',
  };

  return (
    <div className='category-pills' aria-label='Tool categories'>
      {toolCategories.map((category) => {
        const href = toolsCategoryHref(category.key, q);
        const count = counts?.[category.key];

        return (
          <Link
            aria-current={active === category.key ? 'page' : undefined}
            className='category-pill'
            href={href}
            key={category.key}
          >
            <span>
              {labels[category.key]}
              {count != null && count > 0 ? (
                <strong style={{ marginLeft: 6, color: 'var(--color-accent)' }}>
                  {count}
                </strong>
              ) : null}
            </span>
          </Link>
        );
      })}
    </div>
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
  if (!error) return null;

  return (
    <div className='api-notice' role='status'>
      <strong>Catalog API unavailable.</strong>
      <span>{error.message}</span>
    </div>
  );
}
