import { readFileSync, writeFileSync } from 'fs';

/* One-shot: align every page's main content container to the site nav standard
   (header/footer use mx-auto max-w-[1760px] + px-[clamp(1.5rem,5vw,7rem)]), so
   all aggregation / detail / other pages share the same left/right edges as the
   masthead and footer. Only top-level container lines (mx-auto + a page-width
   max-w) are touched; inner reading columns keep their own widths. */

const FILES = [
  'app/components/PageMasthead.tsx',
  'app/components/GamesBrowser.tsx',
  'app/search/SearchContent.tsx',
  'app/about/page.tsx',
  'app/pricing/page.tsx',
  'app/stories/[slug]/page.tsx',
  'app/games/[slug]/page.tsx',
  'app/components/reviews/ToolDetailTabs.tsx',
  'app/stories/StoriesContent.tsx',
  'app/tools/page.tsx',
  'app/tests/page.tsx',
  'app/tests/[slug]/page.tsx',
];

const PAD = 'px-[clamp(1.5rem,5vw,7rem)]';
const CONTAINER_W = /max-w-\[(1320|1300|1100|1080)px\]/;

let total = 0;
for (const file of FILES) {
  let s = readFileSync(file, 'utf8');
  const lines = s.split(/\r?\n/);
  let n = 0;
  const out = lines.map((line) => {
    if (!/\bmx-auto\b/.test(line) || !CONTAINER_W.test(line)) return line;
    let l = line.replace(CONTAINER_W, 'max-w-[1760px]');
    if (!/\bw-full\b/.test(l)) l = l.replace('mx-auto', 'mx-auto w-full');
    // drop existing horizontal padding (incl. responsive variants), add clamp
    l = l
      .replace(/\b(?:sm:|md:|lg:|xl:)?px-\d+(?:\.\d+)?\b/g, '')
      .replace(/\bmax-w-\[1760px\]/, `max-w-[1760px] ${PAD}`)
      .replace(/\s{2,}/g, ' ')
      .replace(/\s+'/g, "'");
    n++;
    return l;
  });
  if (n) {
    writeFileSync(file, out.join('\n'));
    total += n;
  }
  console.log(`${file} — ${n} container(s) aligned`);
}
console.log(`total containers aligned: ${total}`);
