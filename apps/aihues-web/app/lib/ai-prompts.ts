export interface AiPrompt {
  system: string;
  user: string;
}

export function buildPrompt(
  tool: string,
  locale: string,
  inputs: Record<string, string>
): AiPrompt {
  const isZh = locale === 'zh';

  switch (tool) {
    case 'humanize':
      return {
        system: isZh
          ? '你是一位写作助手，擅长将正式、生硬的文本改写成自然、口语化、有人情味的表达。保持原意不变，使用更简单的词汇和更短的句子，适当使用口语化连接词。'
          : 'You are a writing assistant that transforms formal, stiff text into natural, conversational, human-like writing. Keep the same meaning but use simpler words, contractions, shorter sentences, and casual transitions.',
        user: isZh
          ? `请将以下文本改写得更自然、更口语化，像真人说话一样：\n\n${inputs.text}`
          : `Rewrite the following text to sound natural, conversational, and human-like. Use contractions, simpler words, and a friendly tone:\n\n${inputs.text}`,
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
          ? '你是一位 LinkedIn 内容专家，擅长写专业且有故事性的职场帖子。结构：钩子 → 故事/观点 → 教训 → CTA。'
          : 'You are a LinkedIn content expert. Structure: hook → story/insight → lesson → CTA.',
        user: isZh
          ? `主题：${inputs.topic}\n语气：${inputs.tone || '专业'}\n请写 3 条 LinkedIn 帖子：`
          : `Topic: ${inputs.topic}\nTone: ${inputs.tone || 'professional'}\nWrite 3 LinkedIn posts:`,
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
          ? '你是一位开源项目维护者，擅长写清晰的 Pull Request 描述。包含：改动概述、动机、改动详情、测试方式。'
          : 'You are an open-source maintainer. Structure: summary → motivation → changes → testing.',
        user: isZh
          ? `改动内容：${inputs.changes}\n请写 PR 描述：`
          : `Changes: ${inputs.changes}\nWrite a PR description:`,
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
}
