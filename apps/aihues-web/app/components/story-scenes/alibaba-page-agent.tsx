'use client';

import { __iconNode as mousePointerNode } from 'lucide-react/dist/esm/icons/mouse-pointer.mjs';
import { __iconNode as targetNode } from 'lucide-react/dist/esm/icons/target.mjs';

import { Frame, RoughIcon, Twinkle, INK, motion, loop } from './_kit';

/* Page Agent — a browser agent that points and acts inside the page.
   Metaphor: a rough mouse cursor homing in on a target ring, as if the agent
   is about to click. Sage dawn sky with a single soft accent sparkle. */

export default function Scene() {
  return (
    <Frame sky={['#f4f9f4', '#e3efe3']}>
      {/* soft target ring behind the cursor */}
      <circle cx='100' cy='50' r='34' fill='#c8dac1' opacity='0.22' />
      <circle cx='100' cy='50' r='22' fill='#a8c99d' opacity='0.18' />

      {/* target cross */}
      <RoughIcon
        node={targetNode}
        x={100}
        y={50}
        size={58}
        c={INK}
        fill='#94ac78'
        seed={301}
      />

      {/* the agent cursor, gently bobbing as it hovers over the target */}
      <motion.g
        animate={{ y: [0, 2, 0], x: [0, 1, 0] }}
        transition={loop(2.4, 0.2)}
      >
        <RoughIcon
          node={mousePointerNode}
          x={116}
          y={64}
          size={42}
          c={INK}
          fill='#c2502e'
          seed={302}
        />
      </motion.g>

      <Twinkle x={28} y={24} r={0.9} c='#788c5d' d={0.4} />
    </Frame>
  );
}
