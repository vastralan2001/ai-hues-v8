'use client';

import { useState } from 'react';
import Link from 'next/link';
import RadarChart from '@/components/reviews/RadarChart';
import {
  type ToolReview,
  DIMENSION_LABELS,
  DIMENSION_LABELS_EN,
  DIMENSION_WEIGHTS,
  starRating,
} from '@/lib/reviews';
import { type ToolData } from '@/lib/tool-data';

export default function ComparisonClient({
  reviews,
  tools,
}: {
  reviews: ToolReview[];
  tools: ToolData[];
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (slug: string) => {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 4) return prev;
      return [...prev, slug];
    });
  };

  const selectedReviews = selected
    .map((s) => reviews.find((r) => r.slug === s))
    .filter((r): r is ToolReview => r != null);

  const selectedTools = selected
    .map((s) => tools.find((t) => t.slug === s))
    .filter((t): t is ToolData => t != null);

  const dimKeys = Object.keys(DIMENSION_LABELS) as Array<
    keyof typeof DIMENSION_LABELS
  >;

  return (
    <div className='space-y-8'>
      {/* Selector */}
      <div className='rounded-xl border border-[#e7e5e4] bg-white p-4'>
        <h3 className='mb-3 text-[14px] font-bold text-[#1c1917]'>
          Select tools to compare ({selected.length}/4)
        </h3>
        <div className='flex flex-wrap gap-2'>
          {tools.map((t) => {
            const isSelected = selected.includes(t.slug);
            return (
              <button
                className={`rounded-full border px-3 py-1.5 text-[12px] transition-all ${
                  isSelected
                    ? 'border-[#b45309] bg-[rgba(180,83,9,0.08)] font-semibold text-[#b45309]'
                    : 'border-[#e7e5e4] bg-white text-[#57534e] hover:border-[#b45309]'
                }`}
                key={t.slug}
                onClick={() => toggle(t.slug)}
              >
                {t.icon} {t.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison result */}
      {selectedReviews.length >= 2 && (
        <>
          {/* Radar overlay */}
          <div className='rounded-xl border border-[#e7e5e4] bg-white p-6'>
            <h3 className='mb-4 text-[16px] font-bold text-[#1c1917]'>
              Radar Chart Comparison
            </h3>
            <div className='flex flex-wrap justify-center gap-6'>
              {selectedReviews.map((r, idx) => {
                const colors = ['#b45309', '#2563eb', '#16a34a', '#9333ea'];
                const data = dimKeys.map((k) => r.dimensions[k]);
                const labels = dimKeys.map((k) => DIMENSION_LABELS_EN[k]);
                return (
                  <div className='text-center' key={r.slug}>
                    <RadarChart
                      data={data}
                      labels={labels}
                      primaryColor={colors[idx % colors.length]}
                      size={200}
                    />
                    <div
                      className='mt-2 text-[13px] font-bold'
                      style={{ color: colors[idx % colors.length] }}
                    >
                      {selectedTools.find((t) => t.slug === r.slug)?.name ??
                        r.slug}
                    </div>
                    <div className='text-[12px] text-[#b45309]'>
                      {starRating(r.overall)} {r.overall}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <div className='overflow-x-auto rounded-xl border border-[#e7e5e4] bg-white'>
            <table className='w-full text-[13px]'>
              <thead>
                <tr className='border-b border-[#e7e5e4] bg-[#fafaf9]'>
                  <th className='px-4 py-3 text-left font-bold text-[#1c1917]'>
                    Dimension
                  </th>
                  {selectedTools.map((t) => (
                    <th
                      className='px-4 py-3 text-center font-bold text-[#1c1917]'
                      key={t.slug}
                    >
                      {t.icon} {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dimKeys.map((key) => (
                  <tr className='border-b border-[#f5f5f4]' key={key}>
                    <td className='px-4 py-2.5 font-medium text-[#57534e]'>
                      {DIMENSION_LABELS[key]}
                      <span className='ml-1 text-[10px] text-[#a8a29e]'>
                        ({Math.round(DIMENSION_WEIGHTS[key] * 100)}%)
                      </span>
                    </td>
                    {selectedReviews.map((r) => (
                      <td
                        className='px-4 py-2.5 text-center'
                        key={r.slug + key}
                      >
                        <span
                          className={`font-bold ${
                            r.dimensions[key] >= 4.5
                              ? 'text-[#15803d]'
                              : r.dimensions[key] >= 3.5
                                ? 'text-[#b45309]'
                                : 'text-[#78716c]'
                          }`}
                        >
                          {r.dimensions[key]}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className='bg-[#fafaf9]'>
                  <td className='px-4 py-2.5 font-bold text-[#1c1917]'>
                    Overall
                  </td>
                  {selectedReviews.map((r) => (
                    <td
                      className='px-4 py-2.5 text-center font-bold text-[#b45309]'
                      key={r.slug + 'overall'}
                    >
                      {r.overall} {starRating(r.overall)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Verdict cards */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {selectedReviews.map((r) => {
              const tool = selectedTools.find((t) => t.slug === r.slug);
              return (
                <div
                  className='rounded-xl border border-[#e7e5e4] bg-white p-4'
                  key={r.slug}
                >
                  <div className='mb-2 flex items-center gap-2'>
                    <span className='text-[18px]'>{tool?.icon}</span>
                    <span className='font-bold text-[#1c1917]'>
                      {tool?.name}
                    </span>
                    <span className='ml-auto font-bold text-[#b45309]'>
                      {r.overall} ★
                    </span>
                  </div>
                  <p className='text-[12px] leading-relaxed text-[#57534e]'>
                    {r.verdict}
                  </p>
                  <Link
                    className='mt-2 inline-block text-[12px] font-semibold text-[#b45309] hover:underline'
                    href={`/tools/${r.slug}`}
                  >
                    查看完整评测 →
                  </Link>
                </div>
              );
            })}
          </div>
        </>
      )}

      {selectedReviews.length > 0 && selectedReviews.length < 2 && (
        <div className='rounded-xl border border-[#e7e5e4] bg-[#fafaf9] p-8 text-center text-[14px] text-[#78716c]'>
          请再选择至少 1 个工具开始对比
        </div>
      )}
    </div>
  );
}
