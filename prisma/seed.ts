import { PrismaClient, ToolCategory } from '@prisma/client'

const prisma = new PrismaClient()

const tools = [
  // 开发工具
  { slug: 'jwt-parser', name: 'JWT 解析器', nameEn: 'JWT Parser', category: ToolCategory.DEV, icon: '🔐', description: '解析 JWT Token，查看载荷和过期时间', creditCost: 0, tags: ['auth','security'], url: '/tools/jwt-parser' },
  { slug: 'json-formatter', name: 'JSON 格式化', nameEn: 'JSON Formatter', category: ToolCategory.DEV, icon: '📋', description: '格式化、压缩、校验 JSON', creditCost: 0, tags: ['json','format'], url: '/tools/json-formatter' },
  { slug: 'regex-tester', name: '正则测试', nameEn: 'Regex Tester', category: ToolCategory.DEV, icon: '🔍', description: '实时测试正则表达式', creditCost: 0, tags: ['regex','text'], url: '/tools/regex-tester' },
  { slug: 'uuid-generator', name: 'UUID 生成', nameEn: 'UUID Generator', category: ToolCategory.DEV, icon: '🆔', description: '批量生成 UUID', creditCost: 0, tags: ['id','generate'], url: '/tools/uuid-generator' },
  { slug: 'timestamp', name: '时间戳转换', nameEn: 'Timestamp Converter', category: ToolCategory.DEV, icon: '⏱️', description: '时间戳与日期互转', creditCost: 0, tags: ['time','date'], url: '/tools/timestamp' },
  { slug: 'base64', name: 'Base64 编解码', nameEn: 'Base64 Encode/Decode', category: ToolCategory.DEV, icon: '🔢', description: 'Base64 编码和解码', creditCost: 0, tags: ['encode','decode'], url: '/tools/base64' },
  { slug: 'sha256', name: 'SHA256 哈希', nameEn: 'SHA256 Hash', category: ToolCategory.DEV, icon: '🔒', description: '文件和文本哈希计算', creditCost: 0, tags: ['hash','security'], url: '/tools/sha256' },
  { slug: 'sql-formatter', name: 'SQL 格式化', nameEn: 'SQL Formatter', category: ToolCategory.DEV, icon: '🗄️', description: 'SQL 查询格式化', creditCost: 0, tags: ['sql','database'], url: '/tools/sql-formatter' },
  { slug: 'url-encode', name: 'URL 编码解码', nameEn: 'URL Encode/Decode', category: ToolCategory.DEV, icon: '🔗', description: 'URL 编码和解码', creditCost: 0, tags: ['url','encode'], url: '/tools/url-encode' },
  { slug: 'base-convert', name: '进制转换', nameEn: 'Base Converter', category: ToolCategory.DEV, icon: '🔢', description: '二/八/十/十六进制互转', creditCost: 0, tags: ['math','convert'], url: '/tools/base-convert' },
  { slug: 'password-gen', name: '密码生成器', nameEn: 'Password Generator', category: ToolCategory.DEV, icon: '🔑', description: '安全随机密码生成', creditCost: 0, tags: ['security','password'], url: '/tools/password-gen' },
  { slug: 'http-status', name: 'HTTP 状态码', nameEn: 'HTTP Status Codes', category: ToolCategory.DEV, icon: '🌐', description: 'HTTP 状态码速查', creditCost: 0, tags: ['http','reference'], url: '/tools/http-status' },
  { slug: 'html-entity', name: 'HTML 实体', nameEn: 'HTML Entity', category: ToolCategory.DEV, icon: '◈', description: 'HTML 实体编码转换', creditCost: 0, tags: ['html','encode'], url: '/tools/html-entity' },
  { slug: 'cron-parser', name: 'Cron 解析', nameEn: 'Cron Parser', category: ToolCategory.DEV, icon: '⏰', description: '解析 Cron 表达式', creditCost: 0, tags: ['cron','schedule'], url: '/tools/cron-parser' },
  { slug: 'code-explain', name: '代码解释', nameEn: 'Code Explainer', category: ToolCategory.DEV, icon: '💻', description: '代码统计和摘要', creditCost: 0, tags: ['code','analysis'], url: '/tools/code-explain' },
  { slug: 'code-review', name: '代码审查', nameEn: 'Code Review', category: ToolCategory.DEV, icon: '👁️', description: '代码问题检测和建议', creditCost: 0, tags: ['code','review'], url: '/tools/code-review' },
  { slug: 'shell-gen', name: 'Shell 生成', nameEn: 'Shell Generator', category: ToolCategory.DEV, icon: '🐚', description: '常用 Shell 命令生成', creditCost: 0, tags: ['shell','cli'], url: '/tools/shell-gen' },
  { slug: 'git-commit', name: 'Git Commit', nameEn: 'Git Commit Msg', category: ToolCategory.DEV, icon: '📌', description: '生成规范 Commit 消息', creditCost: 0, tags: ['git','message'], url: '/tools/git-commit' },
  { slug: 'ip-lookup', name: 'IP 查询', nameEn: 'IP Lookup', category: ToolCategory.DEV, icon: '🔍', description: 'IP 地理位置查询', creditCost: 0, tags: ['ip','network'], url: '/tools/ip-lookup' },
  { slug: 'curl-gen', name: 'cURL 生成', nameEn: 'cURL Generator', category: ToolCategory.DEV, icon: '🌐', description: 'HTTP 请求转 cURL', creditCost: 0, tags: ['http','curl'], url: '/tools/curl-gen' },
  { slug: 'diff', name: '文本对比', nameEn: 'Diff Checker', category: ToolCategory.DEV, icon: '📑', description: '行级文本差异对比', creditCost: 0, tags: ['diff','compare'], url: '/tools/diff' },
  { slug: 'unit-convert', name: '单位转换', nameEn: 'Unit Converter', category: ToolCategory.DEV, icon: '📐', description: '长度/重量/温度等单位转换', creditCost: 0, tags: ['unit','convert'], url: '/tools/unit-convert' },
  { slug: 'image-to-base64', name: '图片转 Base64', nameEn: 'Image to Base64', category: ToolCategory.DEV, icon: '🖼️', description: '图片转 Base64 编码', creditCost: 0, tags: ['image','base64'], url: '/tools/image-to-base64' },
  { slug: 'markdown', name: 'Markdown 预览', nameEn: 'Markdown Preview', category: ToolCategory.DEV, icon: '📝', description: '实时 Markdown 预览', creditCost: 0, tags: ['markdown','preview'], url: '/tools/markdown' },
  { slug: 'color-convert', name: '颜色转换', nameEn: 'Color Converter', category: ToolCategory.DEV, icon: '🎨', description: 'HEX/RGB/HSL 互转', creditCost: 0, tags: ['color','design'], url: '/tools/color-convert' },
  { slug: 'css-gradient', name: 'CSS 渐变', nameEn: 'CSS Gradient', category: ToolCategory.DEV, icon: '🌈', description: 'CSS 渐变生成器', creditCost: 0, tags: ['css','gradient'], url: '/tools/css-gradient' },
  { slug: 'qr-code', name: '二维码生成', nameEn: 'QR Code', category: ToolCategory.DEV, icon: '▣', description: '文本/URL 转二维码', creditCost: 0, tags: ['qr','generate'], url: '/tools/qr-code' },
  { slug: 'fullwidth', name: '全角半角', nameEn: 'Fullwidth Converter', category: ToolCategory.DEV, icon: '↔️', description: '全角半角字符转换', creditCost: 0, tags: ['text','convert'], url: '/tools/fullwidth' },
  { slug: 'word-count', name: '字数统计', nameEn: 'Word Count', category: ToolCategory.DEV, icon: '🔢', description: '文本字数统计', creditCost: 0, tags: ['text','count'], url: '/tools/word-count' },
  { slug: 'lorem-ipsum', name: '假文生成', nameEn: 'Lorem Ipsum', category: ToolCategory.DEV, icon: '📝', description: '生成占位文本', creditCost: 0, tags: ['text','generate'], url: '/tools/lorem-ipsum' },
  
  // 实用工具
  { slug: 'calculator', name: '计算器', nameEn: 'Calculator', category: ToolCategory.UTILITY, icon: '🧮', description: '科学计算器', creditCost: 0, tags: ['math','calculate'], url: '/tools/calculator' },
  { slug: 'json-diff', name: 'JSON 对比', nameEn: 'JSON Diff', category: ToolCategory.UTILITY, icon: '📊', description: '对比两个 JSON 的差异', creditCost: 0, tags: ['json','diff'], url: '/tools/json-diff' },
  { slug: 'csv-to-json', name: 'CSV 转 JSON', nameEn: 'CSV to JSON', category: ToolCategory.UTILITY, icon: '📋', description: 'CSV 和 JSON 互转', creditCost: 0, tags: ['csv','json','convert'], url: '/tools/csv-to-json' },
  { slug: 'text-case', name: '文本转换', nameEn: 'Text Case Converter', category: ToolCategory.UTILITY, icon: 'Aa', description: '大小写/驼峰/蛇形转换', creditCost: 0, tags: ['text','case'], url: '/tools/text-case' },
  { slug: 'encode-all', name: '全能编码', nameEn: 'All-in-One Encoder', category: ToolCategory.UTILITY, icon: '🔣', description: '多种编码格式转换', creditCost: 0, tags: ['encode','decode'], url: '/tools/encode-all' },
  { slug: 'barcode', name: '条形码', nameEn: 'Barcode', category: ToolCategory.UTILITY, icon: '▪', description: '生成各类条形码', creditCost: 0, tags: ['barcode','generate'], url: '/tools/barcode' },
  { slug: 'image-resize', name: '图片调整', nameEn: 'Image Resizer', category: ToolCategory.UTILITY, icon: '🖼️', description: '调整图片尺寸', creditCost: 0, tags: ['image','resize'], url: '/tools/image-resize' },
  { slug: 'color-palette', name: '调色板', nameEn: 'Color Palette', category: ToolCategory.UTILITY, icon: '🎨', description: '从图片提取配色', creditCost: 0, tags: ['color','design'], url: '/tools/color-palette' },
  { slug: 'timer', name: '计时器', nameEn: 'Timer', category: ToolCategory.UTILITY, icon: '⏱️', description: '倒计时和秒表', creditCost: 0, tags: ['time','utility'], url: '/tools/timer' },
  { slug: 'pomodoro', name: '番茄钟', nameEn: 'Pomodoro', category: ToolCategory.UTILITY, icon: '🍅', description: '番茄工作法计时', creditCost: 0, tags: ['time','productivity'], url: '/tools/pomodoro' },
  { slug: 'clipboard', name: '剪贴板', nameEn: 'Clipboard', category: ToolCategory.UTILITY, icon: '📋', description: '剪贴板历史管理', creditCost: 0, tags: ['clipboard','utility'], url: '/tools/clipboard' },
  { slug: 'password-check', name: '密码强度', nameEn: 'Password Strength', category: ToolCategory.UTILITY, icon: '🔐', description: '检测密码安全性', creditCost: 0, tags: ['password','security'], url: '/tools/password-check' },
  { slug: 'random-gen', name: '随机生成', nameEn: 'Random Generator', category: ToolCategory.UTILITY, icon: '🎲', description: '随机数、密码、姓名生成', creditCost: 0, tags: ['random','generate'], url: '/tools/random-gen' },
  { slug: 'text-stats', name: '文本统计', nameEn: 'Text Statistics', category: ToolCategory.UTILITY, icon: '📊', description: '文本深度分析统计', creditCost: 0, tags: ['text','stats'], url: '/tools/text-stats' },
  { slug: 'table-gen', name: '表格生成', nameEn: 'Table Generator', category: ToolCategory.UTILITY, icon: '▦', description: 'Markdown/HTML 表格生成', creditCost: 0, tags: ['table','generate'], url: '/tools/table-gen' },
  { slug: 'svg-to-png', name: 'SVG 转 PNG', nameEn: 'SVG to PNG', category: ToolCategory.UTILITY, icon: '🖼️', description: 'SVG 转 PNG 下载', creditCost: 0, tags: ['svg','image','convert'], url: '/tools/svg-to-png' },
  
  // AI写作工具
  { slug: 'seo-title', name: 'SEO 标题', nameEn: 'SEO Title', category: ToolCategory.AI_WRITING, icon: '🎯', description: '生成 SEO 优化标题', creditCost: 1, tags: ['seo','title'], url: '/tools/seo-title' },
  { slug: 'blog-outline', name: '博客大纲', nameEn: 'Blog Outline', category: ToolCategory.AI_WRITING, icon: '📝', description: '生成博客文章大纲', creditCost: 1, tags: ['blog','outline'], url: '/tools/blog-outline' },
  { slug: 'x-post', name: 'X 推文', nameEn: 'X Post', category: ToolCategory.AI_WRITING, icon: '🐦', description: '生成社交媒体推文', creditCost: 1, tags: ['social','post'], url: '/tools/x-post' },
  { slug: 'newsletter', name: '邮件简报', nameEn: 'Newsletter', category: ToolCategory.AI_WRITING, icon: '📧', description: '生成邮件简报内容', creditCost: 1, tags: ['email','newsletter'], url: '/tools/newsletter' },
  { slug: 'pr-desc', name: 'PR 描述', nameEn: 'PR Description', category: ToolCategory.AI_WRITING, icon: '📌', description: '生成 Pull Request 描述', creditCost: 1, tags: ['git','pr'], url: '/tools/pr-desc' },
  { slug: 'ad-copy', name: '广告文案', nameEn: 'Ad Copy', category: ToolCategory.AI_WRITING, icon: '📢', description: '生成营销广告文案', creditCost: 1, tags: ['marketing','copy'], url: '/tools/ad-copy' },
  { slug: 'cold-email', name: 'Cold Email', nameEn: 'Cold Email', category: ToolCategory.AI_WRITING, icon: '📨', description: '生成商务冷邮件', creditCost: 1, tags: ['email','business'], url: '/tools/cold-email' },
  { slug: 'humanize', name: 'AI 人性化', nameEn: 'AI Humanizer', category: ToolCategory.AI_WRITING, icon: '👤', description: '让 AI 文本更像人写的', creditCost: 1, tags: ['ai','humanize'], url: '/tools/humanize' },
  { slug: 'changelog', name: '更新日志', nameEn: 'Changelog', category: ToolCategory.AI_WRITING, icon: '📋', description: '生成项目更新日志', creditCost: 1, tags: ['changelog','release'], url: '/tools/changelog' },
  { slug: 'tldr', name: 'TL;DR 摘要', nameEn: 'TL;DR', category: ToolCategory.AI_WRITING, icon: '📄', description: '长文摘要生成', creditCost: 1, tags: ['summary','text'], url: '/tools/tldr' },
  { slug: 'readability', name: '可读性检测', nameEn: 'Readability', category: ToolCategory.AI_WRITING, icon: '📊', description: '检测文本可读性分数', creditCost: 0, tags: ['text','readability'], url: '/tools/readability' },
]

