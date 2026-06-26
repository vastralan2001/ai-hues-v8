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

/* Metaphor: faster reading with comprehension = a single steady guide-light
   gliding line by line down a page of ruled text, pulling the eye forward in a
   smooth sweep (a pacer) rather than skipping. The open book is the focal
   subject; one warm pacer-dot tracks the lines while a soft trail follows. */

const ROWS = [38, 46, 54, 62, 70];

export default function Scene() {
  return (
    <Frame sky={['#fdf4e6', '#f5e3c6']}>
      <defs>
        <radialGradient id='rdfast_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#ffeec2' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#ffeec2' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='rdfast_page' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#fffaf0' />
          <stop offset='100%' stopColor='#f4e6cb' />
        </linearGradient>
      </defs>

      {/* warm reading lamp glow + sky accents */}
      <circle cx='150' cy='22' r='40' fill='url(#rdfast_glow)' />

      {/* distant desk horizon for depth */}
      <Ink
        d={gen.path(
          'M0 88 Q100 82 200 88 L200 100 L0 100 Z',
          filled(301, '#e7c98f', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* book shadow */}
      <g opacity='0.1'>
        <Ink
          d={gen.ellipse(
            100,
            84,
            124,
            12,
            filled(300, INK, {
              fillStyle: 'solid',
              stroke: 'none',
              roughness: 1.5,
            })
          )}
        />
      </g>

      {/* the open book — focal subject, gently breathing */}
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={loop(3)}
        style={{ transformOrigin: '100px 60px' }}
      >
        {/* left page */}
        <Ink
          d={gen.path(
            'M100 32 Q70 26 40 32 L42 78 Q72 73 100 78 Z',
            filled(302, 'url(#rdfast_page)', {
              fillStyle: 'solid',
              strokeWidth: 1.2,
              roughness: 1,
            })
          )}
        />
        {/* right page */}
        <Ink
          d={gen.path(
            'M100 32 Q130 26 160 32 L158 78 Q128 73 100 78 Z',
            filled(303, 'url(#rdfast_page)', {
              fillStyle: 'solid',
              strokeWidth: 1.2,
              roughness: 1,
            })
          )}
        />
        {/* spine */}
        <Ink
          d={gen.line(100, 32, 100, 78, stroke(304, { strokeWidth: 1.3 }))}
        />

        {/* left-page ruled text — short faint lines */}
        {ROWS.map((y, i) => (
          <Ink
            key={`l${y}`}
            d={gen.line(
              52,
              y,
              90,
              y - 1,
              stroke(310 + i, {
                stroke: '#b79a6a',
                strokeWidth: 1.4,
                roughness: 0.8,
              })
            )}
          />
        ))}

        {/* right-page ruled text — the lines being read, warmer ink */}
        {ROWS.map((y, i) => (
          <Ink
            key={`r${y}`}
            d={gen.line(
              110,
              y - 1,
              148,
              y,
              stroke(320 + i, {
                stroke: '#9c8458',
                strokeWidth: 1.5,
                roughness: 0.8,
              })
            )}
          />
        ))}

        {/* the pacer trail: a smooth guide stroke sweeping down the right page */}
        <g opacity='0.55'>
          <RoughDash
            d='M110 37 Q148 37 110 45 Q148 45 110 53 Q148 53 110 61 Q148 61 110 69'
            c='#e2693f'
            w={1.4}
            seed={306}
            dash='3 6'
            dur={2.2}
          />
        </g>

        {/* the focal pacer-dot: glides line to line, pulling the eye forward */}
        <motion.g
          animate={{
            x: [0, 38, 0, 38, 0, 38, 0, 38, 0],
            y: [0, 0, 8, 8, 16, 16, 24, 24, 32],
          }}
          transition={{
            duration: 4.4,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.12, 0.25, 0.37, 0.5, 0.62, 0.75, 0.87, 1],
          }}
        >
          <g opacity='0.55'>
            <Ink
              d={gen.circle(
                110,
                37,
                9.2,
                filled(307, '#ffe0b0', { fillStyle: 'solid', stroke: 'none' })
              )}
            />
          </g>
          <Ink
            d={gen.circle(
              110,
              37,
              4.4,
              filled(305, '#e0a83f', { fillStyle: 'solid' })
            )}
          />
        </motion.g>
      </motion.g>
    </Frame>
  );
}
