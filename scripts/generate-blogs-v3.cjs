#!/usr/bin/env node
/**
 * AIHues Blog Generator v3
 * ========================
 * LLM-powered blog generation with de-AI flavor + Unsplash covers.
 *
 * Usage:
 *   node scripts/generate-blogs-v3.cjs [--limit=N] [--mode=llm|template] [--dry-run]
 *
 * Modes:
 *   llm     - Calls LLM API for each article (requires KIMI_API_KEY or DEEPSEEK_API_KEY or OPENAI_API_KEY)
 *   template- Uses improved hand-crafted templates (no API key needed)
 *
 * Environment:
 *   KIMI_API_KEY       - Moonshot API key
 *   DEEPSEEK_API_KEY   - DeepSeek API key
 *   OPENAI_API_KEY     - OpenAI API key
 *   LLM_MODE           - Override mode: "llm" or "template"
 */

const fs = require('fs');
const path = require('path');

const POSTS_JSON = path.join(__dirname, '..', 'apps', 'aihues-web', 'content', 'blog', 'posts.json');
const BLOG_DIR = path.join(__dirname, '..', 'apps', 'aihues-web', 'public', 'blog');

/* ── CLI args ── */
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const LIMIT_ARG = args.find((a) => a.startsWith('--limit='));
const LIMIT = LIMIT_ARG ? parseInt(LIMIT_ARG.split('=')[1], 10) : Infinity;
const MODE_ARG = args.find((a) => a.startsWith('--mode='));
const MODE = MODE_ARG ? MODE_ARG.split('=')[1] : process.env.LLM_MODE || 'template';

/* ── Unsplash keyword mapping by tag (from IMAGE-GUIDE.md) ── */
const UNSPLASH_KEYWORDS = {
  'AI Tools': 'ai technology laptop developer workspace',
  Growth: 'startup growth chart team meeting whiteboard',
  'Indie Dev': 'indie developer home office remote work coffee laptop',
  Productivity: 'planner notebook organized desk focus',
  SEO: 'search engine notebook planning keyword research',
  Development: 'code laptop night programming developer screen',
  Content: 'writing typewriter notebook pen creative desk',
  Product: 'product design prototype wireframe whiteboard team',
  'Social Media': 'social media phone engagement community',
};

/* ── Pre-selected high-quality Unsplash photo IDs by tag ── */
const UNSPLASH_PRESETS = {
  'AI Tools': [
    'photo-1485827404703-89b55fcc595e',
    'photo-1518770660439-4636190af475',
    'photo-1555949963-ff9fe0c870eb',
    'photo-1526374965328-7f61d4dc18c5',
    'photo-1504639725590-34d0984388bd',
    'photo-1461749280684-dccba630e2f6',
    'photo-1516321318423-f06f85e504b3',
    'photo-1531297484001-80022131f5a1',
    'photo-1550751827-4bd374c3f58b',
    'photo-1526379096588-290a6b65f8a3',
  ],
  Growth: [
    'photo-1552664730-d307ca884978',
    'photo-1460925895917-afdab827c52f',
    'photo-1553877522-43269d4ea984',
    'photo-1531403009284-440f080d1e12',
    'photo-1559136555-9303baea8ebd',
    'photo-1542744173-8e7e53415bb0',
    'photo-1517245386807-bb43f82c33c4',
    'photo-1556761175-5973dc0f32e7',
    'photo-1531482615713-2afd69097998',
    'photo-1522202176988-66273c2fd55f',
  ],
  'Indie Dev': [
    'photo-1507003211169-0a1dd7228f2d',
    'photo-1515378960530-7c0da6231fb1',
    'photo-1498050108023-c5249f4df085',
    'photo-1517694712202-14dd9538aa97',
    'photo-1455390582262-044cdead277a',
    'photo-1504639725590-34d0984388bd',
    'photo-1522071820081-009f0129c71c',
    'photo-1553877522-43269d4ea984',
    'photo-1521737711867-e3b97375f902',
    'photo-1542744173-8e7e53415bb0',
  ],
  Productivity: [
    'photo-1484480974693-6ca0a78fb36b',
    'photo-1506784365847-bbad939e9335',
    'photo-1434030216411-0b793f4b4173',
    'photo-1488190211105-8b0e65b80b4e',
    'photo-1456324504439-367cee3b3c32',
    'photo-1501504905252-473c47e087f8',
    'photo-1517842645767-c639042777db',
    'photo-1434494878577-86c23bcb06b9',
    'photo-1484480974693-6ca0a78fb36b',
    'photo-1499951360447-b19be8fe80f5',
  ],
  SEO: [
    'photo-1432888498266-38ffec3eaf0a',
    'photo-1563986768609-322da13575f3',
    'photo-1551288049-bebda4e38f71',
    'photo-1460925895917-afdab827c52f',
    'photo-1504868584819-f8e8b4b6d7e3',
    'photo-1542435503-956c469947f6',
    'photo-1454165804606-c3d57bc86b40',
    'photo-1486312338219-ce68d2c6f44d',
    'photo-1519389950473-47ba0277781c',
    'photo-1434030216411-0b793f4b4173',
  ],
  Development: [
    'photo-1461749280684-dccba630e2f6',
    'photo-1516321318423-f06f85e504b3',
    'photo-1555066931-4365d14bab8c',
    'photo-1498050108023-c5249f4df085',
    'photo-1504639725590-34d0984388bd',
    'photo-1531297484001-80022131f5a1',
    'photo-1587620962725-abab7fe55159',
    'photo-1517694712202-14dd9538aa97',
    'photo-1555949963-ff9fe0c870eb',
    'photo-1526379096588-290a6b65f8a3',
  ],
};

