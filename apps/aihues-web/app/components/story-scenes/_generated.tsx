'use client';

import { __iconNode as atomNode } from 'lucide-react/dist/esm/icons/atom.mjs';
import { __iconNode as barChartNode } from 'lucide-react/dist/esm/icons/chart-bar.mjs';
import { __iconNode as botNode } from 'lucide-react/dist/esm/icons/bot.mjs';
import { __iconNode as brainNode } from 'lucide-react/dist/esm/icons/brain.mjs';
import { __iconNode as bugNode } from 'lucide-react/dist/esm/icons/bug.mjs';
import { __iconNode as checkSquareNode } from 'lucide-react/dist/esm/icons/square-check.mjs';
import { __iconNode as codeXmlNode } from 'lucide-react/dist/esm/icons/code-xml.mjs';
import { __iconNode as cpuNode } from 'lucide-react/dist/esm/icons/cpu.mjs';
import { __iconNode as diceNode } from 'lucide-react/dist/esm/icons/dice-5.mjs';
import { __iconNode as gamepadNode } from 'lucide-react/dist/esm/icons/gamepad-2.mjs';
import { __iconNode as globeNode } from 'lucide-react/dist/esm/icons/globe.mjs';
import { __iconNode as joystickNode } from 'lucide-react/dist/esm/icons/joystick.mjs';
import { __iconNode as microscopeNode } from 'lucide-react/dist/esm/icons/microscope.mjs';
import { __iconNode as networkNode } from 'lucide-react/dist/esm/icons/network.mjs';
import { __iconNode as puzzleNode } from 'lucide-react/dist/esm/icons/puzzle.mjs';
import { __iconNode as rocketNode } from 'lucide-react/dist/esm/icons/rocket.mjs';
import { __iconNode as searchNode } from 'lucide-react/dist/esm/icons/search.mjs';
import { __iconNode as sparklesNode } from 'lucide-react/dist/esm/icons/sparkles.mjs';
import { __iconNode as targetNode } from 'lucide-react/dist/esm/icons/target.mjs';
import { __iconNode as terminalNode } from 'lucide-react/dist/esm/icons/terminal.mjs';
import { __iconNode as trendingUpNode } from 'lucide-react/dist/esm/icons/trending-up.mjs';
import { __iconNode as wandNode } from 'lucide-react/dist/esm/icons/wand-sparkles.mjs';
import { __iconNode as zapNode } from 'lucide-react/dist/esm/icons/zap.mjs';

import { Frame, INK, Ink, RoughIcon, Twinkle, gen } from './_kit';
import type { IconNode } from './_kit';

type Palette = {
  sky: [string, string];
  fill: string;
  accent: string;
  soft: string;
};

const PALETTES: Palette[] = [
  {
    sky: ['#fdf2e4', '#f1dcc6'],
    fill: '#e0a83f',
    accent: '#c2502e',
    soft: '#f5e6d3',
  },
  {
    sky: ['#eff6ff', '#dbeafe'],
    fill: '#60a5fa',
    accent: '#2563eb',
    soft: '#dbeafe',
  },
  {
    sky: ['#f5f3ff', '#ede9fe'],
    fill: '#a78bfa',
    accent: '#7c3aed',
    soft: '#ede9fe',
  },
  {
    sky: ['#ecfdf5', '#d1fae5'],
    fill: '#34d399',
    accent: '#059669',
    soft: '#d1fae5',
  },
  {
    sky: ['#fff7ed', '#ffedd5'],
    fill: '#fb923c',
    accent: '#ea580c',
    soft: '#ffedd5',
  },
  {
    sky: ['#fefce8', '#fef9c3'],
    fill: '#facc15',
    accent: '#ca8a04',
    soft: '#fef9c3',
  },
  {
    sky: ['#fff1f2', '#ffe4e6'],
    fill: '#fb7185',
    accent: '#e11d48',
    soft: '#ffe4e6',
  },
  {
    sky: ['#ecfeff', '#cffafe'],
    fill: '#22d3ee',
    accent: '#0891b2',
    soft: '#cffafe',
  },
  {
    sky: ['#f0f9ff', '#e0f2fe'],
    fill: '#38bdf8',
    accent: '#0284c7',
    soft: '#e0f2fe',
  },
  {
    sky: ['#f7fee7', '#ecfccb'],
    fill: '#a3e635',
    accent: '#65a30d',
    soft: '#ecfccb',
  },
  {
    sky: ['#faf5ff', '#f3e8ff'],
    fill: '#c084fc',
    accent: '#9333ea',
    soft: '#f3e8ff',
  },
  {
    sky: ['#fffbeb', '#fef3c7'],
    fill: '#fbbf24',
    accent: '#d97706',
    soft: '#fef3c7',
  },
  {
    sky: ['#f0fdfa', '#ccfbf1'],
    fill: '#2dd4bf',
    accent: '#0f766e',
    soft: '#ccfbf1',
  },
  {
    sky: ['#eef2ff', '#e0e7ff'],
    fill: '#818cf8',
    accent: '#4f46e5',
    soft: '#e0e7ff',
  },
  {
    sky: ['#fff0f5', '#ffd6e8'],
    fill: '#f472b6',
    accent: '#db2777',
    soft: '#ffd6e8',
  },
  {
    sky: ['#f5f5f4', '#e7e5e4'],
    fill: '#a8a29e',
    accent: '#78716c',
    soft: '#e7e5e4',
  },
];

