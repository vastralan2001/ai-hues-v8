'use client';

import { __iconNode as flameNode } from 'lucide-react/dist/esm/icons/flame.mjs';
import { __iconNode as networkNode } from 'lucide-react/dist/esm/icons/network.mjs';

import { Frame, RoughIcon, Twinkle, INK, motion, loop } from './_kit';

/* Propane — one connected, always-current customer view for product teams.
   Metaphor: a warm flame at the center of a small network, like a shared
   customer signal keeping the team aligned. Terracotta dusk sky. */

export default function Scene() {
  return (
    <Frame sky={['#fdf1e8', '#f5dcc8']}>
      {/* network outline behind the flame */}
      <RoughIcon
        node={networkNode}
        x={100}
        y={52}
        size={72}
        c={INK}
        fill='#e8b79a'
        seed={331}
      />

      {/* central flame, gently breathing */}
      <motion.g
        animate={{ scale: [1, 1.08, 1] }}
        transition={loop(2.2)}
        style={{ transformOrigin: '100px 52px' }}
      >
        <RoughIcon
          node={flameNode}
          x={100}
          y={52}
          size={42}
          c={INK}
          fill='#e2693f'
          seed={332}
        />
      </motion.g>

      <Twinkle x={164} y={28} r={0.8} c='#cf9836' d={0.7} />
    </Frame>
  );
}
