export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      height={size}
      viewBox='0 0 120 120'
      width={size}
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <linearGradient id='rb' x1='0%' x2='100%' y1='0%' y2='100%'>
          <stop offset='0%' stopColor='#dc2626' />
          <stop offset='17%' stopColor='#f59e0b' />
          <stop offset='33%' stopColor='#22c55e' />
          <stop offset='50%' stopColor='#3b82f6' />
          <stop offset='67%' stopColor='#a855f7' />
          <stop offset='83%' stopColor='#d946ef' />
          <stop offset='100%' stopColor='#ec4899' />
        </linearGradient>
      </defs>
      <path
        d='M 18 70 A 50 50 0 0 1 102 70'
        fill='none'
        opacity='0.85'
        stroke='url(#rb)'
        strokeLinecap='round'
        strokeWidth='10'
      />
      <rect fill='#d97757' height='30' rx='10' width='36' x='42' y='62' />
      <rect fill='#f59e0b' height='24' rx='8' width='28' x='46' y='38' />
      <circle cx='55' cy='50' fill='#fff' r='4' />
      <circle cx='65' cy='50' fill='#fff' r='4' />
      <circle cx='55' cy='50' fill='#1c1917' r='2' />
      <circle cx='65' cy='50' fill='#1c1917' r='2' />
      <line
        stroke='#d97757'
        strokeLinecap='round'
        strokeWidth='3'
        x1='60'
        x2='60'
        y1='38'
        y2='26'
      />
      <circle cx='60' cy='22' fill='#ec4899' r='5' />
      <ellipse
        cx='86'
        cy='74'
        fill='#f5f0e8'
        rx='12'
        ry='7'
        stroke='#d4c8b8'
        strokeWidth='1.2'
        transform='rotate(-25 86 74)'
      />
      <circle cx='82' cy='71' fill='#dc2626' r='2' />
      <circle cx='86' cy='69' fill='#f59e0b' r='2' />
      <circle cx='90' cy='72' fill='#22c55e' r='2' />
      <circle cx='88' cy='76' fill='#3b82f6' r='2' />
      <line
        stroke='#d97757'
        strokeLinecap='round'
        strokeWidth='3'
        x1='76'
        x2='82'
        y1='68'
        y2='72'
      />
      <path
        d='M54 58 Q60 62 66 58'
        fill='none'
        stroke='#1c1917'
        strokeLinecap='round'
        strokeWidth='1.8'
      />
    </svg>
  );
}
