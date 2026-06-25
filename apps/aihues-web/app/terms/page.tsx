import type { Metadata } from 'next';

import Breadcrumb from '@/components/Breadcrumb';
import { PageShell } from '@/components/SiteChrome';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for AIHues.',
};

export default function TermsPage() {
  return (
    <PageShell>
      <main className='mx-auto max-w-[720px] px-6 py-20 md:px-7'>
        <Breadcrumb
          className='mb-8'
          items={[{ label: 'Home', href: '/' }, { label: 'Terms' }]}
        />
        <h1 className='mb-6 text-[36px] font-extrabold tracking-[-1px] text-[#1c1917]'>
          Terms of Service
        </h1>

        <div className='space-y-6 text-[16px] leading-relaxed text-[#57534e]'>
          <p>
            By using AIHues, you agree to these terms. The tools and content on
            this site are provided &quot;as is&quot; for informational and
            productivity purposes.
          </p>

          <h2 className='mt-8 text-[20px] font-bold text-[#1c1917]'>Usage</h2>
          <p>
            All built-in tools are free to use. External links redirect to
            third-party services; please review their respective terms and
            privacy policies.
          </p>

          <h2 className='mt-8 text-[20px] font-bold text-[#1c1917]'>Content</h2>
          <p>
            Blog articles and tool descriptions represent our own analysis and
            opinions. We strive for accuracy but make no warranties regarding
            completeness or timeliness.
          </p>

          <h2 className='mt-8 text-[20px] font-bold text-[#1c1917]'>Changes</h2>
          <p>
            We may update these terms at any time. Continued use of AIHues
            constitutes acceptance of the latest version.
          </p>

          <p className='pt-6 text-sm text-[#a8a29e]'>Last updated: June 2026</p>
        </div>
      </main>
    </PageShell>
  );
}
