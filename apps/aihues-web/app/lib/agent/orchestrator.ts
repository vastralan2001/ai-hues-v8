/* ── AIHues Agent Orchestrator ──
   Processes user messages and decides:
   1. General chat → LLM response
   2. Tool recommendation → keyword fallback or LLM
   3. Content generation → call existing ai-generate logic
*/

import { buildPrompt } from '../ai-prompts';
import { recommendToolsByKeyword, isWritingTool } from './tools';
import type { AgentMessage, AgentResponse } from './types';

function getLlmConfig() {
  if (process.env.KIMI_API_KEY) {
    return {
      key: process.env.KIMI_API_KEY,
      url:
        process.env.KIMI_API_BASE_URL ||
        'https://api.moonshot.cn/v1/chat/completions',
      model: process.env.KIMI_API_MODEL || 'moonshot-v1-8k',
    };
  }
  if (process.env.DEEPSEEK_API_KEY) {
    return {
      key: process.env.DEEPSEEK_API_KEY,
      url:
        process.env.DEEPSEEK_API_BASE_URL ||
        'https://api.deepseek.com/v1/chat/completions',
      model: process.env.DEEPSEEK_API_MODEL || 'deepseek-chat',
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      key: process.env.OPENAI_API_KEY,
      url:
        process.env.OPENAI_API_BASE_URL ||
        'https://api.openai.com/v1/chat/completions',
      model: process.env.OPENAI_API_MODEL || 'gpt-3.5-turbo',
    };
  }
  return null;
}

/* ── Build system prompt for Agent mode ── */
function buildAgentSystemPrompt(locale: string): string {
  const isZh = locale === 'zh';
  return isZh
    ? `你是 AIHues 平台的智能助手 "HuesBot"。你的职责：
1. 回答用户关于 AIHues 工具的问题
2. 根据用户需求推荐合适的工具
3. 对于 AI 写作工具，可以直接在对话中生成内容

可用工具分类：
- Developer: JWT解析、JSON格式化、正则测试、UUID生成、Base64、SHA256、SQL格式化、URL编码、密码生成等
- Utility: 字数统计、文本对比、可读性分析、去AI味、标题格式转换等
- AI Writing: 广告文案、博客大纲、冷邮件、X帖子、LinkedIn帖子、SEO标题、YouTube脚本、新闻稿、标语等

回复要求：
- 友好、简洁、实用
- 推荐工具时说明为什么适合
- 可以直接调用写作工具帮用户生成内容`
    : `You are "HuesBot", the AI assistant for the AIHues platform. Your role:
1. Answer questions about AIHues tools
2. Recommend relevant tools based on user needs
3. For AI writing tools, you can generate content directly in the chat

Tool categories:
- Developer: JWT Parser, JSON Formatter, Regex Tester, UUID Generator, Base64, SHA256, SQL Formatter, URL Encode, Password Generator, etc.
- Utility: Word Counter, Text Diff, Readability, Humanize AI Text, Title Case, etc.
- AI Writing: Ad Copy, Blog Outline, Cold Email, X Posts, LinkedIn Posts, SEO Titles, YouTube Scripts, Newsletter, Taglines, etc.

Guidelines:
- Be friendly, concise, and practical
- Explain why recommended tools are suitable
- You can directly invoke writing tools to generate content for users`;
}

