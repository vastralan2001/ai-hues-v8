'use client';

import { useEffect } from 'react';

import { recordToolUsage } from '@/lib/tool-usage';

export function UsageTracker({ slug }: { slug: string }) {
  useEffect(() => {
    recordToolUsage(slug);
  }, [slug]);
  return null;
}
