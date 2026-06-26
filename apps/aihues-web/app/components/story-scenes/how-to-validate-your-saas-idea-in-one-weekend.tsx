'use client';
import {
  Frame,
  Ink,
  RoughDash,
  gen,
  filled,
  stroke,
  loop,
  INK,
  motion,
  Sun,
} from './_kit';

export default function Scene() {
  return (
    <Frame sky={['#fcf3e6', '#f1dcc4']}>
      <defs>
        <radialGradient id='wknd_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff5dd' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff5dd' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='wknd_open' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#fff3d4' />
          <stop offset='100%' stopColor='#f4d79c' />
        </linearGradient>
      </defs>

      {/* dawn glow behind the lone "fake door" */}
      <circle cx='112' cy='44' r='40' fill='url(#wknd_glow)' />
      <Sun x={52} y={26} r={6} seed={313} />

      {/* flat weekend ground — nothing built yet behind the door */}
      <Ink
        d={gen.path(
          'M0 80 Q100 75 200 80 L200 100 L0 100 Z',
          filled(301, '#e7cfa6', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />
      <Ink
        d={gen.line(
          0,
          80,
          200,
          80,
          stroke(302, { stroke: '#d9b97f', strokeWidth: 1 })
        )}
      />

      {/* faint footprint of the un-built product — a dashed foundation outline */}
      <RoughDash
        d='M70 88 L150 88 L162 82 L82 82 Z'
        c='#bfa06a'
        w={1}
        dur={2.4}
        dash='2 4'
        o={0.6}
        seed={310}
      />

      {/* the focal subject: a single freestanding door (the "fake door" / landing page) */}
      <motion.g
        animate={{ y: [0, -1.4, 0] }}
        transition={loop(3)}
        style={{ transformOrigin: '100px 60px' }}
      >
        {/* soft shadow */}
        <Ink
          d={gen.ellipse(100, 82, 34, 6, {
            fill: INK,
            fillStyle: 'solid',
            stroke: 'none',
            roughness: 1.4,
            seed: 311,
          })}
        />
        {/* plinth the door stands on */}
        <Ink
          d={gen.rectangle(
            83,
            78,
            34,
            4,
            filled(303, '#cf9836', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
        {/* door frame */}
        <Ink
          d={gen.rectangle(
            84,
            36,
            32,
            42,
            filled(304, '#ffffff', {
              fillStyle: 'solid',
              strokeWidth: 1.2,
              roughness: 1,
            })
          )}
        />
        {/* the opening — light streaming through (it leads nowhere yet) */}
        <Ink
          d={gen.rectangle(
            88,
            40,
            24,
            38,
            filled(305, '#f4d79c', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
        <motion.rect
          x='88'
          y='40'
          width='24'
          height='38'
          fill='url(#wknd_open)'
          animate={{ opacity: [0.45, 0.85, 0.45] }}
          transition={loop(2.6)}
        />
        {/* handle */}
        <Ink
          d={gen.circle(
            94,
            60,
            2.4,
            filled(306, '#c2502e', { fillStyle: 'solid' })
          )}
        />
      </motion.g>

      {/* a measured "yes" — a small sage flag of validated interest above the door */}
      <Ink d={gen.line(116, 36, 116, 22, stroke(307, { strokeWidth: 1.5 }))} />
      <motion.g
        animate={{ skewX: [0, 8, 0] }}
        transition={loop(1.8)}
        style={{ transformOrigin: '116px 26px' }}
      >
        <Ink
          d={gen.path(
            'M116 23 Q124 25 131 22 Q124 28 131 31 Q123 29 116 32 Z',
            filled(308, '#788c5d', { fillStyle: 'solid' })
          )}
        />
        {/* a tiny check inside the flag — signal confirmed */}
        <Ink
          d={gen.path(
            'M119 26 L121.5 28.5 L126 24',
            stroke(309, { stroke: '#fff', strokeWidth: 1.1 })
          )}
        />
      </motion.g>

      {/* a couple of bright pings arriving — early sign-ups landing */}
      {[
        [124, 52, 0, 312],
        [78, 52, 0.8, 313],
      ].map(([px, py, d, sd]) => (
        <motion.g
          key={px}
          animate={{ scale: [0, 1.2, 0], opacity: [0, 0.9, 0] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeOut',
            delay: d,
          }}
          style={{ transformOrigin: `${px}px ${py}px` }}
        >
          <Ink
            d={gen.circle(
              px,
              py,
              3.6,
              filled(sd, '#e0a83f', { fillStyle: 'solid', strokeWidth: 0.8 })
            )}
          />
        </motion.g>
      ))}
    </Frame>
  );
}
