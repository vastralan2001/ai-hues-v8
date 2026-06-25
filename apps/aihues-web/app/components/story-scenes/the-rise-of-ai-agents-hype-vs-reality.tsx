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

/* Metaphor: the autonomous "agent" is a marionette. A little wooden puppet
   appears to walk on its own, but every limb is still pulled by taut strings
   from a control bar hovering above — the human / the LLM behind the curtain.
   Looks self-directed, isn't really: the gap between agent hype and reality. */

export default function Scene() {
  return (
    <Frame sky={['#fbf3e6', '#f0dcc6']}>
      <defs>
        <radialGradient id='agents_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3da' stopOpacity='0.85' />
          <stop offset='100%' stopColor='#fff3da' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='agents_floor' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#ecd2ac' />
          <stop offset='100%' stopColor='#e0bd8f' />
        </linearGradient>
      </defs>

      {/* soft hovering light above the control bar */}
      <circle cx='104' cy='14' r='40' fill='url(#agents_glow)' />
      <Twinkle x={36} y={22} c='#cf9836' />
      <Twinkle x={170} y={20} d={0.7} c='#e0a83f' />
      <Twinkle x={148} y={36} d={1.2} c='#cf9836' r={0.9} />
      <Cloud x={48} y={30} s={0.8} o={0.4} />
      <Cloud x={160} y={64} s={0.7} o={0.32} />

      {/* distant stage floor for depth */}
      <Ink
        d={gen.path(
          'M0 86 Q100 80 200 86 L200 100 L0 100 Z',
          filled(301, '#e6c79b', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* the puppet's faint shadow pooled on the floor */}
      <ellipse cx='104' cy='88' rx='18' ry='3.2' fill={INK} opacity='0.1' />

      {/* the control bar (the puppeteer's hidden hand), gently rocking —
          the strings hang from its tips */}
      <motion.g
        animate={{ rotate: [-3, 3, -3] }}
        transition={loop(3)}
        style={{ transformOrigin: '104px 30px' }}
      >
        {/* cross-bar */}
        <Ink d={gen.line(82, 30, 126, 30, stroke(302, { strokeWidth: 2 }))} />
        <Ink
          d={gen.line(104, 24, 104, 30, stroke(303, { strokeWidth: 1.8 }))}
        />
        {/* the four control strings down to the puppet's joints */}
        <Ink
          d={gen.line(
            84,
            31,
            92,
            56,
            stroke(304, { strokeWidth: 0.7, roughness: 0.8 })
          )}
        />
        <Ink
          d={gen.line(
            96,
            31,
            100,
            50,
            stroke(305, { strokeWidth: 0.7, roughness: 0.8 })
          )}
        />
        <Ink
          d={gen.line(
            112,
            31,
            108,
            50,
            stroke(306, { strokeWidth: 0.7, roughness: 0.8 })
          )}
        />
        <Ink
          d={gen.line(
            124,
            31,
            116,
            56,
            stroke(307, { strokeWidth: 0.7, roughness: 0.8 })
          )}
        />
      </motion.g>

      {/* the marionette — a small wooden figure, dangling and "walking" on its
          strings; bobs as if alive, but the motion comes from above */}
      <motion.g
        animate={{ y: [0, -2.2, 0], rotate: [-1.5, 1.5, -1.5] }}
        transition={loop(3)}
        style={{ transformOrigin: '104px 52px' }}
      >
        {/* head */}
        <Ink
          d={gen.circle(
            104,
            50,
            9,
            filled(308, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        {/* torso plank */}
        <Ink
          d={gen.rectangle(
            99,
            56,
            10,
            12,
            filled(309, '#cf9836', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        {/* loose-hinged arms */}
        <Ink
          d={gen.line(
            99,
            58,
            91,
            64,
            stroke(310, { strokeWidth: 1.4, stroke: '#c2502e' })
          )}
        />
        <Ink
          d={gen.line(
            109,
            58,
            117,
            64,
            stroke(311, { strokeWidth: 1.4, stroke: '#c2502e' })
          )}
        />
        {/* dangling legs mid-stride */}
        <Ink
          d={gen.line(
            101,
            68,
            98,
            80,
            stroke(312, { strokeWidth: 1.5, stroke: '#788c5d' })
          )}
        />
        <Ink
          d={gen.line(
            107,
            68,
            112,
            79,
            stroke(313, { strokeWidth: 1.5, stroke: '#788c5d' })
          )}
        />
        {/* joint pins where the strings attach */}
        <Ink
          d={gen.circle(
            91,
            64,
            2.4,
            filled(314, '#fbf3e6', { fillStyle: 'solid', strokeWidth: 0.9 })
          )}
        />
        <Ink
          d={gen.circle(
            117,
            64,
            2.4,
            filled(315, '#fbf3e6', { fillStyle: 'solid', strokeWidth: 0.9 })
          )}
        />
      </motion.g>
    </Frame>
  );
}
