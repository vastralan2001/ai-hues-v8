/* A hand-drawn, story-scene style header for share / result cards.
   No rough.js dependency: the shapes are plain SVG with slightly irregular
   paths and warm ink outlines, evoking the old story-scenes/_kit.tsx look. */

interface SceneHeaderProps {
  /** Seed used to place decorative elements deterministically. */
  seed: string;
  /** Gradient sky colours [top, bottom]. */
  sky: [string, string];
  /** Accent colour for the sun / moon / highlights. */
  accent?: string;
  /** Day scenes get a sun; night scenes get a moon and more stars. */
  variant?: 'day' | 'night';
}

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const INK = '#5b5346';

export function SceneHeader({
  seed,
  sky,
  accent = '#c2502e',
  variant = 'day',
}: SceneHeaderProps) {
  const rnd = mulberry32(hash(seed));
  const isNight = variant === 'night';

  // deterministic stars
  const starCount = isNight ? 18 : 6;
  const stars = Array.from({ length: starCount }, (_, i) => ({
    x: Math.round(20 + rnd() * 360),
    y: Math.round(12 + rnd() * 80),
    r: 1 + rnd() * 1.4,
    o: 0.35 + rnd() * 0.55,
    key: i,
  }));

  // a couple of soft clouds
  const clouds = [
    { x: 60, y: 42, s: 1, o: 0.35 },
    { x: 280, y: 28, s: 0.8, o: 0.25 },
    { x: 180, y: 66, s: 0.6, o: 0.18 },
  ];

  const gid = `sky-${seed.replace(/[^a-z0-9]/gi, '')}`;

  return (
    <div
      className='relative w-full overflow-hidden'
      style={{ aspectRatio: '5 / 2' }}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 400 160'
        preserveAspectRatio='xMidYMid slice'
        className='h-full w-full'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <defs>
          <linearGradient id={gid} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor={sky[0]} />
            <stop offset='100%' stopColor={sky[1]} />
          </linearGradient>
          <filter id={`grain-${gid}`}>
            <feTurbulence
              type='fractalNoise'
              baseFrequency='0.8'
              numOctaves='3'
              stitchTiles='stitch'
            />
            <feColorMatrix type='saturate' values='0' />
            <feComponentTransfer>
              <feFuncA type='linear' slope='0.06' />
            </feComponentTransfer>
          </filter>
        </defs>

        <rect x='0' y='0' width='400' height='160' fill={`url(#${gid})`} />
        <rect
          x='0'
          y='0'
          width='400'
          height='160'
          fill={`url(#${gid})`}
          filter={`url(#grain-${gid})`}
          opacity={0.4}
        />

        {/* stars */}
        {stars.map((s) => (
          <g key={s.key} opacity={s.o}>
            <path
              d={`M${s.x - s.r * 2.4} ${s.y} L${s.x + s.r * 2.4} ${s.y} M${s.x} ${s.y - s.r * 2.4} L${s.x} ${s.y + s.r * 2.4}`}
              stroke={isNight ? '#fff' : INK}
              strokeWidth={0.9}
            />
          </g>
        ))}

        {/* shooting star for night */}
        {isNight && (
          <path
            d='M320 24 L352 34'
            stroke='#fff'
            strokeWidth={1.2}
            strokeDasharray='4 6'
            opacity={0.45}
          />
        )}

        {/* sun / moon */}
        {isNight ? (
          <g transform='translate(340, 36)'>
            <circle
              cx='0'
              cy='0'
              r='18'
              fill='#f6e7bb'
              stroke={INK}
              strokeWidth={1}
            />
            <circle cx='-5' cy='-4' r='3' fill={INK} opacity={0.18} />
            <circle cx='6' cy='5' r='4' fill={INK} opacity={0.14} />
            <circle cx='-3' cy='8' r='2.5' fill={INK} opacity={0.16} />
          </g>
        ) : (
          <g transform='translate(340, 40)'>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
              const rad = (a * Math.PI) / 180;
              const x1 = Math.cos(rad) * 22;
              const y1 = Math.sin(rad) * 22;
              const x2 = Math.cos(rad) * 30;
              const y2 = Math.sin(rad) * 30;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={accent}
                  strokeWidth={1.4}
                  opacity={0.7}
                />
              );
            })}
            <circle
              cx='0'
              cy='0'
              r='16'
              fill='#f6e7bb'
              stroke={INK}
              strokeWidth={1}
            />
          </g>
        )}

        {/* soft clouds */}
        {clouds.map((c, i) => (
          <g
            key={i}
            transform={`translate(${c.x} ${c.y}) scale(${c.s})`}
            opacity={c.o}
          >
            <path
              d='M-22 4 Q-10 -10 4 -4 Q16 -14 28 -2 Q40 4 34 14 H-16 Q-26 12 -22 4Z'
              fill='#fff'
              stroke={INK}
              strokeWidth={0.8}
            />
          </g>
        ))}

        {/* hills / mountains */}
        <path
          d='M0 160 L70 110 Q110 86 150 112 T280 118 T400 96 V160Z'
          fill={accent}
          opacity={0.12}
          stroke={INK}
          strokeWidth={1}
        />
        <path
          d='M0 160 L110 130 Q170 100 230 132 T400 124 V160Z'
          fill={accent}
          opacity={0.08}
          stroke={INK}
          strokeWidth={1}
        />
      </svg>
    </div>
  );
}
