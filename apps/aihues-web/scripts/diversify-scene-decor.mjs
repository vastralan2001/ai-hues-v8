import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/* One-shot diversifier: the generated scenes all opened with the same ambient
   recipe (2 Twinkle + 1 Cloud), which read as visual clutter across the grid.
   This assigns each scene a deterministic ambient "profile" by slug hash so the
   set varies card-to-card — many clean, some a single sparkle or cloud, a few
   swapped for a Star / Sun / Bolt. Content RoughDash trails are left alone.
   Run once; then prune-scene-imports.mjs + prettier. */

const dir = 'app/components/story-scenes';
const files = readdirSync(dir).filter(
  (f) => f.endsWith('.tsx') && f !== '_kit.tsx' && f !== 'registry.ts'
);

// 12 buckets — weighted toward "lighter / clean" while keeping variety.
const PROFILES = [
  'none',
  'none',
  'none',
  'tw1',
  'tw1',
  'cl1',
  'tw1cl1',
  'tw2',
  'star',
  'sun',
  'bolt',
  'keep',
];

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
const num = (line, key) => {
  const m = line.match(new RegExp(`${key}=\\{([-0-9.]+)\\}`));
  return m ? Number(m[1]) : undefined;
};
const col = (line) => {
  const m = line.match(/c=['"]([^'"]+)['"]/);
  return m ? m[1] : undefined;
};
const seedOf = (x, y) => Math.round(Math.abs(x) * 5 + Math.abs(y) * 2) + 1;

let changed = 0;
const dist = {};
for (const f of files) {
  const slug = f.replace(/\.tsx$/, '');
  const profile = PROFILES[hash(slug) % PROFILES.length];
  dist[profile] = (dist[profile] || 0) + 1;
  if (profile === 'keep') continue;

  let s = readFileSync(join(dir, f), 'utf8');
  const lines = s.split(/\r?\n/);
  const twIdx = [];
  const clIdx = [];
  lines.forEach((ln, i) => {
    if (/^\s*<Twinkle\b[^>]*\/>\s*$/.test(ln)) twIdx.push(i);
    if (/^\s*<Cloud\b[^>]*\/>\s*$/.test(ln)) clIdx.push(i);
  });
  if (twIdx.length === 0 && clIdx.length === 0) continue;

  const indent = (i) => (lines[i].match(/^\s*/) || [''])[0];
  const drop = new Set();
  const needImport = new Set();

  const keepTw = (n) => twIdx.slice(0, n);
  const keepCl = (n) => clIdx.slice(0, n);

  const apply = (keptTw, keptCl) => {
    const ks = new Set([...keptTw, ...keptCl]);
    [...twIdx, ...clIdx].forEach((i) => {
      if (!ks.has(i)) drop.add(i);
    });
  };

  const swapAt = (i, build, sym) => {
    const x = num(lines[i], 'x');
    const y = num(lines[i], 'y');
    if (x === undefined || y === undefined) return false;
    lines[i] = indent(i) + build(x, y, col(lines[i]));
    needImport.add(sym);
    return true;
  };

  switch (profile) {
    case 'none':
      apply([], []);
      break;
    case 'tw1':
      apply(keepTw(1), []);
      break;
    case 'cl1':
      apply([], keepCl(1));
      break;
    case 'tw1cl1':
      apply(keepTw(1), keepCl(1));
      break;
    case 'tw2':
      apply(keepTw(2), []);
      break;
    case 'star':
      if (
        twIdx.length &&
        swapAt(
          twIdx[0],
          (x, y) => `<Star x={${x}} y={${y}} r={3.4} seed={${seedOf(x, y)}} />`,
          'Star'
        )
      ) {
        apply([twIdx[0]], []);
      } else apply([], keepCl(1));
      break;
    case 'sun': {
      const target = clIdx.length ? clIdx[0] : twIdx[0];
      if (
        target !== undefined &&
        swapAt(
          target,
          (x, y) => `<Sun x={${x}} y={${y}} r={6} seed={${seedOf(x, y)}} />`,
          'Sun'
        )
      ) {
        apply(
          target === twIdx[0] ? [twIdx[0]] : [],
          target === clIdx[0] ? [clIdx[0]] : []
        );
      } else apply(keepTw(1), []);
      break;
    }
    case 'bolt':
      if (
        twIdx.length &&
        swapAt(
          twIdx[0],
          (x, y, c) =>
            `<Bolt x={${x}} y={${y}} s={0.9}${c ? ` c='${c}'` : ''} seed={${seedOf(x, y)}} />`,
          'Bolt'
        )
      ) {
        apply([twIdx[0]], []);
      } else apply([], keepCl(1));
      break;
  }

  if (!drop.size && !needImport.size) continue;

  const kept = lines.filter((_, i) => !drop.has(i));
  s = kept.join('\n');

  // add any swapped-in symbol to the _kit import
  if (needImport.size) {
    const m = s.match(/import\s*\{([^}]*)\}\s*from\s*['"]\.\/_kit['"];/);
    if (m) {
      const names = new Set(
        m[1]
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean)
      );
      needImport.forEach((n) => names.add(n));
      s = s.replace(m[0], `import { ${[...names].join(', ')} } from './_kit';`);
    }
  }

  writeFileSync(join(dir, f), s);
  changed++;
}

console.log('diversified ' + changed + ' scenes');
console.log('profile distribution:', JSON.stringify(dist));
