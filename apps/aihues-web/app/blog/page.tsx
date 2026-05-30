'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

import { PageShell } from '@/components/SiteChrome';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';

interface Post {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  coverImage: string;
}

const posts: Post[] = [
  {
    slug: 'growth-tools-2026',
    tag: 'Growth',
    title: '2026 Overseas Growth Toolkit: 70+ Tools Covering Social, Reddit, KOL, SEO',
    excerpt: 'From social listening to Reddit marketing, KOL management to SEO optimization — this curated list covers all the growth tools indie developers and SaaS teams need to go global.',
    date: '2026-05-27',
    readTime: '8 min',
    coverImage: 'https://images.unsplash.com/photo-1553484771-047a44eee27b?w=600&q=80',
  },
  {
    slug: 'reddit-marketing',
    tag: 'Reddit Marketing',
    title: 'Reddit Marketing Playbook: How to Acquire Users Gracefully in Redditor Territory',
    excerpt: 'Reddit is the largest community platform with 800M+ monthly active users. This guide shares practical strategies for building brand trust, avoiding bans, and acquiring users efficiently.',
    date: '2026-05-20',
    readTime: '6 min',
    coverImage: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&q=80',
  },
  {
    slug: 'kol-marketing',
    tag: 'KOL Marketing',
    title: 'KOL Marketing from 0 to 1: How Indie Developers Find Their First Seed Promoters',
    excerpt: 'No budget for big influencers? No problem. Learn how to find micro-influencers on Twitter/X, YouTube, and TikTok who are willing to endorse you for free — and build long-term partnerships.',
    date: '2026-05-15',
    readTime: '5 min',
    coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80',
  },
  {
    slug: 'ai-content-strategy',
    tag: 'Content',
    title: 'AI Content Strategy: Scale Quality Without Losing the Human Touch',
    excerpt: 'Learn how to use AI tools to scale content production while maintaining authenticity and human connection with your audience.',
    date: '2026-05-25',
    readTime: '7 min',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
  },
  {
    slug: 'seo-2026-trends',
    tag: 'SEO',
    title: '2026 SEO Trends: From Keywords to Intent',
    excerpt: 'The SEO landscape is shifting from keyword density to user intent. Here is what works in 2026.',
    date: '2026-05-22',
    readTime: '6 min',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
  },
  {
    slug: 'twitter-growth',
    tag: 'Social Media',
    title: 'Twitter/X Growth Playbook: 0 to 10K in 90 Days',
    excerpt: 'A practical roadmap for building an engaged audience on X from scratch to 10,000 followers.',
    date: '2026-05-18',
    readTime: '8 min',
    coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80',
  },
  {
    slug: 'no-code-mvp',
    tag: 'Product',
    title: 'The No-Code MVP Guide: Launch in 48 Hours',
    excerpt: 'Build and ship a working product without writing a single line of code.',
    date: '2026-05-12',
    readTime: '6 min',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
  },
  {
    slug: 'ai-productivity-stack',
    tag: 'Productivity',
    title: 'The 2026 AI Productivity Stack',
    excerpt: 'The exact tools and workflows we use to get 10x more done in less time.',
    date: '2026-05-10',
    readTime: '5 min',
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80',
  },
  {
    slug: 'indie-dev-monetization',
    tag: 'Business',
    title: 'Indie Dev Monetization: From Side Project to $10K MRR',
    excerpt: 'The revenue models and pricing strategies that actually work for solo developers.',
    date: '2026-05-08',
    readTime: '7 min',
    coverImage: 'https://images.unsplash.com/photo-1553729459-abe14ef5b2b6?w=600&q=80',
  },
];

export default function BlogPage() {
  const [query, setQuery] = useState('');

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tag.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <PageShell>
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
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search articles by title, topic, or keyword...'
              type='text'
              value={query}
            />
          </div>
          {query && (
            <p className='mt-2 text-center text-xs text-[#a8a29e]'>
              {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for "{query}"
            </p>
          )}
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className='group flex flex-col overflow-hidden rounded-[14px] border border-[#e8e2d9] bg-white transition-all hover:-translate-y-1 hover:border-[#d97706] hover:shadow-[0_4px_12px_rgba(180,83,9,0.12),0_8px_32px_rgba(0,0,0,0.08)]'
              >
                {/* Cover Image */}
                <div className='relative h-[180px] overflow-hidden bg-[#f5f0e8]'>
                  <img
                    alt={post.title}
                    className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                    loading='lazy'
                    src={post.coverImage}
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
        ) : (
          <div className='py-20 text-center'>
            <p className='text-lg font-semibold text-[#1c1917]'>No articles found</p>
            <p className='mt-1 text-sm text-[#a8a29e]'>
              Try a different search term
            </p>
          </div>
        )}

        <NewsletterSubscribe />
      </main>
    </PageShell>
  );
}