/* ── Detect if user wants content generation ── */
function detectContentIntent(
  message: string
): { tool: string; inputs: Record<string, string> } | null {
  const m = message.toLowerCase();

  const patterns: Array<{
    keywords: string[];
    tool: string;
    extract: (msg: string) => Record<string, string>;
  }> = [
    {
      keywords: ['seo title', 'seo标题', '标题优化'],
      tool: 'seo-title',
      extract: (msg) => {
        const kw = msg
          .replace(/.*(?:about|for|关于|针对|关键词是)\s*/i, '')
          .trim();
        return { keyword: kw || msg, topic: kw || msg };
      },
    },
    {
      keywords: ['blog outline', '博客大纲', '文章大纲', 'outline'],
      tool: 'blog-outline',
      extract: (msg) => {
        const topic = msg.replace(/.*(?:about|for|关于|主题是)\s*/i, '').trim();
        return { topic: topic || msg };
      },
    },
    {
      keywords: ['x post', 'tweet', 'twitter', '推文'],
      tool: 'x-post',
      extract: (msg) => {
        const topic = msg.replace(/.*(?:about|for|关于|主题是)\s*/i, '').trim();
        return { topic: topic || msg, tone: 'professional' };
      },
    },
    {
      keywords: ['linkedin', '领英'],
      tool: 'linkedin',
      extract: (msg) => {
        const topic = msg.replace(/.*(?:about|for|关于|主题是)\s*/i, '').trim();
        return { topic: topic || msg, tone: 'professional' };
      },
    },
    {
      keywords: ['ad copy', '广告文案', '广告语'],
      tool: 'ad-copy',
      extract: (msg) => {
        const product = msg.replace(/.*(?:for|给|为)\s*/i, '').trim();
        return { product: product || msg, audience: 'general' };
      },
    },
    {
      keywords: ['cold email', 'coldemail', ' outreach', '外联邮件'],
      tool: 'cold-email',
      extract: (msg) => {
        return {
          recipient: 'prospect',
          product: msg,
          purpose: 'explore partnership',
        };
      },
    },
    {
      keywords: ['tagline', 'slogan', '标语', '口号'],
      tool: 'tagline',
      extract: (msg) => {
        const brand = msg.replace(/.*(?:for|给|为)\s*/i, '').trim();
        return { brand: brand || msg, benefit: '' };
      },
    },
    {
      keywords: ['newsletter', '邮件', 'news letter'],
      tool: 'newsletter',
      extract: (msg) => {
        const topic = msg.replace(/.*(?:about|for|关于|主题是)\s*/i, '').trim();
        return { topic: topic || msg };
      },
    },
    {
      keywords: ['humanize', '去ai', '去ai', '自然化'],
      tool: 'humanize',
      extract: (msg) => {
        const text = msg
          .replace(/.*(?:this text|以下文本|这段文字|这段话)\s*/i, '')
          .trim();
        return { text: text || msg };
      },
    },
    {
      keywords: ['tldr', 'summary', '摘要', '总结'],
      tool: 'tldr',
      extract: (msg) => {
        const text = msg.replace(/.*(?:this|以下|这段)\s*/i, '').trim();
        return { text: text || msg };
      },
    },
    {
      keywords: ['video title', 'youtube title', '视频标题'],
      tool: 'video-title',
      extract: (msg) => {
        const topic = msg.replace(/.*(?:about|for|关于|主题是)\s*/i, '').trim();
        return { topic: topic || msg };
      },
    },
    {
      keywords: ['yt script', 'youtube script', '视频脚本'],
      tool: 'yt-script',
      extract: (msg) => {
        const topic = msg.replace(/.*(?:about|for|关于|主题是)\s*/i, '').trim();
        return { topic: topic || msg };
      },
    },
    {
      keywords: ['meta', 'meta tag', 'meta description'],
      tool: 'meta',
      extract: (msg) => {
        const topic = msg.replace(/.*(?:for|about|关于|给)\s*/i, '').trim();
        return { topic: topic || msg };
      },
    },
    {
      keywords: ['faq', '常见问题'],
      tool: 'faq',
      extract: (msg) => {
        const product = msg.replace(/.*(?:for|about|关于|给)\s*/i, '').trim();
        return { product: product || msg };
      },
    },
    {
      keywords: ['changelog', '更新日志', 'release note'],
      tool: 'changelog',
      extract: (msg) => {
        return { version: 'v1.0.0', changes: msg };
      },
    },
    {
      keywords: ['pr desc', 'pr description', 'pull request'],
      tool: 'pr-desc',
      extract: (msg) => {
        return { changes: msg };
      },
    },
    {
      keywords: ['lp hero', 'landing page', '落地页', 'hero section'],
      tool: 'lp-hero',
      extract: (msg) => {
        const product = msg.replace(/.*(?:for|about|关于|给)\s*/i, '').trim();
        return { product: product || msg, benefit: '' };
      },
    },
    {
      keywords: ['code explain', '解释代码', 'explain this code'],
      tool: 'code-explain',
      extract: (msg) => {
        return { code: msg, language: 'unknown' };
      },
    },
    {
      keywords: ['pseudocode', '伪代码'],
      tool: 'pseudo',
      extract: (msg) => {
        return { code: msg };
      },
    },
    {
      keywords: ['alt text', 'alt文本', '图片描述'],
      tool: 'alt-text',
      extract: (msg) => {
        return { description: msg };
      },
    },
    {
      keywords: ['push', '推送通知', 'push notification'],
      tool: 'push',
      extract: (msg) => {
        const product = msg.replace(/.*(?:for|about|关于|给)\s*/i, '').trim();
        return { product: product || msg };
      },
    },
    {
      keywords: ['docs', 'documentation', '文档'],
      tool: 'docs',
      extract: (msg) => {
        const product = msg.replace(/.*(?:for|about|关于|给)\s*/i, '').trim();
        return { product: product || msg };
      },
    },
  ];

  for (const p of patterns) {
    if (p.keywords.some((k) => m.includes(k))) {
      return { tool: p.tool, inputs: p.extract(message) };
    }
  }

  return null;
}

