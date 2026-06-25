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

/* SEO for SaaS — the long-tail strategy. Metaphor: a comet whose small bright
   head (one focused "best X software" keyword) drags a long, gentle tail of
   many diminishing sparks across a dusk sky. The single huge generic-keyword
   "sun" glows far off and unreachable on the horizon; the modest comet, with
   its long sustained tail of niche sparks, is what actually carries across the
   sky. Seeds in the 300-block; gradient ids prefixed `ltsaas_`. */

const TAIL = [
  { x: 150, y: 38, r: 1.6, op: 0.9, d: 0 },
  { x: 138, y: 41, r: 1.4, op: 0.78, d: 0.18 },
  { x: 126, y: 45, r: 1.25, op: 0.66, d: 0.36 },
  { x: 113, y: 49, r: 1.15, op: 0.55, d: 0.54 },
  { x: 100, y: 54, r: 1.05, op: 0.46, d: 0.72 },
  { x: 87, y: 58, r: 0.95, op: 0.38, d: 0.9 },
  { x: 74, y: 62, r: 0.85, op: 0.3, d: 1.08 },
  { x: 61, y: 66, r: 0.75, op: 0.24, d: 1.26 },
  { x: 49, y: 70, r: 0.68, op: 0.18, d: 1.44 },
  { x: 38, y: 73, r: 0.6, op: 0.14, d: 1.62 },
];

export default function Scene() {
  const tailPath = 'M36 74 Q92 60 156 36';
  return (
    <Frame sky={['#f3eee0', '#ead7bd']}>
      <defs>
        <radialGradient id='ltsaas_sun' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#f6e4b8' stopOpacity='0.85' />
          <stop offset='100%' stopColor='#f6e4b8' stopOpacity='0' />
        </radialGradient>
        <radialGradient id='ltsaas_head' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fbe6cf' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fbe6cf' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* distant generic-keyword "sun" — huge, glowing, unreachable on the horizon */}
      <circle cx='32' cy='84' r='40' fill='url(#ltsaas_sun)' />
      <Ink
        d={gen.circle(
          32,
          86,
          26,
          filled(301, '#e9c87f', { fillStyle: 'solid', strokeWidth: 1 })
        )}
      />

      {/* depth: a soft low ridge and a couple of clouds */}
      <Cloud x={158} y={20} s={0.7} o={0.4} />
      <Cloud x={108} y={16} s={0.55} o={0.32} />
      <Ink
        d={gen.path(
          'M0 88 Q70 80 200 90 L200 100 L0 100 Z',
          filled(302, '#cdbd97', {
            roughness: 1.5,
            hachureGap: 3.6,
            fillWeight: 0.6,
          })
        )}
      />

      {/* faint twinkles at the edges */}
      <Twinkle x={184} y={26} d={0.4} c='#cf9836' />
      <Twinkle x={20} y={32} d={1.1} c='#e0a83f' />
      <Twinkle x={172} y={58} d={0.8} c='#cf9836' r={0.9} />

      {/* the long tail — a flowing dashed arc the sparks ride along */}
      <motion.path
        d={tailPath}
        fill='none'
        stroke='#cf9836'
        strokeWidth='1.4'
        strokeDasharray='1.5 6'
        opacity='0.45'
        animate={{ strokeDashoffset: [0, -15] }}
        transition={linear(1.8)}
      />

      {/* the diminishing sparks: many small niche keywords summing into the tail */}
      {TAIL.map((t, i) => (
        <motion.circle
          key={i}
          cx={t.x}
          cy={t.y}
          r={t.r}
          fill={i % 2 === 0 ? '#e0a83f' : '#c2502e'}
          animate={{ opacity: [t.op * 0.4, t.op, t.op * 0.4] }}
          transition={loop(2.2, t.d)}
          style={{ transformOrigin: `${t.x}px ${t.y}px` }}
        />
      ))}

      {/* the comet head — one focused "best X software" keyword, small but bright */}
      <circle cx='156' cy='36' r='12' fill='url(#ltsaas_head)' />
      <motion.g
        animate={{ scale: [0.94, 1.08, 0.94], x: [0, 2, 0], y: [0, -1.5, 0] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '156px 36px' }}
      >
        <Ink
          d={gen.circle(
            156,
            36,
            8,
            filled(303, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        <Ink
          d={gen.circle(
            156,
            36,
            3.4,
            filled(304, '#fbe6cf', { fillStyle: 'solid', strokeWidth: 0.9 })
          )}
        />
        {/* tiny forward glints — the keyword catching intent */}
        <Ink
          d={gen.path(
            'M165 31 L169 28 M166 36 L171 36 M165 41 L169 44',
            stroke(305, { stroke: '#cf9836', strokeWidth: 1, roughness: 1 })
          )}
        />
      </motion.g>
    </Frame>
  );
}
