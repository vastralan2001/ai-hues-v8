-- Revert image tools: drop the new ones, restore image-to-base64 to developer.
DELETE FROM catalog_item
WHERE slug IN (
  'image-compress', 'image-convert', 'image-resize', 'image-crop', 'exif-viewer'
);

UPDATE catalog_item SET category = 1, updated_at = NOW()
WHERE slug = 'image-to-base64';
