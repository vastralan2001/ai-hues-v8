import Link from 'next/link';

import FeatureBand from '@/components/FeatureBand';
import HeroSearch from '@/components/HeroSearch';
import HeroStage from '@/components/HeroStage';
import { BrandWord } from '@/components/Logo';
import { PageShell } from '@/components/SiteChrome';
import SpotlightCarousel, {
  type SpotlightSlide,
} from '@/components/SpotlightCarousel';
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

// Dev and writing tools interleaved 50/50, by international popularity.
// Each slug must have a demo in the per-domain ToolDemos / GameDemos files.
const HOME_TOOL_SLUGS = [
  'json', // dev
  'x-post', // writing
  'jwt', // dev
  'tldr', // writing
  'base64', // dev
  'blog-outline', // writing
];
const GAME_DEMO_SLUGS = ['snake', 'doodle-jump', 'slot-machine', 'daily-luck'];

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

            <p className='mx-auto mb-9 max-w-[600px] text-[19px] leading-relaxed text-secondary lg:mx-0'>
              <span className='font-semibold text-foreground'>
                <BrandWord>Helpers</BrandWord>, <BrandWord>Unwinds</BrandWord>,{' '}
                <BrandWord>Evaluations</BrandWord> &amp;{' '}
                <BrandWord>Stories</BrandWord>
              </span>
              {locale === 'zh'
                ? ' —— 你的日常 AI 四种色彩，无需注册，打开即用。'
                : ' — the four hues of your everyday AI. No signup, just open and use.'}
            </p>

            <HeroSearch
              askAILabel={t(locale, 'hero.askAI')}
              searchPlaceholder={t(locale, 'hero.searchPlaceholder')}
            />
          </div>
        </HeroStage>

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
          title={
            <>
              <BrandWord>Helpers</BrandWord> that do one thing well
            </>
          }
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
          title={
            <>
              <BrandWord>Unwinds</BrandWord> for a five-minute break
            </>
          }
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
          title={
            <>
              <BrandWord>Evaluations</BrandWord> worth taking
            </>
          }
          tone={4}
          visual={<SpotlightCarousel demo='test' slides={testSlides(locale)} />}
        />

        {/* ══════════════════════════════════════════════
            RESOURCES
            ══════════════════════════════════════════════ */}
        <FeatureBand
          cta={{ href: resourcesHref, label: 'Read the stories' }}
          description="Essays on AI, growth, SEO and indie development — what's actually working in 2026, written for people shipping real products."
          eyebrow='Stories'
          id='stories'
          links={[
            { label: 'AI Tools', href: resourceTagHref('AI Tools') },
            { label: 'Growth', href: resourceTagHref('Growth') },
            { label: 'Development', href: resourceTagHref('Development') },
            { label: 'Productivity', href: resourceTagHref('Productivity') },
          ]}
          reverse
          title={
            <>
              <BrandWord>Stories</BrandWord> for people who build
            </>
          }
          tone={0}
          visual={
            <SpotlightCarousel
              compact
              slides={postSlides(posts.slice(0, 6), locale)}
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
