/**
 * Read Feishu docx content and print as Markdown-ish text.
 *
 * Usage:
 *   FEISHU_APP_ID=xxx FEISHU_APP_SECRET=yyy node scripts/read-feishu-prd.cjs [doc_token]
 *
 * Defaults to DOC_TOKEN env var, or Uh70w2Wd7i1xoRkjgy9cPk17nib.
 */

const FEISHU_APP_ID = process.env.FEISHU_APP_ID;
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET;
const DOC_TOKEN = process.argv[2] || process.env.FEISHU_DOC_TOKEN || 'Uh70w2Wd7i1xoRkjgy9cPk17nib';

if (!FEISHU_APP_ID || !FEISHU_APP_SECRET) {
  console.error('Please set FEISHU_APP_ID and FEISHU_APP_SECRET');
  process.exit(1);
}

async function getToken() {
  const res = await fetch(
    'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ app_id: FEISHU_APP_ID, app_secret: FEISHU_APP_SECRET }),
    }
  );
  const data = await res.json();
  if (data.code !== 0) throw new Error(`Auth failed: ${data.msg}`);
  return data.tenant_access_token;
}

async function fetchBlocks(token, docToken, pageToken) {
  const params = new URLSearchParams();
  params.set('page_size', '500');
  if (pageToken) params.set('page_token', pageToken);

  const res = await fetch(
    `https://open.feishu.cn/open-apis/docx/v1/documents/${docToken}/blocks?${params}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  if (data.code !== 0) throw new Error(`Read blocks failed: ${data.msg}`);
  return data.data;
}

function extractText(elements) {
  if (!elements) return '';
  return elements
    .map((e) => {
      if (e.text_run?.content) return e.text_run.content;
      if (e.mention_user?.user_name) return `@${e.mention_user.user_name}`;
      return '';
    })
    .join('');
}

// Official Feishu docx block_type enum.
// See: https://open.feishu.cn/document/server-docs/docs/docs/docx-v1/data-structure/block
const BLOCK_NAMES = {
  1: 'page',
  2: 'text',
  3: 'heading1',
  4: 'heading2',
  5: 'heading3',
  6: 'heading4',
  7: 'heading5',
  8: 'heading6',
  9: 'heading7',
  10: 'heading8',
  11: 'heading9',
  12: 'bullet',
  13: 'ordered',
  14: 'code',
  15: 'quote',
  16: 'equation',
  17: 'todo',
  18: 'bitable',
  19: 'callout',
  20: 'chat_card',
  21: 'uml_diagram',
  22: 'divider',
  23: 'file',
  24: 'grid',
  25: 'grid_column',
  26: 'iframe',
  27: 'image',
  28: 'isv',
  29: 'mindnote',
  30: 'sheet',
  31: 'table',
  32: 'table_cell',
  33: 'view',
  34: 'quote_container',
};

const HEADING_PREFIXES = {
  3: '# ',
  4: '## ',
  5: '### ',
  6: '#### ',
  7: '##### ',
  8: '###### ',
  9: '####### ',
  10: '######## ',
  11: '######### ',
};

function blockToText(block) {
  const bt = block.block_type;
  const name = BLOCK_NAMES[bt] || 'unknown';
  const payload = block[name];

  switch (bt) {
    case 1:
      return `[PAGE] ${extractText(payload?.elements)}`;
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
      return `${HEADING_PREFIXES[bt]}${extractText(payload?.elements)}`;
    case 2:
      return extractText(payload?.elements);
    case 12:
      return `- ${extractText(payload?.elements)}`;
    case 13:
      return `1. ${extractText(payload?.elements)}`;
    case 14:
      return `\`\`\`\n${extractText(payload?.elements)}\n\`\`\``;
    case 15:
      return `> ${extractText(payload?.elements)}`;
    case 17:
      return `- [${payload?.done ? 'x' : ' '}] ${extractText(payload?.elements)}`;
    case 22:
      return '---';
    case 31:
      return '[TABLE]';
    case 32:
      return `[CELL] ${extractText(payload?.elements)}`;
    default:
      return `[BLOCK type=${bt} ${name}]`;
  }
}

async function main() {
  const token = await getToken();
  const blocks = [];
  let pageToken;

  do {
    const data = await fetchBlocks(token, DOC_TOKEN, pageToken);
    blocks.push(...(data.items || []));
    pageToken = data.page_token;
  } while (pageToken);

  console.log(`Total blocks: ${blocks.length}\n`);
  for (const block of blocks) {
    const text = blockToText(block);
    if (text) console.log(text);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
