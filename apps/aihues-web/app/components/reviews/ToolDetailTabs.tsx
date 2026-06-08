'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/dict';
import { getReviewBySlug, starRating } from '@/lib/reviews';
import { getToolBySlug } from '@/lib/tool-data';
import { useI18n } from '@/lib/i18n';
import ReviewPanel from './ReviewPanel';
import CommentSection from './CommentSection';
import { ToolIcon } from '@/components/ToolIcon';

function useTabs(locale: Locale) {
  const t = (key: string) => {
    const dict: Record<Locale, Record<string, string>> = {
      en: { tool: 'Tool', review: 'Review', comments: 'Comments' },
      zh: { tool: '工具', review: '评测', comments: '评论' },
    };
    return dict[locale][key] || key;
  };
  return [
    { key: 'tool', label: t('tool') },
    { key: 'review', label: t('review') },
    { key: 'comments', label: t('comments') },
  ] as const;
}

export default function ToolDetailTabs({
  slug,
  locale,
  toolElement,
}: {
  slug: string;
  locale: Locale;
  toolElement: React.ReactNode;
}) {
  const { t } = useI18n();
  const TABS = useTabs(locale);
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]['key']>('tool');
  const review = getReviewBySlug(slug);
  const tool = getToolBySlug(slug);

  const tabs = review
    ? TABS
    : TABS.filter((tab) => tab.key !== 'review' && tab.key !== 'comments');

  return (
    <div className='mx-auto max-w-[900px] px-6 py-8'>
      {/* Tool header */}
      {tool && (
        <div className='mb-6 flex items-start gap-4'>
          <span className='text-[40px]'>
            <ToolIcon slug={tool.slug} size={40} />
          </span>
          <div className='flex-1'>
            <h1 className='text-[24px] font-extrabold text-[#1c1917]'>
              {tool.name}
            </h1>
            <p className='mt-1 text-[14px] text-[#78716c]'>
              {tool.description}
            </p>
            <div className='mt-2 flex items-center gap-3'>
              <span className='rounded-full bg-[#f5f5f4] px-2.5 py-0.5 text-[11px] text-[#57534e]'>
                {tool.category}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  tool.price === 'free'
                    ? 'bg-[#dcfce7] text-[#15803d]'
                    : tool.price === 'freemium'
                      ? 'bg-[#fef9c3] text-[#a16207]'
                      : 'bg-[#fee2e2] text-[#b91c1c]'
                }`}
              >
                {tool.price}
              </span>
              {review && (
                <span className='text-[13px] text-[#b45309]'>
                  {starRating(review.overall)} {review.overall}
                </span>
              )}
            </div>
          </div>
          {tool.isExternal && (
            <Link
              className='rounded-lg bg-[#1c1917] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-80'
              href={tool.url}
              rel='noopener noreferrer'
              target='_blank'
            >
              {t('review.visitOfficial')}
            </Link>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className='mb-6 flex border-b border-[#e7e5e4]'>
        {tabs.map((tab) => (
          <button
            className={`relative px-4 py-2.5 text-[14px] font-semibold transition-colors ${
              activeTab === tab.key
                ? 'text-[#b45309]'
                : 'text-[#78716c] hover:text-[#1c1917]'
            }`}
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className='absolute bottom-0 left-0 h-0.5 w-full bg-[#b45309]' />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'tool' && <div>{toolElement}</div>}
        {activeTab === 'review' && review && <ReviewPanel review={review} />}
        {activeTab === 'comments' && <CommentSection slug={slug} />}
      </div>
    </div>
  );
}
