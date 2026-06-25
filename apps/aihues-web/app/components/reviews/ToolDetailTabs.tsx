'use client';

import type { Locale } from '@/lib/dict';
import { getToolBySlug } from '@/lib/tool-data';

import BrandBackdrop from '@/components/BrandBackdrop';
import Breadcrumb from '@/components/Breadcrumb';
import ShareButtons from '@/components/ShareButtons';

export default function ToolDetailTabs({
  slug,
  locale,
  toolElement,
}: {
  slug: string;
  locale: Locale;
  toolElement: React.ReactNode;
}) {
  const tool = getToolBySlug(slug);
  const label = tool?.name ?? slug;

  return (
    <div className='relative isolate'>
      <BrandBackdrop />
      <div className='mx-auto w-full max-w-[1760px] px-[clamp(1.5rem,5vw,7rem)] pb-8 pt-6'>
        <div className='flex items-center justify-between gap-4'>
          <Breadcrumb
            items={[
              { label: locale === 'zh' ? '首页' : 'Home', href: '/' },
              { label: locale === 'zh' ? '工具' : 'Tools', href: '/tools' },
              { label },
            ]}
          />
          <ShareButtons className='shrink-0' title={label} />
        </div>
        {toolElement}
      </div>
    </div>
  );
}
