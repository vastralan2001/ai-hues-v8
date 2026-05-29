import { readFileSync } from 'node:fs';
import { notFound } from 'next/navigation';

import { PageShell } from '@/components/SiteChrome';
import '../article.css';

interface ArticleMeta {
  title: string;
  tag: string;
  date: string;
  readTime: string;
}

const articleMetaMap: Record<string, ArticleMeta> = {
  'growth-tools-2026': {
    title: '2026 Overseas Growth Toolkit: 70+ Tools Covering Social, Reddit, KOL, SEO',
    tag: 'Growth',
    date: '2026-05-27',
    readTime: '8 min read',
  },
  'reddit-marketing': {
    title: 'Reddit Marketing Playbook: How to Acquire Users Gracefully in Redditor Territory',
    tag: 'Reddit Marketing',
    date: '2026-05-20',
    readTime: '6 min read',
  },
  'kol-marketing': {
    title: 'KOL Marketing from 0 to 1: How Indie Developers Find Their First Seed Promoters',
    tag: 'KOL Marketing',
    date: '2026-05-15',
    readTime: '5 min read',
  },
};

function extractBody(html: string): string {
  const match = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
  if (match) return match[1];
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
  return bodyMatch ? bodyMatch[1] : html;
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = articleMetaMap[slug];
  if (!meta) notFound();

  let htmlContent: string;
  try {
    const raw = readFileSync(
      process.cwd() + `/public/blog/${slug}.html`,
      'utf-8'
    );
    htmlContent = extractBody(raw);
  } catch {
    notFound();
  }

  return (
    <PageShell>
      <main className='mx-auto max-w-[800px] px-6 py-20 md:px-7'>
        {/* Article header */}
        <div className='mb-10 text-center'>
          <span className='mb-4 inline-block rounded-full bg-[rgba(180,83,9,0.08)] px-3 py-1 text-xs font-bold text-[#b45309]'>
            {meta.tag}
          </span>
          <h1 className='text-[48px] font-extrabold leading-[1.08] tracking-[-2px] text-[#1c1917]'>
            {meta.title}
          </h1>
          <div className='mt-4 flex justify-center gap-4 text-sm text-[#a8a29e]'>
            <span>📅 {meta.date}</span>
            <span>⏱️ {meta.readTime}</span>
            <span>👤 AIHues Team</span>
          </div>
        </div>

        {/* Article content */}
        <article
          className='article-content max-w-none'
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </main>

    </PageShell>
  );
}
