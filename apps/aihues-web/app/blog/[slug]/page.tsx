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
    title: '2026 年出海增长必备工具大全：70+ 工具覆盖社媒、Reddit、KOL、SEO',
    tag: '出海增长',
    date: '2026-05-27',
    readTime: '8 分钟',
  },
  'reddit-marketing': {
    title: 'Reddit 营销实战指南：如何在 Redditors 的领地里优雅地获客',
    tag: 'Reddit 营销',
    date: '2026-05-20',
    readTime: '6 分钟',
  },
  'kol-marketing': {
    title: 'KOL 营销从 0 到 1：独立开发者如何找到第一批种子推广者',
    tag: 'KOL 营销',
    date: '2026-05-15',
    readTime: '5 分钟',
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
          <h1 className='text-3xl font-extrabold tracking-tight text-[#1c1917] md:text-4xl'>
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
