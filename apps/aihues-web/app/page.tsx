import Link from 'next/link';

import FeatureBand from '@/components/FeatureBand';
import HeroStage from '@/components/HeroStage';
import { BrandWord } from '@/components/Logo';
import { PageShell } from '@/components/SiteChrome';
import SpotlightCarousel, {
  type SpotlightSlide,
} from '@/components/SpotlightCarousel';
import ToolMarquee, { type MarqueeItem } from '@/components/ToolMarquee';
import type { CatalogGame, CatalogTool } from '@/lib/catalog-api';
import { safeListGames, safeListTools } from '@/lib/catalog-api';
import { t, type Locale } from '@/lib/dict';
import { GAME_CARD_COPY, GAME_GENRES } from '@/lib/game-meta';
import { getAllPosts, type ResourcePost } from '@/lib/resources-data';
import { TEST_META } from '@/lib/tests';
import {
  gameDetailHref,
  gamesGenreHref,
  gamesHref,
  storiesHref,
  testDetailHref,
  testsHref,
  toolDetailHref,
  toolsCategoryHref,
  toolsHref,
  wishlistHref,
} from '@/lib/routes';
import { CATEGORY_SLOGAN } from '@/lib/category-brand';
import { CATEGORY_PICKS, type HeroScene } from '@/lib/spotlight-picks';

// Revalidate every 60s so the catalog stays fresh without forcing SSR on every hit.
export const revalidate = 60;

const storyTagHref = (tag: string) =>
  `${storiesHref}?tag=${encodeURIComponent(tag)}`;

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
  'word-count', // writing
  'base64', // dev
  'blog-outline', // writing
];
const GAME_DEMO_SLUGS = [
  'snake',
  'block-drop',
  'minesweeper',
  'chess',
  'slot-machine',
  'daily-luck',
];

const HOME_TOOL_BLURB: Record<string, string> = {
  json: "Paste any mangled, minified, or broken JSON — get it formatted, syntax-highlighted, and validated in one click, with clear error markers when something's off.",
  'x-post':
    'Describe what you want to say and the AI drafts a punchy, on-brand post for X. Thread mode, hooks, hashtags — ready to copy in seconds.',
  jwt: 'Drop in a JWT and instantly see its decoded header, payload, and expiry without firing up a terminal. Works on any HS256/RS256 token.',
  'word-count':
    'Paste an essay, email, or script and get instant word, character, sentence, and reading-time stats — updated live as you type.',
  base64:
    'Encode plain text or raw bytes to Base64 and decode back again in a single field. Handles standard and URL-safe alphabets.',
  'blog-outline':
    'Drop in a topic and the AI returns a structured outline with H2s, H3s, and intro hooks — a solid skeleton to write from, not a wall of lorem ipsum.',
};

/* ── Slide builders — feed the polished SpotlightCarousel per section ── */
function toolSlides(tools: CatalogTool[], locale: Locale): SpotlightSlide[] {
  return tools.map((tool) => ({
    slug: tool.slug,
    eyebrow: catLabel(locale, tool.category),
    title: tool.name,
    description: HOME_TOOL_BLURB[tool.slug] ?? tool.description,
    href: toolDetailHref(tool.slug),
    cta: locale === 'zh' ? '打开工具 →' : 'Open tool →',
  }));
}

const HOME_GAME_BLURB: Record<string, string> = {
  snake:
    'Guide a hungry serpent around the board with a greedy pathing brain, growing one segment per pellet — the longer it gets, the tighter the squeeze.',
  'block-drop':
    'The classic seven tetrominoes fall faster as you go; rotate, slot and clear lines, with a heuristic auto-player showing off tidy stacking.',
  minesweeper:
    'Flag the mines and flood-reveal the safe squares from the number clues — the demo solves it the same way you would, one deduction at a time.',
  chess:
    'A real engine plays both sides with legal moves and live evaluation — watch the pieces think, then jump in and take the board yourself.',
  'slot-machine':
    'Three reels spin and lock one by one; line up three symbols for the jackpot. Daily free spins, eight paylines, real Vegas drama.',
  'daily-luck':
    'Draw one fortune a day for a wisdom line, lucky colour and lucky number — keep a streak going for bonus credits.',
};

