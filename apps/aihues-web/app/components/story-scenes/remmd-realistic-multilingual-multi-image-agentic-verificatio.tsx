'use client';

import { __iconNode as searchNode } from 'lucide-react/dist/esm/icons/search.mjs';
import { __iconNode as imagesNode } from 'lucide-react/dist/esm/icons/images.mjs';

import { Frame, RoughIcon, Twinkle, INK, motion, loop } from './_kit';

/* ReMMD — multimodal misinformation detection across languages and images.
   Metaphor: a magnifying glass inspecting a stack of images, looking for
   manipulated details. Muted blue-gold sky. */

export default function Scene() {
  return (
    <Frame sky={['#f7f9fb', '#e8eef5']}>
      {/* image stack base */}
      <RoughIcon
        node={imagesNode}
        x={100}
        y={56}
        size={60}
        c={INK}
        fill='#9fb4dd'
        seed={361}
      />

      {/* magnifying glass, sweeping back and forth */}
      <motion.g
        animate={{ x: [-6, 6, -6], rotate: [-4, 4, -4] }}
        transition={loop(3.6, 0.1)}
        style={{ transformOrigin: '100px 48px' }}
      >
        <RoughIcon
          node={searchNode}
          x={100}
          y={48}
          size={48}
          c={INK}
          fill='#e0a83f'
          seed={362}
        />
      </motion.g>

      <Twinkle x={170} y={26} r={0.8} c='#6a9bcc' d={0.6} />
    </Frame>
  );
}
