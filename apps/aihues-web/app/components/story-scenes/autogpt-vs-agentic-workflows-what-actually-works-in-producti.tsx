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
    <Frame sky={['#eef3f6', '#cfe0e6']}>
      <defs>
        <radialGradient id='agw_beacon' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3d4' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff3d4' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='agw_sea' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#a9c8d6' />
          <stop offset='100%' stopColor='#6f9bb0' />
        </linearGradient>
      </defs>

      <Twinkle x={30} y={20} c='#cf9836' />
      <Twinkle x={176} y={16} d={0.7} c='#e0a83f' />
      <Cloud x={52} y={24} s={0.8} o={0.4} />

      {/* sea — the production environment, the boats must cross it */}
      <rect x='0' y='58' width='200' height='42' fill='url(#agw_sea)' />
      <Ink
        d={gen.line(0, 58, 200, 58, {
          stroke: '#e7f3f7',
          strokeWidth: 1.2,
          roughness: 1.2,
          seed: 805,
        })}
      />

      {/* far headland + lighthouse: the goal that actually works in production */}
      <Ink
        d={gen.path(
          'M150 58 Q168 50 200 56 L200 58 Z',
          filled(801, '#9bb19a', { hachureGap: 3.6, fillWeight: 0.6 })
        )}
      />
      <circle cx='178' cy='40' r='22' fill='url(#agw_beacon)' />
      <Ink
        d={gen.polygon(
          [
            [175, 52],
            [181, 52],
            [180, 38],
            [176, 38],
          ],
          filled(802, '#eaf2f4', { fillStyle: 'solid', strokeWidth: 1.1 })
        )}
      />
      <Ink
        d={gen.rectangle(
          174.5,
          33,
          7,
          5.5,
          filled(803, '#c2502e', { fillStyle: 'solid', strokeWidth: 1 })
        )}
      />
      <motion.g
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={loop(2.2)}
        style={{ transformOrigin: '178px 35px' }}
      >
        <Ink
          d={gen.circle(
            178,
            35,
            5,
            filled(804, '#f0b449', { fillStyle: 'solid', strokeWidth: 0.8 })
          )}
        />
      </motion.g>
      {/* the beam sweeping toward the fleet */}
      <motion.g
        animate={{ opacity: [0, 0.42, 0], rotate: [-4, 6, -4] }}
        transition={loop(3.4)}
        style={{ transformOrigin: '178px 36px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [178, 36],
              [120, 30],
              [120, 42],
            ],
            filled(806, '#fff2cf', { fillStyle: 'solid', strokeWidth: 0.6 })
          )}
        />
      </motion.g>

      {/* drifting wake guidelines */}
      <RoughDash
        d='M14 70 Q70 66 120 64'
        c='#e7f3f7'
        w={1}
        dur={2.6}
        dash='2 6'
        seed={807}
        o={0.5}
      />

      {/* FLEET — eight autonomous runs. most fail. */}

      {/* sunk run #1: just a mast tip and bubbles, hull gone under */}
      <Ink d={gen.line(40, 70, 39, 65, stroke(811, { strokeWidth: 1 }))} />
      {[
        [37, 73, 0, 808],
        [44, 71, 0.8, 809],
        [41, 76, 1.5, 810],
      ].map(([bx, by, d, sd]) => (
        <motion.g
          key={bx}
          animate={{ y: [0, -9], opacity: [0, 0.55, 0] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: 'easeOut',
            delay: d,
          }}
        >
          <Ink
            d={gen.circle(bx, by, 2.2, {
              stroke: '#eaf6fb',
              strokeWidth: 0.8,
              roughness: 1.4,
              seed: sd,
            })}
          />
        </motion.g>
      ))}

      {/* capsized run #2: hull tipped past 90deg, sail in the water */}
      <motion.g
        animate={{ rotate: [128, 138, 128], y: [0, 0.6, 0] }}
        transition={loop(2.4)}
        style={{ transformOrigin: '72px 66px' }}
      >
        <Ink
          d={gen.path(
            'M64 66 L80 66 L76 71 L68 71 Z',
            filled(812, '#d8b48a', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
        <Ink
          d={gen.polygon(
            [
              [72, 66],
              [72, 52],
              [82, 65],
            ],
            filled(813, '#e2cdb0', { hachureGap: 2.4 })
          )}
        />
      </motion.g>

      {/* foundering run #3: listing badly, low in the water, bobbing hard */}
      <motion.g
        animate={{ rotate: [-24, -32, -24], y: [0, 1.4, 0] }}
        transition={loop(1.7)}
        style={{ transformOrigin: '100px 68px' }}
      >
        <Ink
          d={gen.path(
            'M91 68 L109 68 L105 73 L95 73 Z',
            filled(814, '#c9a373', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
        <Ink d={gen.line(100, 68, 100, 56, stroke(815, { strokeWidth: 1 }))} />
        <Ink
          d={gen.polygon(
            [
              [100, 56],
              [100, 67],
              [93, 66],
            ],
            filled(816, '#e8d2b4', { hachureGap: 2.6 })
          )}
        />
      </motion.g>

      {/* drifted-off-course run #4: upright but pointed the wrong way, far left & adrift */}
      <motion.g
        animate={{ y: [0, -1.6, 0], rotate: [3, -3, 3] }}
        transition={loop(2.9)}
        style={{ transformOrigin: '24px 64px' }}
      >
        <Ink
          d={gen.path(
            'M16 64 L32 64 L29 69 L19 69 Z',
            filled(817, '#cdb188', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
        <Ink d={gen.line(24, 64, 24, 53, stroke(818, { strokeWidth: 1 }))} />
        {/* sail bellied to the left — heading away from the beacon */}
        <Ink
          d={gen.polygon(
            [
              [24, 53],
              [24, 63],
              [16, 62],
            ],
            filled(819, '#94ac78', { hachureGap: 2.6 })
          )}
        />
      </motion.g>

      {/* TWO that work — clean upright hulls, sails full toward the light, leading the line */}
      <motion.g
        animate={{ y: [0, -2.4, 0] }}
        transition={loop(2.1)}
        style={{ transformOrigin: '128px 62px' }}
      >
        <Ink
          d={gen.path(
            'M120 62 L136 62 L133 67.5 L123 67.5 Z',
            filled(820, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        <Ink
          d={gen.line(128, 62, 128, 49, stroke(821, { strokeWidth: 1.2 }))}
        />
        <motion.g
          animate={{ skewX: [0, 5, 0] }}
          transition={loop(2)}
          style={{ transformOrigin: '128px 54px' }}
        >
          <Ink
            d={gen.polygon(
              [
                [128, 49],
                [128, 61],
                [137, 60],
              ],
              filled(822, '#f0b449', { fillStyle: 'solid', strokeWidth: 1.1 })
            )}
          />
        </motion.g>
        <Ink
          d={gen.path(
            'M120 67.5 Q128 71 136 67.5',
            stroke(823, { stroke: '#eaf6fb', strokeWidth: 1, roughness: 1 })
          )}
        />
      </motion.g>

      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={loop(2.4, 0.5)}
        style={{ transformOrigin: '150px 64px' }}
      >
        <Ink
          d={gen.path(
            'M143 64 L157 64 L154.5 69 L145.5 69 Z',
            filled(824, '#cf9836', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
        <Ink
          d={gen.line(150, 64, 150, 53, stroke(825, { strokeWidth: 1.1 }))}
        />
        <motion.g
          animate={{ skewX: [0, 4, 0] }}
          transition={loop(2.2, 0.3)}
          style={{ transformOrigin: '150px 57px' }}
        >
          <Ink
            d={gen.polygon(
              [
                [150, 53],
                [150, 63],
                [158, 62],
              ],
              filled(826, '#94ac78', { fillStyle: 'solid', strokeWidth: 1 })
            )}
          />
        </motion.g>
      </motion.g>

      {/* faint swell lines for sea texture */}
      <Ink
        d={gen.path(
          'M6 82 Q40 79 74 82 T142 82 T200 81',
          stroke(827, { stroke: '#e2f0f5', strokeWidth: 0.8, roughness: 1.4 })
        )}
      />
      <Ink
        d={gen.path(
          'M0 90 Q44 87 92 90 T200 89',
          stroke(828, { stroke: '#dcecf2', strokeWidth: 0.8, roughness: 1.4 })
        )}
      />
    </Frame>
  );
}
