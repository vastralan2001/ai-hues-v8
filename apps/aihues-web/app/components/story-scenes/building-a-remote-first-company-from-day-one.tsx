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

/* Remote-first from day one — the "company" is not a building but a deliberate
   network: scattered warm-lit home nodes across a wide dusk valley, joined by
   thin pulsing threads that converge on one shared gold beacon at the centre.
   No HQ, just connections kept alive by ritual. */

export default function Scene() {
  // distant, dispersed home nodes (the people, far apart)
  const nodes: [number, number, string, number][] = [
    [34, 60, '#c2502e', 0],
    [70, 72, '#e0a83f', 0.5],
    [150, 58, '#cf9836', 0.9],
    [176, 70, '#e2693f', 1.3],
  ];
  const hub: [number, number] = [104, 44];

  return (
    <Frame sky={['#f4eede', '#e6d8c4']}>
      <defs>
        <radialGradient id='rfc_beacon' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff1cf' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff1cf' stopOpacity='0' />
        </radialGradient>
        <radialGradient id='rfc_ground' cx='50%' cy='0%' r='100%'>
          <stop offset='0%' stopColor='#dfe6d2' stopOpacity='0.6' />
          <stop offset='100%' stopColor='#dfe6d2' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* far depth: one cloud + a couple of dusk stars */}
      <Cloud x={48} y={22} s={0.8} o={0.4} />
      <Twinkle x={26} y={20} c='#cf9836' />
      <Twinkle x={188} y={24} d={0.7} c='#e0a83f' />

      {/* distant rolling hills for depth */}
      <Ink
        d={gen.path(
          'M0 70 Q52 58 104 66 T200 62 L200 100 L0 100 Z',
          filled(301, '#cdd6b8', {
            hachureGap: 4.2,
            fillWeight: 0.6,
            roughness: 1.6,
          })
        )}
      />
      <Ink
        d={gen.path(
          'M0 82 Q60 72 120 80 T200 78 L200 100 L0 100 Z',
          filled(302, '#aebf95', { hachureGap: 3.4, roughness: 1.5 })
        )}
      />
      <rect x='0' y='66' width='200' height='34' fill='url(#rfc_ground)' />

      {/* the network threads tying each node to the shared hub; one live dashed
          trail signals flow inward, the rest are quiet hand-drawn connectors */}
      {nodes.map(([nx, ny], i) => {
        const my = Math.min(ny, hub[1]) - 10;
        const d = `M${nx} ${ny} Q${(nx + hub[0]) / 2} ${my} ${hub[0]} ${hub[1]}`;
        if (i === 0)
          return (
            <RoughDash
              key={`t${nx}`}
              d={d}
              c='#788c5d'
              w={1}
              dur={1.9}
              dash='2 6'
              o={0.8}
              seed={303}
            />
          );
        return (
          <Ink
            key={`t${nx}`}
            d={gen.path(d, {
              stroke: '#788c5d',
              strokeWidth: 1,
              roughness: 1.5,
              bowing: 1.2,
              seed: 303 + i,
            })}
          />
        );
      })}

      {/* glow under the shared beacon */}
      <circle cx={hub[0]} cy={hub[1]} r='26' fill='url(#rfc_beacon)' />

      {/* scattered home nodes — small lit cabins, far apart */}
      {nodes.map(([nx, ny, c, ph], i) => (
        <motion.g
          key={`h${nx}`}
          animate={{ y: [0, -1.6, 0] }}
          transition={loop(2.4 + ph)}
          style={{ transformOrigin: `${nx}px ${ny}px` }}
        >
          {/* soft ground shadow */}
          <g opacity='0.12'>
            <Ink
              d={gen.ellipse(nx, ny + 6, 14, 3.2, {
                fill: INK,
                fillStyle: 'solid',
                stroke: 'none',
                roughness: 1.4,
                seed: 350 + i,
              })}
            />
          </g>
          {/* cabin body */}
          <Ink
            d={gen.rectangle(
              nx - 5,
              ny,
              10,
              7,
              filled(310 + i, '#fbf4e6', {
                fillStyle: 'solid',
                strokeWidth: 1.1,
                roughness: 1.1,
              })
            )}
          />
          {/* roof */}
          <Ink
            d={gen.polygon(
              [
                [nx - 6.5, ny],
                [nx, ny - 5.5],
                [nx + 6.5, ny],
              ],
              filled(320 + i, c, { fillStyle: 'solid', strokeWidth: 1.1 })
            )}
          />
          {/* lit window */}
          <motion.g
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={loop(1.8, ph)}
            style={{ transformOrigin: `${nx}px ${ny + 3.5}px` }}
          >
            <Ink
              d={gen.rectangle(
                nx - 1.6,
                ny + 1.8,
                3.2,
                3.2,
                filled(330 + i, '#f0b449', {
                  fillStyle: 'solid',
                  strokeWidth: 0.8,
                  roughness: 0.8,
                })
              )}
            />
          </motion.g>
        </motion.g>
      ))}

      {/* the shared beacon — the company that exists only in the connections */}
      <Ink
        d={gen.line(
          hub[0],
          hub[1] + 12,
          hub[0],
          hub[1] - 4,
          stroke(340, { strokeWidth: 1.3 })
        )}
      />
      <motion.g
        animate={{ scale: [0.9, 1.12, 0.9] }}
        transition={loop(2.2)}
        style={{ transformOrigin: `${hub[0]}px ${hub[1]}px` }}
      >
        <Ink
          d={gen.polygon(
            [
              [hub[0], hub[1] - 8],
              [hub[0] + 2.4, hub[1] - 2.6],
              [hub[0] + 8, hub[1] - 1.9],
              [hub[0] + 3.7, hub[1] + 2.1],
              [hub[0] + 4.8, hub[1] + 8],
              [hub[0], hub[1] + 5],
              [hub[0] - 4.8, hub[1] + 8],
              [hub[0] - 3.7, hub[1] + 2.1],
              [hub[0] - 8, hub[1] - 1.9],
              [hub[0] - 2.4, hub[1] - 2.6],
            ],
            filled(341, '#e0a83f', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
      </motion.g>
    </Frame>
  );
}
