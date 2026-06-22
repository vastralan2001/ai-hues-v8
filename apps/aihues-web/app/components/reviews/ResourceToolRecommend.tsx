'use client';

import Link from 'next/link';
import {
  getRelatedToolSlugsByTag,
  getReviewBySlug,
  starRating,
} from '@/lib/reviews';
import { getToolBySlug } from '@/lib/tool-data';
import { useI18n } from '@/lib/i18n';
import { ToolIcon } from '@/components/ToolIcon';

export default function ResourceToolRecommend({ tag }: { tag: string }) {
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
    <div className='mt-12 rounded-xl border border-border bg-surface p-5'>
      <div className='mb-4 flex items-center gap-2'>
        <span className='text-[16px]'>🛠️</span>
        <h3 className='text-[15px] font-bold text-foreground'>
          {t('resources.relatedTools')}
        </h3>
        <span className='ml-auto text-[11px] text-muted'>
          {t('resources.fromReview')}
        </span>
      </div>

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
        {items.map(({ tool, review, slug }) => (
          <Link
            className='group block rounded-lg border border-border bg-bg p-3 transition-colors hover:border-accent'
            href={`/tools/${slug}`}
            key={slug}
          >
            <div className='mb-2 flex items-center gap-2'>
              <span className='text-[18px]'>
                <ToolIcon slug={tool.slug} size={18} />
              </span>
              <span className='text-[13px] font-bold text-foreground group-hover:text-accent'>
                {tool.name}
              </span>
            </div>
            <p className='mb-2 line-clamp-2 text-[11px] leading-snug text-secondary'>
              {tool.description}
            </p>
            {review && (
              <div className='flex items-center gap-1 text-[11px]'>
                <span className='font-bold text-accent'>{review.overall}</span>
                <span className='text-accent'>
                  {starRating(review.overall)}
                </span>
                <span className='ml-auto text-muted'>{t('review.review')}</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
