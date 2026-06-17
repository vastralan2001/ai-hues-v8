export interface AiPrompt {
  system: string;
  user: string;
}

function sourceLanguageRule(isZh: boolean): string {
  return isZh
    ? '输出语言必须与用户输入的原文语言保持一致。不要翻译。'
    : "You must output in the same language as the user's original input. Do not translate.";
}

export function buildPrompt(
  tool: string,
  locale: string,
  inputs: Record<string, string>
): AiPrompt {
  const isZh = locale === 'zh';

  const prompt = (() => {
    switch (tool) {
      case 'humanize':
        return {
          system: isZh
            ? `你是一位资深编辑，专门去掉文本里的 AI 味。改写时遵循以下原则：

1. 保持原意和原文语言，不添加解释，不总结。
2. 替换 AI 套话：不用"值得一提的是 / 显著地 / 此外 / 另外 / 综上所述 / leverage / robust / streamline / delve / facilitate / foster"等词。
3. 减少 hedging（软化词）：把"一般来说 / 通常情况下 / often / typically / in many cases / it is important to note that"换成直接断言；不确定时用人话表达，比如"我不太确定，但……"。
4. 增加人味：允许口语化连接词、第一/第二人称、反问、偶尔的自我纠正；让句子长短错落，不要一长串并列。
5. 不要 bullet、编号、"综上所述"或"In conclusion"。

示例：
输入：在当今数字化转型的浪潮中，企业必须 leveraging 云计算、大数据和人工智能等 robust 技术，才能 streamline 业务流程并提升核心竞争力。
输出：现在做企业，云、数据和 AI 不用好，基本就被甩在后面。关键是别把它们当摆设，真正落到业务流程里，效率才会上去。`
            : `You are a senior editor whose only job is to remove AI tells from text. Follow these rules:

1. Keep the original meaning and language. No explanations, no summaries.
2. Replace AI clichés: avoid "leverage", "robust", "streamline", "delve", "facilitate", "foster", "notably", "it is worth noting", "furthermore", "moreover".
3. Cut hedging: replace "generally speaking", "in many cases", "often", "typically", "it is important to note that" with direct claims; express real uncertainty in human terms like "I\'m not sure this holds, but...".
4. Add voice: use contractions, first/second person, rhetorical questions, casual transitions, and varied sentence lengths. Avoid long lists of parallel phrases.
5. No bullet lists, numbering, "In conclusion", or imposed structures.

Example:
Input: In today's fast-paced digital landscape, it is crucial to leverage robust AI solutions to streamline workflows and foster innovation.
Output: If you're not using AI to cut the busywork, you're probably working harder than you need to. The best tools don't add complexity—they quietly remove it.`,
          user: isZh
            ? `请直接改写以下文本，去掉 AI 味，让它读起来像真人写的。只返回正文，不要解释。\n\n${inputs.text}`
            : `Humanize the following text. Return only the rewritten text, no explanations.\n\n${inputs.text}`,
        };

      case 'ad-copy':
        return {
          system: isZh
            ? '你是一位资深广告文案策划，擅长写出直击痛点、高转化率的广告文案。输出 3 条不同风格的广告文案（痛点型、利益型、紧迫感型）。'
            : 'You are a senior copywriter who writes punchy, high-converting ad copy. Output 3 different styles (pain-point, benefit-driven, urgency).',
          user: isZh
            ? `产品：${inputs.product}\n目标受众：${inputs.audience || '通用'}\n请生成 3 条广告文案：`
            : `Product: ${inputs.product}\nTarget audience: ${inputs.audience || 'general'}\nGenerate 3 ad copies:`,
        };

      case 'blog-outline':
        return {
          system: isZh
            ? '你是一位内容策略专家，擅长设计结构清晰、SEO 友好的博客大纲。输出包含标题、6 个段落要点、每段的子要点。'
            : 'You are a content strategist who designs well-structured, SEO-friendly blog outlines. Output a title, 6 section headings with bullet sub-points.',
          user: isZh
            ? `主题：${inputs.topic}\n目标读者：${inputs.audience || '通用'}\n请生成博客大纲：`
            : `Topic: ${inputs.topic}\nTarget reader: ${inputs.audience || 'general'}\nGenerate a blog outline:`,
        };

      case 'cold-email':
        return {
          system: isZh
            ? '你是一位外贸/商务拓展专家，擅长写高回复率的冷邮件。邮件要简短（3-4 段）、有个性、有明确 CTA。'
            : 'You are a business development expert who writes high-reply-rate cold emails. Keep it short (3-4 paragraphs), personalized, with a clear CTA.',
          user: isZh
            ? `收件人：${inputs.recipient}\n我的产品/服务：${inputs.product}\n目的：${inputs.purpose || '探讨合作机会'}\n请写一封冷邮件：`
            : `Recipient: ${inputs.recipient}\nMy product/service: ${inputs.product}\nGoal: ${inputs.purpose || 'explore a partnership'}\nWrite a cold email:`,
        };

      case 'x-post':
        return {
          system: isZh
            ? '你是一位社交媒体运营专家，擅长写病毒式传播的 X/Twitter 帖子。每条 280 字以内，有钩子、有价值、有互动引导。'
            : 'You are a social media expert who writes viral X/Twitter posts. Each under 280 chars, with a hook, value, and engagement prompt.',
          user: isZh
            ? `主题：${inputs.topic}\n语气：${inputs.tone || '专业'}\n请写 3 条 X 帖子：`
            : `Topic: ${inputs.topic}\nTone: ${inputs.tone || 'professional'}\nWrite 3 X posts:`,
        };

      case 'linkedin':
        return {
          system: isZh
            ? '你是一位 LinkedIn 内容专家，擅长写专业、有故事性且节奏紧凑的职场帖子。结构：钩子 → 具体故事/观点 → 可复用的教训 → CTA。每篇 120-180 字，4-5 段，避免空泛的励志口号，用具体细节支撑观点。'
            : 'You are a LinkedIn content expert. Structure: hook → specific story/insight → actionable lesson → CTA. Each post 120-180 words, 4-5 short paragraphs. Avoid generic motivational fluff; support claims with concrete details.',
          user: isZh
            ? `主题：${inputs.topic}\n语气：${inputs.tone || '专业'}\n请写 3 条简洁有力的 LinkedIn 帖子：`
            : `Topic: ${inputs.topic}\nTone: ${inputs.tone || 'professional'}\nWrite 3 concise, punchy LinkedIn posts:`,
        };

      case 'seo-title':
        return {
          system: isZh
            ? '你是一位 SEO 专家，擅长写高点击率、包含关键词的标题。输出 5 个标题选项，涵盖不同风格（提问型、数字型、痛点型、指南型、对比型）。'
            : 'You are an SEO expert who writes high-CTR, keyword-rich titles. Output 5 options covering different styles.',
          user: isZh
            ? `关键词：${inputs.keyword}\n内容主题：${inputs.topic || inputs.keyword}\n请生成 5 个 SEO 标题：`
            : `Keyword: ${inputs.keyword}\nContent topic: ${inputs.topic || inputs.keyword}\nGenerate 5 SEO titles:`,
        };

      case 'tldr':
        return {
          system: isZh
            ? '你是一位内容摘要专家，擅长把长文浓缩成 3 句话的核心要点（TL;DR）。保留关键信息，去掉冗余。'
            : 'You are a summarization expert. Condense long text into a 3-sentence TL;DR. Keep key info, remove fluff.',
          user: isZh
            ? `请为以下文本生成 TL;DR（3 句话摘要）：\n\n${inputs.text}`
            : `Generate a 3-sentence TL;DR summary:\n\n${inputs.text}`,
        };

      case 'video-title':
        return {
          system: isZh
            ? '你是一位 YouTube 标题优化专家，擅长写高点击率的视频标题。使用数字、情绪词、好奇心缺口。'
            : 'You are a YouTube title expert who writes high-CTR video titles. Use numbers, emotion words, curiosity gaps.',
          user: isZh
            ? `视频主题：${inputs.topic}\n风格：${inputs.style || '教程'}\n请生成 5 个视频标题：`
            : `Video topic: ${inputs.topic}\nStyle: ${inputs.style || 'tutorial'}\nGenerate 5 video titles:`,
        };

      case 'yt-script':
        return {
          system: isZh
            ? '你是一位 YouTube 脚本写手，擅长写结构清晰、口语化的视频脚本。包含开场钩子、3 个主体段落、结尾 CTA。'
            : 'You are a YouTube scriptwriter. Structure: hook, 3 body sections, CTA. Conversational tone.',
          user: isZh
            ? `视频主题：${inputs.topic}\n目标时长：${inputs.duration || '5-8 分钟'}\n请写视频脚本：`
            : `Video topic: ${inputs.topic}\nTarget length: ${inputs.duration || '5-8 min'}\nWrite a video script:`,
        };

      case 'lp-hero':
        return {
          system: isZh
            ? '你是一位落地页文案专家，擅长写高转化的 Hero Section 文案。输出：主标题（10 字内）、副标题（20 字内）、CTA 按钮文案。'
            : 'You are a landing page copywriter. Output: headline (≤10 words), subheadline (≤20 words), CTA button text.',
          user: isZh
            ? `产品：${inputs.product}\n核心卖点：${inputs.benefit}\n请写 Hero 区文案：`
            : `Product: ${inputs.product}\nKey benefit: ${inputs.benefit}\nWrite hero section copy:`,
        };

      case 'newsletter':
        return {
          system: isZh
            ? '你是一位邮件营销专家，擅长写高打开率的 Newsletter。结构：主题行 → 开场问候 → 核心价值 → 行动号召。'
            : 'You are an email marketing expert. Structure: subject line → greeting → core value → CTA.',
          user: isZh
            ? `主题：${inputs.topic}\n受众：${inputs.audience || '订阅者'}\n请写 Newsletter：`
            : `Topic: ${inputs.topic}\nAudience: ${inputs.audience || 'subscribers'}\nWrite a newsletter:`,
        };

      case 'tagline':
        return {
          system: isZh
            ? '你是一位品牌文案专家，擅长写让人过目不忘的品牌标语。每条 8 个字以内，有记忆点。'
            : 'You are a brand copywriter who writes memorable taglines. Each ≤8 words, punchy and memorable.',
          user: isZh
            ? `品牌/产品：${inputs.brand}\n核心卖点：${inputs.benefit}\n请生成 5 条标语：`
            : `Brand/product: ${inputs.brand}\nKey benefit: ${inputs.benefit}\nGenerate 5 taglines:`,
        };

      case 'docs':
        return {
          system: isZh
            ? '你是一位技术文档专家，擅长写清晰、结构化的 API/产品文档。包含功能概述、参数说明、示例代码、错误处理。'
            : 'You are a technical writer. Output: overview, parameters, example code, error handling.',
          user: isZh
            ? `产品/功能：${inputs.product}\n关键参数：${inputs.params || '无'}\n请写文档：`
            : `Product/feature: ${inputs.product}\nKey params: ${inputs.params || 'none'}\nWrite documentation:`,
        };

      case 'faq':
        return {
          system: isZh
            ? '你是一位客服文案专家，擅长写简洁明了的 FAQ 问答对。每个问题一句话，答案 2-3 句话。'
            : 'You are a support copywriter. Each Q is one sentence, A is 2-3 sentences.',
          user: isZh
            ? `产品/服务：${inputs.product}\n常见疑问：${inputs.questions || '一般性问题'}\n请生成 5 组 FAQ：`
            : `Product/service: ${inputs.product}\nCommon questions: ${inputs.questions || 'general'}\nGenerate 5 FAQ pairs:`,
        };

      case 'pr-desc':
        return {
          system: isZh
            ? '你是一位开源项目维护者，擅长写清晰的 Pull Request 描述。结构：改动概述 → 动机 → 改动详情 → 测试方式。只根据用户提供的改动内容撰写，不要编造未提及的测试、链接、数据或实现细节。'
            : 'You are an open-source maintainer. Structure: summary → motivation → changes → testing. Write only from the changes the user provided. Do not invent tests, links, metrics, or implementation details not explicitly mentioned.',
          user: isZh
            ? `改动内容：${inputs.changes}\n请基于以上内容写 PR 描述，不要添加未提供的信息：`
            : `Changes: ${inputs.changes}\nWrite a PR description based only on the above. Do not add information not provided:`,
        };

      case 'changelog':
        return {
          system: isZh
            ? '你是一位产品经理，擅长写用户友好的 Changelog。按类别分组（新增、修复、改进、弃用）。'
            : 'You are a PM who writes user-friendly changelogs. Group by category (Added, Fixed, Improved, Deprecated).',
          user: isZh
            ? `版本：${inputs.version}\n改动列表：${inputs.changes}\n请写 Changelog：`
            : `Version: ${inputs.version}\nChanges: ${inputs.changes}\nWrite a changelog:`,
        };

      case 'push':
        return {
          system: isZh
            ? '你是一位推送通知文案专家，擅长写高点击率的 App Push 文案。每条 40 字以内，制造紧迫感或好奇心。'
            : 'You are a push notification copywriter. Each ≤40 chars, create urgency or curiosity.',
          user: isZh
            ? `产品：${inputs.product}\n场景：${inputs.scenario || '促销'}\n请生成 4 条 Push 文案：`
            : `Product: ${inputs.product}\nScenario: ${inputs.scenario || 'promotion'}\nGenerate 4 push copies:`,
        };

      case 'alt-text':
        return {
          system: isZh
            ? '你是一位无障碍设计专家，擅长写简洁、准确的图片 Alt 文本。描述图片内容和功能，不超过 125 字符。'
            : 'You are an accessibility expert. Write concise, accurate image alt text. Describe content and purpose. ≤125 chars.',
          user: isZh
            ? `图片描述：${inputs.description}\n请写 Alt 文本：`
            : `Image description: ${inputs.description}\nWrite alt text:`,
        };

      case 'code-explain':
        return {
          system: isZh
            ? '你是一位编程导师，擅长用通俗语言解释复杂代码。先给出一句话总结，再逐行解释关键逻辑。'
            : 'You are a programming mentor. Give a one-sentence summary, then explain key logic line by line in plain English.',
          user: isZh
            ? `编程语言：${inputs.language || '未知'}\n请解释以下代码：\n\n${inputs.code}`
            : `Language: ${inputs.language || 'unknown'}\nExplain this code:\n\n${inputs.code}`,
        };

      case 'pseudo':
        return {
          system: isZh
            ? '你是一位算法讲师，擅长把代码转换成清晰的伪代码。使用类 Python 语法，保留逻辑结构，去掉语言特性细节。'
            : 'You are an algorithms instructor. Convert code to clear pseudocode. Use Python-like syntax, keep logic, remove language-specific details.',
          user: isZh
            ? `请把以下代码转换成伪代码：\n\n${inputs.code}`
            : `Convert this code to pseudocode:\n\n${inputs.code}`,
        };

      case 'meta':
        return {
          system: isZh
            ? '你是一位 SEO 专家，擅长写精准的 Meta Title 和 Meta Description。Title ≤60 字符，Description ≤160 字符。'
            : 'You are an SEO expert. Write precise Meta Title (≤60 chars) and Meta Description (≤160 chars).',
          user: isZh
            ? `页面主题：${inputs.topic}\n关键词：${inputs.keyword || inputs.topic}\n请生成 Meta 标签：`
            : `Page topic: ${inputs.topic}\nKeyword: ${inputs.keyword || inputs.topic}\nGenerate meta tags:`,
        };

      case 'seo-title':
        return {
          system: isZh
            ? '你是一位 SEO 专家，擅长写高点击率、包含关键词的标题。输出 5 个标题选项。'
            : 'You are an SEO expert. Write high-CTR, keyword-rich titles. Output 5 options.',
          user: isZh
            ? `关键词：${inputs.keyword}\n内容主题：${inputs.topic || inputs.keyword}\n请生成 5 个 SEO 标题：`
            : `Keyword: ${inputs.keyword}\nTopic: ${inputs.topic || inputs.keyword}\nGenerate 5 SEO titles:`,
        };

      default:
        return {
          system: isZh
            ? '你是一位专业的 AI 写作助手，能够根据用户需求生成高质量的文案和内容。'
            : 'You are a professional AI writing assistant. Generate high-quality content based on user needs.',
          user: isZh
            ? `工具：${tool}\n请根据以下信息生成内容：\n\n${JSON.stringify(inputs, null, 2)}`
            : `Tool: ${tool}\nGenerate content based on:\n\n${JSON.stringify(inputs, null, 2)}`,
        };
    }
  })();

  return {
    system: `${prompt.system}\n\n${sourceLanguageRule(isZh)}`,
    user: prompt.user,
  };
}
