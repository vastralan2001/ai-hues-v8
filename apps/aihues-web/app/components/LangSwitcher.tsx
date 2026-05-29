'use client';

import { useI18n } from '@/lib/i18n';

export function LangSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      className='rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px] font-semibold text-secondary transition-all hover:border-accent hover:text-accent'
      onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
      type='button'
    >
      {locale === 'en' ? '中文' : 'EN'}
    </button>
  );
}
