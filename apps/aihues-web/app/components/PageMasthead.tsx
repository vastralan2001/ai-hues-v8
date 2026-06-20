import type { ReactNode } from 'react';

/* Shared masthead for the Tools / Games / Tests listing pages — one consistent
   门头. Bold Radiance display title (Dota2 energy) on a calm warm-white band
   (kimi Quiet Utility): an eyebrow tag, the title with its last word accented,
   a subtitle, an optional actions slot, and a structured stat bar. */

export function PageMasthead({
  eyebrow,
  title,
  subtitle,
  stats,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  stats?: { num: string; label: string }[];
  children?: ReactNode;
}) {
  const words = title.trim().split(' ');
  const lead = words.slice(0, -1).join(' ');
  const tail = words[words.length - 1];

  return (
    <header className='relative isolate overflow-hidden px-6 pb-10 pt-16 text-center'>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-[300px]'
        style={{
          background:
            'radial-gradient(58% 100% at 50% 0%, color-mix(in srgb, var(--color-accent) 11%, transparent), transparent 72%)',
        }}
      />
      <div className='mx-auto max-w-[860px]'>
        <span className='inline-flex items-center rounded-full border border-border bg-white/70 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-accent backdrop-blur-sm'>
          {eyebrow}
        </span>
        <h1 className='mt-5 text-[clamp(40px,6.4vw,74px)] font-extrabold leading-[1.0] tracking-[-0.03em] text-foreground'>
          {lead ? `${lead} ` : null}
          <span className='text-accent'>{tail}</span>
        </h1>
        <p className='mx-auto mt-4 max-w-[560px] text-[16px] leading-relaxed text-secondary'>
          {subtitle}
        </p>
        {children ? (
          <div className='mx-auto mt-7 w-full max-w-[620px]'>{children}</div>
        ) : null}
        {stats && stats.length > 0 ? (
          <div className='mt-9 inline-flex items-stretch divide-x divide-border overflow-hidden rounded-[14px] border border-border bg-white/55 backdrop-blur-sm'>
            {stats.map((s) => (
              <div
                key={s.label}
                className='flex flex-col items-center px-6 py-3 sm:px-8'
              >
                <span className='text-[26px] font-extrabold leading-none tracking-[-0.02em] text-foreground sm:text-[30px]'>
                  {s.num}
                </span>
                <span className='mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted'>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div
        aria-hidden='true'
        className='mx-auto mt-12 h-px w-full max-w-[1100px] bg-border'
      />
    </header>
  );
}
