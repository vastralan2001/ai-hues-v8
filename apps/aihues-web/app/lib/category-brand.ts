import type { CSSProperties } from 'react';

import { HUE_COLOR } from '@/components/Logo';

/* The four content families, each tagged by one letter of the HUES wordmark
   and that letter's design-token hue. Used to theme bands, listing pages,
   detail pages and the spotlight carousel by category. */

export type BrandCategory = 'tools' | 'games' | 'tests' | 'stories';

export const CATEGORY_HUE: Record<BrandCategory, 'H' | 'U' | 'E' | 'S'> = {
  tools: 'H',
  games: 'U',
  tests: 'E',
  stories: 'S',
};

export const categoryColor = (c: BrandCategory): string =>
  HUE_COLOR[CATEGORY_HUE[c]];

/* Resolved hex values for each category — used only when we need to override
   --color-accent itself (a CSS var cannot reference itself). These must stay
   in sync with the @theme tokens in globals.css. */
export const CATEGORY_ACCENT_HEX: Record<BrandCategory, string> = {
  tools: '#c2502e', // red-orange
  games: '#e06a9c', // bilibili-ish magenta
  tests: '#6a9bcc', // blue (swapped with stories)
  stories: '#788c5d', // green (swapped with tests)
};

/* Inline style applied to a category root. Overriding --color-accent and its
   relatives recolours the whole subtree — Tailwind's text-accent/bg-accent
   utilities and the .btn-cta / dot / badge rules all resolve through it. */
export function categoryThemeStyle(c: BrandCategory): CSSProperties {
  const base = CATEGORY_ACCENT_HEX[c];
  return {
    '--color-accent': base,
    '--accent': base,
    '--accent-light': `color-mix(in srgb, ${base} 72%, white)`,
    '--accent-strong': `color-mix(in srgb, ${base} 80%, black)`,
    '--color-accent-bg': `color-mix(in srgb, ${base} 9%, transparent)`,
    '--accent-bg': `color-mix(in srgb, ${base} 9%, transparent)`,
  } as CSSProperties;
}

type Bilingual = { en: string; zh: string };
type SloganPair = { primary: Bilingual; secondary: Bilingual };

/* Two-line slogans shown on each band and listing page (description coexists). */
export const CATEGORY_SLOGAN: Record<BrandCategory, SloganPair> = {
  tools: {
    primary: {
      en: 'Helpers that do the heavy lifting.',
      zh: '帮你扛重活的帮手。',
    },
    secondary: {
      en: 'Tools that work as hard as you do.',
      zh: '和你一样拼的工具。',
    },
  },
  games: {
    primary: {
      en: 'Unwinds for the overworked.',
      zh: '给过劳者的喘息。',
    },
    secondary: {
      en: 'Guilt-free breaks for busy minds.',
      zh: '给忙碌大脑的无愧疚休息。',
    },
  },
  tests: {
    primary: {
      en: 'Evaluations that see past the pay grade.',
      zh: '看见工资等级背后的人。',
    },
    secondary: {
      en: 'Finally, a test that works for you.',
      zh: '终于有一场为你而做的测试。',
    },
  },
  stories: {
    primary: {
      en: 'Stories that cut through the noise.',
      zh: '拆解技术、趋势和噪声。',
    },
    secondary: {
      en: 'Real insights, not just information.',
      zh: '真正的洞察，不只是信息。',
    },
  },
};

/* Punchier one-liners for the home hero and the About page. */
export const HERO_SLOGAN_LINES: {
  cat: BrandCategory;
  en: string;
  zh: string;
}[] = [
  {
    cat: 'tools',
    en: "Helpers that do the grunt work so you don't have to.",
    zh: '帮你扛下杂活，你不必亲自动手。',
  },
  {
    cat: 'games',
    en: 'Unwinds for when your brain feels like a fried egg.',
    zh: '当大脑像煎糊的蛋时，来放松一下。',
  },
  {
    cat: 'tests',
    en: "Evaluations that remind you you're more than your salary.",
    zh: '评估提醒你：你远不止一份薪水。',
  },
  {
    cat: 'stories',
    en: 'Stories that cut through the noise and the nonsense.',
    zh: '拆穿噪声与胡话的解读。',
  },
];
