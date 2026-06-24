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
  // Growth — dark side of growth hacking: a spike that pumps then crashes.
  'the-dark-side-of-growth-hacking-what-not-to-do': {
    bg: ['#2a0f0f', '#140707'],
    el: [
      {
        t: 'ln',
        a: [0.1, 0.82],
        b: [0.9, 0.82],
        stroke: 'rgba(255,255,255,0.18)',
        lw: 1.2,
      },
      {
        t: 'pl',
        pts: [
          [0.12, 0.66],
          [0.3, 0.36],
          [0.46, 0.2],
          [0.6, 0.52],
          [0.74, 0.8],
        ],
        stroke: '#ff6b6b',
        lw: 3,
        glow: '#ff6b6b',
      },
      {
        t: 'pl',
        pts: [
          [0.12, 0.66],
          [0.3, 0.36],
          [0.46, 0.2],
          [0.6, 0.52],
          [0.74, 0.8],
        ],
        stroke: '#ffd0d0',
        lw: 1.6,
        dash: [5, 6],
        anim: { k: 'dash', spd: 1.6 },
      },
      {
        t: 'pl',
        pts: [
          [0.66, 0.74],
          [0.74, 0.82],
          [0.82, 0.74],
        ],
        stroke: '#ff6b6b',
        lw: 2.6,
      },
      {
        t: 'tx',
        x: 0.5,
        y: 0.16,
        s: '!',
        size: 0.1,
        fill: '#ff6b6b',
        w: 900,
        anim: { k: 'blink', spd: 2.5 },
      },
    ],
  },

  // Productivity — time blocking: a day column with stacked time blocks.
  'time-blocking-for-creatives-a-realistic-guide': {
    bg: ['#241a0c', '#120d04'],
    el: [
      {
        t: 'ln',
        a: [0.27, 0.2],
        b: [0.3, 0.2],
        stroke: 'rgba(255,255,255,0.3)',
        lw: 1,
      },
      {
        t: 'ln',
        a: [0.27, 0.45],
        b: [0.3, 0.45],
        stroke: 'rgba(255,255,255,0.3)',
        lw: 1,
      },
      {
        t: 'ln',
        a: [0.27, 0.7],
        b: [0.3, 0.7],
        stroke: 'rgba(255,255,255,0.3)',
        lw: 1,
      },
      {
        t: 'r',
        x: 0.32,
        y: 0.14,
        w: 0.36,
        h: 0.72,
        rad: 8,
        fill: 'rgba(255,255,255,0.05)',
        stroke: 'rgba(255,255,255,0.14)',
        lw: 1,
      },
      { t: 'r', x: 0.35, y: 0.18, w: 0.3, h: 0.14, rad: 4, fill: '#f0b429' },
      { t: 'r', x: 0.35, y: 0.34, w: 0.3, h: 0.2, rad: 4, fill: '#7cc0ee' },
      { t: 'r', x: 0.35, y: 0.56, w: 0.3, h: 0.1, rad: 4, fill: '#83d8ad' },
      {
        t: 'r',
        x: 0.35,
        y: 0.68,
        w: 0.3,
        h: 0.14,
        rad: 4,
        fill: '#c9a0f0',
        anim: { k: 'pulse', amp: 0.03, spd: 1.4 },
      },
    ],
  },

  // AI Tools — Midjourney v7: a generated-art frame, good/bad/weird orbs.
  'midjourney-v7-review-the-good-the-bad-and-the-weird': {
    bg: ['#1c1530', '#0e0a1a'],
    el: [
      {
        t: 'r',
        x: 0.2,
        y: 0.2,
        w: 0.6,
        h: 0.6,
        rad: 10,
        fill: 'rgba(255,255,255,0.04)',
        stroke: 'rgba(255,255,255,0.14)',
        lw: 1,
      },
      {
        t: 'c',
        x: 0.36,
        y: 0.4,
        rad: 0.1,
        fill: '#a07bf0',
        glow: '#a07bf0',
        anim: { k: 'pulse', amp: 0.06, spd: 1.3, ph: 0 },
      },
      {
        t: 'c',
        x: 0.6,
        y: 0.38,
        rad: 0.08,
        fill: '#46c7c7',
        glow: '#46c7c7',
        anim: { k: 'pulse', amp: 0.06, spd: 1.3, ph: 1 },
      },
      {
        t: 'c',
        x: 0.5,
        y: 0.62,
        rad: 0.09,
        fill: '#ff8ab4',
        glow: '#ff5a9e',
        anim: { k: 'pulse', amp: 0.06, spd: 1.3, ph: 2 },
      },
      {
        t: 'tx',
        x: 0.74,
        y: 0.26,
        s: '✦',
        size: 0.08,
        fill: '#c9b3ff',
        glow: '#a07bf0',
        anim: { k: 'pulse', amp: 0.2, spd: 2 },
      },
    ],
  },

  // Growth — first 1000 users, no ads: a big count, organic people, crossed-out $.
  'how-to-get-your-first-1000-users-without-paid-ads': {
    bg: ['#241a0c', '#130d05'],
    el: [
      {
        t: 'tx',
        x: 0.5,
        y: 0.4,
        s: '1000',
        size: 0.2,
        fill: '#f0b429',
        w: 900,
        glow: '#f0b429',
      },
      {
        t: 'c',
        x: 0.3,
        y: 0.68,
        rad: 0.03,
        fill: '#83d8ad',
        anim: { k: 'bob', amp: 0.03, spd: 1.4, ph: 0 },
      },
      {
        t: 'c',
        x: 0.4,
        y: 0.72,
        rad: 0.03,
        fill: '#83d8ad',
        anim: { k: 'bob', amp: 0.03, spd: 1.4, ph: 0.8 },
      },
      {
        t: 'c',
        x: 0.5,
        y: 0.66,
        rad: 0.03,
        fill: '#83d8ad',
        anim: { k: 'bob', amp: 0.03, spd: 1.4, ph: 1.6 },
      },
      {
        t: 'c',
        x: 0.6,
        y: 0.72,
        rad: 0.03,
        fill: '#83d8ad',
        anim: { k: 'bob', amp: 0.03, spd: 1.4, ph: 2.4 },
      },
      {
        t: 'c',
        x: 0.7,
        y: 0.68,
        rad: 0.03,
        fill: '#83d8ad',
        anim: { k: 'bob', amp: 0.03, spd: 1.4, ph: 3.2 },
      },
      {
        t: 'tx',
        x: 0.78,
        y: 0.24,
        s: '$',
        size: 0.1,
        fill: 'rgba(255,255,255,0.4)',
        w: 900,
      },
      { t: 'ln', a: [0.71, 0.3], b: [0.85, 0.17], stroke: '#ff6b6b', lw: 3 },
    ],
  },

  // SEO — keyword research: ranked keyword bars under a magnifier.
  'keyword-research-in-2026-beyond-search-volume': {
    bg: ['#10211c', '#08120e'],
    el: [
      { t: 'r', x: 0.14, y: 0.3, w: 0.4, h: 0.05, rad: 3, fill: '#2bb6a3' },
      {
        t: 'r',
        x: 0.14,
        y: 0.42,
        w: 0.32,
        h: 0.05,
        rad: 3,
        fill: 'rgba(255,255,255,0.25)',
      },
      {
        t: 'r',
        x: 0.14,
        y: 0.54,
        w: 0.24,
        h: 0.05,
        rad: 3,
        fill: 'rgba(255,255,255,0.18)',
      },
      {
        t: 'c',
        x: 0.72,
        y: 0.42,
        rad: 0.16,
        stroke: '#7af0e0',
        lw: 3.4,
        glow: '#2bb6a3',
      },
      { t: 'ln', a: [0.83, 0.53], b: [0.92, 0.62], stroke: '#7af0e0', lw: 3.4 },
    ],
  },

  // Development — edge computing: a core wired to nodes at the edges.
  'edge-computing-when-to-use-it-when-to-skip-it': {
    bg: ['#141a2e', '#0a0e18'],
    el: [
      {
        t: 'ln',
        a: [0.5, 0.48],
        b: [0.16, 0.22],
        stroke: '#5a8cd6',
        lw: 1.4,
        dash: [4, 5],
        anim: { k: 'dash', spd: 1.6 },
      },
      {
        t: 'ln',
        a: [0.5, 0.48],
        b: [0.84, 0.22],
        stroke: '#5a8cd6',
        lw: 1.4,
        dash: [4, 5],
        anim: { k: 'dash', spd: 1.6 },
      },
      {
        t: 'ln',
        a: [0.5, 0.48],
        b: [0.18, 0.74],
        stroke: '#5a8cd6',
        lw: 1.4,
        dash: [4, 5],
        anim: { k: 'dash', spd: 1.6 },
      },
      {
        t: 'ln',
        a: [0.5, 0.48],
        b: [0.82, 0.76],
        stroke: '#5a8cd6',
        lw: 1.4,
        dash: [4, 5],
        anim: { k: 'dash', spd: 1.6 },
      },
      { t: 'c', x: 0.16, y: 0.22, rad: 0.04, fill: '#7cc0ee' },
      { t: 'c', x: 0.84, y: 0.22, rad: 0.04, fill: '#7cc0ee' },
      { t: 'c', x: 0.18, y: 0.74, rad: 0.04, fill: '#7cc0ee' },
      { t: 'c', x: 0.82, y: 0.76, rad: 0.04, fill: '#7cc0ee' },
      {
        t: 'c',
        x: 0.5,
        y: 0.48,
        rad: 0.08,
        fill: '#5a8cd6',
        glow: '#5a8cd6',
        anim: { k: 'pulse', amp: 0.08, spd: 1.3 },
      },
    ],
  },

  // AI Tools — local LLMs: a chip with a mini network under a local roof.
  'running-llms-locally-a-complete-setup-guide-for-2026': {
    bg: ['#1c1530', '#0e0a1a'],
    el: [
      {
        t: 'pl',
        pts: [
          [0.3, 0.34],
          [0.5, 0.18],
          [0.7, 0.34],
        ],
        stroke: '#46c7c7',
        lw: 2.4,
      },
      {
        t: 'r',
        x: 0.34,
        y: 0.34,
        w: 0.32,
        h: 0.34,
        rad: 8,
        fill: 'rgba(255,255,255,0.06)',
        stroke: '#a07bf0',
        lw: 1.6,
        glow: '#a07bf0',
      },
      { t: 'ln', a: [0.42, 0.34], b: [0.42, 0.29], stroke: '#a07bf0', lw: 2 },
      { t: 'ln', a: [0.5, 0.34], b: [0.5, 0.29], stroke: '#a07bf0', lw: 2 },
      { t: 'ln', a: [0.58, 0.34], b: [0.58, 0.29], stroke: '#a07bf0', lw: 2 },
      { t: 'ln', a: [0.42, 0.68], b: [0.42, 0.73], stroke: '#a07bf0', lw: 2 },
      { t: 'ln', a: [0.58, 0.68], b: [0.58, 0.73], stroke: '#a07bf0', lw: 2 },
      {
        t: 'c',
        x: 0.44,
        y: 0.46,
        rad: 0.018,
        fill: '#c9b3ff',
        anim: { k: 'blink', spd: 2, ph: 0 },
      },
      {
        t: 'c',
        x: 0.56,
        y: 0.46,
        rad: 0.018,
        fill: '#c9b3ff',
        anim: { k: 'blink', spd: 2, ph: 1.2 },
      },
      {
        t: 'c',
        x: 0.5,
        y: 0.57,
        rad: 0.018,
        fill: '#c9b3ff',
        anim: { k: 'blink', spd: 2, ph: 2.2 },
      },
      { t: 'ln', a: [0.44, 0.46], b: [0.56, 0.46], stroke: '#a07bf0', lw: 1 },
      { t: 'ln', a: [0.44, 0.46], b: [0.5, 0.57], stroke: '#a07bf0', lw: 1 },
      { t: 'ln', a: [0.56, 0.46], b: [0.5, 0.57], stroke: '#a07bf0', lw: 1 },
    ],
  },

  // Indie Dev — profit over VC: a struck-out money bag, a rising profit line.
  'why-i-stopped-chasing-vc-and-started-building-for-profit': {
    bg: ['#12211c', '#0a0e0c'],
    el: [
      {
        t: 'c',
        x: 0.3,
        y: 0.42,
        rad: 0.12,
        stroke: 'rgba(255,255,255,0.4)',
        lw: 2,
      },
      {
        t: 'tx',
        x: 0.3,
        y: 0.42,
        s: '$',
        size: 0.12,
        fill: 'rgba(255,255,255,0.4)',
        w: 900,
      },
      { t: 'ln', a: [0.2, 0.52], b: [0.4, 0.32], stroke: '#ff6b6b', lw: 3 },
      {
        t: 'pl',
        pts: [
          [0.55, 0.7],
          [0.68, 0.55],
          [0.78, 0.6],
          [0.9, 0.3],
        ],
        stroke: '#46e8a0',
        lw: 3,
        glow: '#3ba776',
      },
      {
        t: 'pl',
        pts: [
          [0.84, 0.31],
          [0.9, 0.29],
          [0.87, 0.39],
        ],
        stroke: '#46e8a0',
        lw: 2.6,
      },
    ],
  },

  // Productivity — automation scripts: a spinning gear, a terminal, 10h saved.
  'automation-scripts-that-save-me-10-hours-a-week': {
    bg: ['#241a0c', '#130d05'],
    el: [
      {
        t: 'r',
        x: 0.12,
        y: 0.3,
        w: 0.42,
        h: 0.4,
        rad: 8,
        fill: 'rgba(255,255,255,0.05)',
        stroke: 'rgba(255,255,255,0.14)',
        lw: 1,
      },
      {
        t: 'tx',
        x: 0.18,
        y: 0.4,
        s: '>_',
        size: 0.07,
        fill: '#83d8ad',
        w: 800,
        align: 'left',
      },
      {
        t: 'r',
        x: 0.18,
        y: 0.5,
        w: 0.22,
        h: 0.03,
        rad: 2,
        fill: '#83d8ad',
        op: 0.7,
      },
      {
        t: 'r',
        x: 0.18,
        y: 0.57,
        w: 0.3,
        h: 0.03,
        rad: 2,
        fill: 'rgba(255,255,255,0.25)',
      },
      {
        t: 'tx',
        x: 0.74,
        y: 0.4,
        s: '⚙',
        size: 0.2,
        fill: '#f0b429',
        glow: '#f0b429',
        anim: { k: 'rot', spd: 0.5 },
      },
      { t: 'tx', x: 0.78, y: 0.68, s: '10h', size: 0.09, fill: '#fff', w: 900 },
    ],
  },

  // SEO — keywords to intent: a keyword chip arrowing into a bullseye.
  'seo-2026-trends': {
    bg: ['#10211c', '#08120e'],
    el: [
      { t: 'r', x: 0.1, y: 0.42, w: 0.24, h: 0.1, rad: 14, fill: '#2bb6a3' },
      {
        t: 'tx',
        x: 0.22,
        y: 0.47,
        s: 'kw',
        size: 0.05,
        fill: '#08120e',
        w: 900,
      },
      {
        t: 'ln',
        a: [0.36, 0.47],
        b: [0.56, 0.47],
        stroke: '#7af0e0',
        lw: 2.6,
        dash: [5, 5],
        anim: { k: 'dash', spd: 1.6 },
      },
      {
        t: 'pl',
        pts: [
          [0.52, 0.43],
          [0.57, 0.47],
          [0.52, 0.51],
        ],
        stroke: '#7af0e0',
        lw: 2.6,
      },
      { t: 'c', x: 0.74, y: 0.47, rad: 0.16, stroke: '#7af0e0', lw: 2.6 },
      { t: 'c', x: 0.74, y: 0.47, rad: 0.1, stroke: '#46c7c7', lw: 2.6 },
      {
        t: 'c',
        x: 0.74,
        y: 0.47,
        rad: 0.04,
        fill: '#ff6b6b',
        glow: '#ff6b6b',
        anim: { k: 'pulse', amp: 0.12, spd: 1.5 },
      },
    ],
  },

  // Growth — SaaS pricing: three tiers, the middle one featured.
  'saas-pricing-strategies-that-actually-convert-in-2026': {
    bg: ['#241a0c', '#130d05'],
    el: [
      {
        t: 'r',
        x: 0.14,
        y: 0.46,
        w: 0.18,
        h: 0.34,
        rad: 8,
        fill: 'rgba(255,255,255,0.06)',
        stroke: 'rgba(255,255,255,0.14)',
        lw: 1,
      },
      {
        t: 'r',
        x: 0.4,
        y: 0.32,
        w: 0.2,
        h: 0.48,
        rad: 8,
        fill: '#f0b429',
        glow: '#f0b429',
      },
      {
        t: 'r',
        x: 0.68,
        y: 0.46,
        w: 0.18,
        h: 0.34,
        rad: 8,
        fill: 'rgba(255,255,255,0.06)',
        stroke: 'rgba(255,255,255,0.14)',
        lw: 1,
      },
      { t: 'tx', x: 0.5, y: 0.46, s: '$', size: 0.08, fill: '#2a1d05', w: 900 },
      {
        t: 'tx',
        x: 0.5,
        y: 0.26,
        s: '★',
        size: 0.05,
        fill: '#ffd86b',
        anim: { k: 'pulse', amp: 0.15, spd: 1.6 },
      },
    ],
  },

  // SEO — technical SEO for SPAs: a browser with a tag and a crawling bot path.
  'technical-seo-for-single-page-applications': {
    bg: ['#10211c', '#08120e'],
    el: [
      {
        t: 'r',
        x: 0.16,
        y: 0.24,
        w: 0.68,
        h: 0.5,
        rad: 10,
        fill: 'rgba(255,255,255,0.05)',
        stroke: '#2bb6a3',
        lw: 1.4,
      },
      {
        t: 'ln',
        a: [0.16, 0.34],
        b: [0.84, 0.34],
        stroke: 'rgba(43,182,163,0.4)',
        lw: 1,
      },
      {
        t: 'tx',
        x: 0.5,
        y: 0.52,
        s: '</>',
        size: 0.12,
        fill: '#7af0e0',
        w: 800,
      },
      {
        t: 'pl',
        pts: [
          [0.24, 0.66],
          [0.4, 0.6],
          [0.56, 0.66],
          [0.72, 0.6],
        ],
        stroke: '#7af0e0',
        lw: 2,
        dash: [4, 5],
        anim: { k: 'dash', spd: 1.8 },
      },
    ],
  },

  // AI Tools — best AI tools for indie devs: a grid of sparkle tiles.
  'the-best-ai-tools-for-indie-developers-in-2026': {
    bg: ['#1c1530', '#0e0a1a'],
    el: [
      ...Array.from({ length: 6 }, (_, i): El => {
        const c = i % 3;
        const r = Math.floor(i / 3);
        return {
          t: 'r',
          x: 0.16 + c * 0.25,
          y: 0.28 + r * 0.26,
          w: 0.18,
          h: 0.18,
          rad: 8,
          fill: 'rgba(255,255,255,0.06)',
          stroke: '#a07bf0',
          lw: 1.2,
        };
      }),
      ...Array.from({ length: 6 }, (_, i): El => {
        const c = i % 3;
        const r = Math.floor(i / 3);
        return {
          t: 'tx',
          x: 0.25 + c * 0.25,
          y: 0.37 + r * 0.26,
          s: '✦',
          size: 0.05,
          fill: '#c9b3ff',
          anim: { k: 'pulse', amp: 0.18, spd: 1.5, ph: i },
        };
      }),
    ],
  },

  // Growth — side project to $50K ARR: a 12-month rising curve to a milestone.
  'from-side-project-to-50k-arr-a-12-month-timeline': {
    bg: ['#241a0c', '#130d05'],
    el: [
      {
        t: 'ln',
        a: [0.1, 0.82],
        b: [0.9, 0.82],
        stroke: 'rgba(255,255,255,0.18)',
        lw: 1.2,
      },
      ...Array.from(
        { length: 12 },
        (_, i): El => ({
          t: 'ln',
          a: [0.1 + i * 0.07, 0.82],
          b: [0.1 + i * 0.07, 0.85],
          stroke: 'rgba(255,255,255,0.25)',
          lw: 1,
        })
      ),
      {
        t: 'pl',
        pts: [
          [0.1, 0.78],
          [0.32, 0.7],
          [0.52, 0.55],
          [0.72, 0.36],
          [0.88, 0.2],
        ],
        stroke: '#f0b429',
        lw: 3,
        glow: '#f0b429',
      },
      { t: 'tx', x: 0.74, y: 0.3, s: '$50K', size: 0.09, fill: '#fff', w: 900 },
    ],
  },

  // Productivity — productivity porn: an endless spinning loop over a checklist.
  'the-problem-with-productivity-porn': {
    bg: ['#241a0c', '#130d05'],
    el: [
      {
        t: 'r',
        x: 0.42,
        y: 0.4,
        w: 0.16,
        h: 0.03,
        rad: 2,
        fill: 'rgba(255,255,255,0.3)',
      },
      {
        t: 'r',
        x: 0.42,
        y: 0.47,
        w: 0.16,
        h: 0.03,
        rad: 2,
        fill: 'rgba(255,255,255,0.3)',
      },
      {
        t: 'r',
        x: 0.42,
        y: 0.54,
        w: 0.16,
        h: 0.03,
        rad: 2,
        fill: 'rgba(255,255,255,0.3)',
      },
      {
        t: 'ar',
        x: 0.5,
        y: 0.48,
        rad: 0.24,
        a0: 0.3,
        a1: 5.8,
        stroke: '#f0b429',
        lw: 4,
        glow: '#f0b429',
        anim: { k: 'rot', spd: 0.8 },
      },
    ],
  },

  // Development — database design: a DB cylinder linked to a table.
  'database-design-for-indie-devs-start-simple-scale-later': {
    bg: ['#141a2e', '#0a0e18'],
    el: [
      {
        t: 'r',
        x: 0.18,
        y: 0.3,
        w: 0.26,
        h: 0.36,
        rad: 30,
        fill: 'rgba(124,192,238,0.15)',
        stroke: '#7cc0ee',
        lw: 1.4,
      },
      { t: 'r', x: 0.18, y: 0.28, w: 0.26, h: 0.1, rad: 30, fill: '#7cc0ee' },
      {
        t: 'ln',
        a: [0.18, 0.46],
        b: [0.44, 0.46],
        stroke: '#7cc0ee',
        lw: 1,
        op: 0.5,
      },
      {
        t: 'ln',
        a: [0.18, 0.56],
        b: [0.44, 0.56],
        stroke: '#7cc0ee',
        lw: 1,
        op: 0.5,
      },
      {
        t: 'ln',
        a: [0.44, 0.48],
        b: [0.58, 0.48],
        stroke: '#7cc0ee',
        lw: 2,
        dash: [4, 5],
        anim: { k: 'dash', spd: 1.5 },
      },
      {
        t: 'r',
        x: 0.58,
        y: 0.34,
        w: 0.28,
        h: 0.3,
        rad: 6,
        fill: 'rgba(255,255,255,0.05)',
        stroke: '#5a8cd6',
        lw: 1.2,
      },
      {
        t: 'r',
        x: 0.62,
        y: 0.4,
        w: 0.2,
        h: 0.03,
        rad: 2,
        fill: 'rgba(255,255,255,0.3)',
      },
      {
        t: 'r',
        x: 0.62,
        y: 0.47,
        w: 0.2,
        h: 0.03,
        rad: 2,
        fill: 'rgba(255,255,255,0.2)',
      },
      {
        t: 'r',
        x: 0.62,
        y: 0.54,
        w: 0.2,
        h: 0.03,
        rad: 2,
        fill: 'rgba(255,255,255,0.2)',
      },
    ],
  },

  // Reddit Marketing — a subreddit bubble with a rising upvote.
  'reddit-marketing': {
    bg: ['#2a160f', '#140a06'],
    el: [
      {
        t: 'r',
        x: 0.16,
        y: 0.3,
        w: 0.4,
        h: 0.3,
        rad: 12,
        fill: '#ff5a30',
        glow: '#ff5a30',
      },
      {
        t: 'pl',
        pts: [
          [0.24, 0.6],
          [0.24, 0.72],
          [0.34, 0.6],
        ],
        close: true,
        fill: '#ff5a30',
      },
      {
        t: 'r',
        x: 0.22,
        y: 0.4,
        w: 0.2,
        h: 0.03,
        rad: 2,
        fill: '#fff',
        op: 0.85,
      },
      {
        t: 'r',
        x: 0.22,
        y: 0.48,
        w: 0.14,
        h: 0.03,
        rad: 2,
        fill: '#fff',
        op: 0.5,
      },
      {
        t: 'pl',
        pts: [
          [0.6, 0.46],
          [0.7, 0.3],
          [0.8, 0.46],
        ],
        stroke: '#ffd9c9',
        lw: 3,
        anim: { k: 'bob', amp: 0.03, spd: 1.6 },
      },
      {
        t: 'ln',
        a: [0.7, 0.32],
        b: [0.7, 0.56],
        stroke: '#ffd9c9',
        lw: 3,
        anim: { k: 'bob', amp: 0.03, spd: 1.6 },
      },
    ],
  },

  // Indie Dev — micro-SaaS portfolio: a grid of small apps, one crowned.
  'building-a-micro-saas-empire-the-portfolio-approach': {
    bg: ['#12211c', '#0a0e0c'],
    el: [
      ...Array.from({ length: 6 }, (_, i): El => {
        const c = i % 3;
        const r = Math.floor(i / 3);
        const hot = i === 1;
        return {
          t: 'r',
          x: 0.18 + c * 0.22,
          y: 0.32 + r * 0.24,
          w: 0.16,
          h: 0.16,
          rad: 6,
          fill: hot ? '#46e8a0' : 'rgba(255,255,255,0.07)',
          stroke: hot ? undefined : '#3ba776',
          lw: 1.2,
          glow: hot ? '#46e8a0' : undefined,
        };
      }),
      {
        t: 'tx',
        x: 0.48,
        y: 0.22,
        s: '★',
        size: 0.06,
        fill: '#9ff0c6',
        anim: { k: 'pulse', amp: 0.15, spd: 1.5 },
      },
    ],
  },
  // SEO — content clusters: a pillar hub linked to cluster pages, ×2 traffic.
  'content-clusters-the-strategy-that-doubled-our-organic-traff': {
    bg: ['#10211c', '#08120e'],
    el: [
      ...(
        [
          [0.16, 0.3],
          [0.66, 0.26],
          [0.72, 0.64],
          [0.22, 0.76],
        ] as [number, number][]
      ).map(
        (p): El => ({
          t: 'ln',
          a: [0.42, 0.5],
          b: p,
          stroke: '#2bb6a3',
          lw: 1.4,
          dash: [4, 5],
          anim: { k: 'dash', spd: 1.4 },
        })
      ),
      { t: 'c', x: 0.16, y: 0.3, rad: 0.04, fill: '#7af0e0' },
      { t: 'c', x: 0.66, y: 0.26, rad: 0.04, fill: '#7af0e0' },
      { t: 'c', x: 0.72, y: 0.64, rad: 0.04, fill: '#7af0e0' },
      { t: 'c', x: 0.22, y: 0.76, rad: 0.04, fill: '#7af0e0' },
      {
        t: 'c',
        x: 0.42,
        y: 0.5,
        rad: 0.08,
        fill: '#2bb6a3',
        glow: '#2bb6a3',
        anim: { k: 'pulse', amp: 0.08, spd: 1.3 },
      },
      {
        t: 'tx',
        x: 0.82,
        y: 0.32,
        s: '×2',
        size: 0.1,
        fill: '#7af0e0',
        w: 900,
      },
    ],
  },

  // AI Tools — build an AI SaaS in 48h: stacking blocks, a 48h clock, a spark.
  'how-to-build-an-ai-saas-in-48-hours-step-by-step': {
    bg: ['#1c1530', '#0e0a1a'],
    el: [
      { t: 'r', x: 0.16, y: 0.6, w: 0.22, h: 0.08, rad: 4, fill: '#46c7c7' },
      { t: 'r', x: 0.16, y: 0.5, w: 0.22, h: 0.08, rad: 4, fill: '#7d9bf0' },
      {
        t: 'r',
        x: 0.16,
        y: 0.4,
        w: 0.22,
        h: 0.08,
        rad: 4,
        fill: '#a07bf0',
        anim: { k: 'pulse', amp: 0.04, spd: 1.6 },
      },
      {
        t: 'tx',
        x: 0.66,
        y: 0.46,
        s: '48h',
        size: 0.16,
        fill: '#c9b3ff',
        w: 900,
        glow: '#a07bf0',
      },
      {
        t: 'tx',
        x: 0.82,
        y: 0.24,
        s: '✦',
        size: 0.07,
        fill: '#c9b3ff',
        glow: '#a07bf0',
        anim: { k: 'pulse', amp: 0.2, spd: 2 },
      },
    ],
  },

  // Growth — landing page CV: a page with a funnel and a fixed upward arrow.
  'why-your-landing-page-is-not-converting-and-how-to-fix-it': {
    bg: ['#241a0c', '#130d05'],
    el: [
      {
        t: 'r',
        x: 0.18,
        y: 0.2,
        w: 0.64,
        h: 0.5,
        rad: 10,
        fill: 'rgba(255,255,255,0.05)',
        stroke: '#f0b429',
        lw: 1.4,
      },
      {
        t: 'pl',
        pts: [
          [0.32, 0.3],
          [0.68, 0.3],
          [0.58, 0.52],
          [0.42, 0.52],
        ],
        close: true,
        fill: 'rgba(240,180,41,0.3)',
        stroke: '#f0b429',
        lw: 1.2,
      },
      {
        t: 'c',
        x: 0.5,
        y: 0.62,
        rad: 0.022,
        fill: '#e2693f',
        anim: { k: 'bob', amp: 0.03, spd: 1.6 },
      },
      {
        t: 'pl',
        pts: [
          [0.84, 0.7],
          [0.9, 0.5],
          [0.96, 0.7],
        ],
        stroke: '#46e8a0',
        lw: 3,
        glow: '#46e8a0',
        anim: { k: 'bob', amp: 0.03, spd: 1.4 },
      },
      {
        t: 'ln',
        a: [0.9, 0.52],
        b: [0.9, 0.74],
        stroke: '#46e8a0',
        lw: 3,
        anim: { k: 'bob', amp: 0.03, spd: 1.4 },
      },
    ],
  },

  // Productivity — context switching: tangled red jumps vs one focused green line.
  'context-switching-is-killing-your-output-here-is-the-fix': {
    bg: ['#241a0c', '#120d04'],
    el: [
      {
        t: 'ln',
        a: [0.16, 0.3],
        b: [0.6, 0.7],
        stroke: '#ff6b6b',
        lw: 1.6,
        op: 0.7,
      },
      {
        t: 'ln',
        a: [0.7, 0.28],
        b: [0.24, 0.66],
        stroke: '#ff6b6b',
        lw: 1.6,
        op: 0.7,
      },
      {
        t: 'ln',
        a: [0.3, 0.74],
        b: [0.78, 0.36],
        stroke: '#ff6b6b',
        lw: 1.6,
        op: 0.7,
      },
      {
        t: 'ln',
        a: [0.12, 0.5],
        b: [0.86, 0.52],
        stroke: '#46e8a0',
        lw: 3.4,
        glow: '#46e8a0',
      },
      {
        t: 'pl',
        pts: [
          [0.8, 0.48],
          [0.88, 0.52],
          [0.8, 0.56],
        ],
        stroke: '#46e8a0',
        lw: 3,
      },
    ],
  },

  // Development — web performance: a speedometer with a fast green sweep.
  'web-performance-in-2026-core-web-vitals-and-beyond': {
    bg: ['#141a2e', '#0a0e18'],
    el: [
      {
        t: 'ar',
        x: 0.5,
        y: 0.66,
        rad: 0.32,
        a0: Math.PI,
        a1: 2 * Math.PI,
        stroke: 'rgba(255,255,255,0.14)',
        lw: 6,
      },
      {
        t: 'ar',
        x: 0.5,
        y: 0.66,
        rad: 0.32,
        a0: Math.PI,
        a1: 1.7 * Math.PI,
        stroke: '#46e8a0',
        lw: 6,
        glow: '#46e8a0',
      },
      {
        t: 'ln',
        a: [0.5, 0.66],
        b: [0.72, 0.44],
        stroke: '#fff',
        lw: 3,
        anim: { k: 'bob', amp: 0.02, spd: 1.5 },
      },
      { t: 'c', x: 0.5, y: 0.66, rad: 0.03, fill: '#7cc0ee' },
    ],
  },

  // Social Media — Twitter/X growth: an X badge and a rising follower curve to 10K.
  'twitter-growth': {
    bg: ['#0d1b2a', '#070f18'],
    el: [
      {
        t: 'ln',
        a: [0.1, 0.82],
        b: [0.9, 0.82],
        stroke: 'rgba(255,255,255,0.18)',
        lw: 1.2,
      },
      {
        t: 'pl',
        pts: [
          [0.1, 0.78],
          [0.34, 0.66],
          [0.56, 0.5],
          [0.74, 0.32],
          [0.9, 0.2],
        ],
        stroke: '#2a8fe0',
        lw: 3,
        glow: '#2a8fe0',
      },
      { t: 'r', x: 0.14, y: 0.18, w: 0.14, h: 0.14, rad: 6, fill: '#2a8fe0' },
      { t: 'tx', x: 0.21, y: 0.26, s: '𝕏', size: 0.1, fill: '#fff', w: 900 },
      {
        t: 'tx',
        x: 0.78,
        y: 0.3,
        s: '10K',
        size: 0.09,
        fill: '#cfe6fb',
        w: 900,
      },
    ],
  },

  // Growth — affiliate marketing: a hub paying out to referral nodes.
  'the-complete-guide-to-affiliate-marketing-for-saas': {
    bg: ['#241a0c', '#130d05'],
    el: [
      ...(
        [
          [0.74, 0.24],
          [0.8, 0.5],
          [0.74, 0.76],
        ] as [number, number][]
      ).map(
        (p): El => ({
          t: 'ln',
          a: [0.3, 0.5],
          b: p,
          stroke: '#f0b429',
          lw: 1.6,
          dash: [4, 5],
          anim: { k: 'dash', spd: 1.5 },
        })
      ),
      { t: 'c', x: 0.3, y: 0.5, rad: 0.09, fill: '#f0b429', glow: '#f0b429' },
      { t: 'tx', x: 0.3, y: 0.5, s: '$', size: 0.08, fill: '#2a1d05', w: 900 },
      { t: 'c', x: 0.74, y: 0.24, rad: 0.05, fill: '#83d8ad' },
      { t: 'c', x: 0.8, y: 0.5, rad: 0.05, fill: '#83d8ad' },
      { t: 'c', x: 0.74, y: 0.76, rad: 0.05, fill: '#83d8ad' },
    ],
  },

  // Indie Dev — 4-hour workweek reality check: a 4h clock with a reality cross.
  'the-4-hour-workweek-for-developers-reality-check': {
    bg: ['#12211c', '#0a0e0c'],
    el: [
      { t: 'c', x: 0.42, y: 0.48, rad: 0.22, stroke: '#83d8ad', lw: 3 },
      { t: 'ln', a: [0.42, 0.48], b: [0.42, 0.34], stroke: '#9ff0c6', lw: 3 },
      { t: 'ln', a: [0.42, 0.48], b: [0.54, 0.54], stroke: '#9ff0c6', lw: 3 },
      {
        t: 'tx',
        x: 0.42,
        y: 0.72,
        s: '4h',
        size: 0.08,
        fill: '#9ff0c6',
        w: 900,
      },
      {
        t: 'ln',
        a: [0.64, 0.3],
        b: [0.86, 0.58],
        stroke: '#ff6b6b',
        lw: 4,
        glow: '#ff6b6b',
        anim: { k: 'blink', spd: 2 },
      },
      {
        t: 'ln',
        a: [0.86, 0.3],
        b: [0.64, 0.58],
        stroke: '#ff6b6b',
        lw: 4,
        glow: '#ff6b6b',
        anim: { k: 'blink', spd: 2 },
      },
    ],
  },

  // SEO — link building for B2B: two interlocking chain links between nodes.
  'link-building-for-boring-b2b-products': {
    bg: ['#10211c', '#08120e'],
    el: [
      {
        t: 'r',
        x: 0.12,
        y: 0.42,
        w: 0.12,
        h: 0.12,
        rad: 3,
        fill: 'rgba(255,255,255,0.12)',
        stroke: '#2bb6a3',
        lw: 1.2,
      },
      {
        t: 'r',
        x: 0.76,
        y: 0.42,
        w: 0.12,
        h: 0.12,
        rad: 3,
        fill: 'rgba(255,255,255,0.12)',
        stroke: '#2bb6a3',
        lw: 1.2,
      },
      {
        t: 'c',
        x: 0.42,
        y: 0.48,
        rad: 0.1,
        stroke: '#7af0e0',
        lw: 4,
        glow: '#2bb6a3',
      },
      {
        t: 'c',
        x: 0.56,
        y: 0.48,
        rad: 0.1,
        stroke: '#7af0e0',
        lw: 4,
        glow: '#2bb6a3',
      },
      { t: 'ln', a: [0.24, 0.48], b: [0.34, 0.48], stroke: '#7af0e0', lw: 3 },
      { t: 'ln', a: [0.64, 0.48], b: [0.76, 0.48], stroke: '#7af0e0', lw: 3 },
    ],
  },

  // AI Tools — prompt engineering reborn: a prompt caret inside a renewal loop.
  'prompt-engineering-is-dead-long-live-prompt-engineering': {
    bg: ['#1c1530', '#0e0a1a'],
    el: [
      {
        t: 'ar',
        x: 0.5,
        y: 0.48,
        rad: 0.26,
        a0: 0.4,
        a1: 5.9,
        stroke: '#a07bf0',
        lw: 4,
        glow: '#a07bf0',
        anim: { k: 'rot', spd: 0.8 },
      },
      {
        t: 'pl',
        pts: [
          [0.66, 0.26],
          [0.74, 0.22],
          [0.72, 0.32],
        ],
        close: true,
        fill: '#a07bf0',
        anim: { k: 'rot', spd: 0.8 },
      },
      {
        t: 'tx',
        x: 0.5,
        y: 0.48,
        s: '>_',
        size: 0.12,
        fill: '#c9b3ff',
        w: 800,
      },
    ],
  },

  // Growth — building in public: a broadcasting node over a live chart.
  'building-in-public-a-strategy-not-a-stunt': {
    bg: ['#241a0c', '#130d05'],
    el: [
      {
        t: 'c',
        x: 0.5,
        y: 0.42,
        rad: 0.16,
        stroke: '#f0b429',
        lw: 2,
        op: 0.4,
        anim: { k: 'pulse', amp: 0.18, spd: 1.3, ph: 0 },
      },
      {
        t: 'c',
        x: 0.5,
        y: 0.42,
        rad: 0.1,
        stroke: '#f0b429',
        lw: 2,
        op: 0.6,
        anim: { k: 'pulse', amp: 0.14, spd: 1.3, ph: 1 },
      },
      { t: 'c', x: 0.5, y: 0.42, rad: 0.05, fill: '#f0b429', glow: '#f0b429' },
      {
        t: 'pl',
        pts: [
          [0.18, 0.78],
          [0.36, 0.7],
          [0.52, 0.74],
          [0.7, 0.64],
          [0.86, 0.68],
        ],
        stroke: '#83d8ad',
        lw: 2.4,
      },
    ],
  },

  // Productivity — 1:1s: two facing avatars with a 1:1 label.
  'how-to-run-effective-1-1s-even-if-you-hate-meetings': {
    bg: ['#241a0c', '#120d04'],
    el: [
      { t: 'c', x: 0.28, y: 0.46, rad: 0.1, fill: '#7cc0ee', glow: '#7cc0ee' },
      { t: 'c', x: 0.72, y: 0.46, rad: 0.1, fill: '#f0b429', glow: '#f0b429' },
      {
        t: 'r',
        x: 0.2,
        y: 0.66,
        w: 0.16,
        h: 0.05,
        rad: 12,
        fill: 'rgba(124,192,238,0.5)',
      },
      {
        t: 'r',
        x: 0.64,
        y: 0.66,
        w: 0.16,
        h: 0.05,
        rad: 12,
        fill: 'rgba(240,180,41,0.5)',
      },
      {
        t: 'tx',
        x: 0.5,
        y: 0.46,
        s: '1:1',
        size: 0.1,
        fill: '#fff',
        w: 900,
        anim: { k: 'pulse', amp: 0.06, spd: 1.4 },
      },
    ],
  },

  // Development — monorepos: one repo box holding nested package boxes.
  'monorepos-in-2026-turborepo-nx-or-just-pnpm': {
    bg: ['#141a2e', '#0a0e18'],
    el: [
      {
        t: 'r',
        x: 0.16,
        y: 0.22,
        w: 0.68,
        h: 0.56,
        rad: 10,
        fill: 'rgba(255,255,255,0.04)',
        stroke: '#7cc0ee',
        lw: 1.4,
      },
      {
        t: 'r',
        x: 0.22,
        y: 0.32,
        w: 0.24,
        h: 0.16,
        rad: 6,
        fill: 'rgba(124,192,238,0.18)',
        stroke: '#5a8cd6',
        lw: 1,
      },
      {
        t: 'r',
        x: 0.54,
        y: 0.32,
        w: 0.24,
        h: 0.16,
        rad: 6,
        fill: 'rgba(124,192,238,0.18)',
        stroke: '#5a8cd6',
        lw: 1,
      },
      {
        t: 'r',
        x: 0.22,
        y: 0.54,
        w: 0.24,
        h: 0.16,
        rad: 6,
        fill: 'rgba(124,192,238,0.18)',
        stroke: '#5a8cd6',
        lw: 1,
      },
      {
        t: 'r',
        x: 0.54,
        y: 0.54,
        w: 0.24,
        h: 0.16,
        rad: 6,
        fill: 'rgba(70,232,160,0.2)',
        stroke: '#46e8a0',
        lw: 1,
        anim: { k: 'pulse', amp: 0.03, spd: 1.5 },
      },
    ],
  },

  // AI Tools — voice cloning: a mic with an animated waveform.
  'ai-voice-cloning-use-cases-ethics-and-the-tools-that-get-it-': {
    bg: ['#1c1530', '#0e0a1a'],
    el: [
      {
        t: 'r',
        x: 0.16,
        y: 0.34,
        w: 0.1,
        h: 0.22,
        rad: 20,
        fill: '#a07bf0',
        glow: '#a07bf0',
      },
      { t: 'ln', a: [0.21, 0.58], b: [0.21, 0.66], stroke: '#a07bf0', lw: 2 },
      { t: 'ln', a: [0.16, 0.66], b: [0.26, 0.66], stroke: '#a07bf0', lw: 2 },
      ...Array.from(
        { length: 7 },
        (_, i): El => ({
          t: 'r',
          x: 0.4 + i * 0.07,
          y: 0.46,
          w: 0.03,
          h: 0.06,
          rad: 2,
          fill: '#46c7c7',
          glow: '#46c7c7',
          anim: { k: 'pulse', amp: 0.6, spd: 2.2, ph: i * 0.7 },
        })
      ),
    ],
  },

  // Indie Dev — employee to founder: a cog becomes a launching star.
  'from-employee-to-founder-the-mental-shift': {
    bg: ['#12211c', '#0a0e0c'],
    el: [
      {
        t: 'tx',
        x: 0.22,
        y: 0.48,
        s: '⚙',
        size: 0.16,
        fill: 'rgba(255,255,255,0.5)',
        anim: { k: 'rot', spd: 0.4 },
      },
      {
        t: 'ln',
        a: [0.38, 0.48],
        b: [0.6, 0.48],
        stroke: '#46e8a0',
        lw: 2.6,
        dash: [5, 5],
        anim: { k: 'dash', spd: 1.8 },
      },
      {
        t: 'pl',
        pts: [
          [0.56, 0.44],
          [0.61, 0.48],
          [0.56, 0.52],
        ],
        stroke: '#46e8a0',
        lw: 2.6,
      },
      {
        t: 'tx',
        x: 0.78,
        y: 0.46,
        s: '★',
        size: 0.18,
        fill: '#9ff0c6',
        glow: '#46e8a0',
        anim: { k: 'pulse', amp: 0.12, spd: 1.4 },
      },
    ],
  },

  // SEO — future of search: a query bar dissolving into an AI answer orb.
  'the-future-of-search-what-happens-when-ai-answers-everything': {
    bg: ['#10211c', '#08120e'],
    el: [
      {
        t: 'r',
        x: 0.12,
        y: 0.42,
        w: 0.34,
        h: 0.12,
        rad: 24,
        fill: 'rgba(255,255,255,0.06)',
        stroke: '#2bb6a3',
        lw: 1.4,
      },
      { t: 'c', x: 0.2, y: 0.48, rad: 0.04, stroke: '#7af0e0', lw: 2 },
      { t: 'ln', a: [0.23, 0.51], b: [0.27, 0.55], stroke: '#7af0e0', lw: 2 },
      {
        t: 'ln',
        a: [0.5, 0.48],
        b: [0.6, 0.48],
        stroke: '#7af0e0',
        lw: 2,
        dash: [4, 4],
        anim: { k: 'dash', spd: 1.6 },
      },
      {
        t: 'c',
        x: 0.74,
        y: 0.48,
        rad: 0.14,
        fill: '#2bb6a3',
        glow: '#2bb6a3',
        anim: { k: 'pulse', amp: 0.08, spd: 1.4 },
      },
      { t: 'tx', x: 0.74, y: 0.48, s: '✦', size: 0.1, fill: '#08120e', w: 900 },
    ],
  },

  // KOL Marketing — a creator hub broadcasting to followers, starred.
  'kol-marketing': {
    bg: ['#2a1020', '#140710'],
    el: [
      {
        t: 'c',
        x: 0.36,
        y: 0.48,
        rad: 0.18,
        stroke: '#ff5a9e',
        lw: 2,
        op: 0.4,
        anim: { k: 'pulse', amp: 0.16, spd: 1.3, ph: 0 },
      },
      {
        t: 'c',
        x: 0.36,
        y: 0.48,
        rad: 0.11,
        stroke: '#ff5a9e',
        lw: 2,
        op: 0.6,
        anim: { k: 'pulse', amp: 0.12, spd: 1.3, ph: 1 },
      },
      { t: 'c', x: 0.36, y: 0.48, rad: 0.06, fill: '#ff5a9e', glow: '#ff5a9e' },
      { t: 'tx', x: 0.36, y: 0.48, s: '★', size: 0.06, fill: '#fff', w: 900 },
      ...(
        [
          [0.72, 0.26],
          [0.82, 0.5],
          [0.7, 0.74],
        ] as [number, number][]
      ).map(
        (p): El => ({ t: 'c', x: p[0], y: p[1], rad: 0.035, fill: '#ff8ab4' })
      ),
    ],
  },

  // Growth — state of indie marketing: a montage grid of channel motifs.
  'the-state-of-indie-hacker-marketing-in-2026': {
    bg: ['#241a0c', '#130d05'],
    el: [
      ...Array.from({ length: 6 }, (_, i): El => {
        const c = i % 3;
        const r = Math.floor(i / 3);
        return {
          t: 'r',
          x: 0.14 + c * 0.26,
          y: 0.28 + r * 0.28,
          w: 0.2,
          h: 0.2,
          rad: 8,
          fill: 'rgba(255,255,255,0.05)',
          stroke: 'rgba(255,255,255,0.14)',
          lw: 1,
        };
      }),
      { t: 'tx', x: 0.24, y: 0.38, s: '𝕏', size: 0.08, fill: '#7cc0ee' },
      { t: 'tx', x: 0.5, y: 0.38, s: '✉', size: 0.08, fill: '#f0b429' },
      { t: 'tx', x: 0.76, y: 0.38, s: '★', size: 0.08, fill: '#ff8ab4' },
      { t: 'tx', x: 0.24, y: 0.66, s: '#', size: 0.08, fill: '#83d8ad' },
      { t: 'tx', x: 0.5, y: 0.66, s: '$', size: 0.08, fill: '#e2693f' },
      {
        t: 'tx',
        x: 0.76,
        y: 0.66,
        s: '▲',
        size: 0.07,
        fill: '#46e8a0',
        anim: { k: 'bob', amp: 0.03, spd: 1.5 },
      },
    ],
  },
  // Productivity — note-taking apps: a note card with bullets and a pen.
  'the-best-note-taking-apps-for-developers-in-2026': {
    bg: ['#241a0c', '#120d04'],
    el: [
      {
        t: 'r',
        x: 0.26,
        y: 0.18,
        w: 0.48,
        h: 0.64,
        rad: 8,
        fill: 'rgba(255,255,255,0.06)',
        stroke: 'rgba(255,255,255,0.16)',
        lw: 1,
      },
      ...Array.from(
        { length: 4 },
        (_, i): El => ({
          t: 'c',
          x: 0.33,
          y: 0.32 + i * 0.13,
          rad: 0.012,
          fill: '#f0b429',
        })
      ),
      ...Array.from(
        { length: 4 },
        (_, i): El => ({
          t: 'r',
          x: 0.38,
          y: 0.31 + i * 0.13,
          w: 0.28 - i * 0.03,
          h: 0.025,
          rad: 2,
          fill: 'rgba(255,255,255,0.3)',
        })
      ),
      {
        t: 'tx',
        x: 0.7,
        y: 0.74,
        s: '✎',
        size: 0.12,
        fill: '#f0b429',
        glow: '#f0b429',
        anim: { k: 'bob', amp: 0.03, spd: 1.4 },
      },
    ],
  },

  // Development — passwordless auth: a key, a lock, a magic-link spark.
  'authentication-without-the-pain-oauth-passkeys-and-magic-lin': {
    bg: ['#141a2e', '#0a0e18'],
    el: [
      {
        t: 'c',
        x: 0.3,
        y: 0.42,
        rad: 0.09,
        stroke: '#7cc0ee',
        lw: 3.4,
        glow: '#7cc0ee',
      },
      { t: 'ln', a: [0.37, 0.49], b: [0.52, 0.64], stroke: '#7cc0ee', lw: 3.4 },
      { t: 'ln', a: [0.46, 0.58], b: [0.52, 0.52], stroke: '#7cc0ee', lw: 3 },
      { t: 'r', x: 0.6, y: 0.46, w: 0.18, h: 0.16, rad: 4, fill: '#5a8cd6' },
      {
        t: 'ar',
        x: 0.69,
        y: 0.46,
        rad: 0.06,
        a0: Math.PI,
        a1: 2 * Math.PI,
        stroke: '#5a8cd6',
        lw: 3,
      },
      {
        t: 'tx',
        x: 0.82,
        y: 0.28,
        s: '✦',
        size: 0.08,
        fill: '#cfe6fb',
        glow: '#7cc0ee',
        anim: { k: 'pulse', amp: 0.2, spd: 2 },
      },
    ],
  },

  // AI Tools — generic content #1: a row of samey blocks, one breaks out.
  'why-your-ai-generated-content-sounds-generic-and-how-to-fix-it': {
    bg: ['#1c1530', '#0e0a1a'],
    el: [
      ...Array.from(
        { length: 5 },
        (_, i): El =>
          i === 3
            ? {
                t: 'r',
                x: 0.12 + i * 0.16,
                y: 0.34,
                w: 0.12,
                h: 0.28,
                rad: 6,
                fill: '#a07bf0',
                glow: '#a07bf0',
                anim: { k: 'pulse', amp: 0.05, spd: 1.6 },
              }
            : {
                t: 'r',
                x: 0.12 + i * 0.16,
                y: 0.4,
                w: 0.12,
                h: 0.2,
                rad: 6,
                fill: 'rgba(255,255,255,0.14)',
              }
      ),
    ],
  },

  // AI Tools — generic content #2: unique fingerprint ridges among the noise.
  'why-your-ai-generated-content-sounds-generic-and-how-to-fix-': {
    bg: ['#1a1330', '#0c0918'],
    el: [
      {
        t: 'ar',
        x: 0.5,
        y: 0.48,
        rad: 0.1,
        a0: 0.2,
        a1: 2.9,
        stroke: '#c9b3ff',
        lw: 2.4,
        glow: '#a07bf0',
      },
      {
        t: 'ar',
        x: 0.5,
        y: 0.48,
        rad: 0.16,
        a0: 0.5,
        a1: 3.4,
        stroke: '#a07bf0',
        lw: 2.4,
      },
      {
        t: 'ar',
        x: 0.5,
        y: 0.48,
        rad: 0.22,
        a0: 0.1,
        a1: 2.6,
        stroke: '#7d6bd0',
        lw: 2.4,
      },
      {
        t: 'ar',
        x: 0.5,
        y: 0.48,
        rad: 0.28,
        a0: 0.7,
        a1: 3.2,
        stroke: '#5a4d9e',
        lw: 2.4,
      },
      {
        t: 'c',
        x: 0.5,
        y: 0.48,
        rad: 0.03,
        fill: '#c9b3ff',
        glow: '#a07bf0',
        anim: { k: 'pulse', amp: 0.15, spd: 1.5 },
      },
    ],
  },

  // Growth — viral tool: a tool node spreading across a share network.
  'how-to-create-a-viral-tool-that-markets-your-product': {
    bg: ['#241a0c', '#130d05'],
    el: [
      ...(
        [
          [0.7, 0.22],
          [0.82, 0.46],
          [0.72, 0.72],
          [0.5, 0.8],
        ] as [number, number][]
      ).map(
        (p): El => ({
          t: 'ln',
          a: [0.32, 0.46],
          b: p,
          stroke: '#f0b429',
          lw: 1.4,
          dash: [4, 5],
          anim: { k: 'dash', spd: 1.6 },
        })
      ),
      {
        t: 'tx',
        x: 0.32,
        y: 0.46,
        s: '⚙',
        size: 0.16,
        fill: '#f0b429',
        glow: '#f0b429',
      },
      { t: 'c', x: 0.7, y: 0.22, rad: 0.04, fill: '#83d8ad' },
      { t: 'c', x: 0.82, y: 0.46, rad: 0.04, fill: '#83d8ad' },
      { t: 'c', x: 0.72, y: 0.72, rad: 0.04, fill: '#83d8ad' },
      { t: 'c', x: 0.5, y: 0.8, rad: 0.04, fill: '#83d8ad' },
    ],
  },

  // Indie Dev — validate in a weekend: an idea bulb with a verdict check.
  'how-to-validate-your-saas-idea-in-one-weekend': {
    bg: ['#12211c', '#0a0e0c'],
    el: [
      {
        t: 'c',
        x: 0.42,
        y: 0.42,
        rad: 0.13,
        fill: '#e0b34a',
        glow: '#e0b34a',
        anim: { k: 'pulse', amp: 0.06, spd: 1.4 },
      },
      { t: 'r', x: 0.38, y: 0.55, w: 0.08, h: 0.06, rad: 2, fill: '#b88f2e' },
      {
        t: 'pl',
        pts: [
          [0.66, 0.46],
          [0.72, 0.54],
          [0.86, 0.34],
        ],
        stroke: '#46e8a0',
        lw: 4,
        glow: '#46e8a0',
        anim: { k: 'bob', amp: 0.02, spd: 1.4 },
      },
      {
        t: 'tx',
        x: 0.42,
        y: 0.78,
        s: '48h',
        size: 0.07,
        fill: '#9ff0c6',
        w: 900,
      },
    ],
  },

  // SEO — schema markup: structured tags nudging a ranking needle up.
  'schema-markup-that-actually-moves-the-needle': {
    bg: ['#10211c', '#08120e'],
    el: [
      {
        t: 'tx',
        x: 0.28,
        y: 0.46,
        s: '{ }',
        size: 0.16,
        fill: '#7af0e0',
        w: 700,
      },
      {
        t: 'r',
        x: 0.18,
        y: 0.62,
        w: 0.24,
        h: 0.04,
        rad: 2,
        fill: 'rgba(255,255,255,0.25)',
      },
      {
        t: 'ar',
        x: 0.72,
        y: 0.62,
        rad: 0.22,
        a0: Math.PI,
        a1: 2 * Math.PI,
        stroke: 'rgba(255,255,255,0.14)',
        lw: 5,
      },
      {
        t: 'ar',
        x: 0.72,
        y: 0.62,
        rad: 0.22,
        a0: Math.PI,
        a1: 1.65 * Math.PI,
        stroke: '#2bb6a3',
        lw: 5,
        glow: '#2bb6a3',
      },
      {
        t: 'ln',
        a: [0.72, 0.62],
        b: [0.86, 0.46],
        stroke: '#fff',
        lw: 2.6,
        anim: { k: 'bob', amp: 0.02, spd: 1.5 },
      },
    ],
  },

  // AI Tools — AutoGPT vs agentic: a spinning loop vs a directed chain.
  'autogpt-vs-agentic-workflows-what-actually-works-in-producti': {
    bg: ['#1c1530', '#0e0a1a'],
    el: [
      {
        t: 'ar',
        x: 0.3,
        y: 0.48,
        rad: 0.16,
        a0: 0.4,
        a1: 5.9,
        stroke: '#ff8ab4',
        lw: 3.4,
        glow: '#ff5a9e',
        anim: { k: 'rot', spd: 1 },
      },
      { t: 'tx', x: 0.3, y: 0.74, s: '?', size: 0.08, fill: '#ff8ab4', w: 900 },
      { t: 'c', x: 0.58, y: 0.48, rad: 0.04, fill: '#46c7c7', glow: '#46c7c7' },
      { t: 'c', x: 0.72, y: 0.48, rad: 0.04, fill: '#46c7c7', glow: '#46c7c7' },
      { t: 'c', x: 0.86, y: 0.48, rad: 0.04, fill: '#46c7c7', glow: '#46c7c7' },
      {
        t: 'ln',
        a: [0.62, 0.48],
        b: [0.68, 0.48],
        stroke: '#7af0e0',
        lw: 2.4,
        dash: [3, 4],
        anim: { k: 'dash', spd: 2 },
      },
      {
        t: 'ln',
        a: [0.76, 0.48],
        b: [0.82, 0.48],
        stroke: '#7af0e0',
        lw: 2.4,
        dash: [3, 4],
        anim: { k: 'dash', spd: 2 },
      },
    ],
  },

  // Indie Dev — tech stack to $1M: ascending layers crowned with the goal.
  'the-tech-stack-that-scales-from-0-to-1m-arr': {
    bg: ['#12211c', '#0a0e0c'],
    el: [
      {
        t: 'r',
        x: 0.26,
        y: 0.66,
        w: 0.48,
        h: 0.12,
        rad: 4,
        fill: 'rgba(255,255,255,0.08)',
        stroke: '#3ba776',
        lw: 1,
      },
      {
        t: 'r',
        x: 0.3,
        y: 0.52,
        w: 0.4,
        h: 0.12,
        rad: 4,
        fill: 'rgba(70,232,160,0.18)',
        stroke: '#46e8a0',
        lw: 1,
      },
      {
        t: 'r',
        x: 0.34,
        y: 0.38,
        w: 0.32,
        h: 0.12,
        rad: 4,
        fill: 'rgba(70,232,160,0.3)',
        stroke: '#46e8a0',
        lw: 1,
      },
      {
        t: 'tx',
        x: 0.5,
        y: 0.24,
        s: '$1M',
        size: 0.11,
        fill: '#9ff0c6',
        w: 900,
        glow: '#46e8a0',
        anim: { k: 'pulse', amp: 0.06, spd: 1.4 },
      },
    ],
  },

  // Productivity — energy vs time: a battery beside a clock.
  'energy-management-vs-time-management': {
    bg: ['#241a0c', '#120d04'],
    el: [
      {
        t: 'r',
        x: 0.14,
        y: 0.4,
        w: 0.26,
        h: 0.2,
        rad: 4,
        stroke: '#f0b429',
        lw: 2,
      },
      { t: 'r', x: 0.4, y: 0.45, w: 0.02, h: 0.1, fill: '#f0b429' },
      { t: 'r', x: 0.17, y: 0.44, w: 0.05, h: 0.12, rad: 2, fill: '#f0b429' },
      {
        t: 'r',
        x: 0.24,
        y: 0.44,
        w: 0.05,
        h: 0.12,
        rad: 2,
        fill: '#f0b429',
        anim: { k: 'blink', spd: 1.5 },
      },
      { t: 'tx', x: 0.5, y: 0.5, s: 'vs', size: 0.08, fill: '#fff', w: 900 },
      { t: 'c', x: 0.74, y: 0.5, rad: 0.14, stroke: '#7cc0ee', lw: 2.4 },
      { t: 'ln', a: [0.74, 0.5], b: [0.74, 0.41], stroke: '#7cc0ee', lw: 2.4 },
      { t: 'ln', a: [0.74, 0.5], b: [0.82, 0.54], stroke: '#7cc0ee', lw: 2.4 },
    ],
  },

  // Development — testing for small teams: a test pyramid with green checks.
  'testing-strategies-for-small-teams': {
    bg: ['#141a2e', '#0a0e18'],
    el: [
      {
        t: 'pl',
        pts: [
          [0.5, 0.2],
          [0.78, 0.74],
          [0.22, 0.74],
        ],
        close: true,
        fill: 'rgba(124,192,238,0.12)',
        stroke: '#7cc0ee',
        lw: 1.4,
      },
      {
        t: 'ln',
        a: [0.34, 0.56],
        b: [0.66, 0.56],
        stroke: '#7cc0ee',
        lw: 1,
        op: 0.6,
      },
      {
        t: 'ln',
        a: [0.42, 0.38],
        b: [0.58, 0.38],
        stroke: '#7cc0ee',
        lw: 1,
        op: 0.6,
      },
      {
        t: 'tx',
        x: 0.5,
        y: 0.46,
        s: '✓',
        size: 0.07,
        fill: '#46e8a0',
        anim: { k: 'pulse', amp: 0.12, spd: 1.6, ph: 0 },
      },
      {
        t: 'tx',
        x: 0.4,
        y: 0.66,
        s: '✓',
        size: 0.06,
        fill: '#46e8a0',
        anim: { k: 'pulse', amp: 0.12, spd: 1.6, ph: 1 },
      },
      {
        t: 'tx',
        x: 0.6,
        y: 0.66,
        s: '✓',
        size: 0.06,
        fill: '#46e8a0',
        anim: { k: 'pulse', amp: 0.12, spd: 1.6, ph: 2 },
      },
    ],
  },

  // Product — no-code MVP: interlocking blocks assembled in 48h.
  'no-code-mvp': {
    bg: ['#181530', '#0c0a18'],
    el: [
      {
        t: 'r',
        x: 0.24,
        y: 0.3,
        w: 0.24,
        h: 0.2,
        rad: 6,
        fill: '#8b7bd8',
        glow: '#8b7bd8',
      },
      { t: 'r', x: 0.5, y: 0.3, w: 0.24, h: 0.2, rad: 6, fill: '#7cc0ee' },
      { t: 'r', x: 0.24, y: 0.52, w: 0.24, h: 0.2, rad: 6, fill: '#7cc0ee' },
      {
        t: 'r',
        x: 0.5,
        y: 0.52,
        w: 0.24,
        h: 0.2,
        rad: 6,
        fill: '#8b7bd8',
        anim: { k: 'pulse', amp: 0.04, spd: 1.6 },
      },
      {
        t: 'tx',
        x: 0.5,
        y: 0.84,
        s: '48h',
        size: 0.08,
        fill: '#c9b3ff',
        w: 900,
      },
    ],
  },

  // Growth — email marketing: an envelope feeding a drip sequence.
  'email-marketing-for-saas-beyond-the-welcome-sequence': {
    bg: ['#241a0c', '#130d05'],
    el: [
      {
        t: 'r',
        x: 0.16,
        y: 0.28,
        w: 0.3,
        h: 0.2,
        rad: 6,
        fill: '#f0b429',
        glow: '#f0b429',
      },
      {
        t: 'pl',
        pts: [
          [0.16, 0.3],
          [0.31, 0.42],
          [0.46, 0.3],
        ],
        stroke: '#2a1d05',
        lw: 2.2,
      },
      {
        t: 'ln',
        a: [0.31, 0.48],
        b: [0.31, 0.82],
        stroke: 'rgba(255,255,255,0.25)',
        lw: 1.4,
      },
      ...Array.from(
        { length: 3 },
        (_, i): El => ({
          t: 'c',
          x: 0.31,
          y: 0.56 + i * 0.12,
          rad: 0.03,
          fill: '#83d8ad',
          anim: { k: 'bob', amp: 0.02, spd: 1.6, ph: i },
        })
      ),
    ],
  },

  // Productivity — saying no: a shield that keeps the bridge intact.
  'how-to-say-no-without-burning-bridges': {
    bg: ['#241a0c', '#120d04'],
    el: [
      {
        t: 'pl',
        pts: [
          [0.12, 0.7],
          [0.32, 0.56],
          [0.5, 0.6],
          [0.68, 0.52],
          [0.88, 0.66],
        ],
        stroke: '#83d8ad',
        lw: 3,
        glow: '#3ba776',
      },
      {
        t: 'pl',
        pts: [
          [0.5, 0.24],
          [0.62, 0.3],
          [0.62, 0.44],
          [0.5, 0.52],
          [0.38, 0.44],
          [0.38, 0.3],
        ],
        close: true,
        fill: 'rgba(240,180,41,0.2)',
        stroke: '#f0b429',
        lw: 2,
      },
      {
        t: 'tx',
        x: 0.5,
        y: 0.38,
        s: 'NO',
        size: 0.08,
        fill: '#f0b429',
        w: 900,
      },
    ],
  },

  // SEO — video SEO: a play button framed with ranking bars.
  'video-seo-how-to-rank-on-youtube-and-google': {
    bg: ['#10211c', '#08120e'],
    el: [
      {
        t: 'r',
        x: 0.16,
        y: 0.24,
        w: 0.5,
        h: 0.4,
        rad: 10,
        fill: 'rgba(255,255,255,0.05)',
        stroke: '#2bb6a3',
        lw: 1.4,
      },
      {
        t: 'pl',
        pts: [
          [0.36, 0.34],
          [0.36, 0.54],
          [0.52, 0.44],
        ],
        close: true,
        fill: '#7af0e0',
        glow: '#2bb6a3',
        anim: { k: 'pulse', amp: 0.06, spd: 1.4 },
      },
      { t: 'r', x: 0.72, y: 0.3, w: 0.16, h: 0.05, rad: 3, fill: '#2bb6a3' },
      {
        t: 'r',
        x: 0.72,
        y: 0.42,
        w: 0.12,
        h: 0.05,
        rad: 3,
        fill: 'rgba(255,255,255,0.22)',
      },
      {
        t: 'r',
        x: 0.72,
        y: 0.54,
        w: 0.1,
        h: 0.05,
        rad: 3,
        fill: 'rgba(255,255,255,0.16)',
      },
    ],
  },

  // AI Tools — AI customer support: a chat bubble with a bot spark, 24/7.
  'the-complete-guide-to-ai-powered-customer-support': {
    bg: ['#1c1530', '#0e0a1a'],
    el: [
      {
        t: 'r',
        x: 0.2,
        y: 0.28,
        w: 0.5,
        h: 0.32,
        rad: 16,
        fill: '#a07bf0',
        glow: '#a07bf0',
      },
      {
        t: 'pl',
        pts: [
          [0.3, 0.6],
          [0.3, 0.72],
          [0.42, 0.6],
        ],
        close: true,
        fill: '#a07bf0',
      },
      {
        t: 'tx',
        x: 0.45,
        y: 0.43,
        s: '✦',
        size: 0.1,
        fill: '#fff',
        anim: { k: 'pulse', amp: 0.16, spd: 2 },
      },
      {
        t: 'tx',
        x: 0.78,
        y: 0.5,
        s: '24/7',
        size: 0.08,
        fill: '#c9b3ff',
        w: 900,
      },
    ],
  },

  // Growth — soft launch: a steady ramp beside a fizzling big-bang spike.
  'the-art-of-the-soft-launch-why-big-bangs-fail': {
    bg: ['#241a0c', '#130d05'],
    el: [
      {
        t: 'ln',
        a: [0.1, 0.82],
        b: [0.9, 0.82],
        stroke: 'rgba(255,255,255,0.18)',
        lw: 1.2,
      },
      {
        t: 'pl',
        pts: [
          [0.12, 0.78],
          [0.32, 0.66],
          [0.52, 0.5],
          [0.72, 0.34],
          [0.88, 0.24],
        ],
        stroke: '#46e8a0',
        lw: 3,
        glow: '#46e8a0',
      },
      {
        t: 'pl',
        pts: [
          [0.12, 0.78],
          [0.2, 0.3],
          [0.28, 0.74],
          [0.36, 0.78],
        ],
        stroke: '#ff6b6b',
        lw: 2.2,
        op: 0.8,
      },
    ],
  },

  // Indie Dev — imposter syndrome: a confident face shadowed by a doubting one.
  'dealing-with-imposter-syndrome-as-a-solo-founder': {
    bg: ['#12211c', '#0a0e0c'],
    el: [
      {
        t: 'c',
        x: 0.4,
        y: 0.46,
        rad: 0.16,
        fill: 'rgba(255,255,255,0.12)',
        stroke: 'rgba(255,255,255,0.3)',
        lw: 1.4,
      },
      {
        t: 'c',
        x: 0.56,
        y: 0.46,
        rad: 0.16,
        stroke: '#46e8a0',
        lw: 2,
        glow: '#46e8a0',
      },
      { t: 'c', x: 0.51, y: 0.42, rad: 0.018, fill: '#9ff0c6' },
      { t: 'c', x: 0.61, y: 0.42, rad: 0.018, fill: '#9ff0c6' },
      {
        t: 'tx',
        x: 0.74,
        y: 0.26,
        s: '?',
        size: 0.12,
        fill: 'rgba(255,255,255,0.5)',
        w: 900,
        anim: { k: 'bob', amp: 0.03, spd: 1.3 },
      },
    ],
  },
  // SEO — local SEO: a map pin beside ranking bars.
  'local-seo-for-saas-does-it-even-matter': {
    bg: ['#10211c', '#08120e'],
    el: [
      { t: 'c', x: 0.3, y: 0.36, rad: 0.1, fill: '#2bb6a3', glow: '#2bb6a3' },
      {
        t: 'pl',
        pts: [
          [0.22, 0.42],
          [0.3, 0.62],
          [0.38, 0.42],
        ],
        close: true,
        fill: '#2bb6a3',
      },
      { t: 'c', x: 0.3, y: 0.36, rad: 0.035, fill: '#08120e' },
      { t: 'r', x: 0.56, y: 0.34, w: 0.3, h: 0.05, rad: 3, fill: '#2bb6a3' },
      {
        t: 'r',
        x: 0.56,
        y: 0.46,
        w: 0.22,
        h: 0.05,
        rad: 3,
        fill: 'rgba(255,255,255,0.25)',
      },
      {
        t: 'r',
        x: 0.56,
        y: 0.58,
        w: 0.16,
        h: 0.05,
        rad: 3,
        fill: 'rgba(255,255,255,0.18)',
      },
    ],
  },

  // Development — local-first sync: two devices syncing, the cloud struck out.
  'the-rise-of-local-first-apps-sync-without-the-cloud': {
    bg: ['#141a2e', '#0a0e18'],
    el: [
      {
        t: 'r',
        x: 0.14,
        y: 0.42,
        w: 0.22,
        h: 0.24,
        rad: 6,
        stroke: '#7cc0ee',
        lw: 1.6,
      },
      {
        t: 'r',
        x: 0.64,
        y: 0.42,
        w: 0.22,
        h: 0.24,
        rad: 6,
        stroke: '#7cc0ee',
        lw: 1.6,
      },
      {
        t: 'ln',
        a: [0.36, 0.48],
        b: [0.64, 0.48],
        stroke: '#46e8a0',
        lw: 2,
        dash: [4, 5],
        anim: { k: 'dash', spd: 1.8 },
      },
      {
        t: 'ln',
        a: [0.64, 0.6],
        b: [0.36, 0.6],
        stroke: '#46e8a0',
        lw: 2,
        dash: [4, 5],
        anim: { k: 'dash', spd: 1.8 },
      },
      {
        t: 'tx',
        x: 0.5,
        y: 0.22,
        s: '☁',
        size: 0.1,
        fill: 'rgba(255,255,255,0.4)',
      },
      { t: 'ln', a: [0.43, 0.17], b: [0.57, 0.27], stroke: '#ff6b6b', lw: 3 },
    ],
  },

  // Productivity — AI productivity stack: layered tools topped with a spark.
  'ai-productivity-stack': {
    bg: ['#241a0c', '#120d04'],
    el: [
      {
        t: 'r',
        x: 0.3,
        y: 0.62,
        w: 0.4,
        h: 0.1,
        rad: 4,
        fill: 'rgba(255,255,255,0.08)',
        stroke: '#f0b429',
        lw: 1,
      },
      {
        t: 'r',
        x: 0.34,
        y: 0.5,
        w: 0.32,
        h: 0.1,
        rad: 4,
        fill: 'rgba(240,180,41,0.3)',
        stroke: '#f0b429',
        lw: 1,
      },
      {
        t: 'r',
        x: 0.38,
        y: 0.38,
        w: 0.24,
        h: 0.1,
        rad: 4,
        fill: 'rgba(240,180,41,0.5)',
        stroke: '#f0b429',
        lw: 1,
      },
      {
        t: 'tx',
        x: 0.5,
        y: 0.24,
        s: '✦',
        size: 0.1,
        fill: '#ffd86b',
        glow: '#f0b429',
        anim: { k: 'pulse', amp: 0.18, spd: 1.8 },
      },
    ],
  },

  // Growth — referral loops: a spinning loop linking two user nodes.
  'referral-loops-how-dropbox-notion-and-linear-grew': {
    bg: ['#241a0c', '#130d05'],
    el: [
      {
        t: 'ar',
        x: 0.5,
        y: 0.48,
        rad: 0.22,
        a0: 0.4,
        a1: 5.9,
        stroke: '#f0b429',
        lw: 3.4,
        glow: '#f0b429',
        anim: { k: 'rot', spd: 0.8 },
      },
      {
        t: 'pl',
        pts: [
          [0.66, 0.3],
          [0.74, 0.27],
          [0.72, 0.37],
        ],
        close: true,
        fill: '#f0b429',
        anim: { k: 'rot', spd: 0.8 },
      },
      { t: 'c', x: 0.5, y: 0.26, rad: 0.045, fill: '#83d8ad', glow: '#83d8ad' },
      { t: 'c', x: 0.5, y: 0.7, rad: 0.045, fill: '#83d8ad', glow: '#83d8ad' },
    ],
  },

  // Productivity — 5-minute rule: a clock at five with a start button.
  'the-5-minute-rule-for-starting-hard-tasks': {
    bg: ['#241a0c', '#120d04'],
    el: [
      { t: 'c', x: 0.38, y: 0.48, rad: 0.2, stroke: '#f0b429', lw: 3 },
      { t: 'ln', a: [0.38, 0.48], b: [0.38, 0.34], stroke: '#ffd86b', lw: 3 },
      { t: 'ln', a: [0.38, 0.48], b: [0.5, 0.52], stroke: '#ffd86b', lw: 3 },
      {
        t: 'pl',
        pts: [
          [0.68, 0.38],
          [0.68, 0.58],
          [0.84, 0.48],
        ],
        close: true,
        fill: '#46e8a0',
        glow: '#46e8a0',
        anim: { k: 'pulse', amp: 0.08, spd: 1.5 },
      },
    ],
  },

  // Development — API design: a core API node wired to REST/GraphQL/tRPC.
  'api-design-for-humans-rest-graphql-or-trpc': {
    bg: ['#141a2e', '#0a0e18'],
    el: [
      ...(
        [
          [0.74, 0.28],
          [0.82, 0.5],
          [0.74, 0.72],
        ] as [number, number][]
      ).map(
        (p): El => ({
          t: 'ln',
          a: [0.3, 0.5],
          b: p,
          stroke: '#5a8cd6',
          lw: 1.6,
          dash: [4, 5],
          anim: { k: 'dash', spd: 1.5 },
        })
      ),
      { t: 'c', x: 0.3, y: 0.5, rad: 0.08, fill: '#7cc0ee', glow: '#7cc0ee' },
      {
        t: 'tx',
        x: 0.3,
        y: 0.5,
        s: '{ }',
        size: 0.06,
        fill: '#0a0e18',
        w: 800,
      },
      { t: 'c', x: 0.74, y: 0.28, rad: 0.045, fill: '#46e8a0' },
      { t: 'c', x: 0.82, y: 0.5, rad: 0.045, fill: '#f0b429' },
      { t: 'c', x: 0.74, y: 0.72, rad: 0.045, fill: '#a07bf0' },
    ],
  },

  // AI Tools — AI without a PhD: a pragmatic spark meets a working gear.
  'building-ai-products-without-a-phd-a-pragmatic-guide': {
    bg: ['#1c1530', '#0e0a1a'],
    el: [
      {
        t: 'tx',
        x: 0.4,
        y: 0.44,
        s: '✦',
        size: 0.18,
        fill: '#c9b3ff',
        glow: '#a07bf0',
        anim: { k: 'pulse', amp: 0.14, spd: 1.6 },
      },
      {
        t: 'tx',
        x: 0.66,
        y: 0.58,
        s: '⚙',
        size: 0.14,
        fill: '#a07bf0',
        anim: { k: 'rot', spd: 0.5 },
      },
    ],
  },

  // Indie Dev — legal & tax basics: a stamped document under a shield.
  'the-legal-and-tax-basics-every-indie-dev-ignores': {
    bg: ['#12211c', '#0a0e0c'],
    el: [
      {
        t: 'r',
        x: 0.28,
        y: 0.22,
        w: 0.4,
        h: 0.56,
        rad: 6,
        fill: 'rgba(255,255,255,0.06)',
        stroke: '#3ba776',
        lw: 1.2,
      },
      {
        t: 'tx',
        x: 0.42,
        y: 0.42,
        s: '§',
        size: 0.16,
        fill: '#46e8a0',
        w: 900,
      },
      {
        t: 'r',
        x: 0.34,
        y: 0.58,
        w: 0.24,
        h: 0.025,
        rad: 2,
        fill: 'rgba(255,255,255,0.25)',
      },
      {
        t: 'r',
        x: 0.34,
        y: 0.64,
        w: 0.18,
        h: 0.025,
        rad: 2,
        fill: 'rgba(255,255,255,0.2)',
      },
      {
        t: 'pl',
        pts: [
          [0.66, 0.24],
          [0.78, 0.3],
          [0.78, 0.44],
          [0.66, 0.52],
          [0.54, 0.44],
          [0.54, 0.3],
        ],
        close: true,
        stroke: '#9ff0c6',
        lw: 2,
        glow: '#46e8a0',
      },
      {
        t: 'tx',
        x: 0.66,
        y: 0.37,
        s: '✓',
        size: 0.07,
        fill: '#9ff0c6',
        w: 900,
      },
    ],
  },

  // Productivity — burnout: a draining battery with a recovery arrow.
  'remote-work-burnout-signs-prevention-recovery': {
    bg: ['#241a0c', '#120d04'],
    el: [
      {
        t: 'r',
        x: 0.16,
        y: 0.4,
        w: 0.3,
        h: 0.2,
        rad: 4,
        stroke: '#ff6b6b',
        lw: 2,
      },
      { t: 'r', x: 0.46, y: 0.45, w: 0.02, h: 0.1, fill: '#ff6b6b' },
      {
        t: 'r',
        x: 0.19,
        y: 0.44,
        w: 0.06,
        h: 0.12,
        rad: 2,
        fill: '#ff6b6b',
        anim: { k: 'blink', spd: 2 },
      },
      {
        t: 'pl',
        pts: [
          [0.62, 0.62],
          [0.74, 0.4],
          [0.86, 0.62],
        ],
        stroke: '#46e8a0',
        lw: 3,
        glow: '#46e8a0',
        anim: { k: 'bob', amp: 0.03, spd: 1.4 },
      },
      {
        t: 'ln',
        a: [0.74, 0.42],
        b: [0.74, 0.64],
        stroke: '#46e8a0',
        lw: 3,
        anim: { k: 'bob', amp: 0.03, spd: 1.4 },
      },
    ],
  },

  // SEO — content refresh: a renewal loop around an old post.
  'content-refresh-how-to-update-old-posts-for-new-rankings': {
    bg: ['#10211c', '#08120e'],
    el: [
      {
        t: 'r',
        x: 0.36,
        y: 0.28,
        w: 0.28,
        h: 0.44,
        rad: 6,
        fill: 'rgba(255,255,255,0.06)',
        stroke: '#2bb6a3',
        lw: 1.2,
      },
      {
        t: 'r',
        x: 0.4,
        y: 0.36,
        w: 0.2,
        h: 0.025,
        rad: 2,
        fill: 'rgba(255,255,255,0.3)',
      },
      {
        t: 'r',
        x: 0.4,
        y: 0.43,
        w: 0.16,
        h: 0.025,
        rad: 2,
        fill: 'rgba(255,255,255,0.2)',
      },
      {
        t: 'ar',
        x: 0.5,
        y: 0.5,
        rad: 0.3,
        a0: 0.5,
        a1: 5.9,
        stroke: '#7af0e0',
        lw: 3,
        glow: '#2bb6a3',
        anim: { k: 'rot', spd: 0.9 },
      },
      {
        t: 'pl',
        pts: [
          [0.74, 0.28],
          [0.82, 0.26],
          [0.8, 0.36],
        ],
        close: true,
        fill: '#7af0e0',
        anim: { k: 'rot', spd: 0.9 },
      },
    ],
  },

  // Growth — long-tail SEO: a head spike trailing into a long low tail.
  'seo-for-saas-the-long-tail-strategy-that-works': {
    bg: ['#241a0c', '#130d05'],
    el: [
      {
        t: 'ln',
        a: [0.1, 0.78],
        b: [0.9, 0.78],
        stroke: 'rgba(255,255,255,0.18)',
        lw: 1.2,
      },
      {
        t: 'pl',
        pts: [
          [0.12, 0.26],
          [0.2, 0.5],
          [0.3, 0.64],
          [0.46, 0.72],
          [0.64, 0.75],
          [0.88, 0.76],
        ],
        stroke: '#f0b429',
        lw: 3,
        glow: '#f0b429',
        close: false,
      },
      {
        t: 'pl',
        pts: [
          [0.12, 0.78],
          [0.12, 0.26],
          [0.2, 0.5],
          [0.3, 0.64],
          [0.46, 0.72],
          [0.64, 0.75],
          [0.88, 0.76],
          [0.88, 0.78],
        ],
        close: true,
        fill: 'rgba(240,180,41,0.12)',
      },
    ],
  },

  // Indie Dev — hiring a contractor: two avatars over a signed contract.
  'how-to-hire-your-first-contractor-without-losing-money': {
    bg: ['#12211c', '#0a0e0c'],
    el: [
      { t: 'c', x: 0.32, y: 0.34, rad: 0.09, fill: '#46e8a0', glow: '#46e8a0' },
      { t: 'c', x: 0.56, y: 0.34, rad: 0.09, fill: '#83d8ad' },
      {
        t: 'r',
        x: 0.3,
        y: 0.54,
        w: 0.34,
        h: 0.26,
        rad: 6,
        fill: 'rgba(255,255,255,0.06)',
        stroke: '#3ba776',
        lw: 1.2,
      },
      {
        t: 'r',
        x: 0.34,
        y: 0.6,
        w: 0.22,
        h: 0.025,
        rad: 2,
        fill: 'rgba(255,255,255,0.25)',
      },
      {
        t: 'tx',
        x: 0.78,
        y: 0.42,
        s: '$',
        size: 0.12,
        fill: '#e0b34a',
        w: 900,
        glow: '#e0b34a',
      },
    ],
  },

  // SEO — content ROI: an ascending bar chart crowned with a dollar.
  'measuring-content-roi-metrics-that-matter-to-your-ceo': {
    bg: ['#10211c', '#08120e'],
    el: [
      {
        t: 'ln',
        a: [0.12, 0.8],
        b: [0.7, 0.8],
        stroke: 'rgba(255,255,255,0.18)',
        lw: 1.2,
      },
      { t: 'r', x: 0.16, y: 0.6, w: 0.1, h: 0.2, rad: 3, fill: '#2bb6a3' },
      { t: 'r', x: 0.3, y: 0.5, w: 0.1, h: 0.3, rad: 3, fill: '#2bb6a3' },
      {
        t: 'r',
        x: 0.44,
        y: 0.36,
        w: 0.1,
        h: 0.44,
        rad: 3,
        fill: '#7af0e0',
        glow: '#2bb6a3',
      },
      {
        t: 'tx',
        x: 0.82,
        y: 0.4,
        s: '$',
        size: 0.16,
        fill: '#7af0e0',
        w: 900,
        glow: '#2bb6a3',
        anim: { k: 'pulse', amp: 0.06, spd: 1.4 },
      },
    ],
  },

  // AI Tools — image gen cost: a generated frame with a price tag.
  'ai-image-generation-for-marketing-a-cost-breakdown': {
    bg: ['#1c1530', '#0e0a1a'],
    el: [
      {
        t: 'r',
        x: 0.16,
        y: 0.26,
        w: 0.46,
        h: 0.46,
        rad: 10,
        fill: 'rgba(255,255,255,0.04)',
        stroke: 'rgba(255,255,255,0.14)',
        lw: 1,
      },
      {
        t: 'c',
        x: 0.3,
        y: 0.44,
        rad: 0.07,
        fill: '#a07bf0',
        glow: '#a07bf0',
        anim: { k: 'pulse', amp: 0.06, spd: 1.3, ph: 0 },
      },
      {
        t: 'c',
        x: 0.46,
        y: 0.52,
        rad: 0.06,
        fill: '#46c7c7',
        anim: { k: 'pulse', amp: 0.06, spd: 1.3, ph: 1.2 },
      },
      { t: 'r', x: 0.66, y: 0.6, w: 0.2, h: 0.14, rad: 6, fill: '#f0c45a' },
      {
        t: 'tx',
        x: 0.76,
        y: 0.67,
        s: '$',
        size: 0.08,
        fill: '#2a1d05',
        w: 900,
      },
    ],
  },

  // Growth — community-led growth: members orbiting a glowing core.
  'community-led-growth-the-playbook-for-2026': {
    bg: ['#241a0c', '#130d05'],
    el: [
      ...Array.from({ length: 8 }, (_, i): El => {
        const a = (i / 8) * Math.PI * 2;
        return {
          t: 'c',
          x: 0.5 + Math.cos(a) * 0.3,
          y: 0.48 + Math.sin(a) * 0.3,
          rad: 0.035,
          fill: '#83d8ad',
          anim: { k: 'pulse', amp: 0.2, spd: 1.6, ph: i },
        };
      }),
      { t: 'c', x: 0.5, y: 0.48, rad: 0.09, fill: '#f0b429', glow: '#f0b429' },
    ],
  },

  // Indie Dev — startup rollercoaster: a cart riding a big emotional wave.
  'the-emotional-rollercoaster-of-running-a-startup': {
    bg: ['#12211c', '#0a0e0c'],
    el: [
      {
        t: 'pl',
        pts: [
          [0.08, 0.5],
          [0.22, 0.3],
          [0.36, 0.66],
          [0.5, 0.32],
          [0.64, 0.66],
          [0.78, 0.34],
          [0.92, 0.52],
        ],
        stroke: '#46e8a0',
        lw: 3,
        glow: '#3ba776',
      },
      {
        t: 'c',
        x: 0.5,
        y: 0.32,
        rad: 0.035,
        fill: '#9ff0c6',
        glow: '#46e8a0',
        anim: { k: 'bob', amp: 0.04, spd: 1.6 },
      },
    ],
  },

  // Productivity — read faster: text lines with a fast-forward marker.
  'how-to-read-faster-without-losing-comprehension': {
    bg: ['#241a0c', '#120d04'],
    el: [
      ...Array.from(
        { length: 4 },
        (_, i): El => ({
          t: 'r',
          x: 0.16,
          y: 0.32 + i * 0.12,
          w: 0.46 - i * 0.04,
          h: 0.04,
          rad: 2,
          fill: 'rgba(255,255,255,0.25)',
        })
      ),
      {
        t: 'tx',
        x: 0.78,
        y: 0.5,
        s: '»',
        size: 0.2,
        fill: '#f0b429',
        glow: '#f0b429',
        anim: { k: 'drift', dx: 0.02, spd: 2 },
      },
    ],
  },

  // AI Tools — AI cuts content time 70%: a progress ring at 70% with a spark.
  'how-we-use-ai-to-cut-our-content-production-time-by-70': {
    bg: ['#1c1530', '#0e0a1a'],
    el: [
      {
        t: 'c',
        x: 0.42,
        y: 0.48,
        rad: 0.24,
        stroke: 'rgba(255,255,255,0.14)',
        lw: 6,
      },
      {
        t: 'ar',
        x: 0.42,
        y: 0.48,
        rad: 0.24,
        a0: -1.57,
        a1: -1.57 + 0.7 * Math.PI * 2,
        stroke: '#a07bf0',
        lw: 6,
        glow: '#a07bf0',
      },
      { t: 'tx', x: 0.42, y: 0.48, s: '70%', size: 0.1, fill: '#fff', w: 900 },
      {
        t: 'tx',
        x: 0.78,
        y: 0.3,
        s: '✦',
        size: 0.08,
        fill: '#c9b3ff',
        glow: '#a07bf0',
        anim: { k: 'pulse', amp: 0.2, spd: 2 },
      },
    ],
  },

  // Growth — copy that sells: a pen drawing a rising dollar.
  'how-to-write-copy-that-sells-even-if-you-are-not-a-writer': {
    bg: ['#241a0c', '#130d05'],
    el: [
      {
        t: 'tx',
        x: 0.28,
        y: 0.5,
        s: '✎',
        size: 0.18,
        fill: '#f0b429',
        glow: '#f0b429',
        anim: { k: 'bob', amp: 0.03, spd: 1.4 },
      },
      {
        t: 'pl',
        pts: [
          [0.46, 0.66],
          [0.6, 0.5],
          [0.7, 0.56],
          [0.86, 0.3],
        ],
        stroke: '#83d8ad',
        lw: 2.6,
      },
      {
        t: 'tx',
        x: 0.78,
        y: 0.3,
        s: '$',
        size: 0.12,
        fill: '#9ff0c6',
        w: 900,
        glow: '#83d8ad',
      },
    ],
  },

  // Indie Dev — side projects that stall: a launch that flatlines.
  'why-most-side-projects-never-become-businesses': {
    bg: ['#12211c', '#0a0e0c'],
    el: [
      {
        t: 'ln',
        a: [0.1, 0.8],
        b: [0.9, 0.8],
        stroke: 'rgba(255,255,255,0.18)',
        lw: 1.2,
      },
      {
        t: 'pl',
        pts: [
          [0.12, 0.74],
          [0.3, 0.4],
          [0.46, 0.36],
          [0.62, 0.4],
          [0.88, 0.44],
        ],
        stroke: '#83d8ad',
        lw: 3,
        op: 0.8,
      },
      {
        t: 'pl',
        pts: [
          [0.42, 0.32],
          [0.46, 0.36],
          [0.42, 0.4],
        ],
        stroke: '#ff6b6b',
        lw: 2.6,
      },
      {
        t: 'c',
        x: 0.62,
        y: 0.4,
        rad: 0.02,
        fill: '#ff6b6b',
        anim: { k: 'blink', spd: 2 },
      },
    ],
  },

  // Productivity — morning routine for night owls: moon giving way to sun.
  'the-morning-routine-that-actually-works-for-night-owls': {
    bg: ['#241a0c', '#120d04'],
    el: [
      { t: 'c', x: 0.3, y: 0.46, rad: 0.12, fill: '#7cc0ee', glow: '#7cc0ee' },
      { t: 'c', x: 0.35, y: 0.42, rad: 0.1, fill: '#241a0c' },
      {
        t: 'ln',
        a: [0.46, 0.46],
        b: [0.56, 0.46],
        stroke: '#f0b429',
        lw: 2.4,
        dash: [4, 4],
        anim: { k: 'dash', spd: 1.6 },
      },
      {
        t: 'c',
        x: 0.72,
        y: 0.46,
        rad: 0.1,
        fill: '#f0b429',
        glow: '#f0b429',
        anim: { k: 'pulse', amp: 0.06, spd: 1.4 },
      },
      ...Array.from({ length: 8 }, (_, i): El => {
        const a = (i / 8) * Math.PI * 2;
        return {
          t: 'ln',
          a: [0.72 + Math.cos(a) * 0.13, 0.46 + Math.sin(a) * 0.13],
          b: [0.72 + Math.cos(a) * 0.17, 0.46 + Math.sin(a) * 0.17],
          stroke: '#f0b429',
          lw: 2,
        };
      }),
    ],
  },

  // AI Tools — open-source models rival GPT-4: open braces balancing an orb.
  'open-source-ai-models-that-rival-gpt-4-in-2026': {
    bg: ['#1c1530', '#0e0a1a'],
    el: [
      {
        t: 'tx',
        x: 0.28,
        y: 0.48,
        s: '</>',
        size: 0.16,
        fill: '#46c7c7',
        glow: '#46c7c7',
        anim: { k: 'pulse', amp: 0.05, spd: 1.4, ph: 0 },
      },
      { t: 'tx', x: 0.5, y: 0.48, s: '≈', size: 0.12, fill: '#fff', w: 900 },
      {
        t: 'c',
        x: 0.72,
        y: 0.48,
        rad: 0.13,
        fill: '#a07bf0',
        glow: '#a07bf0',
        anim: { k: 'pulse', amp: 0.05, spd: 1.4, ph: 1.5 },
      },
      { t: 'tx', x: 0.72, y: 0.48, s: '4', size: 0.1, fill: '#0e0a1a', w: 900 },
    ],
  },

  // Growth — minimum viable marketing stack: three lean channel tiles.
  'the-minimum-viable-marketing-stack-for-indie-devs': {
    bg: ['#241a0c', '#130d05'],
    el: [
      {
        t: 'r',
        x: 0.18,
        y: 0.4,
        w: 0.18,
        h: 0.2,
        rad: 8,
        fill: '#f0b429',
        glow: '#f0b429',
      },
      { t: 'r', x: 0.41, y: 0.4, w: 0.18, h: 0.2, rad: 8, fill: '#83d8ad' },
      { t: 'r', x: 0.64, y: 0.4, w: 0.18, h: 0.2, rad: 8, fill: '#7cc0ee' },
      { t: 'tx', x: 0.27, y: 0.5, s: '✉', size: 0.08, fill: '#2a1d05' },
      { t: 'tx', x: 0.5, y: 0.5, s: '𝕏', size: 0.08, fill: '#0d1b2a' },
      { t: 'tx', x: 0.73, y: 0.5, s: '#', size: 0.08, fill: '#08120e' },
    ],
  },

  // AI Tools — coding assistants: a code window with three rival sparks.
  'ai-coding-assistants-copilot-vs-cody-vs-codeium': {
    bg: ['#1c1530', '#0e0a1a'],
    el: [
      {
        t: 'r',
        x: 0.14,
        y: 0.2,
        w: 0.72,
        h: 0.6,
        rad: 10,
        fill: 'rgba(255,255,255,0.05)',
        stroke: 'rgba(255,255,255,0.12)',
        lw: 1,
      },
      {
        t: 'r',
        x: 0.2,
        y: 0.36,
        w: 0.3,
        h: 0.03,
        rad: 2,
        fill: 'rgba(255,255,255,0.4)',
      },
      {
        t: 'r',
        x: 0.24,
        y: 0.46,
        w: 0.36,
        h: 0.03,
        rad: 2,
        fill: 'rgba(255,255,255,0.25)',
      },
      {
        t: 'tx',
        x: 0.34,
        y: 0.64,
        s: '✦',
        size: 0.07,
        fill: '#a07bf0',
        anim: { k: 'pulse', amp: 0.2, spd: 1.8, ph: 0 },
      },
      {
        t: 'tx',
        x: 0.5,
        y: 0.64,
        s: '✦',
        size: 0.07,
        fill: '#46c7c7',
        anim: { k: 'pulse', amp: 0.2, spd: 1.8, ph: 1.2 },
      },
      {
        t: 'tx',
        x: 0.66,
        y: 0.64,
        s: '✦',
        size: 0.07,
        fill: '#ff8ab4',
        anim: { k: 'pulse', amp: 0.2, spd: 1.8, ph: 2.4 },
      },
    ],
  },

  // Indie Dev — remote-first company: a globe of connected nodes.
  'building-a-remote-first-company-from-day-one': {
    bg: ['#12211c', '#0a0e0c'],
    el: [
      { t: 'c', x: 0.5, y: 0.48, rad: 0.26, stroke: '#3ba776', lw: 1.6 },
      {
        t: 'ar',
        x: 0.5,
        y: 0.48,
        rad: 0.26,
        a0: 1.2,
        a1: 1.94,
        stroke: '#46e8a0',
        lw: 1.6,
      },
      {
        t: 'ln',
        a: [0.24, 0.48],
        b: [0.76, 0.48],
        stroke: '#3ba776',
        lw: 1,
        op: 0.5,
      },
      ...(
        [
          [0.5, 0.22],
          [0.34, 0.62],
          [0.68, 0.6],
          [0.5, 0.74],
        ] as [number, number][]
      ).map(
        (p): El => ({
          t: 'c',
          x: p[0],
          y: p[1],
          rad: 0.03,
          fill: '#9ff0c6',
          glow: '#46e8a0',
          anim: { k: 'pulse', amp: 0.2, spd: 1.6, ph: p[0] * 6 },
        })
      ),
    ],
  },

  // Productivity — digital minimalism: a decluttered 30-day mark.
  'digital-minimalism-for-developers-a-30-day-challenge': {
    bg: ['#241a0c', '#120d04'],
    el: [
      {
        t: 'tx',
        x: 0.42,
        y: 0.46,
        s: '30',
        size: 0.26,
        fill: '#f0b429',
        w: 900,
        glow: '#f0b429',
      },
      { t: 'c', x: 0.72, y: 0.34, rad: 0.025, fill: 'rgba(255,255,255,0.5)' },
      { t: 'c', x: 0.78, y: 0.5, rad: 0.025, fill: 'rgba(255,255,255,0.35)' },
      { t: 'c', x: 0.7, y: 0.62, rad: 0.025, fill: 'rgba(255,255,255,0.25)' },
    ],
  },

  // AI Tools — AI agents hype vs reality: a balance scale weighing both.
  'the-rise-of-ai-agents-hype-vs-reality': {
    bg: ['#1c1530', '#0e0a1a'],
    el: [
      { t: 'ln', a: [0.5, 0.28], b: [0.5, 0.6], stroke: '#a07bf0', lw: 2.4 },
      {
        t: 'ln',
        a: [0.26, 0.34],
        b: [0.74, 0.34],
        stroke: '#a07bf0',
        lw: 2.4,
        anim: { k: 'bob', amp: 0.02, spd: 1.3 },
      },
      {
        t: 'ar',
        x: 0.26,
        y: 0.34,
        rad: 0.12,
        a0: 0.2,
        a1: 2.94,
        stroke: '#ff8ab4',
        lw: 2,
      },
      {
        t: 'ar',
        x: 0.74,
        y: 0.34,
        rad: 0.12,
        a0: 0.2,
        a1: 2.94,
        stroke: '#46c7c7',
        lw: 2,
      },
      {
        t: 'pl',
        pts: [
          [0.44, 0.62],
          [0.56, 0.62],
          [0.5, 0.7],
        ],
        close: true,
        fill: '#a07bf0',
      },
      {
        t: 'tx',
        x: 0.5,
        y: 0.84,
        s: '?',
        size: 0.08,
        fill: '#c9b3ff',
        w: 900,
        anim: { k: 'blink', spd: 1.6 },
      },
    ],
  },

  // Indie Dev — exit strategy: a fork branching to sell / pivot / shut down.
  'the-exit-strategy-when-to-sell-pivot-or-shut-down': {
    bg: ['#12211c', '#0a0e0c'],
    el: [
      { t: 'ln', a: [0.2, 0.74], b: [0.42, 0.5], stroke: '#46e8a0', lw: 3 },
      { t: 'ln', a: [0.42, 0.5], b: [0.7, 0.26], stroke: '#9ff0c6', lw: 2.6 },
      { t: 'ln', a: [0.42, 0.5], b: [0.74, 0.5], stroke: '#83d8ad', lw: 2.6 },
      { t: 'ln', a: [0.42, 0.5], b: [0.7, 0.74], stroke: '#e0b34a', lw: 2.6 },
      { t: 'c', x: 0.42, y: 0.5, rad: 0.03, fill: '#46e8a0', glow: '#46e8a0' },
      { t: 'c', x: 0.7, y: 0.26, rad: 0.025, fill: '#9ff0c6' },
      { t: 'c', x: 0.74, y: 0.5, rad: 0.025, fill: '#83d8ad' },
      { t: 'c', x: 0.7, y: 0.74, rad: 0.025, fill: '#e0b34a' },
    ],
  },

  // AI Tools — evaluating AI tools: a scoring matrix with checks.
  'how-to-evaluate-ai-tools-a-framework-for-teams': {
    bg: ['#1c1530', '#0e0a1a'],
    el: [
      ...Array.from({ length: 9 }, (_, i): El => {
        const c = i % 3;
        const r = Math.floor(i / 3);
        return {
          t: 'r',
          x: 0.28 + c * 0.16,
          y: 0.28 + r * 0.16,
          w: 0.13,
          h: 0.13,
          rad: 4,
          fill: 'rgba(255,255,255,0.05)',
          stroke: 'rgba(255,255,255,0.16)',
          lw: 1,
        };
      }),
      ...([0, 4, 8, 5] as number[]).map((i): El => {
        const c = i % 3;
        const r = Math.floor(i / 3);
        return {
          t: 'tx',
          x: 0.345 + c * 0.16,
          y: 0.355 + r * 0.16,
          s: '✓',
          size: 0.06,
          fill: '#46c7c7',
          anim: { k: 'pulse', amp: 0.12, spd: 1.6, ph: i },
        };
      }),
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
