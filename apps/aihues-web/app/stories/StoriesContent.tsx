'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import NewsletterSubscribe from '@/components/NewsletterSubscribe';
import { FilterPills } from '@/components/FilterPills';
import { PageMasthead } from '@/components/PageMasthead';
import { SearchBox } from '@/components/SearchBox';
import { StoryArt } from '@/components/StoryArt';
import type { ResourcePost } from '@/lib/resources-data';

const POSTS_PER_PAGE = 12;

interface Props {
  initialPosts: ResourcePost[];
  initialTag?: string;
  initialPage?: number;
}

export default function StoriesContent({
  initialPosts,
  initialTag,
  initialPage,
}: Props) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>(
    initialTag && initialPosts.some((p) => p.tag === initialTag)
      ? initialTag
      : 'All'
  );
  const [currentPage, setCurrentPage] = useState(initialPage ?? 1);

  const allTags = useMemo(() => {
    const tags = Array.from(new Set(initialPosts.map((p) => p.tag)));
    return ['All', ...tags.sort()];
  }, [initialPosts]);

  const filteredPosts = useMemo(() => {
    let posts = initialPosts;

    if (activeTag !== 'All') {
      posts = posts.filter((post) => post.tag === activeTag);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.tag.toLowerCase().includes(q)
      );
    }

    return posts;
  }, [query, activeTag, initialPosts]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  // `page` is currentPage clamped to the valid range, so a shared ?page that is
  // too large for the current filter still shows the last page, not an empty grid.
  const page = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
  const start = (page - 1) * POSTS_PER_PAGE;
  const pagePosts = filteredPosts.slice(start, start + POSTS_PER_PAGE);

  // Reserve a fixed width for the page-number group so the first/prev/next/last
  // buttons keep their position as the visible numbers change.
  const visibleSlots = Math.min(Math.max(totalPages, 1), 7);
  const pageBarWidth = visibleSlots * 40 + (visibleSlots - 1) * 6;

  // Navigate to a page: clamp, set state, and reflect it in ?page= (no reload).
  function goTo(p: number) {
    const next = Math.min(Math.max(1, p), totalPages || 1);
    setCurrentPage(next);
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (next <= 1) params.delete('page');
    else params.set('page', String(next));
    const qs = params.toString();
    window.history.replaceState(
      null,
      '',
      qs ? `?${qs}` : window.location.pathname
    );
  }

  return (
    <>
      <PageMasthead
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Stories' }]}
        category='stories'
        title='Stories'
        subtitle='Growth strategies, AI tool reviews, and battle-tested indie-dev tips.'
        features={['AI & growth', 'Indie dev', 'Practical playbooks']}
      >
        <SearchBox
          ariaLabel='Search articles'
          onChange={(v) => {
            setQuery(v);
            goTo(1);
          }}
          placeholder='Search articles by title, topic, or keyword...'
          value={query}
        />
      </PageMasthead>

      <section className='mx-auto max-w-[1320px] px-6 pb-20 md:px-7'>
        {/* Tag filters — left-aligned, matching the other listing pages */}
        <FilterPills
          ariaLabel='Article topics'
          className='mb-6'
          activeKey={activeTag}
          onSelect={(tag) => {
            setActiveTag(tag);
            goTo(1);
          }}
          items={allTags.map((tag) => ({ key: tag, label: tag }))}
        />
        {query || activeTag !== 'All' ? (
          <div className='list-meta'>
            <span>
              {filteredPosts.length} result
              {filteredPosts.length !== 1 ? 's' : ''}
              {query && ` for "${query}"`}
              {activeTag !== 'All' && ` in ${activeTag}`}
            </span>
          </div>
        ) : null}

        {/* Posts grid */}
        {pagePosts.length > 0 ? (
          <>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {pagePosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/stories/${post.slug}`}
                  className='card-lift group flex flex-col overflow-hidden rounded-[16px] border border-border bg-surface text-inherit no-underline'
                >
                  <div className='relative h-[180px] overflow-hidden'>
                    <StoryArt
                      slug={post.slug}
                      tag={post.tag}
                      alt={`${post.title} — illustration`}
                      playOnHover
                      className='h-full w-full transition-transform duration-500 group-hover:scale-105'
                    />
                    <span className='absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white'>
                      {post.tag}
                    </span>
                  </div>

                  <div className='flex flex-1 flex-col p-5'>
                    <h2 className='mb-2 line-clamp-2 text-[18px] font-bold leading-snug text-foreground'>
                      {post.title}
                    </h2>
                    <p className='mb-4 line-clamp-3 text-sm leading-relaxed text-secondary'>
                      {post.excerpt}
                    </p>
                    <div className='mt-auto flex items-center gap-3 text-xs text-muted'>
                      <span>{post.date}</span>
                      <span className='h-1 w-1 rounded-full bg-border-strong' />
                      <span>{post.readTime} read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                aria-label='Pagination'
                className='mt-12 flex flex-wrap items-center justify-center gap-1.5'
              >
                <button
                  aria-label='First page'
                  className='flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/70 text-secondary backdrop-blur-sm transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-secondary'
                  disabled={page === 1}
                  onClick={() => goTo(1)}
                  type='button'
                >
                  <ChevronsLeft size={18} />
                </button>
                <button
                  aria-label='Previous page'
                  className='flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/70 text-secondary backdrop-blur-sm transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-secondary'
                  disabled={page === 1}
                  onClick={() => goTo(page - 1)}
                  type='button'
                >
                  <ChevronLeft size={18} />
                </button>
                <div
                  className='flex items-center justify-center gap-1.5'
                  style={{ width: pageBarWidth }}
                >
                  {(() => {
                    // Aim to fill 7 slots: always page 1 + last, and a window
                    // that grows near the ends so the bar stays full, with "…"
                    // marking any gap.
                    const MAX = 7;
                    let items: (number | 'gap')[];
                    if (totalPages <= MAX) {
                      items = Array.from(
                        { length: totalPages },
                        (_, i) => i + 1
                      );
                    } else if (page <= 4) {
                      items = [1, 2, 3, 4, 5, 'gap', totalPages];
                    } else if (page >= totalPages - 3) {
                      items = [
                        1,
                        'gap',
                        totalPages - 4,
                        totalPages - 3,
                        totalPages - 2,
                        totalPages - 1,
                        totalPages,
                      ];
                    } else {
                      items = [
                        1,
                        'gap',
                        page - 1,
                        page,
                        page + 1,
                        'gap',
                        totalPages,
                      ];
                    }
                    return items.map((it, i) =>
                      it === 'gap' ? (
                        <span
                          key={`gap-${i}`}
                          aria-hidden='true'
                          className='flex h-10 w-10 items-center justify-center text-muted'
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={it}
                          type='button'
                          aria-current={it === page ? 'page' : undefined}
                          onClick={() => goTo(it)}
                          className={`flex h-10 min-w-[40px] items-center justify-center rounded-[10px] px-3 text-sm font-bold transition-colors ${
                            it === page
                              ? 'border border-accent bg-accent text-white'
                              : 'border border-border bg-white/70 text-secondary backdrop-blur-sm hover:border-accent hover:text-accent'
                          }`}
                        >
                          {it}
                        </button>
                      )
                    );
                  })()}
                </div>
                <button
                  aria-label='Next page'
                  className='flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/70 text-secondary backdrop-blur-sm transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-secondary'
                  disabled={page === totalPages}
                  onClick={() => goTo(page + 1)}
                  type='button'
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  aria-label='Last page'
                  className='flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/70 text-secondary backdrop-blur-sm transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-secondary'
                  disabled={page === totalPages}
                  onClick={() => goTo(totalPages)}
                  type='button'
                >
                  <ChevronsRight size={18} />
                </button>
              </nav>
            )}
          </>
        ) : (
          <div className='py-20 text-center'>
            <p className='text-lg font-semibold text-foreground'>
              No articles found
            </p>
            <p className='mt-1 text-sm text-muted'>
              Try a different search term
            </p>
          </div>
        )}

        <NewsletterSubscribe />
      </section>
    </>
  );
}
