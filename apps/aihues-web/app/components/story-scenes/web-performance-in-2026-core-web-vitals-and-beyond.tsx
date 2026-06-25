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

/* Web Performance 2026 — Core Web Vitals as a performance gauge: a half-dial
   meter whose needle sweeps up out of the slow (terracotta) zone, past gold,
   into the fast (sage) zone. Three small graded ticks read as LCP / INP / CLS.
   The page is "loading into the green." */

export default function Scene() {
  return (
    <Frame sky={['#f2f6ee', '#dde8d4']}>
      <defs>
        <radialGradient id='wp26_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#eef7e2' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#eef7e2' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='wp26_arc' x1='0' y1='0' x2='1' y2='0'>
          <stop offset='0%' stopColor='#c2502e' />
          <stop offset='50%' stopColor='#e0a83f' />
          <stop offset='100%' stopColor='#788c5d' />
        </linearGradient>
      </defs>

      {/* atmosphere */}
      <Twinkle x={30} y={22} c='#94ac78' />
      <Twinkle x={172} y={26} d={0.8} c='#cf9836' />
      <Twinkle x={148} y={16} d={1.3} c='#94ac78' />
      <Cloud x={46} y={24} s={0.8} o={0.4} />
      <Cloud x={158} y={64} s={0.7} o={0.35} />

      {/* far horizon for depth */}
      <Ink
        d={gen.path(
          'M0 86 Q100 78 200 86 L200 100 L0 100 Z',
          filled(301, '#c2cfb1', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />
      <circle cx='100' cy='62' r='40' fill='url(#wp26_glow)' />

      {/* the gauge: a half-dial sitting on the horizon, needle pivoting at (100,66) */}
      {/* graded colour arc behind the dial face */}
      <path
        d='M62 66 A38 38 0 0 1 138 66'
        fill='none'
        stroke='url(#wp26_arc)'
        strokeWidth='4'
        strokeLinecap='round'
        opacity='0.85'
      />

      {/* dial outline */}
      <Ink
        d={gen.path(
          'M58 66 A42 42 0 0 1 142 66',
          stroke(302, { strokeWidth: 1.2, roughness: 1.1 })
        )}
      />

      {/* three graded ticks — LCP / INP / CLS */}
      <Ink
        d={gen.line(
          72,
          41.5,
          76,
          44.5,
          stroke(303, { stroke: '#c2502e', strokeWidth: 1.4 })
        )}
      />
      <Ink
        d={gen.line(
          100,
          32,
          100,
          37,
          stroke(304, { stroke: '#cf9836', strokeWidth: 1.4 })
        )}
      />
      <Ink
        d={gen.line(
          128,
          41.5,
          124,
          44.5,
          stroke(305, { stroke: '#788c5d', strokeWidth: 1.4 })
        )}
      />

      {/* dial face shadow */}
      <ellipse cx='100' cy='80' rx='30' ry='4' fill={INK} opacity='0.08' />

      {/* the needle, sweeping slow -> fast (pivot at 100,66) */}
      <motion.g
        animate={{ rotate: [-58, 38, -58] }}
        transition={loop(3.2)}
        style={{ transformOrigin: '100px 66px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [100, 66],
              [97, 64],
              [100, 34],
              [103, 64],
            ],
            filled(306, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
      </motion.g>

      {/* needle hub */}
      <Ink
        d={gen.circle(
          100,
          66,
          6,
          filled(307, '#fbfaf4', { fillStyle: 'solid', strokeWidth: 1.2 })
        )}
      />
      <motion.g
        animate={{ scale: [1, 1.18, 1] }}
        transition={loop(2.4)}
        style={{ transformOrigin: '100px 66px' }}
      >
        <Ink
          d={gen.circle(
            100,
            66,
            2.6,
            filled(308, '#788c5d', { fillStyle: 'solid', strokeWidth: 0.9 })
          )}
        />
      </motion.g>

      {/* a flowing progress trace skimming the green zone — page settling fast */}
      <motion.path
        d='M62 66 A38 38 0 0 1 138 66'
        fill='none'
        stroke='#788c5d'
        strokeWidth='1.4'
        strokeDasharray='2 7'
        opacity='0.55'
        animate={{ strokeDashoffset: [0, -18] }}
        transition={linear(1.8)}
      />
    </Frame>
  );
}
