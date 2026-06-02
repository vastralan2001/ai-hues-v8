'use client';

import Link from 'next/link';
import {
  type ToolReview,
  DIMENSION_LABELS,
  DIMENSION_LABELS_EN,
  DIMENSION_WEIGHTS,
  starRating,
  getReviewText,
} from '@/lib/reviews';
import { useI18n } from '@/lib/i18n';
import RadarChart from './RadarChart';

export default function ReviewPanel({ review }: { review: ToolReview }) {
  const { locale, t } = useI18n();
  const texts = getReviewText(review, locale);
  const dimLabels = locale === 'zh' ? DIMENSION_LABELS : DIMENSION_LABELS_EN;

  const dimensionEntries = Object.entries(review.dimensions) as [
    keyof ToolReview['dimensions'],
    number,
  ][];

  const data = dimensionEntries.map(([, v]) => v);
  const labels = dimensionEntries.map(([k]) => dimLabels[k]);

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='text-[28px] font-extrabold text-[#b45309]'>
              {review.overall}
            </span>
            <span className='text-[18px] text-[#b45309]'>
              {starRating(review.overall)}
            </span>
          </div>
          <p className='text-[13px] text-[#a8a29e]'>
            {t('review.basedOn')} · {t('review.testedDate')}:{' '}
            {review.testedDate}
          </p>
        </div>
        <div className='flex justify-center'>
          <RadarChart data={data} labels={labels} size={180} />
        </div>
      </div>

      {/* Dimension breakdown */}
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
        {dimensionEntries.map(([key, score]) => (
          <div
            className='rounded-lg border border-[#e7e5e4] bg-[#fafaf9] px-3 py-2'
            key={key}
          >
            <div className='text-[11px] text-[#78716c]'>
              {dimLabels[key]}
              <span className='ml-1 text-[10px]'>
                ({Math.round(DIMENSION_WEIGHTS[key] * 100)}%)
              </span>
            </div>
            <div className='mt-1 flex items-center gap-1.5'>
              <div className='h-2 flex-1 overflow-hidden rounded-full bg-[#e7e5e4]'>
                <div
                  className='h-full rounded-full bg-[#b45309]'
                  style={{ width: `${(score / 5) * 100}%` }}
                />
              </div>
              <span className='text-[12px] font-bold text-[#1c1917]'>
                {score}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pros & Cons */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div className='rounded-xl border border-[#dcfce7] bg-[#f0fdf4] p-4'>
          <h4 className='mb-3 text-[13px] font-bold text-[#15803d]'>
            {t('review.pros')}
          </h4>
          <ul className='space-y-2'>
            {texts.pros.map((p) => (
              <li
                className='flex items-start gap-2 text-[13px] text-[#166534]'
                key={p}
              >
                <span className='mt-0.5 text-[#22c55e]'>✓</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className='rounded-xl border border-[#fee2e2] bg-[#fef2f2] p-4'>
          <h4 className='mb-3 text-[13px] font-bold text-[#b91c1c]'>
            {t('review.cons')}
          </h4>
          <ul className='space-y-2'>
            {texts.cons.map((c) => (
              <li
                className='flex items-start gap-2 text-[13px] text-[#991b1b]'
                key={c}
              >
                <span className='mt-0.5 text-[#ef4444]'>×</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Verdict */}
      <div className='rounded-xl border border-[#b45309]/15 bg-[rgba(180,83,9,0.04)] p-4'>
        <h4 className='mb-1 text-[13px] font-bold text-[#b45309]'>
          {t('review.verdict')}
        </h4>
        <p className='text-[14px] leading-relaxed text-[#57534e]'>
          {texts.verdict}
        </p>
      </div>

      {/* Best for */}
      <div>
        <h4 className='mb-2 text-[13px] font-bold text-[#1c1917]'>
          {t('review.bestFor')}
        </h4>
        <div className='flex flex-wrap gap-2'>
          {texts.bestFor.map((b) => (
            <span
              className='rounded-full bg-[#f5f5f4] px-3 py-1 text-[12px] text-[#57534e]'
              key={b}
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Alternatives */}
      {review.alternatives.length > 0 && (
        <div>
          <h4 className='mb-2 text-[13px] font-bold text-[#1c1917]'>
            {t('review.alternatives')}
          </h4>
          <div className='flex flex-wrap gap-2'>
            {review.alternatives.map((alt) => (
              <Link
                className='rounded-full border border-[#e7e5e4] bg-white px-3 py-1 text-[12px] text-[#78716c] transition-colors hover:border-[#b45309] hover:text-[#b45309]'
                href={`/tools/${alt}`}
                key={alt}
              >
                {alt}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Meta */}
      <div className='border-t border-[#e7e5e4] pt-3 text-[11px] text-[#a8a29e]'>
        {t('review.testedBy')}: {review.reviewer} · {t('review.testedDate')}:{' '}
        {review.testedDate} · {t('review.lastUpdated')}: {review.lastUpdated}
      </div>
    </div>
  );
}
