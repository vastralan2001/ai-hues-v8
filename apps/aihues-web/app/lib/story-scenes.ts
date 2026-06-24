/* story-scenes.ts — per-article, hand-authored cover scenes for the Stories
   section. NO templates, NO randomness: every entry is a bespoke composition of
   vector primitives (interpreted by components/StoryArt.tsx) chosen to match
   that specific article, with simple, relevant motion. Coordinates are
   normalised 0..1; lengths/line-widths scale to the canvas. Authored in batches
   — slugs without an entry fall back to a minimal tag-tinted panel until their
   bespoke scene is written. */

export type Anim =
  | { k: 'pulse'; amp?: number; spd?: number; ph?: number }
  | { k: 'drift'; dx?: number; dy?: number; spd?: number; ph?: number }
  | { k: 'bob'; amp?: number; spd?: number; ph?: number }
  | { k: 'rot'; spd?: number }
  | { k: 'blink'; spd?: number; ph?: number }
  | { k: 'dash'; spd?: number };

interface Base {
  fill?: string;
  stroke?: string;
  lw?: number;
  op?: number;
  glow?: string;
  rot?: number;
  anim?: Anim;
}

export type El =
  | ({
      t: 'r';
      x: number;
      y: number;
      w: number;
      h: number;
      rad?: number;
    } & Base)
  | ({ t: 'c'; x: number; y: number; rad: number } & Base)
  | ({
      t: 'ln';
      a: [number, number];
      b: [number, number];
      dash?: [number, number];
    } & Base)
  | ({
      t: 'pl';
      pts: [number, number][];
      close?: boolean;
      dash?: [number, number];
    } & Base)
  | ({
      t: 'ar';
      x: number;
      y: number;
      rad: number;
      a0: number;
      a1: number;
    } & Base)
  | ({
      t: 'tx';
      x: number;
      y: number;
      s: string;
      size: number;
      fill: string;
      w?: number;
      align?: CanvasTextAlign;
    } & Base);

export interface StoryScene {
  bg: [string, string];
  el: El[];
}

