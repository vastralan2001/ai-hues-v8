import type { Metadata } from 'next';

import { PageShell } from '@/components/SiteChrome';

export const metadata: Metadata = {
  title: 'Ranking',
};

const TOOL_RANKINGS = [
  ['#1', 'JWT Parser', '12.5k', '4.9', 'Developer'],
  ['#2', 'JSON Formatter', '10.8k', '4.8', 'Developer'],
  ['#3', 'Daily Fortune', '9.6k', '4.8', 'Games'],
  ['#4', 'Regex Tester', '8.2k', '4.7', 'Developer'],
  ['#5', 'Word Counter', '7.9k', '4.7', 'Writing'],
  ['#6', 'Lucky Slots', '6.3k', '4.6', 'Games'],
  ['#7', 'QR Code', '5.8k', '4.6', 'Developer'],
  ['#8', 'SEO Title', '5.1k', '4.5', 'AI Writing'],
] as const;

export default function RankingPage() {
  return (
    <PageShell variant='ranking'>
      <section className='page-hero ranking-hero'>
        <h1>Ranking</h1>
        <p>See the most-used tools and where you stand.</p>
        <div className='ranking-metrics'>
          <article>
            <span>My Rank</span>
            <strong>#7</strong>
          </article>
          <article>
            <span>Usage</span>
            <strong>76</strong>
            <small>Total runs</small>
          </article>
          <article>
            <span>CREDIT</span>
            <strong>380</strong>
            <small>Balance</small>
          </article>
        </div>
      </section>

      <section className='section section--compact'>
        <div
          className='segmented-control ranking-tabs'
          aria-label='Ranking tabs'
        >
          <button aria-pressed='true' type='button'>
            Tool Ranking
          </button>
          <button type='button'>User Ranking</button>
          <button type='button'>Achievements</button>
        </div>

        <div className='rank-table' role='table' aria-label='Tool ranking'>
          <div className='rank-row rank-row--head' role='row'>
            <span>Rank</span>
            <span>Tool</span>
            <span>Usage</span>
            <span>Rating</span>
            <span>Category</span>
          </div>
          {TOOL_RANKINGS.map(([rank, name, usage, rating, category]) => (
            <div className='rank-row' key={name} role='row'>
              <strong>{rank}</strong>
              <span>{name}</span>
              <span>{usage}</span>
              <span>{rating}</span>
              <span>{category}</span>
            </div>
          ))}
        </div>
      </section>

      <aside className='achievement-toast'>
        <strong>📌 Achievement Unlocked!</strong>
        <span>Collector</span>
        <small>Save 3 tools to wishlist</small>
      </aside>
    </PageShell>
  );
}
