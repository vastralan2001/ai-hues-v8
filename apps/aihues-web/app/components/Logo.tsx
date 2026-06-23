/* AIHues brand mark — a designer's swatch fan. Five rounded blades pivot
   from a single point and sweep a warm-to-cool hue range
   (accent → amber → olive → teal → violet), making "hues" the whole idea. */
const BLADES: { angle: number; fill: string }[] = [
  { angle: -36, fill: '#c2502e' },
  { angle: -18, fill: '#d68a3e' },
  { angle: 0, fill: '#7f8c5d' },
  { angle: 18, fill: '#3f7d8c' },
  { angle: 36, fill: '#785aa6' },
];

const PIVOT_X = 60;
const PIVOT_Y = 92;

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      aria-hidden='true'
      height={size}
      viewBox='0 0 120 120'
      width={size}
      xmlns='http://www.w3.org/2000/svg'
    >
      {BLADES.map((b) => (
        <rect
          key={b.angle}
          fill={b.fill}
          height='62'
          rx='7'
          transform={`rotate(${b.angle} ${PIVOT_X} ${PIVOT_Y})`}
          width='14'
          x={PIVOT_X - 7}
          y={PIVOT_Y - 60}
        />
      ))}
      <circle cx={PIVOT_X} cy={PIVOT_Y} fill='#1a1a19' r='7' />
      <circle cx={PIVOT_X} cy={PIVOT_Y} fill='#faf9f5' r='2.5' />
    </svg>
  );
}
