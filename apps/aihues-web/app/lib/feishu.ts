/**
 * Feishu (Lark) API client for reading wiki/docx documents.
 *
 * Setup:
 * 1. Create a "Custom App" in Feishu Open Platform (https://open.feishu.cn/)
 * 2. Enable permissions: docx:document, wiki:wiki, drive:drive
 * 3. Publish the app and get app_id + app_secret
 * 4. Add env vars: FEISHU_APP_ID, FEISHU_APP_SECRET
 */

const FEISHU_BASE = 'https://open.feishu.cn/open-apis';

interface TokenResp {
  code: number;
  msg: string;
  tenant_access_token?: string;
  expire?: number;
}

interface WikiNode {
  title: string;
  node_token: string;
  obj_type: 'docx' | 'doc' | 'sheet' | string;
  parent_node_token: string;
  node_create_time: string;
  node_creator: string;
}

interface WikiNodesResp {
  code: number;
  msg: string;
  data?: {
    items: WikiNode[];
    page_token?: string;
    has_more: boolean;
  };
}

interface DocxBlock {
  block_id: string;
  block_type: number;
  [key: string]: unknown;
}

interface DocxContentResp {
  code: number;
  msg: string;
  data?: {
    items: DocxBlock[];
    page_token?: string;
    has_more: boolean;
  };
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getTenantAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }

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

  const data = (await res.json()) as TokenResp;
  if (data.code !== 0 || !data.tenant_access_token) {
    throw new Error(`Feishu auth failed: ${data.msg}`);
  }

  cachedToken = {
    token: data.tenant_access_token,
    expiresAt: Date.now() + (data.expire || 7200) * 1000,
  };

  return cachedToken.token;
}

async function feishuFetch<T>(path: string): Promise<T> {
  const token = await getTenantAccessToken();
  const res = await fetch(`${FEISHU_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Feishu API error: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}

/**
 * List all docx nodes under a wiki space.
 * @param spaceId - Wiki space ID (found in wiki URL)
 */
export async function listWikiNodes(spaceId: string): Promise<WikiNode[]> {
  const nodes: WikiNode[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({ space_id: spaceId });
    if (pageToken) params.set('page_token', pageToken);

    const data = await feishuFetch<WikiNodesResp>(
      `/wiki/v2/spaces/${spaceId}/nodes?${params}`
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

/**
 * Read all blocks from a docx document.
 * @param documentId - Document ID (node_token from wiki)
 */
export async function readDocxBlocks(documentId: string): Promise<DocxBlock[]> {
  const blocks: DocxBlock[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams();
    if (pageToken) params.set('page_token', pageToken);

    const data = await feishuFetch<DocxContentResp>(
      `/docx/v1/documents/${documentId}/blocks?${params}`
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

/**
 * Convert Feishu docx blocks to a simple Markdown string.
 * This is a minimal implementation — extend as needed.
 */
interface TextElement {
  text_run?: { content?: string };
}

interface RawBlock {
  page?: { elements?: TextElement[] };
  text?: { elements?: TextElement[] };
  heading1?: { elements?: TextElement[] };
  heading2?: { elements?: TextElement[] };
  heading3?: { elements?: TextElement[] };
  bullet?: { elements?: TextElement[] };
  ordered?: { elements?: TextElement[] };
  quote?: { elements?: TextElement[] };
}

export function blocksToMarkdown(blocks: DocxBlock[]): string {
  const lines: string[] = [];

  for (const block of blocks) {
    const b = block as unknown as RawBlock;
    const bt = block.block_type;

    if (bt === 1) {
      const el = b.page?.elements?.[0];
      if (el?.text_run?.content) lines.push(`# ${el.text_run.content}\n`);
    } else if (bt === 2) {
      const el = b.text?.elements?.[0];
      if (el?.text_run?.content) lines.push(`${el.text_run.content}\n`);
    } else if (bt === 3) {
      const el = b.heading1?.elements?.[0];
      if (el?.text_run?.content) lines.push(`# ${el.text_run.content}\n`);
    } else if (bt === 4) {
      const el = b.heading2?.elements?.[0];
      if (el?.text_run?.content) lines.push(`## ${el.text_run.content}\n`);
    } else if (bt === 5) {
      const el = b.heading3?.elements?.[0];
      if (el?.text_run?.content) lines.push(`### ${el.text_run.content}\n`);
    } else if (bt === 6) {
      const el = b.bullet?.elements?.[0];
      if (el?.text_run?.content) lines.push(`- ${el.text_run.content}\n`);
    } else if (bt === 7) {
      const el = b.ordered?.elements?.[0];
      if (el?.text_run?.content) lines.push(`1. ${el.text_run.content}\n`);
    } else if (bt === 11) {
      lines.push(`---\n`);
    } else if (bt === 12) {
      const el = b.quote?.elements?.[0];
      if (el?.text_run?.content) lines.push(`> ${el.text_run.content}\n`);
    }
  }

  return lines.join('\n');
}

/**
 * Convert simple Markdown to the project's HTML article template.
 */
export function markdownToArticleHTML(opts: {
  title: string;
  tag: string;
  date: string;
  readTime: string;
  markdown: string;
}): string {
  // Very naive markdown → HTML (sufficient for our generated content)
  const html = opts.markdown
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

  // Wrap plain paragraphs
  const lines = html.split('\n');
  const out: string[] = [];
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
