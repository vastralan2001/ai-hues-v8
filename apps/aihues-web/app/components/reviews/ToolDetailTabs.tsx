'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/dict';
import { getReviewBySlug, starRating } from '@/lib/reviews';
import { getToolBySlug } from '@/lib/tool-data';
import { useI18n } from '@/lib/i18n';

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

  // Reviews & comments hidden for Phase 1
  const tabs = TABS.filter((tab) => tab.key === 'tool');

  return (
    <div className='mx-auto max-w-[900px] px-6 py-8'>
      {/* Tool header */}
      {tool && (
        <div className='mb-8 flex items-center gap-4 rounded-[20px] border border-border bg-surface p-4 sm:gap-5 sm:p-6'>
          <div className='flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] border border-border bg-white text-[26px] shadow-sm sm:h-[56px] sm:w-[56px] sm:text-[28px]'>
            <ToolIcon slug={tool.slug} size={26} />
          </div>
          <div className='min-w-0 flex-1'>
            <div className='flex flex-wrap items-center gap-2.5'>
              <span className='rounded-full border border-border bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted'>
                {tool.category}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
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
                <span className='flex items-center gap-1 text-[13px] font-medium text-accent'>
                  <span>{starRating(review.overall)}</span>
                  <span>{review.overall}</span>
                </span>
              )}
            </div>
          </div>
          {tool.isExternal && (
            <Link
              className='shrink-0 rounded-[12px] bg-foreground px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-90'
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
      <div>{activeTab === 'tool' && <div>{toolElement}</div>}</div>
    </div>
  );
}