/* ── per-article scenes ───────────────────────────────────────────────────── */
const SCENES: Record<string, StoryScene> = {
  // Growth — Product Hunt launch: a rising leaderboard + a bobbing upvote.
  'launching-on-product-hunt-what-worked-in-2026': {
    bg: ['#2a160f', '#140a06'],
    el: [
      {
        t: 'ln',
        a: [0.12, 0.8],
        b: [0.88, 0.8],
        stroke: 'rgba(255,255,255,0.22)',
        lw: 1.2,
      },
      { t: 'r', x: 0.18, y: 0.54, w: 0.13, h: 0.26, rad: 4, fill: '#e8855f' },
      { t: 'r', x: 0.37, y: 0.42, w: 0.13, h: 0.38, rad: 4, fill: '#e2693f' },
      {
        t: 'r',
        x: 0.56,
        y: 0.28,
        w: 0.13,
        h: 0.52,
        rad: 4,
        fill: '#da552f',
        glow: '#da552f',
      },
      {
        t: 'pl',
        pts: [
          [0.55, 0.2],
          [0.625, 0.1],
          [0.7, 0.2],
        ],
        stroke: '#ffd9c9',
        lw: 3.2,
        anim: { k: 'bob', amp: 0.03, spd: 1.6 },
      },
      {
        t: 'ln',
        a: [0.625, 0.12],
        b: [0.625, 0.23],
        stroke: '#ffd9c9',
        lw: 3.2,
        anim: { k: 'bob', amp: 0.03, spd: 1.6 },
      },
      { t: 'tx', x: 0.625, y: 0.52, s: '#1', size: 0.12, fill: '#fff', w: 900 },
    ],
  },

  // AI Tools — Claude vs GPT: two pulsing model orbs with a VS.
  'claude-3-7-vs-gpt-4o-which-one-actually-writes-better-code': {
    bg: ['#1c1530', '#0e0a1a'],
    el: [
      {
        t: 'c',
        x: 0.3,
        y: 0.45,
        rad: 0.14,
        fill: '#a07bf0',
        glow: '#a07bf0',
        anim: { k: 'pulse', amp: 0.08, spd: 1.4, ph: 0 },
      },
      {
        t: 'c',
        x: 0.7,
        y: 0.45,
        rad: 0.14,
        fill: '#46c7c7',
        glow: '#46c7c7',
        anim: { k: 'pulse', amp: 0.08, spd: 1.4, ph: 3.14 },
      },
      { t: 'tx', x: 0.3, y: 0.45, s: 'C', size: 0.14, fill: '#0e0a1a', w: 900 },
      { t: 'tx', x: 0.7, y: 0.45, s: 'G', size: 0.14, fill: '#0e0a1a', w: 900 },
      { t: 'tx', x: 0.5, y: 0.45, s: 'VS', size: 0.1, fill: '#fff', w: 900 },
      {
        t: 'r',
        x: 0.32,
        y: 0.74,
        w: 0.12,
        h: 0.025,
        rad: 2,
        fill: '#a07bf0',
        op: 0.7,
      },
      {
        t: 'r',
        x: 0.48,
        y: 0.74,
        w: 0.2,
        h: 0.025,
        rad: 2,
        fill: '#46c7c7',
        op: 0.7,
      },
      {
        t: 'r',
        x: 0.34,
        y: 0.8,
        w: 0.32,
        h: 0.025,
        rad: 2,
        fill: 'rgba(255,255,255,0.3)',
      },
    ],
  },

  // Growth — ASO: an app icon, twinkling stars, ranking bars.
  'app-store-optimization-in-2026-beyond-keywords': {
    bg: ['#241a0c', '#130d05'],
    el: [
      {
        t: 'r',
        x: 0.14,
        y: 0.28,
        w: 0.26,
        h: 0.26,
        rad: 28,
        fill: '#f0b429',
        glow: '#f0b429',
      },
      {
        t: 'tx',
        x: 0.27,
        y: 0.41,
        s: 'A',
        size: 0.14,
        fill: '#2a1d05',
        w: 900,
      },
      {
        t: 'tx',
        x: 0.17,
        y: 0.66,
        s: '★',
        size: 0.06,
        fill: '#ffd86b',
        anim: { k: 'blink', spd: 2, ph: 0 },
      },
      {
        t: 'tx',
        x: 0.23,
        y: 0.66,
        s: '★',
        size: 0.06,
        fill: '#ffd86b',
        anim: { k: 'blink', spd: 2, ph: 1 },
      },
      {
        t: 'tx',
        x: 0.29,
        y: 0.66,
        s: '★',
        size: 0.06,
        fill: '#ffd86b',
        anim: { k: 'blink', spd: 2, ph: 2 },
      },
      {
        t: 'tx',
        x: 0.35,
        y: 0.66,
        s: '★',
        size: 0.06,
        fill: '#ffd86b',
        anim: { k: 'blink', spd: 2, ph: 3 },
      },
      { t: 'r', x: 0.55, y: 0.32, w: 0.32, h: 0.05, rad: 3, fill: '#f0b429' },
      {
        t: 'r',
        x: 0.55,
        y: 0.44,
        w: 0.24,
        h: 0.05,
        rad: 3,
        fill: 'rgba(255,255,255,0.2)',
      },
      {
        t: 'r',
        x: 0.55,
        y: 0.56,
        w: 0.18,
        h: 0.05,
        rad: 3,
        fill: 'rgba(255,255,255,0.14)',
      },
    ],
  },

  // AI Tools — hidden costs: a coin stack with a glowing warning.
  'the-hidden-costs-of-ai-writing-tools-nobody-talks-about': {
    bg: ['#1c1530', '#0e0a1a'],
    el: [
      { t: 'r', x: 0.16, y: 0.62, w: 0.22, h: 0.07, rad: 30, fill: '#e0b34a' },
      { t: 'r', x: 0.16, y: 0.53, w: 0.22, h: 0.07, rad: 30, fill: '#f0c45a' },
      { t: 'r', x: 0.16, y: 0.44, w: 0.22, h: 0.07, rad: 30, fill: '#e0b34a' },
      {
        t: 'tx',
        x: 0.27,
        y: 0.475,
        s: '$',
        size: 0.06,
        fill: '#2a1d05',
        w: 900,
      },
      {
        t: 'pl',
        pts: [
          [0.62, 0.52],
          [0.76, 0.28],
          [0.9, 0.52],
        ],
        close: true,
        stroke: '#ff6b6b',
        lw: 3,
        glow: '#ff6b6b',
        anim: { k: 'bob', amp: 0.02, spd: 1.5 },
      },
      {
        t: 'tx',
        x: 0.76,
        y: 0.45,
        s: '!',
        size: 0.1,
        fill: '#ff6b6b',
        w: 900,
        anim: { k: 'bob', amp: 0.02, spd: 1.5 },
      },
    ],
  },

  // Indie Dev — solo founding: a winding journey path with a flag.
  'solo-founding-one-year-of-lessons-and-regrets': {
    bg: ['#12211c', '#0a0e0c'],
    el: [
      {
        t: 'pl',
        pts: [
          [0.1, 0.7],
          [0.25, 0.4],
          [0.4, 0.62],
          [0.55, 0.32],
          [0.7, 0.55],
          [0.86, 0.24],
        ],
        stroke: '#3ba776',
        lw: 3,
        op: 0.5,
      },
      {
        t: 'pl',
        pts: [
          [0.1, 0.7],
          [0.25, 0.4],
          [0.4, 0.62],
          [0.55, 0.32],
          [0.7, 0.55],
          [0.86, 0.24],
        ],
        stroke: '#9ff0c6',
        lw: 2,
        dash: [5, 6],
        anim: { k: 'dash', spd: 1.5 },
      },
      { t: 'c', x: 0.1, y: 0.7, rad: 0.028, fill: '#9ff0c6' },
      { t: 'ln', a: [0.86, 0.24], b: [0.86, 0.1], stroke: '#fff', lw: 2 },
      {
        t: 'pl',
        pts: [
          [0.86, 0.1],
          [0.95, 0.14],
          [0.86, 0.18],
        ],
        close: true,
        fill: '#e0683f',
      },
    ],
  },

  // Development — React Server Components: server rack → browser, data flowing.
  'react-server-components-a-practical-guide': {
    bg: ['#141a2e', '#0a0e18'],
    el: [
      {
        t: 'r',
        x: 0.1,
        y: 0.3,
        w: 0.26,
        h: 0.4,
        rad: 6,
        fill: 'rgba(255,255,255,0.05)',
        stroke: '#5a8cd6',
        lw: 1.2,
      },
      {
        t: 'r',
        x: 0.13,
        y: 0.34,
        w: 0.2,
        h: 0.07,
        rad: 3,
        fill: 'rgba(255,255,255,0.05)',
      },
      {
        t: 'r',
        x: 0.13,
        y: 0.45,
        w: 0.2,
        h: 0.07,
        rad: 3,
        fill: 'rgba(255,255,255,0.05)',
      },
      {
        t: 'r',
        x: 0.13,
        y: 0.56,
        w: 0.2,
        h: 0.07,
        rad: 3,
        fill: 'rgba(255,255,255,0.05)',
      },
      {
        t: 'c',
        x: 0.16,
        y: 0.375,
        rad: 0.012,
        fill: '#46e8a0',
        glow: '#46e8a0',
        anim: { k: 'blink', spd: 2, ph: 0 },
      },
      {
        t: 'c',
        x: 0.16,
        y: 0.485,
        rad: 0.012,
        fill: '#46e8a0',
        glow: '#46e8a0',
        anim: { k: 'blink', spd: 2, ph: 1.4 },
      },
      {
        t: 'c',
        x: 0.16,
        y: 0.595,
        rad: 0.012,
        fill: '#46e8a0',
        glow: '#46e8a0',
        anim: { k: 'blink', spd: 2, ph: 2.6 },
      },
      {
        t: 'ln',
        a: [0.36, 0.5],
        b: [0.55, 0.5],
        stroke: '#7cc0ee',
        lw: 2,
        dash: [5, 6],
        anim: { k: 'dash', spd: 2 },
      },
      {
        t: 'r',
        x: 0.55,
        y: 0.3,
        w: 0.34,
        h: 0.4,
        rad: 8,
        fill: 'rgba(255,255,255,0.05)',
        stroke: '#7cc0ee',
        lw: 1.2,
      },
      {
        t: 'ln',
        a: [0.55, 0.39],
        b: [0.89, 0.39],
        stroke: 'rgba(124,192,238,0.4)',
        lw: 1,
      },
      {
        t: 'r',
        x: 0.59,
        y: 0.45,
        w: 0.18,
        h: 0.03,
        rad: 2,
        fill: '#7cc0ee',
        op: 0.7,
      },
      {
        t: 'r',
        x: 0.59,
        y: 0.52,
        w: 0.24,
        h: 0.03,
        rad: 2,
        fill: 'rgba(255,255,255,0.25)',
      },
      {
        t: 'r',
        x: 0.59,
        y: 0.59,
        w: 0.14,
        h: 0.03,
        rad: 2,
        fill: 'rgba(255,255,255,0.2)',
      },
    ],
  },

  // AI Tools — Cursor editor: a code window, blinking caret, AI sparkle.
  'cursor-editor-10-features-that-will-change-how-you-code': {
    bg: ['#1c1530', '#0e0a1a'],
    el: [
      {
        t: 'r',
        x: 0.12,
        y: 0.16,
        w: 0.76,
        h: 0.68,
        rad: 10,
        fill: 'rgba(255,255,255,0.05)',
        stroke: 'rgba(255,255,255,0.12)',
        lw: 1,
      },
      { t: 'c', x: 0.17, y: 0.23, rad: 0.012, fill: '#ff5f57' },
      { t: 'c', x: 0.21, y: 0.23, rad: 0.012, fill: '#febc2e' },
      { t: 'c', x: 0.25, y: 0.23, rad: 0.012, fill: '#28c840' },
      {
        t: 'r',
        x: 0.17,
        y: 0.36,
        w: 0.28,
        h: 0.028,
        rad: 2,
        fill: '#a07bf0',
        op: 0.8,
      },
      {
        t: 'r',
        x: 0.22,
        y: 0.45,
        w: 0.36,
        h: 0.028,
        rad: 2,
        fill: '#46c7c7',
        op: 0.8,
      },
      {
        t: 'r',
        x: 0.22,
        y: 0.54,
        w: 0.2,
        h: 0.028,
        rad: 2,
        fill: 'rgba(255,255,255,0.4)',
      },
      {
        t: 'r',
        x: 0.17,
        y: 0.63,
        w: 0.3,
        h: 0.028,
        rad: 2,
        fill: '#a07bf0',
        op: 0.6,
      },
      {
        t: 'r',
        x: 0.5,
        y: 0.52,
        w: 0.012,
        h: 0.1,
        fill: '#c9b3ff',
        anim: { k: 'blink', spd: 3 },
      },
      {
        t: 'tx',
        x: 0.76,
        y: 0.3,
        s: '✦',
        size: 0.09,
        fill: '#c9b3ff',
        glow: '#a07bf0',
        anim: { k: 'pulse', amp: 0.2, spd: 2 },
      },
    ],
  },

  // Growth — cold email: an envelope with bobbing reply bubbles.
  'cold-email-that-gets-replies-templates-and-psychology': {
    bg: ['#241a0c', '#130d05'],
    el: [
      {
        t: 'r',
        x: 0.14,
        y: 0.4,
        w: 0.34,
        h: 0.24,
        rad: 6,
        fill: '#f0b429',
        glow: '#f0b429',
      },
      {
        t: 'pl',
        pts: [
          [0.14, 0.42],
          [0.31, 0.55],
          [0.48, 0.42],
        ],
        stroke: '#2a1d05',
        lw: 2.4,
      },
      {
        t: 'r',
        x: 0.6,
        y: 0.28,
        w: 0.26,
        h: 0.12,
        rad: 14,
        fill: '#ffd86b',
        anim: { k: 'bob', amp: 0.02, spd: 1.4, ph: 0 },
      },
      {
        t: 'r',
        x: 0.58,
        y: 0.52,
        w: 0.22,
        h: 0.1,
        rad: 12,
        fill: 'rgba(255,255,255,0.22)',
        anim: { k: 'bob', amp: 0.02, spd: 1.4, ph: 1.6 },
      },
      {
        t: 'tx',
        x: 0.73,
        y: 0.34,
        s: '↩',
        size: 0.07,
        fill: '#2a1d05',
        w: 900,
        anim: { k: 'bob', amp: 0.02, spd: 1.4, ph: 0 },
      },
    ],
  },

  // Productivity — deep work: a sweeping focus ring with a pulsing core.
  'deep-work-in-the-age-of-ai-is-focus-still-possible': {
    bg: ['#241a0c', '#130d05'],
    el: [
      {
        t: 'c',
        x: 0.5,
        y: 0.48,
        rad: 0.26,
        stroke: 'rgba(255,255,255,0.12)',
        lw: 5,
      },
      {
        t: 'ar',
        x: 0.5,
        y: 0.48,
        rad: 0.26,
        a0: -1.57,
        a1: 1.4,
        stroke: '#f0b429',
        lw: 5,
        glow: '#f0b429',
        anim: { k: 'rot', spd: 0.5 },
      },
      {
        t: 'c',
        x: 0.5,
        y: 0.48,
        rad: 0.09,
        fill: '#f0b429',
        glow: '#f0b429',
        anim: { k: 'pulse', amp: 0.1, spd: 1.2 },
      },
      { t: 'tx', x: 0.5, y: 0.48, s: '∞', size: 0.1, fill: '#2a1d05', w: 900 },
    ],
  },

  // Growth — 2026 toolkit: a dense grid of tool tiles behind a 70+ count.
  'growth-tools-2026': {
    bg: ['#241a0c', '#130d05'],
    el: [
      ...Array.from({ length: 24 }, (_, i): El => {
        const col = i % 6;
        const row = Math.floor(i / 6);
        const palette = ['#f0b429', '#e2693f', '#83d8ad', '#7cc0ee', '#c9b3ff'];
        return {
          t: 'r',
          x: 0.12 + col * 0.13,
          y: 0.2 + row * 0.16,
          w: 0.1,
          h: 0.1,
          rad: 4,
          fill: palette[(i * 2 + row) % palette.length],
          op: 0.5,
        };
      }),
      {
        t: 'tx',
        x: 0.5,
        y: 0.5,
        s: '70+',
        size: 0.22,
        fill: '#fff',
        w: 900,
        glow: 'rgba(0,0,0,0.5)',
      },
    ],
  },

  // Growth — LinkedIn brand: an "in" badge wired to a small network.
  'building-a-personal-brand-on-linkedin-as-a-developer': {
    bg: ['#0d1b2a', '#070f18'],
    el: [
      {
        t: 'ln',
        a: [0.23, 0.4],
        b: [0.62, 0.5],
        stroke: '#2a8fe0',
        lw: 1.6,
        dash: [4, 5],
        anim: { k: 'dash', spd: 1.4 },
      },
      {
        t: 'ln',
        a: [0.62, 0.5],
        b: [0.82, 0.28],
        stroke: '#2a8fe0',
        lw: 1.6,
        dash: [4, 5],
        anim: { k: 'dash', spd: 1.4 },
      },
      {
        t: 'ln',
        a: [0.62, 0.5],
        b: [0.8, 0.72],
        stroke: '#2a8fe0',
        lw: 1.6,
        dash: [4, 5],
        anim: { k: 'dash', spd: 1.4 },
      },
      {
        t: 'r',
        x: 0.14,
        y: 0.31,
        w: 0.18,
        h: 0.18,
        rad: 6,
        fill: '#2a8fe0',
        glow: '#2a8fe0',
      },
      { t: 'tx', x: 0.23, y: 0.41, s: 'in', size: 0.1, fill: '#fff', w: 900 },
      { t: 'c', x: 0.62, y: 0.5, rad: 0.08, fill: '#7cc0ee', glow: '#7cc0ee' },
      { t: 'c', x: 0.82, y: 0.28, rad: 0.04, fill: '#cfe6fb' },
      { t: 'c', x: 0.8, y: 0.72, rad: 0.04, fill: '#cfe6fb' },
    ],
  },

  // Productivity — second brain: a linked note graph around a pulsing hub.
  'the-developer-s-second-brain-how-i-organize-everything': {
    bg: ['#241a0c', '#130d05'],
    el: [
      {
        t: 'ln',
        a: [0.5, 0.48],
        b: [0.22, 0.26],
        stroke: '#f0b429',
        lw: 1.4,
        dash: [4, 5],
        anim: { k: 'dash', spd: 1.2 },
      },
      {
        t: 'ln',
        a: [0.5, 0.48],
        b: [0.8, 0.24],
        stroke: '#f0b429',
        lw: 1.4,
        dash: [4, 5],
        anim: { k: 'dash', spd: 1.2 },
      },
      {
        t: 'ln',
        a: [0.5, 0.48],
        b: [0.24, 0.72],
        stroke: '#f0b429',
        lw: 1.4,
        dash: [4, 5],
        anim: { k: 'dash', spd: 1.2 },
      },
      {
        t: 'ln',
        a: [0.5, 0.48],
        b: [0.78, 0.74],
        stroke: '#f0b429',
        lw: 1.4,
        dash: [4, 5],
        anim: { k: 'dash', spd: 1.2 },
      },
      { t: 'r', x: 0.16, y: 0.2, w: 0.13, h: 0.1, rad: 3, fill: '#ffd86b' },
      { t: 'r', x: 0.73, y: 0.18, w: 0.13, h: 0.1, rad: 3, fill: '#ffd86b' },
      { t: 'r', x: 0.18, y: 0.68, w: 0.13, h: 0.1, rad: 3, fill: '#ffd86b' },
      { t: 'r', x: 0.71, y: 0.7, w: 0.13, h: 0.1, rad: 3, fill: '#ffd86b' },
      {
        t: 'c',
        x: 0.5,
        y: 0.48,
        rad: 0.08,
        fill: '#f0b429',
        glow: '#f0b429',
        anim: { k: 'pulse', amp: 0.12, spd: 1.4 },
      },
    ],
  },

  // AI Tools — research switch: an answer with numbered citation chips.
  'why-i-switched-from-chatgpt-to-perplexity-for-research': {
    bg: ['#10211c', '#08120e'],
    el: [
      { t: 'r', x: 0.14, y: 0.24, w: 0.5, h: 0.06, rad: 4, fill: '#2bb6a3' },
      {
        t: 'r',
        x: 0.14,
        y: 0.4,
        w: 0.62,
        h: 0.035,
        rad: 2,
        fill: 'rgba(255,255,255,0.3)',
      },
      {
        t: 'r',
        x: 0.14,
        y: 0.48,
        w: 0.54,
        h: 0.035,
        rad: 2,
        fill: 'rgba(255,255,255,0.22)',
      },
      {
        t: 'r',
        x: 0.14,
        y: 0.56,
        w: 0.46,
        h: 0.035,
        rad: 2,
        fill: 'rgba(255,255,255,0.18)',
      },
      {
        t: 'c',
        x: 0.2,
        y: 0.72,
        rad: 0.035,
        fill: '#46c7c7',
        glow: '#46c7c7',
        anim: { k: 'pulse', amp: 0.12, spd: 1.6, ph: 0 },
      },
      { t: 'tx', x: 0.2, y: 0.72, s: '1', size: 0.05, fill: '#08120e', w: 900 },
      {
        t: 'c',
        x: 0.32,
        y: 0.72,
        rad: 0.035,
        fill: '#46c7c7',
        glow: '#46c7c7',
        anim: { k: 'pulse', amp: 0.12, spd: 1.6, ph: 1.5 },
      },
      {
        t: 'tx',
        x: 0.32,
        y: 0.72,
        s: '2',
        size: 0.05,
        fill: '#08120e',
        w: 900,
      },
      {
        t: 'tx',
        x: 0.8,
        y: 0.3,
        s: '✦',
        size: 0.08,
        fill: '#7af0e0',
        glow: '#2bb6a3',
        anim: { k: 'pulse', amp: 0.2, spd: 2 },
      },
    ],
  },

  // Indie Dev — bootstrapping: a sprout rising from a coin, big $0.
  'the-bootstrapper-s-guide-to-raising-zero-dollars': {
    bg: ['#12211c', '#0a0e0c'],
    el: [
      { t: 'c', x: 0.3, y: 0.76, rad: 0.08, fill: '#e0b34a', glow: '#e0b34a' },
      { t: 'tx', x: 0.3, y: 0.76, s: '$', size: 0.07, fill: '#2a1d05', w: 900 },
      {
        t: 'pl',
        pts: [
          [0.3, 0.68],
          [0.3, 0.4],
        ],
        stroke: '#3ba776',
        lw: 3,
      },
      {
        t: 'pl',
        pts: [
          [0.3, 0.5],
          [0.18, 0.42],
          [0.3, 0.46],
        ],
        close: true,
        fill: '#46e8a0',
        anim: { k: 'bob', amp: 0.02, spd: 1.3, ph: 0 },
      },
      {
        t: 'pl',
        pts: [
          [0.3, 0.44],
          [0.42, 0.34],
          [0.3, 0.4],
        ],
        close: true,
        fill: '#83d8ad',
        anim: { k: 'bob', amp: 0.02, spd: 1.3, ph: 1.6 },
      },
      {
        t: 'tx',
        x: 0.68,
        y: 0.46,
        s: '$0',
        size: 0.24,
        fill: '#9ff0c6',
        w: 900,
        glow: '#3ba776',
      },
    ],
  },

  // Development — state of CSS: braces around utility-class chips.
  'the-state-of-css-in-2026-tailwind-panda-and-beyond': {
    bg: ['#141a2e', '#0a0e18'],
    el: [
      { t: 'tx', x: 0.14, y: 0.5, s: '{', size: 0.4, fill: '#7cc0ee', w: 400 },
      { t: 'tx', x: 0.86, y: 0.5, s: '}', size: 0.4, fill: '#7cc0ee', w: 400 },
      {
        t: 'r',
        x: 0.3,
        y: 0.3,
        w: 0.18,
        h: 0.08,
        rad: 12,
        fill: '#38bdf8',
        op: 0.85,
      },
      {
        t: 'r',
        x: 0.52,
        y: 0.3,
        w: 0.16,
        h: 0.08,
        rad: 12,
        fill: '#a78bfa',
        op: 0.85,
      },
      {
        t: 'r',
        x: 0.32,
        y: 0.46,
        w: 0.22,
        h: 0.08,
        rad: 12,
        fill: '#f472b6',
        op: 0.85,
      },
      {
        t: 'r',
        x: 0.34,
        y: 0.62,
        w: 0.14,
        h: 0.08,
        rad: 12,
        fill: '#34d399',
        op: 0.85,
      },
      {
        t: 'r',
        x: 0.52,
        y: 0.62,
        w: 0.16,
        h: 0.08,
        rad: 12,
        fill: '#fbbf24',
        op: 0.85,
        anim: { k: 'pulse', amp: 0.06, spd: 1.5 },
      },
    ],
  },

  // Content — AI content strategy: cascading docs + a human-touch heart.
  'ai-content-strategy': {
    bg: ['#1c1530', '#0e0a1a'],
    el: [
      {
        t: 'r',
        x: 0.18,
        y: 0.26,
        w: 0.3,
        h: 0.4,
        rad: 8,
        fill: 'rgba(255,255,255,0.06)',
        stroke: 'rgba(255,255,255,0.18)',
        lw: 1,
      },
      {
        t: 'r',
        x: 0.24,
        y: 0.32,
        w: 0.3,
        h: 0.4,
        rad: 8,
        fill: 'rgba(255,255,255,0.08)',
        stroke: 'rgba(255,255,255,0.2)',
        lw: 1,
      },
      {
        t: 'r',
        x: 0.3,
        y: 0.38,
        w: 0.3,
        h: 0.4,
        rad: 8,
        fill: 'rgba(255,255,255,0.1)',
        stroke: '#a07bf0',
        lw: 1.2,
      },
      { t: 'r', x: 0.34, y: 0.44, w: 0.18, h: 0.025, rad: 2, fill: '#a07bf0' },
      {
        t: 'r',
        x: 0.34,
        y: 0.5,
        w: 0.22,
        h: 0.025,
        rad: 2,
        fill: 'rgba(255,255,255,0.3)',
      },
      {
        t: 'r',
        x: 0.34,
        y: 0.56,
        w: 0.16,
        h: 0.025,
        rad: 2,
        fill: 'rgba(255,255,255,0.25)',
      },
      {
        t: 'tx',
        x: 0.74,
        y: 0.4,
        s: '♥',
        size: 0.12,
        fill: '#ff8ab4',
        glow: '#ff5a9e',
        anim: { k: 'pulse', amp: 0.12, spd: 1.3 },
      },
    ],
  },
};

