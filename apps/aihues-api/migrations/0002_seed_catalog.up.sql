-- Seed initial catalog items (tools + games).
-- ID: substring(md5(slug), 1, 20) — deterministic 20-char hex, consistent with xid length.
-- Idempotent: ON CONFLICT (slug) DO UPDATE, safe to re-run after data changes.

INSERT INTO catalog_item
  (id, kind, slug, icon, name, description, status, sort_order, category, created_at, updated_at)
VALUES
  -- ===== Developer tools (category=1) =====
  (substring(md5('jwt'),             1, 20), 1, 'jwt',             '🔐', 'JWT Parser',       'Parse JWT tokens',            2, 1000, 1, NOW(), NOW()),
  (substring(md5('json'),            1, 20), 1, 'json',            '📋', 'JSON Formatter',   'Format & validate JSON',       2,  999, 1, NOW(), NOW()),
  (substring(md5('regex'),           1, 20), 1, 'regex',           '🔍', 'Regex Tester',     'Test regular expressions',     2,  998, 1, NOW(), NOW()),
  (substring(md5('uuid'),            1, 20), 1, 'uuid',            '🆔', 'UUID Generator',   'Generate UUID v4',             2,  997, 1, NOW(), NOW()),
  (substring(md5('timestamp'),       1, 20), 1, 'timestamp',       '⏱️', 'Timestamp',        'Unix timestamp converter',     2,  996, 1, NOW(), NOW()),
  (substring(md5('base64'),          1, 20), 1, 'base64',          '🔢', 'Base64',            'Base64 encode/decode',         2,  995, 1, NOW(), NOW()),
  (substring(md5('sha256'),          1, 20), 1, 'sha256',          '🔒', 'SHA256 Hash',       'SHA-256/SHA-1/MD5',            2,  994, 1, NOW(), NOW()),
  (substring(md5('sql'),             1, 20), 1, 'sql',             '🗄️', 'SQL Formatter',    'Format SQL queries',           2,  993, 1, NOW(), NOW()),
  (substring(md5('url-encode'),      1, 20), 1, 'url-encode',      '🔗', 'URL Encode',        'URL encode/decode',            2,  992, 1, NOW(), NOW()),
  (substring(md5('base-convert'),    1, 20), 1, 'base-convert',    '🔢', 'Base Converter',    'Binary/octal/dec/hex',         2,  991, 1, NOW(), NOW()),
  (substring(md5('password-gen'),    1, 20), 1, 'password-gen',    '🔑', 'Password Gen',      'Secure password gen',          2,  990, 1, NOW(), NOW()),
  (substring(md5('http-status'),     1, 20), 1, 'http-status',     '🌐', 'HTTP Status',       'Status code reference',        2,  989, 1, NOW(), NOW()),
  (substring(md5('html-entity'),     1, 20), 1, 'html-entity',     '◈',  'HTML Entity',       'Entity & Unicode',             2,  988, 1, NOW(), NOW()),
  (substring(md5('cron-parser'),     1, 20), 1, 'cron-parser',     '⏰', 'Cron Parser',       'Parse cron expressions',       2,  987, 1, NOW(), NOW()),
  (substring(md5('code-explain'),    1, 20), 1, 'code-explain',    '💻', 'Code Explain',      'Explain code',                 2,  986, 1, NOW(), NOW()),
  (substring(md5('code-review'),     1, 20), 1, 'code-review',     '👁️', 'Code Review',      'Review code',                  2,  985, 1, NOW(), NOW()),
  (substring(md5('shell'),           1, 20), 1, 'shell',           '🐚', 'Shell Gen',         'Generate shell commands',      2,  984, 1, NOW(), NOW()),
  (substring(md5('git-commit'),      1, 20), 1, 'git-commit',      '📌', 'Git Commit',        'Git commit messages',          2,  983, 1, NOW(), NOW()),
  (substring(md5('ip-lookup'),       1, 20), 1, 'ip-lookup',       '🔍', 'IP Lookup',         'IP geolocation lookup',        2,  982, 1, NOW(), NOW()),
  (substring(md5('curl-gen'),        1, 20), 1, 'curl-gen',        '🌐', 'Curl Gen',          'Generate curl commands',       2,  981, 1, NOW(), NOW()),
  (substring(md5('image-to-base64'),1, 20), 1, 'image-to-base64', '🖼️', 'Image → Base64',   'Image to Base64',              2,  980, 1, NOW(), NOW()),
  (substring(md5('css-gradient'),    1, 20), 1, 'css-gradient',    '🌈', 'CSS Gradient',      'CSS gradient gen',             2,  979, 1, NOW(), NOW()),
  (substring(md5('color-convert'),   1, 20), 1, 'color-convert',   '🎨', 'Color Converter',   'HEX/RGB/HSL/CMYK',            2,  978, 1, NOW(), NOW()),
  (substring(md5('csv-json'),        1, 20), 1, 'csv-json',        '📊', 'CSV ↔ JSON',        'CSV/JSON convert',             2,  977, 1, NOW(), NOW()),
  (substring(md5('diff-pro'),        1, 20), 1, 'diff-pro',        '📑', 'Diff Pro',          'Advanced text diff',           2,  976, 1, NOW(), NOW()),
  (substring(md5('unit-convert'),    1, 20), 1, 'unit-convert',    '📐', 'Unit Convert',      'Unit converter',               2,  975, 1, NOW(), NOW()),
  (substring(md5('qrcode'),          1, 20), 1, 'qrcode',          '📱', 'QR Code',           'Generate QR codes',            2,  974, 1, NOW(), NOW()),
  (substring(md5('markdown'),        1, 20), 1, 'markdown',        '📝', 'Markdown',          'Live MD preview',              2,  973, 1, NOW(), NOW()),
  (substring(md5('pomodoro'),        1, 20), 1, 'pomodoro',        '🍅', 'Pomodoro',          'Focus timer',                  2,  972, 1, NOW(), NOW()),
  (substring(md5('chi-squared'),     1, 20), 1, 'chi-squared',     '📊', 'Chi-Squared',       'A/B test calculator',          2,  971, 1, NOW(), NOW()),

  -- ===== Utility tools (category=2) =====
  (substring(md5('word-count'),      1, 20), 1, 'word-count',      '📊', 'Word Counter',      'Word & char count',            2,  800, 2, NOW(), NOW()),
  (substring(md5('diff'),            1, 20), 1, 'diff',            '📑', 'Diff Checker',      'Compare text diffs',           2,  799, 2, NOW(), NOW()),
  (substring(md5('fullwidth'),       1, 20), 1, 'fullwidth',       '↔️', 'Fullwidth',         'Width converter',              2,  798, 2, NOW(), NOW()),
  (substring(md5('title-case'),      1, 20), 1, 'title-case',      '📰', 'Title Case',        '12 format types',              2,  797, 2, NOW(), NOW()),
  (substring(md5('readability'),     1, 20), 1, 'readability',     '📖', 'Readability',       'Text readability',             2,  796, 2, NOW(), NOW()),
  (substring(md5('humanize'),        1, 20), 1, 'humanize',        '✨', 'Humanize',          'De-AI text',                   2,  795, 2, NOW(), NOW()),
  (substring(md5('lorem-ipsum'),     1, 20), 1, 'lorem-ipsum',     '📝', 'Lorem Ipsum',       'Random text generator',        2,  794, 2, NOW(), NOW()),
  (substring(md5('seo-title'),       1, 20), 1, 'seo-title',       '🔍', 'SEO Title',         'SEO title generator',          2,  793, 2, NOW(), NOW()),

  -- ===== AI Writing tools (category=3) =====
  (substring(md5('ad-copy'),         1, 20), 1, 'ad-copy',         '📢', 'Ad Copy',           '3 ad sets with title+body+CTA',2,  600, 3, NOW(), NOW()),
  (substring(md5('alt-text'),        1, 20), 1, 'alt-text',        '🖼️', 'Alt Text',          'SEO alt text generator',       2,  599, 3, NOW(), NOW()),
  (substring(md5('blog-outline'),    1, 20), 1, 'blog-outline',    '📝', 'Blog Outline',      '6-section blog outline',       2,  598, 3, NOW(), NOW()),
  (substring(md5('changelog'),       1, 20), 1, 'changelog',       '📋', 'Changelog',         'Categorized changelog',        2,  597, 3, NOW(), NOW()),
  (substring(md5('cold-email'),      1, 20), 1, 'cold-email',      '📧', 'Cold Email',        '3 outreach templates',         2,  596, 3, NOW(), NOW()),
  (substring(md5('docs'),            1, 20), 1, 'docs',            '📚', 'Docs',              'API docs + params + examples', 2,  595, 3, NOW(), NOW()),
  (substring(md5('faq'),             1, 20), 1, 'faq',             '❓', 'FAQ',               '8 FAQ Q&A',                    2,  594, 3, NOW(), NOW()),
  (substring(md5('linkedin'),        1, 20), 1, 'linkedin',        '💼', 'LinkedIn',          '3 post formats',               2,  593, 3, NOW(), NOW()),
  (substring(md5('lp-hero'),         1, 20), 1, 'lp-hero',         '🎯', 'LP Hero',           'Landing page hero copy',       2,  592, 3, NOW(), NOW()),
  (substring(md5('meta'),            1, 20), 1, 'meta',            '🏷️', 'Meta',              'SEO meta HTML',                2,  591, 3, NOW(), NOW()),
  (substring(md5('newsletter'),      1, 20), 1, 'newsletter',      '📰', 'Newsletter',        'Full newsletter structure',    2,  590, 3, NOW(), NOW()),
  (substring(md5('pr-desc'),         1, 20), 1, 'pr-desc',         '🔀', 'PR Desc',           'PR template + checklist',      2,  589, 3, NOW(), NOW()),
  (substring(md5('pseudo'),          1, 20), 1, 'pseudo',          '🎭', 'Pseudo',            'Pseudocode generator',         2,  588, 3, NOW(), NOW()),
  (substring(md5('push'),            1, 20), 1, 'push',            '🔔', 'Push',              '4 push notification copies',   2,  587, 3, NOW(), NOW()),
  (substring(md5('tagline'),         1, 20), 1, 'tagline',         '✒️', 'Tagline',           '8 brand taglines',             2,  586, 3, NOW(), NOW()),
  (substring(md5('tldr'),            1, 20), 1, 'tldr',            '📄', 'TL;DR',             'Summary + key extract',        2,  585, 3, NOW(), NOW()),
  (substring(md5('video-title'),     1, 20), 1, 'video-title',     '🎬', 'Video Title',       '8 YouTube titles',             2,  584, 3, NOW(), NOW()),
  (substring(md5('x-post'),          1, 20), 1, 'x-post',          '𝕏',  'X Post',            '3 X post formats',             2,  583, 3, NOW(), NOW()),
  (substring(md5('yt-script'),       1, 20), 1, 'yt-script',       '🎥', 'YT Script',         'YouTube script',               2,  582, 3, NOW(), NOW()),

  -- ===== Games (category=0) =====
  (substring(md5('daily-luck'),      1, 20), 2, 'daily-luck',      '📅', 'Daily Fortune',     'Draw your daily fortune — get wisdom, lucky color & Credit rewards. Streak bonuses unlocked!', 2, 300, 0, NOW(), NOW()),
  (substring(md5('slot-machine'),    1, 20), 2, 'slot-machine',    '🎰', 'Lucky Slots',       'Classic 3×3 slot machine. 3 free spins daily. Hit triple 7s for the jackpot!',               2, 299, 0, NOW(), NOW()),
  (substring(md5('basketball'),      1, 20), 2, 'basketball',      '🏀', 'Hoops Challenge',   '60-second basketball challenge. Swipe to control power & angle. Compete for the high score!',  2, 298, 0, NOW(), NOW())

ON CONFLICT (slug) DO UPDATE SET
  icon        = EXCLUDED.icon,
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  status      = EXCLUDED.status,
  sort_order  = EXCLUDED.sort_order,
  category    = EXCLUDED.category,
  updated_at  = NOW();
