DELETE FROM catalog_item
WHERE slug IN (
  -- Developer tools
  'jwt', 'json', 'regex', 'uuid', 'timestamp', 'base64', 'sha256', 'sql',
  'url-encode', 'base-convert', 'password-gen', 'http-status', 'html-entity',
  'cron-parser', 'code-explain', 'code-review', 'shell', 'git-commit',
  'ip-lookup', 'curl-gen', 'image-to-base64', 'css-gradient', 'color-convert',
  'csv-json', 'diff-pro', 'unit-convert', 'qrcode', 'markdown', 'pomodoro', 'chi-squared',
  -- Utility tools
  'word-count', 'diff', 'fullwidth', 'title-case', 'readability',
  'humanize', 'lorem-ipsum', 'seo-title',
  -- AI Writing tools
  'ad-copy', 'alt-text', 'blog-outline', 'changelog', 'cold-email', 'docs',
  'faq', 'linkedin', 'lp-hero', 'meta', 'newsletter', 'pr-desc', 'pseudo',
  'push', 'tagline', 'tldr', 'video-title', 'x-post', 'yt-script',
  -- Games
  'daily-luck', 'slot-machine', 'basketball'
);
