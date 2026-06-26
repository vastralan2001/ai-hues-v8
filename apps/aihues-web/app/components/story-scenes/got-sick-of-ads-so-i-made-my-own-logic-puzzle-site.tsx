'use client';

import { __iconNode as puzzleNode } from 'lucide-react/dist/esm/icons/puzzle.mjs';
import { __iconNode as gridNode } from 'lucide-react/dist/esm/icons/grid-3x3.mjs';

import { Frame, RoughIcon, Twinkle, INK, motion, loop } from './_kit';

/* A clean, ad-free logic puzzle site.
   Metaphor: one puzzle piece lifted out of a tidy grid, floating in a warm
   gold sky. The grid stays calm; the piece gently rotates, inviting the user
   to slot it back in. */

export default function Scene() {
  return (
    <Frame sky={['#fdf6e8', '#f5e9d0']}>
      {/* puzzle grid base */}
      <RoughIcon
        node={gridNode}
        x={100}
        y={52}
        size={64}
        c={INK}
        fill='#e0a83f'
        seed={321}
      />

      {/* the lifted piece, bobbing and rotating slightly */}
      <motion.g
        animate={{ y: [0, -3, 0], rotate: [0, 3, 0] }}
        transition={loop(2.8, 0.3)}
        style={{ transformOrigin: '128px 34px' }}
      >
        <RoughIcon
          node={puzzleNode}
          x={128}
          y={34}
          size={36}
          c={INK}
          fill='#cf9836'
          seed={322}
        />
      </motion.g>

      <Twinkle x={36} y={72} r={0.8} c='#d97706' d={1.1} />
    </Frame>
  );
}
