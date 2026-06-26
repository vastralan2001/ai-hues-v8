'use client';

import { __iconNode as apertureNode } from 'lucide-react/dist/esm/icons/aperture.mjs';
import { __iconNode as cameraNode } from 'lucide-react/dist/esm/icons/camera.mjs';

import { Frame, RoughIcon, Twinkle, INK, motion, loop } from './_kit';

/* prepros — a single workflow for AI brand photo shoots.
   Metaphor: a camera aperture as the focal subject, with a small camera body
   nearby. Rose-gold studio sky with a warm accent sparkle. */

export default function Scene() {
  return (
    <Frame sky={['#fdf5f2', '#f5e3dc']}>
      {/* soft studio glow behind the aperture */}
      <circle cx='100' cy='52' r='42' fill='#e8b4a3' opacity='0.18' />

      {/* aperture, slowly rotating like a lens adjusting */}
      <motion.g
        animate={{ rotate: [0, 18, 0] }}
        transition={loop(4.0, 0.2)}
        style={{ transformOrigin: '100px 52px' }}
      >
        <RoughIcon
          node={apertureNode}
          x={100}
          y={52}
          size={56}
          c={INK}
          fill='#e2693f'
          seed={401}
        />
      </motion.g>

      {/* small camera accent */}
      <RoughIcon
        node={cameraNode}
        x={148}
        y={74}
        size={28}
        c={INK}
        fill='#c2502e'
        seed={402}
      />

      <Twinkle x={30} y={28} r={0.8} c='#cf9836' d={0.8} />
    </Frame>
  );
}
