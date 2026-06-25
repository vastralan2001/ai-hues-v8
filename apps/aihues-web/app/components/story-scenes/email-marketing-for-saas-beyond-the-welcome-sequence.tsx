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

/* Email marketing beyond the welcome sequence: a lighthouse on a headland
   sweeping targeted beams out to scattered boats at sea. The lighthouse is the
   SaaS; each beam is a behavioral trigger reaching a different boat (segment) at
   its own distance (lifecycle stage) — not one broadcast, but many tailored
   signals that keep users from drifting away. Dusk sky, calm water, one focal
   tower. Seeds reserved in the 300s for this file; gradient ids prefixed `em_`. */

export default function Scene() {
  return (
    <Frame sky={['#fbeede', '#f0cfb6']}>
      <defs>
        <radialGradient id='em_lamp' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3d4' stopOpacity='1' />
          <stop offset='100%' stopColor='#fff3d4' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='em_beam' x1='0' y1='0' x2='1' y2='0'>
          <stop offset='0%' stopColor='#ffe6ab' stopOpacity='0.85' />
          <stop offset='100%' stopColor='#ffe6ab' stopOpacity='0' />
        </linearGradient>
      </defs>

      {/* dusk accents + a far cloud bank for depth */}
      <Twinkle x={30} y={20} c='#e0a83f' />
      <Twinkle x={174} y={16} d={0.8} c='#cf9836' />
      <Cloud x={150} y={26} s={0.85} o={0.4} />

      {/* sea fills the lower half — rough hachure water */}
      <Ink
        d={gen.rectangle(
          0,
          58,
          200,
          44,
          filled(300, '#7fadd2', {
            hachureGap: 3,
            fillWeight: 0.6,
            stroke: 'none',
          })
        )}
      />
      {/* bright horizon line */}
      <Ink
        d={gen.line(
          0,
          58,
          200,
          58,
          stroke(299, { stroke: '#fbe8c8', strokeWidth: 1.3, roughness: 1.2 })
        )}
      />

      {/* slow swell lines for water texture */}
      <Ink
        d={gen.path(
          'M0 70 Q40 67 80 70 T160 70 T240 70',
          stroke(301, {
            stroke: '#e9f3fb',
            strokeWidth: 0.9,
            roughness: 1.4,
            bowing: 1.8,
          })
        )}
      />
      <Ink
        d={gen.path(
          'M-20 82 Q30 79 80 82 T180 82 T280 82',
          stroke(302, {
            stroke: '#bcd9ee',
            strokeWidth: 0.9,
            roughness: 1.4,
            bowing: 1.8,
          })
        )}
      />

      {/* three targeted beams sweeping out to three boats — staggered pulses */}
      {[
        { d: 'M64 30 L34 78 L20 70 Z', seed: 303, dur: 2.6, delay: 0 },
        { d: 'M65 31 L110 80 L96 86 Z', seed: 304, dur: 3.1, delay: 0.9 },
        { d: 'M66 30 L168 60 L160 70 Z', seed: 305, dur: 2.9, delay: 1.7 },
      ].map((b) => (
        <motion.path
          key={b.seed}
          d={b.d}
          fill='url(#em_beam)'
          animate={{ opacity: [0, 0.7, 0] }}
          transition={loop(b.dur, b.delay)}
        />
      ))}

      {/* lamp glow at the tower top */}
      <circle cx='65' cy='30' r='17' fill='url(#em_lamp)' />

      {/* the headland the lighthouse stands on */}
      <Ink
        d={gen.polygon(
          [
            [20, 58],
            [50, 50],
            [86, 54],
            [110, 58],
          ],
          filled(306, '#94ac78', { hachureGap: 3.2, fillWeight: 0.6 })
        )}
      />

      {/* lighthouse tower — tapered body, banded crown, lamp room */}
      <motion.g animate={{ y: [0, -0.8, 0] }} transition={loop(3.4)}>
        <Ink
          d={gen.polygon(
            [
              [60, 54],
              [70, 54],
              [68, 33],
              [62, 33],
            ],
            filled(307, '#f4ede0', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        <Ink
          d={gen.polygon(
            [
              [62.4, 47],
              [67.6, 47],
              [66.8, 40],
              [63.2, 40],
            ],
            filled(308, '#c2502e', { hachureGap: 2.2, fillWeight: 0.6 })
          )}
        />
        {/* gallery rail + lamp room */}
        <Ink d={gen.line(61, 33, 69, 33, stroke(309, { strokeWidth: 1.2 }))} />
        <Ink
          d={gen.polygon(
            [
              [62.5, 33],
              [67.5, 33],
              [66.6, 27],
              [63.4, 27],
            ],
            filled(310, '#e0a83f', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
        {/* lantern roof */}
        <Ink
          d={gen.polygon(
            [
              [62.6, 27],
              [67.4, 27],
              [65, 23],
            ],
            filled(311, '#c2502e', { fillStyle: 'solid' })
          )}
        />
        {/* pulsing lamp core */}
        <motion.g
          animate={{ opacity: [0.55, 1, 0.55], scale: [0.9, 1.1, 0.9] }}
          transition={loop(2.6)}
          style={{ transformOrigin: '65px 30px' }}
        >
          <Ink
            d={gen.circle(
              65,
              30,
              4,
              filled(312, '#fff1cf', { fillStyle: 'solid' })
            )}
          />
        </motion.g>
      </motion.g>

      {/* three boats at different distances — each its own segment, gently bobbing */}
      {[
        { x: 26, y: 75, s: 314, sail: '#c2502e', dur: 2.2, ph: 0 },
        { x: 102, y: 83, s: 320, sail: '#5a86c5', dur: 2.6, ph: 0.7 },
        { x: 163, y: 66, s: 326, sail: '#cf9836', dur: 2.4, ph: 1.3 },
      ].map((bt) => (
        <motion.g
          key={bt.x}
          animate={{ y: [0, -1.4, 0], rotate: [-2, 2, -2] }}
          transition={loop(bt.dur, bt.ph)}
          style={{ transformOrigin: `${bt.x}px ${bt.y}px` }}
        >
          <Ink
            d={gen.path(
              `M${bt.x - 5} ${bt.y} Q${bt.x} ${bt.y + 3.4} ${bt.x + 5} ${bt.y} Z`,
              filled(bt.s, '#f4ede0', { fillStyle: 'solid', strokeWidth: 1.1 })
            )}
          />
          <Ink
            d={gen.line(
              bt.x,
              bt.y - 8,
              bt.x,
              bt.y,
              stroke(bt.s + 1, { strokeWidth: 1 })
            )}
          />
          <Ink
            d={gen.polygon(
              [
                [bt.x, bt.y - 8],
                [bt.x, bt.y - 0.5],
                [bt.x + 4.5, bt.y - 1.5],
              ],
              filled(bt.s + 2, bt.sail, { fillStyle: 'solid', strokeWidth: 1 })
            )}
          />
        </motion.g>
      ))}
    </Frame>
  );
}
