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

/* Growth — Cold email that gets replies: a field of dim, identical unopened
   envelopes (the ignored 10,000) lying low on the horizon, and ONE warm
   terracotta envelope lifted open and aglow, with a small reply arcing back
   from it — the rare message psychology earns a response. */

const cold = 'cemail';

export default function Scene() {
  // the grey field of ignored envelopes — small, flat, stacked toward the back
  const field: [number, number, number][] = [
    [22, 76, 300],
    [40, 79, 301],
    [58, 75, 302],
    [13, 81, 303],
    [150, 77, 304],
    [168, 80, 305],
    [184, 76, 306],
    [134, 79, 307],
    [76, 81, 308],
    [160, 73, 309],
  ];

  return (
    <Frame sky={['#fbf4e9', '#f0dcc4']}>
      <defs>
        <radialGradient id={`${cold}_glow`} cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#ffe7c9' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#ffe7c9' stopOpacity='0' />
        </radialGradient>
        <linearGradient id={`${cold}_haze`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#efe0c6' stopOpacity='0' />
          <stop offset='100%' stopColor='#e7d2b0' stopOpacity='0.8' />
        </linearGradient>
      </defs>

      <Twinkle x={36} y={20} c='#cf9836' />
      <Twinkle x={174} y={26} d={0.8} c='#e0a83f' />
      <Twinkle x={120} y={16} d={1.4} c='#cf9836' />
      <Cloud x={150} y={28} s={0.8} o={0.4} />
      <Cloud x={44} y={40} s={0.65} o={0.32} />

      {/* hazy ground — the indistinct mass of ignored mail */}
      <Ink
        d={gen.path(
          'M0 72 Q100 64 200 72 L200 100 L0 100 Z',
          filled(310, '#e3cda6', {
            roughness: 1.6,
            hachureGap: 3.8,
            fillWeight: 0.6,
          })
        )}
      />
      <rect x='0' y='70' width='200' height='30' fill={`url(#${cold}_haze)`} />

      {/* the dim, identical, unopened envelopes — flat grey, never replied to */}
      {field.map(([x, y, s]) => (
        <g key={s} opacity={0.5}>
          <Ink
            d={gen.rectangle(
              x - 6,
              y - 4,
              12,
              8,
              filled(s, '#c9b59a', {
                fillStyle: 'solid',
                strokeWidth: 0.9,
                roughness: 1.4,
              })
            )}
          />
          <Ink
            d={gen.path(
              `M${x - 6} ${y - 4} L${x} ${y + 1} L${x + 6} ${y - 4}`,
              stroke(s + 50, { strokeWidth: 0.8, roughness: 1.4 })
            )}
          />
        </g>
      ))}

      {/* warm glow behind the chosen one */}
      <circle cx='100' cy='46' r='34' fill={`url(#${cold}_glow)`} />

      {/* the reply, arcing back from the open envelope */}
      <motion.path
        d='M100 44 Q72 32 50 40'
        fill='none'
        stroke='#c2502e'
        strokeWidth='1.3'
        strokeDasharray='2 6'
        animate={{ strokeDashoffset: [0, -16] }}
        transition={linear(1.7)}
      />

      {/* the one envelope that earned a reply — lifted, open, terracotta */}
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={loop(2.8)}
        style={{ transformOrigin: '100px 50px' }}
      >
        <ellipse cx='100' cy='66' rx='17' ry='3.5' fill={INK} opacity='0.1' />
        {/* envelope body */}
        <Ink
          d={gen.rectangle(
            85,
            46,
            30,
            18,
            filled(360, '#e2693f', {
              fillStyle: 'solid',
              strokeWidth: 1.2,
              roughness: 1,
            })
          )}
        />
        {/* lower seams */}
        <Ink
          d={gen.path(
            'M85 64 L100 54 L115 64',
            stroke(361, { strokeWidth: 1, roughness: 1 })
          )}
        />
        {/* the open flap, hinged up */}
        <motion.g
          animate={{ rotate: [0, -7, 0] }}
          transition={loop(3.2)}
          style={{ transformOrigin: '100px 46px' }}
        >
          <Ink
            d={gen.polygon(
              [
                [85, 46],
                [100, 32],
                [115, 46],
              ],
              filled(362, '#f1d9bc', {
                fillStyle: 'solid',
                strokeWidth: 1.1,
                roughness: 1,
              })
            )}
          />
        </motion.g>
        {/* the letter rising out — a small reply slip */}
        <motion.g
          animate={{ y: [0, -2.4, 0], opacity: [0.85, 1, 0.85] }}
          transition={loop(2.8, 0.3)}
          style={{ transformOrigin: '100px 44px' }}
        >
          <Ink
            d={gen.rectangle(
              92,
              38,
              16,
              12,
              filled(363, '#fffaf2', {
                fillStyle: 'solid',
                strokeWidth: 1,
                roughness: 0.9,
              })
            )}
          />
          <Ink
            d={gen.line(
              95,
              42,
              105,
              42,
              stroke(364, { stroke: '#788c5d', strokeWidth: 1 })
            )}
          />
          <Ink
            d={gen.line(
              95,
              45,
              102,
              45,
              stroke(365, { stroke: '#94ac78', strokeWidth: 1 })
            )}
          />
        </motion.g>
      </motion.g>

      {/* the reply spark landing back at the reader */}
      <motion.g
        animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.7, 1, 0.7] }}
        transition={loop(1.9)}
        style={{ transformOrigin: '50px 40px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [50, 34],
              [52, 38.5],
              [56.5, 40],
              [52, 41.5],
              [50, 46],
              [48, 41.5],
              [43.5, 40],
              [48, 38.5],
            ],
            filled(366, '#e0a83f', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
      </motion.g>
    </Frame>
  );
}
