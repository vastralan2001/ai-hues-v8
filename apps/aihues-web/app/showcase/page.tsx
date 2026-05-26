import type { Metadata } from 'next';
import Link from 'next/link';

import { PageShell } from '@/components/SiteChrome';
import { toolsHref } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Showcase',
};

const showcases = [
  {
    title: 'Launch copy sprint',
    team: 'Indie SaaS',
    detail:
      'Combined headline, FAQ, cold email, and X post generators to prepare a launch kit in one afternoon.',
    tools: ['Tagline', 'FAQ', 'Cold Email', 'X Post'],
  },
  {
    title: 'Developer handoff audit',
    team: 'Product engineering',
    detail:
      'Used JSON Formatter, Regex Tester, JWT Parser, and Diff Pro to clean API examples before review.',
    tools: ['JSON', 'Regex', 'JWT', 'Diff Pro'],
  },
  {
    title: 'Content refresh week',
    team: 'Growth team',
    detail:
      'Turned rough notes into article outlines, SEO titles, meta descriptions, and newsletter copy.',
    tools: ['Blog Outline', 'SEO Title', 'Meta', 'Newsletter'],
  },
];

export default function ShowcasePage() {
  return (
    <PageShell>
      <section className='page-hero'>
        <p className='kicker'>Showcase</p>
        <h1>Real workflows built from small tools.</h1>
        <p>
          Examples of how AIHues tools can be chained together for practical
          launch, engineering, and content work.
        </p>
      </section>

      <section className='section section--compact'>
        <div className='showcase-grid'>
          {showcases.map((item) => (
            <article className='showcase-card' key={item.title}>
              <p className='kicker'>{item.team}</p>
              <h2>{item.title}</h2>
              <p>{item.detail}</p>
              <div className='tag-row'>
                {item.tools.map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className='section section--muted'>
        <div className='section__header'>
          <div>
            <p className='kicker'>Build your own</p>
            <h2>Start from the catalog</h2>
          </div>
          <Link href={toolsHref}>Browse tools</Link>
        </div>
      </section>
    </PageShell>
  );
}
