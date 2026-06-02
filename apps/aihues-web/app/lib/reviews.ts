/* ── AIHues Tool Review System ──
   6-dimension scoring model aligned with business plan:
   Output Quality 30% + Ease of Use 20% + Value 20% +
   Integration 15% + Iteration Speed 10% + Community 5%
*/

import type { Locale } from './dict';

export interface DimensionScores {
  outputQuality: number; // 输出质量 30%
  easeOfUse: number; // 易用性 20%
  value: number; // 性价比 20%
  integration: number; // 集成能力 15%
  iterationSpeed: number; // 迭代速度 10%
  community: number; // 社区活跃 5%
}

export const DIMENSION_LABELS: Record<keyof DimensionScores, string> = {
  outputQuality: '输出质量',
  easeOfUse: '易用性',
  value: '性价比',
  integration: '集成能力',
  iterationSpeed: '迭代速度',
  community: '社区活跃',
};

export const DIMENSION_LABELS_EN: Record<keyof DimensionScores, string> = {
  outputQuality: 'Output Quality',
  easeOfUse: 'Ease of Use',
  value: 'Value',
  integration: 'Integration',
  iterationSpeed: 'Iteration',
  community: 'Community',
};

export const DIMENSION_WEIGHTS: Record<keyof DimensionScores, number> = {
  outputQuality: 0.3,
  easeOfUse: 0.2,
  value: 0.2,
  integration: 0.15,
  iterationSpeed: 0.1,
  community: 0.05,
};

export interface ToolReview {
  slug: string;
  overall: number; // 1-5, computed from weighted dimensions
  dimensions: DimensionScores;
  pros: string[];
  cons: string[];
  verdict: string; // one-line summary
  bestFor: string[]; // target audiences
  alternatives: string[]; // alternative tool slugs
  testedDate: string;
  lastUpdated: string;
  reviewer: string;
}

export function computeOverall(dimensions: DimensionScores): number {
  let score = 0;
  for (const key of Object.keys(dimensions) as Array<keyof DimensionScores>) {
    score += dimensions[key] * DIMENSION_WEIGHTS[key];
  }
  return Math.round(score * 10) / 10;
}

