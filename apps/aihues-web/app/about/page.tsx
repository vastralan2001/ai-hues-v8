import type { Metadata } from 'next';

import { PageShell } from '@/components/SiteChrome';

export const metadata: Metadata = {
  title: 'About',
  description:
    'AIHues is an AI tool navigator, mini-game hub, and growth resource platform for builders and marketers.',
};

export default function AboutPage() {
  return (
    <PageShell>
      <main className='mx-auto max-w-[720px] px-6 py-20 md:px-7'>
        <h1 className='mb-6 text-[36px] font-extrabold tracking-[-1px] text-[#1c1917]'>
          About AIHues
        </h1>

        <div className='space-y-6 text-[16px] leading-relaxed text-[#57534e]'>
          <p>
            AIHues is a curated discovery platform for AI tools, lightweight
            utilities, and indie-growth resources. We believe the best way to
            find your next AI workflow is through hands-on exploration — not
            sponsored lists.
          </p>

          <h2 className='mt-8 text-[20px] font-bold text-[#1c1917]'>
            What we offer
          </h2>
          <ul className='list-disc space-y-2 pl-5'>
            <li>
              <strong>57+ interactive tools</strong> — from JSON formatters to
              AI copy generators, all free to use.
            </li>
            <li>
              <strong>3 mini-games</strong> — Daily Fortune, Lucky Slots, and
              Hoops Challenge with credit rewards.
            </li>
            <li>
              <strong>86 growth articles</strong> — battle-tested strategies for
              SEO, content, Reddit marketing, and indie dev.
            </li>
            <li>
              <strong>Curated external tools</strong> — hand-picked growth, SEO,
              and community resources with direct links.
            </li>
          </ul>

          <h2 className='mt-8 text-[20px] font-bold text-[#1c1917]'>Contact</h2>
          <p>
            Have a tool to recommend or want to collaborate? Reach out via the{' '}
            <a className='text-[#b45309] underline' href='/wishlist'>
              Wishlist
            </a>{' '}
            page or submit an idea directly.
          </p>
        </div>
      </main>
    </PageShell>
  );
}