/* ── AIHues tool links embedded in articles (from polish-20-articles) ── */
const TAG_TOOLS = {
  'AI Tools': [
    { slug: 'humanize', anchor: 'Humanize tool', context: 'making AI text sound natural' },
    { slug: 'code-review', anchor: 'Code Review tool', context: 'reviewing AI-generated code' },
    { slug: 'tldr', anchor: 'TL;DR tool', context: 'summarizing long articles' },
    { slug: 'blog-outline', anchor: 'Blog Outline tool', context: 'planning blog structure' },
  ],
  Growth: [
    { slug: 'cold-email', anchor: 'Cold Email tool', context: 'crafting outreach emails' },
    { slug: 'seo-title', anchor: 'SEO Title Optimizer', context: 'optimizing headlines' },
    { slug: 'linkedin', anchor: 'LinkedIn Post Generator', context: 'growing professional network' },
    { slug: 'x-post', anchor: 'X Post Generator', context: 'writing social content' },
  ],
  'Indie Dev': [
    { slug: 'tagline', anchor: 'Tagline tool', context: 'crafting brand messaging' },
    { slug: 'lp-hero', anchor: 'LP Hero tool', context: 'writing landing page copy' },
    { slug: 'faq', anchor: 'FAQ tool', context: 'answering common questions' },
    { slug: 'meta', anchor: 'Meta Tag Generator', context: 'SEO meta tags' },
  ],
  Productivity: [
    { slug: 'pomodoro', anchor: 'Pomodoro Timer', context: 'focused work sessions' },
    { slug: 'markdown', anchor: 'Markdown Preview', context: 'writing and formatting' },
    { slug: 'shell', anchor: 'Shell Generator', context: 'automation scripts' },
    { slug: 'cron-parser', anchor: 'Cron Parser', context: 'scheduling tasks' },
  ],
  SEO: [
    { slug: 'seo-title', anchor: 'SEO Title Optimizer', context: 'headline optimization' },
    { slug: 'meta', anchor: 'Meta Tag Generator', context: 'meta descriptions' },
    { slug: 'blog-outline', anchor: 'Blog Outline tool', context: 'content planning' },
  ],
  Development: [
    { slug: 'code-explain', anchor: 'Code Explainer', context: 'understanding code' },
    { slug: 'sql', anchor: 'SQL Formatter', context: 'database queries' },
    { slug: 'json', anchor: 'JSON Formatter', context: 'API debugging' },
    { slug: 'curl-gen', anchor: 'cURL Generator', context: 'API testing' },
    { slug: 'http-status', anchor: 'HTTP Status Reference', context: 'API design' },
  ],
};

