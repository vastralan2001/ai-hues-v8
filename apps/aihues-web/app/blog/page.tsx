import Link from 'next/link';

import { PageShell } from '@/components/SiteChrome';

const posts = [
  {
    slug: 'growth-tools-2026',
    tag: '出海增长',
    title: '2026 年出海增长必备工具大全：70+ 工具覆盖社媒、Reddit、KOL、SEO',
    excerpt:
      '从社媒监听到 Reddit 营销，从 KOL 管理到 SEO 优化，这份清单涵盖独立开发者和 SaaS 团队出海所需的全部增长工具。',
    date: '2026-05-27',
    readTime: '8 分钟',
  },
  {
    slug: 'reddit-marketing',
    tag: 'Reddit 营销',
    title: 'Reddit 营销实战指南：如何在 Redditors 的领地里优雅地获客',
    excerpt:
      'Reddit 是全球最大的社区聚合平台，月活超过 8 亿。本文分享如何在 Reddit 上建立品牌信任、避免被封号、以及高效获客的实战策略。',
    date: '2026-05-20',
    readTime: '6 分钟',
  },
  {
    slug: 'kol-marketing',
    tag: 'KOL 营销',
    title: 'KOL 营销从 0 到 1：独立开发者如何找到第一批种子推广者',
    excerpt:
      '没有预算请大 V？没关系。本文教你如何通过 Twitter/X、YouTube、TikTok 找到愿意免费为你背书的微影响者，并建立长期合作关系。',
    date: '2026-05-15',
    readTime: '5 分钟',
  },
];

export default function BlogPage() {
  return (
    <PageShell>
      <main className='mx-auto max-w-[800px] px-6 py-20 md:px-7'>
      <div className='mb-10 text-center'>
        <p className='mb-2 text-xs font-bold uppercase tracking-widest text-green'>
          Blog
        </p>
        <h1 className='text-3xl font-extrabold tracking-tight md:text-4xl'>
          <span className='text-[#1c1917]'>AIHues </span>
          <span
            className='bg-gradient-to-r from-[#b45309] to-[#d97706] bg-clip-text text-transparent'
          >
            博客
          </span>
        </h1>
        <p className='mt-2 text-[#78716c]'>
          出海增长策略、AI 工具评测、独立开发实战
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
              <span>📅 {post.date}</span>
              <span>⏱️ {post.readTime}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
    </PageShell>
  );
}
