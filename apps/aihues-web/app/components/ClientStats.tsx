'use client';

import { useMemo } from 'react';

import { useI18n } from '@/lib/i18n';

export function ClientFreeCredits() {
  const credits = useMemo(() => {
    if (typeof window === 'undefined') return '—';
    const raw = localStorage.getItem('aihues-credits');
    return raw ? parseInt(raw, 10) : 100;
  }, []);
  return <>{credits}</>;
}

export function ClientDayStreak() {
  const { locale } = useI18n();
  const streak = useMemo(() => {
    if (typeof window === 'undefined') return '—';
    const raw = localStorage.getItem('aihues-checkin-streak');
    return raw ? parseInt(raw, 10) : 0;
  }, []);
  return (
    <>
      {streak} {locale === 'zh' ? '天' : streak === 1 ? 'day' : 'days'}
    </>
  );
}
