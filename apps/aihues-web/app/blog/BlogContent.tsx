'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

import NewsletterSubscribe from '@/components/NewsletterSubscribe';
import CoverImage from '@/components/CoverImage';
import { PageMasthead } from '@/components/PageMasthead';
import type { BlogPost } from '@/lib/blog-data';

const POSTS_PER_PAGE = 12;

interface Props {
  initialPosts: BlogPost[];
}

export default function BlogContent({ initialPosts }: Props) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);

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
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = filteredPosts.slice(start, start + POSTS_PER_PAGE);

  return (
    <>
      <PageMasthead
        eyebrow='Writing'
        title='Blog & Guides'
        subtitle='Growth strategies, AI tool reviews, and battle-tested indie-dev tips.'
        stats={[
          { num: `${initialPosts.length}`, label: 'Articles' },
          { num: `${allTags.length - 1}`, label: 'Topics' },
        ]}
      />

      <section className='mx-auto max-w-[1200px] px-6 pb-20 md:px-7'>
        {/* Search + tag filters */}
        <div className='mx-auto mb-10 max-w-[520px]'>
          <div className='relative'>
            <svg
              className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              viewBox='0 0 24 24'
            >
              <circle cx='11' cy='11' r='8' />
              <path d='m21 21-4.35-4.35' />
            </svg>
            <input
              className='h-12 w-full rounded-[12px] border border-border bg-surface pl-11 pr-4 text-sm text-foreground transition-colors placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder='Search articles by title, topic, or keyword...'
              type='text'
              value={query}
            />
          </div>
          {(query || activeTag !== 'All') && (
            <p className='mt-2 text-center text-xs text-muted'>
              {filteredPosts.length} result
              {filteredPosts.length !== 1 ? 's' : ''}
              {query && ` for "${query}"`}
              {activeTag !== 'All' && ` in ${activeTag}`}
            </p>
          )}

          <div className='mt-4 flex flex-wrap justify-center gap-2'>
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  activeTag === tag
                    ? 'border-accent bg-accent text-white'
                    : 'border-border bg-surface text-secondary hover:border-accent hover:text-accent'
                }`}
                onClick={() => {
                  setActiveTag(tag);
                  setCurrentPage(1);
                }}
                type='button'
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Posts grid */}
        {pagePosts.length > 0 ? (
          <>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {pagePosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className='card-lift group flex flex-col overflow-hidden rounded-[16px] border border-border bg-surface text-inherit no-underline'
                >
                  <div className='relative h-[180px] overflow-hidden'>
                    <CoverImage
                      src={post.coverImage}
                      alt={post.title}
                      className='h-full w-full'
                    />
                    <span className='absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white'>
                      {post.tag}
                    </span>
                  </div>

                  <div className='flex flex-1 flex-col p-5'>
                    <h2 className='mb-2 line-clamp-2 text-[15px] font-bold leading-snug tracking-tight text-foreground'>
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
              <div className='mt-10 flex items-center justify-center gap-2'>
                <button
                  className='rounded-[10px] border border-border bg-surface px-4 py-2 text-sm font-medium text-secondary transition-colors hover:border-accent hover:text-accent disabled:opacity-40'
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  type='button'
                >
                  Previous
                </button>
                <span className='px-3 text-sm text-muted'>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className='rounded-[10px] border border-border bg-surface px-4 py-2 text-sm font-medium text-secondary transition-colors hover:border-accent hover:text-accent disabled:opacity-40'
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  type='button'
                >
                  Next
                </button>
              </div>
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
