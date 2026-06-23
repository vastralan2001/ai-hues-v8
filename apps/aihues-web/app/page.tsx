import Link from 'next/link';

import { ToolCardV2 } from '@/components/CatalogCards';
import FeatureBand from '@/components/FeatureBand';
import HeroSearch from '@/components/HeroSearch';
import HeroStage from '@/components/HeroStage';
import { PageShell } from '@/components/SiteChrome';
import { ToolIcon } from '@/components/ToolIcon';
import ToolMarquee, { type MarqueeItem } from '@/components/ToolMarquee';
import Typewriter from '@/components/Typewriter';
import type { CatalogGame, CatalogTool } from '@/lib/catalog-api';
import { safeListGames, safeListTools } from '@/lib/catalog-api';
import { t, type Locale } from '@/lib/dict';
import { GAME_CARD_COPY } from '@/lib/game-meta';
import { getAllPosts, type ResourcePost } from '@/lib/resources-data';
import { TEST_META } from '@/lib/tests';
import {
  gameDetailHref,
  gamesHref,
  resourcesHref,
  testDetailHref,
  testsHref,
  toolsCategoryHref,
  toolsHref,
  wishlistHref,
} from '@/lib/routes';

// Revalidate every 60s so the catalog stays fresh without forcing SSR on every hit.
export const revalidate = 60;

const resourceTagHref = (tag: string) =>
  `${resourcesHref}?tag=${encodeURIComponent(tag)}`;

/* ── Three top-level families, each with second-level entries ── */
const CATEGORY_GROUPS = (
  locale: Locale,
  counts: { tools: number; play: number; resources: number }
) => [
  {
    key: 'tools',
    label: locale === 'zh' ? '工具' : 'Tools',
    count: counts.tools,
    desc:
      locale === 'zh'
        ? '开发与写作利器 — 解码、格式化、生成。'
        : 'Developer & writing utilities — decode, format, generate.',
    href: toolsHref,
    children: [
      { label: t(locale, 'cat.utility'), href: toolsCategoryHref('utility') },
      {
        label: t(locale, 'cat.developer'),
        href: toolsCategoryHref('developer'),
      },
      {
        label: t(locale, 'cat.aiWriting'),
        href: toolsCategoryHref('ai-writing'),
      },
    ],
  },
  {
    key: 'play',
    label: locale === 'zh' ? '游戏 & 测评' : 'Games & Tests',
    count: counts.play,
    desc:
      locale === 'zh'
        ? '轻量小游戏与自我探索测验，放松又走心。'
        : 'Mini-games and self-discovery quizzes to unwind and reflect.',
    href: gamesHref,
    children: [
      { label: t(locale, 'cat.games'), href: gamesHref },
      { label: t(locale, 'cat.tests'), href: testsHref },
    ],
  },
  {
    key: 'resources',
    label: locale === 'zh' ? '资源' : 'Resources',
    count: counts.resources,
    desc:
      locale === 'zh'
        ? '关于 AI、增长、SEO 与独立开发的实战指南。'
        : 'Guides on AI, growth, SEO, and indie development.',
    href: resourcesHref,
    children: [
      { label: 'AI Tools', href: resourceTagHref('AI Tools') },
      { label: 'Growth', href: resourceTagHref('Growth') },
      { label: 'Development', href: resourceTagHref('Development') },
    ],
  },
];

const HOME_TOOL_SLUGS = [
  'jwt',
  'json',
  'regex',
  'word-count',
  'readability',
  'x-post',
];

