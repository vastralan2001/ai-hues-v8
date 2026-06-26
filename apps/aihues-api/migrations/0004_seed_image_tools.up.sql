-- Seed the Image Tools category (category=4) and recategorise image-to-base64.
-- Idempotent: ON CONFLICT (slug) DO UPDATE, safe to re-run.

INSERT INTO catalog_item
  (id, kind, slug, icon, name, description, status, sort_order, category, created_at, updated_at)
VALUES
  (substring(md5('image-to-base64'), 1, 20), 1, 'image-to-base64', '🖼️', 'Image → Base64',   'Image to Base64',                         2, 980, 4, NOW(), NOW()),
  (substring(md5('image-compress'),  1, 20), 1, 'image-compress',  '🗜️', 'Image Compressor',  'Shrink image file size in your browser',  2, 970, 4, NOW(), NOW()),
  (substring(md5('image-convert'),   1, 20), 1, 'image-convert',   '🔄', 'Image Converter',   'Convert between PNG, JPEG and WebP',       2, 969, 4, NOW(), NOW()),
  (substring(md5('image-resize'),    1, 20), 1, 'image-resize',    '📐', 'Image Resizer',     'Resize images by pixels or percentage',   2, 968, 4, NOW(), NOW()),
  (substring(md5('image-crop'),      1, 20), 1, 'image-crop',      '✂️', 'Image Cropper',     'Crop, zoom and rotate images',            2, 967, 4, NOW(), NOW()),
  (substring(md5('exif-viewer'),     1, 20), 1, 'exif-viewer',     '🧭', 'EXIF Viewer',       'Inspect and strip photo metadata',        2, 966, 4, NOW(), NOW())

ON CONFLICT (slug) DO UPDATE SET
  icon        = EXCLUDED.icon,
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  status      = EXCLUDED.status,
  sort_order  = EXCLUDED.sort_order,
  category    = EXCLUDED.category,
  updated_at  = NOW();
