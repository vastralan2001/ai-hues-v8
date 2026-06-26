'use client';

import { __iconNode as shieldNode } from 'lucide-react/dist/esm/icons/shield.mjs';
import { __iconNode as cpuNode } from 'lucide-react/dist/esm/icons/cpu.mjs';

import { Frame, RoughIcon, Cloud, INK, motion, loop } from './_kit';

/* Nemoclaw — secure NVIDIA OpenShell agent runtime.
   Metaphor: a rough shield protecting a small CPU core, with a calm slate-blue
   sky behind it. The shield gently breathes, suggesting active guard. */

export default function Scene() {
  return (
    <Frame sky={['#edf4fa', '#dce8f4']}>
      {/* distant soft cloud */}
      <Cloud x={148} y={22} s={0.9} o={0.35} />

      {/* protective halo */}
      <circle cx='100' cy='52' r='40' fill='#b8d4e8' opacity='0.2' />

      {/* shield, slowly pulsing */}
      <motion.g
        animate={{ scale: [1, 1.04, 1] }}
        transition={loop(3.2)}
        style={{ transformOrigin: '100px 52px' }}
      >
        <RoughIcon
          node={shieldNode}
          x={100}
          y={52}
          size={60}
          c={INK}
          fill='#6a9bcc'
          seed={311}
        />
      </motion.g>

      {/* CPU core nested inside the shield */}
      <RoughIcon
        node={cpuNode}
        x={100}
        y={52}
        size={28}
        c={INK}
        fill='#5a86c5'
        seed={312}
      />
    </Frame>
  );
}
