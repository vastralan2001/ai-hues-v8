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

export default function Scene() {
  return (
    <Frame sky={['#fcf3e6', '#f4dcc4']}>
      <defs>
        <radialGradient id='viral_gem' cx='50%' cy='40%' r='60%'>
          <stop offset='0%' stopColor='#fbe7c5' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#fbe7c5' stopOpacity='0' />
        </radialGradient>
      </defs>

      <Twinkle x={28} y={20} c='#cf9836' />
      <Cloud x={44} y={22} s={0.78} o={0.4} />

      {/* soft ground band for depth */}
      <Ink
        d={gen.path(
          'M0 88 Q100 82 200 88 L200 100 L0 100 Z',
          filled(301, '#e7c79b', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* the free tool — a horseshoe magnet up on the left, the attractor */}
      <motion.g
        animate={{ rotate: [-4, 4, -4] }}
        transition={loop(3)}
        style={{ transformOrigin: '66px 42px' }}
      >
        <Ink
          d={gen.path(
            'M52 50 L52 36 A14 14 0 0 1 80 36 L80 50 L72 50 L72 36 A6 6 0 0 0 60 36 L60 50 Z',
            filled(302, '#c2502e', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        {/* magnet pole caps */}
        <Ink
          d={gen.rectangle(
            51,
            50,
            10,
            5,
            filled(303, '#6a9bcc', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
        <Ink
          d={gen.rectangle(
            71,
            50,
            10,
            5,
            filled(304, '#94ac78', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
      </motion.g>

      {/* scattered visitor motes drifting inward toward the funnel mouth */}
      {[
        [120, 18, 0],
        [150, 30, 0.5],
        [170, 46, 1.0],
        [134, 52, 0.3],
        [160, 60, 0.8],
        [128, 36, 1.3],
      ].map(([mx, my], i) => (
        <motion.g
          key={mx}
          animate={{ x: [0, 110 - mx], y: [0, 56 - my], opacity: [0, 0.9, 0] }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: 'easeIn',
            delay: i * 0.45,
          }}
        >
          <Ink
            d={gen.circle(
              mx,
              my,
              2.6,
              filled(310 + i, '#e2693f', {
                fillStyle: 'solid',
                strokeWidth: 0.8,
              })
            )}
          />
        </motion.g>
      ))}

      {/* converging field line — qualified traffic funnelling down to the product */}
      <RoughDash
        d='M118 30 Q116 46 110 58'
        c='#cf9836'
        w={1.4}
        dur={1.6}
        seed={320}
        dash='2 6'
        o={0.7}
      />

      {/* the paid product — a single faceted gem the traffic feeds, at the base */}
      <circle cx='110' cy='66' r='22' fill='url(#viral_gem)' />
      <motion.g
        animate={{ y: [0, -2.2, 0], scale: [1, 1.05, 1] }}
        transition={loop(2.4)}
        style={{ transformOrigin: '110px 66px' }}
      >
        <Ink
          d={gen.ellipse(
            110,
            82,
            32,
            6.4,
            filled(308, INK, {
              fillStyle: 'solid',
              stroke: INK,
              strokeWidth: 0.4,
            })
          )}
        />
        <Ink
          d={gen.polygon(
            [
              [110, 54],
              [123, 62],
              [110, 80],
              [97, 62],
            ],
            filled(305, '#e0a83f', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        <Ink
          d={gen.line(
            97,
            62,
            123,
            62,
            stroke(306, { stroke: '#b78327', strokeWidth: 1 })
          )}
        />
        <Ink
          d={gen.line(
            110,
            54,
            110,
            80,
            stroke(307, { stroke: '#b78327', strokeWidth: 0.9 })
          )}
        />
      </motion.g>

      <Twinkle x={110} y={50} d={0.4} c='#fff' r={1} />
    </Frame>
  );
}