const TAG_HUE: Record<string, number> = {
  Growth: 150,
  'AI Tools': 270,
  'Indie Dev': 158,
  Development: 212,
  Productivity: 36,
  Content: 286,
  SEO: 192,
  'Reddit Marketing': 14,
  'Social Media': 200,
  'KOL Marketing': 330,
  Product: 250,
};

/* Minimal, deterministic placeholder for articles whose bespoke scene is not
   authored yet — a tag-tinted panel with the topic initial. Replaced as scenes
   are written. */
function fallbackScene(slug: string, tag: string): StoryScene {
  const hue = TAG_HUE[tag] ?? 240;
  return {
    bg: [`hsl(${hue} 40% 14%)`, `hsl(${(hue + 22) % 360} 46% 7%)`],
    el: [
      {
        t: 'c',
        x: 0.5,
        y: 0.46,
        rad: 0.2,
        stroke: `hsl(${hue} 70% 60%)`,
        lw: 2,
        op: 0.5,
      },
      {
        t: 'tx',
        x: 0.5,
        y: 0.46,
        s: tag.slice(0, 1),
        size: 0.22,
        fill: `hsl(${hue} 80% 70%)`,
        w: 900,
      },
    ],
  };
}

export function getStoryScene(slug: string, tag: string): StoryScene {
  return SCENES[slug] ?? fallbackScene(slug, tag);
}
