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
  linear,
  motion,
} from './_kit';

/* Metaphor — a content assembly line: blank pages ride a conveyor through a small
   AI "press" (gear + spark) that stamps them finished, with one human-in-the-loop
   loupe holding over the line as the quality check. A fast dashed belt reads as the
   70% speed-up. Seeds 410-449. Gradient ids prefixed `c70_`. */

export default function Scene() {
  const belt = 'M16 70 Q100 78 184 70';
  // pages entering raw on the left, leaving finished on the right
  const pages = [
    { x: 30, done: false, ph: 0 },
    { x: 70, done: false, ph: 0.6 },
    { x: 118, done: true, ph: 1.1 },
    { x: 158, done: true, ph: 1.6 },
  ];
  return (
    <Frame sky={['#fcf4e2', '#f4dcb2']}>
      <defs>
        <radialGradient id='c70_press' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff4d6' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff4d6' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* sky accents + depth */}
      <Twinkle x={28} y={20} c='#cf9836' />
      <Twinkle x={176} y={26} d={0.8} c='#e0a83f' />
      <Cloud x={52} y={24} s={0.8} o={0.4} />

      {/* far horizon hill for depth */}
      <Ink
        d={gen.path(
          'M0 84 Q70 72 140 80 T200 78 L200 100 L0 100 Z',
          filled(410, '#e7d4ac', { roughness: 1.5, hachureGap: 4 })
        )}
      />

      {/* the conveyor base line */}
      <Ink
        d={gen.path(belt, stroke(411, { stroke: '#7e6a48', strokeWidth: 1.4 }))}
      />
      {/* belt rollers */}
      <Ink
        d={gen.circle(
          16,
          70,
          9,
          filled(412, '#cf9836', { fillStyle: 'solid', strokeWidth: 1.2 })
        )}
      />
      <Ink
        d={gen.circle(
          184,
          70,
          9,
          filled(413, '#94ac78', { fillStyle: 'solid', strokeWidth: 1.2 })
        )}
      />
      {/* fast dashed flow on the belt — the 70% speed-up */}
      <RoughDash d={belt} c='#cf9836' w={2.2} dur={1.1} seed={442} dash='2 7' />

      {/* pages riding the belt, drifting subtly */}
      {pages.map((p, i) => (
        <motion.g
          key={p.x}
          animate={{ y: [0, -1.6, 0] }}
          transition={loop(2.2, p.ph)}
          style={{ transformOrigin: `${p.x}px 62px` }}
        >
          <Ink
            d={gen.rectangle(
              p.x - 6,
              52,
              12,
              16,
              filled(420 + i, '#ffffff', {
                fillStyle: 'solid',
                strokeWidth: 1.1,
              })
            )}
          />
          {/* raw pages = faint marks; finished pages = ink lines + a sage check tick */}
          <Ink
            d={gen.line(
              p.x - 3,
              57,
              p.x + 3,
              57,
              stroke(424 + i, {
                stroke: p.done ? '#788c5d' : '#d9c79c',
                strokeWidth: 1.2,
              })
            )}
          />
          <Ink
            d={gen.line(
              p.x - 3,
              61,
              p.x + 2,
              61,
              stroke(428 + i, {
                stroke: p.done ? '#788c5d' : '#d9c79c',
                strokeWidth: 1.2,
              })
            )}
          />
          {p.done && (
            <Ink
              d={gen.path(
                `M${p.x - 3} 64.5 L${p.x - 1} 66.5 L${p.x + 3.5} 62`,
                stroke(432 + i, { stroke: '#788c5d', strokeWidth: 1.3 })
              )}
            />
          )}
        </motion.g>
      ))}

      {/* the AI press, centered over the belt — a slow gear + pulsing spark */}
      <circle cx='94' cy='40' r='24' fill='url(#c70_press)' />
      <Ink
        d={gen.line(
          94,
          28,
          94,
          50,
          stroke(414, { stroke: '#7e6a48', strokeWidth: 1.3 })
        )}
      />
      <motion.g
        animate={{ rotate: 360 }}
        transition={linear(11)}
        style={{ transformOrigin: '94px 40px' }}
      >
        <Ink
          d={gen.circle(
            94,
            40,
            17,
            filled(415, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.3 })
          )}
        />
        <Ink
          d={gen.circle(
            94,
            40,
            7,
            filled(416, '#fcf4e2', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
        {[0, 60, 120, 180, 240, 300].map((a, i) => {
          const r = (a * Math.PI) / 180;
          const x1 = 94 + Math.cos(r) * 8.5;
          const y1 = 40 + Math.sin(r) * 8.5;
          const x2 = 94 + Math.cos(r) * 12;
          const y2 = 40 + Math.sin(r) * 12;
          return (
            <Ink
              key={a}
              d={gen.line(
                x1,
                y1,
                x2,
                y2,
                stroke(436 + i, { stroke: '#c2502e', strokeWidth: 1.6 })
              )}
            />
          );
        })}
      </motion.g>
      {/* AI spark at the press core */}
      <motion.g
        animate={{ scale: [0.7, 1.15, 0.7], opacity: [0.7, 1, 0.7] }}
        transition={loop(1.8)}
        style={{ transformOrigin: '94px 40px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [94, 35],
              [95.6, 38.4],
              [99, 40],
              [95.6, 41.6],
              [94, 45],
              [92.4, 41.6],
              [89, 40],
              [92.4, 38.4],
            ],
            filled(417, '#f0b449', { fillStyle: 'solid' })
          )}
        />
      </motion.g>

      {/* human-in-the-loop loupe, hovering over the finished side as the check */}
      <motion.g
        animate={{ x: [0, 3.5, 0], y: [0, -1.5, 0] }}
        transition={loop(3.2)}
        style={{ transformOrigin: '146px 42px' }}
      >
        <g transform='rotate(28 146 42)'>
          <Ink
            d={gen.circle(
              146,
              42,
              13,
              filled(418, '#cfe6fb', { fillStyle: 'solid', strokeWidth: 1.3 })
            )}
          />
          <Ink
            d={gen.circle(
              146,
              42,
              13,
              stroke(419, { stroke: '#5a86c5', strokeWidth: 1.6 })
            )}
          />
          <Ink
            d={gen.line(
              154,
              50,
              161,
              58,
              stroke(440, { stroke: '#5a86c5', strokeWidth: 2.2 })
            )}
          />
          {/* the eye/check inside the lens */}
          <Ink
            d={gen.path(
              'M141 42 L144.5 45 L151 39',
              stroke(441, { stroke: '#788c5d', strokeWidth: 1.6 })
            )}
          />
        </g>
      </motion.g>
    </Frame>
  );
}
