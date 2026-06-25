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

/* Content clusters — a hub-and-spoke knowledge graph: one tall pillar-stone
   (the pillar page) rooted on a low sage rise, thin ink links fanning out to a
   ring of smaller satellite nodes (supporting articles). Authority pulses flow
   INWARD along the links toward the pillar; the whole cluster glows. */

const HUB_X = 100;
const HUB_Y = 50;

// satellite nodes orbiting the pillar (the supporting content)
const SATS: [number, number, number, string][] = [
  [54, 30, 4.2, '#94ac78'],
  [150, 28, 3.6, '#cf9836'],
  [40, 64, 3.4, '#788c5d'],
  [164, 60, 4.0, '#e2693f'],
  [78, 80, 3.2, '#6a9bcc'],
  [126, 82, 3.8, '#cf9836'],
];

export default function Scene() {
  return (
    <Frame sky={['#f7f3e6', '#e7ecd6']}>
      <defs>
        <radialGradient id='ccluster_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff5d8' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff5d8' stopOpacity='0' />
        </radialGradient>
      </defs>

      <circle cx={HUB_X} cy={HUB_Y - 6} r='40' fill='url(#ccluster_glow)' />

      <Cloud x={42} y={20} s={0.7} o={0.4} />
      <Twinkle x={26} y={44} c='#cf9836' />
      <Twinkle x={176} y={40} d={0.8} c='#94ac78' />

      {/* low sage rise the pillar is rooted on */}
      <Ink
        d={gen.path(
          'M0 78 Q100 66 200 78 L200 100 L0 100 Z',
          filled(301, '#9bb079', { hachureGap: 3.2, fillWeight: 0.65 })
        )}
      />

      {/* link lines from each satellite to the hub */}
      {SATS.map(([sx, sy], i) => (
        <Ink
          key={`link${i}`}
          d={gen.line(
            sx,
            sy,
            HUB_X,
            HUB_Y,
            stroke(310 + i, {
              stroke: '#b89a52',
              strokeWidth: 0.9,
              roughness: 1,
              bowing: 0.6,
            })
          )}
        />
      ))}

      {/* a single inward-flowing authority pulse along one link */}
      <RoughDash
        d={`M${SATS[3][0]} ${SATS[3][1]} L${HUB_X} ${HUB_Y}`}
        c='#e0a83f'
        w={1.4}
        dur={2.2}
        seed={309}
        dash='1.5 13'
      />

      {/* satellite nodes (supporting content) — gentle breathing */}
      {SATS.map(([sx, sy, sr, sc], i) => (
        <motion.g
          key={`sat${i}`}
          animate={{ scale: [1, 1.08, 1] }}
          transition={loop(2.4 + i * 0.25, i * 0.2)}
          style={{ transformOrigin: `${sx}px ${sy}px` }}
        >
          <Ink
            d={gen.circle(
              sx,
              sy,
              sr * 2,
              filled(330 + i, sc, { fillStyle: 'solid', strokeWidth: 1 })
            )}
          />
        </motion.g>
      ))}

      {/* the pillar page — a tall keystone monolith on the hub, softly pulsing */}
      <motion.g
        animate={{ y: [0, -1.6, 0] }}
        transition={loop(3)}
        style={{ transformOrigin: `${HUB_X}px ${HUB_Y}px` }}
      >
        <Ink
          d={gen.ellipse(
            HUB_X,
            72,
            28,
            6.4,
            filled(349, INK, {
              fillStyle: 'solid',
              stroke: 'none',
              strokeWidth: 0,
              roughness: 1.4,
              seed: 349,
            })
          )}
        />
        <Ink
          d={gen.path(
            'M91 71 L91 44 Q100 32 109 44 L109 71 Z',
            filled(350, '#e0a83f', { fillStyle: 'solid', strokeWidth: 1.3 })
          )}
        />
        <Ink
          d={gen.line(
            100,
            49,
            100,
            70,
            stroke(351, { stroke: '#b07a2a', strokeWidth: 0.9 })
          )}
        />
        <Ink
          d={gen.line(
            94,
            56,
            106,
            56,
            stroke(352, { stroke: '#b07a2a', strokeWidth: 0.9 })
          )}
        />
        <Ink
          d={gen.line(
            94,
            63,
            106,
            63,
            stroke(353, { stroke: '#b07a2a', strokeWidth: 0.9 })
          )}
        />
        <motion.g
          animate={{ scale: [0.9, 1.12, 0.9], opacity: [0.85, 1, 0.85] }}
          transition={loop(2.2)}
          style={{ transformOrigin: `${HUB_X}px 39px` }}
        >
          <Ink
            d={gen.polygon(
              [
                [100, 32],
                [102.2, 36.6],
                [107.2, 37.2],
                [103.6, 40.6],
                [104.5, 45.5],
                [100, 43],
                [95.5, 45.5],
                [96.4, 40.6],
                [92.8, 37.2],
                [97.8, 36.6],
              ],
              filled(354, '#e2693f', { fillStyle: 'solid' })
            )}
          />
        </motion.g>
      </motion.g>
    </Frame>
  );
}
