'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

import { event, GA_EVENTS } from '@/lib/gtag';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';
import CoverImage from '@/components/CoverImage';
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
    <main className='mx-auto max-w-[1200px] px-6 py-20 md:px-7'>
      {/* Header */}
      <div className='mb-10 text-center'>
        <p className='mb-2 text-xs font-bold uppercase tracking-widest text-[#b45309]'>
          Blog
        </p>
        <h1 className='text-[48px] font-extrabold leading-[1.08] tracking-[-2px]'>
          <span className='text-[#1c1917]'>AIHues </span>
          <span className='bg-gradient-to-r from-[#b45309] to-[#d97706] bg-clip-text text-transparent'>
            Blog
          </span>
        </h1>
        <p className='mt-2 text-[#78716c]'>
          Growth strategies, AI tool reviews, and indie dev battle-tested tips
        </p>
        <p className='mt-1 text-sm text-[#a8a29e]'>
          {initialPosts.length} articles
        </p>
      </div>

      {/* Search */}
      <div className='mx-auto mb-10 max-w-[500px]'>
        <div className='relative'>
          <svg
            className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a8a29e]'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            viewBox='0 0 24 24'
          >
            <circle cx='11' cy='11' r='8' />
            <path d='m21 21-4.35-4.35' />
          </svg>
          <input
            className='h-12 w-full rounded-[12px] border border-[#e8e2d9] bg-white pl-11 pr-4 text-sm text-[#1c1917] placeholder:text-[#a8a29e] focus:border-[#d97706] focus:outline-none transition-colors'
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
          <p className='mt-2 text-center text-xs text-[#a8a29e]'>
            {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''}
            {query && ` for "${query}"`}
            {activeTag !== 'All' && ` in ${activeTag}`}
          </p>
        )}

        {/* Tag filters */}
        <div className='mt-4 flex flex-wrap justify-center gap-2'>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                activeTag === tag
                  ? 'bg-[#b45309] text-white'
                  : 'bg-[#f5f0e8] text-[#78716c] hover:bg-[#e8e2d9]'
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

      {/* Posts Grid */}
      {pagePosts.length > 0 ? (
        <>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {pagePosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className='group flex flex-col overflow-hidden rounded-[14px] border border-[#e8e2d9] bg-white transition-all hover:-translate-y-1 hover:border-[#d97706] hover:shadow-[0_4px_12px_rgba(180,83,9,0.12),0_8px_32px_rgba(0,0,0,0.08)]'
                onClick={() => event(GA_EVENTS.blogClick, { slug: post.slug })}
              >
                {/* Cover Image */}
                <div className='relative h-[180px] overflow-hidden'>
                  <CoverImage
                    src={post.coverImage}
                    alt={post.title}
                    className='h-full w-full'
                  />
                  <span className='absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-[11px] font-bold text-[#b45309] backdrop-blur-sm'>
                    {post.tag}
                  </span>
                </div>

                {/* Content */}
                <div className='flex flex-1 flex-col p-5'>
                  <h2 className='mb-2 text-[15px] font-bold leading-snug tracking-tight text-[#1c1917] line-clamp-2'>
                    {post.title}
                  </h2>
                  <p className='mb-4 text-sm leading-relaxed text-[#78716c] line-clamp-3'>
                    {post.excerpt}
                  </p>
                  <div className='mt-auto flex items-center gap-3 text-xs text-[#a8a29e]'>
                    <span>{post.date}</span>
                    <span className='h-1 w-1 rounded-full bg-[#d4c8b8]' />
                    <span>{post.readTime} read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='mt-10 flex items-center justify-center gap-2'>
              <button
                className='rounded-[10px] border border-[#e8e2d9] bg-white px-4 py-2 text-sm font-medium text-[#78716c] transition-all hover:border-[#d97706] hover:text-[#b45309] disabled:opacity-40'
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                type='button'
              >
                Previous
              </button>
              <span className='px-3 text-sm text-[#a8a29e]'>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className='rounded-[10px] border border-[#e8e2d9] bg-white px-4 py-2 text-sm font-medium text-[#78716c] transition-all hover:border-[#d97706] hover:text-[#b45309] disabled:opacity-40'
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
          <p className='text-lg font-semibold text-[#1c1917]'>
            No articles found
          </p>
          <p className='mt-1 text-sm text-[#a8a29e]'>
            Try a different search term
          </p>
        </div>
      )}

      <NewsletterSubscribe />
    </main>
  );
}
