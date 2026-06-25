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

// ── Growth — building in public: one deliberately-lit workshop window in a
//    dusk building, shutter drawn open onto an honest work-in-progress chart,
//    warm light spilling out as a trust-beam toward small distant watchers.
//    The framed open window = curated transparency; the dark windows = what you
//    keep private. Seed range 300–340; gradient ids prefixed "bip_". ──
export default function Scene() {
  return (
    <Frame sky={['#f3ecde', '#e6cfae']}>
      <defs>
        <radialGradient id='bip_dusk' cx='50%' cy='30%' r='70%'>
          <stop offset='0%' stopColor='#fbe7c8' stopOpacity='0.85' />
          <stop offset='100%' stopColor='#fbe7c8' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='bip_beam' x1='0' y1='0' x2='1' y2='0.55'>
          <stop offset='0%' stopColor='#f4c66b' stopOpacity='0.55' />
          <stop offset='100%' stopColor='#f4c66b' stopOpacity='0' />
        </linearGradient>
        <radialGradient id='bip_lit' cx='50%' cy='45%' r='60%'>
          <stop offset='0%' stopColor='#fff3d4' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff3d4' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* dusk glow + faint sky accents */}
      <rect x='0' y='0' width='200' height='100' fill='url(#bip_dusk)' />
      <Cloud x={42} y={20} s={0.8} o={0.4} />
      <Twinkle x={28} y={18} c='#cf9836' />
      <Twinkle x={176} y={16} d={0.9} c='#e0a83f' />

      {/* distant ground line for depth */}
      <Ink
        d={gen.path(
          'M0 90 Q100 86 200 90 L200 100 L0 100 Z',
          filled(300, '#d8c39c', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* the building — set right-of-centre, leaving sky breathing room left */}
      <Ink
        d={gen.rectangle(
          112,
          30,
          58,
          60,
          filled(301, '#c9b690', { hachureGap: 3.2, fillWeight: 0.6 })
        )}
      />
      {/* roof cap */}
      <Ink
        d={gen.polygon(
          [
            [110, 30],
            [141, 22],
            [172, 30],
          ],
          filled(302, '#b59a6e', { hachureGap: 3 })
        )}
      />

      {/* the dark windows — the parts you keep private */}
      {[
        [120, 40],
        [148, 40],
        [148, 58],
        [120, 76],
        [148, 76],
      ].map(([wx, wy], i) => (
        <Ink
          key={`${wx}-${wy}`}
          d={gen.rectangle(
            wx,
            wy,
            12,
            10,
            filled(310 + i, '#6f6450', {
              fillStyle: 'solid',
              strokeWidth: 1,
              roughness: 1.1,
            })
          )}
        />
      ))}

      {/* trust-beam: warm light reaching toward the small distant watchers */}
      <polygon points='120,58 120,68 40,92 40,82' fill='url(#bip_beam)' />

      {/* the lit, deliberately-opened window */}
      <circle cx='126' cy='63' r='17' fill='url(#bip_lit)' />
      <Ink
        d={gen.rectangle(
          120,
          56,
          12,
          12,
          filled(305, '#fbe6b4', { fillStyle: 'solid', strokeWidth: 1.2 })
        )}
      />
      {/* the open shutter, drawn back — gently breathing */}
      <motion.g
        animate={{ skewY: [0, 2.2, 0] }}
        transition={loop(2.8)}
        style={{ transformOrigin: '120px 62px' }}
      >
        <Ink
          d={gen.path(
            'M120 55 L114 53 L114 69 L120 67 Z',
            filled(306, '#b07a3f', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
      </motion.g>

      {/* honest work-in-progress chart on the sill — a small rising line */}
      <Ink
        d={gen.line(
          122,
          65,
          130,
          65,
          stroke(307, { stroke: '#9c8a64', strokeWidth: 0.9 })
        )}
      />
      <RoughDash
        d='M122 65 L124.5 63 L127 64 L130 59'
        c='#c2502e'
        w={1.1}
        dur={1.8}
        seed={309}
        dash='1.5 4'
      />
      {/* a small spark at the chart's leading edge */}
      <motion.g
        animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.7, 1, 0.7] }}
        transition={loop(2)}
        style={{ transformOrigin: '130px 59px' }}
      >
        <Ink
          d={gen.circle(
            130,
            59,
            2.6,
            filled(308, '#e0a83f', { fillStyle: 'solid' })
          )}
        />
      </motion.g>

      {/* the small distant watchers, gathered toward the light */}
      {[
        [42, 88, 0],
        [50, 89, 0.5],
        [58, 87, 1],
      ].map(([px, py, ph], i) => (
        <motion.g
          key={px}
          animate={{ y: [0, -0.9, 0] }}
          transition={loop(2.4, ph)}
          style={{ transformOrigin: `${px}px ${py}px` }}
        >
          <Ink
            d={gen.circle(
              px,
              py - 4,
              3,
              filled(320 + i, '#788c5d', { fillStyle: 'solid' })
            )}
          />
          <Ink
            d={gen.path(
              `M${px} ${py - 2.5} L${px} ${py + 1}`,
              stroke(330 + i, { stroke: '#788c5d', strokeWidth: 1.2 })
            )}
          />
        </motion.g>
      ))}
    </Frame>
  );
}
