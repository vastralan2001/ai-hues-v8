'use client';

import Link from 'next/link';
import { t, type Locale } from '@/lib/dict';

const RELATED_MAP: Record<string, string[]> = {
  'base64': ['url-encode', 'jwt', 'sha256'],
  'url-encode': ['base64', 'jwt', 'html-entity'],
  'jwt': ['base64', 'json', 'sha256'],
  'json': ['csv-json', 'jwt', 'markdown'],
  'sha256': ['base64', 'jwt', 'password-gen'],
  'csv-json': ['json', 'markdown', 'sql'],
  'markdown': ['json', 'html-entity', 'csv-json'],
  'html-entity': ['url-encode', 'markdown', 'fullwidth'],
  'regex': ['diff', 'shell', 'code-explain'],
  'diff': ['diff-pro', 'regex', 'json'],
  'diff-pro': ['diff', 'regex', 'json'],
  'timestamp': ['uuid', 'cron-parser', 'pomodoro'],
  'uuid': ['timestamp', 'password-gen', 'qrcode'],
  'password-gen': ['uuid', 'sha256', 'jwt'],
  'cron-parser': ['timestamp', 'shell', 'pomodoro'],
  'shell': ['code-explain', 'cron-parser', 'regex'],
  'code-explain': ['shell', 'sql', 'regex'],
  'sql': ['csv-json', 'code-explain', 'json'],
  'git-commit': ['pr-desc', 'changelog', 'code-review'],
  'css-gradient': ['color-convert', 'image-to-base64', 'meta'],
  'base-convert': ['uuid', 'timestamp', 'unit-convert'],
  'pseudo': ['code-explain', 'shell', 'sql'],
  'http-status': ['curl-gen', 'meta', 'ip-lookup'],
  'curl-gen': ['http-status', 'shell', 'ip-lookup'],
  'ip-lookup': ['curl-gen', 'http-status', 'meta'],
  'qrcode': ['uuid', 'image-to-base64', 'meta'],
  'meta': ['seo-title', 'http-status', 'qrcode'],
  'pomodoro': ['timestamp', 'cron-parser', 'unit-convert'],
  'unit-convert': ['base-convert', 'pomodoro', 'timestamp'],
  'chi-squared': ['base-convert', 'unit-convert', 'cron-parser'],

  'word-count': ['readability', 'lorem-ipsum', 'title-case'],
  'lorem-ipsum': ['word-count', 'readability', 'markdown'],
  'readability': ['word-count', 'lorem-ipsum', 'humanize'],
  'seo-title': ['meta', 'ad-copy', 'tagline'],
  'title-case': ['word-count', 'fullwidth', 'lorem-ipsum'],
  'fullwidth': ['html-entity', 'title-case', 'markdown'],
  'tldr': ['humanize', 'readability', 'blog-outline'],
  'blog-outline': ['tldr', 'newsletter', 'yt-script'],
  'linkedin': ['x-post', 'cold-email', 'ad-copy'],
  'x-post': ['linkedin', 'tagline', 'ad-copy'],
  'video-title': ['yt-script', 'ad-copy', 'seo-title'],
  'yt-script': ['video-title', 'blog-outline', 'newsletter'],
  'ad-copy': ['tagline', 'x-post', 'seo-title'],
  'tagline': ['ad-copy', 'lp-hero', 'seo-title'],
  'cold-email': ['newsletter', 'linkedin', 'pr-desc'],
  'newsletter': ['cold-email', 'blog-outline', 'yt-script'],
  'lp-hero': ['tagline', 'ad-copy', 'faq'],
  'pr-desc': ['git-commit', 'changelog', 'code-review'],
  'code-review': ['pr-desc', 'git-commit', 'changelog'],
  'changelog': ['pr-desc', 'git-commit', 'code-review'],
  'faq': ['lp-hero', 'blog-outline', 'newsletter'],
  'alt-text': ['image-to-base64', 'seo-title', 'meta'],
  'humanize': ['readability', 'tldr', 'word-count'],
  'docs': ['code-explain', 'shell', 'pseudo'],

  'color-convert': ['css-gradient', 'image-to-base64', 'meta'],
  'image-to-base64': ['color-convert', 'css-gradient', 'qrcode'],

  'push': ['curl-gen', 'http-status', 'meta'],
};

export default function RelatedTools({ slug, locale }: { slug: string; locale: Locale }) {
  const related = RELATED_MAP[slug];
  if (!related || related.length === 0) return null;

  return (
    <div className='mx-auto max-w-[900px] px-6 pb-20 pt-10 md:px-7'>
      <h3 className='mb-4 text-lg font-bold text-[#1c1917]'>
        {locale === 'zh' ? '相关工具' : 'Related Tools'}
      </h3>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3'>
        {related.map((s) => {
          const dictKey = s.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
          const title = t(locale, `tool.${dictKey}.title`);
          const isFallback = title === `tool.${dictKey}.title`;
          return (
            <Link
              key={s}
              href={`/tools/${s}`}
              className='rounded-[12px] border border-[#e8e2d9] bg-white px-5 py-4 transition-all hover:border-[#d97706] hover:shadow-[0_2px_8px_rgba(180,83,9,0.08)]'
            >
              <p className='text-sm font-semibold text-[#1c1917]'>
                {isFallback ? s : title}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
