'use client';

import Link from 'next/link';

import ShareButtons from '@/components/ShareButtons';
import { useGameSession } from './GameSessionProvider';

/* Light-weight game-over prompt shown inside the game stage.
   It reads the current session score and offers a one-click share link. */
export function GameOverSharePrompt() {
  const { slug, score, resetSession } = useGameSession();
  const shareUrl = `/games/${slug}/share?score=${encodeURIComponent(score)}`;
  const shareText = `I scored ${score} in ${slug.replace(/-/g, ' ')} on AIHues — can you beat it?`;

  return (
    <div className='absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 rounded-[inherit] bg-black/70 p-6 text-center backdrop-blur-sm'>
      <div className='text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/60'>
        Game Over
      </div>
      <div className='text-[clamp(36px,6vw,56px)] font-black leading-none text-white'>
        {score}
      </div>
      <div className='text-[14px] font-medium text-white/70'>
        Share your score and challenge a friend
      </div>

      <div className='flex flex-col items-center gap-3 sm:flex-row'>
        <ShareButtons
          title={shareText}
          url={`https://aihues.com${shareUrl}`}
          variant='dark'
        />
        <Link
          href={shareUrl}
          onClick={resetSession}
          className='inline-flex items-center justify-center rounded-[12px] bg-accent px-6 py-2.5 text-[14px] font-semibold text-white transition-transform hover:-translate-y-0.5'
        >
          Share score
        </Link>
      </div>

      <button
        type='button'
        onClick={resetSession}
        className='text-[13px] font-medium text-white/50 underline underline-offset-2 transition-colors hover:text-white'
      >
        Play again
      </button>
    </div>
  );
}
