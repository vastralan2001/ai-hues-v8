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

/* How to Evaluate AI Tools — stop demoing, start measuring.
   Metaphor: a quiet balance scale weighing two AI "tool" discs against each
   other, settling to a measured verdict, beside a tall calibrated gauge whose
   needle climbs the criteria ticks. Judgment by scorecard, not by demo. */

export default function Scene() {
  return (
    <Frame sky={['#fbf4e6', '#f0e2c4']}>
      <defs>
        <radialGradient id='eval_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff5dc' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff5dc' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='eval_gauge' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#f6e7bb' />
          <stop offset='100%' stopColor='#e8d099' />
        </linearGradient>
      </defs>

      {/* atmosphere */}
      <circle cx='150' cy='30' r='44' fill='url(#eval_glow)' />
      <Cloud x={44} y={26} s={0.78} o={0.4} />
      <Twinkle x={30} y={22} c='#cf9836' />
      <Twinkle x={176} y={20} d={0.7} c='#e0a83f' />

      {/* desk / ground line for depth */}
      <Ink
        d={gen.path(
          'M0 86 Q100 81 200 86 L200 100 L0 100 Z',
          filled(201, '#e6d2a4', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />
      <Ink d={gen.line(0, 86, 200, 86, stroke(202, { strokeWidth: 0.9 }))} />

      {/* ── tall calibrated gauge (the scorecard / yardstick) ── */}
      <Ink
        d={gen.rectangle(
          150,
          30,
          11,
          56,
          filled(203, 'url(#eval_gauge)', {
            fillStyle: 'solid',
            strokeWidth: 1.2,
            roughness: 1,
          })
        )}
      />
      {/* tick marks along the gauge */}
      {[38, 46, 54, 62, 70, 78].map((ty, i) => (
        <Ink
          key={ty}
          d={gen.line(
            150,
            ty,
            i % 2 === 0 ? 158 : 155,
            ty,
            stroke(210 + i, { strokeWidth: 0.9, roughness: 0.8 })
          )}
        />
      ))}
      {/* needle climbing toward a measured high mark */}
      <motion.g
        animate={{ rotate: [4, -3, 4] }}
        transition={loop(3)}
        style={{ transformOrigin: '150px 60px' }}
      >
        <Ink
          d={gen.line(
            150,
            60,
            168,
            44,
            stroke(220, { strokeWidth: 1.5, stroke: '#c2502e' })
          )}
        />
        <Ink
          d={gen.circle(
            150,
            60,
            4,
            filled(221, '#e2693f', { fillStyle: 'solid' })
          )}
        />
      </motion.g>

      {/* ── the balance scale (focal subject) ── */}
      {/* central post on its base */}
      <Ink
        d={gen.polygon(
          [
            [62, 84],
            [86, 84],
            [80, 78],
            [68, 78],
          ],
          filled(230, '#94ac78', { hachureGap: 2.4 })
        )}
      />
      <Ink d={gen.line(74, 78, 74, 44, stroke(231, { strokeWidth: 1.4 }))} />

      {/* the beam + pans tilt slowly toward a verdict */}
      <motion.g
        animate={{ rotate: [-5, 5, -5] }}
        transition={loop(3.4)}
        style={{ transformOrigin: '74px 44px' }}
      >
        {/* beam */}
        <Ink d={gen.line(48, 44, 100, 44, stroke(232, { strokeWidth: 1.5 }))} />
        <Ink
          d={gen.circle(
            74,
            44,
            3.4,
            filled(233, '#e0a83f', { fillStyle: 'solid' })
          )}
        />
        {/* left hanger + pan + tool disc */}
        <Ink d={gen.line(48, 44, 44, 58, stroke(234, { strokeWidth: 0.9 }))} />
        <Ink d={gen.line(48, 44, 52, 58, stroke(235, { strokeWidth: 0.9 }))} />
        <Ink
          d={gen.path('M40 58 Q48 66 56 58', stroke(236, { strokeWidth: 1.2 }))}
        />
        <Ink
          d={gen.circle(48, 56, 8, filled(237, '#6a9bcc', { hachureGap: 2.2 }))}
        />
        {/* right hanger + pan + tool disc */}
        <Ink d={gen.line(100, 44, 96, 58, stroke(238, { strokeWidth: 0.9 }))} />
        <Ink
          d={gen.line(100, 44, 104, 58, stroke(239, { strokeWidth: 0.9 }))}
        />
        <Ink
          d={gen.path(
            'M92 58 Q100 66 108 58',
            stroke(240, { strokeWidth: 1.2 })
          )}
        />
        <Ink
          d={gen.circle(
            100,
            56,
            8,
            filled(241, '#c2502e', { hachureGap: 2.2 })
          )}
        />
      </motion.g>

      {/* a measured checkmark settling above the scale */}
      <motion.g
        animate={{ scale: [0.9, 1.08, 0.9], opacity: [0.7, 1, 0.7] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '74px 26px' }}
      >
        <Ink
          d={gen.path(
            'M70 26 L73 30 L79 22',
            stroke(242, { strokeWidth: 1.8, stroke: '#788c5d', roughness: 0.9 })
          )}
        />
      </motion.g>

      {/* faint dashed sightline from scale to the gauge mark (measuring) */}
      <RoughDash
        d='M108 52 Q132 50 150 50'
        c='#cf9836'
        w={1}
        dur={1.8}
        dash='2 5'
        o={0.65}
        seed={243}
      />
    </Frame>
  );
}