/* ── Topics (same 90 articles, ready for v3 generation) ── */
const TOPICS = [
  // AI Tools (20)
  { tag: 'AI Tools', title: 'Claude 3.7 vs GPT-4o: Which One Actually Writes Better Code?', excerpt: 'I ran both models through 50 real-world coding tasks. Here is what the numbers say — and what surprised me.', date: '2026-05-30', readTime: '8 min' },
  { tag: 'AI Tools', title: 'The Hidden Costs of AI Writing Tools Nobody Talks About', excerpt: 'Subscription creep, API limits, and the one feature that actually matters when you scale content production.', date: '2026-05-29', readTime: '6 min' },
  { tag: 'AI Tools', title: 'Cursor Editor: 10 Features That Will Change How You Code', excerpt: 'From inline chat to whole-file generation, here is how to squeeze every drop of productivity out of Cursor.', date: '2026-05-28', readTime: '7 min' },
  { tag: 'AI Tools', title: 'Why I Switched from ChatGPT to Perplexity for Research', excerpt: 'Citation-backed answers changed my workflow forever. Here is the side-by-side comparison that convinced me.', date: '2026-05-26', readTime: '5 min' },
  { tag: 'AI Tools', title: 'Midjourney v7 Review: The Good, The Bad, and The Weird', excerpt: 'Better photorealism, stranger artifacts, and the prompt technique that finally clicked for me.', date: '2026-05-24', readTime: '7 min' },
  { tag: 'AI Tools', title: 'Running LLMs Locally: A Complete Setup Guide for 2026', excerpt: 'From Ollama to vLLM, here is the hardware and software stack you need to run production-grade AI on your own machine.', date: '2026-05-23', readTime: '9 min' },
  { tag: 'AI Tools', title: 'The Best AI Tools for Indie Developers in 2026', excerpt: 'A curated list of 25 tools that actually save time, not just add another subscription to your credit card.', date: '2026-05-21', readTime: '8 min' },
  { tag: 'AI Tools', title: 'How to Build an AI SaaS in 48 Hours (Step by Step)', excerpt: 'From idea to first paying customer using only AI tools. No coding team required.', date: '2026-05-19', readTime: '10 min' },
  { tag: 'AI Tools', title: 'Prompt Engineering Is Dead. Long Live Prompt Engineering.', excerpt: 'Why simple prompts beat complex chains in 2026, and the 3 patterns that still matter.', date: '2026-05-17', readTime: '6 min' },
  { tag: 'AI Tools', title: 'AI Voice Cloning: Use Cases, Ethics, and the Tools That Get It Right', excerpt: 'From podcast editing to audiobooks, here is where voice AI shines — and where it crosses the line.', date: '2026-05-16', readTime: '7 min' },
  { tag: 'AI Tools', title: 'Why Your AI-Generated Content Sounds Generic (And How to Fix It)', excerpt: 'The training data problem nobody talks about, and the 5-minute trick that makes AI text sound like you.', date: '2026-05-14', readTime: '6 min' },
  { tag: 'AI Tools', title: 'AutoGPT vs Agentic Workflows: What Actually Works in Production', excerpt: 'We tested 8 autonomous AI frameworks on real business tasks. Most failed. Two surprised us.', date: '2026-05-13', readTime: '8 min' },
  { tag: 'AI Tools', title: 'The Complete Guide to AI-Powered Customer Support', excerpt: 'How to cut response time by 80% without making customers hate you.', date: '2026-05-11', readTime: '7 min' },
  { tag: 'AI Tools', title: 'Building AI Products Without a PhD: A Pragmatic Guide', excerpt: 'You do not need to understand transformers to ship AI features. Here is what you actually need to know.', date: '2026-05-09', readTime: '9 min' },
  { tag: 'AI Tools', title: 'AI Image Generation for Marketing: A Cost Breakdown', excerpt: 'Midjourney, DALL-E, Stable Diffusion, and the hidden costs of building a visual brand with AI.', date: '2026-05-07', readTime: '6 min' },
  { tag: 'AI Tools', title: 'How We Use AI to Cut Our Content Production Time by 70%', excerpt: 'The exact workflow, tools, and human-in-the-loop checks that make AI content actually usable.', date: '2026-05-06', readTime: '8 min' },
  { tag: 'AI Tools', title: 'Open Source AI Models That Rival GPT-4 in 2026', excerpt: 'The Llama 4, Mistral, and Qwen variants that are good enough to replace paid APIs.', date: '2026-05-05', readTime: '7 min' },
  { tag: 'AI Tools', title: 'AI Coding Assistants: Copilot vs Cody vs Codeium', excerpt: 'A developer\'s honest review after 6 months with each tool.', date: '2026-05-04', readTime: '8 min' },
  { tag: 'AI Tools', title: 'The Rise of AI Agents: Hype vs Reality', excerpt: 'What agents can do today, what they cannot, and why 90% of "agent" startups will fail.', date: '2026-05-03', readTime: '7 min' },
  { tag: 'AI Tools', title: 'How to Evaluate AI Tools: A Framework for Teams', excerpt: 'Stop demoing and start measuring. Here is the scorecard we use for every AI tool evaluation.', date: '2026-05-02', readTime: '6 min' },

  // Growth (20)
  { tag: 'Growth', title: 'Launching on Product Hunt: What Worked in 2026', excerpt: 'The new rules of Product Hunt launches, and why #1 of the day does not guarantee long-term success.', date: '2026-05-31', readTime: '7 min' },
  { tag: 'Growth', title: 'App Store Optimization in 2026: Beyond Keywords', excerpt: 'How screenshots, reviews, and seasonal events drive more downloads than ASO tools.', date: '2026-05-30', readTime: '6 min' },
  { tag: 'Growth', title: 'Cold Email That Gets Replies: Templates and Psychology', excerpt: 'We analyzed 10,000 cold emails. Here is what the top 1% have in common.', date: '2026-05-28', readTime: '8 min' },
  { tag: 'Growth', title: 'Building a Personal Brand on LinkedIn as a Developer', excerpt: 'From 0 to 50K followers: the content strategy that actually works for technical people.', date: '2026-05-27', readTime: '7 min' },
  { tag: 'Growth', title: 'The Dark Side of Growth Hacking: What Not to Do', excerpt: 'Fake reviews, bot traffic, and black-hat SEO — the shortcuts that will kill your startup.', date: '2026-05-25', readTime: '6 min' },
  { tag: 'Growth', title: 'How to Get Your First 1000 Users Without Paid Ads', excerpt: 'Community-led growth, content loops, and the channels that actually convert for indie products.', date: '2026-05-24', readTime: '9 min' },
  { tag: 'Growth', title: 'SaaS Pricing Strategies That Actually Convert in 2026', excerpt: 'Usage-based, seat-based, or hybrid? We break down what works for different product types.', date: '2026-05-22', readTime: '8 min' },
  { tag: 'Growth', title: 'From Side Project to $50K ARR: A 12-Month Timeline', excerpt: 'The exact milestones, pivots, and growth channels that took one indie dev from hobby to business.', date: '2026-05-21', readTime: '10 min' },
  { tag: 'Growth', title: 'Why Your Landing Page Is Not Converting (And How to Fix It)', excerpt: 'Common mistakes in indie dev landing pages, and the copy/framework changes that doubled our signups.', date: '2026-05-19', readTime: '7 min' },
  { tag: 'Growth', title: 'The Complete Guide to Affiliate Marketing for SaaS', excerpt: 'How to recruit, onboard, and retain affiliates who actually drive revenue.', date: '2026-05-18', readTime: '8 min' },
  { tag: 'Growth', title: 'Building in Public: A Strategy, Not a Stunt', excerpt: 'How to share your journey without oversharing, and why transparency builds trust (and customers).', date: '2026-05-17', readTime: '6 min' },
  { tag: 'Growth', title: 'The State of Indie Hacker Marketing in 2026', excerpt: 'What is working on Hacker News, Reddit, and Twitter for product launches this year.', date: '2026-05-15', readTime: '7 min' },
  { tag: 'Growth', title: 'How to Create a Viral Tool That Markets Your Product', excerpt: 'Free tools, calculators, and generators that bring qualified traffic to your paid product.', date: '2026-05-14', readTime: '8 min' },
  { tag: 'Growth', title: 'Email Marketing for SaaS: Beyond the Welcome Sequence', excerpt: 'Advanced segmentation, behavioral triggers, and the campaigns that actually retain users.', date: '2026-05-12', readTime: '7 min' },
  { tag: 'Growth', title: 'The Art of the Soft Launch: Why Big Bangs Fail', excerpt: 'Why rolling releases, beta groups, and gradual scaling beat "launch day" for most products.', date: '2026-05-11', readTime: '6 min' },
  { tag: 'Growth', title: 'Referral Loops: How Dropbox, Notion, and Linear Grew', excerpt: 'The mechanics of viral growth, and how to build a referral system into your product.', date: '2026-05-10', readTime: '8 min' },
  { tag: 'Growth', title: 'SEO for SaaS: The Long-Tail Strategy That Works', excerpt: 'Why targeting "best X software" and comparison keywords beats generic SEO for B2B products.', date: '2026-05-08', readTime: '7 min' },
  { tag: 'Growth', title: 'Community-Led Growth: The Playbook for 2026', excerpt: 'Discord, Slack, Circle, or自建? How to build a community that drives product adoption.', date: '2026-05-07', readTime: '8 min' },
  { tag: 'Growth', title: 'How to Write Copy That Sells (Even If You Are Not a Writer)', excerpt: 'Frameworks, formulas, and the one question that makes every landing page better.', date: '2026-05-06', readTime: '6 min' },
  { tag: 'Growth', title: 'The Minimum Viable Marketing Stack for Indie Devs', excerpt: 'The 5 tools and 3 channels you need to get traction without a marketing team.', date: '2026-05-05', readTime: '7 min' },

  // Indie Dev (15)
  { tag: 'Indie Dev', title: 'Solo Founding: One Year of Lessons and Regrets', excerpt: 'What I wish I knew before quitting my job to build a startup. The good, the bad, and the burnout.', date: '2026-05-29', readTime: '9 min' },
  { tag: 'Indie Dev', title: 'The Bootstrapper\'s Guide to Raising Zero Dollars', excerpt: 'How to fund your startup with consulting, pre-sales, and ramen profitability.', date: '2026-05-26', readTime: '8 min' },
  { tag: 'Indie Dev', title: 'Why I Stopped Chasing VC and Started Building for Profit', excerpt: 'The mindset shift from "growth at all costs" to "sustainable business" and why it matters.', date: '2026-05-23', readTime: '7 min' },
  { tag: 'Indie Dev', title: 'Building a Micro-SaaS Empire: The Portfolio Approach', excerpt: 'Why multiple small products beat one big bet, and how to manage them all.', date: '2026-05-20', readTime: '8 min' },
  { tag: 'Indie Dev', title: 'The 4-Hour Workweek for Developers: Reality Check', excerpt: 'What automation actually looks like, and what still requires human judgment.', date: '2026-05-18', readTime: '7 min' },
  { tag: 'Indie Dev', title: 'From Employee to Founder: The Mental Shift', excerpt: 'Decision-making, risk tolerance, and the loneliness nobody warns you about.', date: '2026-05-16', readTime: '6 min' },
  { tag: 'Indie Dev', title: 'How to Validate Your SaaS Idea in One Weekend', excerpt: 'The smoke test, the fake door, and the landing page test that saved me 6 months of building.', date: '2026-05-14', readTime: '7 min' },
  { tag: 'Indie Dev', title: 'The Tech Stack That Scales from $0 to $1M ARR', excerpt: 'What to use when you are solo, what to change when you grow, and what to never compromise on.', date: '2026-05-13', readTime: '9 min' },
  { tag: 'Indie Dev', title: 'Dealing with Imposter Syndrome as a Solo Founder', excerpt: 'Why everyone feels it, how to push through it, and why it might actually help you.', date: '2026-05-11', readTime: '6 min' },
  { tag: 'Indie Dev', title: 'The Legal and Tax Basics Every Indie Dev Ignores', excerpt: 'LLC vs C-Corp, sales tax, and the compliance issues that can sink your business.', date: '2026-05-09', readTime: '8 min' },
  { tag: 'Indie Dev', title: 'How to Hire Your First Contractor Without Losing Money', excerpt: 'Finding, vetting, and managing remote contractors when you have never managed anyone before.', date: '2026-05-08', readTime: '7 min' },
  { tag: 'Indie Dev', title: 'The Emotional Rollercoaster of Running a Startup', excerpt: 'Highs, lows, and the coping mechanisms that keep you sane when revenue dips.', date: '2026-05-07', readTime: '6 min' },
  { tag: 'Indie Dev', title: 'Why Most Side Projects Never Become Businesses', excerpt: 'The traps that keep developers in "hobby mode" and how to break out of them.', date: '2026-05-06', readTime: '7 min' },
  { tag: 'Indie Dev', title: 'Building a Remote-First Company from Day One', excerpt: 'Tools, rituals, and the cultural norms that make remote work actually work.', date: '2026-05-04', readTime: '8 min' },
  { tag: 'Indie Dev', title: 'The Exit Strategy: When to Sell, Pivot, or Shut Down', excerpt: 'How to know when your startup has run its course, and how to move on gracefully.', date: '2026-05-03', readTime: '7 min' },

  // Productivity (15)
  { tag: 'Productivity', title: 'Deep Work in the Age of AI: Is Focus Still Possible?', excerpt: 'How to protect your attention when every tool is trying to distract you.', date: '2026-05-28', readTime: '6 min' },
  { tag: 'Productivity', title: 'The Developer\'s Second Brain: How I Organize Everything', excerpt: 'My note-taking, task management, and knowledge system that keeps 15 projects organized.', date: '2026-05-27', readTime: '8 min' },
  { tag: 'Productivity', title: 'Time Blocking for Creatives: A Realistic Guide', excerpt: 'Why rigid schedules fail for developers, and the flexible system that actually works.', date: '2026-05-25', readTime: '6 min' },
  { tag: 'Productivity', title: 'Automation Scripts That Save Me 10 Hours a Week', excerpt: 'The exact shell scripts, GitHub Actions, and IFTTT workflows I use daily.', date: '2026-05-23', readTime: '7 min' },
  { tag: 'Productivity', title: 'The Problem with Productivity Porn', excerpt: 'Why chasing the perfect system is a trap, and the simple habits that actually matter.', date: '2026-05-21', readTime: '5 min' },
  { tag: 'Productivity', title: 'Context Switching Is Killing Your Output. Here Is the Fix.', excerpt: 'The science of attention residue, and the batching technique that tripled my deep work hours.', date: '2026-05-19', readTime: '7 min' },
  { tag: 'Productivity', title: 'How to Run Effective 1:1s (Even If You Hate Meetings)', excerpt: 'The 15-minute format that replaces hour-long status updates.', date: '2026-05-17', readTime: '6 min' },
  { tag: 'Productivity', title: 'The Best Note-Taking Apps for Developers in 2026', excerpt: 'Obsidian, Notion, Logseq, and the one that finally stuck for me.', date: '2026-05-15', readTime: '7 min' },
  { tag: 'Productivity', title: 'Energy Management vs Time Management', excerpt: 'Why managing your energy matters more than your calendar, and how to do both.', date: '2026-05-13', readTime: '6 min' },
  { tag: 'Productivity', title: 'How to Say No Without Burning Bridges', excerpt: 'The scripts and frameworks that protect your time while maintaining relationships.', date: '2026-05-12', readTime: '5 min' },
  { tag: 'Productivity', title: 'The 5-Minute Rule for Starting Hard Tasks', excerpt: 'The psychology of procrastination, and the stupidly simple trick that beats it.', date: '2026-05-10', readTime: '5 min' },
  { tag: 'Productivity', title: 'Remote Work Burnout: Signs, Prevention, Recovery', excerpt: 'The warning signs I missed, and the boundaries that brought me back from the edge.', date: '2026-05-09', readTime: '7 min' },
  { tag: 'Productivity', title: 'How to Read Faster Without Losing Comprehension', excerpt: 'Speed reading myths debunked, and the techniques that actually work for technical content.', date: '2026-05-07', readTime: '6 min' },
  { tag: 'Productivity', title: 'The Morning Routine That Actually Works for Night Owls', excerpt: 'Why forcing early mornings backfires, and the evening routine that sets up a productive day.', date: '2026-05-06', readTime: '6 min' },
  { tag: 'Productivity', title: 'Digital Minimalism for Developers: A 30-Day Challenge', excerpt: 'What happened when I deleted half my apps, unsubscribed from 50 newsletters, and cut my screen time in half.', date: '2026-05-04', readTime: '8 min' },

  // SEO (10)
  { tag: 'SEO', title: 'Keyword Research in 2026: Beyond Search Volume', excerpt: 'Intent analysis, SERP feature targeting, and the metrics that actually predict traffic.', date: '2026-05-24', readTime: '7 min' },
  { tag: 'SEO', title: 'Technical SEO for Single-Page Applications', excerpt: 'How to make React/Next.js apps crawlable without sacrificing performance.', date: '2026-05-22', readTime: '8 min' },
  { tag: 'SEO', title: 'Content Clusters: The Strategy That Doubled Our Organic Traffic', excerpt: 'How to build topic authority with pillar pages and supporting content.', date: '2026-05-20', readTime: '7 min' },
  { tag: 'SEO', title: 'Link Building for Boring B2B Products', excerpt: 'Digital PR, guest posts, and the unconventional tactics that earn backlinks in unsexy industries.', date: '2026-05-18', readTime: '8 min' },
  { tag: 'SEO', title: 'The Future of Search: What Happens When AI Answers Everything?', excerpt: 'Zero-click searches, AI overviews, and how to stay relevant when Google changes the game.', date: '2026-05-16', readTime: '7 min' },
  { tag: 'SEO', title: 'Schema Markup That Actually Moves the Needle', excerpt: 'FAQ, HowTo, and Product schema — which ones drive clicks and which are a waste of time.', date: '2026-05-14', readTime: '6 min' },
  { tag: 'SEO', title: 'Video SEO: How to Rank on YouTube and Google', excerpt: 'The optimization tactics that work for both platforms, and why transcripts are underrated.', date: '2026-05-12', readTime: '7 min' },
  { tag: 'SEO', title: 'Local SEO for SaaS: Does It Even Matter?', excerpt: 'When to target local keywords, and when it is a distraction from your global audience.', date: '2026-05-11', readTime: '5 min' },
  { tag: 'SEO', title: 'Content Refresh: How to Update Old Posts for New Rankings', excerpt: 'The 80/20 of content updates: what to change, what to leave, and how often to do it.', date: '2026-05-09', readTime: '6 min' },
  { tag: 'SEO', title: 'Measuring Content ROI: Metrics That Matter to Your CEO', excerpt: 'How to connect SEO metrics to business outcomes and prove the value of content marketing.', date: '2026-05-08', readTime: '7 min' },

  // Development (10)
  { tag: 'Development', title: 'React Server Components: A Practical Guide', excerpt: 'When to use RSC, when to stick with client components, and the performance gains that actually matter.', date: '2026-05-29', readTime: '8 min' },
  { tag: 'Development', title: 'The State of CSS in 2026: Tailwind, Panda, and Beyond', excerpt: 'Utility-first, zero-runtime, and the new tools that are changing how we style the web.', date: '2026-05-26', readTime: '7 min' },
  { tag: 'Development', title: 'Edge Computing: When to Use It, When to Skip It', excerpt: 'Vercel, Cloudflare Workers, and the performance myths that need debunking.', date: '2026-05-24', readTime: '8 min' },
  { tag: 'Development', title: 'Database Design for Indie Devs: Start Simple, Scale Later', excerpt: 'PostgreSQL vs SQLite, when to add Redis, and the schema decisions that haunt you later.', date: '2026-05-21', readTime: '9 min' },
  { tag: 'Development', title: 'Web Performance in 2026: Core Web Vitals and Beyond', excerpt: 'LCP, INP, CLS — what to optimize, what to ignore, and the tools that help.', date: '2026-05-19', readTime: '7 min' },
  { tag: 'Development', title: 'Monorepos in 2026: Turborepo, Nx, or Just pnpm?', excerpt: 'The state of JavaScript monorepos, and when a monorepo is overkill for your project.', date: '2026-05-17', readTime: '7 min' },
  { tag: 'Development', title: 'Authentication Without the Pain: OAuth, Passkeys, and Magic Links', excerpt: 'The modern auth stack that balances security and user experience.', date: '2026-05-15', readTime: '8 min' },
  { tag: 'Development', title: 'Testing Strategies for Small Teams', excerpt: 'Unit, integration, e2e — what to test, what to skip, and how much coverage is enough.', date: '2026-05-13', readTime: '7 min' },
  { tag: 'Development', title: 'The Rise of Local-First Apps: Sync Without the Cloud', excerpt: 'CRDTs, SQLite on the client, and the offline-first architecture that actually works.', date: '2026-05-11', readTime: '8 min' },
  { tag: 'Development', title: 'API Design for Humans: REST, GraphQL, or tRPC?', excerpt: 'The trade-offs that matter for developer experience, and when to break the rules.', date: '2026-05-10', readTime: '7 min' },
];

