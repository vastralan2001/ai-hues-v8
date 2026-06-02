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
