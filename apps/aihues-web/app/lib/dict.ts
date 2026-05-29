/* ── AIHues bilingual dictionary ──
   Flat keys, dot-separated namespaces.
   Usage: t('hero.title') → 'Find your AI vibe'
*/

export type Locale = 'en' | 'zh';

export const dict: Record<Locale, Record<string, string>> = {
  en: {
    // nav
    'nav.home': 'Home',
    'nav.tools': 'Tools',
    'nav.games': 'Games',
    'nav.blog': 'Blog',
    'nav.wishlist': 'Wishlist',
    'nav.ranking': 'Ranking',
    'nav.discover': 'Discover',
    'nav.login': 'Login',

    // hero
    'hero.title': 'Find your',
    'hero.aiVibe': 'AI vibe',
    'hero.subtitle':
      '57+ AI tools, mini games & utilities that just work. Tell us what you need.',
    'hero.searchPlaceholder': "e.g. 'parse JWT'... (Press / to focus)",
    'hero.askAI': 'Ask AI',

    // categories
    'categories.title': 'Browse by category',
    'categories.seeAll': 'See all tools →',
    'cat.utility': 'Utility',
    'cat.developer': 'Developer',
    'cat.aiWriting': 'AI Writing',
    'cat.games': 'Games',
    'cat.utilityDesc': 'Word Count, Diff, Fullwidth, Readability, Humanize',
    'cat.developerDesc': 'JWT, JSON, Regex, Base64, UUID, QR Code, SHA256',
    'cat.aiWritingDesc': 'X Post, Blog Outline, SEO Title, Newsletter, PR Desc',
    'cat.gamesDesc': 'Daily Fortune, Slots, Hoops — earn Credits',

    // stats
    'stats.aiTools': 'AI Tools',
    'stats.devTools': 'Dev Tools',
    'stats.games': 'Games',
    'stats.freeCredits': 'Free Credits',
    'stats.dayStreak': 'Day Streak',

    // sections
    'section.devTools': 'Developer Tools',
    'section.newThisWeek': 'New This Week',
    'section.tools': 'tools',
    'section.allTools': 'All tools →',
    'section.writingTools': 'Writing Tools',
    'section.gameCenter': 'Game Center',
    'section.creditBalance': 'Your Credit Balance',
    'section.viewAll': 'View all →',
    'section.popularTools': 'Popular Tools',
    'section.dualEngine': 'Tools + Games Dual Engine',
    'section.dualEngineDesc':
      'Use tools, then play a game to relax. 57 tools + 3 games = complete platform.',
    'section.browseAll': 'Browse All Tools →',
    'section.wishlistTitle': "Can't find what you need?",
    'section.wishlistDesc': 'Submit your idea. Top requests get built first.',
    'section.submitIdea': 'Submit Your Idea →',

    // games
    'game.draw': 'Draw →',
    'game.spin': 'Spin →',
    'game.play': 'Play →',
    'game.dailyLuckDesc': 'Daily draw for wisdom & Credit rewards',
    'game.slotMachineDesc': '3 free spins daily, win big prizes',
    'game.basketballDesc': '60 seconds to score maximum points',
    'game.daily': 'DAILY',
    'game.popular': 'POPULAR',
    'game.skill': 'SKILL',

    // credit
    'credit.title': 'Credit Rules',
    'credit.initial': 'Initial Bonus',
    'credit.initialDesc': 'Start with 100 credits',
    'credit.playToEarn': 'Play to Earn',
    'credit.playToEarnDesc': '+5~100 credits per game',
    'credit.useTools': 'Use Tools',
    'credit.useToolsDesc': 'Spend credits on premium tools',
    'credit.dailyCheckin': 'Daily Check-in',
    'credit.dailyCheckinDesc': '+10 credits daily, streak bonus',
    'credit.howItWorks': 'How it works',
    'credit.yourCredits': 'Your Credits',
    'credit.perGame': 'Credits/Game',

    // sidebar
    'sidebar.allTools': 'All Tools',
    'sidebar.growth': 'Growth',
    'sidebar.devTools': 'Developer Tools',
    'sidebar.utilities': 'Utilities',
    'sidebar.aiProducts': 'AI Products',
    'sidebar.openSource': 'Open Source',
    'sidebar.design': 'Design',
    'sidebar.miniGames': 'Mini Games',

    // price filter
    'price.all': 'All',
    'price.free': 'Free',
    'price.freemium': 'Freemium',
    'price.paid': 'Paid',

    // tools
    'tool.wordCount.title': 'Word Counter',
    'tool.wordCount.desc': 'Real-time character, word, and line counting',
    'tool.wordCount.placeholder': 'Paste or type your text here...',
    'tool.wordCount.chars': 'Characters',
    'tool.wordCount.charsNoSpace': 'No Space',
    'tool.wordCount.words': 'Words',
    'tool.wordCount.lines': 'Lines',
    'tool.wordCount.paragraphs': 'Paragraphs',
    'tool.wordCount.readTime': 'Read Time',
    'tool.wordCount.clear': 'Clear',
    'tool.wordCount.copy': 'Copy',

    'tool.base64.title': 'Base64 Encoder / Decoder',
    'tool.base64.desc': 'Encode and decode Base64 strings instantly',
    'tool.base64.placeholder': 'Enter text to encode or Base64 to decode...',
    'tool.base64.encode': 'Encode',
    'tool.base64.decode': 'Decode',
    'tool.base64.result': 'Result',
    'tool.base64.urlSafe': 'URL-safe',

    'tool.urlEncode.title': 'URL Encoder / Decoder',
    'tool.urlEncode.desc': 'Encode and decode URL strings instantly',
    'tool.urlEncode.placeholder': 'Enter text to encode or URL-encoded text to decode...',
    'tool.urlEncode.encode': 'Encode',
    'tool.urlEncode.decode': 'Decode',
    'tool.urlEncode.result': 'Result',

    // footer
    'footer.product': 'Product',
    'footer.games': 'Games',
    'footer.company': 'Company',
    'footer.about': 'About',
    'footer.terms': 'Terms',
    'footer.copyright': '© 2026 AIHues · Find your AI vibe · Built on Kimi',
    'footer.tagline': 'Find your AI vibe. 57 tools + 3 games that feel human.',

    // playbooks
    'playbooks.badge1': 'AI Vibe Navigator',
    'playbooks.badge2': 'Built on Kimi',
    'playbooks.title': 'AIHues Growth Stack + AI Tools',
    'playbooks.desc':
      '100+ tools covering growth, AI products, open-source tracking, and design.',
  },
  zh: {
    // nav
    'nav.home': '首页',
    'nav.tools': '工具',
    'nav.games': '游戏',
    'nav.blog': '博客',
    'nav.wishlist': '许愿单',
    'nav.ranking': '排行榜',
    'nav.discover': '发现',
    'nav.login': '登录',

    // hero
    'hero.title': '找到你的',
    'hero.aiVibe': 'AI vibe',
    'hero.subtitle':
      '57+ AI 工具、小游戏和实用工具，开箱即用。告诉我们你的需求。',
    'hero.searchPlaceholder': "例如 '解析 JWT'... (按 / 聚焦)",
    'hero.askAI': '问 AI',

    // categories
    'categories.title': '按分类浏览',
    'categories.seeAll': '查看全部工具 →',
    'cat.utility': '常用小工具',
    'cat.developer': '开发者工具',
    'cat.aiWriting': 'AI 写作',
    'cat.games': '小游戏',
    'cat.utilityDesc': '字数统计、文本对比、全角转换、可读性、人性化',
    'cat.developerDesc': 'JWT、JSON、正则、Base64、UUID、二维码、SHA256',
    'cat.aiWritingDesc': 'X 推文、博客大纲、SEO 标题、新闻稿、PR 描述',
    'cat.gamesDesc': '每日幸运签、老虎机、投篮挑战 — 赚取积分',

    // stats
    'stats.aiTools': 'AI 工具',
    'stats.devTools': '开发工具',
    'stats.games': '小游戏',
    'stats.freeCredits': '免费积分',
    'stats.dayStreak': '连续签到',

    // sections
    'section.devTools': '开发者工具',
    'section.newThisWeek': '本周上新',
    'section.tools': '个工具',
    'section.allTools': '全部工具 →',
    'section.writingTools': '写作工具',
    'section.gameCenter': '游戏中心',
    'section.creditBalance': '当前积分',
    'section.viewAll': '查看全部 →',
    'section.popularTools': '热门工具',
    'section.dualEngine': '工具 + 游戏双引擎',
    'section.dualEngineDesc':
      '用工具提高效率，再玩个小游戏放松。57 个工具 + 3 款游戏 = 完整平台。',
    'section.browseAll': '浏览全部工具 →',
    'section.wishlistTitle': '找不到你需要的？',
    'section.wishlistDesc': '提交你的想法。最受欢迎的请求优先开发。',
    'section.submitIdea': '提交你的想法 →',

    // games
    'game.draw': '抽签 →',
    'game.spin': '旋转 →',
    'game.play': '开始 →',
    'game.dailyLuckDesc': '每日抽签获取箴言和积分奖励',
    'game.slotMachineDesc': '每日 3 次免费旋转，赢取大奖',
    'game.basketballDesc': '60 秒内获得最高分',
    'game.daily': '每日',
    'game.popular': '热门',
    'game.skill': '技巧',

    // credit
    'credit.title': '积分规则',
    'credit.initial': '初始奖励',
    'credit.initialDesc': '新用户赠送 100 积分',
    'credit.playToEarn': '玩游戏赚积分',
    'credit.playToEarnDesc': '每局游戏 +5~100 积分',
    'credit.useTools': '使用工具',
    'credit.useToolsDesc': '高级工具消耗积分解锁',
    'credit.dailyCheckin': '每日签到',
    'credit.dailyCheckinDesc': '每日 +10 积分，连签有加成',
    'credit.howItWorks': '积分规则',
    'credit.yourCredits': '当前积分',
    'credit.perGame': '积分/局',

    // sidebar
    'sidebar.allTools': '全部工具',
    'sidebar.growth': '出海增长',
    'sidebar.devTools': '开发者工具',
    'sidebar.utilities': '常用小工具',
    'sidebar.aiProducts': 'AI 产品推荐',
    'sidebar.openSource': '开源追踪',
    'sidebar.design': '设计工具',
    'sidebar.miniGames': '小游戏',

    // price filter
    'price.all': '全部',
    'price.free': '免费',
    'price.freemium': '免费增值',
    'price.paid': '付费',

    // tools
    'tool.wordCount.title': '字数统计',
    'tool.wordCount.desc': '实时统计字符数、字数和行数',
    'tool.wordCount.placeholder': '在此粘贴或输入文本...',
    'tool.wordCount.chars': '字符数',
    'tool.wordCount.charsNoSpace': '无空格',
    'tool.wordCount.words': '字数',
    'tool.wordCount.lines': '行数',
    'tool.wordCount.paragraphs': '段落数',
    'tool.wordCount.readTime': '阅读时间',
    'tool.wordCount.clear': '清空',
    'tool.wordCount.copy': '复制',

    'tool.base64.title': 'Base64 编码 / 解码',
    'tool.base64.desc': '即时编码和解码 Base64 字符串',
    'tool.base64.placeholder': '输入要编码的文本或要解码的 Base64...',
    'tool.base64.encode': '编码',
    'tool.base64.decode': '解码',
    'tool.base64.result': '结果',
    'tool.base64.urlSafe': 'URL 安全模式',

    'tool.urlEncode.title': 'URL 编码 / 解码',
    'tool.urlEncode.desc': '即时编码和解码 URL 字符串',
    'tool.urlEncode.placeholder': '输入要编码的文本或要解码的 URL 编码文本...',
    'tool.urlEncode.encode': '编码',
    'tool.urlEncode.decode': '解码',
    'tool.urlEncode.result': '结果',

    // footer
    'footer.product': '产品',
    'footer.games': '游戏',
    'footer.company': '公司',
    'footer.about': '关于',
    'footer.terms': '条款',
    'footer.copyright': '© 2026 AIHues · 找到你的 AI vibe · 基于 Kimi 构建',
    'footer.tagline': '找到你的 AI vibe。57 个工具 + 3 款游戏，自然流畅。',

    // playbooks
    'playbooks.badge1': 'AI Vibe Navigator',
    'playbooks.badge2': '基于 Kimi 构建',
    'playbooks.title': 'AIHues 出海增长 + AI 工具导航',
    'playbooks.desc': '100+ 工具覆盖出海增长、AI 产品、开源追踪和设计领域。',
  },
};

export function t(locale: Locale, key: string): string {
  return dict[locale][key] ?? dict.en[key] ?? key;
}
