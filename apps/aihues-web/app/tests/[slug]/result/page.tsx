import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Breadcrumb from '@/components/Breadcrumb';
import ShareButtons from '@/components/ShareButtons';
import { StoryShareCard } from '@/components/StoryShareCard';
import { PersonaAvatar, hasPersona } from '@/components/tests/PersonaAvatar';
import { TestAvatar } from '@/components/tests/TestAvatar';
import { PageShell } from '@/components/SiteChrome';
import type { Locale } from '@/lib/dict';
import { getTest } from '@/lib/tests';
import { getMbtiSummary } from '@/lib/tests/mbti';
import { getMensaSummary } from '@/lib/tests/mensa';
import { getSbinetSummary } from '@/lib/tests/sbinet';
import { getSbtiSummary } from '@/lib/tests/sbti';
import { testsHref } from '@/lib/routes';

export function generateStaticParams() {
  return ['sbti', 'mbti', 'mensa', 'sbinet'].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ code?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { code } = await searchParams;
  const config = getTest(slug);

  if (!config || !code) {
    return {
      title: config
        ? `Share ${config.name} result | AIHues`
        : 'Test result | AIHues',
    };
  }

  const summary =
    slug === 'mbti'
      ? getMbtiSummary(code)
      : slug === 'sbti'
        ? getSbtiSummary(code)
        : slug === 'mensa'
          ? getMensaSummary(code)
          : slug === 'sbinet'
            ? getSbinetSummary(code)
            : null;

  const resultName = summary
    ? 'name' in summary
      ? summary.name
      : summary.title
    : code;
  const title = `${config.name} result: ${summary?.code ?? code} — ${resultName}`;
  const description =
    summary?.blurb ?? `Check out my ${config.name} result on AIHues.`;
  const pageUrl = `https://aihues.com/tests/${slug}/result?code=${encodeURIComponent(code)}`;

  // Original, generated OG card for every test — no third-party artwork.
  const imageUrl = `/tests/${slug}/result/opengraph-image?code=${encodeURIComponent(code)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: 'website',
      images: [
        {
          url: imageUrl,
          alt: `${config.name} result for ${summary?.code ?? code}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

const TEST_THEME: Record<
  string,
  {
    sky: [string, string];
    accent?: string;
    variant?: 'day' | 'night';
    backgroundImage?: string;
  }
> = {
  sbti: {
    sky: ['#fdf4ef', '#f9e7de'],
    backgroundImage:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  },
  mbti: {
    sky: ['#f3eef8', '#e9e0f2'],
    backgroundImage:
      'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?auto=format&fit=crop&w=1200&q=80',
  },
  mensa: {
    sky: ['#f4f0fa', '#ebe4f5'],
    backgroundImage:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
  },
  sbinet: {
    sky: ['#ecf5f6', '#dfecee'],
    backgroundImage:
      'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80',
  },
};

export default async function TestResultSharePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ code?: string }>;
}) {
  const { slug } = await params;
  const { code } = await searchParams;
  const config = getTest(slug);
  if (!config || !code) notFound();

  const locale = 'en' as Locale;

  const summary =
    slug === 'mbti'
      ? getMbtiSummary(code)
      : slug === 'sbti'
        ? getSbtiSummary(code)
        : slug === 'mensa'
          ? getMensaSummary(code)
          : slug === 'sbinet'
            ? getSbinetSummary(code)
            : null;
  if (!summary) notFound();

  const accent = summary.accent;
  const name =
    'name' in summary ? (summary as { name: string }).name : summary.title;
  const shareText = `My ${config.name} result: ${summary.code} — ${name} · via AIHues`;
  const pageUrl = `https://aihues.com/tests/${slug}/result?code=${encodeURIComponent(code)}`;

  const usePersona =
    (slug === 'mbti' || slug === 'sbti') && hasPersona(summary.code);

  const media = (
    <div className='rounded-[22px] border-2 border-white bg-bg p-1 shadow-xl'>
      {usePersona ? (
        <PersonaAvatar code={summary.code} accent={accent} size={120} />
      ) : (
        <TestAvatar code={summary.code} accent={accent} size={120} />
      )}
    </div>
  );

  const tags =
    'tags' in summary && Array.isArray((summary as { tags?: string[] }).tags)
      ? (summary as { tags?: string[] }).tags
      : [];
  const matchPct =
    'matchPct' in summary
      ? (summary as { matchPct?: number }).matchPct
      : undefined;

  return (
    <PageShell variant='tests' locale={locale}>
      <section className='mx-auto min-h-[calc(100vh-140px)] max-w-[720px] px-6 py-10'>
        <Breadcrumb
          items={[
            { label: locale === 'zh' ? '首页' : 'Home', href: '/' },
            { label: locale === 'zh' ? '测评' : 'Tests', href: testsHref },
            { label: config.name, href: `/tests/${slug}` },
            { label: locale === 'zh' ? '结果' : 'Result' },
          ]}
        />

        <div className='mt-10'>
          <StoryShareCard
            seed={`test-${slug}-${summary.code}`}
            sky={TEST_THEME[slug]?.sky ?? ['#f3f1ea', '#faf9f5']}
            accent={accent}
            variant={TEST_THEME[slug]?.variant ?? 'day'}
            backgroundImage={TEST_THEME[slug]?.backgroundImage}
            eyebrow={config.name}
            title={summary.code}
            subtitle={name}
            media={media}
          >
            <div className='text-center'>
              <p className='mx-auto max-w-[480px] text-[15px] leading-relaxed text-secondary'>
                {summary.blurb}
              </p>

              {matchPct != null && (
                <div className='mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-bg px-3 py-1 text-[12px] font-bold text-secondary'>
                  <span style={{ color: accent }}>●</span>
                  {matchPct}% match
                </div>
              )}

              {tags && tags.length > 0 && (
                <div className='mt-5 flex flex-wrap justify-center gap-2'>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className='rounded-full border border-border px-3 py-1 text-[12px] font-semibold text-secondary'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className='mt-8 flex flex-col items-center gap-4'>
                <ShareButtons title={shareText} url={pageUrl} />
                <Link
                  href={`/tests/${slug}`}
                  className='inline-flex items-center rounded-[12px] px-7 py-2.5 text-[14px] font-semibold text-white transition-transform hover:-translate-y-0.5'
                  style={{ background: accent }}
                >
                  {locale === 'zh' ? '测测你的' : `Take the ${config.name}`}
                </Link>
              </div>
            </div>
          </StoryShareCard>
        </div>

        <p className='mt-6 text-center text-[12px] text-muted'>
          {locale === 'zh'
            ? '分享给你的朋友，看看他们是什么类型。'
            : 'Share with friends and compare your results.'}
        </p>
      </section>
    </PageShell>
  );
}
