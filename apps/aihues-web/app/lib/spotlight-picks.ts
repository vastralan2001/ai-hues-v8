import { getToolUsages } from '@/lib/tool-usage';
import type { SpotlightSlide } from '@/components/SpotlightCarousel';

/* Per-category picks for the hero spotlight + the Ask-AI placeholder.

   Each category lists a few candidates (broadest mainstream appeal first).
   For a given user we draw ONE item per category — the candidate they've
   used most (from localStorage tool-usage), else the first/default — and
   order the categories by how much the user engages with each. With no
   usage history it falls back to a deterministic default (the broadly
   popular set, safe for SSR / first paint). */

export interface PickItem {
  slug: string;
  title: string;
  description: string;
  metrics: string;
  href: string;
  cta: string;
  /** Example search phrase shown in the rotating Ask-AI placeholder. */
  query: string;
}

export interface CategoryPicks {
  key: string;
  label: string; // spotlight eyebrow
  items: PickItem[]; // broadest-appeal candidate first
}

export const CATEGORY_PICKS: CategoryPicks[] = [
  {
    key: 'developer',
    label: 'Developer Tools',
    items: [
      {
        slug: 'json',
        title: 'JSON Formatter',
        description:
          'Format, validate and minify JSON with a collapsible, syntax-highlighted tree.',
        metrics: 'Format · Validate · Minify',
        href: '/tools/json',
        cta: 'Open tool',
        query: 'format this JSON',
      },
      {
        slug: 'jwt',
        title: 'JWT Parser',
        description:
          'Decode and inspect JSON Web Tokens with expiry detection and JSON highlighting.',
        metrics: 'Decode · Verify · Expiry',
        href: '/tools/jwt',
        cta: 'Open tool',
        query: 'parse a JWT',
      },
      {
        slug: 'regex',
        title: 'Regex Tester',
        description:
          'Test regular expressions live with match highlighting and capture groups.',
        metrics: 'Match · Groups · Flags',
        href: '/tools/regex',
        cta: 'Open tool',
        query: 'test a regex',
      },
      {
        slug: 'qrcode',
        title: 'QR Code Generator',
        description:
          'Turn any link or text into a crisp, downloadable QR code in a click.',
        metrics: 'Link · Wifi · Download',
        href: '/tools/qrcode',
        cta: 'Open tool',
        query: 'make a QR code',
      },
    ],
  },
  {
    key: 'ai-writing',
    label: 'AI Writing',
    items: [
      {
        slug: 'x-post',
        title: 'X Post Writer',
        description:
          'Turn a rough idea into a punchy, on-brand post — hooks and threads included.',
        metrics: 'Hook · Thread · Tone',
        href: '/tools/x-post',
        cta: 'Open tool',
        query: 'write a tweet about…',
      },
      {
        slug: 'humanize',
        title: 'Humanize AI Text',
        description:
          'Rewrite AI-sounding text so it reads natural — and passes as human.',
        metrics: 'Natural · Rewrite',
        href: '/tools/humanize',
        cta: 'Open tool',
        query: 'make my text sound human',
      },
      {
        slug: 'seo-title',
        title: 'SEO Title Generator',
        description:
          'Generate click-worthy, search-optimized titles for any page.',
        metrics: 'SEO · CTR · Variants',
        href: '/tools/seo-title',
        cta: 'Open tool',
        query: 'write an SEO title',
      },
      {
        slug: 'blog-outline',
        title: 'Blog Outline',
        description:
          'Go from a bare topic to a structured outline you can write straight from.',
        metrics: 'Outline · Sections',
        href: '/tools/blog-outline',
        cta: 'Open tool',
        query: 'outline a blog post',
      },
    ],
  },
  {
    key: 'tests',
    label: 'Personality Test',
    items: [
      {
        slug: 'mbti',
        title: 'MBTI Personality Test',
        description:
          'Five dimensions, one four-letter type — from Architect to Entertainer.',
        metrics: '20 Q · 16 types',
        href: '/tests/mbti',
        cta: 'Take the test',
        query: 'find my MBTI type',
      },
      {
        slug: 'sbti',
        title: 'SBTI Personality Test',
        description:
          'A gloriously unscientific soul-scan — which internet archetype are you?',
        metrics: '31 Q · Satirical',
        href: '/tests/sbti',
        cta: 'Take the test',
        query: 'which internet archetype am I',
      },
    ],
  },
  {
    key: 'games',
    label: 'Mini Game',
    items: [
      {
        slug: 'doodle-jump',
        title: 'Doodle Jump',
        description:
          'Hop from ledge to ledge across a starry sky — how high can you climb?',
        metrics: 'Endless · Arcade',
        href: '/games/doodle-jump',
        cta: 'Play now',
        query: 'play a quick game',
      },
      {
        slug: 'basketball',
        title: 'Basketball Shootout',
        description:
          'Time the sweeping arrow and sink the shot — 60 seconds on the clock.',
        metrics: '60s · Physics · Streaks',
        href: '/games/basketball',
        cta: 'Play now',
        query: 'shoot some hoops',
      },
      {
        slug: 'daily-luck',
        title: 'Daily Fortune',
        description:
          'Draw your fortune for the day — luck, wisdom and credit rewards await.',
        metrics: 'Daily · Streak · Credits',
        href: '/games/daily-luck',
        cta: 'Play now',
        query: 'draw my daily fortune',
      },
    ],
  },
  {
    key: 'utility',
    label: 'Utility',
    items: [
      {
        slug: 'word-count',
        title: 'Word Counter',
        description:
          'Real-time character, word, line and reading-time counts as you type.',
        metrics: 'Chars · Words · Read time',
        href: '/tools/word-count',
        cta: 'Open tool',
        query: 'count my words',
      },
      {
        slug: 'diff',
        title: 'Diff Checker',
        description:
          'Compare two blocks of text and see exactly what changed, line by line.',
        metrics: 'Compare · Highlight',
        href: '/tools/diff',
        cta: 'Open tool',
        query: 'compare two texts',
      },
      {
        slug: 'cn-convert',
        title: 'Chinese Converter',
        description:
          'Convert instantly between Simplified and Traditional Chinese.',
        metrics: '简体 · 繁体',
        href: '/tools/cn-convert',
        cta: 'Open tool',
        query: 'convert simplified to traditional',
      },
    ],
  },
];

