import { SceneHeader } from './SceneHeader';

export interface StoryShareCardProps {
  seed: string;
  sky: [string, string];
  accent?: string;
  variant?: 'day' | 'night';
  /** Optional photographic background for the scene header. */
  backgroundImage?: string;
  /** Eyebrow label above the title. */
  eyebrow?: string;
  /** Main title. */
  title: string;
  /** Subtitle / description. */
  subtitle?: string;
  /** Highlight media (avatar, score, image) rendered under the title. */
  media?: React.ReactNode;
  children?: React.ReactNode;
}

export function StoryShareCard({
  seed,
  sky,
  accent = '#c2502e',
  variant = 'day',
  backgroundImage,
  eyebrow,
  title,
  subtitle,
  media,
  children,
}: StoryShareCardProps) {
  return (
    <div className='overflow-hidden rounded-[24px] border border-border bg-surface shadow-sm'>
      <SceneHeader
        seed={seed}
        sky={sky}
        accent={accent}
        variant={variant}
        backgroundImage={backgroundImage}
      />

      <div className='relative -mt-8 px-6 pb-8 pt-0 text-center sm:px-8'>
        <div className='relative z-10 -mt-14 mb-5 flex justify-center'>
          {media}
        </div>

        {eyebrow && (
          <div
            className='mb-3 inline-block rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em]'
            style={{ color: accent, background: `${accent}14` }}
          >
            {eyebrow}
          </div>
        )}

        <h1 className='text-[clamp(28px,5vw,42px)] font-black leading-[1.05] tracking-[-0.02em] text-foreground'>
          {title}
        </h1>

        {subtitle && (
          <p className='mx-auto mt-3 max-w-[460px] text-[15px] leading-relaxed text-secondary'>
            {subtitle}
          </p>
        )}

        {children && <div className='mt-6 text-left'>{children}</div>}
      </div>
    </div>
  );
}
