'use client';

import Link from 'next/link';

import type {
  CatalogGame,
  CatalogTool,
  ToolCategoryKey,
} from '@/lib/catalog-api';
import { toolCategories } from '@/lib/catalog-api';
import { t, type Locale } from '@/lib/dict';
import { event, GA_EVENTS } from '@/lib/gtag';
import { ToolIcon } from './ToolIcon';
import {
  gameDetailHref,
  toolDetailHref,
  toolsCategoryHref,
} from '@/lib/routes';

/* ── Front-end pricing map (fallback when API omits price_tag) ── */
export type PriceTag = 'free' | 'freemium' | 'paid';

export const TOOL_PRICING: Record<
  string,
  { price: PriceTag; credit?: number }
> = {
  // Developer tools
  jwt: { price: 'free' },
  json: { price: 'free' },
  regex: { price: 'free' },
  uuid: { price: 'free' },
  timestamp: { price: 'free' },
  markdown: { price: 'free' },
  qrcode: { price: 'free' },
  base64: { price: 'free' },
  'url-encode': { price: 'free' },
  sha256: { price: 'free' },
  'html-entity': { price: 'free' },
  diff: { price: 'free' },
  'csv-json': { price: 'free' },
  'lorem-ipsum': { price: 'free' },
  'cron-parser': { price: 'free' },
  'http-status': { price: 'free' },
  'unit-convert': { price: 'free' },
  'git-commit': { price: 'free' },
  'code-review': { price: 'freemium', credit: 15 },
  'blog-outline': { price: 'free' },
  linkedin: { price: 'freemium', credit: 10 },
  'seo-title': { price: 'free' },
  meta: { price: 'free' },
  faq: { price: 'free' },
  newsletter: { price: 'freemium', credit: 15 },
  'cold-email': { price: 'freemium', credit: 10 },
  tagline: { price: 'free' },
  'ad-copy': { price: 'freemium', credit: 15 },
  'yt-script': { price: 'freemium', credit: 20 },
  'video-title': { price: 'free' },
  readability: { price: 'free' },
  'title-case': { price: 'free' },
  fullwidth: { price: 'free' },
  pseudo: { price: 'free' },
  sql: { price: 'free' },
  shell: { price: 'free' },
  'curl-gen': { price: 'free' },
  'code-explain': { price: 'free' },
  docs: { price: 'free' },
  'pr-desc': { price: 'free' },
  changelog: { price: 'free' },
  push: { price: 'free' },
  tldr: { price: 'free' },
  humanize: { price: 'freemium', credit: 10 },
  'alt-text': { price: 'free' },
  'lp-hero': { price: 'freemium', credit: 20 },
  'image-to-base64': { price: 'free' },
  'diff-pro': { price: 'freemium', credit: 10 },
  'base-convert': { price: 'free' },
  pomodoro: { price: 'free' },
};

export function getToolPricing(slug: string): {
  price: PriceTag;
  credit?: number;
} {
  return TOOL_PRICING[slug] ?? { price: 'free' };
}

