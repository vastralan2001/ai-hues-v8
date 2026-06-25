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
  motion,
} from './_kit';

// Metaphor: a calm AI triage hub. A flood of inquiry "envelopes" streams in
// along a fast wire from the left toward one small glowing hexagonal node, which
// answers instantly — quick reply sparks fanning out to the right. Many questions
// in, fast answers out, one quiet intelligent node at the center.

const HUB_X = 116;
const HUB_Y = 50;

function Envelope({
  x,
  y,
  s,
  seed,
}: {
  x: number;
  y: number;
  s: number;
  seed: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Ink
        d={gen.rectangle(
          -7,
          -5,
          14,
          10,
          filled(seed, '#ffffff', {
            fillStyle: 'solid',
            strokeWidth: 1.1,
            roughness: 1,
          })
        )}
      />
      <Ink
        d={gen.path('M-7 -5 L0 1 L7 -5', stroke(seed + 1, { strokeWidth: 1 }))}
      />
    </g>
  );
}

export default function Scene() {
  return (
    <Frame sky={['#fdf3e6', '#f7e0c6']}>
      <defs>
        <radialGradient id='cs_hub' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff2d6' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff2d6' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* atmosphere */}
      <Twinkle x={30} y={20} c='#cf9836' />
      <Twinkle x={176} y={26} d={0.7} c='#e0a83f' />
      <Cloud x={52} y={24} s={0.8} o={0.4} />

      {/* far horizon for depth */}
      <Ink
        d={gen.path(
          'M0 86 Q100 80 200 86 L200 100 L0 100 Z',
          filled(301, '#eecfa2', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* incoming wire: questions streaming toward the hub */}
      <RoughDash
        d={`M8 64 Q60 60 ${HUB_X} ${HUB_Y}`}
        c='#cf9836'
        w={2}
        dur={1.2}
        dash='2 6'
        seed={302}
        o={0.7}
      />

      {/* a few inquiry envelopes riding in, smaller toward the hub (depth) */}
      <motion.g
        animate={{ x: [0, 18, 0], opacity: [0.85, 1, 0.85] }}
        transition={loop(2.4)}
      >
        <Envelope x={20} y={62} s={1} seed={310} />
      </motion.g>
      <motion.g
        animate={{ x: [0, 16, 0], opacity: [0.7, 1, 0.7] }}
        transition={loop(2.4, 0.6)}
      >
        <Envelope x={52} y={58} s={0.78} seed={314} />
      </motion.g>
      <motion.g
        animate={{ x: [0, 12, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={loop(2.4, 1.1)}
      >
        <Envelope x={82} y={54} s={0.58} seed={318} />
      </motion.g>

      {/* outgoing reply sparks: fast answers fanning out to the right */}
      {[
        { dx: 60, dy: -16, d: 0, seed: 330 },
        { dx: 64, dy: 2, d: 0.45, seed: 332 },
        { dx: 58, dy: 18, d: 0.9, seed: 334 },
      ].map((r) => (
        <motion.g
          key={r.dy}
          animate={{ opacity: [0.25, 0.85, 0.25], x: [0, 6, 0] }}
          transition={loop(1.6, r.d)}
        >
          <Ink
            d={gen.line(
              HUB_X + 12,
              HUB_Y + r.dy / 2,
              HUB_X + r.dx,
              HUB_Y + r.dy,
              {
                stroke: '#788c5d',
                strokeWidth: 1.4,
                roughness: 1.5,
                seed: r.seed,
              }
            )}
          />
        </motion.g>
      ))}

      {/* hub glow */}
      <circle cx={HUB_X} cy={HUB_Y} r='30' fill='url(#cs_hub)' />

      {/* outer pulse ring */}
      <motion.g
        animate={{ scale: [0.9, 1.35, 0.9], opacity: [0.45, 0, 0.45] }}
        transition={loop(2.6)}
        style={{ transformOrigin: `${HUB_X}px ${HUB_Y}px` }}
      >
        <Ink
          d={gen.circle(
            HUB_X,
            HUB_Y,
            26,
            stroke(320, { stroke: '#e0a83f', strokeWidth: 1, roughness: 0.9 })
          )}
        />
      </motion.g>

      {/* the AI node: a small calm hexagon with a breathing core */}
      <motion.g
        animate={{ scale: [1, 1.06, 1] }}
        transition={loop(2.4)}
        style={{ transformOrigin: `${HUB_X}px ${HUB_Y}px` }}
      >
        <Ink
          d={gen.polygon(
            [
              [HUB_X, HUB_Y - 13],
              [HUB_X + 11, HUB_Y - 6.5],
              [HUB_X + 11, HUB_Y + 6.5],
              [HUB_X, HUB_Y + 13],
              [HUB_X - 11, HUB_Y + 6.5],
              [HUB_X - 11, HUB_Y - 6.5],
            ],
            filled(321, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.3 })
          )}
        />
        <Ink
          d={gen.circle(
            HUB_X,
            HUB_Y,
            10,
            filled(322, '#f6e7bb', { fillStyle: 'solid' })
          )}
        />
        <motion.g
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={loop(1.6)}
          style={{ transformOrigin: `${HUB_X}px ${HUB_Y}px` }}
        >
          <Ink
            d={gen.circle(
              HUB_X,
              HUB_Y,
              4.4,
              filled(323, '#cf9836', { fillStyle: 'solid' })
            )}
          />
        </motion.g>
      </motion.g>
    </Frame>
  );
}
