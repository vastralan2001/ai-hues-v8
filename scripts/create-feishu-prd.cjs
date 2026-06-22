/**
 * Create / update a Feishu docx document from a Markdown PRD.
 *
 * Uses the official Feishu Markdown -> Blocks convert API, then inserts blocks
 * via the descendant API. This preserves headings, lists, quotes, code blocks,
 * dividers and inline styles (bold/code/links) much better than hand-rolling
 * text blocks.
 *
 * Usage:
 *   FEISHU_APP_ID=xxx FEISHU_APP_SECRET=yyy node scripts/create-feishu-prd.cjs [path/to/prd.md]
 *
 * Defaults to scripts/prd-design-refresh.md.
 */

const fs = require('fs');
const path = require('path');

const FEISHU_APP_ID = process.env.FEISHU_APP_ID;
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET;

if (!FEISHU_APP_ID || !FEISHU_APP_SECRET) {
  console.error('Please set FEISHU_APP_ID and FEISHU_APP_SECRET');
  process.exit(1);
}

const BASE = 'https://open.feishu.cn/open-apis';

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response from ${url}: ${text.slice(0, 200)}`);
  }
  return data;
}

async function getToken() {
  const data = await fetchJson(`${BASE}/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ app_id: FEISHU_APP_ID, app_secret: FEISHU_APP_SECRET }),
  });
  if (data.code !== 0) throw new Error(`Auth failed: ${data.msg}`);
  return data.tenant_access_token;
}

async function createDocument(token, title) {
  const data = await fetchJson(`${BASE}/docx/v1/documents`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({ title }),
  });
  if (data.code !== 0) throw new Error(`Create document failed: ${data.msg}`);
  return data.data.document;
}

async function convertMarkdown(token, markdown) {
  const data = await fetchJson(`${BASE}/docx/v1/documents/blocks/convert`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({ content_type: 'markdown', content: markdown }),
  });
  if (data.code !== 0) {
    throw new Error(`Convert markdown failed: ${data.msg} (${data.code})`);
  }
  return data.data;
}

function sanitizeBlocks(blocks) {
  if (!Array.isArray(blocks)) return;
  for (const block of blocks) {
    // These are read-only / returned by the read API and should not be sent back.
    delete block.parent_id;
    delete block.comment_ids;

    // merge_info is read-only for Table blocks and causes insertion errors.
    if (block.block_type === 31 && block.table) {
      delete block.table.merge_info;
    }

    // Recurse into table cells / grid columns / callout / quote_container etc.
    const children = block.children;
    if (Array.isArray(children) && children.length > 0 && typeof children[0] === 'object') {
      sanitizeBlocks(children);
    }
  }
}

async function createDescendantBlocks(token, documentId, parentBlockId, descendants, firstLevelIds) {
  const childrenId = firstLevelIds.length > 0
    ? firstLevelIds
    : descendants.filter((b) => !b.parent_id).map((b) => b.block_id);

  const body = {
    children_id: childrenId,
    descendants,
    index: -1,
  };

  const data = await fetchJson(
    `${BASE}/docx/v1/documents/${documentId}/blocks/${parentBlockId}/descendant?document_revision_id=-1`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(body),
    }
  );
  if (data.code !== 0) {
    throw new Error(`Create descendant blocks failed: ${data.msg} (${data.code})`);
  }
  return data.data;
}

async function setPublicPermission(token, documentId) {
  try {
    const data = await fetchJson(
      `${BASE}/drive/v1/permissions/${documentId}/public?type=docx`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          external_access: false,
          security_entity: 'anyone_can_view',
          comment_entity: 'anyone_can_view',
          share_entity: 'same_tenant',
          link_share_entity: 'tenant_editable',
          invite_external: false,
        }),
      }
    );
    if (data.code !== 0) {
      console.warn(`⚠️ Could not set public permission: ${data.msg} (${data.code})`);
    } else {
      console.log('✅ Document permission set to tenant editable');
    }
  } catch (err) {
    console.warn(`⚠️ Permission update skipped: ${err.message}`);
  }
}

function extractTitle(markdown, fallback) {
  const firstLine = markdown.trim().split(/\r?\n/)[0] || '';
  const match = firstLine.match(/^#\s+(.+)$/);
  return match ? match[1].trim() : fallback;
}

async function main() {
  const inputPath = process.argv[2] || path.join(__dirname, 'prd-design-refresh.md');
  if (!fs.existsSync(inputPath)) {
    console.error(`File not found: ${inputPath}`);
    process.exit(1);
  }

  const markdown = fs.readFileSync(inputPath, 'utf-8');
  const title = extractTitle(markdown, path.basename(inputPath, '.md'));

  console.log(`Reading ${inputPath} ...`);
  console.log(`Document title: ${title}`);

  const token = await getToken();

  console.log('Creating new Feishu document...');
  const doc = await createDocument(token, title);
  console.log(`Created: ${doc.title}`);
  console.log(`Document ID: ${doc.document_id}`);

  console.log('Converting Markdown to Feishu blocks...');
  const converted = await convertMarkdown(token, markdown);
  const descendants = converted.blocks || [];
  const firstLevelIds = converted.first_level_block_ids || [];

  if (descendants.length === 0) {
    throw new Error('Convert API returned no blocks');
  }

  sanitizeBlocks(descendants);

  console.log(`Inserting ${descendants.length} blocks...`);
  await createDescendantBlocks(token, doc.document_id, doc.document_id, descendants, firstLevelIds);

  console.log('Setting document permissions...');
  await setPublicPermission(token, doc.document_id);

  const url = `https://moonshot.feishu.cn/docx/${doc.document_id}`;
  console.log('\n✅ Done!');
  console.log(`Open: ${url}`);
}

main().catch((err) => {
  console.error('\n❌ Failed:', err.message);
  process.exit(1);
});
