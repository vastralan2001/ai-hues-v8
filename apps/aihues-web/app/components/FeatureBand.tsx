import Link from 'next/link';
import { type ReactNode } from 'react';

const BAND_GLOWS = [
  'rgba(194, 80, 46, 0.16)',
  'rgba(199, 150, 66, 0.18)',
  'rgba(176, 72, 96, 0.15)',
  'rgba(120, 90, 166, 0.15)',
  'rgba(217, 119, 87, 0.16)',
];

export default function FeatureBand({
  id,
  tone = 0,
  reverse = false,
  eyebrow,
  title,
  description,
  cta,
  meta,
  links,
  visual,
}: {
  id?: string;
  tone?: number;
  reverse?: boolean;
  eyebrow: string;
  title: ReactNode;
  description: string;
  cta?: { href: string; label: string };
  meta?: ReactNode;
  links?: { href: string; label: string }[];
  visual: ReactNode;
}) {
  const glow = BAND_GLOWS[tone % BAND_GLOWS.length];
  const glowX = reverse ? '82%' : '18%';

  return (
    <section
      className='relative isolate overflow-x-clip py-16 lg:py-24'
      id={id}
    >
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 -z-10'
        style={{
          background: `radial-gradient(58% 72% at ${glowX} 42%, ${glow}, transparent 72%)`,
        }}
      />
      <div className='w-full px-[clamp(1.5rem,5vw,7rem)]'>
        <div className='mx-auto grid w-full max-w-[1760px] items-center gap-12 lg:grid-cols-2 lg:gap-16'>
          <div
            className={`min-w-0 text-center lg:text-left ${reverse ? 'lg:order-2' : ''}`}
          >
            <div className='mb-3 text-[12px] font-extrabold uppercase tracking-[0.16em] text-accent'>
              {eyebrow}
            </div>
            <h2 className='mb-5 text-[clamp(30px,3.6vw,46px)] font-extrabold leading-[1.05] tracking-[-0.02em] text-foreground'>
              {title}
            </h2>
            <p className='mx-auto mb-6 max-w-[520px] text-[17px] leading-relaxed text-secondary lg:mx-0'>
              {description}
            </p>
            {meta}
            {links && links.length > 0 && (
              <div className='mb-8 flex flex-wrap justify-center gap-2 lg:justify-start'>
                {links.map((l) => (
                  <Link
                    className='rounded-full border border-border bg-surface px-3.5 py-1.5 text-[13px] font-semibold text-secondary no-underline transition-colors hover:border-accent hover:text-accent'
                    href={l.href}
                    key={l.label}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
            {cta && (
              <Link className='btn-cta' href={cta.href}>
                {cta.label}
              </Link>
            )}
          </div>
          <div className={`min-w-0 ${reverse ? 'lg:order-1' : ''}`}>
            {visual}
          </div>
        </div>
      </div>
    </section>
  );
}
