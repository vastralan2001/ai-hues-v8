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

/* 2026 Overseas Growth Toolkit — a curated wall of growth instruments.
   Metaphor: a workshop tool rail. A single horizontal rail hangs four distinct
   hand-tools (wrench, key, magnifier, funnel/megaphone) — each a different
   growth discipline — swaying gently like a craftsperson's curated pegboard.
   Seeds: 300-series. Gradient ids prefixed gt26_. */

export default function Scene() {
  return (
    <Frame sky={['#fbf3e2', '#f1dcb6']}>
      <defs>
        <radialGradient id='gt26_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff5dc' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff5dc' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='gt26_rail' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#c9b48c' />
          <stop offset='100%' stopColor='#a98f63' />
        </linearGradient>
      </defs>

      {/* warm depth: low sun glow + soft far clouds */}
      <circle cx='38' cy='26' r='40' fill='url(#gt26_glow)' />
      <Cloud x={150} y={22} s={0.8} o={0.4} />
      <Cloud x={64} y={70} s={0.7} o={0.3} />
      <Twinkle x={170} y={18} c='#e0a83f' />
      <Twinkle x={24} y={50} d={0.8} c='#cf9836' />
      <Twinkle x={184} y={46} d={1.3} c='#e0a83f' />

      {/* far workbench / shelf line for ground */}
      <Ink
        d={gen.path(
          'M0 88 Q100 84 200 88 L200 100 L0 100 Z',
          filled(301, '#e6c98f', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* the rail the tools hang from */}
      <Ink
        d={gen.rectangle(
          26,
          30,
          148,
          5,
          filled(302, 'url(#gt26_rail)', {
            fillStyle: 'solid',
            strokeWidth: 1.2,
            roughness: 0.9,
          })
        )}
      />
      <Ink d={gen.line(30, 30, 30, 24, stroke(303, { strokeWidth: 1.2 }))} />
      <Ink d={gen.line(170, 30, 170, 24, stroke(304, { strokeWidth: 1.2 }))} />

      {/* hooks where each tool hangs */}
      {[58, 92, 126, 158].map((hx, i) => (
        <Ink
          key={hx}
          d={gen.line(hx, 35, hx, 40, stroke(305 + i, { strokeWidth: 1 }))}
        />
      ))}

      {/* TOOL 1 — wrench (operations / KOL management) */}
      <motion.g
        animate={{ rotate: [-2.5, 2.5, -2.5] }}
        transition={loop(3.2)}
        style={{ transformOrigin: '58px 40px' }}
      >
        <Ink
          d={gen.path(
            'M55 42 Q51 41 52 46 Q53 50 57 49 L58 64 Q58 67 60 67 Q62 67 62 64 L61 49 Q65 49 65 45 Q65 41 61 42 Q59 44 58 44 Q57 44 55 42 Z',
            filled(310, '#94ac78', { strokeWidth: 1.2, hachureGap: 2.4 })
          )}
        />
      </motion.g>

      {/* TOOL 2 — key (access / SEO unlock) */}
      <motion.g
        animate={{ rotate: [2.2, -2.2, 2.2] }}
        transition={loop(2.8, 0.3)}
        style={{ transformOrigin: '92px 40px' }}
      >
        <Ink
          d={gen.circle(
            92,
            47,
            9,
            filled(311, '#e0a83f', { strokeWidth: 1.2 })
          )}
        />
        <Ink d={gen.circle(92, 47, 3.4, stroke(312, { strokeWidth: 1 }))} />
        <Ink d={gen.line(92, 51, 92, 66, stroke(313, { strokeWidth: 1.6 }))} />
        <Ink d={gen.line(92, 60, 96, 60, stroke(314, { strokeWidth: 1.4 }))} />
        <Ink d={gen.line(92, 64, 95, 64, stroke(315, { strokeWidth: 1.4 }))} />
      </motion.g>

      {/* TOOL 3 — magnifier (social listening) */}
      <motion.g
        animate={{ rotate: [-2, 2, -2] }}
        transition={loop(3, 0.6)}
        style={{ transformOrigin: '126px 40px' }}
      >
        <Ink
          d={gen.circle(
            125,
            49,
            14,
            filled(316, '#cfe6fb', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        <Ink d={gen.circle(125, 49, 14, stroke(317, { strokeWidth: 1.3 }))} />
        <Ink d={gen.line(134, 58, 142, 66, stroke(318, { strokeWidth: 2 }))} />
        <Ink
          d={gen.path(
            'M121 47 Q124 43 129 46',
            stroke(319, { strokeWidth: 1 })
          )}
        />
      </motion.g>

      {/* TOOL 4 — funnel / megaphone (Reddit marketing, broadcast) */}
      <motion.g
        animate={{ rotate: [2.4, -2.4, 2.4] }}
        transition={loop(2.6, 0.9)}
        style={{ transformOrigin: '158px 40px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [150, 43],
              [166, 43],
              [160, 56],
              [156, 56],
            ],
            filled(320, '#e2693f', { strokeWidth: 1.2, hachureGap: 2.4 })
          )}
        />
        <Ink
          d={gen.rectangle(
            156,
            56,
            4,
            10,
            filled(321, '#c2502e', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
      </motion.g>

      {/* a couple of sparks rising from the funnel — growth lifting off */}
      {[
        [160, 66, 0],
        [156, 64, 0.7],
        [164, 64, 1.3],
      ].map(([sx, sy, d]) => (
        <motion.circle
          key={sx}
          cx={sx}
          cy={sy}
          r='1.3'
          fill='#cf9836'
          animate={{ y: [0, -10], opacity: [0, 0.85, 0] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: 'easeOut',
            delay: d,
          }}
        />
      ))}
    </Frame>
  );
}
