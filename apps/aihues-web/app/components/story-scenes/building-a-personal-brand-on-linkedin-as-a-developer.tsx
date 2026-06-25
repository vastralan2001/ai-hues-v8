'use client';
import {
  Frame,
  Ink,
  Twinkle,
  Cloud,
  gen,
  filled,
  stroke,
  loop,
  motion,
} from './_kit';

/* Metaphor: a single developer's signal compounding into reach. One small lit
   workstation on a quiet dusk hill broadcasts expanding concentric arcs over the
   horizon; reach-nodes (followers) light up along the rings as the signal carries
   outward — 0 → 50K from one consistent source. */

const CX = 70;
const CY = 64;

export default function Scene() {
  const rings = [
    { r: 26, seed: 311, dur: 4.2, delay: 0 },
    { r: 42, seed: 312, dur: 4.2, delay: 1.4 },
    { r: 60, seed: 313, dur: 4.2, delay: 2.8 },
  ];
  // reach-nodes seeded at fixed angles along the outward rings
  const nodes = [
    { x: 122, y: 40, d: 0.0 },
    { x: 150, y: 58, d: 0.5 },
    { x: 134, y: 74, d: 1.0 },
    { x: 168, y: 36, d: 1.5 },
    { x: 110, y: 22, d: 2.0 },
  ];

  return (
    <Frame sky={['#f4eee0', '#e7d6c2']}>
      <defs>
        <radialGradient id='lnkbrand_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3d8' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff3d8' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='lnkbrand_hill' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#a8b98c' />
          <stop offset='100%' stopColor='#788c5d' />
        </linearGradient>
      </defs>

      {/* faint dusk accents */}
      <Twinkle x={30} y={20} c='#cf9836' />
      <Cloud x={150} y={20} s={0.8} o={0.4} />

      {/* warm broadcast glow at the source */}
      <circle cx={CX} cy={CY - 6} r={40} fill='url(#lnkbrand_glow)' />

      {/* distant horizon hill (depth) */}
      <Ink
        d={gen.path(
          'M0 74 Q60 60 116 70 T200 66 L200 100 L0 100 Z',
          filled(301, '#cdd6bb', { roughness: 1.6, hachureGap: 4 })
        )}
      />

      {/* expanding signal rings — the compounding reach */}
      {rings.map((ring) => (
        <motion.g
          key={ring.seed}
          animate={{ scale: [0.5, 1.18], opacity: [0, 0.55, 0] }}
          transition={loop(ring.dur, ring.delay)}
          style={{ transformOrigin: `${CX}px ${CY - 4}px` }}
        >
          <Ink
            d={gen.path(
              `M${CX - ring.r} ${CY - 4} A ${ring.r} ${ring.r * 0.62} 0 0 1 ${CX + ring.r} ${CY - 4}`,
              stroke(ring.seed, {
                stroke: '#5a86c5',
                strokeWidth: 1.1,
                roughness: 1,
              })
            )}
          />
        </motion.g>
      ))}

      {/* near hill the source sits on */}
      <Ink
        d={gen.path(
          'M0 84 Q70 70 140 82 T200 86 L200 100 L0 100 Z',
          filled(302, 'url(#lnkbrand_hill)', {
            fillStyle: 'solid',
            roughness: 1.4,
            strokeWidth: 1.2,
          })
        )}
      />

      {/* reach-nodes lighting up along the rings */}
      {nodes.map((n) => (
        <motion.g
          key={`${n.x}-${n.y}`}
          animate={{ scale: [0.4, 1, 0.4], opacity: [0.15, 0.95, 0.15] }}
          transition={loop(4.2, n.d)}
          style={{ transformOrigin: `${n.x}px ${n.y}px` }}
        >
          <Ink
            d={gen.circle(
              n.x,
              n.y,
              4,
              filled(320 + Math.round(n.x), '#e2693f', { fillStyle: 'solid' })
            )}
          />
        </motion.g>
      ))}

      {/* the source: a small lit workstation on a slim post */}
      <motion.g
        animate={{ y: [0, -1.6, 0] }}
        transition={loop(3)}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      >
        {/* post */}
        <Ink
          d={gen.line(
            CX,
            CY + 6,
            CX,
            CY + 20,
            stroke(303, { strokeWidth: 1.4 })
          )}
        />
        {/* monitor body */}
        <Ink
          d={gen.rectangle(
            CX - 11,
            CY - 9,
            22,
            16,
            filled(304, '#ffffff', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        {/* code lines on screen */}
        <Ink
          d={gen.line(
            CX - 6,
            CY - 4,
            CX + 5,
            CY - 4,
            stroke(305, { stroke: '#788c5d', strokeWidth: 1.4 })
          )}
        />
        <Ink
          d={gen.line(
            CX - 6,
            CY,
            CX + 1,
            CY,
            stroke(306, { stroke: '#cf9836', strokeWidth: 1.4 })
          )}
        />
        {/* the broadcast spark leaving the screen */}
        <motion.g
          animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.7, 1, 0.7] }}
          transition={loop(1.8)}
          style={{ transformOrigin: `${CX}px ${CY - 2}px` }}
        >
          <Ink
            d={gen.circle(
              CX,
              CY - 2,
              4,
              filled(307, '#f0b449', { fillStyle: 'solid' })
            )}
          />
        </motion.g>
      </motion.g>
    </Frame>
  );
}
