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

/* Metaphor: panning for gold over a riverbed. Raw search-volume gravel washes
   through the prospector's sieve and falls away; the few high-intent keywords
   are the gold nuggets caught in the mesh and held up to the light — "beyond
   search volume". */
export default function Scene() {
  return (
    <Frame sky={['#fcf4e2', '#eadfae']}>
      <defs>
        <radialGradient id='krv_sun' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff5d8' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff5d8' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='krv_water' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#aacbe6' />
          <stop offset='100%' stopColor='#6a9bcc' />
        </linearGradient>
        <radialGradient id='krv_gleam' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#ffe9a8' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#ffe9a8' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* sky depth */}
      <circle cx='42' cy='22' r='40' fill='url(#krv_sun)' />
      <Cloud x={150} y={20} s={0.8} o={0.42} />
      <Cloud x={64} y={32} s={0.6} o={0.32} />
      <Twinkle x={170} y={16} c='#e0a83f' />
      <Twinkle x={120} y={14} d={0.9} c='#cf9836' />
      <Twinkle x={26} y={40} d={1.4} c='#e0a83f' r={0.9} />

      {/* far riverbank ridge */}
      <Ink
        d={gen.path(
          'M0 60 Q56 50 110 58 T200 54 L200 66 L0 66 Z',
          filled(301, '#cdbf8e', { hachureGap: 4, fillWeight: 0.6 })
        )}
      />

      {/* the river — light surface */}
      <rect x='0' y='64' width='200' height='36' fill='url(#krv_water)' />
      <line
        x1='0'
        y1='64'
        x2='200'
        y2='64'
        stroke='#eaf6ff'
        strokeWidth='1.2'
        opacity='0.7'
      />
      {/* current ripples drifting downstream */}
      {[72, 80, 88].map((ry, i) => (
        <motion.line
          key={ry}
          x1='0'
          y1={ry}
          x2='60'
          y2={ry}
          stroke='#eaf6ff'
          strokeWidth='0.8'
          opacity='0.4'
          strokeDasharray='4 10'
          animate={{ strokeDashoffset: [0, -28] }}
          transition={linear(2.6 + i * 0.5)}
        />
      ))}

      {/* gravel washing through the mesh and sinking away (search volume) */}
      {[
        [92, 70, 0],
        [104, 70, 0.7],
        [99, 71, 1.3],
        [110, 70, 1.9],
      ].map(([gx, gy, d]) => (
        <motion.circle
          key={gx}
          cx={gx}
          cy={gy}
          r='1.1'
          fill='#b9a978'
          opacity='0.7'
          animate={{ y: [0, 16], opacity: [0, 0.7, 0] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeIn',
            delay: d as number,
          }}
        />
      ))}

      {/* the prospector's pan / sieve — tilted, gently swirling */}
      <motion.g
        animate={{ rotate: [-2.5, 2.5, -2.5] }}
        transition={loop(3)}
        style={{ transformOrigin: '100px 60px' }}
      >
        <g transform='rotate(-13 100 60)'>
          {/* pan bowl */}
          <Ink
            d={gen.path(
              'M70 56 Q100 50 130 56 Q124 70 100 71 Q76 70 70 56 Z',
              filled(302, '#dcae5a', { hachureGap: 3, fillWeight: 0.7 })
            )}
          />
          {/* inner rim */}
          <Ink
            d={gen.path(
              'M76 57 Q100 53 124 57',
              stroke(303, { stroke: '#a9742c', strokeWidth: 1.1 })
            )}
          />
          {/* mesh holes letting gravel through */}
          <Ink
            d={gen.line(84, 60, 86, 64, stroke(304, { strokeWidth: 0.7 }))}
          />
          <Ink
            d={gen.line(96, 61, 98, 65, stroke(305, { strokeWidth: 0.7 }))}
          />
          <Ink
            d={gen.line(108, 61, 110, 65, stroke(306, { strokeWidth: 0.7 }))}
          />
          <Ink
            d={gen.line(116, 60, 118, 63, stroke(307, { strokeWidth: 0.7 }))}
          />

          {/* the gold nugget kept in the pan — the high-intent keyword */}
          <circle cx='100' cy='59' r='9' fill='url(#krv_gleam)' />
          <motion.g
            animate={{ scale: [0.94, 1.08, 0.94] }}
            transition={loop(2.2)}
            style={{ transformOrigin: '100px 59px' }}
          >
            <Ink
              d={gen.polygon(
                [
                  [100, 53],
                  [105, 57],
                  [103, 62],
                  [97, 62],
                  [95, 57],
                ],
                filled(308, '#f0b449', { fillStyle: 'solid', strokeWidth: 1.2 })
              )}
            />
            <Ink
              d={gen.polygon(
                [
                  [100, 53],
                  [97, 62],
                  [95, 57],
                ],
                filled(309, '#e0a83f', { fillStyle: 'solid', strokeWidth: 0.8 })
              )}
            />
          </motion.g>
        </g>
      </motion.g>

      {/* a couple of smaller caught flecks */}
      <Twinkle x={118} y={56} d={0.4} c='#f4d27a' r={1} />
      <Twinkle x={86} y={54} d={1.1} c='#f4d27a' r={0.9} />
    </Frame>
  );
}
