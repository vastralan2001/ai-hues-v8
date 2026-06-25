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

/* Cursor Editor — "10 features that change how you code". Metaphor: the blinking
   text caret as a small lighthouse-of-creation. A floating editor surface holds a
   luminous I-beam cursor that casts a soft cone of light forward; inside that cone,
   lines of code materialize ahead of the typist (faint dashed trails resolving into
   solid ink). The AI writes ahead of you. */

export default function Scene() {
  return (
    <Frame sky={['#fdf1df', '#f4d6b6']}>
      <defs>
        <radialGradient id='cur_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff4dc' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff4dc' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='cur_cone' x1='0' y1='0' x2='1' y2='0'>
          <stop offset='0%' stopColor='#ffe7b3' stopOpacity='0.85' />
          <stop offset='100%' stopColor='#ffe7b3' stopOpacity='0' />
        </linearGradient>
      </defs>

      {/* far atmosphere */}
      <Twinkle x={30} y={22} c='#cf9836' />
      <Twinkle x={176} y={24} d={0.7} c='#e0a83f' />
      <Twinkle x={150} y={16} d={1.2} c='#cf9836' r={0.9} />
      <Cloud x={44} y={70} s={0.8} o={0.4} />
      <Cloud x={158} y={78} s={0.7} o={0.32} />

      {/* low horizon band for depth */}
      <Ink
        d={gen.path(
          'M0 90 Q100 85 200 90 L200 100 L0 100 Z',
          filled(301, '#eccfa6', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* the cone of light the caret casts forward */}
      <polygon
        points='104,50 178,30 178,70'
        fill='url(#cur_cone)'
        opacity='0.9'
      />

      {/* code lines materializing ahead of the cursor inside the beam */}
      {[
        { y: 38, len: 30, dur: 1.6, dl: 0 },
        { y: 44, len: 22, dur: 1.9, dl: 0.4 },
        { y: 56, len: 26, dur: 1.7, dl: 0.7 },
        { y: 62, len: 18, dur: 2.1, dl: 0.2 },
      ].map((l, i) => (
        <motion.line
          key={l.y}
          x1={120}
          y1={l.y}
          x2={120 + l.len}
          y2={l.y}
          stroke='#c2502e'
          strokeWidth='1.6'
          strokeDasharray='2 5'
          opacity={0.55 - i * 0.06}
          animate={{
            strokeDashoffset: [0, -14],
            opacity: [0.15, 0.55 - i * 0.06, 0.15],
          }}
          transition={linear(l.dur)}
        />
      ))}

      {/* glow halo behind the editor surface */}
      <circle cx='86' cy='50' r='34' fill='url(#cur_glow)' />

      {/* floating editor surface */}
      <motion.g
        animate={{ y: [0, -2.4, 0] }}
        transition={loop(3)}
        style={{ transformOrigin: '70px 50px' }}
      >
        <ellipse cx='70' cy='78' rx='26' ry='4' fill={INK} opacity='0.1' />
        <Ink
          d={gen.rectangle(
            44,
            30,
            52,
            40,
            filled(302, '#ffffff', {
              fillStyle: 'solid',
              strokeWidth: 1.2,
              roughness: 1,
            })
          )}
        />
        {/* window header rule */}
        <Ink
          d={gen.line(
            44,
            38,
            96,
            38,
            stroke(303, { stroke: '#6a9bcc', strokeWidth: 1 })
          )}
        />
        <Ink
          d={gen.circle(
            50,
            34,
            2.4,
            filled(304, '#e2693f', { fillStyle: 'solid', strokeWidth: 0.7 })
          )}
        />
        <Ink
          d={gen.circle(
            55,
            34,
            2.4,
            filled(305, '#e0a83f', { fillStyle: 'solid', strokeWidth: 0.7 })
          )}
        />
        <Ink
          d={gen.circle(
            60,
            34,
            2.4,
            filled(306, '#94ac78', { fillStyle: 'solid', strokeWidth: 0.7 })
          )}
        />

        {/* already-written code lines (behind the caret) */}
        <Ink
          d={gen.line(
            50,
            45,
            74,
            45,
            stroke(307, { stroke: '#788c5d', strokeWidth: 1.5 })
          )}
        />
        <Ink
          d={gen.line(
            50,
            51,
            84,
            51,
            stroke(308, { stroke: '#6a9bcc', strokeWidth: 1.5 })
          )}
        />
        <Ink
          d={gen.line(
            50,
            57,
            70,
            57,
            stroke(309, { stroke: '#788c5d', strokeWidth: 1.5 })
          )}
        />
        <Ink
          d={gen.line(
            50,
            63,
            80,
            63,
            stroke(310, { stroke: '#6a9bcc', strokeWidth: 1.5 })
          )}
        />

        {/* the luminous blinking caret — the focal subject */}
        <motion.g
          animate={{ opacity: [1, 0.25, 1] }}
          transition={loop(1.1)}
          style={{ transformOrigin: '102px 50px' }}
        >
          <Ink
            d={gen.rectangle(
              100.5,
              42,
              3,
              16,
              filled(311, '#e0a83f', {
                fillStyle: 'solid',
                strokeWidth: 1.1,
                roughness: 0.8,
              })
            )}
          />
          <Ink
            d={gen.line(
              98.5,
              42,
              104.5,
              42,
              stroke(312, { stroke: '#cf9836', strokeWidth: 1.3 })
            )}
          />
          <Ink
            d={gen.line(
              98.5,
              58,
              104.5,
              58,
              stroke(313, { stroke: '#cf9836', strokeWidth: 1.3 })
            )}
          />
        </motion.g>
      </motion.g>

      {/* sparks at the bright leading edge of the beam */}
      <Twinkle x={170} y={40} d={0.3} c='#f0b449' r={1.3} />
      <Twinkle x={166} y={58} d={0.9} c='#e0a83f' r={1} />
      <Twinkle x={182} y={50} d={1.5} c='#cf9836' r={0.9} />
    </Frame>
  );
}
