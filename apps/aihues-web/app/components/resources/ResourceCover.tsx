/* Static magazine-style cover for a resource article — no animation (per
   product direction), just a branded panel so the spotlight isn't empty. */
export function ResourceCover({
  tag,
  title,
  readTime,
}: {
  tag: string;
  title: string;
  readTime?: string;
}) {
  return (
    <div
      className='relative flex h-[244px] w-full flex-col justify-between overflow-hidden rounded-[16px] border border-border p-5 text-white'
      style={{
        background:
          'radial-gradient(135% 120% at 18% 0%, #c2502e, #7a3320 72%)',
      }}
    >
      <div className='flex items-center justify-between'>
        <span className='rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider'>
          {tag}
        </span>
        {readTime ? (
          <span className='text-[11px] text-white/70'>{readTime}</span>
        ) : null}
      </div>
      <div>
        <div className='text-[11px] font-bold uppercase tracking-[0.18em] text-white/55'>
          AIHues Journal
        </div>
        <h4 className='mt-1 line-clamp-3 text-[19px] font-extrabold leading-tight'>
          {title}
        </h4>
      </div>
      <span
        aria-hidden='true'
        className='pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10'
      />
    </div>
  );
}
