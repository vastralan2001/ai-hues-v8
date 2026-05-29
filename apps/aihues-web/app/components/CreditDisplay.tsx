'use client';

export function CreditDisplay() {
  // TODO: read from localStorage or API
  const credits = 100;

  return (
    <div className='flex items-center gap-1.5 rounded-full border border-border bg-bg px-3 py-1.5 text-[13px] font-semibold text-foreground'>
      <span className='text-[16px]'>🪙</span>
      <span>{credits}</span>
    </div>
  );
}
