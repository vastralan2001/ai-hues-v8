'use client';
import { Frame, filled, gen, Ink, INK, motion, stroke, Sun } from './_kit';

/* The hidden costs of AI writing tools: a small dollar tip above the waterline,
   a vast iceberg mass below — the costs nobody talks about. */

export default function Scene() {
  return (
    <Frame sky={['#eef4fb', '#d2e2f1']}>
      <defs>
        <linearGradient id='hc_water' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#aed3ec' />
          <stop offset='100%' stopColor='#5d99c4' />
        </linearGradient>
      </defs>
      <Sun x={150} y={26} r={6} seed={803} />
      <rect x='0' y='54' width='200' height='46' fill='url(#hc_water)' />
      <Ink
        d={gen.line(
          0,
          54,
          200,
          54,
          stroke(64, { stroke: '#eaf6ff', strokeWidth: 1.4, roughness: 1 })
        )}
      />
      <Ink
        d={gen.polygon(
          [
            [84, 54],
            [116, 54],
            [128, 80],
            [100, 96],
            [72, 80],
          ],
          filled(61, '#74acd2', { hachureGap: 3.4, fillWeight: 0.6 })
        )}
      />
      <Ink
        d={gen.polygon(
          [
            [89, 54],
            [100, 33],
            [111, 54],
          ],
          filled(62, '#eaf4fb', { fillStyle: 'solid', strokeWidth: 1.2 })
        )}
      />
      <Ink
        d={gen.circle(
          100,
          45,
          9,
          filled(63, '#f0b449', { fillStyle: 'solid' })
        )}
      />
      <text
        x='100'
        y='48'
        textAnchor='middle'
        fontSize='6'
        fontWeight='800'
        fill={INK}
      >
        $
      </text>
      {[
        [78, 84, 0, 65],
        [122, 80, 0.9, 66],
        [94, 90, 1.6, 67],
      ].map(([bx, by, d, sd]) => (
        <motion.g
          key={bx}
          animate={{ y: [0, -15], opacity: [0, 0.6, 0] }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeOut',
            delay: d,
          }}
        >
          <Ink
            d={gen.circle(
              bx,
              by,
              3.2,
              filled(sd, '#eaf6ff', { fillStyle: 'solid', strokeWidth: 0.8 })
            )}
          />
        </motion.g>
      ))}
    </Frame>
  );
}
