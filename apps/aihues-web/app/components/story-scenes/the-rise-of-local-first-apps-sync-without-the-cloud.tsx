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
  motion,
} from './_kit';

/* Local-first / sync-without-the-cloud → two small cottages on the ground, each
   holding its own lit data-core (on-device SQLite). A direct earth-level thread
   merges them peer-to-peer (CRDT sync). Above and apart, a distant cloud sits
   dimmed and crossed-out — present but unused. The link lives on the land. */

export default function Scene() {
  // a low ridge the two homes rest on
  const ridge = 'M0 80 Q60 72 100 76 T200 78 L200 100 L0 100 Z';
  // peer-to-peer thread arcing between the two cottage cores
  const link = 'M68 66 Q100 50 132 66';

  return (
    <Frame sky={['#f4f0e2', '#dfe7d2']}>
      <defs>
        <radialGradient id='lf_coreA' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#ffe6b0' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#ffe6b0' stopOpacity='0' />
        </radialGradient>
        <radialGradient id='lf_coreB' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#ffe6b0' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#ffe6b0' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* distant idle cloud, off to the side and dimmed — the unused cloud */}
      <Cloud x={150} y={22} s={0.85} o={0.3} />
      <motion.g
        animate={{ opacity: [0.35, 0.2, 0.35] }}
        transition={loop(3)}
        style={{ transformOrigin: '150px 22px' }}
      >
        <Ink
          d={gen.line(
            142,
            14,
            158,
            30,
            stroke(301, { stroke: '#9aa6b2', strokeWidth: 1.3, roughness: 1 })
          )}
        />
        <Ink
          d={gen.line(
            158,
            14,
            142,
            30,
            stroke(302, { stroke: '#9aa6b2', strokeWidth: 1.3, roughness: 1 })
          )}
        />
      </motion.g>

      <Twinkle x={32} y={20} d={0.2} c='#b6c79a' />
      <Twinkle x={186} y={44} d={1.1} c='#cf9836' />

      {/* low ground ridge */}
      <Ink
        d={gen.path(
          ridge,
          filled(303, '#c4d2ac', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* core glows under each cottage window */}
      <circle cx='68' cy='66' r='16' fill='url(#lf_coreA)' />
      <circle cx='132' cy='66' r='16' fill='url(#lf_coreB)' />

      {/* peer-to-peer sync thread, rough and flowing between the two cores */}
      <RoughDash d={link} c='#788c5d' w={1.6} dur={1.7} seed={310} dash='2 5' />

      {/* left cottage */}
      <motion.g
        animate={{ y: [0, -1.4, 0] }}
        transition={loop(2.4)}
        style={{ transformOrigin: '68px 70px' }}
      >
        <Ink
          d={gen.rectangle(
            58,
            64,
            20,
            14,
            filled(304, '#ffffff', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        <Ink
          d={gen.polygon(
            [
              [55, 64],
              [68, 53],
              [81, 64],
            ],
            filled(305, '#c2502e', { hachureGap: 2.4 })
          )}
        />
        {/* lit data-core window */}
        <motion.g
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={loop(2)}
          style={{ transformOrigin: '68px 70px' }}
        >
          <Ink
            d={gen.rectangle(
              64,
              67,
              8,
              7,
              filled(306, '#f0b449', { fillStyle: 'solid' })
            )}
          />
        </motion.g>
      </motion.g>

      {/* right cottage */}
      <motion.g
        animate={{ y: [0, -1.4, 0] }}
        transition={loop(2.4, 0.6)}
        style={{ transformOrigin: '132px 70px' }}
      >
        <Ink
          d={gen.rectangle(
            122,
            64,
            20,
            14,
            filled(307, '#ffffff', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        <Ink
          d={gen.polygon(
            [
              [119, 64],
              [132, 53],
              [145, 64],
            ],
            filled(308, '#6a9bcc', { hachureGap: 2.4 })
          )}
        />
        {/* lit data-core window */}
        <motion.g
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={loop(2, 1)}
          style={{ transformOrigin: '132px 70px' }}
        >
          <Ink
            d={gen.rectangle(
              128,
              67,
              8,
              7,
              filled(309, '#f0b449', { fillStyle: 'solid' })
            )}
          />
        </motion.g>
      </motion.g>
    </Frame>
  );
}
