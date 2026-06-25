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

/* Metaphor: a small, lovingly-finished paper boat moored to a cozy little dock in
   a sheltered cove — tied by a rope to the safe shore — while the open sea (the
   real market) stretches past the headland. The project is "done" and charming
   but never casts off into open water: hobby mode. */

export default function Scene() {
  return (
    <Frame sky={['#fcf4e6', '#f1ddc0']}>
      <defs>
        <radialGradient id='sideproj_sun' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff4dd' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff4dd' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='sideproj_water' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#a9cbe6' />
          <stop offset='100%' stopColor='#6a9bcc' />
        </linearGradient>
      </defs>

      {/* low sun over the open sea — the horizon the boat never reaches */}
      <circle cx='168' cy='30' r='40' fill='url(#sideproj_sun)' />
      <Ink
        d={gen.circle(
          168,
          30,
          13,
          filled(310, '#f4e3b4', { fillStyle: 'solid' })
        )}
      />
      <Cloud x={54} y={22} s={0.8} o={0.4} />
      <Twinkle x={132} y={18} c='#cf9836' />
      <Twinkle x={186} y={48} d={0.9} c='#e0a83f' r={1} />

      {/* sheltering headland that walls the cove off from open water */}
      <Ink
        d={gen.path(
          'M0 58 Q40 40 78 56 L78 70 L0 70 Z',
          filled(311, '#94ac78', { hachureGap: 3.6, fillWeight: 0.6 })
        )}
      />
      <Ink
        d={gen.path(
          'M0 64 Q34 52 70 64 L70 74 L0 74 Z',
          filled(312, '#788c5d', { hachureGap: 3 })
        )}
      />

      {/* sea — calm cove in front, open water beyond (atmosphere gradient) */}
      <rect x='0' y='64' width='200' height='36' fill='url(#sideproj_water)' />
      {/* rough waterline at the horizon */}
      <Ink
        d={gen.line(0, 64, 200, 64, {
          stroke: '#eaf6ff',
          strokeWidth: 1.2,
          roughness: 1.2,
          bowing: 1.6,
          seed: 325,
        })}
      />

      {/* gentle moving ripple toward open sea */}
      <RoughDash
        d='M96 78 Q120 75 144 78 T192 78'
        c='#eaf6ff'
        w={1}
        dur={3.2}
        seed={326}
        dash='4 9'
        o={0.55}
      />

      {/* the cozy little dock — the safe shore */}
      <Ink
        d={gen.rectangle(
          8,
          70,
          44,
          3.4,
          filled(313, '#cf9836', { fillStyle: 'solid', strokeWidth: 1.1 })
        )}
      />
      <Ink d={gen.line(16, 73, 16, 84, stroke(314, { strokeWidth: 1.3 }))} />
      <Ink d={gen.line(32, 73, 32, 86, stroke(315, { strokeWidth: 1.3 }))} />
      <Ink d={gen.line(46, 73, 46, 85, stroke(316, { strokeWidth: 1.3 }))} />
      {/* mooring post at the dock's end */}
      <Ink d={gen.line(52, 70, 52, 62, stroke(317, { strokeWidth: 1.6 }))} />

      {/* the tether — rope holding the finished boat to the safe shore */}
      <Ink
        d={gen.path(
          'M52 63 Q66 67 78 70',
          stroke(318, { strokeWidth: 1, roughness: 1.6 })
        )}
      />

      {/* the boat: small, lovingly finished, still moored — bobbing in the cove */}
      <motion.g
        animate={{ y: [0, -1.6, 0], rotate: [-1.6, 1.6, -1.6] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '86px 70px' }}
      >
        <g opacity='0.12'>
          <Ink
            d={gen.ellipse(
              86,
              74,
              28,
              5.2,
              filled(327, INK, {
                fillStyle: 'solid',
                stroke: INK,
                strokeWidth: 0,
              })
            )}
          />
        </g>
        {/* hull */}
        <Ink
          d={gen.path(
            'M74 69 L98 69 L93 76 L79 76 Z',
            filled(319, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        {/* mast */}
        <Ink d={gen.line(86, 69, 86, 55, stroke(320, { strokeWidth: 1.2 }))} />
        {/* sail — neat, complete, never unfurled for the open sea */}
        <motion.g
          animate={{ skewX: [0, 6, 0] }}
          transition={loop(2.2)}
          style={{ transformOrigin: '86px 62px' }}
        >
          <Ink
            d={gen.path(
              'M87 56 L87 68 L97 67 Z',
              filled(321, '#f6e7bb', { fillStyle: 'solid', strokeWidth: 1.1 })
            )}
          />
          <Ink
            d={gen.path(
              'M85 57 L85 68 L77 67 Z',
              filled(322, '#c2502e', { fillStyle: 'solid', strokeWidth: 1.1 })
            )}
          />
        </motion.g>
      </motion.g>

      {/* a lone buoy far out in open water — the market the boat never sails to */}
      <motion.g
        animate={{ y: [0, -1.4, 0] }}
        transition={loop(2.9, 0.6)}
        style={{ transformOrigin: '170px 80px' }}
      >
        <Ink
          d={gen.circle(
            170,
            80,
            4.2,
            filled(323, '#e0a83f', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
        <Ink
          d={gen.line(170, 77.5, 170, 73, stroke(324, { strokeWidth: 1 }))}
        />
      </motion.g>
    </Frame>
  );
}
