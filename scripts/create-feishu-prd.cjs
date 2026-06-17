/**
 * Create a new Feishu docx document and populate it with PRD content.
 * Usage: FEISHU_APP_ID=xxx FEISHU_APP_SECRET=yyy node scripts/create-feishu-prd.cjs
 */

const FEISHU_APP_ID = process.env.FEISHU_APP_ID;
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET;

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

async function createDocument(token, title) {
  const res = await fetch('https://open.feishu.cn/open-apis/docx/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(`Create document failed: ${data.msg}`);
  return data.data.document;
}

async function createBlocks(token, documentId, parentBlockId, children) {
  const res = await fetch(
    `https://open.feishu.cn/open-apis/docx/v1/documents/${documentId}/blocks/${parentBlockId}/children`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ children }),
    }
  );
  const data = await res.json();
  if (data.code !== 0) {
    console.error('Create blocks failed:', JSON.stringify(data, null, 2));
    throw new Error(`Create blocks failed: ${data.msg}`);
  }
  return data.data;
}

function textBlock(content, level = 0) {
  // level: 0=body, 2=heading2 (##), 3=heading3 (###)
  const bt = level === 0 ? 2 : level === 2 ? 4 : 5;
  const key = level === 0 ? 'text' : level === 2 ? 'heading2' : 'heading3';
  return {
    block_type: bt,
    [key]: {
      elements: [{ text_run: { content } }],
    },
  };
}

function bulletBlock(content) {
  // Fallback to text with bullet prefix because block_type 6 fails in this tenant
  return textBlock(`• ${content}`, 0);
}

function quoteBlock(content) {
  return textBlock(`> ${content}`, 0);
}

function dividerBlock() {
  return textBlock('---', 0);
}

const prdTitle = 'AIHues 工具站 PRD — design-refresh 版';

