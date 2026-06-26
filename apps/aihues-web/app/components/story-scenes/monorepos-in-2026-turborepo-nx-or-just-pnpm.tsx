'use client';

import {
  Frame,
  Ink,
  Twinkle,
  Cloud,
  RoughDash,
  gen,
  filled,
  stroke,
  loop,
  INK,
  motion,
} from './_kit';

/* Monorepos in 2026 — metaphor: ONE shared root system feeding a single trunk,
   with several small package "crates" nesting on its boughs, linked by dashed
   dependency lines that flow up from the roots. Many packages, one root. */

export default function Scene() {
  return (
    <Frame sky={['#f4f1e6', '#dfe9d2']}>
      <defs>
        <radialGradient id='mono26_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff6df' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#fff6df' stopOpacity='0' />
        </radialGradient>
      </defs>

      <circle cx='150' cy='26' r='40' fill='url(#mono26_glow)' />
      <Twinkle x={38} y={22} c='#cf9836' />
      <Cloud x={52} y={30} s={0.8} o={0.4} />

      {/* distant ground swell for depth */}
      <Ink
        d={gen.path(
          'M0 84 Q100 76 200 84 L200 100 L0 100 Z',
          filled(401, '#cdd9bb', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />
      <Ink
        d={gen.path(
          'M0 90 Q100 86 200 90 L200 100 L0 100 Z',
          filled(402, '#aebf95', { roughness: 1.4, hachureGap: 3 })
        )}
      />

      {/* the shared root system: one trunk fanning into roots below ground */}
      <Ink
        d={gen.path(
          'M96 90 L96 52 M104 90 L104 52',
          stroke(403, { strokeWidth: 1.3, stroke: '#7a5a3a' })
        )}
      />
      <Ink
        d={gen.path(
          'M100 90 L100 56 M100 90 Q86 94 74 98 M100 90 Q114 94 128 98 M100 91 Q92 96 84 99 M100 91 Q108 96 118 99',
          stroke(404, { strokeWidth: 1.1, stroke: '#7a5a3a', roughness: 1.5 })
        )}
      />

      {/* canopy — one soft crown above the shared trunk */}
      <Ink
        d={gen.path(
          'M100 18 C84 18 74 30 76 42 C66 44 64 58 76 60 C84 66 116 66 124 60 C136 58 134 44 124 42 C126 30 116 18 100 18 Z',
          filled(405, '#94ac78', { hachureGap: 3.2, fillWeight: 0.6 })
        )}
      />

      {/* the boughs the package crates hang from */}
      <Ink
        d={gen.path(
          'M100 54 Q82 50 70 56 M100 50 Q120 46 132 52 M100 46 L100 30',
          stroke(406, { strokeWidth: 1.2, stroke: '#7a5a3a' })
        )}
      />

      {/* dashed dependency flow rising from roots up through the trunk */}
      <RoughDash
        d='M100 94 L100 30'
        c='#e0a83f'
        w={1.4}
        dur={1.8}
        dash='2 6'
        seed={407}
      />

      {/* three package crates — many modules, one root */}
      <Crate x={70} y={58} color='#c2502e' seed={410} ph={0} />
      <Crate x={132} y={54} color='#5a86c5' seed={420} ph={0.9} />
      <Crate x={100} y={28} color='#e0a83f' seed={430} ph={1.6} />
    </Frame>
  );
}

function Crate({
  x,
  y,
  color,
  seed,
  ph,
}: {
  x: number;
  y: number;
  color: string;
  seed: number;
  ph: number;
}) {
  return (
    <motion.g
      animate={{ y: [0, -2.2, 0], rotate: [-1.5, 1.5, -1.5] }}
      transition={loop(2.8, ph)}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      <Ink
        d={gen.ellipse(
          x,
          y + 9,
          16,
          3.6,
          filled(seed + 3, INK, {
            fillStyle: 'solid',
            stroke: 'none',
            strokeWidth: 0,
            roughness: 1.4,
          })
        )}
      />
      <Ink
        d={gen.rectangle(
          x - 7,
          y - 6,
          14,
          12,
          filled(seed, color, {
            fillStyle: 'solid',
            strokeWidth: 1.2,
            roughness: 1,
          })
        )}
      />
      <Ink
        d={gen.line(
          x - 7,
          y,
          x + 7,
          y,
          stroke(seed + 1, { stroke: '#fbf6ec', strokeWidth: 1 })
        )}
      />
      <Ink
        d={gen.line(
          x,
          y - 6,
          x,
          y + 6,
          stroke(seed + 2, { stroke: '#fbf6ec', strokeWidth: 1 })
        )}
      />
    </motion.g>
  );
}
