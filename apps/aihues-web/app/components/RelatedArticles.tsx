import Link from 'next/link';

import { getAllPosts } from '@/lib/resources-data';
import CoverImage from './CoverImage';

export default function RelatedArticles({
  currentSlug,
  locale,
}: {
  currentSlug: string;
  locale: string;
}) {
  const posts = getAllPosts();
  // Pick 3 posts that are not the current one, prefer same tag
  const current = posts.find((p) => p.slug === currentSlug);
  let related = posts.filter((p) => p.slug !== currentSlug);

  if (current) {
    const sameTag = related.filter((p) => p.tag === current.tag);
    const otherTag = related.filter((p) => p.tag !== current.tag);
    related = [...sameTag, ...otherTag];
  }

  related = related.slice(0, 3);
  if (related.length === 0) return null;

  return (
    <div className='pt-12'>
      <h3 className='mb-4 text-lg font-bold text-foreground'>
        {locale === 'zh' ? '相关文章' : 'Related Articles'}
      </h3>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        {related.map((article) => (
          <Link
            key={article.slug}
            href={`/stories/${article.slug}`}
            className='card-lift group flex flex-col overflow-hidden rounded-[12px] border border-border bg-surface text-inherit no-underline'
          >
            <CoverImage
              src={article.coverImage}
              alt={article.title}
              className='h-[120px]'
            />
            <div className='p-4'>
              <span className='mb-1 inline-block text-[11px] font-bold text-accent'>
                {article.tag}
              </span>
              <p className='line-clamp-2 text-sm font-semibold text-foreground'>
                {article.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