export function starRating(score: number): string {
  const full = Math.floor(score);
  const half = score - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

/* ── Seed reviews for launch ──
   First batch: 15 tools per business plan
   (5 content creation + 5 video generation + 3 social media + 2 cross)
   For now we seed with existing AIHues tools as placeholders.
*/

export const SEED_REVIEWS: ToolReview[] = [
  {
    slug: 'ad-copy',
    overall: 0, // computed below
    dimensions: {
      outputQuality: 4.0,
      easeOfUse: 4.5,
      value: 4.0,
      integration: 3.0,
      iterationSpeed: 4.0,
      community: 3.5,
    },
    pros: [
      '一键生成3套不同风格的广告文案',
      '支持A/B测试结构',
      '中文语境优化较好',
    ],
    cons: [
      '创意深度有限，需要人工二次打磨',
      '不支持多语言混合输出',
      '长文案场景表现一般',
    ],
    verdict:
      '适合快速产出广告文案初稿，节省 brainstorm 时间，但重大 campaign 仍需人工把控创意方向。',
    bestFor: ['中小广告主', '电商运营', '社媒内容创作者'],
    alternatives: ['tagline', 'x-post', 'lp-hero'],
    testedDate: '2026-05-15',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'blog-outline',
    overall: 0,
    dimensions: {
      outputQuality: 4.5,
      easeOfUse: 4.0,
      value: 4.5,
      integration: 3.0,
      iterationSpeed: 3.5,
      community: 3.0,
    },
    pros: [
      '6段式结构清晰，逻辑严密',
      '自动生成SEO关键词建议',
      '支持长文（3000字+）大纲',
    ],
    cons: [
      '对垂直领域专业知识覆盖不足',
      '缺乏数据引用和案例填充',
      '输出格式单一',
    ],
    verdict:
      '博客创作的「第一推动力」，帮你从零到一搭建文章骨架，但血肉填充仍需专业积累。',
    bestFor: ['内容营销人员', '独立博主', 'SEO从业者'],
    alternatives: ['seo-title', 'tldr', 'docs'],
    testedDate: '2026-05-18',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'cold-email',
    overall: 0,
    dimensions: {
      outputQuality: 3.5,
      easeOfUse: 4.5,
      value: 4.0,
      integration: 2.5,
      iterationSpeed: 3.5,
      community: 3.0,
    },
    pros: [
      '3种经典 outreach 模板',
      '自动调整语气（正式/友好/直接）',
      '包含跟进邮件序列',
    ],
    cons: [
      '个性化程度有限，容易被识别为模板',
      '缺乏收件人背景调研',
      '不适合高客单价B2B销售',
    ],
    verdict:
      '冷启动阶段的「敲门砖」，适合批量触达，但转化率天花板明显，高价值客户仍需1对1定制。',
    bestFor: ['BD专员', '创业者', 'SaaS销售'],
    alternatives: ['linkedin', 'newsletter', 'x-post'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'code-review',
    overall: 0,
    dimensions: {
      outputQuality: 4.0,
      easeOfUse: 3.5,
      value: 4.0,
      integration: 3.5,
      iterationSpeed: 4.0,
      community: 3.5,
    },
    pros: [
      '能识别常见反模式和性能陷阱',
      '提供重构建议而不仅是问题列表',
      '支持多种编程语言',
    ],
    cons: ['对业务逻辑理解有限', '大型代码库分析速度慢', '安全漏洞检测不够深'],
    verdict:
      '代码质量的「守门员」，适合日常CR补充和新手学习，但关键业务逻辑仍需资深工程师把关。',
    bestFor: ['初级开发者', '技术团队', '开源贡献者'],
    alternatives: ['code-explain', 'git-commit', 'docs'],
    testedDate: '2026-05-22',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'json',
    overall: 0,
    dimensions: {
      outputQuality: 5.0,
      easeOfUse: 5.0,
      value: 5.0,
      integration: 4.0,
      iterationSpeed: 5.0,
      community: 4.0,
    },
    pros: [
      '零延迟，完全本地运行',
      '深色主题语法高亮',
      '可折叠树形结构',
      '精准错误定位',
    ],
    cons: ['超大JSON（>10MB）可能卡顿', '不支持JSON Schema验证'],
    verdict:
      '开发者工具箱的「瑞士军刀」，格式化、校验、浏览一气呵成，无需联网，隐私无忧。',
    bestFor: ['前端开发者', '后端开发者', 'API调试人员'],
    alternatives: ['csv-json', 'yaml-convert'],
    testedDate: '2026-04-01',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'jwt',
    overall: 0,
    dimensions: {
      outputQuality: 5.0,
      easeOfUse: 5.0,
      value: 5.0,
      integration: 4.5,
      iterationSpeed: 5.0,
      community: 4.0,
    },
    pros: [
      '一键解码，无需安装任何软件',
      '自动检测过期时间',
      '支持JWS和JWE',
      'Base64自动识别',
    ],
    cons: ['不支持JWT签名验证（需密钥）', '无批量解析功能'],
    verdict:
      '调试JWT的「秒表」，比jwt.io更快、更轻，尤其适合频繁调试token的开发场景。',
    bestFor: ['全栈开发者', 'DevOps工程师', '安全工程师'],
    alternatives: ['base64', 'sha256'],
    testedDate: '2026-04-01',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'linkedin',
    overall: 0,
    dimensions: {
      outputQuality: 3.5,
      easeOfUse: 4.5,
      value: 4.0,
      integration: 2.5,
      iterationSpeed: 3.5,
      community: 3.0,
    },
    pros: [
      '3种帖子格式（故事型/列表型/观点型）',
      '自动添加hashtag和表情符号',
      '针对B2B语境优化语气',
    ],
    cons: [
      '长文内容结构较单一',
      '无法自动抓取个人成就数据',
      '对非英语市场支持有限',
    ],
    verdict:
      'LinkedIn内容运营的「加速器」，适合保持日常活跃度和建立专业形象，但深度 thought leadership 仍需个人原创。',
    bestFor: ['BD专员', '创业者', '职场内容创作者'],
    alternatives: ['x-post', 'newsletter', 'ad-copy'],
    testedDate: '2026-05-22',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'x-post',
    overall: 0,
    dimensions: {
      outputQuality: 3.5,
      easeOfUse: 4.5,
      value: 4.0,
      integration: 3.0,
      iterationSpeed: 3.5,
      community: 3.5,
    },
    pros: [
      '3种X帖子格式（话题型/线程型/引用型）',
      '自动优化字符数（280字限制）',
      '支持hashtag智能推荐',
    ],
    cons: [
      '语气偏向美式互联网风格',
      '不支持图片alt文本生成',
      '线程(thread)连贯性一般',
    ],
    verdict:
      'X/Twitter内容产出的「快捷键」，适合日常热点跟进和社群互动，但深度观点输出仍需个人风格加持。',
    bestFor: ['社群运营', '独立开发者', '内容创作者'],
    alternatives: ['linkedin', 'ad-copy', 'tagline'],
    testedDate: '2026-05-23',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'lp-hero',
    overall: 0,
    dimensions: {
      outputQuality: 3.0,
      easeOfUse: 4.0,
      value: 3.5,
      integration: 2.0,
      iterationSpeed: 3.0,
      community: 2.5,
    },
    pros: [
      'AIDA结构（注意→兴趣→欲望→行动）',
      '支持CTA按钮文案生成',
      '多行业模板（SaaS/电商/服务）',
    ],
    cons: [
      '设计视觉建议缺失',
      '移动端适配文案考虑不足',
      '品牌调性一致性难以保证',
    ],
    verdict:
      '落地页文案的「脚手架」，能帮你快速搭建hero section框架，但视觉和设计落地仍需专业团队。',
    bestFor: ['产品经理', '独立开发者', '增长黑客'],
    alternatives: ['ad-copy', 'seo-title', 'tagline'],
    testedDate: '2026-05-24',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'seo-title',
    overall: 0,
    dimensions: {
      outputQuality: 4.0,
      easeOfUse: 4.5,
      value: 4.5,
      integration: 3.0,
      iterationSpeed: 4.0,
      community: 3.0,
    },
    pros: [
      '自动检测标题长度（Google标准60字符）',
      '生成5种不同风格的变体',
      '包含关键词密度建议',
    ],
    cons: [
      '对长尾关键词覆盖不足',
      '无法获取实时搜索量数据',
      '多语言SEO支持有限',
    ],
    verdict:
      'SEO标题的「快速生成器」，能产出符合搜索引擎规范的标题变体，但关键词策略仍需SEO工具配合。',
    bestFor: ['SEO专员', '内容运营', '独立博主'],
    alternatives: ['meta', 'blog-outline', 'tldr'],
    testedDate: '2026-05-25',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'meta',
    overall: 0,
    dimensions: {
      outputQuality: 4.0,
      easeOfUse: 4.5,
      value: 4.0,
      integration: 2.5,
      iterationSpeed: 4.0,
      community: 2.5,
    },
    pros: [
      '自动生成meta title + description + keywords',
      'OG标签（Open Graph）支持',
      '字符数实时校验',
    ],
    cons: [
      '缺乏竞品meta对比分析',
      '无法自动抓取页面正文生成',
      'Schema.org结构化数据不支持',
    ],
    verdict:
      '页面元信息的「一键补齐」，适合批量生成meta标签，但竞品分析和结构化数据需额外工具。',
    bestFor: ['SEO专员', '前端开发者', '内容运营'],
    alternatives: ['seo-title', 'schema', 'blog-outline'],
    testedDate: '2026-05-25',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'tldr',
    overall: 0,
    dimensions: {
      outputQuality: 4.0,
      easeOfUse: 4.5,
      value: 4.5,
      integration: 3.0,
      iterationSpeed: 4.5,
      community: 3.0,
    },
    pros: [
      '支持多种摘要长度（1句/3句/5句）',
      '保留原文关键数据和结论',
      '处理速度快，长文也能秒出',
    ],
    cons: [
      '对技术文档的专业术语保留不够精准',
      '不支持多语言混合文本',
      '无法生成bullet points格式',
    ],
    verdict:
      '信息过载时代的「速读助手」，快速提取长文核心观点，但专业领域摘要仍需人工校对关键术语。',
    bestFor: ['研究人员', '投资人', '内容策展人'],
    alternatives: ['blog-outline', 'docs', 'seo-title'],
    testedDate: '2026-05-26',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'regex',
    overall: 0,
    dimensions: {
      outputQuality: 4.5,
      easeOfUse: 3.5,
      value: 4.5,
      integration: 4.0,
      iterationSpeed: 5.0,
      community: 4.0,
    },
    pros: [
      '实时匹配高亮和错误提示',
      '支持多种正则引擎（PCRE/JS/Python）',
      '提供常用正则模板库',
    ],
    cons: [
      '复杂回溯场景无性能预警',
      '不支持正则可视化图解',
      '大文本（>1MB）测试可能卡顿',
    ],
    verdict:
      '正则表达式的「在线实验室」，测试、调试、学习三合一，比regex101更轻量，适合快速验证。',
    bestFor: ['后端开发者', '运维工程师', '数据分析师'],
    alternatives: ['code-explain', 'code-review', 'shell'],
    testedDate: '2026-04-10',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'code-explain',
    overall: 0,
    dimensions: {
      outputQuality: 3.5,
      easeOfUse: 4.5,
      value: 3.5,
      integration: 3.0,
      iterationSpeed: 3.5,
      community: 3.5,
    },
    pros: ['支持10+编程语言', '自动识别算法复杂度', '用自然语言解释晦涩代码'],
    cons: [
      '对业务逻辑上下文理解有限',
      '大型代码块处理时丢失细节',
      '解释深度不可调节（初级vs高级）',
    ],
    verdict:
      '代码学习的「翻译官」，适合理解陌生代码库和算法原理，但业务逻辑理解仍需领域专家。',
    bestFor: ['初级开发者', '技术面试官', '代码审查者'],
    alternatives: ['code-review', 'docs', 'git-commit'],
    testedDate: '2026-05-27',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'video-title',
    overall: 0,
    dimensions: {
      outputQuality: 3.5,
      easeOfUse: 4.5,
      value: 3.5,
      integration: 2.5,
      iterationSpeed: 3.5,
      community: 2.5,
    },
    pros: [
      '8种标题风格（悬念型/数字型/问题型等）',
      '自动检测YouTube字符限制',
      '关键词SEO友好度评分',
    ],
    cons: [
      '对中文视频标题优化较弱',
      '无法分析竞品频道标题策略',
      '缩略图文案建议缺失',
    ],
    verdict:
      'YouTube创作者的「标题灵感库」，能产出吸引眼球的标题变体，但缩略图策略和竞品分析需额外工具。',
    bestFor: ['YouTube创作者', '视频运营', '内容营销人员'],
    alternatives: ['x-post', 'seo-title', 'yt-script'],
    testedDate: '2026-05-28',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
];

// Compute overall scores
for (const r of SEED_REVIEWS) {
  r.overall = computeOverall(r.dimensions);
}

export function getReviewBySlug(slug: string): ToolReview | undefined {
  return SEED_REVIEWS.find((r) => r.slug === slug);
}

export function getAllReviews(): ToolReview[] {
  return SEED_REVIEWS;
}

export function getReviewsByCategory(_category: string): ToolReview[] {
  // TODO: map slugs to categories via tool-data.ts
  return SEED_REVIEWS;
}

/* ── Blog article → related tools mapping ── */

export const TAG_TO_TOOL_SLUGS: Record<string, string[]> = {
  'AI Tools': [
    'ad-copy',
    'blog-outline',
    'code-review',
    'humanize',
    'alt-text',
  ],
  Content: ['blog-outline', 'seo-title', 'meta', 'tldr', 'video-title'],
  Development: ['json', 'jwt', 'regex', 'code-review', 'code-explain'],
  Growth: ['ad-copy', 'cold-email', 'linkedin', 'x-post', 'lp-hero'],
  'Indie Dev': ['git-commit', 'pr-desc', 'docs', 'changelog', 'faq'],
  'KOL Marketing': ['linkedin', 'x-post', 'video-title', 'yt-script'],
  Product: ['tagline', 'lp-hero', 'faq', 'changelog', 'docs'],
  Productivity: ['markdown', 'pomodoro', 'word-count', 'diff', 'tldr'],
  'Reddit Marketing': ['cold-email', 'x-post', 'push', 'ad-copy'],
  SEO: ['seo-title', 'meta', 'alt-text', 'blog-outline'],
  'Social Media': ['x-post', 'linkedin', 'video-title', 'push', 'ad-copy'],
};

export function getRelatedToolSlugsByTag(tag: string): string[] {
  return TAG_TO_TOOL_SLUGS[tag] || [];
}

/* ── English review content (bilingual support) ── */

interface LocalizedReview {
  pros: string[];
  cons: string[];
  verdict: string;
  bestFor: string[];
}

const REVIEW_EN: Record<string, LocalizedReview> = {
  'ad-copy': {
    pros: [
      'Generates 3 ad copy variants in one click',
      'Supports A/B test structures',
      'Well-optimized for Chinese context',
    ],
    cons: [
      'Limited creative depth, needs manual polish',
      'No multilingual mixed output',
      'Underperforms on long-form copy',
    ],
    verdict:
      'Great for quick ad copy drafts and saving brainstorm time, but major campaigns still need human creative direction.',
    bestFor: [
      'Small business advertisers',
      'E-commerce operators',
      'Social media creators',
    ],
  },
  'blog-outline': {
    pros: [
      'Clear 6-section structure with strong logic',
      'Auto-generates SEO keyword suggestions',
      'Supports long-form (3000+ words) outlines',
    ],
    cons: [
      'Limited vertical domain expertise coverage',
      'Lacks data citations and case studies',
      'Single output format',
    ],
    verdict:
      "A strong 'first push' for blog creation—helps build article skeletons from scratch, but filling in the substance still requires domain expertise.",
    bestFor: ['Content marketers', 'Independent bloggers', 'SEO practitioners'],
  },
  'cold-email': {
    pros: [
      '3 classic outreach templates',
      'Auto-adjusts tone (formal/friendly/direct)',
      'Includes follow-up email sequences',
    ],
    cons: [
      'Limited personalization, easy to spot as template',
      'No recipient background research',
      'Not suitable for high-ticket B2B sales',
    ],
    verdict:
      "A solid 'door knocker' for cold outreach, great for volume, but conversion ceiling is obvious—high-value clients still need 1:1 customization.",
    bestFor: ['BD specialists', 'Startup founders', 'SaaS salespeople'],
  },
  'code-review': {
    pros: [
      'Identifies common anti-patterns and performance traps',
      'Provides refactoring suggestions, not just problem lists',
      'Supports multiple programming languages',
    ],
    cons: [
      'Limited understanding of business logic',
      'Slow on large codebases',
      'Shallow security vulnerability detection',
    ],
    verdict:
      "A 'gatekeeper' for code quality—great for daily CR supplements and junior dev learning, but critical business logic still needs senior engineers.",
    bestFor: ['Junior developers', 'Tech teams', 'Open-source contributors'],
  },
  json: {
    pros: [
      'Zero latency, fully local execution',
      'Dark theme syntax highlighting',
      'Collapsible tree structure',
      'Precise error pinpointing',
    ],
    cons: ['May lag on oversized JSON (>10MB)', 'No JSON Schema validation'],
    verdict:
      "The 'Swiss Army knife' of developer toolboxes—format, validate, and browse in one go. No internet needed, privacy guaranteed.",
    bestFor: ['Frontend developers', 'Backend developers', 'API debuggers'],
  },
  jwt: {
    pros: [
      'One-click decoding, no software install needed',
      'Auto-detects expiration time',
      'Supports JWS and JWE',
      'Auto Base64 recognition',
    ],
    cons: [
      'No JWT signature verification (needs secret key)',
      'No batch parsing',
    ],
    verdict:
      "The 'stopwatch' for JWT debugging—faster and lighter than jwt.io, ideal for frequent token debugging scenarios.",
    bestFor: [
      'Full-stack developers',
      'DevOps engineers',
      'Security engineers',
    ],
  },
  linkedin: {
    pros: [
      '3 post formats (story/list/opinion)',
      'Auto-adds hashtags and emojis',
      'B2B context tone optimization',
    ],
    cons: [
      'Limited long-form structure variety',
      'Cannot auto-fetch personal achievements',
      'Limited support for non-English markets',
    ],
    verdict:
      "An 'accelerator' for LinkedIn content ops—great for daily activity and professional branding, but deep thought leadership still needs original work.",
    bestFor: [
      'BD specialists',
      'Startup founders',
      'Professional content creators',
    ],
  },
  'x-post': {
    pros: [
      '3 X post formats (topic/thread/quote)',
      'Auto-optimizes for 280 char limit',
      'Smart hashtag recommendations',
    ],
    cons: [
      'Tone leans American internet style',
      'No image alt text generation',
      'Thread continuity is average',
    ],
    verdict:
      "A 'shortcut' for X/Twitter content—great for daily hot topics and community engagement, but deep opinions still need personal voice.",
    bestFor: ['Community managers', 'Indie developers', 'Content creators'],
  },
  'lp-hero': {
    pros: [
      'AIDA structure (Attention→Interest→Desire→Action)',
      'Supports CTA button copy generation',
      'Multi-industry templates (SaaS/e-commerce/services)',
    ],
    cons: [
      'Missing visual design suggestions',
      'Insufficient mobile copy consideration',
      'Brand tone consistency hard to guarantee',
    ],
    verdict:
      "The 'scaffolding' for landing page copy—helps quickly build hero section frameworks, but visual and design execution still needs a professional team.",
    bestFor: ['Product managers', 'Indie developers', 'Growth hackers'],
  },
  'seo-title': {
    pros: [
      'Auto-detects title length (Google 60 char standard)',
      'Generates 5 style variants',
      'Includes keyword density suggestions',
    ],
    cons: [
      'Limited long-tail keyword coverage',
      'Cannot fetch real-time search volume',
      'Limited multilingual SEO support',
    ],
    verdict:
      "A 'quick generator' for SEO titles—produces search-engine-compliant title variants, but keyword strategy still needs SEO tools.",
    bestFor: ['SEO specialists', 'Content ops', 'Independent bloggers'],
  },
  meta: {
    pros: [
      'Auto-generates meta title + description + keywords',
      'Open Graph tag support',
      'Real-time character count validation',
    ],
    cons: [
      'Lacks competitor meta comparison',
      'Cannot auto-scrape page content',
      'No Schema.org structured data',
    ],
    verdict:
      "A 'one-click fix' for page metadata—great for batch meta tag generation, but competitor analysis and structured data need extra tools.",
    bestFor: ['SEO specialists', 'Frontend developers', 'Content ops'],
  },
  tldr: {
    pros: [
      'Multiple summary lengths (1/3/5 sentences)',
      'Preserves key data and conclusions',
      'Fast processing, even on long texts',
    ],
    cons: [
      'Technical terminology accuracy could be better',
      'No mixed-language support',
      'Cannot generate bullet points',
    ],
    verdict:
      "A 'speed-reading assistant' for the information overload era—quickly extracts core arguments from long texts, but professional domain summaries still need manual review of key terms.",
    bestFor: ['Researchers', 'Investors', 'Content curators'],
  },
  regex: {
    pros: [
      'Real-time match highlighting and error tips',
      'Supports multiple regex engines (PCRE/JS/Python)',
      'Common regex template library',
    ],
    cons: [
      'No performance warning for complex backtracking',
      'No regex visualization diagrams',
      'May lag on large text (>1MB)',
    ],
    verdict:
      "An 'online lab' for regex—test, debug, and learn in one place. Lighter than regex101, ideal for quick validation.",
    bestFor: ['Backend developers', 'DevOps engineers', 'Data analysts'],
  },
  'code-explain': {
    pros: [
      'Supports 10+ programming languages',
      'Auto-identifies algorithm complexity',
      'Explains obscure code in plain language',
    ],
    cons: [
      'Limited business logic context understanding',
      'Loses details on large code blocks',
      'Explanation depth not adjustable (junior vs senior)',
    ],
    verdict:
      "A 'translator' for code learning—great for understanding unfamiliar codebases and algorithm principles, but business logic still needs domain experts.",
    bestFor: ['Junior developers', 'Tech interviewers', 'Code reviewers'],
  },
  'video-title': {
    pros: [
      '8 title styles (suspense/number/question/etc)',
      'Auto-detects YouTube character limit',
      'Keyword SEO-friendliness scoring',
    ],
    cons: [
      'Weak optimization for Chinese video titles',
      'Cannot analyze competitor channel strategies',
      'Missing thumbnail copy suggestions',
    ],
    verdict:
      "A 'title inspiration library' for YouTube creators—generates eye-catching title variants, but thumbnail strategy and competitor analysis need extra tools.",
    bestFor: ['YouTube creators', 'Video ops', 'Content marketers'],
  },
};

export function getReviewText(
  review: ToolReview,
  locale: Locale
): { pros: string[]; cons: string[]; verdict: string; bestFor: string[] } {
  if (locale === 'zh') {
    return {
      pros: review.pros,
      cons: review.cons,
      verdict: review.verdict,
      bestFor: review.bestFor,
    };
  }
  const en = REVIEW_EN[review.slug];
  if (en) {
    return {
      pros: en.pros,
      cons: en.cons,
      verdict: en.verdict,
      bestFor: en.bestFor,
    };
  }
  return {
    pros: review.pros,
    cons: review.cons,
    verdict: review.verdict,
    bestFor: review.bestFor,
  };
}