function PriceBadge({
  price,
  locale = 'en',
}: {
  price: PriceTag;
  locale?: Locale;
}) {
  const styles: Record<PriceTag, string> = {
    free: 'text-[#5a7a4a] bg-[#f5f3ee] border-[#e8e6dc] dark:text-[#8aaa6d] dark:bg-[#2d2d2a] dark:border-[#3a3a35]',
    freemium:
      'text-[#9a6a4a] bg-[#f5f3ee] border-[#e8e6dc] dark:text-[#d4a070] dark:bg-[#2d2d2a] dark:border-[#3a3a35]',
    paid: 'text-[#8a5a5a] bg-[#f5f3ee] border-[#e8e6dc] dark:text-[#c48888] dark:bg-[#2d2d2a] dark:border-[#3a3a35]',
  };

  const labels: Record<PriceTag, Record<Locale, string>> = {
    free: { en: 'Free', zh: '免费' },
    freemium: { en: 'Freemium', zh: '免费增值' },
    paid: { en: 'Paid', zh: '付费' },
  };

  return (
    <span
      className={`rounded-md border px-2 py-px text-[11px] font-bold ${styles[price]}`}
    >
      {labels[price][locale]}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Tool card — icon, NEW badge, and price tag
   ───────────────────────────────────────────── */
export function ToolCardV2({
  tool,
  locale = 'en',
}: {
  tool: CatalogTool;
  locale?: Locale;
}) {
  // Prefer API fields; fallback to front-end map while backend migrates
  const fallback = getToolPricing(tool.slug);
  const price =
    tool.priceTag !== 'unspecified' ? tool.priceTag : fallback.price;

  return (
    <Link
      className='card-lift group relative block cursor-pointer rounded-[16px] border border-border bg-surface p-[22px] text-inherit no-underline'
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

      <h3 className='mb-1 text-[15px] font-semibold leading-tight text-foreground'>
        {tool.name}
      </h3>
      <p className='m-0 text-[12px] leading-[1.45] text-secondary'>
        {tool.description}
      </p>

      {/* Price row */}
      <div className='mt-3 flex items-center gap-2'>
        <PriceBadge price={price} locale={locale} />
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Game card — matches reference: centered,
   large emoji, gradient play button
   ───────────────────────────────────────────── */
const GAME_PLAY_LABELS: Record<string, string> = {
  'doodle-jump': 'game.jump',
  'daily-luck': 'game.draw',
  'slot-machine': 'game.spin',
  basketball: 'game.play',
};

const GAME_BADGES: Record<string, string> = {
  'doodle-jump': 'game.arcade',
  'daily-luck': 'game.fortune',
  'slot-machine': 'game.luck',
  basketball: 'game.skill',
  snake: 'game.classic',
  'color-hunt': 'game.skill',
  chess: 'game.strategy',
};

const GAME_META: Record<string, string> = {
  'doodle-jump': 'Endless · 3 difficulties · Arrows / tap',
  'daily-luck': '30 fortunes · +10 Credits · Streak bonus',
  'slot-machine': '3×3 reels · Lucky spins · +5~100 · Leaderboard',
  basketball: '60 seconds · Physics · +10~50/game · Leaderboard',
  snake: 'Endless · 3 speeds · Arrows / WASD / swipe',
  'color-hunt': 'Stages & Sprint · ΔE2000',
  chess: 'Play vs engine · Spectate · Live eval',
};

export function GameCard({
  game,
  locale = 'en',
}: {
  game: CatalogGame;
  locale?: Locale;
}) {
  const playLabelKey = GAME_PLAY_LABELS[game.slug] ?? 'game.play';
  const badgeKey = GAME_BADGES[game.slug];
  const meta = GAME_META[game.slug];

  return (
    <Link
      className='card-lift relative flex cursor-pointer flex-col rounded-[16px] border border-border bg-surface px-7 py-7 text-center text-inherit no-underline'
      href={gameDetailHref(game.slug)}
      onClick={() => {
        event(GA_EVENTS.gamePlay, {
          game: game.slug,
          name: game.name,
        });
      }}
    >
      {/* Badge */}
      {badgeKey && (
        <span className='absolute right-4 top-4 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white'>
          {t(locale, badgeKey)}
        </span>
      )}

      <span className='mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-bg text-accent'>
        <ToolIcon slug={game.slug} size={24} />
      </span>
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

      <span className='mt-auto self-center inline-block rounded-[12px] bg-accent px-7 py-[11px] text-[14px] font-medium text-white transition-all hover:bg-accent-light'>
        {t(locale, playLabelKey)}
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
    developer: 'Dev',
    utility: 'Utility',
    'ai-writing': 'AI Writing',
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
  // The catalog falls back to the bundled tool list when the live API is
  // absent (e.g. static deploys), so an "unavailable" banner just reads as
  // broken even though the page works. Keep the prop, surface nothing.
  void error;
  return null;
}
