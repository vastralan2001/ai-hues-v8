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

/* API Design for Humans — three different bridges span the same chasm between a
   near bank (the human/client) and a far bank (the data/server). REST is a
   sturdy three-arch stone viaduct, GraphQL a single elegant suspension span,
   tRPC a taut direct cable line. One small traveler crosses the middle, choosing
   a path. Same two sides, three trade-offs. */

const G = 'apidesign';

export default function Scene() {
  return (
    <Frame sky={['#f6f1e6', '#e4ecd9']}>
      <defs>
        <linearGradient id={`${G}_chasm`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#cdd9c2' stopOpacity='0.85' />
          <stop offset='100%' stopColor='#9fb487' stopOpacity='0.2' />
        </linearGradient>
        <radialGradient id={`${G}_haze`} cx='50%' cy='40%' r='55%'>
          <stop offset='0%' stopColor='#fff7e6' stopOpacity='0.85' />
          <stop offset='100%' stopColor='#fff7e6' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* distant haze + sky accents */}
      <circle cx='100' cy='34' r='44' fill={`url(#${G}_haze)`} />
      <Cloud x={158} y={30} s={0.7} o={0.35} />
      <Twinkle x={30} y={20} c='#cf9836' />
      <Twinkle x={176} y={18} d={0.8} c='#e0a83f' />

      {/* the chasm: rising mist between the two banks */}
      <rect x='0' y='58' width='200' height='42' fill={`url(#${G}_chasm)`} />
      {[
        [60, 86, 0, 671],
        [104, 90, 1.1, 672],
        [146, 84, 1.9, 673],
      ].map(([mx, my, d, seed]) => (
        <motion.g
          key={mx}
          animate={{ x: [0, 6, 0], opacity: [0.15, 0.5, 0.15] }}
          transition={loop(4, d)}
        >
          <Ink
            d={gen.ellipse(
              mx,
              my,
              18,
              4.8,
              filled(seed, '#fbf7ec', { fillStyle: 'solid', strokeWidth: 0.7 })
            )}
          />
        </motion.g>
      ))}

      {/* near bank (left — the human/client side) */}
      <Ink
        d={gen.path(
          'M0 62 Q22 58 40 60 L46 66 Q24 70 0 70 Z',
          filled(601, '#94ac78', { hachureGap: 3 })
        )}
      />
      {/* far bank (right — the data/server side) */}
      <Ink
        d={gen.path(
          'M200 60 Q178 56 158 58 L152 64 Q176 68 200 68 Z',
          filled(602, '#788c5d', { hachureGap: 3.4 })
        )}
      />
      {/* a few stacked "data" blocks on the far bank */}
      <Ink
        d={gen.rectangle(
          170,
          48,
          8,
          7,
          filled(603, '#cf9836', { fillStyle: 'solid', strokeWidth: 1 })
        )}
      />
      <Ink
        d={gen.rectangle(
          180,
          50,
          8,
          7,
          filled(604, '#e0a83f', { fillStyle: 'solid', strokeWidth: 1 })
        )}
      />
      <Ink
        d={gen.rectangle(
          175,
          42,
          8,
          6,
          filled(605, '#cf9836', { fillStyle: 'solid', strokeWidth: 1 })
        )}
      />

      {/* ── REST: sturdy three-arch stone viaduct (back, low) ── */}
      <g opacity='0.92'>
        <Ink
          d={gen.line(
            40,
            70,
            158,
            70,
            stroke(611, { stroke: '#a8744a', strokeWidth: 1.6 })
          )}
        />
        {[
          [56, 612],
          [86, 613],
          [116, 614],
          [146, 615],
        ].map(([px, seed]) => (
          <Ink
            key={px}
            d={gen.line(
              px,
              70,
              px,
              80,
              stroke(seed, { stroke: '#a8744a', strokeWidth: 1.2 })
            )}
          />
        ))}
        {[
          [56, 86, 616],
          [86, 116, 617],
          [116, 146, 618],
        ].map(([a, b, seed]) => (
          <Ink
            key={a}
            d={gen.path(
              `M${a} 80 Q${(a + b) / 2} 91 ${b} 80`,
              stroke(seed, { stroke: '#c2502e', strokeWidth: 1.1 })
            )}
          />
        ))}
      </g>

      {/* ── GraphQL: single elegant suspension span (middle, the chosen path) ── */}
      <g>
        <Ink
          d={gen.path(
            'M44 60 Q100 52 156 58',
            stroke(621, { stroke: '#5a86c5', strokeWidth: 1.5, roughness: 1 })
          )}
        />
        <Ink
          d={gen.path(
            'M44 60 Q100 78 156 58',
            stroke(622, { stroke: '#6a9bcc', strokeWidth: 1.2 })
          )}
        />
        {[64, 84, 100, 116, 136].map((hx, i) => {
          const top = 60 - (1 - Math.abs(hx - 100) / 56) * 6.2;
          const bot = 60 + (1 - Math.abs(hx - 100) / 56) * 13;
          return (
            <Ink
              key={hx}
              d={gen.line(
                hx,
                top,
                hx,
                bot,
                stroke(623 + i, { stroke: '#6a9bcc', strokeWidth: 0.8 })
              )}
            />
          );
        })}
        {/* two pylons */}
        <Ink
          d={gen.line(
            48,
            50,
            48,
            66,
            stroke(631, { stroke: '#5a86c5', strokeWidth: 1.4 })
          )}
        />
        <Ink
          d={gen.line(
            152,
            48,
            152,
            64,
            stroke(632, { stroke: '#5a86c5', strokeWidth: 1.4 })
          )}
        />
      </g>

      {/* ── tRPC: taut single direct cable, front, with flowing dashes ── */}
      <Ink
        d={gen.line(
          46,
          58,
          154,
          56,
          stroke(641, { stroke: '#788c5d', strokeWidth: 1.3 })
        )}
      />
      <RoughDash
        d='M46 58 L154 56'
        c='#e2693f'
        w={1.4}
        dur={1.5}
        dash='2 7'
        seed={642}
      />

      {/* ── the traveler crossing the middle (suspension) span, mid-deck ── */}
      <motion.g
        animate={{ x: [-44, 44], y: [9, 9] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatType: 'reverse',
        }}
      >
        <Ink
          d={gen.circle(
            100,
            56,
            4.4,
            filled(651, '#c2502e', { fillStyle: 'solid' })
          )}
        />
        <Ink
          d={gen.path(
            'M100 58 L100 63 M100 60 L97 62 M100 60 L103 61.4 M100 63 L97.4 67 M100 63 L102.6 67',
            stroke(652, { strokeWidth: 1.2 })
          )}
        />
      </motion.g>

      {/* a quiet pulse over the far-bank data, the destination */}
      <motion.g
        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 1, 0.5] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '178px 46px' }}
      >
        <Ink
          d={gen.circle(
            178,
            38,
            4,
            filled(661, '#e0a83f', { fillStyle: 'solid' })
          )}
        />
      </motion.g>
    </Frame>
  );
}
