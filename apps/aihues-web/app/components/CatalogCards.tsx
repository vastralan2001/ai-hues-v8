import Link from 'next/link';

import type {
  CatalogGame,
  CatalogTool,
  ToolCategoryKey,
} from '@/lib/catalog-api';
import { toolCategories } from '@/lib/catalog-api';
import { t, type Locale } from '@/lib/dict';
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
    free: 'text-[#059669] bg-[#ecfdf5] border-[#a7f3d0] dark:text-[#34d399] dark:bg-[#064e3b] dark:border-[#065f46]',
    freemium:
      'text-[#b45309] bg-[#fffbeb] border-[#fde68a] dark:text-[#fbbf24] dark:bg-[#451a03] dark:border-[#78350f]',
    paid: 'text-[#dc2626] bg-[#fef2f2] border-[#fecaca] dark:text-[#f87171] dark:bg-[#450a0a] dark:border-[#7f1d1d]',
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
      className='group relative block cursor-pointer rounded-[14px] border border-border bg-bg p-[22px] text-inherit no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-light hover:shadow-[0_4px_12px_rgba(180,83,9,0.12),0_8px_32px_rgba(0,0,0,0.08)]'
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
   Tool card with hover-gradient icon + price tag
   ───────────────────────────────────────────── */
export function ToolCardV2({
  tool,
  showNew = false,
  locale = 'en',
}: {
  tool: CatalogTool;
  showNew?: boolean;
  locale?: Locale;
}) {
  // Prefer API fields; fallback to front-end map while backend migrates
  const fallback = getToolPricing(tool.slug);
  const price =
    tool.priceTag !== 'unspecified' ? tool.priceTag : fallback.price;
  const credit = tool.creditCost > 0 ? tool.creditCost : (fallback.credit ?? 0);

  return (
    <Link
      className='group relative block cursor-pointer rounded-[14px] border border-border bg-bg p-[22px] text-inherit no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-light hover:shadow-[0_4px_12px_rgba(180,83,9,0.12),0_8px_32px_rgba(0,0,0,0.08)]'
      href={toolDetailHref(tool.slug)}
    >
      {showNew && (
        <span className='absolute right-3 top-3 rounded-full bg-accent px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white'>
          NEW
        </span>
      )}

      {/* icon-wrap: bg becomes accent gradient on hover */}
      <div className='mb-3 flex h-[42px] w-[42px] items-center justify-center rounded-[11px] border border-border bg-surface text-xl transition-all duration-200 group-hover:border-transparent group-hover:[background:linear-gradient(135deg,#b45309,#d97706)]'>
        {tool.icon}
      </div>

      <h3 className='mb-1 text-[15px] font-semibold leading-tight text-foreground'>
        {tool.name}
      </h3>
      <p className='m-0 text-[12px] leading-[1.45] text-secondary'>
        {tool.description}
      </p>

      {/* Price + Credit row */}
      <div className='mt-3 flex items-center gap-2'>
        <PriceBadge price={price} locale={locale} />
        {credit > 0 && (
          <span className='text-[11px] font-semibold text-accent'>
            🪙 {credit}
          </span>
        )}
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Game card — matches reference: centered,
   large emoji, gradient play button
   ───────────────────────────────────────────── */
const GAME_PLAY_LABELS: Record<string, string> = {
  'daily-luck': 'game.draw',
  'slot-machine': 'game.spin',
  basketball: 'game.play',
};

const GAME_BADGES: Record<string, string> = {
  'daily-luck': 'game.daily',
  'slot-machine': 'game.popular',
  basketball: 'game.skill',
};

const GAME_META: Record<string, string> = {
  'daily-luck': '🧧 30 fortunes  🪙 +10 Credits  🔥 Streak bonus',
  'slot-machine':
    '🎰 3×3 reels  🆓 3 spins/day  🪙 +5~100/spin  🏆 Leaderboard',
  basketball: '⏱️ 60 seconds  🏀 Physics  🪙 +10~50/game  🏆 Leaderboard',
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
      className='relative block cursor-pointer rounded-[14px] border border-border bg-bg px-7 py-7 text-center text-inherit no-underline transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(180,83,9,0.12),0_8px_32px_rgba(0,0,0,0.08)]'
      href={gameDetailHref(game.slug)}
    >
      {/* Badge */}
      {badgeKey && (
        <span className='absolute right-4 top-4 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white'>
          {t(locale, badgeKey)}
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
        className='inline-block rounded-[10px] px-7 py-[11px] text-[14px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(180,83,9,0.35)]'
        style={{ background: 'linear-gradient(135deg, #b45309, #d97706)' }}
      >
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