/* ── Helpers ── */
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
}

function getUnsplashUrl(tag, index) {
  const presets = UNSPLASH_PRESETS[tag] || UNSPLASH_PRESETS['AI Tools'];
  const photoId = presets[index % presets.length];
  return `https://images.unsplash.com/${photoId}?w=600&q=80`;
}

function pickToolCTA(tag) {
  const tools = TAG_TOOLS[tag] || TAG_TOOLS['AI Tools'];
  const tool = tools[Math.floor(Math.random() * tools.length)];
  return `<div class="tool-cta">
<strong>Try this yourself:</strong> The <a href="/tools/${tool.slug}">${tool.anchor}</a> helps with ${tool.context}. Perfect for applying what you just read.
</div>`;
}

/* ── LLM Config ── */
function getLlmConfig() {
  if (process.env.KIMI_API_KEY) {
    return {
      key: process.env.KIMI_API_KEY,
      url: 'https://api.moonshot.cn/v1/chat/completions',
      model: 'moonshot-v1-8k',
    };
  }
  if (process.env.DEEPSEEK_API_KEY) {
    return {
      key: process.env.DEEPSEEK_API_KEY,
      url: 'https://api.deepseek.com/v1/chat/completions',
      model: 'deepseek-chat',
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      key: process.env.OPENAI_API_KEY,
      url: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-3.5-turbo',
    };
  }
  return null;
}

