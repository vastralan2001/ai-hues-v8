import Link from 'next/link';
import { type ReactNode } from 'react';

import { FilterPills } from '@/components/FilterPills';
import { type BrandCategory, categoryThemeStyle } from '@/lib/category-brand';

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
  category,
  eyebrow,
  title,
  tagline,
  description,
  cta,
  meta,
  links,
  visual,
}: {
  id?: string;
  tone?: number;
  reverse?: boolean;
  category?: BrandCategory;
  eyebrow: string;
  title: ReactNode;
  tagline?: ReactNode;
  description: string;
  cta?: { href: string; label: string };
  meta?: ReactNode;
  links?: { href: string; label: string }[];
  visual: ReactNode;
}) {
  // A themed band recolours its whole subtree (eyebrow, links, CTA, carousel
  // dots) through --color-accent; the glow follows the same hue.
  const glow = category
    ? 'color-mix(in srgb, var(--color-accent) 18%, transparent)'
    : BAND_GLOWS[tone % BAND_GLOWS.length];
  const glowX = reverse ? '82%' : '18%';

  return (
    <section
      className='relative isolate overflow-x-clip py-16 lg:py-24'
      id={id}
      style={category ? categoryThemeStyle(category) : undefined}
    >
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 -z-10'
        style={{
          background: `radial-gradient(58% 72% at ${glowX} 42%, ${glow}, transparent 72%)`,
        }}
      />
      {/* Top + bottom fades to page bg so adjacent bands blend seamlessly */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-20'
        style={{
          background:
            'linear-gradient(to bottom, var(--color-bg), transparent)',
        }}
      />
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-20'
        style={{
          background: 'linear-gradient(to top, var(--color-bg), transparent)',
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
            <h2 className='mb-3 text-[clamp(30px,3.6vw,46px)] font-extrabold leading-[1.14] tracking-[-0.02em] text-foreground'>
              {title}
            </h2>
            {tagline ? (
              <p className='mx-auto mb-4 max-w-[520px] text-[18px] font-semibold leading-snug text-foreground/70 lg:mx-0'>
                {tagline}
              </p>
            ) : null}
            <p className='mx-auto mb-6 max-w-[520px] text-[17px] leading-relaxed text-secondary lg:mx-0'>
              {description}
            </p>
            {meta}
            {links && links.length > 0 && (
              <FilterPills
                activeKey=''
                className='mb-8 justify-center lg:justify-start'
                items={links.map((l) => ({
                  key: l.label,
                  label: l.label,
                  href: l.href,
                }))}
              />
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
