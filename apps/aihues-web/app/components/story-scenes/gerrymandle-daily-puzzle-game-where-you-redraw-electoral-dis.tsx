'use client';

import { __iconNode as mapNode } from 'lucide-react/dist/esm/icons/map.mjs';
import { __iconNode as penNode } from 'lucide-react/dist/esm/icons/pen-tool.mjs';

import { Frame, RoughIcon, Twinkle, INK, motion, loop } from './_kit';

/* Gerrymandle — redraw electoral districts like a daily puzzle.
   Metaphor: a rough map with one district being redrawn by a pen tool.
   Muted earth-and-slate sky; the pen hovers, mid-stroke. */

export default function Scene() {
  return (
    <Frame sky={['#f2f0ea', '#e4e1d8']}>
      {/* soft map base */}
      <RoughIcon
        node={mapNode}
        x={100}
        y={54}
        size={64}
        c={INK}
        fill='#b8b2a3'
        seed={341}
      />

      {/* redrawing pen, tracing a new boundary */}
      <motion.g
        animate={{ x: [0, 6, 0], y: [0, -4, 0] }}
        transition={loop(2.6, 0.2)}
        style={{ transformOrigin: '146px 34px' }}
      >
        <RoughIcon
          node={penNode}
          x={146}
          y={34}
          size={34}
          c={INK}
          fill='#6a9bcc'
          seed={342}
        />
      </motion.g>

      <Twinkle x={32} y={30} r={0.7} c='#5a86c5' d={0.5} />
    </Frame>
  );
}
