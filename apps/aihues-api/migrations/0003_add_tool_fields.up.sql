-- Add pricing & metadata fields to catalog_item
-- Safe to re-run (IF NOT EXISTS)

ALTER TABLE catalog_item
  ADD COLUMN IF NOT EXISTS price_tag   INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS external_url TEXT,
  ADD COLUMN IF NOT EXISTS tags         TEXT,
  ADD COLUMN IF NOT EXISTS credit_cost  INTEGER NOT NULL DEFAULT 0;

-- Backfill existing tools with default pricing data
-- Developer tools: mostly free
UPDATE catalog_item
  SET price_tag = 1, credit_cost = 0
  WHERE kind = 1 AND category = 1;

-- Utility tools: mostly free, humanize is freemium
UPDATE catalog_item
  SET price_tag = 1, credit_cost = 0
  WHERE kind = 1 AND category = 2 AND slug != 'humanize';
UPDATE catalog_item
  SET price_tag = 2, credit_cost = 10
  WHERE kind = 1 AND category = 2 AND slug = 'humanize';

-- AI Writing tools: mixed
UPDATE catalog_item
  SET price_tag = 1, credit_cost = 0
  WHERE kind = 1 AND category = 3
    AND slug NOT IN ('ad-copy', 'cold-email', 'linkedin', 'lp-hero', 'newsletter', 'yt-script');
UPDATE catalog_item
  SET price_tag = 2, credit_cost = CASE slug
    WHEN 'ad-copy' THEN 15
    WHEN 'cold-email' THEN 10
    WHEN 'linkedin' THEN 10
    WHEN 'lp-hero' THEN 20
    WHEN 'newsletter' THEN 15
    WHEN 'yt-script' THEN 20
  END
  WHERE kind = 1 AND category = 3
    AND slug IN ('ad-copy', 'cold-email', 'linkedin', 'lp-hero', 'newsletter', 'yt-script');

-- Code review & diff-pro are freemium
UPDATE catalog_item
  SET price_tag = 2, credit_cost = 15
  WHERE kind = 1 AND slug = 'code-review';
UPDATE catalog_item
  SET price_tag = 2, credit_cost = 10
  WHERE kind = 1 AND slug = 'diff-pro';

-- Games: free to play
UPDATE catalog_item
  SET price_tag = 1, credit_cost = 0
  WHERE kind = 2;
