import Link from 'next/link';

import { ToolCardV2 } from '@/components/CatalogCards';
import HeroSearch from '@/components/HeroSearch';
import { PageShell } from '@/components/SiteChrome';
import { ToolIcon } from '@/components/ToolIcon';
import type { CatalogGame } from '@/lib/catalog-api';
import { safeListGames, safeListTools } from '@/lib/catalog-api';
import { t, type Locale } from '@/lib/dict';
import {
  gameDetailHref,
  gamesHref,
  toolDetailHref,
  toolsCategoryHref,
  toolsHref,
  wishlistHref,
} from '@/lib/routes';

// Revalidate every 60s so the catalog stays fresh without forcing SSR on every hit.
export const revalidate = 60;

/* ── Static category data with icons & sample tags ── */
const HOME_CATEGORIES = (locale: Locale) => [
  {
    key: 'utility',
    letter: 'U',
    label: t(locale, 'cat.utility'),
    count: 0,
    desc: t(locale, 'cat.utilityDesc'),
    tags: ['Word Count', 'Fullwidth', 'Readability'],
    href: toolsCategoryHref('utility'),
  },
  {
    key: 'developer',
    letter: 'D',
    label: t(locale, 'cat.developer'),
    count: 0,
    desc: t(locale, 'cat.developerDesc'),
    tags: ['JWT', 'JSON', 'Regex', 'QR Code'],
    href: toolsCategoryHref('developer'),
  },
  {
    key: 'ai-writing',
    letter: 'A',
    label: t(locale, 'cat.aiWriting'),
    count: 0,
    desc: t(locale, 'cat.aiWritingDesc'),
    tags: ['X Post', 'Blog', 'SEO', 'TL;DR'],
    href: toolsCategoryHref('ai-writing'),
  },
  {
    key: 'games',
    letter: 'G',
    label: t(locale, 'cat.games'),
    count: 0,
    desc: t(locale, 'cat.gamesDesc'),
    tags: ['Fortune', 'Slots', 'Hoops'],
    href: gamesHref,
  },
];

/* ── Category card themes ── */
const CATEGORY_THEMES: Record<
  string,
  { gradient: string; bg: string; fg: string }
> = {
  utility: {
    gradient: 'linear-gradient(90deg, #6a9bcc, #8ab4d9)',
    bg: 'rgba(106, 155, 204, 0.12)',
    fg: '#4a7aa8',
  },
  developer: {
    gradient: 'linear-gradient(90deg, #788c5d, #9aad7d)',
    bg: 'rgba(120, 140, 93, 0.12)',
    fg: '#5c6e45',
  },
  'ai-writing': {
    gradient: 'linear-gradient(90deg, #d97757, #e79b7d)',
    bg: 'rgba(217, 119, 87, 0.12)',
    fg: '#b55d3d',
  },
  games: {
    gradient: 'linear-gradient(90deg, #c7a24c, #dec06e)',
    bg: 'rgba(199, 162, 76, 0.12)',
    fg: '#9a7d38',
  },
};

/* ── Quick search tags ── */
const QUICK_TAG_LINKS: { label: string; href: string }[] = [
  { label: 'JWT', href: '/tools/jwt' },
  { label: 'JSON', href: '/tools/json' },
  { label: 'Regex', href: '/tools/regex' },
  { label: 'QR Code', href: '/tools/qrcode' },
  { label: 'Fortune', href: '/games/daily-luck' },
  { label: 'Hoops', href: '/games/basketball' },
];

// Featured highlights (editor-curated until analytics API provides rankings)
const POPULAR_HIGHLIGHTS = (locale: Locale) => [
  {
    href: toolDetailHref('jwt'),
    kicker: `${t(locale, 'cat.developer')}`,
    title: 'JWT Parser — Dev Essential',
    description:
      'One-click JWT decode with expiry detection & JSON highlighting',
    metrics: 'Decode · Verify · Expiry',
  },
  {
    href: toolDetailHref('json'),
    kicker: `${t(locale, 'cat.developer')}`,
    title: 'JSON Formatter — Most Elegant',
    description:
      'Dark theme highlighting, collapsible tree, precise error locating',
    metrics: 'Format · Validate · Highlight',
  },
  {
    href: gameDetailHref('daily-luck'),
    kicker: `${t(locale, 'cat.games')}`,
    title: 'Daily Fortune — Retention King',
    description: '30 wisdom quotes, 3D card flip, streak rewards & confetti',
    metrics: 'Fortune · Streak · Rewards',
  },
];

