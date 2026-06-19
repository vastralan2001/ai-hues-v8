import Link from 'next/link';

import { ToolCardV2 } from '@/components/CatalogCards';
import HeroSearch from '@/components/HeroSearch';
import HeroStage from '@/components/HeroStage';
import { PageShell } from '@/components/SiteChrome';
import { type SpotlightSlide } from '@/components/SpotlightCarousel';
import { ToolIcon } from '@/components/ToolIcon';
import ToolMarquee, { type MarqueeItem } from '@/components/ToolMarquee';
import Typewriter from '@/components/Typewriter';
import type { CatalogGame } from '@/lib/catalog-api';
import { safeListGames, safeListTools } from '@/lib/catalog-api';
import { t, type Locale } from '@/lib/dict';
import { TEST_META } from '@/lib/tests';
import {
  gameDetailHref,
  gamesHref,
  testDetailHref,
  testsHref,
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
  {
    key: 'tests',
    letter: 'T',
    label: t(locale, 'cat.tests'),
    count: TEST_META.length,
    desc: t(locale, 'cat.testsDesc'),
    tags: ['SBTI', 'MBTI'],
    href: testsHref,
  },
];

/* ── Category card themes ── */
const CATEGORY_THEMES: Record<
  string,
  { gradient: string; bg: string; fg: string }
> = {
  utility: {
    gradient: '#c2502e',
    bg: 'rgba(26, 26, 25, 0.05)',
    fg: 'rgba(26, 26, 25, 0.7)',
  },
  developer: {
    gradient: '#c2502e',
    bg: 'rgba(26, 26, 25, 0.05)',
    fg: 'rgba(26, 26, 25, 0.7)',
  },
  'ai-writing': {
    gradient: '#c2502e',
    bg: 'rgba(194, 80, 46, 0.1)',
    fg: '#b1502f',
  },
  games: {
    gradient: '#c2502e',
    bg: 'rgba(26, 26, 25, 0.05)',
    fg: 'rgba(26, 26, 25, 0.7)',
  },
  tests: {
    gradient: '#c2502e',
    bg: 'rgba(194, 80, 46, 0.1)',
    fg: '#b1502f',
  },
};

