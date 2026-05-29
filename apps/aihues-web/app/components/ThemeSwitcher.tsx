'use client';

import { useTheme } from '@/lib/theme';

export function ThemeSwitcher() {
  const { theme, toggle } = useTheme();

  return (
    <button
      className='flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-border bg-surface text-[16px] transition-all hover:border-accent hover:text-accent'
      onClick={toggle}
      title={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
      type='button'
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
