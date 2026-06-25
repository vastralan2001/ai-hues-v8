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

/* The Problem with Productivity Porn — an ornate, over-engineered "productivity
   machine": a tall pedestal of stacked, gleaming gears and dials that spin
   busily but drive nothing. Off to the side, small and grounded, one humble
   real task — a single sprouting seedling in plain soil — quietly grows. The
   elaborate contraption is the trap; the modest sprout is what actually matters. */

export default function Scene() {
  return (
    <Frame sky={['#fcf3e6', '#f1ddc4']}>
      <defs>
        <radialGradient id='ppp_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff4dd' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#fff4dd' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* warm spotlight on the showy machine */}
      <circle cx='74' cy='42' r='40' fill='url(#ppp_glow)' />

      <Twinkle x={38} y={20} c='#cf9836' />
      <Twinkle x={108} y={16} d={0.8} c='#e0a83f' />
      <Cloud x={150} y={24} s={0.7} o={0.4} />

      {/* ground / horizon for depth */}
      <Ink
        d={gen.path(
          'M0 86 Q100 80 200 86 L200 100 L0 100 Z',
          filled(301, '#d9c79f', { roughness: 1.5, hachureGap: 3.4 })
        )}
      />
      <Ink
        d={gen.line(
          0,
          85,
          200,
          85,
          stroke(302, { stroke: '#c6b083', strokeWidth: 0.9 })
        )}
      />

      {/* ── the showy contraption: pedestal + tower of busy gears ── */}
      {/* pedestal */}
      <Ink
        d={gen.rectangle(
          64,
          74,
          20,
          12,
          filled(303, '#cf9836', { hachureGap: 3 })
        )}
      />
      <Ink d={gen.line(70, 74, 70, 60, stroke(304, { strokeWidth: 1.2 }))} />
      <Ink d={gen.line(78, 74, 78, 56, stroke(305, { strokeWidth: 1.2 }))} />

      {/* lower big gear — spins one way */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={linear(7)}
        style={{ transformOrigin: '74px 58px' }}
      >
        <Ink
          d={gen.circle(
            74,
            58,
            22,
            filled(306, '#e0a83f', { hachureGap: 2.4 })
          )}
        />
        <Ink
          d={gen.circle(
            74,
            58,
            7,
            filled(307, '#fdf3df', { fillStyle: 'solid' })
          )}
        />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <g key={a} transform={`rotate(${a} 74 58)`}>
            <Ink
              d={gen.rectangle(
                72,
                34,
                4,
                4,
                filled(308 + a, '#cf9836', { fillStyle: 'solid' })
              )}
            />
          </g>
        ))}
      </motion.g>

      {/* upper smaller gear — counter-spins, meshing busily */}
      <motion.g
        animate={{ rotate: -360 }}
        transition={linear(4.6)}
        style={{ transformOrigin: '92px 44px' }}
      >
        <Ink
          d={gen.circle(
            92,
            44,
            14,
            filled(330, '#e2693f', { hachureGap: 2.2 })
          )}
        />
        <Ink
          d={gen.circle(
            92,
            44,
            4.5,
            filled(331, '#fdf3df', { fillStyle: 'solid' })
          )}
        />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <g key={a} transform={`rotate(${a} 92 44)`}>
            <Ink
              d={gen.rectangle(
                90.5,
                29,
                3,
                3.4,
                filled(332 + a, '#c2502e', { fillStyle: 'solid' })
              )}
            />
          </g>
        ))}
      </motion.g>

      {/* an ornate dial perched on top — wobbling needle that measures nothing */}
      <Ink
        d={gen.circle(
          58,
          40,
          13,
          filled(360, '#fdf3df', { fillStyle: 'solid', strokeWidth: 1.2 })
        )}
      />
      <Ink
        d={gen.path(
          'M52 40 A6 6 0 0 1 64 40',
          stroke(361, { stroke: '#94ac78', strokeWidth: 1 })
        )}
      />
      <motion.g
        animate={{ rotate: [-32, 34, -32] }}
        transition={loop(2.2)}
        style={{ transformOrigin: '58px 40px' }}
      >
        <Ink
          d={gen.line(
            58,
            40,
            58,
            33,
            stroke(362, { stroke: '#c2502e', strokeWidth: 1.3 })
          )}
        />
      </motion.g>
      <Ink
        d={gen.circle(
          58,
          40,
          2,
          filled(363, '#5b5346', { fillStyle: 'solid' })
        )}
      />

      {/* ── the humble real thing: one small seedling, grounded, actually alive ── */}
      <Ink
        d={gen.ellipse(
          160,
          85,
          22,
          6,
          filled(370, '#b89a6a', { hachureGap: 3 })
        )}
      />
      <motion.g
        animate={{ skewX: [0, 4, 0, -4, 0] }}
        transition={loop(3)}
        style={{ transformOrigin: '160px 84px' }}
      >
        <Ink
          d={gen.path(
            'M160 84 Q159 76 160 70',
            stroke(371, { stroke: '#788c5d', strokeWidth: 1.3 })
          )}
        />
        <Ink
          d={gen.path(
            'M160 76 Q154 73 151 76 Q156 78 160 76 Z',
            filled(372, '#94ac78', { fillStyle: 'solid' })
          )}
        />
        <Ink
          d={gen.path(
            'M160 72 Q166 69 169 72 Q164 74 160 72 Z',
            filled(373, '#94ac78', { fillStyle: 'solid' })
          )}
        />
        <Ink
          d={gen.path(
            'M160 70 Q158 65 160 62 Q162 65 160 70 Z',
            filled(374, '#788c5d', { fillStyle: 'solid' })
          )}
        />
      </motion.g>
    </Frame>
  );
}