/* ── LLM prompt based on DE-AI-GUIDE.md ── */
function buildLlmPrompt(topic) {
  const system = `You are an experienced indie developer and writer with 5 years of hands-on experience.
Your writing style is conversational, personal, and authentic — like talking to a friend over coffee.

CRITICAL RULES (violate any and you fail):
1. Use first person "I", never "we" or "our team"
2. Start with a specific personal scene — a failure, surprise, or moment of realization (with time/place/number)
3. Include 1-2 inner monologues: "I thought...", "My gut said..."
4. Admit at least 1 mistake or uncertainty
5. Use 2+ rhetorical questions
6. Add 1 irrelevant but vivid detail (weather, what you were wearing, background noise)
7. End with a specific actionable tip + self-deprecating humor or rhetorical question
8. NEVER use: delve, leverage, navigate, robust, streamline, harness, paradigm, "in the ever-evolving landscape", "it is important to note", "in conclusion", "as we can see"
9. NEVER summarize at the end
10. Write 800-1200 words
11. Output valid HTML: <p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote> only
12. NO markdown, NO code blocks around HTML`;

  const user = `Write a blog post about: "${topic.title}"

Context: ${topic.excerpt}
Category: ${topic.tag}

Output the full article body as HTML (without <html> or <body> tags — just the content elements).
Include these sections naturally:
- An opening personal scene
- 2-3 main sections with h2 headings
- A highlight-box div with a key insight
- A tool-cta div mentioning an AIHues tool
- An ending with actionable advice

Format the highlight-box like:
<div class="highlight-box"><h4>Title</h4><p>Content</p></div>

Format the tool-cta like:
<div class="tool-cta"><strong>Try this:</strong> The <a href="/tools/TOOL-SLUG">Tool Name</a> helps with CONTEXT.</div>`;

  return { system, user };
}

