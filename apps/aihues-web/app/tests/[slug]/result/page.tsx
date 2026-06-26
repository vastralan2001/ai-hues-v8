import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Breadcrumb from '@/components/Breadcrumb';
import { Wordmark } from '@/components/Logo';
import ShareButtons from '@/components/ShareButtons';
import { StoryShareCard } from '@/components/StoryShareCard';
import { PersonaImage } from '@/components/tests/PersonaImage';
import { TestAvatar } from '@/components/tests/TestAvatar';
import { PageShell } from '@/components/SiteChrome';
import type { Locale } from '@/lib/dict';
import { getTest } from '@/lib/tests';
import { getMbtiSummary } from '@/lib/tests/mbti';
import { getMensaSummary } from '@/lib/tests/mensa';
import { getSbinetSummary } from '@/lib/tests/sbinet';
import { getSbtiSummary } from '@/lib/tests/sbti';
import { hasPersonaArt, personaImageSrc } from '@/lib/tests/persona-art';
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
    variant?: 'day' | 'night';
  }
> = {
  sbti: { variant: 'day' },
  mbti: { variant: 'day' },
  mensa: { variant: 'day' },
  sbinet: { variant: 'day' },
};

/** Mix a hex colour with white by ratio `t` (0 = original, 1 = white). */
function tint(hex: string, t: number): string {
  const m = hex.replace('#', '');
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  const mix = (n: number) => Math.round(n + (255 - n) * t);
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}

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

  const usePersona = hasPersonaArt(slug);
  const personaSrc = usePersona ? personaImageSrc(slug, summary.code) : null;

  const media = usePersona ? (
    <div
      className='relative flex flex-col overflow-hidden rounded-[24px] shadow-xl'
      style={{ width: 220, background: '#fff' }}
    >
      <PersonaImage
        src={personaSrc}
        alt={`${config.name} — ${name}`}
        accent={accent}
        width={220}
        height={300}
        placeholderLabel={summary.code}
        className='h-full w-full bg-white'
      />
      <div
        className='px-4 pb-4 pt-3 text-center'
        style={{ background: accent, color: '#fff' }}
      >
        <div className='text-[18px] font-black leading-none'>
          {summary.code}
        </div>
        <div className='mt-1 text-[11px] font-semibold leading-tight opacity-90'>
          {name}
        </div>
      </div>
    </div>
  ) : (
    <div className='rounded-[22px] border-2 border-white bg-bg p-1 shadow-xl'>
      <TestAvatar code={summary.code} accent={accent} size={120} />
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

        <div className='mb-6 flex justify-center'>
          <Link href='/' className='inline-block'>
            <Wordmark />
          </Link>
        </div>

        <div className='mt-10'>
          <StoryShareCard
            seed={`test-${slug}-${summary.code}`}
            sky={[tint(accent, 0.72), tint(accent, 0.32)]}
            accent={accent}
            variant={TEST_THEME[slug]?.variant ?? 'day'}
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
