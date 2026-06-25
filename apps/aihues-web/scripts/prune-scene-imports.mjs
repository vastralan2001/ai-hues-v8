import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Prune unused names from each scene's `import { ... } from './_kit'` line.
const dir = 'app/components/story-scenes';
const files = readdirSync(dir).filter(
  (f) => f.endsWith('.tsx') && f !== '_kit.tsx'
);
let changed = 0;
for (const f of files) {
  const p = join(dir, f);
  let s = readFileSync(p, 'utf8');
  const m = s.match(/import\s*\{([^}]*)\}\s*from\s*['"]\.\/_kit['"];/);
  if (!m) continue;
  const names = m[1]
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
  const body = s.replace(m[0], '');
  const used = names.filter((n) => {
    const esc = n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('\\b' + esc + '\\b').test(body);
  });
  if (used.length !== names.length) {
    const repl = used.length
      ? `import { ${used.join(', ')} } from './_kit';`
      : '';
    s = s.replace(m[0], repl);
    writeFileSync(p, s);
    changed++;
  }
}
console.log('pruned imports in ' + changed + ' files');
