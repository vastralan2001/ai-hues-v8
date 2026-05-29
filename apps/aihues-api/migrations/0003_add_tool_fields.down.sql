-- Rollback: remove pricing & metadata fields

ALTER TABLE catalog_item
  DROP COLUMN IF EXISTS price_tag,
  DROP COLUMN IF EXISTS external_url,
  DROP COLUMN IF EXISTS tags,
  DROP COLUMN IF EXISTS credit_cost;
