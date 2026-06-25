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

/* Metaphor: affiliate marketing for SaaS as a confluence — several distant
   partner nodes each send a flowing tributary of value down toward one central
   glowing collector basin. Partners (the small ringed nodes on the far hills)
   drive revenue inward; the streams converge and fill the hub at the center. */

const HUB_X = 100;
const HUB_Y = 60;

type Partner = {
  x: number;
  y: number;
  trail: string;
  col: string;
  dur: number;
  d: number;
};
const PARTNERS: Partner[] = [
  {
    x: 24,
    y: 40,
    trail: 'M24 42 Q44 50 70 56 T100 60',
    col: '#788c5d',
    dur: 1.8,
    d: 0,
  },
  {
    x: 60,
    y: 28,
    trail: 'M60 30 Q72 40 84 50 T100 60',
    col: '#6a9bcc',
    dur: 2.1,
    d: 0.5,
  },
  {
    x: 140,
    y: 26,
    trail: 'M140 28 Q126 40 114 50 T100 60',
    col: '#e0a83f',
    dur: 2.0,
    d: 0.9,
  },
  {
    x: 178,
    y: 38,
    trail: 'M178 40 Q156 50 130 56 T100 60',
    col: '#c2502e',
    dur: 1.9,
    d: 0.3,
  },
];

export default function Scene() {
  return (
    <Frame sky={['#fbf4e6', '#f0e2c6']}>
      <defs>
        <radialGradient id='affsaas_basin' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3d4' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff3d4' stopOpacity='0' />
        </radialGradient>
      </defs>

      <Twinkle x={36} y={18} c='#cf9836' />
      <Twinkle x={164} y={16} d={0.7} c='#94ac78' />
      <Cloud x={52} y={20} s={0.7} o={0.4} />

      {/* far depth ridge the partner nodes sit on */}
      <Ink
        d={gen.path(
          'M0 48 Q50 36 100 44 T200 42 L200 100 L0 100 Z',
          filled(301, '#e4d6b4', { roughness: 1.6, hachureGap: 4 })
        )}
      />
      <Ink
        d={gen.path(
          'M0 70 Q60 60 100 66 T200 64 L200 100 L0 100 Z',
          filled(302, '#d9caa0', { roughness: 1.5, hachureGap: 3.4 })
        )}
      />

      {/* converging tributaries of value — rough static streams, with one
          animated dashed trail leading the eye into the basin */}
      {PARTNERS.map((p, i) =>
        i === 0 ? (
          <RoughDash
            key={i}
            d={p.trail}
            c={p.col}
            w={1.6}
            dur={p.dur}
            seed={340 + i}
            dash='2 6'
            o={0.85}
          />
        ) : (
          <Ink
            key={i}
            d={gen.path(p.trail, {
              stroke: p.col,
              strokeWidth: 1.4,
              roughness: 1.4,
              bowing: 1.6,
              seed: 340 + i,
            })}
          />
        )
      )}

      {/* partner nodes — small ringed sources */}
      {PARTNERS.map((p, i) => (
        <motion.g
          key={`n${i}`}
          animate={{ scale: [0.9, 1.08, 0.9] }}
          transition={loop(2.4, p.d)}
          style={{ transformOrigin: `${p.x}px ${p.y}px` }}
        >
          <Ink
            d={gen.circle(
              p.x,
              p.y,
              6,
              stroke(310 + i, { stroke: p.col, strokeWidth: 1.2, roughness: 1 })
            )}
          />
          <Ink
            d={gen.circle(
              p.x,
              p.y,
              2.6,
              filled(320 + i, p.col, { fillStyle: 'solid' })
            )}
          />
        </motion.g>
      ))}

      {/* the central collector basin glow */}
      <circle cx={HUB_X} cy={HUB_Y} r={26} fill='url(#affsaas_basin)' />

      {/* faint shadow under the hub */}
      <g opacity='0.1'>
        <Ink
          d={gen.ellipse(HUB_X, HUB_Y + 16, 36, 8, {
            fill: INK,
            fillStyle: 'solid',
            stroke: 'none',
            roughness: 1.4,
            seed: 334,
          })}
        />
      </g>

      {/* the SaaS hub — a small vault filling with converged value */}
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={loop(2.8)}
        style={{ transformOrigin: `${HUB_X}px ${HUB_Y}px` }}
      >
        {/* basin / cistern body */}
        <Ink
          d={gen.path(
            'M86 56 L114 56 L110 74 L90 74 Z',
            filled(330, '#ffffff', {
              fillStyle: 'solid',
              strokeWidth: 1.3,
              roughness: 1,
            })
          )}
        />
        {/* rising fill level inside */}
        <motion.g
          animate={{ y: [3, 0, 3] }}
          transition={loop(2.6)}
          style={{ transformOrigin: `${HUB_X}px 70px` }}
        >
          <Ink
            d={gen.path(
              'M89 67 L111 67 L110 74 L90 74 Z',
              filled(331, '#e0a83f', { hachureGap: 2.2, fillWeight: 0.8 })
            )}
          />
        </motion.g>
        {/* rim line */}
        <Ink d={gen.line(85, 56, 115, 56, stroke(332, { strokeWidth: 1.4 }))} />
        {/* crowning star — revenue earned */}
        <motion.g
          animate={{ scale: [0.94, 1.1, 0.94], rotate: [0, 8, 0] }}
          transition={loop(2.2)}
          style={{ transformOrigin: `${HUB_X}px 48px` }}
        >
          <Ink
            d={gen.polygon(
              [
                [100, 42],
                [102, 47],
                [107, 47.4],
                [103.2, 50.6],
                [104.4, 55],
                [100, 52.4],
                [95.6, 55],
                [96.8, 50.6],
                [93, 47.4],
                [98, 47],
              ],
              filled(333, '#cf9836', { fillStyle: 'solid' })
            )}
          />
        </motion.g>
      </motion.g>
    </Frame>
  );
}