/* ── Call LLM via existing API pattern ── */
async function callLlm(
  messages: Array<{ role: string; content: string }>,
  temperature = 0.7
): Promise<string | null> {
  const config = getLlmConfig();
  if (!config) return null;

  try {
    const res = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.key}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature,
        max_tokens: 2000,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => 'unknown');
      console.error(
        `[Agent LLM] API error: ${res.status} ${res.statusText}`,
        errText.slice(0, 500)
      );
      return null;
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.error('[Agent LLM] Network error:', err);
    return null;
  }
}

/* ── Main orchestrator ── */
export async function processAgentMessage(
  messages: AgentMessage[],
  locale = 'en',
  enableLlm = true
): Promise<AgentResponse> {
  const lastUserMessage = [...messages]
    .reverse()
    .find((m) => m.role === 'user');
  if (!lastUserMessage) {
    return {
      message: {
        role: 'agent',
        content:
          locale === 'zh'
            ? '你好！我是 HuesBot，有什么可以帮你的？'
            : "Hi! I'm HuesBot. How can I help you today?",
      },
    };
  }

  const userText = lastUserMessage.content;

  // 1. Try to detect direct content generation intent
  const contentIntent = detectContentIntent(userText);
  if (contentIntent && isWritingTool(contentIntent.tool)) {
    const config = getLlmConfig();
    if (config) {
      // Call existing ai-generate logic via buildPrompt
      const prompt = buildPrompt(
        contentIntent.tool,
        locale,
        contentIntent.inputs
      );
      const llmResult = await callLlm(
        [
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.user },
        ],
        0.7
      );

      if (llmResult) {
        return {
          message: {
            role: 'agent',
            content: llmResult,
            metadata: {
              type: 'tool_result',
              toolCall: {
                tool: contentIntent.tool,
                inputs: contentIntent.inputs,
                result: llmResult,
              },
            },
          },
        };
      }
    }

    // Fallback: LLM unavailable → suggest the tool page with explanation
    const toolRecs = recommendToolsByKeyword(contentIntent.tool, 1);
    const isZh = locale === 'zh';
    return {
      message: {
        role: 'agent',
        content: isZh
          ? `AI 生成服务暂时不可用，你可以使用 **${toolRecs[0]?.name || contentIntent.tool}** 工具来生成内容。点击下方链接前往工具页面。`
          : `AI generation is temporarily unavailable. You can use the **${toolRecs[0]?.name || contentIntent.tool}** tool instead. Click the link below.`,
        metadata: { type: 'tools', tools: toolRecs },
      },
    };
  }

  // 2. Try tool recommendation
  const keywordTools = recommendToolsByKeyword(userText, 3);

  // 3. Try LLM for general chat + tool recommendation
  const config = getLlmConfig();
  if (config && enableLlm) {
    const systemPrompt = buildAgentSystemPrompt(locale);
    const toolContext = keywordTools.length
      ? `\n\nRelevant tools the user might need:\n${keywordTools.map((t) => `- ${t.name}: ${t.description} (${t.url})`).join('\n')}`
      : '';

    const llmMessages = [
      { role: 'system', content: systemPrompt + toolContext },
      ...messages.map((m) => ({
        role: m.role === 'agent' ? 'assistant' : m.role,
        content: m.content,
      })),
    ];

    const llmResponse = await callLlm(llmMessages, 0.7);

    if (llmResponse) {
      return {
        message: {
          role: 'agent',
          content: llmResponse,
          metadata: keywordTools.length
            ? { type: 'tools', tools: keywordTools }
            : { type: 'text' },
        },
        suggestedTools: keywordTools.length ? keywordTools : undefined,
      };
    }
  }

  // 4. Fallback: no LLM or LLM disabled → pure keyword-based response
  if (keywordTools.length > 0) {
    const isZh = locale === 'zh';
    const toolList = keywordTools
      .map((t) => `- **${t.name}**: ${isZh ? t.description : t.description}`)
      .join('\n');

    return {
      message: {
        role: 'agent',
        content: isZh
          ? `看起来你需要以下工具：\n\n${toolList}\n\n点击卡片即可使用。`
          : `Here are some tools that might help:\n\n${toolList}\n\nClick any card to try it out.`,
        metadata: { type: 'tools', tools: keywordTools },
      },
      suggestedTools: keywordTools,
    };
  }

  // 5. Ultimate fallback
  return {
    message: {
      role: 'agent',
      content:
        locale === 'zh'
          ? '我是 AIHues 助手。你可以问我关于工具的问题，比如 "帮我生成 SEO 标题"、"推荐一个 JSON 格式化工具"，或者直接描述你的需求。'
          : "I'm your AIHues assistant. Ask me about tools, like 'help me write an SEO title', 'recommend a JSON formatter', or just describe what you need.",
    },
  };
}
