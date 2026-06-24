import type { Metadata } from 'next';

import { PageMasthead } from '@/components/PageMasthead';
import { ToolSearchForm } from '@/components/SearchForm';
import { PageShell } from '@/components/SiteChrome';
import { ToolsInfiniteList } from '@/components/ToolsInfiniteList';
import {
  getToolCategoryCounts,
  normalizeCategory,
  safeListTools,
} from '@/lib/catalog-api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    absolute: 'All Tools — AIHues',
  },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = firstParam(params.q)?.trim();
  const category = normalizeCategory(
    firstParam(params.cat) ?? firstParam(params.category)
  );
  const {
    data: { nextPageToken, tools },
  } = await safeListTools({
    category,
    pageSize: 20,
    q,
  });

  const categoryCounts = getToolCategoryCounts();
  const totalLabel =
    'Tools covering development, writing, growth, and productivity.';

  return (
    <PageShell variant='tools'>
      <PageMasthead
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Tools' }]}
        category='tools'
        title='Tools'
        subtitle={totalLabel}
        features={[
          'Instant results',
          'Runs in your browser',
          'Copy-paste ready',
        ]}
      >
        <ToolSearchForm category={category} q={q} />
      </PageMasthead>

      <section className='mx-auto w-full max-w-[1180px] px-6 pt-8'>
        <ToolsInfiniteList
          activeCategory={category}
          categoryCounts={categoryCounts}
          initialNextPageToken={nextPageToken}
          initialTools={tools}
          key={`${category}:${q ?? ''}`}
          q={q}
        />
      </section>
    </PageShell>
  );
}