/* ── Featured highlights (editor-curated until analytics API provides rankings) ── */
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
      className='card-lift group relative block cursor-pointer rounded-[16px] border border-border bg-surface px-6 py-6 text-center text-inherit no-underline'
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

      <span className='btn-cta btn-cta--sm'>{t(locale, playLabelKey)}</span>
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

  const spotlightSlides: SpotlightSlide[] = popularHighlights.map((item) => {
    const isGame = item.href.includes('/games/');
    return {
      eyebrow: item.kicker,
      title: item.title,
      description: item.description,
      metrics: item.metrics,
      href: item.href,
      cta: isGame
        ? locale === 'zh'
          ? '开始游戏'
          : 'Play now'
        : locale === 'zh'
          ? '立即使用'
          : 'Open tool',
    };
  });

  const marqueeRows: MarqueeItem[][] = [[], [], []];
  tools.forEach((tool, i) => {
    marqueeRows[i % 3].push({ slug: tool.slug, name: tool.name });
  });

  return (
    <PageShell variant='home' locale={locale}>
      <div>
        {/* ══════════════════════════════════════════════
            HERO
            ══════════════════════════════════════════════ */}
        <HeroStage
          slides={spotlightSlides}
          marquee={
            marqueeRows.some((r) => r.length > 0) ? (
              <div className='w-full'>
                <ToolMarquee rows={marqueeRows.slice(0, 2)} />
              </div>
            ) : null
          }
        >
          {/* LEFT — pitch + search */}
          <div className='min-w-0 text-center lg:text-left'>
            {/* Pill kicker */}
            <div className='mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 shadow-sm backdrop-blur-md'>
              <span className='inline-block h-2 w-2 rounded-full bg-accent' />
              <span className='text-[12px] font-semibold uppercase tracking-[0.18em] text-secondary'>
                {locale === 'zh' ? '为创造者精选' : 'Curated for makers'}
              </span>
            </div>

            {/* Main headline */}
            <h1 className='hero-title mb-6 text-foreground'>
              {locale === 'zh' ? (
                <>
                  你的全能
                  <br />
                  <Typewriter
                    className='text-accent'
                    phrases={['AI 工具箱', '开发利器', '写作工作室', '游戏厅']}
                  />
                </>
              ) : (
                <>
                  Your all-in-one
                  <br />
                  <Typewriter
                    className='text-accent'
                    phrases={[
                      'AI toolkit.',
                      'dev toolbox.',
                      'writing studio.',
                      'game arcade.',
                    ]}
                  />
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className='mx-auto mb-9 max-w-[560px] text-[19px] leading-relaxed text-secondary lg:mx-0'>
              {locale === 'zh'
                ? '58 款精选工具 + 3 个轻量小游戏，无需注册，打开即用。'
                : '58 curated tools + 3 mini games. No signup, no paywall — just open and use.'}
            </p>

            {/* Search box */}
            <HeroSearch
              searchPlaceholder={t(locale, 'hero.searchPlaceholder')}
              askAILabel={t(locale, 'hero.askAI')}
            />
          </div>
        </HeroStage>

        {/* ══════════════════════════════════════════════
            BROWSE BY CATEGORY
            ══════════════════════════════════════════════ */}
        <section
          className='mx-auto max-w-[1300px] px-8 pb-20 pt-14'
          id='categories'
        >
          <div className='mb-6 flex items-center justify-between'>
            <h2 className='text-[34px] font-extrabold tracking-[-0.02em]'>
              {t(locale, 'categories.title')}
            </h2>
            <Link
              className='text-[13px] font-bold uppercase tracking-[0.12em] text-accent transition-colors hover:text-accent-light'
              href={toolsHref}
            >
              {t(locale, 'categories.seeAll')}
            </Link>
          </div>

          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5'>
            {categories.map((cat) => {
              const theme = CATEGORY_THEMES[cat.key];
              return (
                <Link
                  key={cat.key}
                  className='card-lift group relative block cursor-pointer overflow-hidden rounded-[20px] border border-border bg-white p-4 text-inherit no-underline'
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
        <div className='relative overflow-hidden border-b border-t border-border bg-surface px-8 py-12'>
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-0 opacity-50'
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, rgba(194,80,46,0.06) 0%, transparent 55%)',
            }}
          />
          <div className='relative mx-auto grid max-w-[1100px] grid-cols-1 gap-8 sm:grid-cols-3'>
            {stats.map((s) => (
              <div key={s.label} className='text-center'>
                <div className='text-[52px] font-extrabold leading-none tracking-[-0.03em] text-accent'>
                  {s.num}
                </div>
                <div className='mt-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-muted'>
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
            className='mx-auto max-w-[1300px] px-8 py-20'
            id='featured-dev-tools'
          >
            <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
              <div>
                <div className='mb-2 text-[11px] font-extrabold uppercase tracking-wider text-accent'>
                  {t(locale, 'section.featured')}
                </div>
                <h2 className='text-[34px] font-extrabold tracking-[-0.02em]'>
                  {t(locale, 'section.devTools')}
                </h2>
              </div>
              <div className='flex items-center gap-3'>
                <span className='rounded-full border border-border bg-bg px-3.5 py-1.5 text-[14px] text-muted'>
                  {categoryCounts.developer} {t(locale, 'section.tools')}
                </span>
                <Link
                  className='text-[13px] font-bold uppercase tracking-[0.12em] text-accent transition-colors hover:text-accent-light'
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
          <section className='mx-auto max-w-[1300px] px-8 pb-20'>
            <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
              <div>
                <div className='mb-2 text-[11px] font-extrabold uppercase tracking-wider text-accent'>
                  {t(locale, 'section.featured')}
                </div>
                <h2 className='text-[34px] font-extrabold tracking-[-0.02em]'>
                  {t(locale, 'section.writingTools')}
                </h2>
              </div>
              <div className='flex items-center gap-3'>
                <span className='rounded-full border border-border bg-bg px-3.5 py-1.5 text-[14px] text-muted'>
                  {categoryCounts['ai-writing']} {t(locale, 'section.tools')}
                </span>
                <Link
                  className='text-[13px] font-bold uppercase tracking-[0.12em] text-accent transition-colors hover:text-accent-light'
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
          className='border-t border-border py-20'
          id='games'
          style={{ background: 'var(--color-surface)' }}
        >
          <div className='mx-auto max-w-[1300px] px-8'>
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='text-[34px] font-extrabold tracking-[-0.02em]'>
                {t(locale, 'section.gameCenter')}
              </h2>
              <Link
                className='text-[13px] font-bold uppercase tracking-[0.12em] text-accent transition-colors hover:text-accent-light'
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
            PERSONALITY TESTS
            ══════════════════════════════════════════════ */}
        <section className='mx-auto max-w-[1300px] px-8 py-20'>
          <div className='mb-6 flex items-center justify-between'>
            <h2 className='text-[34px] font-extrabold tracking-[-0.02em]'>
              {locale === 'zh' ? '人格测评' : 'Personality Tests'}
            </h2>
            <Link
              className='text-[13px] font-bold uppercase tracking-[0.12em] text-accent transition-colors hover:text-accent-light'
              href={testsHref}
            >
              {t(locale, 'section.viewAll')}
            </Link>
          </div>

          <div className='grid grid-cols-2 gap-4 max-[640px]:grid-cols-1'>
            {TEST_META.map((tm) => (
              <Link
                key={tm.slug}
                href={testDetailHref(tm.slug)}
                className='card-lift relative flex items-start gap-4 rounded-[16px] border border-border bg-surface p-6 text-inherit no-underline'
              >
                <span
                  className='flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] text-white'
                  style={{ background: tm.accent }}
                >
                  <ToolIcon slug={tm.slug} size={26} className='text-white' />
                </span>
                <div className='min-w-0'>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-[18px] font-bold text-foreground'>
                      {tm.name}
                    </h3>
                    <span
                      className='rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white'
                      style={{ background: tm.accent }}
                    >
                      {tm.badge}
                    </span>
                  </div>
                  <p className='mt-1 text-[13px] leading-relaxed text-secondary'>
                    {tm.description}
                  </p>
                  <p className='mt-2 text-[12px] font-medium text-muted'>
                    {tm.questionCount} questions · ~{tm.durationMin} min
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            POPULAR TOOLS  (first 3 across all categories)
            ══════════════════════════════════════════════ */}
        <section className='mx-auto max-w-[1300px] px-8 py-20'>
          <div className='mb-6 flex items-end justify-between'>
            <h2 className='text-[34px] font-extrabold tracking-[-0.02em]'>
              {t(locale, 'section.popularTools')}
            </h2>
            <Link
              className='text-[13px] font-bold uppercase tracking-[0.12em] text-accent transition-colors hover:text-accent-light'
              href={toolsHref}
            >
              {t(locale, 'section.viewAll')}
            </Link>
          </div>

          <div className='grid grid-cols-3 gap-4 max-[760px]:grid-cols-1'>
            {popularHighlights.map((item) => (
              <Link
                key={item.href}
                className='card-lift flex cursor-pointer flex-col gap-2 rounded-[16px] border border-border bg-surface p-5 text-inherit no-underline'
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
        <section className='mx-auto max-w-[1300px] px-8 pb-20'>
          <div className='flex flex-wrap items-center justify-between gap-4 rounded-[16px] border border-border bg-surface px-8 py-6'>
            <div>
              <div className='mb-1 flex flex-wrap gap-2'>
                <span className='rounded-full bg-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted'>
                  DEV
                </span>
                <span className='rounded-full bg-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted'>
                  GAMES
                </span>
                <span className='rounded-full bg-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted'>
                  TESTS
                </span>
              </div>
              <h3 className='mb-1 text-[20px] font-semibold text-foreground'>
                {t(locale, 'section.dualEngine')}
              </h3>
              <p className='m-0 text-[14px] text-muted'>
                {t(locale, 'section.dualEngineDesc')}
              </p>
            </div>
            <Link className='btn-cta' href={toolsHref}>
              {t(locale, 'section.browseAll')}
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            WISHLIST CTA
            ══════════════════════════════════════════════ */}
        <section className='border-t border-border px-8 py-16 text-center'>
          <div className='mx-auto max-w-[560px]'>
            <h2 className='mb-3 text-[34px] font-extrabold tracking-[-0.02em] text-foreground'>
              {t(locale, 'section.wishlistTitle')}
            </h2>
            <p className='mb-6 text-[16px] text-muted'>
              {t(locale, 'section.wishlistDesc')}
            </p>
            <Link className='btn-cta' href={wishlistHref}>
              {t(locale, 'section.submitIdea')}
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
