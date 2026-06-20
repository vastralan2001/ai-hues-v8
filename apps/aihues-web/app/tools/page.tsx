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
  const catCount = Object.keys(categoryCounts).filter(
    (k) => k !== 'all'
  ).length;
  const totalLabel =
    tools.length > 0
      ? `${tools.length}${nextPageToken ? '+' : ''} tools covering development, writing, growth, and productivity`
      : '58+ tools covering development, writing, growth, and productivity';

  return (
    <PageShell variant='tools'>
      <PageMasthead
        eyebrow='Tool Library'
        title='All Tools'
        subtitle={totalLabel}
        stats={[
          { num: `${categoryCounts.all}`, label: 'Tools' },
          { num: `${catCount}`, label: 'Categories' },
          { num: 'Free', label: 'Forever' },
        ]}
      >
        <ToolSearchForm category={category} q={q} />
      </PageMasthead>

      <section className='section section--compact'>
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
