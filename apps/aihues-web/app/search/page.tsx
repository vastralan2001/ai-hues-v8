import type { Metadata } from 'next';

import { PageShell } from '@/components/SiteChrome';
import { type Locale } from '@/lib/dict';
import { searchGlobal } from '@/lib/search-global';

import SearchContent from './SearchContent';

export const metadata: Metadata = {
  title: 'Search',
  description:
    'Search across every AIHues tool, game, test and story in one place.',
};

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const locale = 'en' as Locale;
  const initialResults = q.trim().length >= 2 ? await searchGlobal(q) : [];

  return (
    <PageShell variant='default' locale={locale}>
      <SearchContent initialQuery={q} initialResults={initialResults} />
    </PageShell>
  );
}
