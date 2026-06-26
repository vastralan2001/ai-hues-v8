'use client';
import {
  Frame,
  Ink,
  gen,
  filled,
  stroke,
  loop,
  RoughDash,
  INK,
  motion,
} from './_kit';

/* ai-content-strategy — one human source scaling into many distinct outputs.
   A single ink quill nib hangs over a calm channel; from its drop a current
   flows downstream and fans into a small fleet of paper sheets, each one
   subtly its own. One authored hand, fifty pieces, none alike. */

export default function Scene() {
  const flow = 'M58 52 Q92 60 124 58 T188 66';
  const fan = [
    { x: 132, y: 60, rot: -16, fill: '#f4ede0', ph: 0 },
    { x: 150, y: 56, rot: -4, fill: '#ffffff', ph: 0.5 },
    { x: 168, y: 62, rot: 9, fill: '#f0e4d2', ph: 1 },
    { x: 184, y: 56, rot: 20, fill: '#fbf4e6', ph: 1.5 },
  ];
  return (
    <Frame sky={['#f6efe0', '#e6d8bf']}>
      <defs>
        <radialGradient id='acs_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff6e3' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#fff6e3' stopOpacity='0' />
        </radialGradient>
      </defs>

      <circle cx='52' cy='26' r='40' fill='url(#acs_glow)' />

      {/* the channel — the current that carries content downstream */}
      <Ink
        d={gen.path(
          'M44 56 Q100 50 200 64 L200 100 L40 100 Z',
          filled(601, '#bcd6bd', {
            roughness: 1.5,
            hachureGap: 3.6,
            fillWeight: 0.6,
          })
        )}
      />
      <Ink
        d={gen.rectangle(
          40,
          72,
          160,
          28,
          filled(605, '#9cbf9e', {
            fillStyle: 'solid',
            roughness: 1.5,
            strokeWidth: 0.8,
          })
        )}
      />

      {/* the flowing current line — source to many */}
      <RoughDash d={flow} c='#7f9e7f' w={1.6} dur={1.7} dash='2 6' seed={606} />

      {/* the single human source — a quill nib over the channel */}
      <motion.g
        animate={{ y: [0, -2.4, 0], rotate: [0, 2, 0] }}
        transition={loop(2.8)}
        style={{ transformOrigin: '52px 38px' }}
      >
        <g transform='rotate(28 52 50)'>
          <Ink
            d={gen.path(
              'M52 24 C58 34 60 44 56 50 L48 50 C44 44 46 34 52 24 Z',
              filled(602, '#e2693f', { strokeWidth: 1.2 })
            )}
          />
          <Ink
            d={gen.line(52, 30, 52, 49, stroke(603, { strokeWidth: 1.1 }))}
          />
          <Ink
            d={gen.polygon(
              [
                [50, 49],
                [54, 49],
                [52, 55],
              ],
              filled(604, '#c2502e', { fillStyle: 'solid' })
            )}
          />
        </g>
      </motion.g>

      {/* the ink drop — the seed of the current */}
      <motion.g
        animate={{ y: [0, 12, 0], opacity: [0.9, 0, 0.9] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeIn' }}
      >
        <Ink
          d={gen.circle(
            58,
            52,
            3.4,
            filled(607, '#c2502e', { fillStyle: 'solid' })
          )}
        />
      </motion.g>

      {/* the fan of outputs — many sheets, each its own */}
      {fan.map((s, i) => (
        <motion.g
          key={s.x}
          animate={{ y: [0, -2.6, 0] }}
          transition={loop(2.4, s.ph)}
          style={{ transformOrigin: `${s.x}px ${s.y}px` }}
        >
          <g transform={`rotate(${s.rot} ${s.x} ${s.y})`}>
            <g opacity='0.08'>
              <Ink
                d={gen.ellipse(
                  s.x,
                  s.y + 14,
                  16,
                  4,
                  filled(660 + i, INK, {
                    fillStyle: 'solid',
                    stroke: 'none',
                    strokeWidth: 0,
                  })
                )}
              />
            </g>
            <Ink
              d={gen.rectangle(
                s.x - 7,
                s.y - 10,
                14,
                20,
                filled(610 + i, s.fill, {
                  fillStyle: 'solid',
                  strokeWidth: 1.1,
                  roughness: 1.1,
                })
              )}
            />
            <Ink
              d={gen.line(
                s.x - 4,
                s.y - 4,
                s.x + 4,
                s.y - 4,
                stroke(620 + i, { stroke: '#94ac78', strokeWidth: 1.4 })
              )}
            />
            <Ink
              d={gen.line(
                s.x - 4,
                s.y,
                s.x + 5,
                s.y,
                stroke(630 + i, { stroke: '#a9bb91', strokeWidth: 1.4 })
              )}
            />
            <Ink
              d={gen.line(
                s.x - 4,
                s.y + 4,
                s.x + 2,
                s.y + 4,
                stroke(640 + i, { stroke: '#a9bb91', strokeWidth: 1.4 })
              )}
            />
          </g>
        </motion.g>
      ))}

      {/* a gold mark on the lead sheet — the kept human touch */}
      <motion.g
        animate={{ scale: [0.9, 1.1, 0.9] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '150px 50px' }}
      >
        <Ink
          d={gen.circle(
            150,
            49,
            4,
            filled(650, '#f0b449', { fillStyle: 'solid' })
          )}
        />
      </motion.g>
    </Frame>
  );
}
