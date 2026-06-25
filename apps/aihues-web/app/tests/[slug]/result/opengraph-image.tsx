import { ImageResponse } from 'next/og';

import { getTest } from '@/lib/tests';
import { getMensaSummary } from '@/lib/tests/mensa';
import { getMbtiSummary } from '@/lib/tests/mbti';
import { getSbinetSummary } from '@/lib/tests/sbinet';
import { getSbtiSummary } from '@/lib/tests/sbti';

export const alt = 'AIHues test result';
export const size = { width: 1200, height: 630 };

function getSummary(slug: string, code: string) {
  switch (slug) {
    case 'mbti':
      return getMbtiSummary(code);
    case 'sbti':
      return getSbtiSummary(code);
    case 'mensa':
      return getMensaSummary(code);
    case 'sbinet':
      return getSbinetSummary(code);
    default:
      return null;
  }
}

export default async function Image({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ code?: string }>;
}) {
  const { slug } = await params;
  const { code } = await (searchParams ??
    Promise.resolve({} as { code?: string }));
  const config = getTest(slug);
  const summary = code ? getSummary(slug, code) : null;
  const name = summary
    ? 'name' in summary
      ? summary.name
      : summary.title
    : (config?.name ?? 'Test result');
  const accent = summary?.accent ?? '#c2502e';

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f3f1ea 0%, #faf9f5 100%)',
        fontFamily: 'sans-serif',
        color: '#1a1a1a',
        padding: 64,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          fontSize: 28,
          color: '#888888',
          marginBottom: 24,
        }}
      >
        {config?.name ?? 'AIHues Test'}
      </div>
      <div
        style={{
          fontSize: 96,
          fontWeight: 800,
          marginBottom: 16,
        }}
      >
        {summary?.code ?? code ?? 'Result'}
      </div>
      <div
        style={{
          fontSize: 44,
          fontWeight: 600,
          marginBottom: 32,
          color: accent,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontSize: 28,
          lineHeight: 1.4,
          textAlign: 'center',
          maxWidth: 900,
          color: '#555555',
        }}
      >
        {summary?.blurb ?? 'Take the test and share your result.'}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          fontSize: 24,
          color: '#999999',
        }}
      >
        aihues.com
      </div>
    </div>,
    { ...size }
  );
}