const contentBlocks = [
  textBlock(prdTitle, 0),
  textBlock('Version: design-refresh · 基于 feature/design-refresh 分支', 0),
  textBlock('Date: 2026-06-17', 0),
  textBlock('Status: 设计刷新 + Humanize LLM 接入完成，待合并评估', 0),
  dividerBlock(),

  textBlock('1. 产品概述', 2),
  textBlock('AIHues 是一个面向创作者、开发者和出海增长团队的一站式 AI 工具站。当前分支已从早期静态 HTML 迁移到 Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 架构，保留 57 个工具 + 3 个小游戏，并持续优化设计质感与 AI 输出质量。', 0),
  textBlock('1.1 当前分支关键变化', 3),
  bulletBlock('架构：静态 HTML → Next.js App Router（feature/design-refresh）'),
  bulletBlock('设计：引入 spacing rhythm 4/8 规范、统一 hero 标题、全局间距对齐'),
  bulletBlock('Humanize：从纯前端 buzzword 替换升级为真实 LLM API 调用'),
  bulletBlock('Prompt 工程：20+ AI 写作工具集中管理在 app/lib/ai-prompts.ts'),

  textBlock('2. 已完成工作', 2),
  textBlock('2.1 设计刷新（Design Refresh）', 3),
  bulletBlock('全局 spacing rhythm：将 globals.css 中约 60 处非 4/8 倍数的间距/尺寸对齐到设计 token'),
  bulletBlock('Hero 区统一：所有页面 hero 标题使用 .hero-title（font-size: 48px、line-height: 1.15、letter-spacing: -0.02em）'),
  bulletBlock('首页细节：category cards、quick tags、Dual Engine CTA、Wishlist CTA 的间距统一'),
  bulletBlock('HumanizeTool UI：标题规范、loading spinner、空输入校验、空结果占位'),

  textBlock('2.2 Humanize 接入 LLM + Prompt 优化', 3),
  textBlock('Humanize 已接入 /api/ai-generate，通过千循代理调用 OpenAI 兼容 API。Prompt 从原来的简单"改写得更自然"升级为 5 条核心规则：', 0),
  bulletBlock('保持原意和原语言，不添加解释'),
  bulletBlock('替换 AI 套话（leverage / robust / 值得一提的是 / 综上所述等）'),
  bulletBlock('减少 hedging（generally speaking / often / 一般来说 / 通常情况下等）'),
  bulletBlock('增加人声：口语连接词、人称、反问、句子长短错落'),
  bulletBlock('不要 bullet、编号、总结性结构'),
  textBlock('每个规则都配有中英 few-shot 示例，输出稳定性明显提升。', 0),

  textBlock('2.3 测试结果摘要', 3),
  textBlock('2026-06-17 使用 6 组测试数据验证：', 0),
  bulletBlock('中文 AI 套话：leveraging / robust / streamline 等被自然替换'),
  bulletBlock('中文 hedging："一般来说 / 通常情况下 / 可能会"被压缩为直接断言'),
  bulletBlock('中文 bullet 结构："第一/第二/第三"和"综上所述"被改为连贯短句'),
  bulletBlock('英文 clichés："fast-paced digital landscape / leverage robust / it is worth noting"全部去除'),
  bulletBlock('英文 hedging：大量软化词被直接表达替代'),
  bulletBlock('英文 bullet："First/Second/Third/In conclusion"结构被自然段落替代'),
  quoteBlock('遗留问题：中文 bullet 那组仍保留"有三个明显的优点："这种半清单表达，可进一步微调。'),

  textBlock('3. 工具清单（当前分支）', 2),
  textBlock('开发工具 30 个、实用工具 8 个、AI 写作工具 19 个、小游戏 3 个。Humanize 已从"15个AI词替换"升级为 LLM 驱动。', 0),

  textBlock('4. 技术架构', 2),
  textBlock('4.1 当前栈', 3),
  bulletBlock('Next.js 16.1.1 + React 19 + TypeScript 5.8'),
  bulletBlock('Tailwind CSS v4 + @tailwindcss/postcss'),
  bulletBlock('moonrepo + pnpm workspace'),
  bulletBlock('Vitest + Playwright'),

  textBlock('4.2 AI 生成链路', 3),
  bulletBlock('前端组件 → aiGenerate client → /api/ai-generate → buildPrompt → LLM API'),
  bulletBlock('支持多 provider：Kimi / DeepSeek / OpenAI（通过环境变量切换）'),
  bulletBlock('当前测试使用千循代理：https://openai.app.msh.team/'),

  textBlock('5. 后续规划', 2),
  textBlock('5.1 近期（design-refresh 完成前）', 3),
  bulletBlock('继续用 4/8 rhythm 优化剩余 56 个工具组件的间距'),
  bulletBlock('修复 ai-prompts.ts 中 seo-title 重复定义的 bug'),
  bulletBlock('为主要 AI 写作工具增加 few-shot 和输出格式约束'),
  bulletBlock('按工具覆盖 temperature / max_tokens'),

  textBlock('5.2 中期', 3),
  bulletBlock('将 design-refresh 分支与 master 对齐或决定合并策略'),
  bulletBlock('为所有 19 个 AI 写作工具接入 LLM API'),
  bulletBlock('实现真实 Credit 扣除逻辑'),

  textBlock('5.3 长期', 3),
  bulletBlock('开源项目评测 + 出海营销工具方向'),
  bulletBlock('Agent Chat UI 重构'),
  bulletBlock('支付系统 / Pro 订阅'),

  dividerBlock(),
  textBlock('AIHues — Find your AI vibe.', 0),
  textBlock('design-refresh · 2026-06-17', 0),
];

async function main() {
  const token = await getToken();
  console.log('Creating new Feishu document...');
  const doc = await createDocument(token, prdTitle);
  console.log(`Created: ${doc.title}`);
  console.log(`Document ID: ${doc.document_id}`);
  console.log(`URL: https://moonshot.feishu.cn/wiki/${doc.document_id}`);

  console.log('Writing content...');
  // Feishu limits children per request; split into chunks of 50
  const chunkSize = 50;
  for (let i = 0; i < contentBlocks.length; i += chunkSize) {
    const chunk = contentBlocks.slice(i, i + chunkSize);
    await createBlocks(token, doc.document_id, doc.document_id, chunk);
    console.log(`  Written ${Math.min(i + chunkSize, contentBlocks.length)} / ${contentBlocks.length} blocks`);
  }

  console.log('\n✅ Done!');
  console.log(`Open: https://moonshot.feishu.cn/wiki/${doc.document_id}`);
}

main().catch((err) => {
  console.error('❌ Failed:', err.message);
  process.exit(1);
});
