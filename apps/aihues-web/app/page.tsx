import Link from 'next/link';

import { ToolCardV2 } from '@/components/CatalogCards';
import { PageShell } from '@/components/SiteChrome';
import type { CatalogGame } from '@/lib/catalog-api';
import { safeListGames, safeListTools } from '@/lib/catalog-api';
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
const HOME_CATEGORIES = [
  {
    key: 'utility',
    icon: '✍️',
    label: 'Utility',
    count: 8,
    desc: 'Word Count, Diff, Fullwidth, Readability, Humanize',
    tags: ['Word Count', 'Fullwidth', 'Readability'],
    href: toolsCategoryHref('utility'),
  },
  {
    key: 'developer',
    icon: '💻',
    label: 'Developer',
    count: 30,
    desc: 'JWT, JSON, Regex, Base64, UUID, QR Code, SHA256',
    tags: ['JWT', 'JSON', 'Regex', 'QR Code'],
    href: toolsCategoryHref('developer'),
  },
  {
    key: 'ai-writing',
    icon: '🤖',
    label: 'AI Writing',
    count: 19,
    desc: 'X Post, Blog Outline, SEO Title, Newsletter, PR Desc',
    tags: ['X Post', 'Blog', 'SEO', 'TL;DR'],
    href: toolsCategoryHref('ai-writing'),
  },
  {
    key: 'games',
    icon: '🎮',
    label: 'Games',
    count: 3,
    desc: 'Daily Fortune, Slots, Hoops — earn Credits',
    tags: ['Fortune', 'Slots', 'Hoops'],
    href: gamesHref,
  },
] as const;

/* ── Quick search tags ── */
const QUICK_TAGS = ['JWT', 'JSON', 'Regex', 'QR Code', 'Fortune', 'Hoops'];

const POPULAR_HIGHLIGHTS = [
  {
    href: toolDetailHref('jwt'),
    kicker: 'DEVELOPER · 5★',
    title: 'JWT Parser — Dev Essential',
    description:
      'One-click JWT decode with expiry detection & JSON highlighting',
    metrics: 'Ease 98 · Speed 96 · Utility 95',
  },
  {
    href: toolDetailHref('json'),
    kicker: 'DEVELOPER · 5★',
    title: 'JSON Formatter — Most Elegant',
    description:
      'Dark theme highlighting, collapsible tree, precise error locating',
    metrics: 'Ease 95 · Quality 97 · Design 94',
  },
  {
    href: gameDetailHref('daily-luck'),
    kicker: 'GAME · 4.8★',
    title: 'Daily Fortune — Retention King',
    description: '30 wisdom quotes, 3D card flip, streak rewards & confetti',
    metrics: 'Fun 96 · Design 95 · Retention 92',
  },
];

const HOME_GAME_ACTIONS: Record<string, string> = {
  'daily-luck': 'Draw →',
  'slot-machine': 'Spin →',
  basketball: 'Play →',
};

