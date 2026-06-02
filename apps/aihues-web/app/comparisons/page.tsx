import type { Metadata } from 'next';

import { PageShell } from '@/components/SiteChrome';
import { getAllReviews } from '@/lib/reviews';
import { ALL_TOOLS } from '@/lib/tool-data';
import ComparisonClient from './ComparisonClient';

export const metadata: Metadata = {
  title: 'Tool Comparisons',
  description: 'Compare AI tools side by side with 6-dimension radar charts.',
};

export default function ComparisonsPage() {
  const reviews = getAllReviews();
  const tools = ALL_TOOLS.filter((t) => !t.isExternal).slice(0, 20);

  return (
    <PageShell>
      <main className='mx-auto max-w-[1100px] px-6 py-16'>
        <div className='mb-10 text-center'>
          <h1 className='text-[32px] font-extrabold tracking-[-1px] text-[#1c1917]'>
            Tool Comparisons
          </h1>
          <p className='mx-auto mt-2 max-w-[500px] text-[15px] text-[#78716c]'>
            Select 2-4 tools to compare side by side with 6-dimension radar
            charts.
          </p>
        </div>
        <ComparisonClient reviews={reviews} tools={tools} />
      </main>
    </PageShell>
  );
}