function gameSlides(games: CatalogGame[], locale: Locale): SpotlightSlide[] {
  const zh = locale === 'zh';
  return games.map((game) => {
    const copy = GAME_CARD_COPY[game.slug];
    return {
      slug: game.slug,
      eyebrow: zh ? '小游戏' : 'Mini Game',
      title: game.name,
      description: HOME_GAME_BLURB[game.slug] ?? game.description,
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
    href: `/stories/${post.slug}`,
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

  // Hero scenes — built from the SAME catalog/posts the home bands use, so a
  // given id renders identical content + badge in the hero and its band.
  const heroScenes: HeroScene[] = CATEGORY_PICKS.map((pick) => {
    let slide: SpotlightSlide;
    if (pick.cat === 'games') {
      const g = games.find((x) => x.slug === pick.slug);
      slide = {
        ...gameSlides(g ? [g] : demoGames.slice(0, 1), locale)[0],
        kind: 'game',
      };
    } else if (pick.cat === 'tests') {
      slide = {
        ...(testSlides(locale).find((s) => s.slug === pick.slug) ??
          testSlides(locale)[0]),
        kind: 'test',
      };
    } else if (pick.cat === 'stories') {
      slide = { ...postSlides(posts.slice(0, 1), locale)[0], kind: 'story' };
    } else {
      const tl = tools.find((x) => x.slug === pick.slug);
      slide = {
        ...toolSlides(tl ? [tl] : homeTools.slice(0, 1), locale)[0],
        kind: 'tool',
      };
    }
    return {
      cat: pick.cat,
      typeword: pick.typeword,
      slogan: pick.slogan,
      query: pick.query,
      slide,
    };
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
          scenes={heroScenes}
          locale={locale}
          askAILabel={t(locale, 'hero.askAI')}
          searchPlaceholder={t(locale, 'hero.searchPlaceholder')}
          marquee={
            marqueeRows.some((r) => r.length > 0) ? (
              <ToolMarquee rows={marqueeRows.slice(0, 2)} />
            ) : null
          }
        />

        {/* ══════════════════════════════════════════════
            TOOLS
            ══════════════════════════════════════════════ */}
        <FeatureBand
          category='tools'
          cta={{ href: toolsHref, label: 'Browse tools' }}
          description='Decode a JWT, format messy JSON, count words, rewrite a tweet — fast, single-purpose utilities that load instantly and never get in your way.'
          eyebrow='Toolbox'
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
            {
              label: t(locale, 'cat.image'),
              href: toolsCategoryHref('image'),
            },
          ]}
          reverse
          tagline={undefined}
          title={<BrandWord>{CATEGORY_SLOGAN.tools.primary[locale]}</BrandWord>}
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
          category='games'
          cta={{ href: gamesHref, label: 'Enter arcade' }}
          description="21 hand-built mini-games — chess with a real engine, classic arcade, daily fortune. Open a tab, kill five minutes, close it. That's the whole pitch."
          eyebrow='Game Center'
          id='games'
          links={GAME_GENRES.map((g) => ({
            label: g,
            href: gamesGenreHref(g),
          }))}
          tagline={undefined}
          title={<BrandWord>{CATEGORY_SLOGAN.games.primary[locale]}</BrandWord>}
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
          category='tests'
          cta={{ href: testsHref, label: 'Take a test' }}
          description='Personality, intelligence and temperament quizzes with real question banks and shareable result posters. For reflection and fun — not clinical diagnosis.'
          eyebrow='Know Yourself'
          id='tests'
          links={TEST_META.map((tm) => ({
            label: tm.name,
            href: testDetailHref(tm.slug),
          }))}
          reverse
          tagline={undefined}
          title={<BrandWord>{CATEGORY_SLOGAN.tests.primary[locale]}</BrandWord>}
          tone={4}
          visual={<SpotlightCarousel demo='test' slides={testSlides(locale)} />}
        />

        {/* ══════════════════════════════════════════════
            STORIES
            ══════════════════════════════════════════════ */}
        <FeatureBand
          category='stories'
          cta={{ href: storiesHref, label: 'Read the stories' }}
          description="Essays on AI, growth, SEO and indie development — what's actually working in 2026, written for people shipping real products."
          eyebrow='Stories'
          id='stories'
          links={[
            { label: 'AI Tools', href: storyTagHref('AI Tools') },
            { label: 'Growth', href: storyTagHref('Growth') },
            { label: 'Development', href: storyTagHref('Development') },
            { label: 'Productivity', href: storyTagHref('Productivity') },
          ]}
          tagline={undefined}
          title={
            <BrandWord>{CATEGORY_SLOGAN.stories.primary[locale]}</BrandWord>
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