const achievements = [
  { slug: 'first-visit', name: '初次到访', nameEn: 'First Visit', description: '第一次访问 AIHues', icon: '👋', points: 5, condition: 'visit_count >= 1' },
  { slug: 'tool-explorer', name: '工具探索者', nameEn: 'Tool Explorer', description: '使用了 5 个不同工具', icon: '🔍', points: 10, condition: 'unique_tools >= 5' },
  { slug: 'power-user', name: '重度用户', nameEn: 'Power User', description: '使用了 20 个不同工具', icon: '⚡', points: 25, condition: 'unique_tools >= 20' },
  { slug: 'tool-master', name: '工具大师', nameEn: 'Tool Master', description: '使用了全部 57 个工具', icon: '🏆', points: 50, condition: 'unique_tools >= 57' },
  { slug: 'first-rate', name: '首次评分', nameEn: 'First Rating', description: '给第一个工具评分', icon: '⭐', points: 5, condition: 'ratings_count >= 1' },
  { slug: 'critic', name: '评论家', nameEn: 'Critic', description: '给 10 个工具评分', icon: '🎭', points: 15, condition: 'ratings_count >= 10' },
  { slug: 'daily-streak-3', name: '三日连击', nameEn: '3-Day Streak', description: '连续 3 天使用工具', icon: '🔥', points: 10, condition: 'streak_days >= 3' },
  { slug: 'daily-streak-7', name: '七日连击', nameEn: '7-Day Streak', description: '连续 7 天使用工具', icon: '🌟', points: 20, condition: 'streak_days >= 7' },
  { slug: 'game-player', name: '玩家', nameEn: 'Game Player', description: '玩了 3 个小游戏', icon: '🎮', points: 10, condition: 'games_played >= 3' },
  { slug: 'high-scorer', name: '高分选手', nameEn: 'High Scorer', description: '在排行榜进入前 10', icon: '🥇', points: 30, condition: 'leaderboard_rank <= 10' },
]

async function main() {
  console.log('🌱 Seeding database...')
  
  for (const tool of tools) {
    await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: tool,
      create: tool,
    })
  }
  console.log(`✅ ${tools.length} tools seeded`)
  
  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { slug: ach.slug },
      update: ach,
      create: ach,
    })
  }
  console.log(`✅ ${achievements.length} achievements seeded`)
  
  console.log('🎉 Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
