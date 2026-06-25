import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import QuizRunner from '@/components/tests/QuizRunner';
import BrandBackdrop from '@/components/BrandBackdrop';
import Breadcrumb from '@/components/Breadcrumb';
import ShareButtons from '@/components/ShareButtons';
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
      <div className='relative isolate'>
        <BrandBackdrop />
        <section className='mx-auto w-full max-w-[1760px] px-[clamp(1.5rem,5vw,7rem)] py-10'>
          <div className='mb-8 flex items-center justify-between gap-4'>
            <Breadcrumb
              items={[
                { label: locale === 'zh' ? '首页' : 'Home', href: '/' },
                { label: locale === 'zh' ? '测评' : 'Tests', href: testsHref },
                { label: meta.name },
              ]}
            />
            <ShareButtons className='shrink-0' title={meta.name} />
          </div>
          <QuizRunner slug={slug} />
        </section>
      </div>
    </PageShell>
  );
}
