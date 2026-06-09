import type { Metadata } from 'next';
import Link from 'next/link';

import { ApiNotice, EmptyState, ToolCard } from '@/components/CatalogCards';
import { PageShell } from '@/components/SiteChrome';
import {
  safeListGames,
  safeListTools,
  toolCategories,
} from '@/lib/catalog-api';
import { gameDetailHref, toolsCategoryHref, toolsHref } from '@/lib/routes';
import { ToolIcon } from '@/components/ToolIcon';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Discover',
};

export default async function DiscoverPage() {
  const [toolsResult, gamesResult] = await Promise.all([
    safeListTools({ pageSize: 16 }),
    safeListGames({ pageSize: 3 }),
  ]);
  const tools = toolsResult.data.tools;
  const games = gamesResult.data.games;
  const trendingTools = tools.slice(0, 8);
  const newTools = tools.slice(8, 16);

  return (
    <PageShell>
      <section className='page-hero'>
        <p className='kicker'>Discovery</p>
        <h1>
          Discover <span style={{ color: 'var(--color-accent)' }}>Tools</span>
        </h1>
        <p>
          Explore live catalog entries, category paths, and game shortcuts from
          one React-rendered surface.
        </p>
      </section>

      <section className='section section--compact'>
        <div className='section__header'>
          <div>
            <p className='kicker'>Trending</p>
            <h2>Trending Tools</h2>
          </div>
          <Link href={toolsHref}>Open catalog</Link>
        </div>
        <ApiNotice error={toolsResult.error} />
        {trendingTools.length > 0 ? (
          <div className='catalog-grid'>
            {trendingTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <EmptyState
            detail='Start the catalog API to populate trending tools.'
            title='No tools loaded'
          />
        )}
      </section>

      <section className='section section--muted'>
        <div className='section__header'>
          <div>
            <p className='kicker'>New arrivals</p>
            <h2>New Arrivals</h2>
          </div>
          <Link href={toolsCategoryHref('utility')}>Utilities</Link>
        </div>
        {newTools.length > 0 ? (
          <div className='catalog-grid'>
            {newTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <EmptyState
            detail='The first catalog page is smaller than the new arrivals view.'
            title='No extra tools on this page'
          />
        )}
      </section>

      <section className='section'>
        <div className='section__header'>
          <div>
            <p className='kicker'>Categories</p>
            <h2>Browse by Category</h2>
          </div>
        </div>
        <div className='feature-grid'>
          {toolCategories
            .filter((category) => category.key !== 'all')
            .map((category) => (
              <Link
                className='feature-card'
                href={toolsCategoryHref(category.key)}
                key={category.key}
              >
                <span className='feature-card__icon'>{category.badge}</span>
                <h3>{category.label}</h3>
                <p>{category.description}</p>
              </Link>
            ))}
          {games.map((game) => (
            <Link
              className='feature-card'
              href={gameDetailHref(game.slug)}
              key={game.id}
            >
              <span className='feature-card__icon'>
                <ToolIcon slug={game.slug} size={20} />
              </span>
              <h3>{game.name}</h3>
              <p>{game.description}</p>
            </Link>
          ))}
        </div>
        <ApiNotice error={gamesResult.error} />
      </section>

      <section className='section section--compact'>
        <div className='section__header'>
          <div>
            <p className='kicker'>Guide</p>
            <h2>Not sure what to use?</h2>
          </div>
          <Link href={toolsHref}>Browse all tools</Link>
        </div>
      </section>
    </PageShell>
  );
}
