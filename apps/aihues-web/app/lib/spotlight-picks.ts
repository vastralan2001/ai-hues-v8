import type { SpotlightSlide } from '@/components/SpotlightCarousel';

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

export interface CategoryPick {
  key: string;
  label: string; // spotlight eyebrow
  item: PickItem;
}

export const CATEGORY_PICKS: CategoryPick[] = [
  {
    key: 'developer',
    label: 'Developer Tools',
    item: {
      slug: 'json',
      title: 'JSON Formatter',
      description:
        'Format, validate and minify JSON with a collapsible, syntax-highlighted tree.',
      metrics: 'Format · Validate · Minify',
      href: '/tools/json',
      cta: 'Open tool',
      query: 'format this JSON',
    },
  },
  {
    key: 'ai-writing',
    label: 'AI Writing',
    item: {
      slug: 'x-post',
      title: 'X Post Writer',
      description:
        'Turn a rough idea into a punchy, on-brand post — hooks and threads included.',
      metrics: 'Hook · Thread · Tone',
      href: '/tools/x-post',
      cta: 'Open tool',
      query: 'write a tweet about…',
    },
  },
  {
    key: 'tests',
    label: 'Personality Test',
    item: {
      slug: 'mbti',
      title: 'MBTI Personality Test',
      description:
        'Five dimensions, one four-letter type — from Architect to Entertainer.',
      metrics: '20 Q · 16 types',
      href: '/tests/mbti',
      cta: 'Take the test',
      query: 'find my MBTI type',
    },
  },
  {
    key: 'games',
    label: 'Mini Game',
    item: {
      slug: 'doodle-jump',
      title: 'Doodle Jump',
      description:
        'Hop from ledge to ledge across a starry sky — how high can you climb?',
      metrics: 'Endless · Arcade',
      href: '/games/doodle-jump',
      cta: 'Play now',
      query: 'play a quick game',
    },
  },
  {
    key: 'utility',
    label: 'Utility',
    item: {
      slug: 'word-count',
      title: 'Word Counter',
      description:
        'Real-time character, word, line and reading-time counts as you type.',
      metrics: 'Chars · Words · Read time',
      href: '/tools/word-count',
      cta: 'Open tool',
      query: 'count my words',
    },
  },
];

export function slidesFromPicks(): SpotlightSlide[] {
  return CATEGORY_PICKS.map(({ key, label, item }) => {
    const kind: SpotlightSlide['kind'] =
      key === 'tests' ? 'test' : key === 'games' ? 'game' : 'tool';
    return {
      slug: item.slug,
      eyebrow: label,
      title: item.title,
      description: item.description,
      metrics: item.metrics,
      href: item.href,
      cta: item.cta,
      kind,
    };
  });
}

export function examplesFromPicks(): string[] {
  return CATEGORY_PICKS.map((c) => c.item.query);
}
