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

// ── Productivity — Second brain: a small synaptic web of knowledge nodes
//    wired into one steady central hub (the organized mind) ──
export default function Scene() {
  const hub = { x: 100, y: 50 };

  // Satellite "note/project" nodes orbiting the hub at rest, each a small card.
  const nodes = [
    { x: 44, y: 30, c: '#c2502e', seed: 320, ph: 0 },
    { x: 158, y: 28, c: '#e0a83f', seed: 330, ph: 0.7 },
    { x: 168, y: 64, c: '#788c5d', seed: 340, ph: 1.3 },
    { x: 96, y: 80, c: '#6a9bcc', seed: 350, ph: 0.4 },
    { x: 34, y: 66, c: '#cf9836', seed: 360, ph: 1.0 },
  ];

  return (
    <Frame sky={['#f3f0e6', '#dfe3ec']}>
      <defs>
        <radialGradient id='brain_hub' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff4dc' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff4dc' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* atmosphere */}
      <Cloud x={150} y={20} s={0.7} o={0.4} />
      <Cloud x={40} y={84} s={0.6} o={0.32} />
      <Twinkle x={24} y={20} c='#cf9836' />
      <Twinkle x={182} y={44} d={0.8} c='#94ac78' />
      <Twinkle x={120} y={16} d={1.2} c='#6a9bcc' />

      {/* hub glow */}
      <circle cx={hub.x} cy={hub.y} r='30' fill='url(#brain_hub)' />

      {/* synapse threads: hub → each node, a slow pulse of light travelling in */}
      {nodes.map((n, i) => {
        const d = `M${n.x} ${n.y} Q${(n.x + hub.x) / 2 + (i - 2) * 4} ${
          (n.y + hub.y) / 2 - 6
        } ${hub.x} ${hub.y}`;
        return (
          <g key={n.seed}>
            <Ink
              d={gen.path(
                d,
                stroke(300 + i, {
                  stroke: '#b9a98c',
                  strokeWidth: 0.9,
                  roughness: 1.1,
                })
              )}
            />
            <motion.path
              d={d}
              fill='none'
              stroke={n.c}
              strokeWidth='1.4'
              strokeDasharray='1.5 14'
              opacity='0.65'
              animate={{ strokeDashoffset: [0, -15.5] }}
              transition={linear(2.2 + i * 0.3)}
            />
          </g>
        );
      })}

      {/* satellite knowledge cards */}
      {nodes.map((n) => (
        <motion.g
          key={`node-${n.seed}`}
          animate={{ y: [0, -2.4, 0] }}
          transition={loop(2.6, n.ph)}
          style={{ transformOrigin: `${n.x}px ${n.y}px` }}
        >
          <Ink
            d={gen.rectangle(
              n.x - 7,
              n.y - 5,
              14,
              10,
              filled(n.seed, '#ffffff', {
                fillStyle: 'solid',
                strokeWidth: 1.1,
                roughness: 1,
              })
            )}
          />
          <Ink
            d={gen.line(
              n.x - 4,
              n.y - 1.5,
              n.x + 3.5,
              n.y - 1.5,
              stroke(n.seed + 1, { stroke: n.c, strokeWidth: 1.4 })
            )}
          />
          <Ink
            d={gen.line(
              n.x - 4,
              n.y + 1.5,
              n.x + 1,
              n.y + 1.5,
              stroke(n.seed + 2, { stroke: n.c, strokeWidth: 1.4 })
            )}
          />
        </motion.g>
      ))}

      {/* central hub: a steady layered node — the organized second brain */}
      <motion.g
        animate={{ scale: [1, 1.07, 1] }}
        transition={loop(2.8)}
        style={{ transformOrigin: `${hub.x}px ${hub.y}px` }}
      >
        <Ink
          d={gen.circle(
            hub.x,
            hub.y,
            22,
            stroke(371, { stroke: '#9fb285', strokeWidth: 1, roughness: 1 })
          )}
        />
        <Ink
          d={gen.circle(
            hub.x,
            hub.y,
            13,
            filled(372, '#94ac78', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        <Ink
          d={gen.path(
            `M${hub.x - 4} ${hub.y} L${hub.x} ${hub.y - 4} L${hub.x} ${
              hub.y + 4
            } M${hub.x} ${hub.y - 4} L${hub.x + 4} ${hub.y} M${hub.x} ${
              hub.y + 4
            } L${hub.x + 4} ${hub.y}`,
            stroke(373, { stroke: '#fffdf6', strokeWidth: 1.2, roughness: 0.8 })
          )}
        />
      </motion.g>

      {/* a couple of inward sparks at the rim, ideas arriving */}
      <Twinkle x={hub.x - 18} y={hub.y - 12} d={0.3} r={1} c='#e0a83f' />
      <Twinkle x={hub.x + 19} y={hub.y + 11} d={1.1} r={1} c='#c2502e' />
    </Frame>
  );
}
