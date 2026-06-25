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

/* "Link building for boring B2B products" → a plain, unglamorous steel hex-nut
   sits on a low plinth at center; earned threads reach out from it across a
   dusk sky to distant glowing authority nodes. The dull object becomes a hub
   radiating connection — backlinks turning something unsexy into a node of value. */

const NUT = { x: 100, y: 64 };

// distant authority "domains" the boring product earns links to
const NODES: [number, number, number][] = [
  [34, 24, 0],
  [60, 40, 0.6],
  [150, 22, 1.1],
  [176, 46, 0.4],
  [126, 30, 0.9],
];

export default function Scene() {
  return (
    <Frame sky={['#f6efe1', '#e8d6bd']}>
      <defs>
        <radialGradient id='lbbb_haze' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff4dd' stopOpacity='0.85' />
          <stop offset='100%' stopColor='#fff4dd' stopOpacity='0' />
        </radialGradient>
        <radialGradient id='lbbb_node' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#ffe7a8' stopOpacity='1' />
          <stop offset='100%' stopColor='#ffe7a8' stopOpacity='0' />
        </radialGradient>
      </defs>

      <circle cx={NUT.x} cy={NUT.y} r='40' fill='url(#lbbb_haze)' />

      <Cloud x={48} y={20} s={0.7} o={0.4} />
      <Cloud x={158} y={62} s={0.6} o={0.32} />

      {/* far ground band for depth */}
      <Ink
        d={gen.path(
          'M0 86 Q100 80 200 86 L200 100 L0 100 Z',
          filled(301, '#d8c39e', {
            roughness: 1.6,
            hachureGap: 3.6,
            fillWeight: 0.6,
          })
        )}
      />

      {/* glowing authority nodes + the earned threads to each */}
      {NODES.map(([nx, ny, delay], i) => {
        const d = `M${NUT.x} ${NUT.y - 4} Q${(NUT.x + nx) / 2} ${(NUT.y + ny) / 2 - 10} ${nx} ${ny}`;
        return (
          <g key={nx}>
            <motion.path
              d={d}
              fill='none'
              stroke='#cf9836'
              strokeWidth='0.9'
              opacity='0.55'
              strokeDasharray='1.5 5'
              animate={{ strokeDashoffset: [0, -13] }}
              transition={linear(1.7 + i * 0.25)}
            />
            <circle cx={nx} cy={ny} r='9' fill='url(#lbbb_node)' />
            <Twinkle x={nx} y={ny} d={delay} c='#e0a83f' r={1.3} />
          </g>
        );
      })}

      <Twinkle x={20} y={50} d={1.2} c='#cf9836' r={1} />
      <Twinkle x={186} y={28} d={0.7} c='#e0a83f' r={1} />

      {/* the plinth the unglamorous product rests on */}
      <Ink
        d={gen.path(
          'M82 78 L118 78 L114 86 L86 86 Z',
          filled(302, '#b7a684', {
            fillStyle: 'solid',
            strokeWidth: 1.2,
            roughness: 1.1,
          })
        )}
      />
      <ellipse cx={NUT.x} cy='80' rx='17' ry='3' fill={INK} opacity='0.1' />

      {/* the boring B2B product: a plain steel hex nut, slowly turning */}
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={loop(3)}
        style={{ transformOrigin: '100px 64px' }}
      >
        <motion.g
          animate={{ rotate: [0, 4, 0, -4, 0] }}
          transition={loop(6)}
          style={{ transformOrigin: '100px 64px' }}
        >
          {/* hexagon body */}
          <Ink
            d={gen.polygon(
              [
                [100, 51],
                [111, 57.5],
                [111, 70.5],
                [100, 77],
                [89, 70.5],
                [89, 57.5],
              ],
              filled(303, '#9aa0a6', {
                fillStyle: 'solid',
                strokeWidth: 1.3,
                roughness: 1,
              })
            )}
          />
          {/* hachure shading on the boring metal */}
          <Ink
            d={gen.polygon(
              [
                [100, 51],
                [111, 57.5],
                [111, 70.5],
                [100, 77],
                [89, 70.5],
                [89, 57.5],
              ],
              filled(304, '#7f868d', {
                hachureGap: 2.4,
                fillWeight: 0.6,
                strokeWidth: 0,
              })
            )}
          />
          {/* threaded bore */}
          <Ink
            d={gen.circle(
              100,
              64,
              12,
              filled(305, '#e8d6bd', { fillStyle: 'solid', strokeWidth: 1.2 })
            )}
          />
          <Ink
            d={gen.circle(
              100,
              64,
              7,
              stroke(306, { strokeWidth: 0.9, roughness: 0.9 })
            )}
          />
        </motion.g>
      </motion.g>
    </Frame>
  );
}
