import Link from 'next/link';

import FeatureBand from '@/components/FeatureBand';
import HeroSearch from '@/components/HeroSearch';
import HeroStage from '@/components/HeroStage';
import { PageShell } from '@/components/SiteChrome';
import SpotlightCarousel, {
  type SpotlightSlide,
} from '@/components/SpotlightCarousel';
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
  toolDetailHref,
  toolsCategoryHref,
  toolsHref,
  wishlistHref,
} from '@/lib/routes';

// Revalidate every 60s so the catalog stays fresh without forcing SSR on every hit.
export const revalidate = 60;

const resourceTagHref = (tag: string) =>
  `${resourcesHref}?tag=${encodeURIComponent(tag)}`;

const catLabel = (locale: Locale, category: string) =>
  category === 'ai-writing'
    ? t(locale, 'cat.aiWriting')
    : category === 'developer'
      ? t(locale, 'cat.developer')
      : t(locale, 'cat.utility');

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
    children: [
      { label: 'AI Tools', href: resourceTagHref('AI Tools') },
      { label: 'Growth', href: resourceTagHref('Growth') },
      { label: 'Development', href: resourceTagHref('Development') },
    ],
  },
];

// Keep in sync with the demo registries in HomeDemos (client module — its
// exported slug arrays can't be read from this server component).
const HOME_TOOL_SLUGS = ['jwt', 'json', 'base64', 'uuid'];
const GAME_DEMO_SLUGS = ['slot-machine', 'flappy', 'daily-luck'];

/* ── Slide builders — feed the polished SpotlightCarousel per section ── */
function toolSlides(tools: CatalogTool[], locale: Locale): SpotlightSlide[] {
  return tools.map((tool) => ({
    slug: tool.slug,
    eyebrow: catLabel(locale, tool.category),
    title: tool.name,
    description: tool.description,
    href: toolDetailHref(tool.slug),
    cta: locale === 'zh' ? '打开工具 →' : 'Open tool →',
  }));
}

function gameSlides(games: CatalogGame[], locale: Locale): SpotlightSlide[] {
  const zh = locale === 'zh';
  return games.map((game) => {
    const copy = GAME_CARD_COPY[game.slug];
    return {
      slug: game.slug,
      eyebrow: zh ? '小游戏' : 'Mini Game',
      title: game.name,
      description: game.description,
      metrics: copy ? (zh ? copy.metaZh : copy.meta) : undefined,
      href: gameDetailHref(game.slug),
      cta: copy ? (zh ? copy.ctaZh : copy.cta) : t(locale, 'game.play'),
    };
  });
}

function postSlides(posts: ResourcePost[], locale: Locale): SpotlightSlide[] {
  return posts.map((post) => ({
    slug: 'resources',
    eyebrow: post.tag,
    title: post.title,
    description: post.excerpt,
    metrics: post.readTime,
    href: `/resources/${post.slug}`,
    cta: locale === 'zh' ? '阅读全文 →' : 'Read post →',
  }));
}

/* ── Static visual columns ── */
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
            <span className='flex-1 text-[17px] font-bold text-foreground'>
              {g.label}
            </span>
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

function testSlides(locale: Locale): SpotlightSlide[] {
  const zh = locale === 'zh';
  return TEST_META.map((tm) => ({
    slug: tm.slug,
    eyebrow: tm.badge,
    title: tm.name,
    description: tm.description,
    metrics: `${tm.questionCount} ${zh ? '题' : 'questions'} · ~${tm.durationMin} min`,
    href: testDetailHref(tm.slug),
    cta: zh ? '开始测试 →' : 'Take test →',
  }));
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

  const demoGames = GAME_DEMO_SLUGS.map((slug) =>
    games.find((game) => game.slug === slug)
  ).filter((game): game is CatalogGame => game != null);

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
          links={[
            { label: 'Tools', href: '#tools' },
            { label: 'Games', href: '#games' },
            { label: 'Tests', href: '#tests' },
            { label: 'Resources', href: '#resources' },
          ]}
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
          links={[
            {
              label: t(locale, 'cat.utility'),
              href: toolsCategoryHref('utility'),
            },
            {
              label: t(locale, 'cat.developer'),
              href: toolsCategoryHref('developer'),
            },
            {
              label: t(locale, 'cat.aiWriting'),
              href: toolsCategoryHref('ai-writing'),
            },
          ]}
          title='Tools that do one thing well'
          tone={2}
          visual={
            <SpotlightCarousel
              demo='tool'
              slides={toolSlides(homeTools, locale)}
            />
          }
        />

        {/* ══════════════════════════════════════════════
            GAMES
            ══════════════════════════════════════════════ */}
        <FeatureBand
          cta={{ href: gamesHref, label: 'Enter arcade' }}
          description="21 hand-built mini-games — chess with a real engine, classic arcade, daily fortune. Open a tab, kill five minutes, close it. That's the whole pitch."
          eyebrow='Game Center'
          id='games'
          links={[
            { label: 'Chess', href: gameDetailHref('chess') },
            { label: 'Snake', href: gameDetailHref('snake') },
            { label: 'Tetris', href: gameDetailHref('block-drop') },
            { label: 'Minesweeper', href: gameDetailHref('minesweeper') },
          ]}
          reverse
          title='Quick play, zero install'
          tone={3}
          visual={
            <SpotlightCarousel
              demo='game'
              slides={gameSlides(demoGames, locale)}
            />
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
          links={TEST_META.map((tm) => ({
            label: tm.name,
            href: testDetailHref(tm.slug),
          }))}
          title='Tests worth taking'
          tone={4}
          visual={<SpotlightCarousel compact slides={testSlides(locale)} />}
        />

        {/* ══════════════════════════════════════════════
            RESOURCES
            ══════════════════════════════════════════════ */}
        <FeatureBand
          cta={{ href: resourcesHref, label: 'Read the blog' }}
          description="Essays on AI, growth, SEO and indie development — what's actually working in 2026, written for people shipping real products."
          eyebrow='Resources'
          id='resources'
          links={[
            { label: 'AI Tools', href: resourceTagHref('AI Tools') },
            { label: 'Growth', href: resourceTagHref('Growth') },
            { label: 'Development', href: resourceTagHref('Development') },
            { label: 'Productivity', href: resourceTagHref('Productivity') },
          ]}
          reverse
          title='Field notes for builders'
          tone={0}
          visual={
            <SpotlightCarousel
              compact
              slides={postSlides(posts.slice(0, 8), locale)}
            />
          }
        />

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
