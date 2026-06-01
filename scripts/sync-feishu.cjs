/**
 * CLI script to sync Feishu wiki articles to local blog.
 *
 * Usage:
 *   FEISHU_APP_ID=xxx FEISHU_APP_SECRET=yyy node scripts/sync-feishu.cjs <spaceId>
 *
 * Or set env vars in .env.local and run:
 *   node scripts/sync-feishu.cjs <spaceId>
 */

const fs = require('fs');
const path = require('path');

const FEISHU_BASE = 'https://open.feishu.cn/open-apis';
const POSTS_JSON = path.join(
  __dirname,
  '..',
  'apps',
  'aihues-web',
  'content',
  'blog',
  'posts.json'
);
const BLOG_DIR = path.join(
  __dirname,
  '..',
  'apps',
  'aihues-web',
  'public',
  'blog'
);

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
}

async function getTenantAccessToken() {
  const appId = process.env.FEISHU_APP_ID;
  const appSecret = process.env.FEISHU_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error('FEISHU_APP_ID and FEISHU_APP_SECRET must be set');
  }

  const res = await fetch(
    `${FEISHU_BASE}/auth/v3/tenant_access_token/internal`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
    }
  );

  const data = await res.json();
  if (data.code !== 0 || !data.tenant_access_token) {
    throw new Error(`Feishu auth failed: ${data.msg}`);
  }

  return data.tenant_access_token;
}

async function feishuFetch(path, token) {
  const res = await fetch(`${FEISHU_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Feishu API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

async function listWikiNodes(token, spaceId) {
  const nodes = [];
  let pageToken;

  do {
    const params = new URLSearchParams({ space_id: spaceId });
    if (pageToken) params.set('page_token', pageToken);

    const data = await feishuFetch(
      `/wiki/v2/spaces/${spaceId}/nodes?${params}`,
      token
    );

    if (data.code !== 0) {
      throw new Error(`Wiki list failed: ${data.msg}`);
    }

    const items = data.data?.items ?? [];
    nodes.push(...items.filter((n) => n.obj_type === 'docx'));
    pageToken = data.data?.page_token;
  } while (pageToken);

  return nodes;
}

async function readDocxBlocks(token, documentId) {
  const blocks = [];
  let pageToken;

  do {
    const params = new URLSearchParams();
    if (pageToken) params.set('page_token', pageToken);

    const data = await feishuFetch(
      `/docx/v1/documents/${documentId}/blocks?${params}`,
      token
    );

    if (data.code !== 0) {
      throw new Error(`Docx read failed: ${data.msg}`);
    }

    const items = data.data?.items ?? [];
    blocks.push(...items);
    pageToken = data.data?.page_token;
  } while (pageToken);

  return blocks;
}

function blocksToMarkdown(blocks) {
  const lines = [];

  for (const block of blocks) {
    const bt = block.block_type;

    if (bt === 1) {
      const title = block.page?.elements?.[0];
      if (title?.text_run?.content) lines.push(`# ${title.text_run.content}\n`);
    } else if (bt === 2) {
      const text = block.text?.elements?.[0];
      if (text?.text_run?.content) lines.push(`${text.text_run.content}\n`);
    } else if (bt === 3) {
      const heading = block.heading1?.elements?.[0];
      if (heading?.text_run?.content)
        lines.push(`# ${heading.text_run.content}\n`);
    } else if (bt === 4) {
      const heading = block.heading2?.elements?.[0];
      if (heading?.text_run?.content)
        lines.push(`## ${heading.text_run.content}\n`);
    } else if (bt === 5) {
      const heading = block.heading3?.elements?.[0];
      if (heading?.text_run?.content)
        lines.push(`### ${heading.text_run.content}\n`);
    } else if (bt === 6) {
      const bullet = block.bullet?.elements?.[0];
      if (bullet?.text_run?.content)
        lines.push(`- ${bullet.text_run.content}\n`);
    } else if (bt === 7) {
      const ordered = block.ordered?.elements?.[0];
      if (ordered?.text_run?.content)
        lines.push(`1. ${ordered.text_run.content}\n`);
    } else if (bt === 11) {
      lines.push(`---\n`);
    } else if (bt === 12) {
      const quote = block.quote?.elements?.[0];
      if (quote?.text_run?.content) lines.push(`> ${quote.text_run.content}\n`);
    }
  }

  return lines.join('\n');
}

