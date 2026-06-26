/* A landscape (16:9) preview of a test result poster, mirroring the design of
   the downloadable canvas poster (lib/tests/poster): an accent panel carrying
   the test name + code + type, and a trait bar-chart alongside. Shared by the
   Tests carousel demo and the Tests result page so the two read as the same
   artwork. Accent defaults to the live --color-accent (category theme). */
export interface PosterBar {
  label: string;
  pct: number;
}

export default function ResultPosterPreview({
  name,
  code,
  title,
  bars,
  accent = 'var(--color-accent)',
  animate = true,
  className = 'aspect-[16/9] w-full',
}: {
  name: string;
  code: string;
  title: string;
  bars: PosterBar[];
  accent?: string;
  animate?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex overflow-hidden rounded-[16px] border border-border bg-bg shadow-sm ${className}`}
    >
      {/* accent panel — name + code + type */}
      <div
        className='flex w-[42%] shrink-0 flex-col justify-between p-4'
        style={{ background: accent }}
      >
        <div className='text-[9px] font-bold uppercase tracking-[0.18em] text-white/85'>
          {name} · result
        </div>
        <div>
          <div className='text-[clamp(26px,7cqw,40px)] font-black leading-none text-white'>
            {code}
          </div>
          <div className='mt-1.5 line-clamp-2 text-[12px] font-bold leading-snug text-white/95'>
            {title}
          </div>
        </div>
      </div>

      {/* trait bars + watermark */}
      <div className='flex flex-1 flex-col justify-center gap-2 px-4 py-3'>
        <div className='text-[9px] font-bold uppercase tracking-[0.16em] text-muted'>
          Traits
        </div>
        {bars.map((b, n) => (
          <div key={b.label} className='flex items-center gap-2'>
            <span className='w-[60px] shrink-0 truncate text-[10px] text-secondary'>
              {b.label}
            </span>
            <div className='h-1.5 flex-1 overflow-hidden rounded-full bg-border'>
              <div
                className='h-full rounded-full transition-[width] duration-700 ease-out'
                style={{
                  width: animate ? `${b.pct}%` : '0%',
                  background: accent,
                  transitionDelay: `${n * 0.1}s`,
                }}
              />
            </div>
          </div>
        ))}
        <div className='mt-1 flex items-center gap-1.5 text-[9px] font-medium text-muted'>
          <span
            className='h-2 w-2 rounded-full'
            style={{ background: accent }}
          />
          AIHues · shareable poster
        </div>
      </div>
    </div>
  );
}
