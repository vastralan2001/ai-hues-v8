interface PersonaPlaceholderProps {
  accent: string;
  size?: number;
  label?: string;
}

/* Reserved character slot shown until the real artwork is dropped into
   /public/personas. A soft accent disc with a neutral bust silhouette and a
   dashed ring, so an empty slot reads as intentional, not broken. */
export function PersonaPlaceholder({
  accent,
  size = 132,
  label,
}: PersonaPlaceholderProps) {
  const gid = `phs-${accent.replace('#', '')}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 200 200'
      role='img'
      aria-label={label ?? 'Character art coming soon'}
    >
      <defs>
        <radialGradient id={gid} cx='50%' cy='40%' r='62%'>
          <stop offset='0%' stopColor={`${accent}22`} />
          <stop offset='100%' stopColor='#faf9f5' />
        </radialGradient>
      </defs>
      <circle cx={100} cy={100} r={96} fill={`url(#${gid})`} />
      <circle
        cx={100}
        cy={100}
        r={92}
        fill='none'
        stroke={accent}
        strokeWidth={2}
        strokeDasharray='4 7'
        opacity={0.45}
      />
      {/* bust silhouette */}
      <g fill={accent} opacity={0.3}>
        <circle cx={100} cy={88} r={30} />
        <path d='M54 162 Q56 122 100 122 Q144 122 146 162 Z' />
      </g>
      {label && (
        <text
          x={100}
          y={186}
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
