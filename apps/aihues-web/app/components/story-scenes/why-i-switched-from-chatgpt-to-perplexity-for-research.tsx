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

/* "Switched from ChatGPT to Perplexity for research" → an answer that is no
   longer floating free but anchored by visible citation tethers down to a row
   of solid source documents on the horizon shelf. The answer is held up by
   traceable sources; numbered citation chips pulse along their tethers. */

export default function Scene() {
  // citation tethers: from a numbered chip on the floating card down to a source on the shelf
  const tethers = [
    {
      x1: 80,
      y1: 50,
      x2: 56,
      y2: 82,
      n: '1',
      c: '#5a86c5',
      seed: 320,
      dash: 0,
    },
    {
      x1: 100,
      y1: 53,
      x2: 100,
      y2: 80,
      n: '2',
      c: '#788c5d',
      seed: 322,
      dash: 0.6,
    },
    {
      x1: 120,
      y1: 50,
      x2: 146,
      y2: 82,
      n: '3',
      c: '#c2502e',
      seed: 324,
      dash: 1.2,
    },
  ];
  const sources = [
    { x: 48, c: '#94ac78', seed: 330 },
    { x: 92, c: '#6a9bcc', seed: 332 },
    { x: 138, c: '#cf9836', seed: 334 },
  ];

  return (
    <Frame sky={['#eef4f9', '#dbe7d8']}>
      <defs>
        <radialGradient id='perp_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#ffffff' stopOpacity='0.85' />
          <stop offset='100%' stopColor='#ffffff' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* atmosphere */}
      <Twinkle x={30} y={22} c='#9cc3e2' />
      <Twinkle x={172} y={26} d={0.8} c='#a9c08a' />
      <Cloud x={150} y={30} s={0.7} o={0.4} />

      {/* glow behind the answer */}
      <circle cx='100' cy='44' r='40' fill='url(#perp_glow)' />

      {/* horizon shelf where the sources rest — rough */}
      <Ink
        d={gen.rectangle(
          0,
          88,
          200,
          14,
          filled(308, '#c7d8b6', {
            fillStyle: 'solid',
            strokeWidth: 0,
            roughness: 0.8,
          })
        )}
      />
      <Ink
        d={gen.line(
          0,
          88,
          200,
          88,
          stroke(310, { stroke: '#8aa06a', strokeWidth: 1.2, roughness: 1 })
        )}
      />

      {/* the source documents on the shelf — solid, traceable */}
      {sources.map((s) => (
        <g key={s.seed}>
          <Ink
            d={gen.ellipse(
              s.x,
              90,
              24,
              4.8,
              filled(s.seed + 8, INK, {
                fillStyle: 'solid',
                strokeWidth: 0,
                roughness: 0.6,
              })
            )}
          />
          <Ink
            d={gen.rectangle(
              s.x - 8,
              74,
              16,
              14,
              filled(s.seed, s.c, {
                fillStyle: 'solid',
                strokeWidth: 1.2,
                roughness: 1,
              })
            )}
          />
          <Ink
            d={gen.line(
              s.x - 4,
              78,
              s.x + 4,
              78,
              stroke(s.seed + 1, {
                stroke: '#fff',
                strokeWidth: 0.9,
                roughness: 0.8,
              })
            )}
          />
          <Ink
            d={gen.line(
              s.x - 4,
              81,
              s.x + 4,
              81,
              stroke(s.seed + 7, {
                stroke: '#fff',
                strokeWidth: 0.9,
                roughness: 0.8,
              })
            )}
          />
        </g>
      ))}

      {/* citation tethers — rough lines from card down to each source */}
      {tethers.map((t) => (
        <Ink
          key={t.seed}
          d={gen.line(
            t.x1,
            t.y1,
            t.x2,
            t.y2,
            stroke(t.seed + 6, {
              stroke: t.c,
              strokeWidth: 1,
              roughness: 1.2,
            })
          )}
        />
      ))}
      {/* one animated dashed trace along the central tether */}
      <RoughDash
        d='M100 53 L100 80'
        c='#788c5d'
        w={1}
        dur={1.8}
        seed={326}
        dash='2 4'
        o={0.6}
      />

      {/* the floating answer card — held up by its citations */}
      <motion.g
        animate={{ y: [0, -2.6, 0] }}
        transition={loop(3)}
        style={{ transformOrigin: '100px 44px' }}
      >
        <Ink
          d={gen.ellipse(
            100,
            64,
            60,
            8,
            filled(305, INK, {
              fillStyle: 'solid',
              strokeWidth: 0,
              roughness: 0.6,
            })
          )}
        />
        <Ink
          d={gen.rectangle(
            72,
            28,
            56,
            30,
            filled(300, '#ffffff', {
              fillStyle: 'solid',
              strokeWidth: 1.3,
              roughness: 1,
            })
          )}
        />
        {/* answer text lines */}
        <Ink
          d={gen.line(
            80,
            36,
            120,
            36,
            stroke(301, { stroke: INK, strokeWidth: 1.4, roughness: 1 })
          )}
        />
        <Ink
          d={gen.line(
            80,
            42,
            116,
            42,
            stroke(302, { stroke: '#9a9282', strokeWidth: 1.3, roughness: 1 })
          )}
        />
        <Ink
          d={gen.line(
            80,
            48,
            110,
            48,
            stroke(303, { stroke: '#9a9282', strokeWidth: 1.3, roughness: 1 })
          )}
        />

        {/* numbered citation chips anchored at each tether top */}
        {tethers.map((t) => (
          <g key={`chip-${t.seed}`}>
            <Ink
              d={gen.circle(
                t.x1,
                t.y1,
                6,
                filled(t.seed + 4, t.c, {
                  fillStyle: 'solid',
                  strokeWidth: 1,
                  roughness: 0.9,
                })
              )}
            />
            <text
              x={t.x1}
              y={t.y1 + 2}
              textAnchor='middle'
              fontSize='4.4'
              fontWeight='800'
              fill='#fff'
            >
              {t.n}
            </text>
          </g>
        ))}
      </motion.g>
    </Frame>
  );
}
