'use client';

import { __iconNode as brainNode } from 'lucide-react/dist/esm/icons/brain.mjs';
import { __iconNode as networkNode } from 'lucide-react/dist/esm/icons/network.mjs';

import { Frame, RoughIcon, Twinkle, INK, motion, loop } from './_kit';

/* Cognee — open-source memory layer for AI agents.
   Metaphor: a brain-shaped memory graph with connecting nodes pulsing softly.
   Deep purple-slate sky, suggesting recall and long-term memory. */

export default function Scene() {
  return (
    <Frame sky={['#f4f1f7', '#e6e0ed']}>
      {/* memory network behind the brain */}
      <RoughIcon
        node={networkNode}
        x={100}
        y={54}
        size={72}
        c={INK}
        fill='#b9aef0'
        seed={411}
      />

      {/* brain, gently breathing */}
      <motion.g
        animate={{ scale: [1, 1.05, 1] }}
        transition={loop(3.0, 0.1)}
        style={{ transformOrigin: '100px 52px' }}
      >
        <RoughIcon
          node={brainNode}
          x={100}
          y={52}
          size={52}
          c={INK}
          fill='#8b7bd8'
          seed={412}
        />
      </motion.g>

      <Twinkle x={164} y={28} r={0.9} c='#9333ea' d={0.7} />
    </Frame>
  );
}
