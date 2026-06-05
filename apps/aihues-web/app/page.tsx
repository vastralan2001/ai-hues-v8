import Link from 'next/link';

import { ToolCardV2 } from '@/components/CatalogCards';
import { PageShell } from '@/components/SiteChrome';

// Stats removed per design refresh
import type { CatalogGame } from '@/lib/catalog-api';
import { safeListGames, safeListTools } from '@/lib/catalog-api';
import { t, type Locale } from '@/lib/dict';
import {
  gameDetailHref,
  gamesHref,
  rankingHref,
  toolDetailHref,
  toolsCategoryHref,
  toolsHref,
  wishlistHref,
} from '@/lib/routes';

export const dynamic = 'force-dynamic';

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
    metrics: 'Ease — · Speed — · Utility —',
  },
  {
    href: toolDetailHref('json'),
    kicker: `${t(locale, 'cat.developer')}`,
    title: 'JSON Formatter — Most Elegant',
    description:
      'Dark theme highlighting, collapsible tree, precise error locating',
    metrics: 'Ease — · Quality — · Design —',
  },
  {
    href: gameDetailHref('daily-luck'),
    kicker: `${t(locale, 'cat.games')}`,
    title: 'Daily Fortune — Retention King',
    description: '30 wisdom quotes, 3D card flip, streak rewards & confetti',
    metrics: 'Fun — · Design — · Retention —',
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
      className='relative block cursor-pointer rounded-[16px] border border-border bg-surface px-7 py-7 text-center text-inherit no-underline transition-all duration-200 hover:border-border-strong'
      href={gameDetailHref(game.slug)}
    >
      <span className='mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-bg text-[18px] font-bold text-accent'>
        {game.icon}
      </span>
      <h3 className='mb-1.5 text-[18px] font-bold text-foreground'>
        {game.name}
      </h3>
      <p className='mb-4 text-[13px] leading-relaxed text-secondary'>
        {t(locale, HOME_GAME_DESCRIPTIONS[game.slug]) ?? game.description}
      </p>

      {meta && (
        <p className='mb-4 text-[12px] leading-relaxed text-muted'>{meta}</p>
      )}

      <span className='inline-block rounded-[12px] bg-accent px-7 py-[11px] text-[14px] font-medium text-white transition-all hover:bg-accent-light'>
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
        <section className='relative overflow-hidden px-8 pb-12 pt-[72px] text-center'>
          <div className='relative mx-auto max-w-[720px]'>
            {/* Mars-style minimal greeting */}
            <div className='mb-4 flex items-center justify-center gap-2'>
              <span className='inline-block h-1.5 w-1.5 rounded-full bg-accent' />
              <span className='text-[13px] font-medium uppercase tracking-wider text-muted'>
                {locale === 'zh' ? '为创造者精选' : 'Curated for makers'}
              </span>
            </div>

            {/* Main headline — serif, large, warm */}
            <h1
              className='mb-4 text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground'
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {locale === 'zh'
                ? '你的全能 AI 工具箱'
                : 'Your all-in-one AI toolkit.'}
            </h1>

            <p
              className='mx-auto mb-8 max-w-[560px] text-[17px] leading-relaxed text-secondary'
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {locale === 'zh'
                ? '57 款精选工具 + 3 个轻量小游戏，无需注册，打开即用。'
                : '57 curated tools + 3 mini games. No signup, no paywall — just open and use.'}
            </p>

            {/* Search box — Mars style: no shadow, clean border */}
            <form
              action='/tools'
              className='mx-auto w-full max-w-[580px]'
              method='get'
            >
              <div className='flex items-center rounded-[16px] border border-border bg-surface px-2 py-2 transition-colors hover:border-border-strong'>
                <input
                  className='min-w-0 flex-1 border-0 bg-transparent px-4 text-[15px] text-foreground outline-none placeholder:text-muted'
                  style={{ fontFamily: 'var(--font-sans)' }}
                  name='q'
                  placeholder={t(locale, 'hero.searchPlaceholder')}
                  type='text'
                />
                <button
                  className='rounded-[12px] bg-accent px-6 py-2.5 text-[14px] font-medium text-white transition-all hover:bg-accent-light'
                  type='submit'
                >
                  {t(locale, 'hero.askAI')}
                </button>
              </div>
            </form>

            {/* Quick-tag chips — pill, subtle */}
            <div className='mt-4 flex flex-wrap justify-center gap-2'>
              {QUICK_TAG_LINKS.map((tag) => (
                <Link
                  key={tag.label}
                  className='rounded-full border border-border bg-surface px-3.5 py-1.5 text-[13px] text-secondary transition-all hover:border-border-strong hover:text-foreground'
                  href={tag.href}
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            PARTNER SLOT (placeholder for Phase 2)
            ══════════════════════════════════════════════ */}
        <section className='mx-auto max-w-[1300px] px-8 pb-10'>
          <div className='group relative block overflow-hidden rounded-[16px] border border-border bg-surface px-6 py-5 text-foreground no-underline transition-all hover:border-border-strong'>
            <div className='relative z-[1] flex items-center justify-between'>
              <div>
                <span className='mb-2 inline-block rounded-md border border-border bg-[#f5f3ee] px-2.5 py-1 text-[11px] font-semibold text-muted'>
                  {locale === 'zh' ? '合作伙伴' : 'Partner'}
                </span>
                <h3 className='mt-1 text-[17px] font-semibold'>
                  {locale === 'zh'
                    ? '合作伙伴推荐位（二期上线）'
                    : 'Partner recommendations (Phase 2)'}
                </h3>
                <p className='mt-1 text-[13px] text-muted'>
                  {locale === 'zh'
                    ? '精选 AI 工具与增长资源推荐位，敬请期待。'
                    : 'Curated AI tools and growth resources. Coming soon.'}
                </p>
              </div>
              <span className='rounded-md bg-[#f5f3ee] px-2.5 py-1 text-[11px] font-medium text-muted'>
                Coming soon
              </span>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            BROWSE BY CATEGORY
            ══════════════════════════════════════════════ */}
        <section className='mx-auto max-w-[1300px] px-8 pb-10' id='categories'>
          <div className='mb-5 flex items-center justify-between'>
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

          <div className='grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[540px]:grid-cols-1'>
            {categories.map((cat) => (
              <Link
                key={cat.key}
                className='block cursor-pointer rounded-[16px] border border-border bg-surface p-[18px] text-inherit no-underline transition-all duration-200 hover:border-border-strong'
                href={cat.href}
              >
                {/* Header row */}
                <div className='mb-2 flex items-center gap-2'>
                  <span className='flex h-7 w-7 items-center justify-center rounded-md bg-accent-bg text-[11px] font-bold text-accent'>
                    {cat.letter}
                  </span>
                  <span className='flex-1 text-[14px] font-bold text-foreground'>
                    {cat.label}
                  </span>
                  <span className='rounded-md bg-surface-soft px-2 py-0.5 text-[11px] font-semibold text-muted'>
                    {categoryCounts[cat.key as keyof typeof categoryCounts] ||
                      cat.count}
                  </span>
                </div>

                {/* Description */}
                <p className='mb-2.5 text-[12px] leading-snug text-secondary'>
                  {cat.desc}
                </p>

                {/* Sample tags */}
                <div className='flex flex-wrap gap-1'>
                  {cat.tags.map((tag) => (
                    <span
                      key={tag}
                      className='rounded-[5px] border border-border bg-surface px-2 py-0.5 text-[10px] text-muted'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            STATS BAR
            ══════════════════════════════════════════════ */}
        <div className='border-b border-t border-border bg-[#f5f3ee] px-8 py-5'>
          <div className='mx-auto flex max-w-[1300px] flex-wrap items-center justify-center gap-x-[60px] gap-y-4'>
            {stats.map((s) => (
              <div key={s.label} className='text-center'>
                <div className='text-[24px] font-extrabold leading-tight text-foreground'>
                  {s.num}
                </div>
                <div className='mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted'>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            DEVELOPER TOOLS – NEW THIS WEEK
            ══════════════════════════════════════════════ */}
        {homeDevTools.length > 0 && (
          <section className='mx-auto max-w-[1300px] px-8 py-12' id='new-tools'>
            <div className='mb-6 flex items-end justify-between'>
              <div>
                <h2 className='text-[24px] font-bold tracking-[-0.5px]'>
                  {t(locale, 'section.devTools')}{' '}
                  <span className='text-[16px] font-normal text-muted'>
                    ({t(locale, 'section.newThisWeek')})
                  </span>
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
                <ToolCardV2 key={tool.id} locale={locale} showNew tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════
            WRITING TOOLS – NEW THIS WEEK
            ══════════════════════════════════════════════ */}
        {homeWritingTools.length > 0 && (
          <section className='mx-auto max-w-[1300px] px-8 pb-12'>
            <div className='mb-6 flex items-end justify-between'>
              <div>
                <h2 className='text-[24px] font-bold tracking-[-0.5px]'>
                  {t(locale, 'section.writingTools')}{' '}
                  <span className='text-[16px] font-normal text-muted'>
                    ({t(locale, 'section.newThisWeek')})
                  </span>
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
                <ToolCardV2 key={tool.id} locale={locale} showNew tool={tool} />
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
              href={rankingHref}
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
                <div className='text-[11px] font-extrabold uppercase tracking-wider text-blue-600'>
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
          <div className='flex flex-wrap items-center justify-between gap-4 rounded-[16px] border border-border bg-surface px-8 py-7'>
            <div>
              <div className='mb-1 flex flex-wrap gap-2'>
                <span className='rounded-full bg-[#f5f3ee] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted'>
                  DEV
                </span>
                <span className='rounded-full bg-[#f5f3ee] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted'>
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
            <h2
              className='mb-3 text-[28px] font-normal text-foreground'
              style={{ fontFamily: 'var(--font-sans)' }}
            >
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