/* ── Visual columns for the feature bands ── */
function CategoryGroups({
  groups,
}: {
  groups: ReturnType<typeof CATEGORY_GROUPS>;
}) {
  return (
    <div className='flex flex-col gap-3'>
      {groups.map((g) => (
        <div
          key={g.key}
          className='rounded-[18px] border border-border bg-white p-5 transition-colors hover:border-border-strong'
        >
          <div className='mb-2 flex items-center gap-3'>
            <span className='flex h-10 w-10 items-center justify-center rounded-[12px] bg-accent-bg text-accent'>
              <ToolIcon size={20} slug={g.key} />
            </span>
            <Link
              className='flex-1 text-[17px] font-bold text-foreground no-underline transition-colors hover:text-accent'
              href={g.href}
            >
              {g.label}
            </Link>
            <span className='rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-muted'>
              {g.count}
            </span>
          </div>
          <p className='mb-3 text-[13px] leading-relaxed text-foreground/70'>
            {g.desc}
          </p>
          <div className='flex flex-wrap gap-1.5'>
            {g.children.map((c) => (
              <Link
                key={c.label}
                className='rounded-[8px] border border-border bg-surface px-2.5 py-1 text-[12px] font-medium text-secondary no-underline transition-colors hover:border-accent hover:text-accent'
                href={c.href}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ToolsVisual({
  tools,
  locale,
}: {
  tools: CatalogTool[];
  locale: Locale;
}) {
  return (
    <div className='grid grid-cols-2 gap-3'>
      {tools.map((tool) => (
        <ToolCardV2 key={tool.id} locale={locale} tool={tool} />
      ))}
    </div>
  );
}

function HomeGameCard({ game, locale }: { game: CatalogGame; locale: Locale }) {
  const zh = locale === 'zh';
  const copy = GAME_CARD_COPY[game.slug];

  return (
    <Link
      className='card-lift group relative flex h-full cursor-pointer flex-col rounded-[16px] border border-border bg-surface px-6 py-6 text-center text-inherit no-underline'
      href={gameDetailHref(game.slug)}
    >
      <span className='mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-bg text-accent'>
        <ToolIcon size={24} slug={game.slug} />
      </span>
      <h3 className='mb-2 text-[18px] font-bold text-foreground'>
        {game.name}
      </h3>
      <p className='mb-3 text-[13px] leading-relaxed text-secondary'>
        {game.description}
      </p>

      {copy && (
        <p className='mb-4 text-[12px] leading-relaxed text-muted'>
          {zh ? copy.metaZh : copy.meta}
        </p>
      )}

      <span className='btn-cta btn-cta--sm mt-auto self-center'>
        {copy ? (zh ? copy.ctaZh : copy.cta) : t(locale, 'game.play')}
      </span>
    </Link>
  );
}

function TestsVisual({ locale }: { locale: Locale }) {
  return (
    <div className='flex flex-col gap-3'>
      {TEST_META.map((tm) => (
        <Link
          key={tm.slug}
          className='card-lift relative flex items-start gap-4 rounded-[16px] border border-border bg-surface p-5 text-inherit no-underline'
          href={testDetailHref(tm.slug)}
        >
          <span
            className='flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] text-white'
            style={{ background: tm.accent }}
          >
            <ToolIcon className='text-white' size={24} slug={tm.slug} />
          </span>
          <div className='min-w-0'>
            <div className='flex items-center gap-2'>
              <h3 className='text-[17px] font-bold text-foreground'>
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
            <p className='mt-1.5 text-[12px] font-medium text-muted'>
              {tm.questionCount} {locale === 'zh' ? '题' : 'questions'} · ~
              {tm.durationMin} min
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ResourcesVisual({ posts }: { posts: ResourcePost[] }) {
  return (
    <div className='flex flex-col gap-3'>
      {posts.map((post) => (
        <Link
          key={post.slug}
          className='card-lift flex flex-col gap-1.5 rounded-[16px] border border-border bg-surface p-5 text-inherit no-underline'
          href={`/resources/${post.slug}`}
        >
          <div className='flex items-center gap-2'>
            <span className='rounded-full bg-accent-bg px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-accent'>
              {post.tag}
            </span>
            <span className='text-[11px] text-muted'>{post.readTime}</span>
          </div>
          <h3 className='text-[16px] font-bold leading-snug text-foreground'>
            {post.title}
          </h3>
          <p className='line-clamp-2 text-[13px] leading-relaxed text-secondary'>
            {post.excerpt}
          </p>
        </Link>
      ))}
    </div>
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

  const posts = getAllPosts();

  const homeTools = HOME_TOOL_SLUGS.map((slug) =>
    tools.find((tool) => tool.slug === slug)
  ).filter((tool): tool is CatalogTool => tool != null);

  const groups = CATEGORY_GROUPS(locale, {
    tools: tools.length,
    play: games.length + TEST_META.length,
    resources: posts.length,
  });

  const marqueeRows: MarqueeItem[][] = [[], [], []];
  tools.forEach((tool, i) => {
    marqueeRows[i % 3].push({ slug: tool.slug, name: tool.name });
  });

  return (
    <PageShell variant='home' locale={locale}>
      <div className='relative'>
        {/* Continuous wash that drifts hue down the page so band-to-band
            gradient transitions stay seamless. */}
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 -z-20'
          style={{
            background:
              'linear-gradient(180deg, transparent 14%, rgba(199,150,66,0.05) 30%, rgba(176,72,96,0.05) 52%, rgba(120,90,166,0.05) 74%, rgba(194,80,46,0.05) 90%, transparent)',
          }}
        />

        {/* ══════════════════════════════════════════════
            HERO
            ══════════════════════════════════════════════ */}
        <HeroStage
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
            <h1 className='hero-title mb-6 text-foreground'>
              {locale === 'zh' ? (
                <>
                  你的全能
                  <br />
                  <Typewriter
                    className='text-accent'
                    phrases={[
                      'AI 工具箱',
                      '开发利器',
                      '写作工作室',
                      '测验厅',
                      '游戏厅',
                    ]}
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
                      'test lab.',
                      'game arcade.',
                    ]}
                  />
                </>
              )}
            </h1>

            <p className='mx-auto mb-9 max-w-[560px] text-[19px] leading-relaxed text-secondary lg:mx-0'>
              {locale === 'zh'
                ? '精选 AI 工具与轻量小游戏，无需注册，打开即用。'
                : 'Curated AI tools and mini games — no signup, just open and use.'}
            </p>

            <HeroSearch
              askAILabel={t(locale, 'hero.askAI')}
              searchPlaceholder={t(locale, 'hero.searchPlaceholder')}
            />
          </div>
        </HeroStage>

        {/* ══════════════════════════════════════════════
            BROWSE BY CATEGORY
            ══════════════════════════════════════════════ */}
        <FeatureBand
          cta={{ href: toolsHref, label: 'Explore all' }}
          description='Three families — tools, games and tests, and reading. Pick a lane and dive straight in. No signup, no clutter.'
          eyebrow='Explore'
          id='categories'
          reverse
          title='Browse by category'
          tone={1}
          visual={<CategoryGroups groups={groups} />}
        />

        {/* ══════════════════════════════════════════════
            TOOLS
            ══════════════════════════════════════════════ */}
        <FeatureBand
          cta={{ href: toolsHref, label: 'Browse tools' }}
          description='Decode a JWT, format messy JSON, count words, rewrite a tweet — fast, single-purpose utilities that load instantly and never get in your way.'
          eyebrow='Dev + Writing'
          id='tools'
          title='Tools that do one thing well'
          tone={2}
          visual={<ToolsVisual locale={locale} tools={homeTools} />}
        />

        {/* ══════════════════════════════════════════════
            GAMES
            ══════════════════════════════════════════════ */}
        <FeatureBand
          cta={{ href: gamesHref, label: 'Enter arcade' }}
          description="21 hand-built mini-games — chess with a real engine, classic arcade, daily fortune. Open a tab, kill five minutes, close it. That's the whole pitch."
          eyebrow='Game Center'
          id='games'
          reverse
          title='Quick play, zero install'
          tone={3}
          visual={
            <div className='grid grid-cols-2 gap-3'>
              {games.slice(0, 4).map((game) => (
                <HomeGameCard game={game} key={game.id} locale={locale} />
              ))}
            </div>
          }
        />

        {/* ══════════════════════════════════════════════
            TESTS
            ══════════════════════════════════════════════ */}
        <FeatureBand
          cta={{ href: testsHref, label: 'Take a test' }}
          description='Personality, intelligence and temperament quizzes with real question banks and shareable result posters. For reflection and fun — not clinical diagnosis.'
          eyebrow='Know Yourself'
          id='tests'
          title='Tests worth taking'
          tone={4}
          visual={<TestsVisual locale={locale} />}
        />

        {/* ══════════════════════════════════════════════
            RESOURCES
            ══════════════════════════════════════════════ */}
        <FeatureBand
          cta={{ href: resourcesHref, label: 'Read the blog' }}
          description="Essays on AI, growth, SEO and indie development — what's actually working in 2026, written for people shipping real products."
          eyebrow='Resources'
          id='resources'
          reverse
          title='Field notes for builders'
          tone={0}
          visual={<ResourcesVisual posts={posts.slice(0, 3)} />}
        />

        {/* ══════════════════════════════════════════════
            DUAL ENGINE CTA BANNER
            ══════════════════════════════════════════════ */}
        <section className='mx-auto max-w-[1300px] px-8 py-16'>
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
