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

export default function Scene() {
  return (
    <Frame sky={['#fbf4e6', '#ecdcc2']}>
      <defs>
        <radialGradient id='schema_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3d6' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff3d6' stopOpacity='0' />
        </radialGradient>
      </defs>

      <Cloud x={42} y={24} s={0.8} o={0.4} />
      <Cloud x={158} y={20} s={0.7} o={0.35} />
      <Twinkle x={28} y={32} c='#cf9836' />
      <Twinkle x={176} y={40} d={0.9} c='#e0a83f' />
      <Twinkle x={150} y={58} d={1.5} c='#cf9836' r={0.9} />

      {/* horizon shelf the result card rests on */}
      <Ink
        d={gen.path(
          'M0 86 Q100 80 200 86 L200 100 L0 100 Z',
          filled(401, '#dcc79c', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* the page source below — a small stack of structured-data lines */}
      <motion.g animate={{ opacity: [0.55, 0.85, 0.55] }} transition={loop(3)}>
        <Ink
          d={gen.line(
            74,
            90,
            90,
            90,
            stroke(402, { stroke: '#94ac78', strokeWidth: 1.4 })
          )}
        />
        <Ink
          d={gen.line(
            98,
            90,
            120,
            90,
            stroke(403, { stroke: '#94ac78', strokeWidth: 1.4 })
          )}
        />
        <Ink
          d={gen.line(
            80,
            93,
            116,
            93,
            stroke(404, { stroke: '#b6c39e', strokeWidth: 1.2 })
          )}
        />
      </motion.g>

      {/* the schema that connects: a glowing tag-stream flowing UP into the card */}
      <circle cx='100' cy='52' r='30' fill='url(#schema_glow)' />
      <motion.path
        d='M100 88 Q96 70 100 56'
        fill='none'
        stroke='#e0a83f'
        strokeWidth='1.8'
        strokeDasharray='2 5'
        animate={{ strokeDashoffset: [0, -21] }}
        transition={linear(1.5)}
      />
      {/* two schema streams that do NOT pay off — drift sideways and fade */}
      <motion.path
        d='M86 90 Q66 76 60 64'
        fill='none'
        stroke='#9aa890'
        strokeWidth='1.2'
        strokeDasharray='2 6'
        animate={{ strokeDashoffset: [0, -24], opacity: [0.4, 0.08, 0.4] }}
        transition={linear(2.2)}
      />
      <motion.path
        d='M114 90 Q138 78 146 68'
        fill='none'
        stroke='#9aa890'
        strokeWidth='1.2'
        strokeDasharray='2 6'
        animate={{ strokeDashoffset: [0, -24], opacity: [0.4, 0.08, 0.4] }}
        transition={linear(2.6)}
      />

      {/* drifting angle-bracket glyphs riding the dead streams */}
      <motion.g
        animate={{ y: [0, -8, 0], opacity: [0.5, 0.12, 0.5] }}
        transition={loop(2.6)}
      >
        <Ink
          d={gen.path(
            'M66 74 L62 70 L66 66',
            stroke(405, { stroke: '#8b9a7d', strokeWidth: 1.1 })
          )}
        />
      </motion.g>
      <motion.g
        animate={{ y: [0, -8, 0], opacity: [0.5, 0.12, 0.5] }}
        transition={loop(2.9, 0.5)}
      >
        <Ink
          d={gen.path(
            'M140 76 L144 72 L140 68',
            stroke(406, { stroke: '#8b9a7d', strokeWidth: 1.1 })
          )}
        />
      </motion.g>

      {/* the focal subject: a search-result card blooming rich features */}
      <motion.g
        animate={{ y: [0, -2.5, 0] }}
        transition={loop(2.8)}
        style={{ transformOrigin: '100px 50px' }}
      >
        <ellipse cx='100' cy='71' rx='44' ry='3.5' fill={INK} opacity='0.1' />
        <Ink
          d={gen.rectangle(
            58,
            34,
            84,
            34,
            filled(407, '#ffffff', {
              fillStyle: 'solid',
              strokeWidth: 1.2,
              roughness: 1,
            })
          )}
        />
        {/* title line of the listing (slate-blue, like a search link) */}
        <Ink
          d={gen.line(
            64,
            41,
            122,
            41,
            stroke(408, { stroke: '#5a86c5', strokeWidth: 2 })
          )}
        />
        {/* green URL / breadcrumb line */}
        <Ink
          d={gen.line(
            64,
            46,
            102,
            46,
            stroke(409, { stroke: '#788c5d', strokeWidth: 1.4 })
          )}
        />

        {/* the rich result: a row of star ratings that bloom in */}
        <motion.g
          animate={{ scale: [0.9, 1.08, 0.9], opacity: [0.8, 1, 0.8] }}
          transition={loop(2.2)}
          style={{ transformOrigin: '76px 54px' }}
        >
          {[64, 70, 76, 82, 88].map((sx, i) => (
            <Ink
              key={sx}
              d={gen.polygon(
                [
                  [sx, 51.5],
                  [sx + 0.9, 53.4],
                  [sx + 3, 53.6],
                  [sx + 1.4, 55],
                  [sx + 1.8, 57.1],
                  [sx, 56],
                  [sx - 1.8, 57.1],
                  [sx - 1.4, 55],
                  [sx - 3, 53.6],
                  [sx - 0.9, 53.4],
                ],
                filled(410 + i, '#f0b449', {
                  fillStyle: 'solid',
                  strokeWidth: 0.9,
                })
              )}
            />
          ))}
        </motion.g>

        {/* snippet body lines */}
        <Ink
          d={gen.line(
            64,
            61,
            134,
            61,
            stroke(420, { stroke: '#b9b09c', strokeWidth: 1.1 })
          )}
        />
        <Ink
          d={gen.line(
            64,
            64.5,
            120,
            64.5,
            stroke(421, { stroke: '#b9b09c', strokeWidth: 1.1 })
          )}
        />
      </motion.g>
    </Frame>
  );
}
