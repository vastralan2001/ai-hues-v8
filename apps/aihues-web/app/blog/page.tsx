import Link from 'next/link';

import { PageShell } from '@/components/SiteChrome';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';

const posts = [
  {
    slug: 'growth-tools-2026',
    tag: 'Growth',
    title:
      '2026 Overseas Growth Toolkit: 70+ Tools Covering Social, Reddit, KOL, SEO',
    excerpt:
      'From social listening to Reddit marketing, KOL management to SEO optimization — this curated list covers all the growth tools indie developers and SaaS teams need to go global.',
    date: '2026-05-27',
    readTime: '8 min',
  },
  {
    slug: 'reddit-marketing',
    tag: 'Reddit Marketing',
    title:
      'Reddit Marketing Playbook: How to Acquire Users Gracefully in Redditor Territory',
    excerpt:
      'Reddit is the largest community platform with 800M+ monthly active users. This guide shares practical strategies for building brand trust, avoiding bans, and acquiring users efficiently.',
    date: '2026-05-20',
    readTime: '6 min',
  },
  {
    slug: 'kol-marketing',
    tag: 'KOL Marketing',
    title:
      'KOL Marketing from 0 to 1: How Indie Developers Find Their First Seed Promoters',
    excerpt:
      'No budget for big influencers? No problem. Learn how to find micro-influencers on Twitter/X, YouTube, and TikTok who are willing to endorse you for free — and build long-term partnerships.',
    date: '2026-05-15',
    readTime: '5 min',
  },
];

export default function BlogPage() {
  return (
    <PageShell>
      <main className='mx-auto max-w-[800px] px-6 py-20 md:px-7'>
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

        <div className='flex flex-col gap-4'>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className='group block rounded-[14px] border border-[#e8e2d9] bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#d97706] hover:shadow-[0_4px_12px_rgba(180,83,9,0.12),0_8px_32px_rgba(0,0,0,0.08)]'
            >
              <span className='mb-2.5 inline-block rounded-md bg-[rgba(180,83,9,0.08)] px-2.5 py-1 text-[11px] font-bold text-[#b45309]'>
                {post.tag}
              </span>
              <h2 className='mb-2 text-lg font-bold tracking-tight text-[#1c1917]'>
                {post.title}
              </h2>
              <p className='mb-3 text-sm leading-relaxed text-[#78716c]'>
                {post.excerpt}
              </p>
              <div className='flex gap-3 text-xs text-[#a8a29e]'>
                <span>{post.date}</span>
                <span>{post.readTime} read</span>
              </div>
            </Link>
          ))}
        </div>

        <NewsletterSubscribe />
      </main>
    </PageShell>
  );
}
