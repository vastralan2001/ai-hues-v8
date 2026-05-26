'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { CategoryPills, EmptyState, ToolCard } from '@/components/CatalogCards';
import type { CatalogTool, ToolCategoryKey } from '@/lib/catalog-api';
import { toolCategories } from '@/lib/catalog-api';
import { toolDetailHref } from '@/lib/routes';

const PAGE_SIZE = 20;

const CATEGORY_META: Record<string, { icon: string; label: string }> = {
  developer: { icon: '🔧', label: 'Developer Tools' },
  utility: { icon: '✏️', label: 'Writing Tools' },
  'ai-writing': { icon: '🤖', label: 'AI Text Tools' },
};

const NEW_TOOL_SLUGS = new Set([
  'jwt',
  'json',
  'regex',
  'uuid',
  'timestamp',
  'markdown',
  'qrcode',
  'word-count',
  'diff',
  'fullwidth',
  'readability',
  'humanize',
  'x-post',
  'seo-title',
]);

interface ListToolsResponse {
  tools?: CatalogTool[];
  nextPageToken?: string;
}

interface ToolsInfiniteListProps {
  activeCategory: ToolCategoryKey;
  initialNextPageToken: string;
  initialTools: CatalogTool[];
  q?: string;
}

export function ToolsInfiniteList({
  activeCategory,
  initialNextPageToken,
  initialTools,
  q,
}: ToolsInfiniteListProps) {
  const [tools, setTools] = useState(initialTools);
  const [nextPageToken, setNextPageToken] = useState(initialNextPageToken);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadNextPage = useCallback(async () => {
    if (!nextPageToken || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        pageSize: String(PAGE_SIZE),
        pageToken: nextPageToken,
      });
      if (q) params.set('q', q);
      if (activeCategory !== 'all') params.set('category', activeCategory);

      const response = await fetch(`/api/catalog/tools?${params.toString()}`, {
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error(`Catalog API returned HTTP ${response.status}`);
      }

      const payload = (await response.json()) as ListToolsResponse;
      const incomingTools = payload.tools ?? [];

      setTools((currentTools) => {
        const seen = new Set(currentTools.map((tool) => tool.id || tool.slug));
        const uniqueIncoming = incomingTools.filter((tool) => {
          const key = tool.id || tool.slug;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        return [...currentTools, ...uniqueIncoming];
      });
      setNextPageToken(payload.nextPageToken ?? '');
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Failed to load more tools.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, isLoading, nextPageToken, q]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (
      !sentinel ||
      !nextPageToken ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void loadNextPage();
        }
      },
      { rootMargin: '640px 0px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadNextPage, nextPageToken]);

  const isFiltered = !!(q || activeCategory !== 'all');
  const grouped = useMemo(
    () =>
      toolCategories
        .filter((category) => category.key !== 'all')
        .map((category) => ({
          key: category.key,
          meta: CATEGORY_META[category.key],
          tools: tools.filter((tool) => tool.category === category.key),
        }))
        .filter((group) => group.tools.length > 0),
    [tools]
  );

  const categoryCounts = useMemo(
    () => ({
      all: tools.length,
      developer: tools.filter((tool) => tool.category === 'developer').length,
      utility: tools.filter((tool) => tool.category === 'utility').length,
      'ai-writing': tools.filter((tool) => tool.category === 'ai-writing')
        .length,
    }),
    [tools]
  );

  const renderToolCard = (tool: CatalogTool) => (
    <ToolCard
      key={tool.id}
      showNew={NEW_TOOL_SLUGS.has(tool.slug)}
      tool={tool}
    />
  );

  return (
    <>
      <CategoryPills active={activeCategory} counts={categoryCounts} q={q} />

      {isFiltered ? (
        <>
          <div className='list-meta'>
            <span>
              {tools.length} tool{tools.length !== 1 ? 's' : ''}
              {q ? ` matching "${q}"` : ''}
            </span>
          </div>
          {tools.length > 0 ? (
            <div className='catalog-grid'>{tools.map(renderToolCard)}</div>
          ) : (
            <EmptyState
              detail='Try another search term or clear the category filter.'
              title='No matching tools'
            />
          )}
        </>
      ) : (
        grouped.map(({ key, meta, tools: groupTools }) => (
          <div className='tools-section' key={key}>
            <div className='tools-section__header'>
              <h2>
                {meta?.icon}&nbsp;{meta?.label ?? key}
              </h2>
              <span className='tools-section__count'>
                {groupTools.length} tools
              </span>
            </div>
            {key === 'ai-writing' ? (
              <div className='ai-text-grid'>
                {groupTools.map((tool) => (
                  <a
                    className='ai-text-link'
                    href={toolDetailHref(tool.slug)}
                    key={tool.id}
                  >
                    <span>{tool.icon}</span>
                    {tool.name}
                  </a>
                ))}
              </div>
            ) : (
              <div className='catalog-grid'>
                {groupTools.map(renderToolCard)}
              </div>
            )}
          </div>
        ))
      )}

      <div className='infinite-load-sentinel' ref={sentinelRef}>
        {nextPageToken ? (
          <button
            className='load-more-button'
            disabled={isLoading}
            onClick={() => void loadNextPage()}
            type='button'
          >
            {isLoading ? 'Loading more tools...' : 'Load more'}
          </button>
        ) : tools.length > 0 ? (
          <span>All tools loaded.</span>
        ) : null}
        {error ? <strong>{error}</strong> : null}
      </div>
    </>
  );
}
