/**
 * Read Feishu docx content and print as plain text / markdown-ish format.
 * Usage: node scripts/read-feishu-prd.cjs
 */

const FEISHU_APP_ID = process.env.FEISHU_APP_ID;
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET;
const DOC_TOKEN = process.env.FEISHU_DOC_TOKEN || 'Uh70w2Wd7i1xoRkjgy9cPk17nib';

if (!FEISHU_APP_ID || !FEISHU_APP_SECRET) {
  console.error('Please set FEISHU_APP_ID and FEISHU_APP_SECRET');
  process.exit(1);
}

async function getToken() {
  const res = await fetch(
    'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

function blockToText(block) {
  const bt = block.block_type;
  switch (bt) {
    case 1:
      return `[PAGE] ${extractText(block.page?.elements)}`;
    case 2:
      return extractText(block.text?.elements);
    case 3:
      return `# ${extractText(block.heading1?.elements)}`;
    case 4:
      return `## ${extractText(block.heading2?.elements)}`;
    case 5:
      return `### ${extractText(block.heading3?.elements)}`;
    case 6:
      return `- ${extractText(block.bullet?.elements)}`;
    case 7:
      return `1. ${extractText(block.ordered?.elements)}`;
    case 11:
      return '---';
    case 12:
      return `> ${extractText(block.quote?.elements)}`;
    case 14:
      return `[CODE] ${extractText(block.code?.elements)}`;
    case 22:
      return `[TABLE]`;
    case 32:
      return `[CELL] ${extractText(block.table_cell?.elements)}`;
    default:
      return `[BLOCK type=${bt}]`;
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
