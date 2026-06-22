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
    alternatives: ['csv-json', 'markdown'],
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
    alternatives: ['seo-title', 'lp-hero', 'blog-outline'],
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

  {
    slug: 'word-count',
    overall: 0,
    dimensions: {
      outputQuality: 4.2,
      easeOfUse: 4.2,
      value: 4.4,
      integration: 2.7,
      iterationSpeed: 3.2,
      community: 2.6,
    },
    pros: ['处理速度快', '支持大文本输入', '结果直观明了'],
    cons: ['不支持正则高级用法', '大文本性能一般', '缺少云端同步'],
    verdict:
      '「字数统计」专注于文本处理的核心需求，速度快、结果准，是内容工作者的实用工具。',
    bestFor: ['编辑', '作家', '学生'],
    alternatives: ['lorem-ipsum', 'uuid', 'markdown'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'base64',
    overall: 0,
    dimensions: {
      outputQuality: 4.3,
      easeOfUse: 5,
      value: 5,
      integration: 2.2,
      iterationSpeed: 2.9,
      community: 2.5,
    },
    pros: ['零延迟本地计算', '无需联网即可使用', '结果精准可靠'],
    cons: ['不支持批量文件处理', '无历史记录功能', 'UI较为简陋'],
    verdict:
      '「Base64编解码」是开发者的基础利器，打开即用，结果可靠，适合快速处理编码需求。',
    bestFor: ['前端开发者', '后端开发者', 'API调试人员'],
    alternatives: ['title-case', 'password-gen', 'regex'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'url-encode',
    overall: 0,
    dimensions: {
      outputQuality: 4.3,
      easeOfUse: 4.9,
      value: 4.9,
      integration: 1.7,
      iterationSpeed: 3.2,
      community: 2.6,
    },
    pros: ['零延迟本地计算', '无需联网即可使用', '结果精准可靠'],
    cons: ['不支持批量文件处理', '无历史记录功能', 'UI较为简陋'],
    verdict:
      '「URL编解码」是开发者的基础利器，打开即用，结果可靠，适合快速处理编码需求。',
    bestFor: ['前端开发者', '后端开发者', 'API调试人员'],
    alternatives: ['markdown', 'base64', 'docs'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'uuid',
    overall: 0,
    dimensions: {
      outputQuality: 4.2,
      easeOfUse: 4.2,
      value: 4.4,
      integration: 2.3,
      iterationSpeed: 3.7,
      community: 2.8,
    },
    pros: ['一键生成无需配置', '输出格式规范', '支持批量操作'],
    cons: ['随机性不可控', '创意深度有限', '缺少模板库'],
    verdict:
      '「UUID生成器」一键生成所需内容，省去手动配置的繁琐，适合快速原型和占位需求。',
    bestFor: ['产品经理', '设计师', '开发者'],
    alternatives: ['css-gradient', 'newsletter', 'regex'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'sha256',
    overall: 0,
    dimensions: {
      outputQuality: 4.3,
      easeOfUse: 4.8,
      value: 5,
      integration: 1.8,
      iterationSpeed: 3.1,
      community: 2.6,
    },
    pros: ['算法标准合规', '计算过程完全本地', '结果可验证'],
    cons: ['不支持文件级哈希', '无对比功能', '缺少高级算法选项'],
    verdict:
      '「SHA256哈希」提供标准可靠的哈希计算，完全本地运行，隐私无忧，适合安全相关场景。',
    bestFor: ['安全工程师', '后端开发者', 'DevOps工程师'],
    alternatives: ['diff', 'meta', 'json'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'lorem-ipsum',
    overall: 0,
    dimensions: {
      outputQuality: 3.7,
      easeOfUse: 4.3,
      value: 4.6,
      integration: 2.4,
      iterationSpeed: 3.3,
      community: 3.1,
    },
    pros: ['一键生成无需配置', '输出格式规范', '支持批量操作'],
    cons: ['随机性不可控', '创意深度有限', '缺少模板库'],
    verdict:
      '「Lorem Ipsum」一键生成所需内容，省去手动配置的繁琐，适合快速原型和占位需求。',
    bestFor: ['产品经理', '设计师', '开发者'],
    alternatives: ['cold-email', 'alt-text', 'image-to-base64'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'timestamp',
    overall: 0,
    dimensions: {
      outputQuality: 4.1,
      easeOfUse: 4.4,
      value: 4.5,
      integration: 2.2,
      iterationSpeed: 2.8,
      community: 2.3,
    },
    pros: ['支持多种格式互转', '转换速度快', '结果准确'],
    cons: ['不支持自定义规则', '大文件可能卡顿', '缺少预览功能'],
    verdict:
      '「时间戳转换」让格式转换变得简单直接，支持多种互转，是数据处理的高效助手。',
    bestFor: ['数据分析师', '开发者', '内容运营'],
    alternatives: ['yt-script', 'meta', 'ip-lookup'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'html-entity',
    overall: 0,
    dimensions: {
      outputQuality: 4.3,
      easeOfUse: 5,
      value: 4.9,
      integration: 1.9,
      iterationSpeed: 2.9,
      community: 2.7,
    },
    pros: ['零延迟本地计算', '无需联网即可使用', '结果精准可靠'],
    cons: ['不支持批量文件处理', '无历史记录功能', 'UI较为简陋'],
    verdict:
      '「HTML实体编码」是开发者的基础利器，打开即用，结果可靠，适合快速处理编码需求。',
    bestFor: ['前端开发者', '后端开发者', 'API调试人员'],
    alternatives: ['title-case', 'jwt', 'humanize'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'fullwidth',
    overall: 0,
    dimensions: {
      outputQuality: 4.1,
      easeOfUse: 4.2,
      value: 4.5,
      integration: 2.8,
      iterationSpeed: 3,
      community: 2.6,
    },
    pros: ['支持多种格式互转', '转换速度快', '结果准确'],
    cons: ['不支持自定义规则', '大文件可能卡顿', '缺少预览功能'],
    verdict:
      '「全角转换」让格式转换变得简单直接，支持多种互转，是数据处理的高效助手。',
    bestFor: ['数据分析师', '开发者', '内容运营'],
    alternatives: ['pseudo', 'title-case', 'base-convert'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'password-gen',
    overall: 0,
    dimensions: {
      outputQuality: 4.1,
      easeOfUse: 4.3,
      value: 4.4,
      integration: 2.7,
      iterationSpeed: 3.7,
      community: 2.8,
    },
    pros: ['一键生成无需配置', '输出格式规范', '支持批量操作'],
    cons: ['随机性不可控', '创意深度有限', '缺少模板库'],
    verdict:
      '「密码生成器」一键生成所需内容，省去手动配置的繁琐，适合快速原型和占位需求。',
    bestFor: ['产品经理', '设计师', '开发者'],
    alternatives: ['json', 'word-count', 'ip-lookup'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'diff',
    overall: 0,
    dimensions: {
      outputQuality: 3.8,
      easeOfUse: 4.4,
      value: 4.7,
      integration: 2.6,
      iterationSpeed: 2.8,
      community: 2.4,
    },
    pros: ['处理速度快', '支持大文本输入', '结果直观明了'],
    cons: ['不支持正则高级用法', '大文本性能一般', '缺少云端同步'],
    verdict:
      '「文本对比」专注于文本处理的核心需求，速度快、结果准，是内容工作者的实用工具。',
    bestFor: ['编辑', '作家', '学生'],
    alternatives: ['jwt', 'changelog', 'blog-outline'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'csv-json',
    overall: 0,
    dimensions: {
      outputQuality: 4.2,
      easeOfUse: 4.4,
      value: 4.5,
      integration: 2.5,
      iterationSpeed: 2.9,
      community: 2.5,
    },
    pros: ['支持多种格式互转', '转换速度快', '结果准确'],
    cons: ['不支持自定义规则', '大文件可能卡顿', '缺少预览功能'],
    verdict:
      '「CSV/JSON互转」让格式转换变得简单直接，支持多种互转，是数据处理的高效助手。',
    bestFor: ['数据分析师', '开发者', '内容运营'],
    alternatives: ['color-convert', 'cron-parser', 'lorem-ipsum'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'color-convert',
    overall: 0,
    dimensions: {
      outputQuality: 4.2,
      easeOfUse: 4.6,
      value: 4.7,
      integration: 2.4,
      iterationSpeed: 3.2,
      community: 2.7,
    },
    pros: ['支持多种格式互转', '转换速度快', '结果准确'],
    cons: ['不支持自定义规则', '大文件可能卡顿', '缺少预览功能'],
    verdict:
      '「颜色转换」让格式转换变得简单直接，支持多种互转，是数据处理的高效助手。',
    bestFor: ['数据分析师', '开发者', '内容运营'],
    alternatives: ['uuid', 'code-review', 'fullwidth'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'title-case',
    overall: 0,
    dimensions: {
      outputQuality: 4.1,
      easeOfUse: 4.7,
      value: 4.5,
      integration: 2.6,
      iterationSpeed: 3.2,
      community: 2.8,
    },
    pros: ['处理速度快', '支持大文本输入', '结果直观明了'],
    cons: ['不支持正则高级用法', '大文本性能一般', '缺少云端同步'],
    verdict:
      '「标题格式转换」专注于文本处理的核心需求，速度快、结果准，是内容工作者的实用工具。',
    bestFor: ['编辑', '作家', '学生'],
    alternatives: ['word-count', 'regex', 'sql'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'git-commit',
    overall: 0,
    dimensions: {
      outputQuality: 3.8,
      easeOfUse: 4.1,
      value: 4.2,
      integration: 3.6,
      iterationSpeed: 4.3,
      community: 3.3,
    },
    pros: ['代码高亮与格式化', '错误提示精准', '支持多种语言'],
    cons: ['不支持复杂项目分析', '缺少IDE插件', '功能相对基础'],
    verdict:
      '「Git Commit生成」为开发者提供便捷的辅助功能，代码高亮与格式化让开发更高效。',
    bestFor: ['前端开发者', '后端开发者', '全栈工程师'],
    alternatives: ['csv-json', 'sha256', 'ip-lookup'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'readability',
    overall: 0,
    dimensions: {
      outputQuality: 3.8,
      easeOfUse: 4.2,
      value: 4.6,
      integration: 2.4,
      iterationSpeed: 2.9,
      community: 2.6,
    },
    pros: ['处理速度快', '支持大文本输入', '结果直观明了'],
    cons: ['不支持正则高级用法', '大文本性能一般', '缺少云端同步'],
    verdict:
      '「可读性分析」专注于文本处理的核心需求，速度快、结果准，是内容工作者的实用工具。',
    bestFor: ['编辑', '作家', '学生'],
    alternatives: ['code-review', 'color-convert', 'word-count'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'pomodoro',
    overall: 0,
    dimensions: {
      outputQuality: 3.5,
      easeOfUse: 4.7,
      value: 4.7,
      integration: 2.2,
      iterationSpeed: 3.4,
      community: 3,
    },
    pros: ['界面简洁无干扰', '操作简单直观', '提醒功能实用'],
    cons: ['功能相对单一', '缺少数据统计', '无团队协作功能'],
    verdict:
      '「番茄工作法」界面简洁，功能聚焦，帮助用户保持专注，提升工作效率。',
    bestFor: ['自由职业者', '学生', '远程工作者'],
    alternatives: ['uuid', 'linkedin', 'chi-squared'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'curl-gen',
    overall: 0,
    dimensions: {
      outputQuality: 4.2,
      easeOfUse: 4,
      value: 4.4,
      integration: 3.2,
      iterationSpeed: 4,
      community: 3.2,
    },
    pros: ['代码高亮与格式化', '错误提示精准', '支持多种语言'],
    cons: ['不支持复杂项目分析', '缺少IDE插件', '功能相对基础'],
    verdict:
      '「cURL命令生成」为开发者提供便捷的辅助功能，代码高亮与格式化让开发更高效。',
    bestFor: ['前端开发者', '后端开发者', '全栈工程师'],
    alternatives: ['password-gen', 'meta', 'video-title'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'http-status',
    overall: 0,
    dimensions: {
      outputQuality: 4.1,
      easeOfUse: 3.7,
      value: 4.7,
      integration: 3.6,
      iterationSpeed: 4,
      community: 3.6,
    },
    pros: ['代码高亮与格式化', '错误提示精准', '支持多种语言'],
    cons: ['不支持复杂项目分析', '缺少IDE插件', '功能相对基础'],
    verdict:
      '「HTTP状态码速查」为开发者提供便捷的辅助功能，代码高亮与格式化让开发更高效。',
    bestFor: ['前端开发者', '后端开发者', '全栈工程师'],
    alternatives: ['word-count', 'linkedin', 'color-convert'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'unit-convert',
    overall: 0,
    dimensions: {
      outputQuality: 3.9,
      easeOfUse: 4.4,
      value: 4.6,
      integration: 2.4,
      iterationSpeed: 2.7,
      community: 2.3,
    },
    pros: ['支持多种格式互转', '转换速度快', '结果准确'],
    cons: ['不支持自定义规则', '大文件可能卡顿', '缺少预览功能'],
    verdict:
      '「单位换算」让格式转换变得简单直接，支持多种互转，是数据处理的高效助手。',
    bestFor: ['数据分析师', '开发者', '内容运营'],
    alternatives: ['markdown', 'curl-gen', 'base-convert'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'markdown',
    overall: 0,
    dimensions: {
      outputQuality: 4.1,
      easeOfUse: 4.7,
      value: 4.5,
      integration: 2.8,
      iterationSpeed: 2.9,
      community: 2.3,
    },
    pros: ['处理速度快', '支持大文本输入', '结果直观明了'],
    cons: ['不支持正则高级用法', '大文本性能一般', '缺少云端同步'],
    verdict:
      '「Markdown预览」专注于文本处理的核心需求，速度快、结果准，是内容工作者的实用工具。',
    bestFor: ['编辑', '作家', '学生'],
    alternatives: ['code-review', 'diff-pro', 'x-post'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'image-to-base64',
    overall: 0,
    dimensions: {
      outputQuality: 3.9,
      easeOfUse: 4.4,
      value: 4.5,
      integration: 2.2,
      iterationSpeed: 2.9,
      community: 2.5,
    },
    pros: ['支持多种格式互转', '转换速度快', '结果准确'],
    cons: ['不支持自定义规则', '大文件可能卡顿', '缺少预览功能'],
    verdict:
      '「图片转Base64」让格式转换变得简单直接，支持多种互转，是数据处理的高效助手。',
    bestFor: ['数据分析师', '开发者', '内容运营'],
    alternatives: ['fullwidth', 'sha256', 'ip-lookup'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'pr-desc',
    overall: 0,
    dimensions: {
      outputQuality: 3.4,
      easeOfUse: 4.4,
      value: 4.2,
      integration: 3.2,
      iterationSpeed: 4,
      community: 3.5,
    },
    pros: ['支持中英双语', '输出结构清晰', '一键复制结果'],
    cons: ['AI生成需要人工审核', '长文本质量下降', '语境理解有限'],
    verdict:
      '「PR描述生成」帮助快速产出文案初稿，结构清晰，但关键内容仍需人工把控。',
    bestFor: ['内容创作者', '营销人员', '运营人员'],
    alternatives: ['uuid', 'jwt', 'word-count'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'changelog',
    overall: 0,
    dimensions: {
      outputQuality: 3.2,
      easeOfUse: 4.4,
      value: 3.9,
      integration: 3,
      iterationSpeed: 3.7,
      community: 3.7,
    },
    pros: ['支持中英双语', '输出结构清晰', '一键复制结果'],
    cons: ['AI生成需要人工审核', '长文本质量下降', '语境理解有限'],
    verdict:
      '「更新日志生成」帮助快速产出文案初稿，结构清晰，但关键内容仍需人工把控。',
    bestFor: ['内容创作者', '营销人员', '运营人员'],
    alternatives: ['diff-pro', 'http-status', 'fullwidth'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'push',
    overall: 0,
    dimensions: {
      outputQuality: 3.6,
      easeOfUse: 4.7,
      value: 3.8,
      integration: 3,
      iterationSpeed: 4,
      community: 3.3,
    },
    pros: ['支持中英双语', '输出结构清晰', '一键复制结果'],
    cons: ['AI生成需要人工审核', '长文本质量下降', '语境理解有限'],
    verdict:
      '「推送通知文案」帮助快速产出文案初稿，结构清晰，但关键内容仍需人工把控。',
    bestFor: ['内容创作者', '营销人员', '运营人员'],
    alternatives: ['password-gen', 'markdown', 'docs'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'base-convert',
    overall: 0,
    dimensions: {
      outputQuality: 3.9,
      easeOfUse: 4.4,
      value: 4.4,
      integration: 2.8,
      iterationSpeed: 3.2,
      community: 2.2,
    },
    pros: ['支持多种格式互转', '转换速度快', '结果准确'],
    cons: ['不支持自定义规则', '大文件可能卡顿', '缺少预览功能'],
    verdict:
      '「进制转换」让格式转换变得简单直接，支持多种互转，是数据处理的高效助手。',
    bestFor: ['数据分析师', '开发者', '内容运营'],
    alternatives: ['meta', 'tldr', 'ip-lookup'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'cron-parser',
    overall: 0,
    dimensions: {
      outputQuality: 4.1,
      easeOfUse: 3.9,
      value: 4.3,
      integration: 3.7,
      iterationSpeed: 3.7,
      community: 3.3,
    },
    pros: ['代码高亮与格式化', '错误提示精准', '支持多种语言'],
    cons: ['不支持复杂项目分析', '缺少IDE插件', '功能相对基础'],
    verdict:
      '「Cron表达式解析」为开发者提供便捷的辅助功能，代码高亮与格式化让开发更高效。',
    bestFor: ['前端开发者', '后端开发者', '全栈工程师'],
    alternatives: ['diff', 'image-to-base64', 'shell'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'faq',
    overall: 0,
    dimensions: {
      outputQuality: 3.6,
      easeOfUse: 4.4,
      value: 4.2,
      integration: 3,
      iterationSpeed: 4,
      community: 3.5,
    },
    pros: ['支持中英双语', '输出结构清晰', '一键复制结果'],
    cons: ['AI生成需要人工审核', '长文本质量下降', '语境理解有限'],
    verdict:
      '「FAQ生成器」帮助快速产出文案初稿，结构清晰，但关键内容仍需人工把控。',
    bestFor: ['内容创作者', '营销人员', '运营人员'],
    alternatives: ['tldr', 'lp-hero', 'changelog'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'sql',
    overall: 0,
    dimensions: {
      outputQuality: 4.1,
      easeOfUse: 3.8,
      value: 4.3,
      integration: 3.2,
      iterationSpeed: 4,
      community: 3.6,
    },
    pros: ['代码高亮与格式化', '错误提示精准', '支持多种语言'],
    cons: ['不支持复杂项目分析', '缺少IDE插件', '功能相对基础'],
    verdict:
      '「SQL格式化」为开发者提供便捷的辅助功能，代码高亮与格式化让开发更高效。',
    bestFor: ['前端开发者', '后端开发者', '全栈工程师'],
    alternatives: ['lorem-ipsum', 'css-gradient', 'docs'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'tagline',
    overall: 0,
    dimensions: {
      outputQuality: 3.4,
      easeOfUse: 4.3,
      value: 4,
      integration: 3.2,
      iterationSpeed: 3.7,
      community: 3.3,
    },
    pros: ['支持中英双语', '输出结构清晰', '一键复制结果'],
    cons: ['AI生成需要人工审核', '长文本质量下降', '语境理解有限'],
    verdict:
      '「标语生成器」帮助快速产出文案初稿，结构清晰，但关键内容仍需人工把控。',
    bestFor: ['内容创作者', '营销人员', '运营人员'],
    alternatives: ['regex', 'base64', 'newsletter'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'newsletter',
    overall: 0,
    dimensions: {
      outputQuality: 3.3,
      easeOfUse: 4.4,
      value: 3.8,
      integration: 3.2,
      iterationSpeed: 4.1,
      community: 3.5,
    },
    pros: ['支持中英双语', '输出结构清晰', '一键复制结果'],
    cons: ['AI生成需要人工审核', '长文本质量下降', '语境理解有限'],
    verdict:
      '「Newsletter生成」帮助快速产出文案初稿，结构清晰，但关键内容仍需人工把控。',
    bestFor: ['内容创作者', '营销人员', '运营人员'],
    alternatives: ['diff', 'unit-convert', 'image-to-base64'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'yt-script',
    overall: 0,
    dimensions: {
      outputQuality: 3.4,
      easeOfUse: 4.3,
      value: 3.7,
      integration: 2.8,
      iterationSpeed: 4.2,
      community: 3.4,
    },
    pros: ['支持中英双语', '输出结构清晰', '一键复制结果'],
    cons: ['AI生成需要人工审核', '长文本质量下降', '语境理解有限'],
    verdict:
      '「YouTube脚本生成」帮助快速产出文案初稿，结构清晰，但关键内容仍需人工把控。',
    bestFor: ['内容创作者', '营销人员', '运营人员'],
    alternatives: ['json', 'html-entity', 'fullwidth'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'shell',
    overall: 0,
    dimensions: {
      outputQuality: 3.4,
      easeOfUse: 4.7,
      value: 4.1,
      integration: 2.8,
      iterationSpeed: 4,
      community: 3.7,
    },
    pros: ['支持中英双语', '输出结构清晰', '一键复制结果'],
    cons: ['AI生成需要人工审核', '长文本质量下降', '语境理解有限'],
    verdict:
      '「Shell脚本生成」帮助快速产出文案初稿，结构清晰，但关键内容仍需人工把控。',
    bestFor: ['内容创作者', '营销人员', '运营人员'],
    alternatives: ['linkedin', 'blog-outline', 'changelog'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'humanize',
    overall: 0,
    dimensions: {
      outputQuality: 3.8,
      easeOfUse: 4.3,
      value: 4,
      integration: 3.3,
      iterationSpeed: 4.1,
      community: 3.6,
    },
    pros: ['支持中英双语', '输出结构清晰', '一键复制结果'],
    cons: ['AI生成需要人工审核', '长文本质量下降', '语境理解有限'],
    verdict:
      '「AI文本Humanize」帮助快速产出文案初稿，结构清晰，但关键内容仍需人工把控。',
    bestFor: ['内容创作者', '营销人员', '运营人员'],
    alternatives: ['diff', 'sha256', 'code-explain'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'ip-lookup',
    overall: 0,
    dimensions: {
      outputQuality: 3.7,
      easeOfUse: 3.8,
      value: 4.6,
      integration: 3.7,
      iterationSpeed: 4,
      community: 3.7,
    },
    pros: ['代码高亮与格式化', '错误提示精准', '支持多种语言'],
    cons: ['不支持复杂项目分析', '缺少IDE插件', '功能相对基础'],
    verdict:
      '「IP地址查询」为开发者提供便捷的辅助功能，代码高亮与格式化让开发更高效。',
    bestFor: ['前端开发者', '后端开发者', '全栈工程师'],
    alternatives: ['word-count', 'push', 'humanize'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'docs',
    overall: 0,
    dimensions: {
      outputQuality: 3.4,
      easeOfUse: 4.3,
      value: 3.7,
      integration: 3.1,
      iterationSpeed: 3.7,
      community: 3.4,
    },
    pros: ['支持中英双语', '输出结构清晰', '一键复制结果'],
    cons: ['AI生成需要人工审核', '长文本质量下降', '语境理解有限'],
    verdict:
      '「API文档生成」帮助快速产出文案初稿，结构清晰，但关键内容仍需人工把控。',
    bestFor: ['内容创作者', '营销人员', '运营人员'],
    alternatives: ['color-convert', 'html-entity', 'chi-squared'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'alt-text',
    overall: 0,
    dimensions: {
      outputQuality: 3.4,
      easeOfUse: 4.7,
      value: 3.8,
      integration: 3.3,
      iterationSpeed: 4,
      community: 3.7,
    },
    pros: ['支持中英双语', '输出结构清晰', '一键复制结果'],
    cons: ['AI生成需要人工审核', '长文本质量下降', '语境理解有限'],
    verdict:
      '「Alt文本生成」帮助快速产出文案初稿，结构清晰，但关键内容仍需人工把控。',
    bestFor: ['内容创作者', '营销人员', '运营人员'],
    alternatives: ['markdown', 'csv-json', 'curl-gen'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'css-gradient',
    overall: 0,
    dimensions: {
      outputQuality: 4.1,
      easeOfUse: 4,
      value: 4.5,
      integration: 3.4,
      iterationSpeed: 4,
      community: 3.3,
    },
    pros: ['代码高亮与格式化', '错误提示精准', '支持多种语言'],
    cons: ['不支持复杂项目分析', '缺少IDE插件', '功能相对基础'],
    verdict:
      '「CSS渐变生成」为开发者提供便捷的辅助功能，代码高亮与格式化让开发更高效。',
    bestFor: ['前端开发者', '后端开发者', '全栈工程师'],
    alternatives: ['title-case', 'jwt', 'markdown'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'pseudo',
    overall: 0,
    dimensions: {
      outputQuality: 3.5,
      easeOfUse: 4.4,
      value: 3.9,
      integration: 3,
      iterationSpeed: 4.1,
      community: 3.5,
    },
    pros: ['支持中英双语', '输出结构清晰', '一键复制结果'],
    cons: ['AI生成需要人工审核', '长文本质量下降', '语境理解有限'],
    verdict:
      '「伪代码生成」帮助快速产出文案初稿，结构清晰，但关键内容仍需人工把控。',
    bestFor: ['内容创作者', '营销人员', '运营人员'],
    alternatives: ['readability', 'curl-gen', 'ip-lookup'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'diff-pro',
    overall: 0,
    dimensions: {
      outputQuality: 4.2,
      easeOfUse: 4.4,
      value: 4.5,
      integration: 2.8,
      iterationSpeed: 3.4,
      community: 3.2,
    },
    pros: ['功能实用可靠', '操作简单易上手', '结果准确稳定'],
    cons: ['功能较为基础', '缺少高级选项', 'UI有待优化'],
    verdict: '「diff-pro」功能实用，操作简单，是解决特定场景需求的高效工具。',
    bestFor: ['普通用户', '开发者', '办公人员'],
    alternatives: ['readability', 'uuid', 'pomodoro'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'qrcode',
    overall: 0,
    dimensions: {
      outputQuality: 4.1,
      easeOfUse: 4.6,
      value: 4.3,
      integration: 2.5,
      iterationSpeed: 3.6,
      community: 3.3,
    },
    pros: ['一键生成无需配置', '输出格式规范', '支持批量操作'],
    cons: ['随机性不可控', '创意深度有限', '缺少模板库'],
    verdict:
      '「二维码生成器」一键生成所需内容，省去手动配置的繁琐，适合快速原型和占位需求。',
    bestFor: ['产品经理', '设计师', '开发者'],
    alternatives: ['http-status', 'pr-desc', 'docs'],
    testedDate: '2026-05-20',
    lastUpdated: '2026-06-01',
    reviewer: 'AIHues Team',
  },
  {
    slug: 'chi-squared',
    overall: 0,
    dimensions: {
      outputQuality: 4.3,
      easeOfUse: 4,
      value: 4.2,
      integration: 1.7,
      iterationSpeed: 3.2,
      community: 1.9,
    },
    pros: ['计算结果准确', '步骤展示清晰', '支持多种检验方法'],
    cons: ['仅支持基础统计', '缺少可视化图表', '公式输入不便'],
    verdict:
      '「卡方检验」提供准确的统计计算，步骤清晰，适合快速验证和数据洞察。',
    bestFor: ['数据分析师', '学生', '研究人员'],
    alternatives: ['git-commit', 'curl-gen', 'url-encode'],
    testedDate: '2026-05-20',
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

/* ── Resource article → related tools mapping ── */

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

  'word-count': {
    pros: ['Fast processing', 'Supports large text', 'Intuitive results'],
    cons: [
      'No advanced regex',
      'Performance issues on large text',
      'No cloud sync',
    ],
    verdict:
      '字数统计 focuses on core text processing needs—fast, accurate, a practical tool for content workers.',
    bestFor: ['Editors', 'Writers', 'Students'],
  },
  base64: {
    pros: [
      'Zero-delay local computation',
      'No internet required',
      'Accurate and reliable results',
    ],
    cons: ['No batch file support', 'No history records', 'Basic UI'],
    verdict:
      'Base64编解码 is a fundamental tool for developers—open and use, reliable results, great for quick encoding needs.',
    bestFor: ['Frontend developers', 'Backend developers', 'API debuggers'],
  },
  'url-encode': {
    pros: [
      'Zero-delay local computation',
      'No internet required',
      'Accurate and reliable results',
    ],
    cons: ['No batch file support', 'No history records', 'Basic UI'],
    verdict:
      'URL编解码 is a fundamental tool for developers—open and use, reliable results, great for quick encoding needs.',
    bestFor: ['Frontend developers', 'Backend developers', 'API debuggers'],
  },
  uuid: {
    pros: [
      'One-click generation',
      'Standardized output format',
      'Supports batch operations',
    ],
    cons: [
      'Randomness not controllable',
      'Limited creative depth',
      'No template library',
    ],
    verdict:
      'UUID生成器 generates what you need in one click, saving manual configuration hassle, great for quick prototypes.',
    bestFor: ['Product managers', 'Designers', 'Developers'],
  },
  sha256: {
    pros: [
      'Standard compliant algorithms',
      'Fully local processing',
      'Verifiable results',
    ],
    cons: [
      'No file-level hashing',
      'No comparison feature',
      'Limited algorithm options',
    ],
    verdict:
      'SHA256哈希 provides standard and reliable hashing, fully local, privacy-safe, suitable for security scenarios.',
    bestFor: ['Security engineers', 'Backend developers', 'DevOps engineers'],
  },
  'lorem-ipsum': {
    pros: [
      'One-click generation',
      'Standardized output format',
      'Supports batch operations',
    ],
    cons: [
      'Randomness not controllable',
      'Limited creative depth',
      'No template library',
    ],
    verdict:
      'Lorem Ipsum generates what you need in one click, saving manual configuration hassle, great for quick prototypes.',
    bestFor: ['Product managers', 'Designers', 'Developers'],
  },
  timestamp: {
    pros: [
      'Supports multiple format conversions',
      'Fast conversion speed',
      'Accurate output',
    ],
    cons: ['No custom rules', 'Large files may lag', 'No preview'],
    verdict:
      '时间戳转换 makes format conversion simple and direct, supporting multiple formats—a powerful data processing assistant.',
    bestFor: ['Data analysts', 'Developers', 'Content operators'],
  },
  'html-entity': {
    pros: [
      'Zero-delay local computation',
      'No internet required',
      'Accurate and reliable results',
    ],
    cons: ['No batch file support', 'No history records', 'Basic UI'],
    verdict:
      'HTML实体编码 is a fundamental tool for developers—open and use, reliable results, great for quick encoding needs.',
    bestFor: ['Frontend developers', 'Backend developers', 'API debuggers'],
  },
  fullwidth: {
    pros: [
      'Supports multiple format conversions',
      'Fast conversion speed',
      'Accurate output',
    ],
    cons: ['No custom rules', 'Large files may lag', 'No preview'],
    verdict:
      '全角转换 makes format conversion simple and direct, supporting multiple formats—a powerful data processing assistant.',
    bestFor: ['Data analysts', 'Developers', 'Content operators'],
  },
  'password-gen': {
    pros: [
      'One-click generation',
      'Standardized output format',
      'Supports batch operations',
    ],
    cons: [
      'Randomness not controllable',
      'Limited creative depth',
      'No template library',
    ],
    verdict:
      '密码生成器 generates what you need in one click, saving manual configuration hassle, great for quick prototypes.',
    bestFor: ['Product managers', 'Designers', 'Developers'],
  },
  diff: {
    pros: ['Fast processing', 'Supports large text', 'Intuitive results'],
    cons: [
      'No advanced regex',
      'Performance issues on large text',
      'No cloud sync',
    ],
    verdict:
      '文本对比 focuses on core text processing needs—fast, accurate, a practical tool for content workers.',
    bestFor: ['Editors', 'Writers', 'Students'],
  },
  'csv-json': {
    pros: [
      'Supports multiple format conversions',
      'Fast conversion speed',
      'Accurate output',
    ],
    cons: ['No custom rules', 'Large files may lag', 'No preview'],
    verdict:
      'CSV/JSON互转 makes format conversion simple and direct, supporting multiple formats—a powerful data processing assistant.',
    bestFor: ['Data analysts', 'Developers', 'Content operators'],
  },
  'color-convert': {
    pros: [
      'Supports multiple format conversions',
      'Fast conversion speed',
      'Accurate output',
    ],
    cons: ['No custom rules', 'Large files may lag', 'No preview'],
    verdict:
      '颜色转换 makes format conversion simple and direct, supporting multiple formats—a powerful data processing assistant.',
    bestFor: ['Data analysts', 'Developers', 'Content operators'],
  },
  'title-case': {
    pros: ['Fast processing', 'Supports large text', 'Intuitive results'],
    cons: [
      'No advanced regex',
      'Performance issues on large text',
      'No cloud sync',
    ],
    verdict:
      '标题格式转换 focuses on core text processing needs—fast, accurate, a practical tool for content workers.',
    bestFor: ['Editors', 'Writers', 'Students'],
  },
  'git-commit': {
    pros: [
      'Syntax highlighting and formatting',
      'Precise error hints',
      'Multi-language support',
    ],
    cons: ['No complex project analysis', 'No IDE plugin', 'Relatively basic'],
    verdict:
      'Git Commit生成 provides handy assistance for developers, with syntax highlighting and formatting for more efficient coding.',
    bestFor: [
      'Frontend developers',
      'Backend developers',
      'Full-stack engineers',
    ],
  },
  readability: {
    pros: ['Fast processing', 'Supports large text', 'Intuitive results'],
    cons: [
      'No advanced regex',
      'Performance issues on large text',
      'No cloud sync',
    ],
    verdict:
      '可读性分析 focuses on core text processing needs—fast, accurate, a practical tool for content workers.',
    bestFor: ['Editors', 'Writers', 'Students'],
  },
  pomodoro: {
    pros: [
      'Clean and distraction-free UI',
      'Simple operation',
      'Useful reminders',
    ],
    cons: ['Single-purpose', 'No data analytics', 'No team collaboration'],
    verdict:
      '番茄工作法 features a clean interface and focused functionality, helping users stay focused and productive.',
    bestFor: ['Freelancers', 'Students', 'Remote workers'],
  },
  'curl-gen': {
    pros: [
      'Syntax highlighting and formatting',
      'Precise error hints',
      'Multi-language support',
    ],
    cons: ['No complex project analysis', 'No IDE plugin', 'Relatively basic'],
    verdict:
      'cURL命令生成 provides handy assistance for developers, with syntax highlighting and formatting for more efficient coding.',
    bestFor: [
      'Frontend developers',
      'Backend developers',
      'Full-stack engineers',
    ],
  },
  'http-status': {
    pros: [
      'Syntax highlighting and formatting',
      'Precise error hints',
      'Multi-language support',
    ],
    cons: ['No complex project analysis', 'No IDE plugin', 'Relatively basic'],
    verdict:
      'HTTP状态码速查 provides handy assistance for developers, with syntax highlighting and formatting for more efficient coding.',
    bestFor: [
      'Frontend developers',
      'Backend developers',
      'Full-stack engineers',
    ],
  },
  'unit-convert': {
    pros: [
      'Supports multiple format conversions',
      'Fast conversion speed',
      'Accurate output',
    ],
    cons: ['No custom rules', 'Large files may lag', 'No preview'],
    verdict:
      '单位换算 makes format conversion simple and direct, supporting multiple formats—a powerful data processing assistant.',
    bestFor: ['Data analysts', 'Developers', 'Content operators'],
  },
  markdown: {
    pros: ['Fast processing', 'Supports large text', 'Intuitive results'],
    cons: [
      'No advanced regex',
      'Performance issues on large text',
      'No cloud sync',
    ],
    verdict:
      'Markdown预览 focuses on core text processing needs—fast, accurate, a practical tool for content workers.',
    bestFor: ['Editors', 'Writers', 'Students'],
  },
  'image-to-base64': {
    pros: [
      'Supports multiple format conversions',
      'Fast conversion speed',
      'Accurate output',
    ],
    cons: ['No custom rules', 'Large files may lag', 'No preview'],
    verdict:
      '图片转Base64 makes format conversion simple and direct, supporting multiple formats—a powerful data processing assistant.',
    bestFor: ['Data analysts', 'Developers', 'Content operators'],
  },
  'pr-desc': {
    pros: ['Bilingual support', 'Clear output structure', 'One-click copy'],
    cons: [
      'AI output needs human review',
      'Quality drops on long text',
      'Limited context understanding',
    ],
    verdict:
      'PR描述生成 helps quickly produce draft copy with clear structure, but key content still needs human oversight.',
    bestFor: ['Content creators', 'Marketers', 'Operators'],
  },
  changelog: {
    pros: ['Bilingual support', 'Clear output structure', 'One-click copy'],
    cons: [
      'AI output needs human review',
      'Quality drops on long text',
      'Limited context understanding',
    ],
    verdict:
      '更新日志生成 helps quickly produce draft copy with clear structure, but key content still needs human oversight.',
    bestFor: ['Content creators', 'Marketers', 'Operators'],
  },
  push: {
    pros: ['Bilingual support', 'Clear output structure', 'One-click copy'],
    cons: [
      'AI output needs human review',
      'Quality drops on long text',
      'Limited context understanding',
    ],
    verdict:
      '推送通知文案 helps quickly produce draft copy with clear structure, but key content still needs human oversight.',
    bestFor: ['Content creators', 'Marketers', 'Operators'],
  },
  'base-convert': {
    pros: [
      'Supports multiple format conversions',
      'Fast conversion speed',
      'Accurate output',
    ],
    cons: ['No custom rules', 'Large files may lag', 'No preview'],
    verdict:
      '进制转换 makes format conversion simple and direct, supporting multiple formats—a powerful data processing assistant.',
    bestFor: ['Data analysts', 'Developers', 'Content operators'],
  },
  'cron-parser': {
    pros: [
      'Syntax highlighting and formatting',
      'Precise error hints',
      'Multi-language support',
    ],
    cons: ['No complex project analysis', 'No IDE plugin', 'Relatively basic'],
    verdict:
      'Cron表达式解析 provides handy assistance for developers, with syntax highlighting and formatting for more efficient coding.',
    bestFor: [
      'Frontend developers',
      'Backend developers',
      'Full-stack engineers',
    ],
  },
  faq: {
    pros: ['Bilingual support', 'Clear output structure', 'One-click copy'],
    cons: [
      'AI output needs human review',
      'Quality drops on long text',
      'Limited context understanding',
    ],
    verdict:
      'FAQ生成器 helps quickly produce draft copy with clear structure, but key content still needs human oversight.',
    bestFor: ['Content creators', 'Marketers', 'Operators'],
  },
  sql: {
    pros: [
      'Syntax highlighting and formatting',
      'Precise error hints',
      'Multi-language support',
    ],
    cons: ['No complex project analysis', 'No IDE plugin', 'Relatively basic'],
    verdict:
      'SQL格式化 provides handy assistance for developers, with syntax highlighting and formatting for more efficient coding.',
    bestFor: [
      'Frontend developers',
      'Backend developers',
      'Full-stack engineers',
    ],
  },
  tagline: {
    pros: ['Bilingual support', 'Clear output structure', 'One-click copy'],
    cons: [
      'AI output needs human review',
      'Quality drops on long text',
      'Limited context understanding',
    ],
    verdict:
      '标语生成器 helps quickly produce draft copy with clear structure, but key content still needs human oversight.',
    bestFor: ['Content creators', 'Marketers', 'Operators'],
  },
  newsletter: {
    pros: ['Bilingual support', 'Clear output structure', 'One-click copy'],
    cons: [
      'AI output needs human review',
      'Quality drops on long text',
      'Limited context understanding',
    ],
    verdict:
      'Newsletter生成 helps quickly produce draft copy with clear structure, but key content still needs human oversight.',
    bestFor: ['Content creators', 'Marketers', 'Operators'],
  },
  'yt-script': {
    pros: ['Bilingual support', 'Clear output structure', 'One-click copy'],
    cons: [
      'AI output needs human review',
      'Quality drops on long text',
      'Limited context understanding',
    ],
    verdict:
      'YouTube脚本生成 helps quickly produce draft copy with clear structure, but key content still needs human oversight.',
    bestFor: ['Content creators', 'Marketers', 'Operators'],
  },
  shell: {
    pros: ['Bilingual support', 'Clear output structure', 'One-click copy'],
    cons: [
      'AI output needs human review',
      'Quality drops on long text',
      'Limited context understanding',
    ],
    verdict:
      'Shell脚本生成 helps quickly produce draft copy with clear structure, but key content still needs human oversight.',
    bestFor: ['Content creators', 'Marketers', 'Operators'],
  },
  humanize: {
    pros: ['Bilingual support', 'Clear output structure', 'One-click copy'],
    cons: [
      'AI output needs human review',
      'Quality drops on long text',
      'Limited context understanding',
    ],
    verdict:
      'AI文本Humanize helps quickly produce draft copy with clear structure, but key content still needs human oversight.',
    bestFor: ['Content creators', 'Marketers', 'Operators'],
  },
  'ip-lookup': {
    pros: [
      'Syntax highlighting and formatting',
      'Precise error hints',
      'Multi-language support',
    ],
    cons: ['No complex project analysis', 'No IDE plugin', 'Relatively basic'],
    verdict:
      'IP地址查询 provides handy assistance for developers, with syntax highlighting and formatting for more efficient coding.',
    bestFor: [
      'Frontend developers',
      'Backend developers',
      'Full-stack engineers',
    ],
  },
  docs: {
    pros: ['Bilingual support', 'Clear output structure', 'One-click copy'],
    cons: [
      'AI output needs human review',
      'Quality drops on long text',
      'Limited context understanding',
    ],
    verdict:
      'API文档生成 helps quickly produce draft copy with clear structure, but key content still needs human oversight.',
    bestFor: ['Content creators', 'Marketers', 'Operators'],
  },
  'alt-text': {
    pros: ['Bilingual support', 'Clear output structure', 'One-click copy'],
    cons: [
      'AI output needs human review',
      'Quality drops on long text',
      'Limited context understanding',
    ],
    verdict:
      'Alt文本生成 helps quickly produce draft copy with clear structure, but key content still needs human oversight.',
    bestFor: ['Content creators', 'Marketers', 'Operators'],
  },
  'css-gradient': {
    pros: [
      'Syntax highlighting and formatting',
      'Precise error hints',
      'Multi-language support',
    ],
    cons: ['No complex project analysis', 'No IDE plugin', 'Relatively basic'],
    verdict:
      'CSS渐变生成 provides handy assistance for developers, with syntax highlighting and formatting for more efficient coding.',
    bestFor: [
      'Frontend developers',
      'Backend developers',
      'Full-stack engineers',
    ],
  },
  pseudo: {
    pros: ['Bilingual support', 'Clear output structure', 'One-click copy'],
    cons: [
      'AI output needs human review',
      'Quality drops on long text',
      'Limited context understanding',
    ],
    verdict:
      '伪代码生成 helps quickly produce draft copy with clear structure, but key content still needs human oversight.',
    bestFor: ['Content creators', 'Marketers', 'Operators'],
  },
  'diff-pro': {
    pros: ['Practical features', 'Simple operation', 'Reliable results'],
    cons: ['Basic features only', 'No advanced options', 'UI needs polish'],
    verdict:
      'diff-pro is practical and easy to use, an efficient tool for solving specific scenario needs.',
    bestFor: ['General users', 'Developers', 'Office workers'],
  },
  qrcode: {
    pros: [
      'One-click generation',
      'Standardized output format',
      'Supports batch operations',
    ],
    cons: [
      'Randomness not controllable',
      'Limited creative depth',
      'No template library',
    ],
    verdict:
      '二维码生成器 generates what you need in one click, saving manual configuration hassle, great for quick prototypes.',
    bestFor: ['Product managers', 'Designers', 'Developers'],
  },
  'chi-squared': {
    pros: [
      'Accurate calculations',
      'Clear step display',
      'Supports multiple test methods',
    ],
    cons: [
      'Only basic statistics',
      'No visualization',
      'Formula input inconvenient',
    ],
    verdict:
      '卡方检验 provides accurate statistical calculations with clear steps, suitable for quick validation and insights.',
    bestFor: ['Data analysts', 'Students', 'Researchers'],
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
