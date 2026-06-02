'use client';

import Link from 'next/link';
import {
  getRelatedToolSlugsByTag,
  getReviewBySlug,
  starRating,
} from '@/lib/reviews';
import { getToolBySlug } from '@/lib/tool-data';
import { useI18n } from '@/lib/i18n';

export default function BlogToolRecommend({ tag }: { tag: string }) {
  const { t } = useI18n();
  const slugs = getRelatedToolSlugsByTag(tag).slice(0, 3);
  if (slugs.length === 0) return null;

  const items = slugs
    .map((slug) => {
      const tool = getToolBySlug(slug);
      const review = getReviewBySlug(slug);
      return tool ? { tool, review, slug } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x != null);

  if (items.length === 0) return null;

  return (
    <div className='mt-12 rounded-xl border border-[#e7e5e4] bg-[#fafaf9] p-5'>
      <div className='mb-4 flex items-center gap-2'>
        <span className='text-[16px]'>🛠️</span>
        <h3 className='text-[15px] font-bold text-[#1c1917]'>
          {t('blog.relatedTools')}
        </h3>
        <span className='ml-auto text-[11px] text-[#a8a29e]'>
          {t('blog.fromReview')}
        </span>
      </div>

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
        {items.map(({ tool, review, slug }) => (
          <Link
            className='group block rounded-lg border border-[#e7e5e4] bg-white p-3 transition-all hover:border-[#b45309] hover:shadow-sm'
            href={`/tools/${slug}`}
            key={slug}
          >
            <div className='mb-2 flex items-center gap-2'>
              <span className='text-[18px]'>{tool.icon}</span>
              <span className='text-[13px] font-bold text-[#1c1917] group-hover:text-[#b45309]'>
                {tool.name}
              </span>
            </div>
            <p className='mb-2 line-clamp-2 text-[11px] leading-snug text-[#78716c]'>
              {tool.description}
            </p>
            {review && (
              <div className='flex items-center gap-1 text-[11px]'>
                <span className='font-bold text-[#b45309]'>
                  {review.overall}
                </span>
                <span className='text-[#b45309]'>
                  {starRating(review.overall)}
                </span>
                <span className='ml-auto text-[#a8a29e]'>
                  {t('review.review')}
                </span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
