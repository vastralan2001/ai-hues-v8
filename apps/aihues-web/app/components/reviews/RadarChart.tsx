'use client';

interface RadarChartProps {
  data: number[];
  labels: string[];
  size?: number;
  primaryColor?: string;
}

export default function RadarChart({
  data,
  labels,
  size = 200,
  primaryColor = '#b45309',
}: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const count = data.length;
  const angleStep = (Math.PI * 2) / count;

  const point = (i: number, r: number) => {
    const angle = i * angleStep - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  const pathData =
    data
      .map((v, i) => {
        const [x, y] = point(i, (v / 5) * radius);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ') + ' Z';

  return (
    <svg height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
      {/* Background grids */}
      {[1, 2, 3, 4, 5].map((level) => (
        <polygon
          fill='none'
          key={level}
          points={Array.from({ length: count }, (_, i) => {
            const [x, y] = point(i, (level / 5) * radius);
            return `${x},${y}`;
          }).join(' ')}
          stroke='#e7e5e4'
          strokeWidth={0.5}
        />
      ))}
      {/* Axis lines */}
      {Array.from({ length: count }, (_, i) => {
        const [x, y] = point(i, radius);
        return (
          <line
            key={i}
            stroke='#e7e5e4'
            strokeWidth={0.5}
            x1={cx}
            x2={x}
            y1={cy}
            y2={y}
          />
        );
      })}
      {/* Data area */}
      <path
        d={pathData}
        fill={primaryColor + '20'}
        stroke={primaryColor}
        strokeWidth={2}
      />
      {/* Data points */}
      {data.map((v, i) => {
        const [x, y] = point(i, (v / 5) * radius);
        return <circle cx={x} cy={y} fill={primaryColor} key={i} r={3} />;
      })}
      {/* Labels */}
      {labels.map((label, i) => {
        const [x, y] = point(i, radius + 18);
        return (
          <text
            fill='#57534e'
            fontSize={10}
            fontWeight={600}
            key={i}
            textAnchor='middle'
            x={x}
            y={y + 4}
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}
