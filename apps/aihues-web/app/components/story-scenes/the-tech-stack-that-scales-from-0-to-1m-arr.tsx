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
  linear,
  INK,
  motion,
} from './_kit';

/* Metaphor: a scaling aqueduct of stone arches. The stack rises from a small
   solo pier on the left to a broad, tall span on the right — load-bearing tiers
   that grow without buckling — over an unbroken bedrock foundation (the thing
   you never compromise on). A bright current of light flows across the deck,
   $0 → $1M ARR running the length of the structure. */

export default function Scene() {
  // each pier: [x of left edge, top y of its arch springline]
  const piers = [
    { x: 40, deck: 70, w: 14, seed: 310 },
    { x: 72, deck: 60, w: 18, seed: 313 },
    { x: 110, deck: 49, w: 22, seed: 316 },
    { x: 154, deck: 37, w: 26, seed: 319 },
  ];

  return (
    <Frame sky={['#fbf3e0', '#f0d8ad']}>
      <defs>
        <radialGradient id='ts1m_sun' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff4d8' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff4d8' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='ts1m_flow' x1='0' y1='0' x2='1' y2='0'>
          <stop offset='0%' stopColor='#e0a83f' stopOpacity='0' />
          <stop offset='50%' stopColor='#e0a83f' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#e2693f' stopOpacity='0' />
        </linearGradient>
      </defs>

      {/* warm dawn glow toward the tall, grown end */}
      <circle cx='176' cy='20' r='42' fill='url(#ts1m_sun)' />
      <Twinkle x={30} y={20} c='#cf9836' />
      <Twinkle x={186} y={40} d={0.8} c='#e0a83f' />
      <Twinkle x={120} y={16} d={1.4} c='#cf9836' r={0.9} />
      <Cloud x={56} y={26} s={0.7} o={0.4} />
      <Cloud x={150} y={64} s={0.6} o={0.3} />

      {/* far haze hill for depth */}
      <Ink
        d={gen.path(
          'M0 84 Q70 76 140 82 T200 80 L200 100 L0 100 Z',
          filled(301, '#e6cfa0', { roughness: 1.6, hachureGap: 4 })
        )}
      />

      {/* unbroken bedrock foundation — the thing you never compromise on */}
      <Ink
        d={gen.path(
          'M0 90 Q100 86 200 90 L200 100 L0 100 Z',
          filled(302, '#caa56e', { roughness: 1.4, hachureGap: 3.2 })
        )}
      />
      <Ink
        d={gen.line(
          2,
          89,
          198,
          90,
          stroke(303, { stroke: '#9c7a48', strokeWidth: 1.2 })
        )}
      />

      {/* the rising arches: each pier is taller + wider than the last (scaling) */}
      {piers.map((p) => {
        const cx = p.x + p.w / 2;
        const base = 90;
        // two legs down to the bedrock
        const legs = `M${p.x} ${p.deck} L${p.x} ${base} M${p.x + p.w} ${p.deck} L${p.x + p.w} ${base}`;
        // the arch span (semicircle between the legs)
        const arch = `M${p.x} ${p.deck} Q${cx} ${p.deck - p.w * 0.62} ${p.x + p.w} ${p.deck}`;
        return (
          <g key={p.seed}>
            <Ink d={gen.path(legs, stroke(p.seed, { strokeWidth: 1.3 }))} />
            <Ink d={gen.path(arch, stroke(p.seed + 1, { strokeWidth: 1.3 }))} />
            {/* deck slab capping each tier */}
            <Ink
              d={gen.rectangle(
                p.x - 1.5,
                p.deck - 4.5,
                p.w + 3,
                4.5,
                filled(p.seed + 2, '#d98f54', {
                  fillStyle: 'solid',
                  strokeWidth: 1.2,
                })
              )}
            />
          </g>
        );
      })}

      {/* the deck line linking pier to pier — the structure carried across */}
      <Ink
        d={gen.path(
          'M40 65.5 L86 55.5 L132 44.5 L180 32.5',
          stroke(330, { stroke: '#9c7a48', strokeWidth: 1.4, roughness: 1 })
        )}
      />

      {/* current of revenue flowing $0 → $1M along the deck */}
      <motion.path
        d='M40 64 L86 54 L132 43 L180 31'
        fill='none'
        stroke='url(#ts1m_flow)'
        strokeWidth='2.4'
        strokeLinecap='round'
        strokeDasharray='3 9'
        animate={{ strokeDashoffset: [0, -24] }}
        transition={linear(1.7)}
      />

      {/* a small keystone spark pulsing on the largest, grown arch */}
      <motion.g
        animate={{ scale: [0.9, 1.12, 0.9], opacity: [0.8, 1, 0.8] }}
        transition={loop(2.3)}
        style={{ transformOrigin: '167px 25px' }}
      >
        <Ink
          d={gen.circle(
            167,
            25,
            5,
            filled(331, '#e2693f', { fillStyle: 'solid' })
          )}
        />
      </motion.g>

      {/* gentle breathing on the small solo origin pier — the $0 start */}
      <motion.g
        animate={{ scale: [1, 1.05, 1] }}
        transition={loop(2.8)}
        style={{ transformOrigin: '47px 80px' }}
      >
        <Ink
          d={gen.circle(
            47,
            76,
            3.4,
            filled(335, '#788c5d', { fillStyle: 'solid' })
          )}
        />
      </motion.g>
    </Frame>
  );
}