const HOME_GAME_DESCRIPTIONS: Record<string, string> = {
  'daily-luck': 'Daily draw for wisdom & Credit rewards',
  'slot-machine': '3 free spins daily, win big prizes',
  basketball: '60 seconds to score maximum points',
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

function HomeGameCard({ game }: { game: CatalogGame }) {
  return (
    <Link
      className='block cursor-pointer rounded-[14px] border border-border bg-bg px-7 py-7 text-center text-inherit no-underline transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(109,40,217,0.12),0_8px_32px_rgba(0,0,0,0.08)]'
      href={gameDetailHref(game.slug)}
    >
      <span className='mb-3 block text-[48px] leading-none'>{game.icon}</span>
      <h3 className='mb-1.5 text-[18px] font-bold text-foreground'>
        {game.name}
      </h3>
      <p className='mb-4 text-[13px] leading-relaxed text-secondary'>
        {HOME_GAME_DESCRIPTIONS[game.slug] ?? game.description}
      </p>
      <span
        className='inline-block rounded-[10px] px-7 py-[11px] text-[14px] font-semibold text-white'
        style={{ background: 'linear-gradient(135deg, #b45309, #d97706)' }}
      >
        {HOME_GAME_ACTIONS[game.slug] ?? 'Play →'}
      </span>
    </Link>
  );
}

export default async function HomePage() {
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
    { num: String(tools.length || 57), label: 'AI Tools' },
    { num: String(categoryCounts.developer || 30), label: 'Dev Tools' },
    { num: String(games.length || 3), label: 'Games' },
    { num: '100', label: 'Free Credits' },
    { num: '3', label: 'Day Streak' },
  ];
  const homeDevTools = HOME_DEVELOPER_SLUGS.map((slug) =>
    tools.find((tool) => tool.slug === slug)
  ).filter((tool) => tool != null);
  const homeWritingTools = HOME_WRITING_SLUGS.map((slug) =>
    tools.find((tool) => tool.slug === slug)
  ).filter((tool) => tool != null);

  return (
    <PageShell variant='home'>
      {/* ══════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════ */}
      <section className='relative overflow-hidden px-8 pb-8 pt-[60px] text-center'>
        {/* Radial glow */}
        <div
          className='pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-[60%] rounded-full opacity-60'
          style={{
            background:
              'radial-gradient(circle, rgba(109,40,217,0.08) 0%, transparent 70%)',
          }}
        />

        <div className='relative mx-auto max-w-[680px]'>
          <h1 className='mb-2.5 text-[48px] font-extrabold leading-[1.08] tracking-[-2px]'>
            Find your{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #b45309, #d97706)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AI vibe
            </span>
          </h1>

          <p className='mb-5 text-[16px] leading-relaxed text-secondary'>
            57+ AI tools, mini games &amp; utilities that just work. Tell us
            what you need.
          </p>

          {/* AI search box */}
          <div className='mx-auto w-full max-w-[600px]'>
            <div className='flex items-center rounded-[14px] border border-border bg-bg px-1.5 py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]'>
              <span className='px-3 text-[22px]'>🤖</span>
              <input
                className='min-w-0 flex-1 border-0 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted'
                placeholder="e.g. 'parse JWT'... (Press / to focus)"
                type='text'
              />
              <button
                className='rounded-[10px] px-5 py-2 text-[14px] font-semibold text-white transition-all hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(109,40,217,0.3)]'
                style={{
                  background: 'linear-gradient(135deg, #b45309, #d97706)',
                }}
                type='button'
              >
                Ask AI
              </button>
            </div>
          </div>

          {/* Quick-tag chips */}
          <div className='mt-3 flex flex-wrap justify-center gap-2'>
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                className='rounded-full border border-border bg-surface px-3 py-1 text-[12px] font-medium text-secondary transition-all hover:border-accent hover:text-accent'
                type='button'
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          BROWSE BY CATEGORY
          ══════════════════════════════════════════════ */}
      <section className='mx-auto max-w-[1300px] px-8 pb-10' id='categories'>
        <div className='mb-5 flex items-center justify-between'>
          <h2 className='text-[20px] font-bold'>Browse by category</h2>
          <Link
            className='text-[14px] font-semibold text-accent transition-colors hover:text-accent-light'
            href={toolsHref}
          >
            See all tools →
          </Link>
        </div>

        <div className='grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[540px]:grid-cols-1'>
          {HOME_CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              className='block cursor-pointer rounded-[14px] border border-border bg-bg p-[18px] text-inherit no-underline transition-all duration-[250ms] hover:-translate-y-0.5 hover:border-accent-light hover:shadow-[0_4px_12px_rgba(109,40,217,0.12),0_8px_32px_rgba(0,0,0,0.08)]'
              href={cat.href}
            >
              {/* Header row */}
              <div className='mb-2 flex items-center gap-2'>
                <span className='text-[20px] leading-none'>{cat.icon}</span>
                <span className='flex-1 text-[14px] font-bold text-foreground'>
                  {cat.label}
                </span>
                <span className='rounded-md bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted'>
                  {categoryCounts[cat.key] || cat.count}
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
      <div className='border-b border-t border-border bg-surface px-8 py-5'>
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
                🛠️ Developer Tools{' '}
                <span className='text-[16px] font-normal text-muted'>
                  (New This Week)
                </span>
              </h2>
            </div>
            <div className='flex items-center gap-3'>
              <span className='rounded-full border border-border bg-surface px-3.5 py-1.5 text-[14px] text-muted'>
                {categoryCounts.developer || 30} tools
              </span>
              <Link
                className='text-[14px] font-semibold text-accent hover:text-accent-light'
                href={toolsCategoryHref('developer')}
              >
                All tools →
              </Link>
            </div>
          </div>

          <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3'>
            {homeDevTools.map((tool) => (
              <ToolCardV2 key={tool.id} showNew tool={tool} />
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
                ✍️ Writing Tools{' '}
                <span className='text-[16px] font-normal text-muted'>
                  (New This Week)
                </span>
              </h2>
            </div>
            <div className='flex items-center gap-3'>
              <span className='rounded-full border border-border bg-surface px-3.5 py-1.5 text-[14px] text-muted'>
                7 tools
              </span>
              <Link
                className='text-[14px] font-semibold text-accent hover:text-accent-light'
                href={toolsCategoryHref('utility')}
              >
                All tools →
              </Link>
            </div>
          </div>

          <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3'>
            {homeWritingTools.map((tool) => (
              <ToolCardV2 key={tool.id} showNew tool={tool} />
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
          {/* Section header with credit balance */}
          <div className='mb-6 flex items-center justify-between'>
            <h2 className='text-[24px] font-bold tracking-[-0.5px]'>
              🎮 Game Center
            </h2>
            <div className='flex items-center gap-4'>
              {/* Credit bar */}
              <div className='flex items-center gap-2 rounded-full border border-border bg-bg px-4 py-2 text-[13px] font-semibold text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.04)]'>
                <span className='text-[16px]'>💰</span>
                <span>Your Credit Balance</span>
                <span className='rounded-full bg-accent px-2.5 py-0.5 text-white'>
                  100
                </span>
              </div>
              <Link
                className='text-[14px] font-semibold text-accent hover:text-accent-light'
                href={gamesHref}
              >
                View all →
              </Link>
            </div>
          </div>

          <div className='grid grid-cols-3 gap-4 max-[760px]:grid-cols-1'>
            {games.map((game) => (
              <HomeGameCard game={game} key={game.id} />
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
            🔥 Popular Tools
          </h2>
          <Link
            className='text-[14px] font-semibold text-accent hover:text-accent-light'
            href={rankingHref}
          >
            View all →
          </Link>
        </div>

        <div className='grid grid-cols-3 gap-4 max-[760px]:grid-cols-1'>
          {POPULAR_HIGHLIGHTS.map((item) => (
            <Link
              key={item.href}
              className='flex cursor-pointer flex-col gap-2 rounded-[14px] border border-border bg-bg p-5 text-inherit no-underline transition-all hover:-translate-y-0.5 hover:border-accent-light hover:shadow-[0_4px_12px_rgba(109,40,217,0.12)]'
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
        <div
          className='flex flex-wrap items-center justify-between gap-4 rounded-[14px] px-8 py-7'
          style={{ background: 'linear-gradient(135deg, #1e1b4b, #2d1b69)' }}
        >
          <div>
            <div className='mb-1 flex flex-wrap gap-2'>
              <span className='rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white'>
                DEV
              </span>
              <span className='rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white'>
                GAMES
              </span>
            </div>
            <h3 className='mb-1 text-[20px] font-bold text-white'>
              Tools + Games Dual Engine
            </h3>
            <p className='m-0 text-[14px] text-white/70'>
              Use tools, then play a game to relax. 57 tools + 3 games =
              complete platform.
            </p>
          </div>
          <Link
            className='flex items-center gap-2 rounded-[10px] bg-white px-6 py-3 text-[14px] font-semibold text-accent transition-all hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(255,255,255,0.18)]'
            href={toolsHref}
          >
            Browse All Tools →
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WISHLIST CTA
          ══════════════════════════════════════════════ */}
      <section
        className='px-8 py-16 text-center'
        style={{ background: 'linear-gradient(135deg, #b45309, #d97706)' }}
      >
        <div className='mx-auto max-w-[560px]'>
          <h2 className='mb-3 text-[28px] font-bold text-white'>
            Can&apos;t find what you need?
          </h2>
          <p className='mb-6 text-[16px] text-white/80'>
            Submit your idea. Top requests get built first.
          </p>
          <Link
            className='inline-flex items-center gap-2 rounded-[10px] bg-white px-7 py-3.5 text-[15px] font-semibold text-accent transition-all hover:-translate-y-px hover:shadow-[0_4px_18px_rgba(0,0,0,0.18)]'
            href={wishlistHref}
          >
            Submit Your Idea →
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
