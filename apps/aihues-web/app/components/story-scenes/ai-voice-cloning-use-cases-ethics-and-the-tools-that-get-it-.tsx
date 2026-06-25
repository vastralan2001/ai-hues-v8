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
  RoughDash,
  motion,
} from './_kit';

/* AI Voice Cloning — a ribbon microphone sings one warm waveform; across a soft
   vertical "consent" boundary the same wave returns as a fainter dashed echo —
   the cloned voice. Solid original on the left, mirrored ghost-copy on the
   right. Seeds: 300-block. Gradient ids: voxclone_*. */

export default function Scene() {
  const wave = 'M70 50 q5 -9 10 0 t10 0 t10 0';
  const echo = 'M120 50 q5 -7 10 0 t10 0 t10 0 t10 0';
  return (
    <Frame sky={['#f6f0e6', '#e7ddcd']}>
      <defs>
        <radialGradient id='voxclone_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff4df' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff4df' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='voxclone_seam' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#cf9836' stopOpacity='0' />
          <stop offset='45%' stopColor='#cf9836' stopOpacity='0.5' />
          <stop offset='100%' stopColor='#cf9836' stopOpacity='0' />
        </linearGradient>
      </defs>

      <circle cx='64' cy='44' r='40' fill='url(#voxclone_glow)' />
      <Twinkle x={34} y={22} c='#e0a83f' />
      <Twinkle x={178} y={26} d={0.8} c='#cf9836' />
      <Cloud x={158} y={68} s={0.7} o={0.32} />

      {/* the consent boundary — the soft vertical line the clone crosses */}
      <rect
        x='108.4'
        y='14'
        width='1.4'
        height='74'
        fill='url(#voxclone_seam)'
      />
      <motion.g animate={{ opacity: [0.3, 0.7, 0.3] }} transition={loop(2.6)}>
        <Ink
          d={gen.circle(
            109,
            50,
            5,
            stroke(301, { stroke: '#cf9836', strokeWidth: 1, roughness: 1 })
          )}
        />
      </motion.g>

      {/* original voice — warm, solid waveform leaving the mic */}
      <motion.g animate={{ opacity: [0.7, 1, 0.7] }} transition={loop(2.2)}>
        <Ink
          d={gen.path(
            wave,
            stroke(312, {
              stroke: '#c2502e',
              strokeWidth: 1.6,
              roughness: 1.1,
            })
          )}
        />
      </motion.g>

      {/* cloned voice — the mirrored echo, fainter, dashed, drifting across */}
      <RoughDash
        d={echo}
        c='#6a9bcc'
        w={1.4}
        dur={2.4}
        dash='2 4'
        o={0.7}
        seed={313}
      />

      {/* the ribbon microphone — the focal subject */}
      <motion.g
        animate={{ y: [0, -1.6, 0] }}
        transition={loop(2.8)}
        style={{ transformOrigin: '54px 52px' }}
      >
        <Ink d={gen.line(54, 70, 54, 88, stroke(302, { strokeWidth: 1.5 }))} />
        <Ink
          d={gen.ellipse(
            54,
            89,
            18,
            4,
            filled(303, '#94ac78', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        <Ink
          d={gen.path(
            'M47 40 Q47 34 54 34 Q61 34 61 40 L61 64 Q61 70 54 70 Q47 70 47 64 Z',
            filled(304, '#e2693f', { strokeWidth: 1.3, hachureGap: 2.4 })
          )}
        />
        <Ink d={gen.line(50, 44, 58, 44, stroke(305, { strokeWidth: 1 }))} />
        <Ink d={gen.line(50, 49, 58, 49, stroke(306, { strokeWidth: 1 }))} />
        <Ink d={gen.line(50, 54, 58, 54, stroke(307, { strokeWidth: 1 }))} />
        <Ink d={gen.line(50, 59, 58, 59, stroke(308, { strokeWidth: 1 }))} />
        <Ink
          d={gen.path(
            'M47 40 Q54 31 61 40',
            stroke(309, { strokeWidth: 1.2, roughness: 1 })
          )}
        />
      </motion.g>

      {/* the receiving end — a faint cloned mic outline beyond the boundary */}
      <motion.g
        animate={{ opacity: [0.32, 0.5, 0.32] }}
        transition={loop(3, 0.4)}
        style={{ transformOrigin: '162px 52px' }}
      >
        <Ink
          d={gen.path(
            'M155 40 Q155 34 162 34 Q169 34 169 40 L169 64 Q169 70 162 70 Q155 70 155 64 Z',
            stroke(310, { stroke: '#6a9bcc', strokeWidth: 1.2, roughness: 1.1 })
          )}
        />
        <Ink
          d={gen.line(
            162,
            70,
            162,
            86,
            stroke(311, { stroke: '#6a9bcc', strokeWidth: 1.2 })
          )}
        />
      </motion.g>
    </Frame>
  );
}
