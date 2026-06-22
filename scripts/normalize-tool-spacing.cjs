/**
 * Normalize spacing/sizing in AIHues tool components to the 4/8 rhythm.
 *
 * Run from repo root:
 *   node scripts/normalize-tool-spacing.cjs
 */

const fs = require('fs');
const path = require('path');

const TOOLS_DIR = path.join(__dirname, '../apps/aihues-web/app/components/tools');

// Replacement rules: [regex, replacement]
// All regexes use word boundaries or explicit brackets to avoid partial matches.
const RULES = [
  // 1.5 spacing -> 2 (6px -> 8px)
  [/\bm-1\.5\b/g, 'm-2'],
  [/\bmx-1\.5\b/g, 'mx-2'],
  [/\bmy-1\.5\b/g, 'my-2'],
  [/\bmt-1\.5\b/g, 'mt-2'],
  [/\bmb-1\.5\b/g, 'mb-2'],
  [/\bml-1\.5\b/g, 'ml-2'],
  [/\bmr-1\.5\b/g, 'mr-2'],
  [/\bp-1\.5\b/g, 'p-2'],
  [/\bpx-1\.5\b/g, 'px-2'],
  [/\bpy-1\.5\b/g, 'py-2'],
  [/\bpt-1\.5\b/g, 'pt-2'],
  [/\bpb-1\.5\b/g, 'pb-2'],
  [/\bpl-1\.5\b/g, 'pl-2'],
  [/\bpr-1\.5\b/g, 'pr-2'],
  [/\bgap-1\.5\b/g, 'gap-2'],
  [/\bgap-x-1\.5\b/g, 'gap-x-2'],
  [/\bgap-y-1\.5\b/g, 'gap-y-2'],
  [/\bspace-x-1\.5\b/g, 'space-x-2'],
  [/\bspace-y-1\.5\b/g, 'space-y-2'],

  // 2.5 spacing -> 3 (10px -> 12px)
  [/\bm-2\.5\b/g, 'm-3'],
  [/\bmx-2\.5\b/g, 'mx-3'],
  [/\bmy-2\.5\b/g, 'my-3'],
  [/\bmt-2\.5\b/g, 'mt-3'],
  [/\bmb-2\.5\b/g, 'mb-3'],
  [/\bml-2\.5\b/g, 'ml-3'],
  [/\bmr-2\.5\b/g, 'mr-3'],
  [/\bp-2\.5\b/g, 'p-3'],
  [/\bpx-2\.5\b/g, 'px-3'],
  [/\bpy-2\.5\b/g, 'py-3'],
  [/\bpt-2\.5\b/g, 'pt-3'],
  [/\bpb-2\.5\b/g, 'pb-3'],
  [/\bpl-2\.5\b/g, 'pl-3'],
  [/\bpr-2\.5\b/g, 'pr-3'],
  [/\bgap-2\.5\b/g, 'gap-3'],
  [/\bgap-x-2\.5\b/g, 'gap-x-3'],
  [/\bgap-y-2\.5\b/g, 'gap-y-3'],
  [/\bspace-x-2\.5\b/g, 'space-x-3'],
  [/\bspace-y-2\.5\b/g, 'space-y-3'],

  // fixed heights -> next 4/8 multiple
  [/\bh-11\b/g, 'h-12'],

  // arbitrary radii -> closest design token
  [/\brounded-\[10px\]/g, 'rounded-lg'],
  [/\brounded-\[14px\]/g, 'rounded-2xl'],

  // arbitrary max-widths -> Tailwind tokens
  [/\bmax-w-\[700px\]/g, 'max-w-3xl'],
  [/\bmax-w-\[900px\]/g, 'max-w-4xl'],
];

function normalizeFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf-8');
  let updated = original;
  const changes = [];

  for (const [regex, replacement] of RULES) {
    const matches = updated.match(regex);
    if (matches) {
      updated = updated.replace(regex, replacement);
      changes.push(`${regex.source} -> ${replacement} (${matches.length}x)`);
    }
  }

  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf-8');
    return changes;
  }
  return null;
}

function main() {
  const files = fs
    .readdirSync(TOOLS_DIR)
    .filter((f) => f.endsWith('.tsx'))
    .sort();

  let changedFiles = 0;
  let totalReplacements = 0;

  for (const file of files) {
    const changes = normalizeFile(path.join(TOOLS_DIR, file));
    if (changes) {
      changedFiles++;
      totalReplacements += changes.reduce((sum, c) => {
        const m = c.match(/\((\d+)x\)$/);
        return sum + (m ? Number(m[1]) : 0);
      }, 0);
      console.log(`\n${file}`);
      changes.forEach((c) => console.log(`  ${c}`));
    }
  }

  console.log(`\n✅ Done. ${changedFiles} files changed, ${totalReplacements} replacements.`);
}

main();