const TAG_ICONS: Record<string, IconNode[]> = {
  'AI Tools': [botNode, wandNode, sparklesNode, brainNode, zapNode],
  'AI Research': [
    microscopeNode,
    atomNode,
    brainNode,
    networkNode,
    sparklesNode,
  ],
  Development: [codeXmlNode, terminalNode, cpuNode, bugNode, networkNode],
  Games: [gamepadNode, puzzleNode, diceNode, joystickNode, targetNode],
  Growth: [trendingUpNode, barChartNode, targetNode, rocketNode, zapNode],
  Productivity: [zapNode, checkSquareNode, targetNode, wandNode, sparklesNode],
  SEO: [searchNode, globeNode, targetNode, trendingUpNode, barChartNode],
  Research: [sparklesNode, microscopeNode, atomNode, brainNode, networkNode],
  'Indie Dev': [rocketNode, codeXmlNode, terminalNode, cpuNode, wandNode],
};

function hash(s: string, i = 0): number {
  let h = i * 374761393;
  for (let k = 0; k < s.length; k++) {
    h = (h ^ s.charCodeAt(k)) * 668265263;
    h = h ^ (h >>> 13);
  }
  h = h ^ (h >>> 16);
  return Math.abs(h) / 2147483647;
}

function pick<T>(arr: T[], s: string, i: number): T {
  return arr[Math.floor(hash(s, i) * arr.length)];
}

function iconFor(tag: string, s: string): IconNode {
  const icons = TAG_ICONS[tag] ?? TAG_ICONS.Research;
  return pick(icons, s, 1);
}

function paletteFor(s: string): Palette {
  return pick(PALETTES, s, 0);
}

/* A deterministic, per-article generated scene for auto-generated posts.
   It avoids the "all fallback looks the same" problem by hashing the slug
   to pick a unique palette + icon + background shapes + sparkles. */
export default function GeneratedScene({
  slug,
  tag,
}: {
  slug: string;
  tag: string;
}) {
  const p = paletteFor(slug);
  const icon = iconFor(tag, slug);
  const seedBase = Math.floor(hash(slug, 7) * 10000);

  // 2-3 large soft background shapes
  const shapeCount = 2 + Math.floor(hash(slug, 2) * 2);
  const shapes = Array.from({ length: shapeCount }, (_, i) => {
    const h = hash(slug, 10 + i);
    const kind = h > 0.55 ? 'rect' : 'circle';
    const x = 20 + Math.floor(hash(slug, 20 + i) * 140);
    const y = 15 + Math.floor(hash(slug, 30 + i) * 55);
    const size = 28 + Math.floor(hash(slug, 40 + i) * 36);
    return { kind, x, y, size, opacity: 0.18 + hash(slug, 50 + i) * 0.18 };
  });

  // 2-5 small twinkles
  const twinkleCount = 2 + Math.floor(hash(slug, 3) * 4);
  const twinkles = Array.from({ length: twinkleCount }, (_, i) => ({
    x: 12 + Math.floor(hash(slug, 60 + i) * 176),
    y: 8 + Math.floor(hash(slug, 70 + i) * 84),
    r: 0.7 + hash(slug, 80 + i) * 0.9,
    d: hash(slug, 90 + i) * 2.4,
  }));

  // A few rough hachure accent strokes behind the icon
  const accentCount = 2 + Math.floor(hash(slug, 4) * 3);
  const accents = Array.from({ length: accentCount }, (_, i) => {
    const cx = 100 + (hash(slug, 100 + i) - 0.5) * 50;
    const cy = 50 + (hash(slug, 110 + i) - 0.5) * 30;
    const r = 10 + hash(slug, 120 + i) * 22;
    return { cx, cy, r, seed: seedBase + i };
  });

  return (
    <Frame sky={p.sky}>
      {/* soft background shapes */}
      {shapes.map((s, i) =>
        s.kind === 'circle' ? (
          <circle
            key={`bg-${i}`}
            cx={s.x}
            cy={s.y}
            r={s.size}
            fill={p.soft}
            opacity={s.opacity}
          />
        ) : (
          <rect
            key={`bg-${i}`}
            x={s.x - s.size / 2}
            y={s.y - s.size / 2}
            width={s.size}
            height={s.size * 0.72}
            rx={s.size * 0.16}
            fill={p.soft}
            opacity={s.opacity}
          />
        )
      )}

      {/* rough hachure accent rings */}
      {accents.map((a, i) => (
        <Ink
          key={`acc-${i}`}
          d={gen.circle(a.cx, a.cy, a.r * 2, {
            stroke: p.accent,
            strokeWidth: 0.9,
            roughness: 1.3,
            bowing: 1.2,
            seed: a.seed,
            hachureGap: 3.2,
            hachureAngle: 60 + i * 30,
          })}
        />
      ))}

      {/* central icon */}
      <RoughIcon
        node={icon}
        x={100}
        y={50}
        size={48}
        c={INK}
        fill={p.accent}
        seed={seedBase}
      />

      {/* small sparkles */}
      {twinkles.map((t, i) => (
        <Twinkle key={`tw-${i}`} x={t.x} y={t.y} r={t.r} d={t.d} c={p.accent} />
      ))}
    </Frame>
  );
}
