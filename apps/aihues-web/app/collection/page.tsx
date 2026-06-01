import type { Metadata } from 'next';

import { ApiNotice, EmptyState, ToolCard } from '@/components/CatalogCards';
import { PageShell } from '@/components/SiteChrome';
import { safeListTools, toolCategories } from '@/lib/catalog-api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Collection',
};

// TODO(上线前): 以下为硬编码里程碑奖励，需从游戏配置 API 读取
const milestones = [
  { target: 5, reward: '50 credits' },
  { target: 10, reward: '100 credits' },
  { target: 25, reward: 'Rare badge' },
  { target: 50, reward: 'Legendary badge' },
];

export default async function CollectionPage() {
  const result = await safeListTools({ pageSize: 60 });
  const tools = result.data.tools;
  const collectedCount = tools.length;
  const goalCount = Math.max(60, collectedCount);
  const progress = Math.min(
    100,
    Math.round((collectedCount / goalCount) * 100)
  );

  return (
    <PageShell>
      <section className='page-hero'>
        <p className='kicker'>Collection</p>
        <h1>
          Collect All{' '}
          <span style={{ color: 'var(--color-accent)' }}>
            {collectedCount} Tools
          </span>
        </h1>
        <p>
          Your collection renders from CatalogService/ListTools, so only tools
          returned by the API appear here.
        </p>
        <div className='progress-panel'>
          <div className='progress-panel__bar'>
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className='progress-panel__meta'>
            <strong>
              {collectedCount} / {goalCount} collected
            </strong>
            <span>{progress}%</span>
          </div>
        </div>
      </section>

      <section className='section section--compact'>
        <div className='section__header'>
          <div>
            <p className='kicker'>Draw</p>
            <h2>Tool Gacha</h2>
          </div>
        </div>
        <div className='milestone-grid'>
          {milestones.map((milestone) => (
            <article
              className='metric-card'
              data-state={
                collectedCount >= milestone.target ? 'earned' : 'open'
              }
              key={milestone.target}
            >
              <span>{milestone.target} cards</span>
              <strong>{milestone.reward}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className='section section--muted'>
        <div className='section__header'>
          <div>
            <p className='kicker'>Cards</p>
            <h2>My Collection</h2>
          </div>
        </div>
        <ApiNotice error={result.error} />
        {tools.length > 0 ? (
          <div className='catalog-grid'>
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <EmptyState
            detail='Start aihues-api to fill the collection from the catalog.'
            title='No cards collected'
          />
        )}
      </section>

      <section className='section'>
        <div className='section__header'>
          <div>
            <p className='kicker'>Rewards</p>
            <h2>How to Earn Credits</h2>
          </div>
        </div>
        <div className='feature-grid'>
          {toolCategories
            .filter((category) => category.key !== 'all')
            .map((category) => (
              <article className='feature-card' key={category.key}>
                <span className='feature-card__icon'>{category.badge}</span>
                <h3>{category.label}</h3>
                <p>{category.description}</p>
              </article>
            ))}
        </div>
      </section>

      <section className='section section--compact'>
        <div className='section__header'>
          <div>
            <p className='kicker'>Community</p>
            <h2>Top Collectors</h2>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