const HOME_GAME_ACTIONS: Record<string, string> = {
  'daily-luck': 'game.draw',
  'slot-machine': 'game.spin',
  basketball: 'game.play',
};

const HOME_GAME_DESCRIPTIONS: Record<string, string> = {
  'daily-luck': 'game.dailyLuckDesc',
  'slot-machine': 'game.slotMachineDesc',
  basketball: 'game.basketballDesc',
};

const HOME_GAME_META: Record<string, string> = {
  'daily-luck': '30 fortunes · Daily draw · Streak bonus',
  'slot-machine': '3×3 reels · 3 spins/day · Leaderboard',
  basketball: '60 seconds · Physics · Leaderboard',
};

const HOME_DEVELOPER_SLUGS = [
  'jwt',
  'json',
  'regex',
  'uuid',
  'timestamp',
  'markdown',
  'qrcode',
];

const HOME_WRITING_SLUGS = [
  'word-count',
  'diff',
  'fullwidth',
  'readability',
  'humanize',
  'x-post',
  'seo-title',
];

function HomeGameCard({ game, locale }: { game: CatalogGame; locale: Locale }) {
  const playLabelKey = HOME_GAME_ACTIONS[game.slug] ?? 'game.play';
  const meta = HOME_GAME_META[game.slug];

  return (
    <Link
      className='relative block cursor-pointer rounded-[16px] border border-border bg-surface px-6 py-6 text-center text-inherit no-underline transition-all duration-200 hover:border-border-strong'
      href={gameDetailHref(game.slug)}
    >
      <span className='mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-bg text-accent'>
        <ToolIcon slug={game.slug} size={24} />
      </span>
      <h3 className='mb-2 text-[18px] font-bold text-foreground'>
        {game.name}
      </h3>
      <p className='mb-4 text-[13px] leading-relaxed text-secondary'>
        {t(locale, HOME_GAME_DESCRIPTIONS[game.slug]) ?? game.description}
      </p>

      {meta && (
        <p className='mb-4 text-[12px] leading-relaxed text-muted'>{meta}</p>
      )}

      <span className='inline-block rounded-[12px] bg-accent px-6 py-3 text-[14px] font-medium text-white transition-all hover:bg-accent-light'>
        {t(locale, playLabelKey)}
      </span>
    </Link>
  );
}

