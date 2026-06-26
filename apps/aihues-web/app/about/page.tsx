import type { Metadata } from 'next';
import Link from 'next/link';

import { BrandWord } from '@/components/Logo';
import { PageMasthead } from '@/components/PageMasthead';
import { PageShell } from '@/components/SiteChrome';

export const metadata: Metadata = {
  title: 'About',
  description:
    'AIHues is an AI tool navigator, mini-game hub, and growth-story platform for builders and marketers — free, no sign-up, and themed by four content families.',
};

const FAMILIES: { name: string; blurb: string }[] = [
  {
    name: 'Helpers',
    blurb:
      'Free, interactive tools — JSON and URL utilities, hashes, image and color helpers, AI copy generators — that do the grunt work so you don’t have to.',
  },
  {
    name: 'Unwinds',
    blurb:
      'Mini-games from Chess and Snake to Daily Fortune and Lucky Slots — unwinds for when your brain feels like a fried egg, no install, just play.',
  },
  {
    name: 'Evaluations',
    blurb:
      'Quick tests with real question banks and shareable result posters — evaluations that remind you you’re more than your salary.',
  },
  {
    name: 'Stories',
    blurb:
      'Essays on AI, growth, SEO and indie development — stories that cut through the noise and the nonsense, each with its own hand-drawn cover.',
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      <PageMasthead
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'About' }]}
        title='About AIHues'
        subtitle='A calm home for AI tools, mini-games, quick tests and growth stories — free, with no sign-up.'
        features={['Free & no sign-up', 'Global search', 'Themed by family']}
      />

      <section className='mx-auto w-full max-w-[1760px] px-[clamp(1.5rem,5vw,7rem)] pb-24 pt-4'>
        <div className='mx-auto max-w-[760px] space-y-6 text-[16px] leading-relaxed text-secondary'>
          <p>
            AIHues is a curated discovery platform for AI tools, lightweight
            utilities, mini-games and indie-growth writing. The best way to find
            your next workflow is hands-on exploration — not sponsored lists —
            so everything here is free to use and runs right in your browser.
          </p>

          <h2 className='mt-10 text-[22px] font-extrabold tracking-tight text-foreground'>
            Four families, four hues
          </h2>
          <p>
            Everything sorts into the four letters of HUES, and each carries its
            own colour across the site — bands, cards, listing pages and the
            spotlight all pick up the family hue:
          </p>
          <ul className='space-y-4'>
            {FAMILIES.map((f) => (
              <li key={f.name} className='leading-relaxed'>
                <span className='text-[17px] font-extrabold text-foreground'>
                  <BrandWord>{f.name}</BrandWord>
                </span>{' '}
                — {f.blurb}
              </li>
            ))}
          </ul>

          <h2 className='mt-10 text-[22px] font-extrabold tracking-tight text-foreground'>
            What’s new
          </h2>
          <ul className='list-disc space-y-2 pl-5'>
            <li>
              <strong className='text-foreground'>Global search</strong> — one
              box, powered by semantic search, finds tools, games, tests and
              stories together, each result in its own family colour.
            </li>
            <li>
              <strong className='text-foreground'>Native story visuals</strong>{' '}
              — every article has a hand-authored, animated cover scene instead
              of stock art.
            </li>
            <li>
              <strong className='text-foreground'>Image tools</strong> —
              compress, convert and edit images entirely in your browser;
              nothing is uploaded.
            </li>
            <li>
              <strong className='text-foreground'>Live test demos</strong> — see
              a sample question, then the shareable result poster it produces.
            </li>
          </ul>

          <h2 className='mt-10 text-[22px] font-extrabold tracking-tight text-foreground'>
            Contact
          </h2>
          <p>
            Have a tool to recommend or want to collaborate? Reach out via the{' '}
            <Link
              className='font-semibold text-accent underline'
              href='/wishlist'
            >
              Wishlist
            </Link>{' '}
            page or submit an idea directly.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
