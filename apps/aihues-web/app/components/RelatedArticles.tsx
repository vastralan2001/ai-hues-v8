'use client';

import Link from 'next/link';

interface Article {
  slug: string;
  tag: string;
  title: string;
  coverImage: string;
}

const articles: Article[] = [
  { slug: 'growth-tools-2026', tag: 'Growth', title: '2026 Overseas Growth Toolkit', coverImage: 'https://images.unsplash.com/photo-1553484771-047a44eee27b?w=400&q=80' },
  { slug: 'reddit-marketing', tag: 'Reddit Marketing', title: 'Reddit Marketing Playbook', coverImage: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&q=80' },
  { slug: 'kol-marketing', tag: 'KOL Marketing', title: 'KOL Marketing from 0 to 1', coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80' },
  { slug: 'ai-content-strategy', tag: 'Content', title: 'AI Content Strategy', coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80' },
  { slug: 'seo-2026-trends', tag: 'SEO', title: '2026 SEO Trends', coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80' },
  { slug: 'twitter-growth', tag: 'Social Media', title: 'Twitter/X Growth Playbook', coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80' },
  { slug: 'no-code-mvp', tag: 'Product', title: 'The No-Code MVP Guide', coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80' },
  { slug: 'ai-productivity-stack', tag: 'Productivity', title: 'The 2026 AI Productivity Stack', coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80' },
  { slug: 'indie-dev-monetization', tag: 'Business', title: 'Indie Dev Monetization', coverImage: 'https://images.unsplash.com/photo-1553729459-abe14ef5b2b6?w=400&q=80' },
];

export default function RelatedArticles({ currentSlug, locale }: { currentSlug: string; locale: string }) {
  const related = articles
    .filter((a) => a.slug !== currentSlug)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className='mx-auto max-w-[900px] px-6 pb-20 pt-10 md:px-7'>
      <h3 className='mb-4 text-lg font-bold text-[#1c1917]'>
        {locale === 'zh' ? '相关文章' : 'Related Articles'}
      </h3>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        {related.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className='group flex flex-col overflow-hidden rounded-[12px] border border-[#e8e2d9] bg-white transition-all hover:border-[#d97706] hover:shadow-[0_2px_8px_rgba(180,83,9,0.08)]'
          >
            <div className='h-[120px] overflow-hidden'>
              <img
                alt={article.title}
                className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                loading='lazy'
                src={article.coverImage}
              />
            </div>
            <div className='p-4'>
              <span className='mb-1 inline-block text-[11px] font-bold text-[#b45309]'>
                {article.tag}
              </span>
              <p className='text-sm font-semibold text-[#1c1917] line-clamp-2'>
                {article.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