async function callLlm(prompt) {
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
        messages: [
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.user },
        ],
        temperature: 0.85,
        max_tokens: 2500,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn(`  LLM API error: ${res.status} ${err}`);
      return null;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.warn(`  LLM call failed: ${err.message}`);
    return null;
  }
}

/* ── Template-based body generator (fallback / no-API mode) ── */
function generateTemplateBody(topic, toolCta) {
  const { title, tag, excerpt } = topic;
  const keyword = title.split(':')[0].toLowerCase().replace(/^(the |a |how to |why |what )/i, '');

  // Opening paragraphs with personal touch
  const openings = [
    `<p>I still remember the exact moment I realized I had been doing ${keyword} all wrong. It was a Tuesday evening in November. I was on my third cup of coffee, staring at a screen full of numbers that made no sense, when a friend sent me a message that changed everything.</p>`,
    `<p>Last year, I spent six months and roughly $2,400 trying to figure out ${keyword}. I read every guide, watched every tutorial, and followed every "expert" on Twitter. Most of it was useless. But three things actually worked — and they were not what I expected.</p>`,
    `<p>"You are overthinking it." That is what my mentor said when I showed him my ${keyword} setup. I had spent three weeks building a system that was so complex it needed its own documentation. He looked at it for 30 seconds and suggested I delete 80% of it. He was right.</p>`,
  ];

  const opening = openings[Math.floor(Math.random() * openings.length)];

  const bodies = [
    // Body type 1: Problem → Discovery → Solution
    `<h2>The Problem I Could Not Solve</h2>
<p>For months, ${keyword} felt like a black box. I would try an approach that worked for someone else, and it would fail for me. I would copy a template, and the results would be mediocre. The advice was always "just do X" — but X never worked in my specific situation.</p>
<p>Here is what I eventually figured out: the people giving advice were operating under different constraints. They had bigger teams, bigger budgets, or different audiences. Their solutions were optimized for their problems, not mine.</p>

<h2>The Discovery That Changed Everything</h2>
<p>The breakthrough came when I stopped looking for best practices and started tracking my own data. I created a simple spreadsheet with three columns: what I tried, what happened, and what I would do differently. After 20 entries, patterns emerged that no blog post had ever mentioned.</p>
<div class="highlight-box"><h4>The Pattern</h4><p>The approaches that worked shared one trait: they were adapted to my specific constraints, not copied from someone else's playbook. Customization beats best practices every time.</p></div>

<h2>What I Do Now</h2>
<p>Instead of chasing the latest framework, I run small experiments. One week. One metric. One change. If it works, I double down. If it does not, I scrap it and try something else. This iterative approach has delivered better results than any "proven system" I have ever tried.</p>
<p>My current setup is embarrassingly simple compared to what I had before. But simple means maintainable. Maintainable means consistent. And consistent is what actually drives results.</p>`,

    // Body type 2: Story → Lessons → Application
    `<h2>What the Data Actually Showed</h2>
<p>I tracked everything for 30 days. Every decision, every outcome, every surprise. The data told a story that contradicted almost everything I had read online. The tactics that were supposed to work flopped. The approaches I discovered by accident outperformed everything else.</p>
<p>Here are the three biggest surprises:</p>
<ul>
<li><strong>Speed matters more than perfection.</strong> My rough, fast experiments consistently outperformed my carefully planned campaigns. The difference was 3x in some cases.</li>
<li><strong>Context beats best practices.</strong> The "right" approach changed based on my audience size, my product type, and even the time of year. Universal advice is universally wrong somewhere.</li>
<li><strong>Tools are overrated.</strong> I got better results with basic free tools and a disciplined process than with expensive software and ad-hoc workflows.</li>
</ul>

<div class="highlight-box"><h4>Key Insight</h4><p>The top performers in ${keyword} are not using secret techniques. They are using simple techniques consistently, and they are measuring what actually matters instead of what looks impressive.</p></div>

<h2>Your Next Step</h2>
<p>Do not try to implement everything at once. Pick one idea from this article. Apply it this week. Track the result. That single loop — try, measure, adjust — is more valuable than any amount of reading.</p>`,

    // Body type 3: Framework → Examples → Action
    `<h2>A Framework That Actually Works</h2>
<p>After two years of trial and error, I have settled on a simple framework for ${keyword}. It is not revolutionary. It is not trendy. But it works for me, and it might work for you too.</p>

<h3>Step 1: Start with the Outcome</h3>
<p>Before doing anything, write down the one result you want. Not ten. One. "Increase signups by 20%" is specific. "Grow the business" is not. Specificity forces focus.</p>

<h3>Step 2: Find the Bottleneck</h3>
<p>Where is ${keyword} actually breaking down for you? Is it awareness? Conversion? Retention? Most people optimize the wrong stage. I spent months improving my landing page when my actual problem was that no one was visiting it.</p>

<h3>Step 3: Make One Change</h3>
<p>Change one thing. Run it for two weeks. Compare before and after. If it helps, keep it. If not, revert and try something else. The goal is progress, not perfection.</p>

${toolCta}

<h2>Common Mistakes I Made</h2>
<p>Here is where I wasted the most time:</p>
<ol>
<li><strong>Over-optimizing too early.</strong> I spent weeks perfecting a system that had no users yet. Premature optimization is not just a coding problem.</li>
<li><strong>Ignoring the data I had.</strong> I collected metrics but rarely looked at them. The answers were already there; I just was not paying attention.</li>
<li><strong>Chasing trends.</strong> Every new tool or technique seemed worth trying. Most of them added complexity without adding value.</li>
</ol>`,
  ];

  const body = bodies[Math.floor(Math.random() * bodies.length)];

  const closings = [
    `<p><em>What is your experience with ${keyword}? I am genuinely curious — my approach is just one of many, and I have learned the most from people who do it completely differently. Drop a comment or reach out on Twitter.</em></p>`,
    `<p><em>Pick one thing from this article and try it this week. Not next week. This week. The best advice is worthless until you test it. And when you do, let me know how it goes — I read every reply.</em></p>`,
    `<p><em>Honestly, I am still figuring this out. The approach I described works today, but it might not work in six months. If you have found something better, tell me. I am always looking for the next thing that makes me rethink everything.</em></p>`,
  ];
  const closing = closings[Math.floor(Math.random() * closings.length)];

  return `${opening}\n${body}\n${closing}`;
}

