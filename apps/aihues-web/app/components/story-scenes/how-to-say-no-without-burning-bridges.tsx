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

/* "How to say no without burning bridges": an intact rope-and-plank suspension
   bridge spanning a soft warm valley between two hills. On the near pier a small
   raised gate-arm (a polite "stop") blocks the path — yet the bridge stays whole
   and warmly lit, never aflame. A couple of embers drift up and away, fading out
   before they ever catch: the fire that is declined. The "no" is the lowered
   barrier; "without burning bridges" is the span that remains standing and lit. */

export default function Scene() {
  // suspension cable: a gentle catenary between the two hilltop piers
  const cable = 'M40 56 Q100 78 160 56';
  return (
    <Frame sky={['#fbeede', '#f1d4b4']}>
      <defs>
        <radialGradient id='nob_dusk' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#ffe9c4' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#ffe9c4' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='nob_valley' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#f4dcb6' stopOpacity='0.55' />
          <stop offset='100%' stopColor='#e6c79a' stopOpacity='0' />
        </linearGradient>
      </defs>

      {/* low warm sun glow behind the far hill */}
      <circle cx='118' cy='30' r='40' fill='url(#nob_dusk)' />
      <Twinkle x={36} y={22} c='#cf9836' />
      <Twinkle x={170} y={26} d={0.8} c='#e0a83f' />
      <Cloud x={56} y={20} s={0.78} o={0.4} />

      {/* hazy valley fill below the bridge — depth */}
      <rect x='0' y='60' width='200' height='40' fill='url(#nob_valley)' />

      {/* far ridge line, soft */}
      <Ink
        d={gen.path(
          'M0 74 Q60 64 110 70 T200 66 L200 100 L0 100 Z',
          filled(101, '#e7cda2', {
            roughness: 1.5,
            hachureGap: 4,
            fillWeight: 0.6,
          })
        )}
      />

      {/* left hilltop / near pier base */}
      <Ink
        d={gen.path(
          'M0 92 Q14 60 40 58 Q50 64 44 100 L0 100 Z',
          filled(102, '#cdb083', { hachureGap: 3.2 })
        )}
      />
      {/* right hilltop / far pier base */}
      <Ink
        d={gen.path(
          'M200 92 Q186 58 160 56 Q150 62 156 100 L200 100 Z',
          filled(103, '#c2a679', { hachureGap: 3.2 })
        )}
      />

      {/* the suspension cable (the relationship — stays unbroken) */}
      <Ink
        d={gen.path(
          cable,
          stroke(104, { stroke: '#9a6b3f', strokeWidth: 1.2 })
        )}
      />

      {/* two pier towers */}
      <Ink d={gen.line(44, 58, 44, 40, stroke(105, { strokeWidth: 1.5 }))} />
      <Ink d={gen.line(156, 56, 156, 40, stroke(106, { strokeWidth: 1.5 }))} />
      {/* cable crown looping over the towers */}
      <Ink
        d={gen.path(
          'M44 41 Q100 60 156 41',
          stroke(107, { stroke: '#9a6b3f', strokeWidth: 1 })
        )}
      />

      {/* vertical hanger ropes from crown down to the deck */}
      <Ink
        d={gen.path(
          'M60 49 L60 60 M76 53 L76 63 M92 56 L92 65 M108 56 L108 65 M124 53 L124 63 M140 49 L140 60',
          stroke(108, { stroke: '#a8855a', strokeWidth: 0.8, roughness: 1.1 })
        )}
      />

      {/* the plank deck — the bridge that is NOT burned, gently swaying */}
      <motion.g
        animate={{ rotate: [-0.6, 0.6, -0.6] }}
        transition={loop(3.4)}
        style={{ transformOrigin: '100px 64px' }}
      >
        <Ink
          d={gen.path(
            'M44 60 Q100 70 156 60',
            stroke(109, { stroke: '#8a5d34', strokeWidth: 1.3 })
          )}
        />
        <Ink
          d={gen.path(
            'M44 64 Q100 74 156 64',
            stroke(110, { stroke: '#8a5d34', strokeWidth: 1.3 })
          )}
        />
        {/* deck planks */}
        <Ink
          d={gen.path(
            'M58 60.4 L58 64.6 M72 62 L72 66.5 M86 63 L86 67.6 M100 63.4 L100 68 M114 63 L114 67.6 M128 62 L128 66.5 M142 60.4 L142 64.6',
            stroke(111, { stroke: '#a8855a', strokeWidth: 0.8, roughness: 1 })
          )}
        />
      </motion.g>

      {/* near pier post for the gate */}
      <Ink
        d={gen.rectangle(
          40,
          50,
          4,
          12,
          filled(112, '#9a6b3f', { fillStyle: 'solid', strokeWidth: 1.1 })
        )}
      />

      {/* the raised gate-arm — the polite "no" that halts without breaking */}
      <motion.g
        animate={{ rotate: [0, -7, 0] }}
        transition={loop(2.8)}
        style={{ transformOrigin: '42px 51px' }}
      >
        <Ink
          d={gen.line(
            42,
            51,
            30,
            38,
            stroke(113, { stroke: '#c2502e', strokeWidth: 1.8, roughness: 0.9 })
          )}
        />
        {/* warning bands on the arm */}
        <Ink
          d={gen.line(
            34,
            46,
            38,
            50,
            stroke(114, { stroke: '#e0a83f', strokeWidth: 1.3, roughness: 0.7 })
          )}
        />
        {/* small lantern at the arm tip — a warm, lit signal, not a flame on the bridge */}
        <Ink
          d={gen.circle(
            30,
            38,
            4,
            filled(115, '#f0b449', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
      </motion.g>

      {/* embers that drift up and AWAY, fading before they catch — fire declined */}
      {[
        [50, 56, 0, 118],
        [54, 58, 0.9, 119],
        [47, 60, 1.7, 120],
      ].map(([ex, ey, dl, sd]) => (
        <motion.g
          key={ex}
          animate={{ y: [0, -14], x: [0, -6], opacity: [0, 0.7, 0] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: 'easeOut',
            delay: dl,
          }}
        >
          <Ink
            d={gen.circle(
              ex,
              ey,
              1.8,
              filled(sd, '#e2693f', { fillStyle: 'solid', strokeWidth: 0.7 })
            )}
          />
        </motion.g>
      ))}

      {/* lone traveler on the near deck, paused at the gate */}
      <motion.g
        animate={{ y: [0, -1, 0] }}
        transition={loop(2.2)}
        style={{ transformOrigin: '54px 58px' }}
      >
        <Ink
          d={gen.circle(
            54,
            55,
            3,
            filled(116, '#788c5d', { fillStyle: 'solid' })
          )}
        />
        <Ink
          d={gen.path(
            'M54 56.5 L54 60 M54 57.5 L51.5 59 M54 57.5 L56.5 59 M54 60 L52 62.5 M54 60 L56 62.5',
            stroke(117, { strokeWidth: 1.2 })
          )}
        />
      </motion.g>
    </Frame>
  );
}
