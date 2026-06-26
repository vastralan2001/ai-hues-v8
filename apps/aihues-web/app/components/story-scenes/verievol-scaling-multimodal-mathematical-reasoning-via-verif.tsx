'use client';

import { __iconNode as triangleNode } from 'lucide-react/dist/esm/icons/triangle.mjs';
import { __iconNode as chartLineNode } from 'lucide-react/dist/esm/icons/chart-line.mjs';

import { Frame, RoughIcon, Twinkle, INK, motion, loop } from './_kit';

/* VeriEvol — verifiable data scaling teaches AI visual mathematical reasoning.
   Metaphor: a geometric proof triangle rising along a chart line, as if the
   model is learning to climb from axioms to solutions. Sage-gold sky. */

export default function Scene() {
  return (
    <Frame sky={['#f5f8f1', '#e6eddc']}>
      {/* rising reasoning curve */}
      <RoughIcon
        node={chartLineNode}
        x={100}
        y={60}
        size={68}
        c={INK}
        fill='#b8c9a3'
        seed={381}
      />

      {/* proof triangle, bobbing above the curve */}
      <motion.g
        animate={{ y: [0, -4, 0], rotate: [0, 5, 0] }}
        transition={loop(2.8, 0.2)}
        style={{ transformOrigin: '100px 40px' }}
      >
        <RoughIcon
          node={triangleNode}
          x={100}
          y={40}
          size={40}
          c={INK}
          fill='#e0a83f'
          seed={382}
        />
      </motion.g>

      <Twinkle x={160} y={72} r={0.8} c='#788c5d' d={1.0} />
    </Frame>
  );
}
