import { readFileSync, writeFileSync } from 'fs';

/* One-shot: reshape the 4 Kimi paper articles to the aihues detail-page contract.
   The detail page (app/stories/[slug]/page.tsx) renders its OWN header (tag, H1,
   date, hero) and appends Newsletter/Related, then injects only the inner HTML
   of <div class="article-content"> — styled by app/stories/article.css, which
   styles plain h2/h3/p/ul/table/a (+ .tip/.warning/.cta-box) but NONE of the
   skill's custom wrappers (article-header, paper-box, paper-links, paper-cite,
   cta-box marketing). Those rendered as raw unstyled text + a duplicate header.

   Fix per file: pull the standalone header out of article-content, drop every
   CTA/paper wrapper, and emit one clean plain-<p> source citation at the top. */

const FILES = [
  'public/resources/kimi-k2-open-agentic-intelligence-explained.html',
  'public/resources/kimi-k2-thinking-the-reasoning-model-explained.html',
  'public/resources/kimi-k2-6-open-source-coding-model-explained.html',
  'public/resources/worldvqa-atomic-world-knowledge-benchmark-explained.html',
];

const SOURCE_HOSTS = [
  'arxiv.org',
  'huggingface.co',
  'kimi.com',
  'www.kimi.com',
  'github.com',
];

function labelFor(href) {
  if (/\/pdf\//.test(href) || href.endsWith('.pdf')) return 'Download PDF ↓';
  if (href.includes('huggingface.co')) return 'Read the model card ↗';
  if (href.includes('github.com')) return 'View on GitHub ↗';
  if (href.includes('kimi.com')) return 'Read the tech blog ↗';
  return 'Read the paper ↗';
}

// Remove a class="..."-matched <div> and its full (possibly nested) subtree.
function removeBalancedDiv(html, className) {
  const open = new RegExp(`<div class="${className}"[^>]*>`);
  let m;
  while ((m = open.exec(html))) {
    const start = m.index;
    let depth = 1;
    const tag = /<div\b[^>]*>|<\/div>/g;
    tag.lastIndex = start + m[0].length;
    let t;
    let end = html.length;
    while (depth > 0 && (t = tag.exec(html))) {
      if (t[0] === '</div>') depth--;
      else depth++;
      end = tag.lastIndex;
    }
    html = html.slice(0, start) + html.slice(end);
  }
  return html;
}

for (const file of FILES) {
  let s = readFileSync(file, 'utf8');
  const block = s.match(
    /(<article class="article">\s*)<div class="article-content">([\s\S]*)<\/div>\s*<\/article>/
  );
  if (!block) {
    console.log('SKIP (no article-content block): ' + file);
    continue;
  }
  const pre = block[1];
  let inner = block[2];

  // collect external source links before stripping wrappers
  const seen = new Set();
  const links = [];
  for (const a of inner.matchAll(/<a\b[^>]*href="([^"]+)"[\s\S]*?<\/a\s*>/g)) {
    const href = a[1];
    let host = '';
    try {
      host = new URL(href).host;
    } catch {
      continue;
    }
    if (!SOURCE_HOSTS.includes(host)) continue;
    if (href.includes('platform.kimi.ai')) continue;
    if (seen.has(href)) continue;
    seen.add(href);
    links.push(href);
  }
  links.sort((a, b) => {
    const ap = /pdf/.test(a) ? 1 : 0;
    const bp = /pdf/.test(b) ? 1 : 0;
    return ap - bp;
  });

  // pull the standalone header out of the content (re-mounted before it)
  const headerMatch = inner.match(/<div class="article-header">/);
  let header = '';
  if (headerMatch) {
    const before = inner;
    inner = removeBalancedDiv(inner, 'article-header');
    // recover what was removed for relocation
    const removedLen = before.length - inner.length;
    const idx = headerMatch.index;
    header = before.slice(idx, idx + removedLen).trim();
  }

  // strip every CTA / paper wrapper
  inner = removeBalancedDiv(inner, 'cta-box');
  inner = removeBalancedDiv(inner, 'paper-box');
  inner = removeBalancedDiv(inner, 'paper-links');
  inner = inner.replace(/<p class="paper-cite">[\s\S]*?<\/p>/g, '');

  // collapse the gaps the removals left
  inner = inner.replace(/\n{3,}/g, '\n\n').trim();

  const sourceNote = links.length
    ? `        <p class="source">\n          <strong>Source:</strong>\n          ${links
        .map(
          (h) =>
            `<a href="${h}" target="_blank" rel="noopener">${labelFor(h)}</a>`
        )
        .join('\n          ·\n          ')}\n        </p>\n\n`
    : '';

  const rebuilt =
    `${pre}${header ? header + '\n      ' : ''}<div class="article-content">\n` +
    `${sourceNote}${inner
      .split('\n')
      .map((l) => (l.trim() ? '        ' + l.trimEnd() : ''))
      .join('\n')
      .replace(/^\s+/, '        ')}\n` +
    `      </div>\n    </article>`;

  s = s.replace(block[0], rebuilt);
  writeFileSync(file, s);
  console.log(
    `${file.split('/').pop()} — header:${header ? 'moved' : 'none'} links:${links.length} [${links.map(labelFor).join(', ')}]`
  );
}
