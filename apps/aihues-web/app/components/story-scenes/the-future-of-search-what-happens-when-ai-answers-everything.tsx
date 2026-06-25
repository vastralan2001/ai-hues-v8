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

/* The Future of Search — when AI answers everything, the journey down the road of
   "ten blue links" ends early: a single glowing answer-orb hovers at the near
   milepost, and the long road of source-posts recedes unwalked into the horizon. */
export default function Scene() {
  const fsq = 'fsearch';
  return (
    <Frame sky={['#eef3fa', '#d6e2f1']}>
      <defs>
        <radialGradient id={`${fsq}_orb`} cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff4dd' stopOpacity='1' />
          <stop offset='55%' stopColor='#f0b449' stopOpacity='0.55' />
          <stop offset='100%' stopColor='#f0b449' stopOpacity='0' />
        </radialGradient>
        <linearGradient id={`${fsq}_road`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#cdd9c1' stopOpacity='0.2' />
          <stop offset='100%' stopColor='#b9c8a4' stopOpacity='0.7' />
        </linearGradient>
      </defs>

      {/* sky depth */}
      <Cloud x={46} y={24} s={0.8} o={0.42} />
      <Twinkle x={30} y={20} c='#9cc3e2' />
      <Twinkle x={176} y={18} d={0.7} c='#9cc3e2' />

      {/* far ground + a low horizon ridge for depth */}
      <Ink
        d={gen.path(
          'M0 64 Q60 60 110 63 Q160 66 200 62 L200 100 L0 100 Z',
          filled(401, '#cdd9c1', {
            roughness: 1.5,
            hachureGap: 4,
            fillWeight: 0.6,
          })
        )}
      />

      {/* the road of "ten blue links": a flat plane converging to the horizon */}
      <polygon
        points='92,64 108,64 138,100 62,100'
        fill={`url(#${fsq}_road)`}
      />
      <Ink
        d={gen.path(
          'M92 64 L62 100 M108 64 L138 100',
          stroke(402, { stroke: '#8a9a6f', strokeWidth: 1.2, roughness: 1.1 })
        )}
      />
      {/* dashed centre line — the path forward, flowing away from the viewer */}
      <RoughDash
        d='M100 100 L100 64'
        c='#eef3ec'
        w={1.6}
        dur={1.8}
        seed={403}
        dash='3 5'
        o={0.85}
      />

      {/* receding source-mileposts (the unwalked blue links), small & fading toward horizon */}
      {[
        { x: 78, y: 84, h: 11, w: 8, s: 411, o: 0.95 },
        { x: 126, y: 80, h: 9, w: 7, s: 412, o: 0.85 },
        { x: 86, y: 72, h: 6, w: 5, s: 413, o: 0.6 },
        { x: 116, y: 70, h: 5, w: 4.4, s: 414, o: 0.5 },
        { x: 99, y: 66, h: 3.4, w: 3, s: 415, o: 0.34 },
      ].map((m) => (
        <g key={m.s} opacity={m.o}>
          <Ink
            d={gen.line(
              m.x,
              m.y,
              m.x,
              m.y - m.h,
              stroke(m.s, { stroke: '#7e8d63', strokeWidth: 1 })
            )}
          />
          <Ink
            d={gen.rectangle(
              m.x - m.w / 2,
              m.y - m.h - m.w * 0.6,
              m.w,
              m.w * 0.6,
              filled(m.s + 40, '#6a9bcc', {
                fillStyle: 'solid',
                strokeWidth: 1,
                roughness: 1.1,
              })
            )}
          />
        </g>
      ))}

      {/* near signpost — the crossroads where the traveller now stops */}
      <Ink d={gen.line(48, 80, 48, 50, stroke(420, { strokeWidth: 1.4 }))} />
      <motion.g
        animate={{ rotate: [0, -2.5, 0] }}
        transition={loop(3)}
        style={{ transformOrigin: '48px 53px' }}
      >
        <Ink
          d={gen.path(
            'M48 53 L36 51 L34 55 L48 57 Z',
            filled(421, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        <Ink
          d={gen.path(
            'M48 60 L60 58 L62 62 L48 64 Z',
            filled(422, '#cf9836', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
      </motion.g>

      {/* the answer-orb: arrives right at the query, glowing, replacing the journey */}
      <circle cx='150' cy='44' r='22' fill={`url(#${fsq}_orb)`} />
      <motion.g
        animate={{ scale: [0.94, 1.08, 0.94] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '150px 44px' }}
      >
        <Ink
          d={gen.circle(
            150,
            44,
            18,
            filled(430, '#f0b449', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        <Ink
          d={gen.circle(
            150,
            44,
            18,
            stroke(431, { stroke: '#fff4dd', strokeWidth: 1, roughness: 0.8 })
          )}
        />
        {/* the "answer" mark inside the orb — a single resolved checkmark, not a list */}
        <Ink
          d={gen.path(
            'M143 45 L148 50 L158 39',
            stroke(432, { stroke: '#fff7e8', strokeWidth: 1.8, roughness: 0.8 })
          )}
        />
      </motion.g>
    </Frame>
  );
}