export interface Pick {
  category: CategoryPicks;
  item: PickItem;
  usage: number;
}

/** Draw one item per category + order categories by user usage. */
export function computePicks(usageBySlug: Record<string, number>): Pick[] {
  const picks: Pick[] = CATEGORY_PICKS.map((category) => {
    let item = category.items[0];
    let best = usageBySlug[item.slug] ?? 0;
    let total = 0;
    for (const candidate of category.items) {
      const u = usageBySlug[candidate.slug] ?? 0;
      total += u;
      if (u > best) {
        best = u;
        item = candidate;
      }
    }
    return { category, item, usage: total };
  });
  // Most-used category first; stable order for ties / no-usage.
  return picks
    .map((p, i) => ({ p, i }))
    .sort((a, b) => b.p.usage - a.p.usage || a.i - b.i)
    .map(({ p }) => p);
}

/** Deterministic default (no usage) — identical on server + client. */
export function defaultPicks(): Pick[] {
  return computePicks({});
}

/** Read localStorage tool-usage as a slug→count map (empty on the server). */
export function usageMap(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const u of getToolUsages()) out[u.slug] = u.count;
  return out;
}

export function slidesFromPicks(picks: Pick[]): SpotlightSlide[] {
  return picks.map(({ category, item }) => ({
    eyebrow: category.label,
    title: item.title,
    description: item.description,
    metrics: item.metrics,
    href: item.href,
    cta: item.cta,
  }));
}

export function examplesFromPicks(picks: Pick[]): string[] {
  return picks.map((p) => p.item.query);
}
