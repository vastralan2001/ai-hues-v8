interface PersonaPlaceholderProps {
  accent: string;
  width?: number;
  height?: number;
  label?: string;
  className?: string;
}

/* Reserved character slot shown until the real artwork is dropped into
   /public/personas. A soft accent panel with a neutral bust silhouette and a
   dashed border, so an empty slot reads as intentional, not broken. */
export function PersonaPlaceholder({
  accent,
  width = 180,
  height = 270,
  label,
  className = '',
}: PersonaPlaceholderProps) {
  const gid = `phs-${accent.replace('#', '')}`;
  const cx = width / 2;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role='img'
      aria-label={label ?? 'Character art coming soon'}
    >
      <defs>
        <linearGradient id={gid} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor={`${accent}26`} />
          <stop offset='100%' stopColor='#faf9f5' />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={width} height={height} fill={`url(#${gid})`} />
      <rect
        x={6}
        y={6}
        width={width - 12}
        height={height - 12}
        rx={16}
        fill='none'
        stroke={accent}
        strokeWidth={2}
        strokeDasharray='4 7'
        opacity={0.45}
      />
      {/* bust silhouette */}
      <g fill={accent} opacity={0.3}>
        <circle cx={cx} cy={height * 0.42} r={width * 0.2} />
        <path
          d={`M${cx - width * 0.34} ${height} Q${cx - width * 0.34} ${height * 0.66} ${cx} ${height * 0.66} Q${cx + width * 0.34} ${height * 0.66} ${cx + width * 0.34} ${height} Z`}
        />
      </g>
      {label && (
        <text
          x={cx}
          y={height - 16}
          textAnchor='middle'
          fontSize={15}
          fontWeight={800}
          fill={accent}
          opacity={0.85}
        >
          {label}
        </text>
      )}
    </svg>
  );
}
