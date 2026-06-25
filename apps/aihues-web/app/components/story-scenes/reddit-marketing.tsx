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

/* Reddit marketing — earning trust inside a community, not broadcasting ads.
   Metaphor: a warm communal hearth-ring (the subreddit) on the dusk ground,
   from which a single slow upvote-lantern rises, tethered by a thin trust-thread.
   One honest contribution, lifted by the community's glow. Seeds: 300-329. */

export default function Scene() {
  const tether = 'M100 70 Q98 58 100 44';
  return (
    <Frame sky={['#fbeede', '#f1cdb0']}>
      <defs>
        <radialGradient id='reddit-marketing_hearth' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#ffd9a6' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#ffd9a6' stopOpacity='0' />
        </radialGradient>
        <radialGradient id='reddit-marketing_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#ffe7bd' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#ffe7bd' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* dusk sky accents */}
      <Twinkle x={32} y={22} c='#e0a83f' />
      <Twinkle x={170} y={26} d={0.8} c='#cf9836' />
      <Twinkle x={150} y={14} d={1.3} c='#e0a83f' />
      <Cloud x={48} y={24} s={0.8} o={0.4} />
      <Cloud x={158} y={40} s={0.65} o={0.3} />

      {/* ground horizon for depth */}
      <Ink
        d={gen.path(
          'M0 82 Q100 76 200 82 L200 100 L0 100 Z',
          filled(300, '#e0b483', { roughness: 1.5, hachureGap: 3.4 })
        )}
      />

      {/* the communal hearth glow */}
      <circle cx='100' cy='84' r='40' fill='url(#reddit-marketing_hearth)' />

      {/* the community ring — gathered members around the fire (low arcs) */}
      <Ink
        d={gen.ellipse(
          100,
          84,
          64,
          16,
          stroke(301, { stroke: '#b06a37', strokeWidth: 1.2, roughness: 1 })
        )}
      />
      {[
        [70, 84, 0],
        [86, 88, 0.5],
        [114, 88, 1],
        [130, 84, 1.5],
      ].map(([mx, my, d], i) => (
        <motion.g
          key={mx}
          animate={{ y: [0, -0.8, 0] }}
          transition={loop(2.6, d)}
          style={{ transformOrigin: `${mx}px ${my}px` }}
        >
          <Ink
            d={gen.path(
              `M${mx} ${my - 4} a2.4 2.4 0 1 1 0.01 0 M${mx - 2.4} ${my} q2.4 -2 4.8 0`,
              filled(302 + i, '#9a6b48', { fillStyle: 'solid', strokeWidth: 1 })
            )}
          />
        </motion.g>
      ))}

      {/* the campfire flame at the centre of the ring */}
      <motion.g
        animate={{ scaleY: [1, 1.18, 1], opacity: [0.85, 1, 0.85] }}
        transition={loop(0.9)}
        style={{ transformOrigin: '100px 84px' }}
      >
        <Ink
          d={gen.path(
            'M96 84 Q98 76 100 79 Q102 73 104 84 Z',
            filled(306, '#e2693f', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
      </motion.g>

      {/* rising embers — the slow honest spread of contribution */}
      {[
        [92, 80, 0],
        [108, 78, 0.9],
        [100, 82, 1.7],
      ].map(([ex, ey, d]) => (
        <motion.circle
          key={ex}
          cx={ex}
          cy={ey}
          r='1.1'
          fill='#f0b449'
          animate={{ y: [0, -22], opacity: [0, 0.8, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeOut',
            delay: d,
          }}
        />
      ))}

      {/* trust-thread tethering the lantern to the community */}
      <motion.path
        d={tether}
        fill='none'
        stroke='#b06a37'
        strokeWidth='1'
        strokeDasharray='2 4'
        opacity='0.8'
        animate={{ strokeDashoffset: [0, -12] }}
        transition={linear(2.2)}
      />

      {/* the single upvote-lantern — one earned contribution, lifted */}
      <circle cx='100' cy='40' r='22' fill='url(#reddit-marketing_glow)' />
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={loop(3)}
        style={{ transformOrigin: '100px 40px' }}
      >
        {/* lantern body */}
        <Ink
          d={gen.path(
            'M90 42 Q90 30 100 30 Q110 30 110 42 Q110 50 100 52 Q90 50 90 42 Z',
            filled(307, '#fbe7c0', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        {/* the upvote arrow — earned karma, the brand rising */}
        <Ink
          d={gen.polygon(
            [
              [100, 33],
              [106, 41],
              [102.5, 41],
              [102.5, 47],
              [97.5, 47],
              [97.5, 41],
              [94, 41],
            ],
            filled(308, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
        {/* lantern cap */}
        <Ink
          d={gen.line(
            94,
            30,
            106,
            30,
            stroke(309, { stroke: '#b06a37', strokeWidth: 1.3 })
          )}
        />
      </motion.g>

      {/* a couple of upward sparks flanking the lantern */}
      <Twinkle x={82} y={44} d={0.4} c='#e0a83f' r={1} />
      <Twinkle x={120} y={48} d={1.1} c='#cf9836' r={1} />
    </Frame>
  );
}
