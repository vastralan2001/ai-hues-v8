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

/* Midjourney v7 review — "the good, the bad, and the weird". Metaphor: a single
   render frame standing on the horizon. A glowing prompt-seed feeds it; inside,
   a crisp little sun-over-hills scene resolves (the good — sharper photorealism),
   but the frame's right edge has not finished: clean rows of pixels dissolve into
   misaligned, drifting glitch-shards (the bad / the weird — stranger artifacts).
   One understated subject, generous sky, slow life. */

export default function Scene() {
  // seed block for this file: 301..360
  const mj = 'mjv7';
  return (
    <Frame sky={['#f6eef0', '#ecd9d2']}>
      <defs>
        <radialGradient id={`${mj}_glow`} cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fbe7d2' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fbe7d2' stopOpacity='0' />
        </radialGradient>
        <linearGradient id={`${mj}_render`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#fbeede' />
          <stop offset='100%' stopColor='#f2dcc6' />
        </linearGradient>
      </defs>

      {/* sky depth */}
      <Cloud x={52} y={26} s={0.85} o={0.4} />

      {/* far horizon hill for ground */}
      <Ink
        d={gen.path(
          'M0 86 Q100 78 200 86 L200 100 L0 100 Z',
          filled(301, '#d9c2a6', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* prompt-seed glow feeding the frame */}
      <circle cx='44' cy='58' r='22' fill={`url(#${mj}_glow)`} />

      {/* dashed prompt-thread from seed into the render frame */}
      <RoughDash
        d='M50 58 Q72 56 84 56'
        c='#cf9836'
        w={1.4}
        dur={1.5}
        dash='2 5'
        seed={320}
      />

      {/* the prompt-seed itself: a small four-point spark (the input idea) */}
      <motion.g
        animate={{ scale: [0.9, 1.12, 0.9], rotate: [0, 10, 0] }}
        transition={loop(2.4)}
        style={{ transformOrigin: '44px 58px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [44, 50],
              [46.4, 55.6],
              [52, 58],
              [46.4, 60.4],
              [44, 66],
              [41.6, 60.4],
              [36, 58],
              [41.6, 55.6],
            ],
            filled(302, '#e2693f', { fillStyle: 'solid' })
          )}
        />
      </motion.g>

      {/* THE RENDER FRAME — small, sits with breathing room, gentle bob */}
      <motion.g
        animate={{ y: [0, -2.2, 0] }}
        transition={loop(3)}
        style={{ transformOrigin: '112px 58px' }}
      >
        <g opacity='0.1'>
          <Ink
            d={gen.ellipse(
              112,
              84,
              56,
              8,
              filled(321, INK, {
                fillStyle: 'solid',
                stroke: 'none',
                roughness: 1.6,
              })
            )}
          />
        </g>

        {/* frame easel legs */}
        <Ink d={gen.line(98, 78, 94, 88, stroke(303, { strokeWidth: 1.2 }))} />
        <Ink
          d={gen.line(126, 78, 130, 88, stroke(304, { strokeWidth: 1.2 }))}
        />

        {/* render canvas */}
        <rect
          x='88'
          y='40'
          width='48'
          height='40'
          rx='1.5'
          fill={`url(#${mj}_render)`}
        />
        <Ink
          d={gen.rectangle(
            88,
            40,
            48,
            40,
            stroke(305, { strokeWidth: 1.3, roughness: 1 })
          )}
        />

        {/* the GOOD: a crisp little scene resolved on the left/center of canvas */}
        <Ink
          d={gen.circle(
            104,
            54,
            11,
            filled(306, '#e0a83f', { fillStyle: 'solid' })
          )}
        />
        <Ink
          d={gen.path(
            'M88 70 Q100 62 116 68 L116 80 L88 80 Z',
            filled(307, '#94ac78', { hachureGap: 2.6 })
          )}
        />
        <Ink
          d={gen.path(
            'M104 72 Q118 64 130 72',
            stroke(308, { stroke: '#788c5d', strokeWidth: 1.2 })
          )}
        />

        {/* clean scan-rows of resolved pixels near the seam */}
        <Ink
          d={gen.line(
            118,
            47,
            128,
            47,
            stroke(309, { stroke: '#cf9836', strokeWidth: 1.4 })
          )}
        />
        <Ink
          d={gen.line(
            118,
            50,
            126,
            50,
            stroke(310, { stroke: '#cf9836', strokeWidth: 1.4 })
          )}
        />

        {/* THE BAD / WEIRD: the right edge hasn't finished — glitch shards drift,
            misaligned, off the seam. Each pulses/shifts out of place. */}
        <motion.g
          animate={{ x: [0, 3.5, 0], opacity: [0.85, 1, 0.85] }}
          transition={loop(1.8)}
          style={{ transformOrigin: '134px 52px' }}
        >
          <Ink
            d={gen.rectangle(
              132,
              48,
              9,
              5,
              filled(311, '#e2693f', { fillStyle: 'solid', roughness: 1.4 })
            )}
          />
        </motion.g>
        <motion.g
          animate={{ x: [0, -2.5, 0], y: [0, 1.5, 0] }}
          transition={loop(2.2, 0.4)}
          style={{ transformOrigin: '136px 60px' }}
        >
          <Ink
            d={gen.polygon(
              [
                [133, 58],
                [143, 56],
                [140, 64],
                [131, 63],
              ],
              filled(312, '#c2502e', { hachureGap: 2.2, fillWeight: 0.6 })
            )}
          />
        </motion.g>
        <motion.g
          animate={{ x: [0, 4, 0], rotate: [0, -6, 0] }}
          transition={loop(2, 0.8)}
          style={{ transformOrigin: '137px 70px' }}
        >
          <Ink
            d={gen.rectangle(
              134,
              67,
              7,
              4,
              filled(313, '#cf9836', { fillStyle: 'solid', roughness: 1.5 })
            )}
          />
        </motion.g>

        {/* a stray, "weird" extra fragment that floats free of the frame */}
        <motion.g
          animate={{ y: [0, -3, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={loop(2.6, 0.6)}
          style={{ transformOrigin: '149px 50px' }}
        >
          <Ink
            d={gen.rectangle(
              146,
              48,
              5,
              4,
              filled(314, '#e2693f', { fillStyle: 'solid' })
            )}
          />
        </motion.g>
      </motion.g>

      {/* faint glitch sparks scattering off the weird edge */}
      <Twinkle x={150} y={44} d={0.3} c='#e2693f' r={0.9} />
      <Twinkle x={156} y={56} d={1.1} c='#c2502e' r={0.9} />
    </Frame>
  );
}