/* ── Generate description from content ── */
function generateDescription(excerpt) {
  // Add a personal hook to the excerpt
  const hooks = [
    `I learned this the hard way. `,
    `After 18 months of trial and error, here is what actually works. `,
    `This is not the advice you will find in most guides. `,
    `I made every mistake so you do not have to. `,
    `What they do not tell you about ${excerpt.toLowerCase().replace(/\.$/, '')}. `,
  ];
  const hook = hooks[Math.floor(Math.random() * hooks.length)];
  return hook + excerpt;
}

/* ── HTML shell ── */
function generateHTML(topic, slug, bodyContent) {
  const { title, tag, date, readTime, excerpt } = topic;
  const desc = generateDescription(excerpt);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title.replace(/"/g, '&quot;')} | AIHues</title>
  <meta name="description" content="${desc.replace(/"/g, '&quot;')}" />
  <style>
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
    :root{--bg:#faf9f6;--surface:#ffffff;--surface-hover:#f5f0e8;--border:#e8e2d9;--border-hover:#d4c8b8;--text:#1c1917;--text-secondary:#78716c;--text-muted:#a8a29e;--accent:#b45309;--accent-light:#d97706;--radius:14px;--radius-sm:10px;--shadow:0 1px 3px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.04);--shadow-lg:0 8px 32px rgba(180,83,9,0.18);}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--text);line-height:1.7;font-size:16px;}
    .article-header{text-align:center;padding:60px 20px 40px;max-width:800px;margin:0 auto;}
    .article-tag{display:inline-block;background:rgba(180,83,9,0.08);color:var(--accent);padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;margin-bottom:16px;}
    .article-header h1{font-size:36px;font-weight:800;line-height:1.15;letter-spacing:-0.5px;margin-bottom:16px;}
    .article-meta{color:var(--text-muted);font-size:14px;display:flex;justify-content:center;gap:16px;}
    .article-content{max-width:680px;margin:0 auto;padding:0 20px 80px;}
    .article-content p{margin-bottom:20px;color:var(--text-secondary);}
    .article-content h2{font-size:24px;font-weight:700;margin:40px 0 16px;color:var(--text);}
    .article-content h3{font-size:20px;font-weight:600;margin:32px 0 12px;color:var(--text);}
    .article-content ul,.article-content ol{margin:0 0 20px 24px;color:var(--text-secondary);}
    .article-content li{margin-bottom:8px;}
    .article-content blockquote{border-left:3px solid var(--accent);padding-left:20px;margin:24px 0;font-style:italic;color:var(--text-secondary);}
    .article-content a{color:var(--accent);text-decoration:none;}
    .article-content a:hover{text-decoration:underline;}
    .article-content img{max-width:100%;border-radius:var(--radius-sm);margin:24px 0;}
    .article-content code{background:var(--surface-hover);padding:2px 8px;border-radius:6px;font-size:14px;font-family:monospace;}
    .article-content pre{background:#1c1917;color:#f5f0e8;padding:20px;border-radius:var(--radius-sm);overflow-x:auto;margin:24px 0;font-size:14px;line-height:1.6;}
    .highlight-box{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin:24px 0;}
    .highlight-box h4{font-size:16px;font-weight:700;margin-bottom:12px;color:var(--accent);}
    .tool-cta{background:rgba(180,83,9,0.04);border:1px dashed var(--border-hover);border-radius:var(--radius-sm);padding:16px 20px;margin:24px 0;font-size:14px;color:var(--text-secondary);}
    .tool-cta strong{color:var(--accent);}
    @media (max-width:640px){.article-header h1{font-size:28px;}.article-content{padding:0 16px 60px;}}
  </style>
</head>
<body>
  <article>
    <div class="article-header">
      <span class="article-tag">${tag}</span>
      <h1>${title}</h1>
      <div class="article-meta">
        <span>${date}</span>
        <span>${readTime} read</span>
        <span>AIHues Team</span>
      </div>
    </div>
    <div class="article-content">
      <p><strong>${excerpt}</strong></p>
${bodyContent}
    </div>
  </article>
</body>
</html>`;
}

/* ── Main ── */
async function main() {
  console.log('🚀 AIHues Blog Generator v3');
  console.log(`   Mode: ${MODE}`);
  console.log(`   Limit: ${LIMIT === Infinity ? 'all' : LIMIT}`);
  console.log(`   Dry run: ${DRY_RUN}`);
  console.log();

  const llmConfig = getLlmConfig();
  if (MODE === 'llm' && !llmConfig) {
    console.error('❌ LLM mode requested but no API key found.');
    console.error('   Set KIMI_API_KEY, DEEPSEEK_API_KEY, or OPENAI_API_KEY');
    console.error('   Falling back to template mode...\n');
  }
  const actualMode = MODE === 'llm' && llmConfig ? 'llm' : 'template';

  if (DRY_RUN) {
    console.log('📋 DRY RUN — no files will be written\n');
  }

  // Read existing posts
  let existingPosts = [];
  try {
    existingPosts = JSON.parse(fs.readFileSync(POSTS_JSON, 'utf-8'));
  } catch {
    console.log('   No existing posts.json found, starting fresh');
  }

  const existingSlugs = new Set(existingPosts.map((p) => p.slug));
  const topicSlugs = new Set(TOPICS.map((t) => slugify(t.title)));

  // Preserve posts that are NOT in our TOPICS list (manually written ones)
  const preserved = existingPosts.filter((p) => !topicSlugs.has(p.slug));
  const posts = [...preserved];
  let created = 0;
  let skipped = 0;

  const topicsToProcess = TOPICS.slice(0, LIMIT);

  for (let i = 0; i < topicsToProcess.length; i++) {
    const topic = topicsToProcess[i];
    const slug = slugify(topic.title);
    const progress = `[${i + 1}/${topicsToProcess.length}]`;

    // Skip if already exists with description (v3 quality marker)
    const existing = existingPosts.find((p) => p.slug === slug);
    if (existing?.description && existing.coverImage?.includes('unsplash.com')) {
      console.log(`${progress} ⏭️  ${slug} (already v3)`);
      posts.push(existing);
      skipped++;
      continue;
    }

    console.log(`${progress} 📝 ${slug} (${topic.tag})`);

    let bodyContent;

    if (actualMode === 'llm') {
      const prompt = buildLlmPrompt(topic);
      const llmBody = await callLlm(prompt);
      if (llmBody) {
        bodyContent = llmBody;
        console.log(`   ✅ LLM generated (${llmBody.length} chars)`);
      } else {
        console.log(`   ⚠️  LLM failed, falling back to template`);
        bodyContent = generateTemplateBody(topic, pickToolCTA(topic.tag));
      }
    } else {
      bodyContent = generateTemplateBody(topic, pickToolCTA(topic.tag));
      console.log(`   ✅ Template generated`);
    }

    const html = generateHTML(topic, slug, bodyContent);
    const coverImage = getUnsplashUrl(topic.tag, i);
    const description = generateDescription(topic.excerpt);

    if (!DRY_RUN) {
      fs.writeFileSync(path.join(BLOG_DIR, `${slug}.html`), html, 'utf-8');
    }

    posts.push({
      slug,
      tag: topic.tag,
      title: topic.title,
      excerpt: topic.excerpt,
      date: topic.date,
      readTime: topic.readTime,
      coverImage,
      description,
    });
    created++;

    // Rate limit for LLM mode
    if (actualMode === 'llm' && i < topicsToProcess.length - 1) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  // Sort by date desc
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!DRY_RUN) {
    fs.writeFileSync(POSTS_JSON, JSON.stringify(posts, null, 2), 'utf-8');
  }

  console.log();
  console.log('✅ Done!');
  console.log(`   Created: ${created}`);
  console.log(`   Skipped (already v3): ${skipped}`);
  console.log(`   Preserved (manual): ${preserved.length}`);
  console.log(`   Total: ${posts.length}`);
  if (DRY_RUN) {
    console.log('   (DRY RUN — no files written)');
  } else {
    console.log(`   📁 HTML: ${BLOG_DIR}`);
    console.log(`   📊 JSON: ${POSTS_JSON}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
