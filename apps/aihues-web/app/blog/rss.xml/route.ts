import { NextResponse } from 'next/server';

const BASE_URL = 'https://aihues.com';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
}

const posts: Post[] = [
  {
    slug: 'growth-tools-2026',
    title: '2026 Overseas Growth Toolkit: 70+ Tools Covering Social, Reddit, KOL, SEO',
    excerpt: 'From social listening to Reddit marketing, KOL management to SEO optimization — this curated list covers all the growth tools indie developers and SaaS teams need to go global.',
    date: '2026-05-27',
  },
  {
    slug: 'reddit-marketing',
    title: 'Reddit Marketing Playbook: How to Acquire Users Gracefully in Redditor Territory',
    excerpt: 'Reddit is the largest community platform with 800M+ monthly active users. This guide shares practical strategies for building brand trust, avoiding bans, and acquiring users efficiently.',
    date: '2026-05-20',
  },
  {
    slug: 'kol-marketing',
    title: 'KOL Marketing from 0 to 1: How Indie Developers Find Their First Seed Promoters',
    excerpt: 'No budget for big influencers? No problem. Learn how to find micro-influencers on Twitter/X, YouTube, and TikTok who are willing to endorse you for free.',
    date: '2026-05-15',
  },
  {
    slug: 'ai-content-strategy',
    title: 'AI Content Strategy: Scale Quality Without Losing the Human Touch',
    excerpt: 'Learn how to use AI tools to scale content production while maintaining authenticity and human connection with your audience.',
    date: '2026-05-25',
  },
  {
    slug: 'seo-2026-trends',
    title: '2026 SEO Trends: From Keywords to Intent',
    excerpt: 'The SEO landscape is shifting from keyword density to user intent. Here is what works in 2026.',
    date: '2026-05-22',
  },
  {
    slug: 'twitter-growth',
    title: 'Twitter/X Growth Playbook: 0 to 10K in 90 Days',
    excerpt: 'A practical roadmap for building an engaged audience on X from scratch to 10,000 followers.',
    date: '2026-05-18',
  },
  {
    slug: 'no-code-mvp',
    title: 'The No-Code MVP Guide: Launch in 48 Hours',
    excerpt: 'Build and ship a working product without writing a single line of code.',
    date: '2026-05-12',
  },
  {
    slug: 'ai-productivity-stack',
    title: 'The 2026 AI Productivity Stack',
    excerpt: 'The exact tools and workflows we use to get 10x more done in less time.',
    date: '2026-05-10',
  },
  {
    slug: 'indie-dev-monetization',
    title: 'Indie Dev Monetization: From Side Project to $10K MRR',
    excerpt: 'The revenue models and pricing strategies that actually work for solo developers.',
    date: '2026-05-08',
  },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const items = posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid>${BASE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AIHues Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Growth strategies, AI tool reviews, and indie dev battle-tested tips.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