export default async function HomePage() {
  const locale = 'en' as Locale;

  const [
    {
      data: { tools },
    },
    {
      data: { games },
    },
  ] = await Promise.all([
    safeListTools({ pageSize: 100 }),
    safeListGames({ pageSize: 20 }),
  ]);

  const categoryCounts = {
    utility: tools.filter((tool) => tool.category === 'utility').length,
    developer: tools.filter((tool) => tool.category === 'developer').length,
    'ai-writing': tools.filter((tool) => tool.category === 'ai-writing').length,
    games: games.length,
  };

  const stats = [
    { num: String(tools.length || 0), label: t(locale, 'stats.aiTools') },
    {
      num: String(categoryCounts.developer || 0),
      label: t(locale, 'stats.devTools'),
    },
    { num: String(games.length || 0), label: t(locale, 'stats.games') },
  ];

  const homeDevTools = HOME_DEVELOPER_SLUGS.map((slug) =>
    tools.find((tool) => tool.slug === slug)
  ).filter((tool) => tool != null);

  const homeWritingTools = HOME_WRITING_SLUGS.map((slug) =>
    tools.find((tool) => tool.slug === slug)
  ).filter((tool) => tool != null);

  const categories = HOME_CATEGORIES(locale);
  const popularHighlights = POPULAR_HIGHLIGHTS(locale);

  return (
    <PageShell variant='home' locale={locale}>
      <div>
        {/* ══════════════════════════════════════════════
            HERO
            ══════════════════════════════════════════════ */}
        <section className='relative overflow-hidden px-6 pb-12 pt-[72px] text-center'>
          {/* Ambient background */}
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-0 -z-10'
            style={{
              background:
                'radial-gradient(ellipse 90% 70% at 50% 0%, rgba(217,119,87,0.14), transparent 55%), radial-gradient(ellipse 70% 50% at 50% 100%, rgba(106,155,204,0.10), transparent 50%)',
            }}
          />

          <div className='relative mx-auto max-w-[760px]'>
            {/* Pill kicker */}
            <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm'>
              <span className='inline-block h-2 w-2 rounded-full bg-accent' />
              <span className='text-[12px] font-semibold uppercase tracking-wider text-secondary'>
                {locale === 'zh' ? '为创造者精选' : 'Curated for makers'}
              </span>
            </div>

            {/* Main headline — large, warm, editorial, single line */}
            <h1 className='hero-title mb-5 text-foreground'>
              {locale === 'zh' ? (
                <>
                  你的全能<span className='text-accent'>AI 工具箱</span>
                </>
              ) : (
                <>
                  Your all-in-one{' '}
                  <span className='text-accent'>AI toolkit.</span>
                </>
              )}
            </h1>

            {/* Hidden: subtitle removed to lift the search dialog
            <p className='mx-auto mb-8 max-w-[540px] text-base leading-relaxed text-secondary'>
              {locale === 'zh'
                ? '57 款精选工具 + 3 个轻量小游戏，无需注册，打开即用。'
                : '57 curated tools + 3 mini games. No signup, no paywall — just open and use.'}
            </p>
            */}

            {/* Search box */}
            <HeroSearch
              searchPlaceholder={t(locale, 'hero.searchPlaceholder')}
              askAILabel={t(locale, 'hero.askAI')}
            />

            {/* Quick-tag chips */}
            <div className='mt-5 flex flex-wrap justify-center gap-2'>
              {QUICK_TAG_LINKS.map((tag) => (
                <Link
                  key={tag.label}
                  className='rounded-full border border-border bg-white px-4 py-2 text-[13px] font-medium text-secondary shadow-sm transition-all hover:-translate-y-0.5 hover:border-border-strong hover:text-foreground hover:shadow-md'
                  href={tag.href}
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            BROWSE BY CATEGORY
            ══════════════════════════════════════════════ */}
        <section className='mx-auto max-w-[1300px] px-8 pb-12' id='categories'>
          <div className='mb-6 flex items-center justify-between'>
            <h2 className='text-[20px] font-bold'>
              {t(locale, 'categories.title')}
            </h2>
            <Link
              className='text-[14px] font-semibold text-accent transition-colors hover:text-accent-light'
              href={toolsHref}
            >
              {t(locale, 'categories.seeAll')}
            </Link>
          </div>

          <div className='grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[540px]:grid-cols-1'>
            {categories.map((cat) => {
              const theme = CATEGORY_THEMES[cat.key];
              return (
                <Link
                  key={cat.key}
                  className='group relative block cursor-pointer overflow-hidden rounded-[20px] border border-border bg-white p-4 text-inherit no-underline shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-lg'
                  href={cat.href}
                >
                  {/* Decorative top accent */}
                  <div
                    aria-hidden='true'
                    className='absolute inset-x-0 top-0 h-1 opacity-60 transition-opacity group-hover:opacity-100'
                    style={{ background: theme.gradient }}
                  />

                  {/* Header row */}
                  <div className='mb-3 flex items-center gap-3'>
                    <span
                      className='flex h-9 w-9 items-center justify-center rounded-[10px] text-[13px] font-bold transition-transform duration-300 group-hover:scale-110'
                      style={{
                        background: theme.bg,
                        color: theme.fg,
                      }}
                    >
                      {cat.letter}
                    </span>
                    <span className='flex-1 text-[16px] font-bold text-foreground'>
                      {cat.label}
                    </span>
                    <span className='rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-muted'>
                      {categoryCounts[cat.key as keyof typeof categoryCounts] ||
                        cat.count}
                    </span>
                  </div>

                  {/* Description */}
                  <p className='mb-4 text-[13px] leading-relaxed text-foreground/70'>
                    {cat.desc}
                  </p>

                  {/* Sample tags */}
                  <div className='flex flex-wrap gap-1'>
                    {cat.tags.map((tag) => (
                      <span
                        key={tag}
                        className='rounded-[6px] border border-border bg-surface px-2 py-0.5 text-[11px] text-muted transition-colors group-hover:border-border-strong group-hover:text-secondary'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            STATS BAR
            ══════════════════════════════════════════════ */}
        <div className='relative overflow-hidden border-b border-t border-border bg-surface px-8 py-8'>
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-0 opacity-40'
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, rgba(217,119,87,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 50%, rgba(106,155,204,0.08) 0%, transparent 40%)',
            }}
          />
          <div className='relative mx-auto grid max-w-[1100px] grid-cols-1 gap-8 sm:grid-cols-3'>
            {stats.map((s, index) => (
              <div key={s.label} className='text-center'>
                <div
                  className='text-[36px] font-extrabold leading-none tracking-[-0.03em] text-foreground'
                  style={{
                    background:
                      index === 0
                        ? 'linear-gradient(135deg, #d97757, #c46a4a)'
                        : index === 1
                          ? 'linear-gradient(135deg, #788c5d, #5c6e45)'
                          : 'linear-gradient(135deg, #c7a24c, #9a7d38)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {s.num}
                </div>
                <div className='mt-1.5 text-[12px] font-semibold uppercase tracking-wider text-muted'>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            DEVELOPER TOOLS – FEATURED
            ══════════════════════════════════════════════ */}
        {homeDevTools.length > 0 && (
          <section
            className='mx-auto max-w-[1300px] px-8 py-12'
            id='featured-dev-tools'
          >
            <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
              <div>
                <div className='mb-2 text-[11px] font-extrabold uppercase tracking-wider text-accent'>
                  {t(locale, 'section.featured')}
                </div>
                <h2 className='text-[24px] font-bold tracking-[-0.5px]'>
                  {t(locale, 'section.devTools')}
                </h2>
              </div>
              <div className='flex items-center gap-3'>
                <span className='rounded-full border border-border bg-bg px-3.5 py-1.5 text-[14px] text-muted'>
                  {categoryCounts.developer} {t(locale, 'section.tools')}
                </span>
                <Link
                  className='text-[14px] font-medium text-foreground underline underline-offset-4 hover:text-accent'
                  href={toolsCategoryHref('developer')}
                >
                  {t(locale, 'section.allTools')}
                </Link>
              </div>
            </div>

            <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3'>
              {homeDevTools.map((tool) => (
                <ToolCardV2 key={tool.id} locale={locale} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════
            WRITING TOOLS – FEATURED
            ══════════════════════════════════════════════ */}
        {homeWritingTools.length > 0 && (
          <section className='mx-auto max-w-[1300px] px-8 pb-12'>
            <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
              <div>
                <div className='mb-2 text-[11px] font-extrabold uppercase tracking-wider text-accent'>
                  {t(locale, 'section.featured')}
                </div>
                <h2 className='text-[24px] font-bold tracking-[-0.5px]'>
                  {t(locale, 'section.writingTools')}
                </h2>
              </div>
              <div className='flex items-center gap-3'>
                <span className='rounded-full border border-border bg-bg px-3.5 py-1.5 text-[14px] text-muted'>
                  {categoryCounts['ai-writing']} {t(locale, 'section.tools')}
                </span>
                <Link
                  className='text-[14px] font-medium text-foreground underline underline-offset-4 hover:text-accent'
                  href={toolsCategoryHref('ai-writing')}
                >
                  {t(locale, 'section.allTools')}
                </Link>
              </div>
            </div>

            <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3'>
              {homeWritingTools.map((tool) => (
                <ToolCardV2 key={tool.id} locale={locale} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════
            GAME CENTER
            ══════════════════════════════════════════════ */}
        <section
          className='border-t border-border px-8 py-12'
          id='games'
          style={{ background: 'var(--color-surface)' }}
        >
          <div className='mx-auto max-w-[1300px]'>
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='text-[24px] font-bold tracking-[-0.5px]'>
                {t(locale, 'section.gameCenter')}
              </h2>
              <Link
                className='text-[14px] font-semibold text-accent hover:text-accent-light'
                href={gamesHref}
              >
                {t(locale, 'section.viewAll')}
              </Link>
            </div>

            <div className='grid grid-cols-3 gap-4 max-[760px]:grid-cols-1'>
              {games.map((game) => (
                <HomeGameCard game={game} key={game.id} locale={locale} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            POPULAR TOOLS  (first 3 across all categories)
            ══════════════════════════════════════════════ */}
        <section className='mx-auto max-w-[1300px] px-8 py-12'>
          <div className='mb-6 flex items-end justify-between'>
            <h2 className='text-[24px] font-bold tracking-[-0.5px]'>
              {t(locale, 'section.popularTools')}
            </h2>
            <Link
              className='text-[14px] font-semibold text-accent hover:text-accent-light'
              href={toolsHref}
            >
              {t(locale, 'section.viewAll')}
            </Link>
          </div>

          <div className='grid grid-cols-3 gap-4 max-[760px]:grid-cols-1'>
            {popularHighlights.map((item) => (
              <Link
                key={item.href}
                className='flex cursor-pointer flex-col gap-2 rounded-[16px] border border-border bg-surface p-5 text-inherit no-underline transition-all hover:border-border-strong'
                href={item.href}
              >
                <div className='text-[11px] font-extrabold uppercase tracking-wider text-accent'>
                  {item.kicker}
                </div>
                <div className='text-[15px] font-bold text-foreground'>
                  {item.title}
                </div>
                <p className='m-0 text-[13px] text-secondary'>
                  {item.description}
                </p>
                <p className='m-0 text-[12px] font-semibold text-muted'>
                  {item.metrics}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            DUAL ENGINE CTA BANNER
            ══════════════════════════════════════════════ */}
        <section className='mx-auto max-w-[1300px] px-8 pb-12'>
          <div className='flex flex-wrap items-center justify-between gap-4 rounded-[16px] border border-border bg-surface px-8 py-6'>
            <div>
              <div className='mb-1 flex flex-wrap gap-2'>
                <span className='rounded-full bg-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted'>
                  DEV
                </span>
                <span className='rounded-full bg-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted'>
                  GAMES
                </span>
              </div>
              <h3 className='mb-1 text-[20px] font-semibold text-foreground'>
                {t(locale, 'section.dualEngine')}
              </h3>
              <p className='m-0 text-[14px] text-muted'>
                {t(locale, 'section.dualEngineDesc')}
              </p>
            </div>
            <Link
              className='flex items-center gap-2 rounded-[12px] bg-accent px-6 py-3 text-[14px] font-medium text-white transition-all hover:bg-accent-light'
              href={toolsHref}
            >
              {t(locale, 'section.browseAll')}
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            WISHLIST CTA
            ══════════════════════════════════════════════ */}
        <section className='border-t border-border px-8 py-16 text-center'>
          <div className='mx-auto max-w-[560px]'>
            <h2 className='mb-3 text-[24px] font-bold tracking-[-0.5px] text-foreground'>
              {t(locale, 'section.wishlistTitle')}
            </h2>
            <p className='mb-6 text-[16px] text-muted'>
              {t(locale, 'section.wishlistDesc')}
            </p>
            <Link
              className='inline-flex items-center gap-2 rounded-[12px] bg-accent px-7 py-3.5 text-[15px] font-medium text-white transition-all hover:bg-accent-light'
              href={wishlistHref}
            >
              {t(locale, 'section.submitIdea')}
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
