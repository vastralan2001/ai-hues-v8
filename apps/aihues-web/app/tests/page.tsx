import type { Metadata } from 'next';
import Link from 'next/link';

import { PageMasthead } from '@/components/PageMasthead';
import { PageShell } from '@/components/SiteChrome';
import { PersonaImage } from '@/components/tests/PersonaImage';
import { ToolIcon } from '@/components/ToolIcon';
import { type Locale } from '@/lib/dict';
import { testDetailHref } from '@/lib/routes';
import { TEST_META } from '@/lib/tests';
import {
  MBTI_PERSONA_CODES,
  SBTI_PERSONA_CODES,
} from '@/lib/tests/persona-art';

export const metadata: Metadata = {
  title: 'Tests',
  description:
    'Quick, free tests and quizzes — take the MBTI, the satirical SBTI, and more.',
};

export default function TestsPage() {
  const locale = 'en' as Locale;

  return (
    <PageShell variant='tests' locale={locale}>
      <PageMasthead
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Tests' }]}
        category='tests'
        title='Tests'
        subtitle='Quick self-reflection quizzes with real question banks and shareable results.'
        features={['Real question banks', 'Shareable results', 'Just for fun']}
      />

      <section className='mx-auto w-full max-w-[1760px] px-[clamp(1.5rem,5vw,7rem)] pb-20 pt-8'>
        <div className='mx-auto grid max-w-[760px] grid-cols-1 gap-5 sm:grid-cols-2'>
          {TEST_META.map((tm) => (
            <Link
              key={tm.slug}
              href={testDetailHref(tm.slug)}
              className='card-lift relative flex flex-col rounded-[18px] border border-border bg-surface p-7 text-inherit no-underline'
            >
              <span
                className='absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white'
                style={{ background: tm.accent }}
              >
                {tm.badge}
              </span>

              <span
                className='mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] text-white'
                style={{ background: tm.accent }}
              >
                <ToolIcon slug={tm.slug} size={24} className='text-white' />
              </span>

              {(tm.slug === 'mbti' || tm.slug === 'sbti') && (
                <div className='mb-4 flex items-center'>
                  <div className='flex -space-x-2.5'>
                    {(tm.slug === 'mbti'
                      ? MBTI_PERSONA_CODES
                      : SBTI_PERSONA_CODES
                    )
                      .slice(0, 5)
                      .map((code) => (
                        <div
                          key={code}
                          className='relative h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-bg shadow-sm'
                        >
                          <PersonaImage
                            src={`/personas/${tm.slug}/${code}.png`}
                            alt={code.toUpperCase()}
                            accent={tm.accent}
                            width={36}
                            height={36}
                            placeholderLabel={code.slice(0, 2).toUpperCase()}
                            className='h-full w-full'
                          />
                        </div>
                      ))}
                  </div>
                  <span className='ml-2 text-[11px] font-semibold text-muted'>
                    +
                    {tm.slug === 'mbti'
                      ? MBTI_PERSONA_CODES.length - 5
                      : SBTI_PERSONA_CODES.length - 5}
                  </span>
                </div>
              )}

              <h2 className='text-[22px] font-extrabold text-foreground'>
                {tm.name}
              </h2>
              <p
                className='mb-2 text-[13px] font-semibold'
                style={{ color: tm.accent }}
              >
                {tm.tagline}
              </p>
              <p className='mb-5 text-[14px] leading-relaxed text-secondary'>
                {tm.description}
              </p>

              <div className='mt-auto flex items-center gap-2.5 text-[12px] font-medium text-muted'>
                <span>{tm.questionCount} questions</span>
                <span aria-hidden='true'>·</span>
                <span>~{tm.durationMin} min</span>
              </div>

              <span
                className='mt-5 inline-flex w-fit items-center rounded-[12px] px-6 py-2.5 text-[14px] font-semibold text-white transition-transform group-hover:translate-x-0.5'
                style={{ background: tm.accent }}
              >
                {locale === 'zh' ? tm.ctaZh : tm.cta}
              </span>
            </Link>
          ))}
        </div>

        <p className='mx-auto mt-8 max-w-[760px] text-center text-[12px] leading-relaxed text-muted'>
          These tests are for entertainment and self-reflection only — they are
          not clinical instruments or scientific diagnoses.
        </p>
      </section>
    </PageShell>
  );
}
