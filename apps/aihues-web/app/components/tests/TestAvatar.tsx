'use client';

interface TestAvatarProps {
  code: string;
  accent: string;
  size?: number;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function TestAvatar({ code, accent, size = 200 }: TestAvatarProps) {
  const rnd = mulberry32(hashCode(code));
  const eyeType = Math.floor(rnd() * 3); // 0 circle, 1 square, 2 diamond
  const mouthType = Math.floor(rnd() * 3); // 0 smile, 1 flat, 2 open
  const accessory = Math.floor(rnd() * 5); // none, antenna, halo, horns, cap
  const bgGlow = `${accent}33`;
  const faceFill = `${accent}18`;

  const eye = (cx: number, cy: number) => {
    if (eyeType === 0) {
      return <circle key={`c-${cx}`} cx={cx} cy={cy} r={12} fill={accent} />;
    }
    if (eyeType === 1) {
      return (
        <rect
          key={`r-${cx}`}
          x={cx - 10}
          y={cy - 10}
          width={20}
          height={20}
          rx={4}
          fill={accent}
        />
      );
    }
    return (
      <polygon
        key={`d-${cx}`}
        points={`${cx},${cy - 13} ${cx + 12},${cy + 5} ${cx - 12},${cy + 5}`}
        fill={accent}
      />
    );
  };

  let mouth: React.ReactNode = null;
  if (mouthType === 0) {
    mouth = (
      <path
        d='M 78 128 Q 100 146 122 128'
        stroke={accent}
        strokeWidth={6}
        strokeLinecap='round'
        fill='none'
      />
    );
  } else if (mouthType === 1) {
    mouth = (
      <line
        x1={82}
        y1={136}
        x2={118}
        y2={136}
        stroke={accent}
        strokeWidth={6}
        strokeLinecap='round'
      />
    );
  } else {
    mouth = <circle cx={100} cy={136} r={10} fill={accent} />;
  }

  let acc: React.ReactNode = null;
  if (accessory === 1) {
    acc = (
      <>
        <line
          x1={70}
          y1={60}
          x2={70}
          y2={35}
          stroke={accent}
          strokeWidth={5}
          strokeLinecap='round'
        />
        <circle cx={70} cy={30} r={7} fill={accent} />
      </>
    );
  } else if (accessory === 2) {
    acc = (
      <ellipse
        cx={100}
        cy={45}
        rx={40}
        ry={8}
        stroke={accent}
        strokeWidth={5}
        fill='none'
      />
    );
  } else if (accessory === 3) {
    acc = (
      <>
        <path d='M 55 65 L 48 40 L 68 55 Z' fill={accent} />
        <path d='M 145 65 L 152 40 L 132 55 Z' fill={accent} />
      </>
    );
  } else if (accessory === 4) {
    acc = (
      <path
        d='M 55 58 Q 100 25 145 58 L 145 70 Q 100 40 55 70 Z'
        fill={accent}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 200 200'
      aria-label={`${code} avatar`}
      className='rounded-full'
      style={{
        background: `radial-gradient(circle, ${bgGlow} 0%, transparent 70%)`,
      }}
    >
      <circle cx={100} cy={100} r={85} fill={faceFill} />
      <circle
        cx={100}
        cy={100}
        r={72}
        fill='none'
        stroke={accent}
        strokeWidth={3}
        opacity={0.35}
      />
      {acc}
      {eye(72, 95)}
      {eye(128, 95)}
      {mouth}
    </svg>
  );
}
