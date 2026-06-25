import type { ReactNode } from 'react';

import Breadcrumb, { type Crumb } from '@/components/Breadcrumb';
import { BrandWord } from '@/components/Logo';
import { type BrandCategory, CATEGORY_SLOGAN } from '@/lib/category-brand';
import type { Locale } from '@/lib/dict';

/* Shared masthead for the Tools / Games / Tests / Stories listing pages — one
   consistent 门头 on a calm warm-white band (kimi Quiet Utility): a plain
   display title, the category slogan, a subtitle, an optional actions slot,
   and a row of feature chips. Accent colours come from the themed <main>
   wrapper, so the whole band picks up the category hue. */

export function PageMasthead({
  breadcrumb,
  category,
  locale = 'en',
  title,
  subtitle,
  features,
  children,
}: {
  breadcrumb?: Crumb[];
  category?: BrandCategory;
  locale?: Locale;
  title: string;
  subtitle: string;
  features?: string[];
  children?: ReactNode;
}) {
  const slogan = category ? CATEGORY_SLOGAN[category] : null;

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
      {breadcrumb && breadcrumb.length > 0 ? (
        <div className='relative mx-auto mb-8 w-full max-w-[1320px] text-left'>
          <Breadcrumb items={breadcrumb} />
        </div>
      ) : null}
      <div className='mx-auto max-w-[1100px]'>
        <h1 className='text-[clamp(40px,6.4vw,74px)] font-extrabold leading-[1.0] tracking-[-0.03em] text-accent'>
          {title}
        </h1>
        {slogan ? (
          <p className='mx-auto mt-5 max-w-[880px] text-[19px] font-semibold leading-snug text-foreground'>
            <BrandWord>{slogan.primary[locale]}</BrandWord>
          </p>
        ) : null}
        <p className='mx-auto mt-4 max-w-[560px] text-[16px] leading-relaxed text-secondary'>
          {subtitle}
        </p>
        {children ? (
          <div className='mx-auto mt-7 w-full max-w-[620px]'>{children}</div>
        ) : null}
        {features && features.length > 0 ? (
          <div className='mt-8 flex flex-wrap items-center justify-center gap-2'>
            {features.map((f) => (
              <span
                key={f}
                className='inline-flex items-center gap-1.5 rounded-full border border-border bg-white/55 px-3.5 py-1.5 text-[12px] font-semibold text-secondary backdrop-blur-sm'
              >
                <span
                  aria-hidden='true'
                  className='h-1.5 w-1.5 rounded-full bg-accent'
                />
                {f}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div
        aria-hidden='true'
        className='mx-auto mt-12 h-px w-full max-w-[1320px] bg-border'
      />
    </header>
  );
}
