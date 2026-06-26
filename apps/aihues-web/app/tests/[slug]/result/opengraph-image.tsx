import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { getTest } from '@/lib/tests';
import { getMensaSummary } from '@/lib/tests/mensa';
import { getMbtiSummary } from '@/lib/tests/mbti';
import { getSbinetSummary } from '@/lib/tests/sbinet';
import { getSbtiSummary } from '@/lib/tests/sbti';
import { hasPersonaArt, personaImageSrc } from '@/lib/tests/persona-art';

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

function loadPersonaDataUrl(slug: string, code: string): string | null {
  if (!hasPersonaArt(slug)) return null;
  const src = personaImageSrc(slug, code);
  if (!src) return null;
  try {
    const buf = readFileSync(join(process.cwd(), 'public', src));
    return `data:image/png;base64,${buf.toString('base64')}`;
  } catch {
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
  const personaUrl = code ? loadPersonaDataUrl(slug, code) : null;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #f3f1ea 0%, #faf9f5 100%)',
        fontFamily: 'sans-serif',
        color: '#1a1a1a',
        padding: 64,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: personaUrl ? 640 : 900,
        }}
      >
        <div
          style={{
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontSize: 26,
            color: '#888888',
            marginBottom: 20,
          }}
        >
          {config?.name ?? 'AIHues Test'}
        </div>
        <div
          style={{
            fontSize: 88,
            fontWeight: 800,
            marginBottom: 12,
          }}
        >
          {summary?.code ?? code ?? 'Result'}
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 600,
            marginBottom: 24,
            color: accent,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 26,
            lineHeight: 1.4,
            color: '#555555',
          }}
        >
          {summary?.blurb ?? 'Take the test and share your result.'}
        </div>
      </div>

      {personaUrl ? (
        <div
          style={{
            width: 320,
            height: 480,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 24,
            background: `linear-gradient(180deg, ${accent}22 0%, ${accent}08 100%)`,
            overflow: 'hidden',
            marginLeft: 40,
          }}
        >
          <img
            src={personaUrl}
            alt={name}
            width={320}
            height={480}
            style={{
              width: 320,
              height: 480,
              objectFit: 'contain',
            }}
          />
        </div>
      ) : null}

      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 64,
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
