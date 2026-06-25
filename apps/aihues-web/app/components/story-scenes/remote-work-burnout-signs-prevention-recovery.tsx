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
  motion,
} from './_kit';

// Remote-work burnout → recovery: a lone desk lamp at the very edge of a ledge,
// its bulb flared too-hot (embers drifting up), with a low boundary rail set
// between the lamp and the drop — the limits that pull it back from the edge.
export default function Scene() {
  return (
    <Frame sky={['#fbeede', '#f0cda7']}>
      <defs>
        <radialGradient id='rwbsp_heat' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#ffe3b3' stopOpacity='0.95' />
          <stop offset='55%' stopColor='#f4a85a' stopOpacity='0.45' />
          <stop offset='100%' stopColor='#f4a85a' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='rwbsp_drop' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#e6c79c' stopOpacity='0.85' />
          <stop offset='100%' stopColor='#cf9836' stopOpacity='0' />
        </linearGradient>
      </defs>

      {/* dusk accents + soft far cloud for depth */}
      <Twinkle x={30} y={22} c='#cf9836' />
      <Twinkle x={176} y={30} d={0.8} c='#e0a83f' />
      <Cloud x={150} y={64} s={0.7} o={0.35} />

      {/* far hill horizon */}
      <Ink
        d={gen.path(
          'M0 80 Q60 70 122 76 T200 72 L200 100 L0 100 Z',
          filled(301, '#e8cca0', { roughness: 1.6, hachureGap: 4 })
        )}
      />

      {/* the ledge the lamp stands on — a flat plateau ending in a sheer edge */}
      <Ink
        d={gen.path(
          'M0 78 L112 78 L120 96 L0 96 Z',
          filled(302, '#d8b277', { hachureGap: 3.2, fillWeight: 0.6 })
        )}
      />
      {/* the drop beyond the edge — fading void */}
      <rect x='112' y='78' width='10' height='22' fill='url(#rwbsp_drop)' />
      <Ink d={gen.line(112, 78, 120, 96, stroke(303, { strokeWidth: 1.2 }))} />

      {/* the boundary rail — the limit set between the lamp and the drop */}
      <Ink d={gen.line(96, 60, 96, 78, stroke(304, { strokeWidth: 1.4 }))} />
      <Ink d={gen.line(108, 58, 108, 78, stroke(305, { strokeWidth: 1.4 }))} />
      <Ink
        d={gen.path('M92 61 Q102 58 112 60', stroke(306, { strokeWidth: 1.6 }))}
      />

      {/* heat halo behind the bulb */}
      <circle cx='56' cy='42' r='24' fill='url(#rwbsp_heat)' />

      {/* drifting embers — running too hot */}
      {[
        [52, 50, 0, 314],
        [60, 52, 0.9, 315],
        [56, 48, 1.7, 316],
      ].map(([ex, ey, d, sd]) => (
        <motion.g
          key={ex}
          animate={{ y: [0, -20], opacity: [0, 0.7, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeOut',
            delay: d,
          }}
        >
          <Ink
            d={gen.circle(
              ex,
              ey,
              2.6,
              filled(sd, '#e2693f', { fillStyle: 'solid', strokeWidth: 0.8 })
            )}
          />
        </motion.g>
      ))}

      {/* the desk lamp — base, arm, hood, and an over-bright bulb that
          flares then settles (the warning sign, then the boundary) */}
      <motion.g animate={{ y: [0, -1.2, 0] }} transition={loop(2.6)}>
        {/* weighted base on the ledge */}
        <Ink
          d={gen.ellipse(
            56,
            77,
            22,
            6,
            filled(307, '#94ac78', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        {/* lower arm */}
        <Ink d={gen.line(56, 75, 49, 60, stroke(308, { strokeWidth: 1.6 }))} />
        {/* elbow joint */}
        <Ink
          d={gen.circle(
            49,
            60,
            3.4,
            filled(309, '#788c5d', { fillStyle: 'solid' })
          )}
        />
        {/* upper arm reaching out over the edge-ward side */}
        <Ink d={gen.line(49, 60, 62, 48, stroke(310, { strokeWidth: 1.6 }))} />
        {/* lamp hood */}
        <Ink
          d={gen.path(
            'M58 50 Q62 40 72 42 L66 52 Z',
            filled(311, '#c2502e', { fillStyle: 'solid', strokeWidth: 1.3 })
          )}
        />
      </motion.g>

      {/* the bulb: pulses too-bright, then eases — recovery */}
      <motion.g
        animate={{ scale: [1, 1.22, 1], opacity: [0.85, 1, 0.85] }}
        transition={loop(2.4)}
        style={{ transformOrigin: '62px 51px' }}
      >
        <Ink
          d={gen.circle(
            62,
            51,
            6,
            filled(312, '#ffd98a', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
      </motion.g>

      {/* a few light rays spilling from the bulb */}
      <Ink
        d={gen.path(
          'M62 57 L60 62 M65 56 L66 61 M58 55 L54 59',
          stroke(313, { strokeWidth: 1, roughness: 1 })
        )}
      />
    </Frame>
  );
}
