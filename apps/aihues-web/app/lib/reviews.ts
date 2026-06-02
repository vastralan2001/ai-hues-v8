/* ── AIHues Tool Review System ──
   6-dimension scoring model aligned with business plan:
   Output Quality 30% + Ease of Use 20% + Value 20% +
   Integration 15% + Iteration Speed 10% + Community 5%
*/

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
