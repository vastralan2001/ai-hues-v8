'use client';

import { useEffect } from 'react';

import { recordToolUsage } from '@/lib/tool-usage';
import { event, GA_EVENTS } from '@/lib/gtag';

export function UsageTracker({ slug }: { slug: string }) {
  useEffect(() => {
    recordToolUsage(slug);
    event(GA_EVENTS.toolUse, { tool: slug });
  }, [slug]);
  return null;
}
