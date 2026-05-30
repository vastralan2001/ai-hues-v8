import type { MetadataRoute } from 'next';

const BASE_URL = 'https://aihues.com';

const STATIC_PATHS = [
  '',
  '/tools',
  '/games',
  '/blog',
  '/pricing',
  '/showcase',
  '/discover',
  '/ranking',
];

const TOOL_SLUGS = [
  'word-count', 'base64', 'url-encode', 'uuid', 'jwt', 'json',
  'sha256', 'lorem-ipsum', 'timestamp', 'html-entity', 'fullwidth',
  'password-gen', 'regex', 'diff', 'csv-json', 'color-convert',
  'title-case', 'git-commit', 'readability', 'pomodoro', 'curl-gen',
  'http-status', 'unit-convert', 'markdown', 'meta', 'tldr',
  'image-to-base64', 'pr-desc', 'code-review', 'changelog',
  'seo-title', 'push', 'base-convert', 'cron-parser', 'faq',
  'sql', 'tagline', 'cold-email', 'newsletter', 'x-post',
  'video-title', 'yt-script', 'ad-copy', 'shell', 'code-explain',
  'humanize', 'ip-lookup', 'docs', 'alt-text', 'blog-outline',
  'linkedin', 'lp-hero', 'css-gradient', 'pseudo', 'diff-pro',
  'qrcode', 'chi-squared',
];

const BLOG_SLUGS = [
  'growth-tools-2026',
  'reddit-marketing',
  'kol-marketing',
  'ai-content-strategy',
  'seo-2026-trends',
  'twitter-growth',
  'no-code-mvp',
  'ai-productivity-stack',
  'indie-dev-monetization',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = STATIC_PATHS.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: path === '' ? 1.0 : 0.8,
  }));

  const tools = TOOL_SLUGS.map((slug) => ({
    url: `${BASE_URL}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const blog = BLOG_SLUGS.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...tools, ...blog];
}
