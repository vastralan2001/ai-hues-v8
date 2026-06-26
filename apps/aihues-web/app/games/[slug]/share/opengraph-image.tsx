import { ImageResponse } from 'next/og';

import { GAME_THEMES, REACT_GAMES } from '@/lib/games';

export const alt = 'AIHues game score';
export const size = { width: 1200, height: 630 };

export default async function Image({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ score?: string; text?: string }>;
}) {
  const { slug } = await params;
  const { score, text } = await (searchParams ??
    Promise.resolve({} as { score?: string; text?: string }));
  const game = REACT_GAMES[slug];
  const theme = game?.theme ? GAME_THEMES[game.theme] : null;
  const accent = theme?.glow ?? '#c2502e';
  const title = game?.title ?? 'Mini Game';
  const subtitle = text ?? (score ? `I scored ${score}` : 'Play now on AIHues');

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
        AIHues Mini Game
      </div>
      <div
        style={{
          fontSize: 80,
          fontWeight: 800,
          marginBottom: 16,
        }}
      >
        {title}
      </div>
      {score && (
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            marginBottom: 16,
            color: accent,
          }}
        >
          {score}
        </div>
      )}
      <div
        style={{
          fontSize: 40,
          fontWeight: 600,
          marginBottom: 32,
          color: '#555555',
        }}
      >
        {subtitle}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          fontSize: 24,
          color: '#999999',
        }}
      >
        aihues.com/games/{slug}
      </div>
    </div>,
    { ...size }
  );
}
