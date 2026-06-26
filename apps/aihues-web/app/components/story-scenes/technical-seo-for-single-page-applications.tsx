'use client';
import {
  Frame,
  Ink,
  Twinkle,
  RoughDash,
  gen,
  filled,
  stroke,
  loop,
  INK,
  motion,
} from './_kit';

/* Technical SEO for SPAs — a small crawler "probe" descends on a single thread
   toward a page-document that is materializing: a faint dashed shell resolving
   into solid, readable content lines under a quiet horizon beacon. The crawl
   thread = the crawler reaching the route; the blank-shell-becoming-readable
   document = making the client-side app legible to search engines. */

export default function Scene() {
  return (
    <Frame sky={['#eef4fb', '#dbe7f4']}>
      <defs>
        <radialGradient id='tseo_beacon' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff5e0' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#fff5e0' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='tseo_ground' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#cfe0f1' />
          <stop offset='100%' stopColor='#a8c4e0' />
        </linearGradient>
      </defs>

      <circle cx='40' cy='26' r='40' fill='url(#tseo_beacon)' />
      <Twinkle x={28} y={20} c='#8fb2dd' />

      {/* distant ground plane for depth */}
      <Ink
        d={gen.path(
          'M0 86 Q100 80 200 86 L200 100 L0 100 Z',
          filled(101, '#b7d0e8', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />
      <rect
        x='0'
        y='92'
        width='200'
        height='8'
        fill='url(#tseo_ground)'
        opacity='0.5'
      />

      {/* the crawl thread: the probe's single descending line to the page */}
      <RoughDash
        d='M120 8 L120 50'
        c={INK}
        w={0.8}
        dur={1.4}
        dash='1.5 4'
        o={0.5}
        seed={120}
      />

      {/* the page-document, materializing from blank shell to readable content */}
      <motion.g
        animate={{ y: [0, -2.2, 0] }}
        transition={loop(3)}
        style={{ transformOrigin: '118px 70px' }}
      >
        <g opacity='0.1'>
          <Ink
            d={gen.ellipse(
              118,
              90,
              44,
              7.2,
              filled(113, INK, { fillStyle: 'solid', stroke: 'none' })
            )}
          />
        </g>

        {/* faint dashed shell — the empty SPA skeleton search engines first see */}
        <Ink
          d={gen.rectangle(
            100,
            54,
            38,
            32,
            stroke(102, {
              stroke: '#7aa0c6',
              strokeWidth: 0.9,
              roughness: 1.4,
            })
          )}
        />

        {/* the solid document surface resolving on top */}
        <Ink
          d={gen.rectangle(
            98,
            50,
            38,
            32,
            filled(103, '#ffffff', {
              fillStyle: 'solid',
              strokeWidth: 1.2,
              roughness: 1,
            })
          )}
        />

        {/* content lines fading in: the markup becoming legible */}
        {[
          { y: 58, x2: 122, seed: 104, d: 0 },
          { y: 63, x2: 128, seed: 105, d: 0.4 },
          { y: 68, x2: 118, seed: 106, d: 0.8 },
          { y: 73, x2: 126, seed: 107, d: 1.2 },
        ].map((l) => (
          <motion.g
            key={l.seed}
            animate={{ opacity: [0.15, 1, 0.15] }}
            transition={loop(3.6, l.d)}
          >
            <Ink
              d={gen.line(
                104,
                l.y,
                l.x2,
                l.y,
                stroke(l.seed, { stroke: '#5a86c5', strokeWidth: 1.6 })
              )}
            />
          </motion.g>
        ))}

        {/* a heading swatch — the title tag, the part SEO most wants */}
        <Ink
          d={gen.rectangle(
            104,
            54,
            10,
            2.6,
            filled(108, '#e0a83f', { fillStyle: 'solid', strokeWidth: 0.9 })
          )}
        />
      </motion.g>

      {/* the crawler probe itself, hovering at the thread's end */}
      <motion.g
        animate={{ y: [0, 2.4, 0] }}
        transition={loop(2.2)}
        style={{ transformOrigin: '120px 46px' }}
      >
        <Ink
          d={gen.ellipse(
            120,
            46,
            16,
            10,
            filled(109, '#788c5d', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        {/* scanning eye / lens reading the page */}
        <Ink
          d={gen.circle(
            120,
            46,
            5,
            filled(110, '#fff6e0', { fillStyle: 'solid' })
          )}
        />
        <motion.g
          animate={{ scale: [0.7, 1, 0.7], opacity: [0.5, 1, 0.5] }}
          transition={loop(1.6)}
          style={{ transformOrigin: '120px 46px' }}
        >
          <Ink
            d={gen.circle(
              120,
              46,
              2,
              filled(111, '#c2502e', { fillStyle: 'solid' })
            )}
          />
        </motion.g>
        {/* probe legs reaching down toward the document */}
        <Ink
          d={gen.path(
            'M114 50 L110 56 M120 51 L120 58 M126 50 L130 56',
            stroke(112, { stroke: '#6f8a4f', strokeWidth: 1.2 })
          )}
        />
      </motion.g>

      {/* the read beam: a soft scan spreading from probe onto the content */}
      <motion.g animate={{ opacity: [0.25, 0.6, 0.25] }} transition={loop(1.8)}>
        <Ink
          d={gen.line(120, 50, 106, 66, {
            stroke: '#e0a83f',
            strokeWidth: 0.8,
            roughness: 1.6,
            seed: 114,
          })}
        />
        <Ink
          d={gen.line(120, 50, 132, 66, {
            stroke: '#e0a83f',
            strokeWidth: 0.8,
            roughness: 1.6,
            seed: 115,
          })}
        />
      </motion.g>
    </Frame>
  );
}
