'use client';

import { __iconNode as layersNode } from 'lucide-react/dist/esm/icons/layers.mjs';
import { __iconNode as bookOpenNode } from 'lucide-react/dist/esm/icons/book-open.mjs';

import { Frame, RoughIcon, Twinkle, INK, motion, loop } from './_kit';

/* Deckwise — AI turns raw notes into slide decks.
   Metaphor: a stack of slides fanning out from an open notebook. Warm
   terracotta sky; the top slide gently lifts, mid-transformation. */

export default function Scene() {
  return (
    <Frame sky={['#fdf2ec', '#f5ddd0']}>
      {/* open notes at the bottom */}
      <RoughIcon
        node={bookOpenNode}
        x={100}
        y={62}
        size={54}
        c={INK}
        fill='#d9a08a'
        seed={391}
      />

      {/* slides fanning upward */}
      <motion.g
        animate={{ y: [0, -5, 0], rotate: [0, -3, 0] }}
        transition={loop(2.4, 0.3)}
        style={{ transformOrigin: '100px 42px' }}
      >
        <RoughIcon
          node={layersNode}
          x={100}
          y={42}
          size={48}
          c={INK}
          fill='#c2502e'
          seed={392}
        />
      </motion.g>

      <Twinkle x={36} y={30} r={0.8} c='#e2693f' d={0.6} />
    </Frame>
  );
}