function markdownToArticleHTML(opts) {
  let html = opts.markdown
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^> (.*$)/gm, '<blockquote><p>$1</p></blockquote>')
    .replace(/^\* (.*$)/gm, '<li>$1</li>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
    .replace(/^---$/gm, '<hr />')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

  const lines = html.split('\n');
  const out = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('<li>')) {
      if (!inList) {
        out.push('<ul>');
        inList = true;
      }
      out.push(trimmed);
    } else {
      if (inList) {
        out.push('</ul>');
        inList = false;
      }
      if (
        !trimmed.startsWith('<h') &&
        !trimmed.startsWith('<blockquote') &&
        !trimmed.startsWith('<hr')
      ) {
        out.push(`<p>${trimmed}</p>`);
      } else {
        out.push(trimmed);
      }
    }
  }
  if (inList) out.push('</ul>');

  const bodyContent = out.join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${opts.title} | AIHues</title>
  <meta name="description" content="${opts.title}" />
  <style>
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
    :root{--bg:#faf9f6;--surface:#ffffff;--surface-hover:#f5f0e8;--border:#e8e2d9;--border-hover:#d4c8b8;--text:#1c1917;--text-secondary:#78716c;--text-muted:#a8a29e;--accent:#b45309;--accent-light:#d97706;--radius:14px;--radius-sm:10px;--shadow:0 1px 3px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.04);--shadow-lg:0 8px 32px rgba(180,83,9,0.18);}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--text);line-height:1.7;font-size:16px;}
    .article-content{max-width:680px;margin:0 auto;padding:40px 20px 80px;}
    .article-content p{margin-bottom:20px;color:var(--text-secondary);}
    .article-content h1{font-size:28px;font-weight:800;margin:32px 0 16px;color:var(--text);}
    .article-content h2{font-size:24px;font-weight:700;margin:40px 0 16px;color:var(--text);}
    .article-content h3{font-size:20px;font-weight:600;margin:32px 0 12px;color:var(--text);}
    .article-content ul,.article-content ol{margin:0 0 20px 24px;color:var(--text-secondary);}
    .article-content li{margin-bottom:8px;}
    .article-content blockquote{border-left:3px solid var(--accent);padding-left:20px;margin:24px 0;font-style:italic;color:var(--text-secondary);}
    .article-content hr{border:none;border-top:1px solid var(--border);margin:32px 0;}
    .article-content a{color:var(--accent);text-decoration:none;}
    .article-content a:hover{text-decoration:underline;}
    .article-content strong{color:var(--text);}
    @media (max-width:640px){.article-content{padding:20px 16px 60px;}}
  </style>
</head>
<body>
  <article>
    <div class="article-content">
      ${bodyContent}
    </div>
  </article>
</body>
</html>`;
}

async function main() {
  const spaceId = process.argv[2];
  if (!spaceId) {
    console.error('Usage: node scripts/sync-feishu.cjs <spaceId>');
    process.exit(1);
  }

  console.log('🔐 Authenticating with Feishu...');
  const token = await getTenantAccessToken();

  console.log('📚 Listing wiki nodes...');
  const nodes = await listWikiNodes(token, spaceId);
  console.log(`   Found ${nodes.length} docx nodes`);

  let existingPosts = [];
  try {
    existingPosts = JSON.parse(fs.readFileSync(POSTS_JSON, 'utf-8'));
  } catch {
    // File might not exist
  }

  const existingSlugs = new Set(existingPosts.map((p) => p.slug));
  let created = 0;
  let skipped = 0;

  for (const node of nodes) {
    const slug = slugify(node.title);

    if (existingSlugs.has(slug)) {
      skipped++;
      continue;
    }

    console.log(`   Reading "${node.title}"...`);
    const blocks = await readDocxBlocks(token, node.node_token);
    const markdown = blocksToMarkdown(blocks);
    const html = markdownToArticleHTML({
      title: node.title,
      tag: 'Feishu Sync',
      date: new Date().toISOString().split('T')[0],
      readTime: '5 min',
      markdown,
    });

    fs.writeFileSync(path.join(BLOG_DIR, `${slug}.html`), html, 'utf-8');

    existingPosts.push({
      slug,
      tag: 'Feishu Sync',
      title: node.title,
      excerpt: `${node.title} — synced from Feishu wiki.`,
      date: new Date().toISOString().split('T')[0],
      readTime: '5 min',
      coverImage: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000000)}?w=600&q=80`,
    });

    created++;
  }

  existingPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  fs.writeFileSync(POSTS_JSON, JSON.stringify(existingPosts, null, 2), 'utf-8');

  console.log('\n✅ Sync complete!');
  console.log(`   Created: ${created}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total posts: ${existingPosts.length}`);
}

main().catch((err) => {
  console.error('❌ Sync failed:', err.message);
  process.exit(1);
});
