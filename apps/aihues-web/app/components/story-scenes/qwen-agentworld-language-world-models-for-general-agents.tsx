'use client';

import { __iconNode as globeNode } from 'lucide-react/dist/esm/icons/globe.mjs';
import { __iconNode as botNode } from 'lucide-react/dist/esm/icons/bot.mjs';

import { Frame, RoughIcon, Twinkle, INK, motion, loop } from './_kit';

/* Qwen-AgentWorld — language world models for general agents.
   Metaphor: a small agent orbiting a globe/world model, connected by a dashed
   reasoning trail. Cool blue sky with a single distant sparkle. */

export default function Scene() {
  return (
    <Frame sky={['#eff6ff', '#dbeafe']}>
      {/* globe / world model */}
      <RoughIcon
        node={globeNode}
        x={100}
        y={54}
        size={62}
        c={INK}
        fill='#60a5fa'
        seed={351}
      />

      {/* orbiting agent bot */}
      <motion.g
        animate={{ rotate: [0, 360] }}
        transition={loop(12, 0)}
        style={{ transformOrigin: '100px 54px' }}
      >
        <RoughIcon
          node={botNode}
          x={148}
          y={30}
          size={28}
          c={INK}
          fill='#2563eb'
          seed={352}
        />
      </motion.g>

      <Twinkle x={34} y={72} r={0.8} c='#2563eb' d={1.2} />
    </Frame>
  );
}
