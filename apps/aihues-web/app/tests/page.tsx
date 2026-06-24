import type { Metadata } from 'next';
import Link from 'next/link';

import { PageMasthead } from '@/components/PageMasthead';
import { PageShell } from '@/components/SiteChrome';
import { ToolIcon } from '@/components/ToolIcon';
import { type Locale } from '@/lib/dict';
import { testDetailHref } from '@/lib/routes';
import { TEST_META } from '@/lib/tests';

export const metadata: Metadata = {
  title: 'Tests',
  description:
    'Quick, free tests and quizzes — take the MBTI, the satirical SBTI, and more. No signup, no paywall.',
};

export default function TestsPage() {
  const locale = 'en' as Locale;

  return (
    <PageShell variant='tests' locale={locale}>
      <PageMasthead
        category='tests'
        eyebrow='Assessment Center'
        title='Quick Tests'
        subtitle={`${TEST_META.length} quick assessments. Open and take — no signup, no paywall.`}
        stats={[
          { num: `${TEST_META.length}`, label: 'Tests' },
          { num: 'No', label: 'Signup' },
          { num: 'Free', label: 'Forever' },
        ]}
      />

      <section className='mx-auto max-w-[1100px] px-6 pb-20'>
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
                Take the test →
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
