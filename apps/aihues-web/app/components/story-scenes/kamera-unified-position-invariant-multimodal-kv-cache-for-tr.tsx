'use client';

import { __iconNode as cameraNode } from 'lucide-react/dist/esm/icons/camera.mjs';
import { __iconNode as videoNode } from 'lucide-react/dist/esm/icons/video.mjs';

import { Frame, RoughIcon, Twinkle, INK, motion, loop } from './_kit';

/* Kamera — training-free KV cache upgrade for multimodal agents.
   Metaphor: a camera lens with a small video frame sliding past, suggesting
   position-invariant caching over video. Teal-green sky. */

export default function Scene() {
  return (
    <Frame sky={['#f0faf7', '#dcede5']}>
      {/* camera lens body */}
      <RoughIcon
        node={cameraNode}
        x={100}
        y={54}
        size={64}
        c={INK}
        fill='#34d399'
        seed={371}
      />

      {/* video frame orbiting the lens */}
      <motion.g
        animate={{ x: [0, 10, 0], y: [0, -6, 0] }}
        transition={loop(3.0, 0.4)}
        style={{ transformOrigin: '140px 34px' }}
      >
        <RoughIcon
          node={videoNode}
          x={140}
          y={34}
          size={32}
          c={INK}
          fill='#059669'
          seed={372}
        />
      </motion.g>

      <Twinkle x={32} y={28} r={0.8} c='#22d3ee' d={0.9} />
    </Frame>
  );
}
