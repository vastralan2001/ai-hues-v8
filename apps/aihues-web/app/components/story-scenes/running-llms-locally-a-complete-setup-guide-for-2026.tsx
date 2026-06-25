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
  motion,
} from './_kit';

/* Metaphor: the cloud's intelligence brought down under your own roof. A small
   hillside cabin at dusk; instead of smoke, its chimney breathes a tiny
   self-contained galaxy — a model's worth of stars kept spinning locally. A
   little dish points away from the sky (off-grid, on your own machine), and the
   warm window glow is local inference humming. Seeds: 300-series. */

export default function Scene() {
  const lll = 'rll';
  return (
    <Frame sky={['#efeae0', '#d9d3e6']}>
      <defs>
        <radialGradient id={`${lll}_glow`} cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3d4' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff3d4' stopOpacity='0' />
        </radialGradient>
        <radialGradient id={`${lll}_win`} cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#ffdb8f' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#ffdb8f' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* far sky accents */}
      <Twinkle x={30} y={20} c='#b8a9d6' />
      <Twinkle x={176} y={26} d={0.8} c='#cf9836' />
      <Twinkle x={150} y={14} d={1.3} c='#b8a9d6' />
      <Cloud x={158} y={60} s={0.7} o={0.4} />
      <Cloud x={42} y={50} s={0.85} o={0.4} />

      {/* layered dusk hills for depth */}
      <Ink
        d={gen.path(
          'M0 78 Q70 66 138 76 T200 74 L200 100 L0 100 Z',
          filled(301, '#c5bcd6', { hachureGap: 4, fillWeight: 0.6 })
        )}
      />
      <Ink
        d={gen.path(
          'M0 90 Q60 80 116 88 T200 86 L200 100 L0 100 Z',
          filled(302, '#a9b18d', { hachureGap: 3.4 })
        )}
      />

      {/* the contained galaxy rising from the chimney — soft halo */}
      <circle cx='84' cy='30' r='30' fill={`url(#${lll}_glow)`} />

      {/* orbiting stars: the model kept spinning under your own roof */}
      {[
        { rx: 30, ry: 11, rot: 18, dur: 11, dir: 1, seed: 310 },
        { rx: 22, ry: 8, rot: -36, dur: 8, dir: -1, seed: 311 },
      ].map((o) => (
        <motion.g
          key={o.seed}
          animate={{ rotate: 360 * o.dir }}
          transition={linear(o.dur)}
          style={{ transformOrigin: '84px 30px' }}
        >
          <g transform={`rotate(${o.rot} 84 30)`}>
            <Ink
              d={gen.ellipse(
                84,
                30,
                o.rx * 2,
                o.ry * 2,
                stroke(o.seed, {
                  stroke: '#8c7fb0',
                  strokeWidth: 1,
                  roughness: 1,
                })
              )}
            />
            <Ink
              d={gen.circle(
                84 + o.rx,
                30,
                3.4,
                filled(o.seed + 40, '#cf9836', { fillStyle: 'solid' })
              )}
            />
          </g>
        </motion.g>
      ))}

      {/* the core — the local model, gently breathing */}
      <motion.g
        animate={{ scale: [1, 1.08, 1] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '84px 30px' }}
      >
        <Ink
          d={gen.circle(
            84,
            30,
            9,
            filled(305, '#9b6db0', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
      </motion.g>

      {/* a thin wisp tethering the galaxy to the chimney */}
      <motion.path
        d='M84 39 Q80 50 78 60'
        fill='none'
        stroke='#9b6db0'
        strokeWidth='1.2'
        opacity='0.5'
        strokeDasharray='1.5 4'
        animate={{ strokeDashoffset: [0, -11] }}
        transition={linear(1.8)}
      />

      {/* the cabin on home soil — small focal subject */}
      <motion.g
        animate={{ y: [0, -1.2, 0] }}
        transition={loop(3)}
        style={{ transformOrigin: '78px 76px' }}
      >
        {/* warm window glow */}
        <circle cx='74' cy='74' r='9' fill={`url(#${lll}_win)`} />
        {/* walls */}
        <Ink
          d={gen.rectangle(
            64,
            66,
            28,
            16,
            filled(320, '#e8ddc6', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        {/* roof */}
        <Ink
          d={gen.polygon(
            [
              [61, 67],
              [78, 56],
              [95, 67],
            ],
            filled(321, '#c2502e', { hachureGap: 2.4 })
          )}
        />
        {/* chimney — the galaxy's spout */}
        <Ink
          d={gen.rectangle(
            82,
            56,
            5,
            9,
            filled(322, '#a8492c', { fillStyle: 'solid' })
          )}
        />
        {/* lit window */}
        <Ink
          d={gen.rectangle(
            70,
            71,
            8,
            7,
            filled(323, '#ffce6e', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
        {/* door */}
        <Ink
          d={gen.rectangle(
            82,
            73,
            5,
            9,
            filled(324, '#9a8c6b', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
      </motion.g>

      {/* off-grid dish pointing away from the cloud — local, not remote */}
      <Ink d={gen.line(108, 82, 108, 72, stroke(330, { strokeWidth: 1.4 }))} />
      <motion.g
        animate={{ rotate: [-6, 4, -6] }}
        transition={loop(4)}
        style={{ transformOrigin: '108px 72px' }}
      >
        <Ink
          d={gen.path(
            'M102 70 Q108 64 114 70 Q108 74 102 70 Z',
            filled(331, '#788c5d', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
        <Ink d={gen.line(108, 71, 110, 67, stroke(332, { strokeWidth: 1 }))} />
      </motion.g>

      {/* a couple of stray stars settling down toward the roof */}
      {[
        [100, 36, 0],
        [62, 44, 0.7],
      ].map(([sx, sy, dl]) => (
        <Twinkle key={sx} x={sx} y={sy} d={dl} c='#cf9836' r={1.2} />
      ))}
    </Frame>
  );
}
