'use client';

import { __iconNode as botNode } from 'lucide-react/dist/esm/icons/bot.mjs';
import { __iconNode as codeXmlNode } from 'lucide-react/dist/esm/icons/code-xml.mjs';
import { __iconNode as gamepadNode } from 'lucide-react/dist/esm/icons/gamepad.mjs';
import { __iconNode as microscopeNode } from 'lucide-react/dist/esm/icons/microscope.mjs';
import { __iconNode as rocketNode } from 'lucide-react/dist/esm/icons/rocket.mjs';
import { __iconNode as searchNode } from 'lucide-react/dist/esm/icons/search.mjs';
import { __iconNode as sparklesNode } from 'lucide-react/dist/esm/icons/sparkles.mjs';
import { __iconNode as trendingUpNode } from 'lucide-react/dist/esm/icons/trending-up.mjs';
import { __iconNode as zapNode } from 'lucide-react/dist/esm/icons/zap.mjs';

import { Frame, RoughIcon, INK } from './_kit';
import type { IconNode } from './_kit';

const TAG_CFG: Record<
  string,
  {
    icon: IconNode;
    sky: [string, string];
    fill: string;
    accent: string;
  }
> = {
  'AI Tools': {
    icon: botNode,
    sky: ['#f5f3ff', '#ede9fe'],
    fill: '#a78bfa',
    accent: '#7c3aed',
  },
  'AI Research': {
    icon: microscopeNode,
    sky: ['#eff6ff', '#dbeafe'],
    fill: '#60a5fa',
    accent: '#2563eb',
  },
  Development: {
    icon: codeXmlNode,
    sky: ['#ecfeff', '#cffafe'],
    fill: '#22d3ee',
    accent: '#0891b2',
  },
  Games: {
    icon: gamepadNode,
    sky: ['#fffbeb', '#fef3c7'],
    fill: '#fbbf24',
    accent: '#d97706',
  },
  Growth: {
    icon: trendingUpNode,
    sky: ['#ecfdf5', '#d1fae5'],
    fill: '#34d399',
    accent: '#059669',
  },
  'Indie Dev': {
    icon: rocketNode,
    sky: ['#fff7ed', '#ffedd5'],
    fill: '#fb923c',
    accent: '#ea580c',
  },
  Productivity: {
    icon: zapNode,
    sky: ['#fefce8', '#fef9c3'],
    fill: '#facc15',
    accent: '#ca8a04',
  },
  SEO: {
    icon: searchNode,
    sky: ['#f7fee7', '#ecfccb'],
    fill: '#a3e635',
    accent: '#65a30d',
  },
  Research: {
    icon: sparklesNode,
    sky: ['#faf5ff', '#f3e8ff'],
    fill: '#c084fc',
    accent: '#9333ea',
  },
};

/* Generic fallback scene for articles without a bespoke scene. Uses the article
   tag to pick a soft gradient sky + a hand-drawn lucide icon so the card grid
   stays consistent even when new auto-generated articles land before their
   custom scene is authored. */
export default function FallbackScene({ tag }: { tag: string }) {
  const cfg = TAG_CFG[tag] ?? TAG_CFG.Research;
  return (
    <Frame sky={cfg.sky}>
      {/* soft background rings — plain SVG for smooth solids */}
      <circle cx='100' cy='50' r='36' fill={cfg.fill} opacity='0.25' />
      <circle cx='100' cy='50' r='28' fill={cfg.fill} opacity='0.45' />

      {/* hand-drawn tag icon */}
      <RoughIcon
        node={cfg.icon}
        x={100}
        y={50}
        size={46}
        c={INK}
        fill={cfg.accent}
        seed={1000}
      />
    </Frame>
  );
}
