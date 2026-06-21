import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import QuizRunner from '@/components/tests/QuizRunner';
import { PageShell } from '@/components/SiteChrome';
import { type Locale } from '@/lib/dict';
import { testsHref } from '@/lib/routes';
import { TEST_META } from '@/lib/tests';

export function generateStaticParams() {
  return TEST_META.map((tm) => ({ slug: tm.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = TEST_META.find((tm) => tm.slug === slug);
  if (!meta) return { title: 'Test | AIHues' };
  return { title: `${meta.name} | AIHues`, description: meta.description };
}

export default async function TestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = TEST_META.find((tm) => tm.slug === slug);
  if (!meta) notFound();

  const locale = 'en' as Locale;

  return (
    <PageShell variant='tests' locale={locale}>
      <section className='mx-auto max-w-[1100px] px-6 py-10'>
        <Link
          href={testsHref}
          className='mb-8 inline-flex items-center gap-1.5 text-[13px] font-semibold text-secondary transition-colors hover:text-accent'
        >
          ← {locale === 'zh' ? '返回测评' : 'All tests'}
        </Link>
        <QuizRunner slug={slug} />
      </section>
    </PageShell>
  );
}
