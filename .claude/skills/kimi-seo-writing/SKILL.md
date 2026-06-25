---
name: Kimi-SEO-Writing
description: End-to-end SEO article writing workflow for Kimi Resources. Use when user says "写XX关键词组的文章" or asks to write a Resources article. Handles keyword lookup, SERP research (Top15), competitor analysis, published article style learning, outline creation, full article writing with strict anti-AI writing rules, and keyword deployment tracking. Outputs to Feishu docs.
---

# Kimi SEO Writing Skill

End-to-end workflow for creating SEO-optimized articles for Kimi Resources (`https://www.kimi.com/resources/`).

## When to Use

- User says "写XX关键词组的文章" or "write an article for [keyword group]"
- User mentions SEO content, Resources article, or Kimi blog
- User provides a keyword group name to target

## Workflow Overview

```
关键词组名 → 查词库拉词 → SERP相似度验证 → SERP调研Top15 → 竞品分析 → 学习已上线文章 → 写大纲 → 用户审核 → 写正文 → 内部审稿(Writer→Reviewer循环) → 关键词统计 → 交稿
```

---

## Phase 1: Keyword Lookup

### 1.1 Connect to Keyword Database

Keyword database location (Bitable): check `references/keyword-database-url.md` for the current URL.

If Bitable is not accessible, check `references/keyword-groups.md` for a local copy.

### 1.2 Extract Keywords

From the user-specified keyword group, extract:
- All keywords in the group
- Search volume for each keyword
- Identify the main keyword (highest search volume or most relevant)

**Important rules:**
- Only deploy/highlight keywords from the specified group
- Other keywords (e.g., "Kimi Claw", "openclaw cloud") can appear naturally but must NOT be highlighted or counted as deployed keywords

---

## Phase 1.5: SERP Similarity Validation

Before writing, validate that all keywords in the group actually share the same search intent. Use the `serp-similarity` skill/script if available, or manually check.

### Why This Step Matters

Not all keywords in a group belong in one article. Keywords may have:
- **Different SERP landscapes** — One keyword returns tutorials, another returns security news
- **Different intent types** — "openclaw macos" (how-to) vs "openclaw desktop app" (navigational)
- **SERP contamination** — Dominated by official pages, security articles, or forum complaints

### How to Validate

Run the SERP similarity script (if available in `tools/serp-similarity/`):
```bash
python3 scripts/serp_similarity.py "kw1" "kw2" "kw3"
```

Or manually: SERP-search 3-5 keywords from the group and compare the top 10 URLs.

### Decision Rules

| Avg Jaccard Similarity | Action |
|------------------------|--------|
| ≥ 20% with consistent intent | ✅ Proceed — keywords fit one article |
| 10-20% mixed intent | ⚠️ Split into sub-groups, or deploy low-overlap keywords only in body text (not H1/H2) |
| < 10% or navigational/contaminated SERP | ❌ Remove from this article's target keywords |

### Keyword Role Assignment (from validation)

Based on SERP overlap analysis, assign roles before writing:

| Role | Criteria | Where to Deploy |
|------|----------|----------------|
| **Main keyword** | Highest volume + highest avg overlap with group | H1, Meta Title, URL, first paragraph |
| **H2 keywords** | Sub-cluster hub words | H2 headings |
| **Body keywords** | Lower volume variants with consistent intent | Body text, natural distribution |
| **FAQ keywords** | Long-tail, question-format | FAQ section |
| **Skip** | Navigational intent, SERP contaminated, or exact duplicates (≥80% overlap = same query, keep higher volume one) | Don't actively deploy |

### What to Report

After validation, note in the outline:
- Which keywords are confirmed for deployment
- Which keywords are skipped and why
- Any sub-clusters identified (these often map to H2 sections)

---

## Phase 2: SERP Research

### 2.1 SERP API

```bash
curl --location 'https://nlp.mse.msh.work/serp/run' \
--header 'Content-Type: application/json' \
--data '{
    "query": "YOUR_KEYWORD",
    "skip_cache": true,
    "engine": "mazhu_google_i18n_for_seo"
}'
```

- English keywords: `mazhu_google_i18n_for_seo`
- Chinese keywords: `mazhu_google_cn_for_seo`

### 2.2 Research Strategy

Run 3-5 SERP queries using different keywords from the group. For each query:
- Collect Top 15 organic results (exclude Sponsored)
- Note title patterns, word count, structure
- Identify People Also Ask questions (important for FAQ section)

### 2.3 Competitor Analysis

For the top 5-8 competitor pages, use `web_fetch` to read and analyze:
- Article structure and heading hierarchy
- Content depth and unique angles
- What users care about (pain points addressed)
- Writing style and tone
- Gaps we can fill

---

## Phase 3: Learn from Published Articles

### 3.1 Kimi Resources Library

Always fetch and study the latest published articles from: `https://www.kimi.com/resources/`

Key reference articles:
- https://www.kimi.com/resources/best-free-ai-tools-for-excel
- https://www.kimi.com/resources/kimi-claw-introduction

Use `web_fetch` to read 3-5 recent articles. Pay attention to:
- Opening paragraph style (short, under 100 words)
- Banner and Meta description writing patterns
- CTA placement and wording
- Conclusion structure (Value Summary → CTA, no problem rehash)
- Overall tone and voice

### 3.2 Style References

Also read the style analysis at `style-analysis.md` and keyword deployment analysis at `keyword-deployment-analysis.md` in this skill's directory.

### 3.3 Article Types & Writing Strategies

| Type | Structure | Kimi Product Position |
|------|-----------|----------------------|
| **Best X** | Criteria → Comparison table → Reviews → Conclusion | Kimi #1, compelling value props vs competitors |
| **How to X** | Overview → Methods compared → Steps → Conclusion | Last method (reduce bounce), teased early |
| **Feature-specific** | Align with top-ranking SERP pages, integrate Kimi naturally | |
| **Free-focused** | Disclose free limits upfront in Hero, use general terms in body | |
| **Competitor + Alternative** | Brief intro → immediately list alternatives (Kimi first) | |
| **Pure Competitor** | 75-80% competitor overview → 20% Kimi intro at end | |
| **Competitor + Feature** | 50% competitor solution → 50% Kimi (intro + steps + extra value) | |

---

## Phase 4: Write Outline

### 4.1 Outline Structure

Create a markdown outline with:
- Proposed H1 (with main keyword, ≤65 chars)
- Proposed URL slug
- All H2/H3 headings with keyword deployment notes
- Content summary for each section
- CTA placement markers
- Image placement markers

### 4.2 Required Article Structure

```
Hero Banner (with CTA)
Introduction (under 100 words)
Body Sections (Part 1 to Part X, with CTAs where appropriate)
Conclusion (with CTA)
FAQ Section
```

### 4.3 Outline FAQ — Must Be Research-Based

**大纲阶段就要完成 FAQ 调研，不能留空或自己编。** 大纲交出去应该是可执行的。

FAQ 在大纲中使用以下表格格式：

```markdown
### FAQ (X Questions) — 基于调研

**调研来源：**
- [列出所有调研来源，包括 URL 或文章名]

**真实高频问题：**
1. [问题1（来源）]
2. [问题2（来源）]
...

| # | Question | 部署关键词 | 调研来源 | 回答要点 |
|---|---|---|---|---|
| 1 | ... | ... | ... | ... |
```

**要求：**
- 每个 FAQ 必须标注调研来源（哪篇文章/哪个网站/哪个社区帖子）
- 问题必须是用户真实在搜索/讨论的，不能凭空编造
- 回答要点要跟 Kimi 产品挂钩（能自然引出 Kimi Claw 或 Kimi API 的优先）
- 不讨论跟 Kimi 产品无关的话题（如硬件兼容性评测）

### 4.4 Output

Write outline to a Feishu document (use `feishu_doc` tool) and share with user for review.

**Wait for user approval before proceeding to Phase 5.**

---

## Phase 5: Write Full Article

### 5.1 Deliverables & Quality Standards

- Deliver via Feishu (Lark) document
- Include Keyword Deployment Summary at the beginning
- **Formatting**: H1 & Meta Title = Title Case; H2/H3/H4 and all other content = Sentence case (only capitalize the first word)
- **No `==` highlight markers** in output. Feishu/Lark documents cannot render them. Keywords are tracked in the Deployment Statistics table, not highlighted inline.
- Must pass grammar check (Grammarly)
- Must be ≥95% original (Grammarly plagiarism check)
- AI probability score must be <30% (GPTZero)

### 5.2 SEO Information Header

Every article must start with an SEO info table:

```markdown
| Information | | |
|---|---|---|
| **URL** | /resources/xxx-xxx | |
| **SEO title** | Title here | XX chars |
| **Meta description** | Description here | XX chars |
| **H1** | H1 heading here | XX chars |
| **Main keyword** | keyword here | |
| **Secondary keywords** | kw1, kw2, kw3... | |
| **Banner** | Banner text here | XX chars |
```

**SEO title (Meta Title) rules:**
- **≤60 characters** (strict limit, Google truncates beyond this)
- Must contain main keyword
- Must be **different from H1** (H1 and Meta Title must be unique)
- Title Case

**H1 rules:**
- **≤65 characters**
- Must contain main keyword
- Must be different from Meta Title
- Title Case

**Meta description rules:**
- **140-160 characters** (strict limit)
- Structure: 铺垫 → 衔接 → 号召 (calling effect)
- Contains main keyword
- **Logical consistency**: Features and benefits must not be interleaved. Group features together and benefits together within parallel structures.
  - ❌ "Automate formulas, boost productivity, analyze data, and save hours"
  - ✅ "Automate formulas and analyze data to boost productivity and save hours"

**Banner (Hero Banner) rules:**
- 170-280 chars
- Must include: high-level page summary + Kimi's value proposition in this context
- Benefit framing must adapt to article theme — natural transition from topic to product
- Declarative sentences only (no questions)
- Must NOT repeat Meta description content
- **Do NOT end with "Try it now!"** (the Hero has a CTA button that already says this)
- Calling must be naturally embedded, not standalone

### 5.3 Writing Rules (CRITICAL)

These rules are non-negotiable. Violating them produces AI-sounding content.

#### Technical Accuracy (HIGHEST PRIORITY)
We publish as Kimi's official voice. Every technical claim must be verifiable.

**⛔ ABSOLUTE RULE: DO NOT FABRICATE INFORMATION.**
Every single claim in the article — numbers, features, descriptions, comparisons, pros, cons — must have a verifiable source. If you cannot find a source, DO NOT WRITE IT. No exceptions.

- **Zero tolerance for fabrication**: Do not invent statistics, feature counts, line counts, adapter counts, team backgrounds, performance benchmarks, or any other factual claims. If it's not from a verifiable source, it does not go in the article.
- **Reasonable inference is allowed**, but must be clearly grounded. Example: "Nanobot is Python-based" (from README showing `pip install`) is a valid inference. "Nanobot only has 2 messaging integrations" (when you haven't checked) is fabrication.
- **Source authority hierarchy** (when sources conflict, higher rank wins):
  1. **Product official website** (most authoritative)
  2. **GitHub README** (officially maintained)
  3. **Official blog / documentation**
  4. **Third-party authoritative reviews** (e.g., Hacker News, major tech publications)
  5. **GitHub API data** (reference only, never use to override higher-ranked sources)
- **Commands and code**: Before including any command, verify it works by checking official documentation (`docs.openclaw.ai`, `github.com/openclaw/openclaw`, `nodejs.org`, etc.). If you cannot verify, flag it to the user.
- **Steps and procedures**: Each step must reflect the actual product behavior. Do not invent onboarding screens, CLI flags, or config options. If unsure whether a flag exists (e.g., `--install-daemon`), check the docs or note it as "verify before publish".
- **Concept explanations**: Technical concepts (systemd, Homebrew, WSL2, cron, heartbeat) must be accurate. Do not simplify to the point of being wrong.
- **Version numbers and requirements**: Always verify minimum versions (Node.js 22+, macOS 11+, etc.) against official docs. These change with releases.
- **Error messages and fixes**: Only include error messages that users actually encounter (from SERP research, GitHub issues, Reddit, community forums). Do not fabricate error scenarios.
- **URLs and links**: Every URL must be live and point to the correct destination. Do not guess URLs.
- **Product descriptions**: When describing third-party products, use their own official language (website > README > blog). Do not paraphrase in ways that add claims not present in the source.
- **Considerations/drawbacks**: Must be based on verifiable facts from official sources (e.g., "supports X platforms" from README, "requires Y" from install docs). Do not invent drawbacks based on what the README does NOT mention. Absence of a feature mention ≠ confirmed limitation unless the official comparison table explicitly shows it missing.
- **When in doubt**: Mark with `[VERIFY]` tag in the draft. Better to flag uncertainty than publish something wrong.

#### Sentence Structure
- **Use short sentences.** One idea per sentence.
- **Do NOT use em dashes (—).** They scream AI. Use commas, periods, or colons instead.
- **Do NOT use parentheses** to hide information. Weave it into the sentence naturally.
- **Do NOT start consecutive sentences with the same word** (especially "If", "This", "It").

#### Content Logic & Parallel Structure
- **Dimensional consistency**: When listing items in parallel, keep them in the same dimension. Don't mix features with benefits in a single list.
  - ❌ "GPS navigation, ensuring safety, music playback, fatigue-free journey" (mixed)
  - ✅ "GPS navigation and music playback to ensure safety and a fatigue-free journey" (partitioned)
- **Grammatical alignment**: All items in a list must follow the same grammatical pattern.
  - ❌ "Formula generation, pivot tables, chart creation" (pivot tables breaks the pattern)
  - ✅ "Formula generation, pivot table building, chart creation"

#### Lists and Bullets
- **Only use bullet lists for:** step instructions, feature lists, system requirements.
- **Do NOT use bullet lists in:** intro paragraphs, conclusions, transition sections, explanatory paragraphs.
- Text that reads like a list of standalone sentences = AI flavor. Write connected paragraphs instead.

#### Inline Code Formatting
- **Use inline code (`backticks`) for**: command names, file paths, port numbers, config keys, error messages, package names, CLI flags, environment variables, code snippets in prose
  - ✅ `openclaw gateway status`, `brew install openclaw`, `127.0.0.1:18789`, `SOUL.md`, `npm install -g openclaw@latest`, `--install-daemon`
  - ❌ Writing these as plain text without backticks — they look unprofessional and are harder to scan
- **Do NOT use inline code for**: product names (OpenClaw, Kimi Claw), general concepts (AI agent, LLM), section titles, or marketing copy
- **Judgment call**: If a reader might need to copy-paste it into a terminal, config file, or search box, it should be in inline code.

#### Links & Internal Linking
- **Do NOT embed hyperlinks randomly in body text.**
- CTA buttons are the primary link mechanism.
- **Internal links**: 2-5 per article as content library grows. Vary targets, don't repeatedly link to same pages.
- **Do NOT place internal links in Hero Banner or Introduction.** These sections focus on motivation.
- Anchor text must be relevant to the target page (not generic "click here").
- Consistent mapping: same keyword → same target URL across articles.

#### Competitor Mentions & Product Recommendations
- **Do NOT give competitors positive labels** like "fastest", "easiest", "best", "simplest".
- **Do NOT use "compare", "best", "vs", "better", "superior", "top" or similar comparative/superlative words** in article body text, headings, or Meta fields. These create legal and PR risk. Exception: Alt text for images may use these words for SEO purposes.
- Use neutral descriptions only. Save positive adjectives for Kimi products.
- **ONLY recommend Kimi products** when suggesting LLM providers, APIs, or tools. Do not suggest OpenAI, Anthropic, Gemini as equally good alternatives.
- **Non-Kimi methods (PowerShell, WSL, etc.) are also "competitors".** Use neutral language.
- When user needs an API key, provide brief instructions for getting a Kimi API key. Reference: https://platform.moonshot.ai/blog/posts/what-is-openclaw
- **Avoid definitive statements about non-Kimi entities**: Don't say "As the world's most popular desktop OS" — we are not a review site, we represent Kimi. Use neutral, factual statements.

#### Kimi Product Positioning
- **Kimi Claw is a SaaS product, NOT "cloud deployment"**. Users don't deploy anything. Moonshot AI hosts and manages their OpenClaw on cloud servers.
  - ❌ "Kimi Claw deploys OpenClaw in the cloud"
  - ✅ "Kimi Claw is a fully managed platform that runs OpenClaw for you"
- **Always state the core user benefit** — not just features or time saved.
  - ❌ "Kimi Claw deploys in under two minutes"
  - ✅ "Kimi Claw runs OpenClaw for you — no terminal, no code, no manual configuration"
- **In comparison tables**: The table must clearly show Kimi Claw's advantage. Generic metrics like "setup time" don't differentiate enough. Focus on what the user has to DO (or doesn't have to do).
  - ❌ "Setup time: ~2 minutes" (doesn't feel different from 5 minutes)
  - ✅ "Manual steps: None — fully automated" vs "7+ commands" vs "12+ commands"

#### Sensitive Information (pricing, membership tiers, limitations)
- **Free-focused articles**: Disclose free usage limits upfront in Hero section. In body text, use general terms ("free tier", "limited free access") without repeating exact numbers.
- Never call out restrictions in a standalone sentence or note.
- Weave them naturally into existing sentences (e.g., "Log in with your Kimi Allegretto account").

#### Steps
- **Flatten all steps.** Each H3 = one action. Never nest steps inside steps.
- Keep step descriptions concise (1-2 sentences + code block if needed).
- Use imperative verb form consistently: "Input", "Select", "Download" (not "Inputting" or "You should input").
- **For Kimi Claw sections**: Put action steps BEFORE "Why choose" features. Users want to see how to use it first.

#### Intro Paragraph
- **Under 100 words.** This is a hard limit from SOP.
- Two patterns:
  - **Pattern A (Empathy)**: Problem → Solution. For how-to/tool articles.
  - **Pattern B (Direct-Entry)**: Definition → Core Value → Hook. For definition/trend articles.
  - **Pattern C (Skip)**: If Part 1 covers definition, omit separate intro entirely.
- Do NOT pad with hype ("taking the world by storm") or cite GitHub stats.
- Do NOT make definitive claims about external products/entities.

#### Conclusion
- **One paragraph.** No bullet points, no sub-lists.
- Structure: **Value Summary → CTA**. Reinforce how the solutions serve the user's needs, then encourage action.
- **Opening sentence subject = the product or user action, NOT the article.** Never start with "This guide covered...", "In this article we explored...", "This post walked through...". The conclusion is about what the reader can now DO, not what the article did.
  - ❌ "This guide covered three ways to install OpenClaw on Mac."
  - ✅ "The OpenClaw Mac app runs locally through the one-line installer or Homebrew, and remotely through Kimi Claw."
- **Kimi Claw mention = 1 sentence max.** Do not list features (5,000+ skills, 40GB, memory, etc.) in the conclusion. Those belong in the body. Conclusion keeps it light: "fully managed setup", "no Terminal required", "runs 24/7".
- Do NOT rehash the problem statement from the intro.
- Do NOT give competitors praise.
- Do NOT use heavy marketing language ("Give it a try and see!"). Match the tone of published Kimi Resources articles.
- Reference published examples for tone: https://www.kimi.com/resources/kimi-claw-introduction

#### Section Transitions
- When switching topics between sections, write 1-2 transitional sentences.
- **"Unlike" is not a good transition** when switching from cloud to local topics. It implies the article only covered cloud before.
- Good transitions reference what came before AND why the new section matters to the reader.
  - ❌ "Unlike cloud deployment, running OpenClaw locally means..."
  - ✅ "If you chose Method 1 or Method 2 for a local installation, a few security settings are worth configuring before you start."

#### Heading Hierarchy
- H tags must form a logical hierarchy. An H3 cannot logically outrank its parent H2.
- Verify that sub-topics are placed under the correct parent heading.

### 5.4 Keyword Deployment

**Primary keyword**: density 0.5%-1%, minimum 5 occurrences. Must appear in H1 and Meta Title.

**Strategic distribution**: Meta Description, Meta Title, H1, and Hero Banner must all contain keywords. Use secondary keywords for variety.

**No keyword stuffing**: Prioritize readability over keyword count.

**LSI keywords**: Use semantically related terms (e.g., "AI assistants" in article about "AI chatbots").

**Large keyword lists**: Primary keyword is mandatory. Secondary keywords selected by search volume and natural fit. De-duplicate similar variants (e.g., "vibe coding meaning/mean/means" → pick one).

| Location | Requirement |
|----------|-------------|
| H1 | Must contain main keyword |
| Meta Title | Must contain main keyword |
| URL | Must contain main keyword |
| Meta description | Must contain main keyword |
| Banner | Should contain main keyword |
| First paragraph | Must contain main keyword |
| H2/H3 headings | Deploy high-volume keywords |
| Body text | Natural distribution, 0.5-1% density |
| FAQ questions | Deploy long-tail keywords |
| Conclusion | Must contain main keyword |

### 5.5 Image Guidelines

- Format: **WebP only** (smallest file size with equivalent quality)
- Source priority: 1) Kimi's own CDN/product shots 2) OpenClaw official docs 3) Screenshots
- Never steal images from competitor articles
- All images must be high-resolution, clean (no Grammarly icons, IME overlays, etc.)
- Every image needs descriptive alt text containing a keyword
- For already-published images, link directly to the existing CDN URL
- Use image placeholder tables where screenshots are needed:

```markdown
| Component | Image |
|---|---|
| **Image** | [Description of needed screenshot] |
| **Alt** | Alt text with keyword |
```

### 5.6 CTA Placement & Design

| Position | Required |
|----------|----------|
| Hero Banner | ✅ Yes (button text usually "Try it now") |
| After Kimi product section | ✅ Yes |
| After conclusion | ✅ Yes |
| Other sections | Where contextually appropriate |

**CTA text rules:**
- **Must be contextual to the article topic and user intent.** Do NOT copy-paste generic text from other articles.
- At article opening: user doesn't know Kimi Claw yet → CTA should address their need, not push the brand
  - ❌ "Try Kimi Claw" (user doesn't know what it is yet)
  - ✅ "Install OpenClaw Without Terminal" or "Skip Setup — Deploy Instantly"
- After Kimi section: user now understands → can be more product-specific
  - ✅ "Get Started with Kimi Claw" or "Deploy OpenClaw Now"

**CTA link mapping** (use correct URL per product):
- Kimi Claw: https://www.kimi.com/bot
- Kimi Websites: https://www.kimi.com/websites
- Kimi Docs: https://www.kimi.com/docs
- Kimi Sheets: https://www.kimi.com/sheets
- Kimi Slides: https://www.kimi.com/slides
- Deep Research: https://www.kimi.com/deep-research

**CTA links that need [Open in new tab]:**
- Step guidance (user needs to perform steps)
- Prompt guidance (user needs to copy prompts)
- External API key sites

### 5.7 Code Blocks

For technical articles, use proper language tags:
- `powershell` for Windows commands
- `bash` for Linux/WSL commands
- `json` for config files

### 5.8 FAQ Section

**Sourcing FAQ topics** (in priority order):
1. Long-tail keywords from the keyword group
2. AlsoAsked (https://alsoasked.com/)
3. Google "People Also Ask" boxes
4. Reddit and Quora discussions

**Requirements:**
- Section title: **"FAQ"** (exactly this, never change)
- 3-5 questions per article
- **Direct-Answer Rule**: First sentence must provide a direct, concise answer (40-50 words ideal). This maximizes Featured Snippet capture.
  - ❌ "That's a great question. There are several factors to consider..."
  - ✅ "Yes. OpenClaw runs on Windows through two methods: PowerShell and WSL2."
- **Independence Principle**: Each FAQ is standalone. No "as mentioned above" or "refer to the list above". Each answer must be clear even when displayed as an isolated snippet.
- Naturally mention Kimi where appropriate
- Deploy long-tail keywords not covered in body

### 5.9 Troubleshooting / Common Errors Section

For how-to/installation articles, **include a troubleshooting section** with high-search-volume errors. This:
- Solves real user needs during the installation process
- Increases page dwell time
- Signals to Google that the article is comprehensive and high-quality
- Improves ranking potential

### 5.10 Non-Article Design Elements

Do NOT include in the article draft:
- Table of contents (generated by CMS)
- Reading time estimates (generated by CMS)
- Navigation breadcrumbs
- Page design elements

These are handled at the web design/CMS level, not in the copywriting draft.

---

## Phase 5.5: Internal Review (Writer ↔ Reviewer Dual-Agent Loop)

Before delivering the article to the user, run an internal review cycle. The goal: catch the mistakes that previous human reviewers have flagged repeatedly, so the user receives a pre-audited draft instead of a first draft.

### How It Works

The main agent (Writer) spawns a **Reviewer sub-agent** using `sessions_spawn`. The Reviewer reads the draft, applies the Review Checklist below, and returns structured feedback. The Writer then revises and re-submits. This loop runs **1-2 rounds** (max 2 to avoid over-polishing).

### Implementation

```
1. Writer finishes draft → saves to file (e.g., ~/Desktop/SEO Draft/xxx-article/article/xxx-v1.md)
2. Writer spawns Reviewer sub-agent with:
   - The draft file path
   - The keyword list + roles
   - The Review Checklist (below)
   - The article type (Best / How-to / Feature-List)
3. Reviewer returns: PASS / REVISE (with specific line-level issues)
4. If REVISE: Writer fixes issues → re-submits for Round 2
5. If PASS (or Round 2 complete): Proceed to Phase 6
```

**Spawn command pattern:**

```
sessions_spawn(
  task: "You are an SEO article reviewer for Kimi Resources. Review the article at [path] against the checklist provided. Return structured feedback.",
  runtime: "subagent",
  mode: "run",
  attachments: [{ name: "review-checklist.md", content: "[checklist below]" }]
)
```

### Reviewer Checklist

The Reviewer must check every item below. For each failed item, provide:
- **Location**: Section/heading or line where the issue appears
- **Issue**: What's wrong
- **Fix suggestion**: Concrete fix (not vague "improve this")

---

#### A. SEO Compliance (Hard Limits)

| # | Check | Rule |
|---|-------|------|
| A1 | Meta Title length | ≤ 60 characters. Count it. |
| A2 | Meta Description length | 140-160 characters. Count it. |
| A3 | H1 length | ≤ 65 characters. Count it. |
| A4 | H1 ≠ Meta Title | Must be different strings |
| A5 | Banner length | 170-280 characters. Count it. |
| A6 | Banner ≠ Meta Description | Different content angles |
| A7 | Banner ending | Must NOT end with "Try it now!" |
| A8 | Main keyword in H1 | Present? |
| A9 | Main keyword in Meta Title | Present? |
| A10 | Main keyword in first paragraph | Present? |
| A11 | Main keyword in conclusion | Present? |
| A12 | Primary keyword density | 0.5%-1% (count occurrences / total words) |
| A13 | URL contains main keyword | Check URL slug |

#### B. Anti-AI Writing (Tone & Style)

These are the issues human reviewers catch most often. **Priority: HIGH.**

| # | Check | What to Look For |
|---|-------|-----------------|
| B1 | Em dashes (—) | Search the entire document. Every single one must be flagged. Replace with commas, periods, or colons. |
| B2 | Parenthetical asides | "(which means...)", "(i.e., ...)" — rewrite as normal sentences |
| B3 | Consecutive same-start sentences | 3+ sentences starting with "This", "It", "If", "The" in a row |
| B4 | Bullet lists in paragraphs | Bullet lists are ONLY for: steps, feature lists, system requirements. Not in intro, conclusion, transitions, or explanatory paragraphs. |
| B5 | Hype/filler words | "taking the world by storm", "game-changing", "revolutionary", "incredible", "amazing" |
| B6 | Opening paragraph length | Count words. Must be < 100 words. |
| B7 | Conclusion format | Must be ONE paragraph. No bullet points, no sub-lists, no problem rehash. Structure: Value Summary → CTA. |
| B8 | Transition quality | Check every H2 boundary. Is there a smooth bridge, or does it just jump? Flag "Unlike..." transitions. |

#### C. Product & Brand Rules

| # | Check | Rule |
|---|-------|------|
| C1 | Comparative/superlative words | Search for "compare", "best", "vs", "better", "superior", "top", "fastest", "easiest", "simplest", "most popular" in body text, headings, and Meta fields. Flag ALL. These are legal/PR risks. Exception: Alt text may use these for SEO. |
| C2 | Non-Kimi LLM recommendations | Any mention of "use OpenAI / Anthropic / Gemini API" as equal alternatives? Flag. Only Kimi API should be recommended. |
| C3 | Kimi Claw as SaaS | Must NOT say "deploy OpenClaw in the cloud" or "cloud deployment". Must say "fully managed platform" / "runs OpenClaw for you". |
| C4 | Kimi Claw user benefit | Does it clearly state what the USER gains (not just features)? "No terminal, no code, no manual configuration" > "deploys in 2 minutes" |
| C5 | Definitive claims about externals | "world's most popular OS", "the leading platform" — flag all definitive claims about non-Kimi entities |
| C6 | Subscription/pricing disclosure | Kimi Allegretto subscription must be woven naturally (e.g., "Log in with your Kimi Allegretto account"), NOT in a standalone disclosure sentence |

#### D. Structure & Logic

| # | Check | Rule |
|---|-------|------|
| D1 | Heading hierarchy | H3 must be under relevant H2. No orphan headings. |
| D2 | Step format | All steps: imperative verb, flat (no nested sub-steps), consistent numbering |
| D3 | Kimi Claw section order | Action steps BEFORE "Why choose" features |
| D4 | Comparison table | Must clearly show Kimi Claw's advantage. Dimensions must be meaningful (manual steps required > setup time) |
| D5 | Comparison table navigation | After table: navigation guidance + CTA with anchor link to Kimi Claw section |
| D6 | FAQ title | Must be exactly "FAQ" |
| D7 | FAQ direct-answer rule | Each FAQ answer starts with a direct answer (40-50 words). No "That's a great question." |
| D8 | FAQ independence | No "as mentioned above" or "refer to Section X". Each answer must be standalone. |
| D9 | FAQ sourcing | Each FAQ must have a plausible real-world source (People Also Ask, Reddit, keyword data). No invented questions. |
| D10 | CTA placement | At minimum: after Hero, after Kimi section, after conclusion |
| D11 | CTA text contextuality | Opening CTA: user doesn't know Kimi yet → address their need. Later CTAs: can be product-specific. |
| D12 | Internal links | 2-5 links, NOT in Hero or Intro, diverse targets |
| D13 | No design elements | No Table of Contents, reading time, breadcrumbs in draft |

#### H. Document Format Consistency

These checks ensure the article matches the established format of published Kimi Resources articles. Cross-reference against macOS and Windows articles for the canonical format.

| # | Check | Rule |
|---|-------|------|
| H1 | SEO Information header | Must start with `# SEO Information` as a standalone H1 heading, followed by the info table. |
| H2 | SEO field names | Use exact field names: `Meta Title` (not "SEO title"), `Meta description`, `H1`, `Banner`, `Banner CTA`. |
| H3 | Character counts | Every text field (Meta Title, Meta description, H1, Banner) must show character count in the third column (e.g., "55 chars"). Counts must be accurate. |
| H4 | Banner CTA row | Banner CTA must be in ONE cell with `CTA<br>Text<br>URL` format (using `<br>` line breaks), NOT split across columns. Third column empty. Example: `\| **Banner CTA** \| CTA<br>Try Kimi Claw<br>https://www.kimi.com/bot \| \|` |
| H5 | Hero Banner block | After `---` separator, the H1 heading must be followed by the Banner text repeated verbatim, then a CTA block (plain text: `CTA\nText: xxx\nLink: xxx`), then another `---` separator, then the Introduction paragraph. CTA is NOT blockquote format. |
| H6 | Image placeholder format | Use `\![alt text](link or 补充截图)` with escaped `!` (backslash prefix). The `\!` prevents Feishu from parsing it as an image when importing markdown, keeping it as plain text. For images with available URLs, use the real link: `\![alt](https://kimi-file...)`. For images without URLs yet, use: `\![alt](补充截图)`. Do NOT use unescaped `![alt](url)` (Feishu will try to download and fail) or Component/Image tables or `Image: xxx` plain text. |
| H7 | Keyword Deployment Statistics | Article must end with `Keyword Deployment Statistics` section (plain text heading, not markdown `#`) containing a markdown table with columns: Keyword, Search Volume, Deploy Count. Include a footnote with main keyword density percentage. |
| H8 | CTA block format | All CTAs in body use plain text format: `CTA\nText: xxx\nLink: xxx`. For CTAs that should open in a new page, use `CTA （新开页面）\nText: xxx\nLink: xxx`. Do NOT use blockquote `>` format. |
| H9 | You might also like | Article must include a `You might also like` section before Keyword Deployment Statistics, containing a markdown table with columns: Anchor Text, Links. List 4-6 related articles. |
| H10 | 头部导航入口文案 | Article must end with navigation block: line 1 = `头部导航入口文案`, line 2 = article short title, line 3 = `导航顺序：`, then each navigation item on its own line (one item per line, NOT joined with `·` separators). |

#### E. Parallel Structure & Logic (Dimensional Consistency)

| # | Check | Rule |
|---|-------|------|
| E1 | Meta description parallel structure | Features grouped together, benefits grouped together. Not interleaved. |
| E2 | Bullet list grammatical alignment | All items in a list follow the same grammatical pattern |
| E3 | Banner parallel structure | Same rule as Meta description |

#### F. Keyword Deployment Spot-Check

| # | Check | Rule |
|---|-------|------|
| F1 | All assigned H2 keywords used in H2 headings | Cross-reference keyword role table |
| F2 | FAQ keywords deployed in FAQ questions | Cross-reference FAQ keyword assignments |
| F3 | No keyword stuffing | Keywords read naturally, not forced |
| F4 | Near-duplicate handling | Only one variant deployed per duplicate set (e.g., "use cases" not "usecases" AND "use cases") |

#### G. Technical Accuracy & Timeliness

We publish as Kimi's official voice. Incorrect technical content damages brand credibility. The Reviewer must verify every verifiable claim.

| # | Check | Rule |
|---|-------|------|
| G1 | Commands and code | Every command must work when copy-pasted. Verify against official docs (docs.openclaw.ai, nodejs.org, brew.sh, etc.). Check for missing `sudo` where elevated privileges are required (e.g., `pmset`, system-level `lsof`, global npm installs that may hit EACCES). |
| G2 | Version numbers | Cross-reference Node.js, macOS, and OpenClaw version requirements against official docs. These change with releases. Flag any hardcoded version that may be outdated. |
| G3 | CLI flags and options | Verify that every CLI flag (e.g., `--install-daemon`, `--port`) actually exists in the current version. Do not invent flags. |
| G4 | UI paths and labels | System Settings paths must account for platform variants (e.g., "Energy" on Mac Mini vs "Battery" on MacBook). App Store names, menu paths, and button labels must match the actual product. |
| G5 | Permission and security | Commands that require elevated access must include `sudo` or equivalent. Permission errors users may encounter (EACCES, Permission denied) must be documented with fixes. |
| G6 | Shell and environment | Do not assume a single shell. macOS defaults to Zsh but Bash users exist. Reference shell profile generically (`~/.zshrc` or `~/.bash_profile`) or note the difference. |
| G7 | Network and access | If the article mentions localhost binding, clarify what devices CAN and CANNOT connect (including mobile). Do not imply mobile access works when it requires additional setup (Tailscale, SSH tunnel). |
| G8 | URLs | Every URL in the article must be live and point to the correct page. Do not guess URLs. |
| G9 | Product claims | Verify feature claims (storage amounts, skill counts, pricing tiers) against the latest published product pages. Flag any claim that cannot be verified. |
| G10 | Error messages | Only include error messages that real users encounter. Sources: SERP research, GitHub issues, Reddit, Stack Overflow. Do not fabricate error scenarios. |
| G11 | Outdated information | Flag any content that may become stale quickly (specific version numbers, pricing, feature counts). Suggest using ranges or "at the time of writing" qualifiers where appropriate. |

**Verification method:** The Reviewer should use `web_fetch` or `kimi_fetch` to check official documentation when verifying technical claims. Do not rely on training data for version numbers or CLI flags.

### Reviewer Output Format

The Reviewer must return its findings in this exact structure:

```markdown
# Internal Review Report

**Article:** [article name]
**Round:** 1 (or 2)
**Verdict:** PASS / REVISE

## Critical Issues (must fix before delivery)
| # | Check ID | Location | Issue | Suggested Fix |
|---|----------|----------|-------|---------------|
| 1 | B1 | Section "Install via Homebrew", para 2 | Em dash found: "Node.js — the runtime" | Replace with ": Node.js, the runtime" |
| ... | ... | ... | ... | ... |

## Warnings (should fix, but not blocking)
| # | Check ID | Location | Issue | Suggested Fix |
|---|----------|----------|-------|---------------|
| ... | ... | ... | ... | ... |

## Passed Checks
[List check IDs that passed, grouped by category]

## Summary
[2-3 sentences: overall quality assessment, main patterns noticed]
```

**Verdict rules:**
- **PASS**: Zero critical issues
- **REVISE**: Any critical issues exist → Writer must fix and re-submit

### What Counts as Critical vs Warning

| Severity | Examples |
|----------|---------|
| **Critical** | SEO char limits exceeded (A1-A7), em dashes present (B1), competitor superlatives (C1), non-Kimi API recommended (C2), Kimi Claw called "cloud deployment" (C3), intro > 100 words (B6), conclusion has bullet list (B7), **incorrect commands/code (G1)**, **wrong version numbers (G2)**, **missing sudo where required (G5)**, **broken URLs (G8)**, **wrong SEO field names (H2)**, **missing Hero Banner block (H5)**, **missing Keyword Deployment Statistics (H7)** |
| **Warning** | Transition could be smoother (B8), a keyword slightly over-deployed, CTA text could be more contextual (D11), minor grammatical inconsistency in a list (E2), shell assumption (G6), UI path variant missing (G4), potentially outdated info (G11), char count inaccurate (H3), image placeholder format mismatch (H6) |

### Round Limits

- **Max 2 rounds.** If Round 2 still has critical issues, flag them to the user with the review report attached. Do not loop endlessly.
- **Round 2 scope:** Reviewer only re-checks items flagged in Round 1 + their surrounding context (not full re-review). This keeps it fast.

### Outline Review (Phase 4.5)

Internal review also applies to outlines, not just finished articles. After writing the outline (Phase 4), run the Reviewer before delivering to the user. The Reviewer checks:
- All SEO char limits (Meta Title, Description, H1, Banner — use code to count, never hand-count)
- CTA placement completeness (Hero + Kimi section + Conclusion minimum)
- H3 content completeness (each H3 needs description, not just a title)
- Complete keyword deployment table
- Keyword role assignments match SERP analysis

### When to Skip Internal Review

- User explicitly says "跳过内审" or "skip review"
- Draft is a minor update (< 20% of content changed from a previously reviewed version)
- User is doing the review themselves and just needs a raw draft

---

## Phase 6: Keyword Statistics

After writing, count and report keyword deployment:

```markdown
# Keyword Deployment Statistics

| Keyword | Search Volume | Deploy Count |
|---|---|---|
| main keyword | 664 | 12 |
| secondary kw 1 | 357 | 8 |
| ... | ... | ... |
```

Include keywords in Alt text in the count. Flag any keywords with 0 deployments.

---

## Phase 7: Output

### Feishu Document
Use `feishu_doc` tool to create and write the article directly to a Feishu document.

### Local Backup
Also save to `~/Desktop/SEO Draft/` as markdown.

---

## File References

| File | Purpose |
|------|---------|
| `style-analysis.md` | Analysis of published article styles |
| `keyword-deployment-analysis.md` | Keyword deployment strategies |
| `references/keyword-groups.md` | Local keyword database copy |
| `references/keyword-database-url.md` | Bitable URL for live keyword data |
| `references/kimi-resources-content-sop.docx` | Official Kimi Resources Content SOP |
| `references/revision-feedback-windows-article.md` | Feedback from Windows article revisions |
| `drafts/` | Working drafts directory |

## Companion Tools

| Tool | Location | Purpose |
|------|----------|---------|
| SERP Similarity Analyzer | `tools/serp-similarity/` (or `skills/serp-similarity/`) | Validate keyword groups before writing — checks SERP overlap, intent, and suggests grouping |

Use the SERP Similarity tool in Phase 1.5 to validate keyword groups before committing to an outline.

---

## Quick Checklist

Before delivering any article, verify (Phase 5.5 Internal Review covers all of these systematically):

**Pre-Writing Validation:**
- [ ] SERP similarity validated — keywords confirmed to share intent
- [ ] Navigational/contaminated keywords identified and excluded from active deployment
- [ ] Keyword roles assigned (Main → H1, H2 keywords, Body keywords, FAQ keywords, Skip)
- [ ] Duplicate keywords merged (≥80% SERP overlap = same query, keep higher volume)

**SEO Info:**
- [ ] SEO title ≤ 60 characters
- [ ] Meta description 140-160 characters
- [ ] H1 ≤ 65 characters
- [ ] H1 ≠ Meta Title (must be different)
- [ ] Banner 170-280 characters, includes value prop
- [ ] Banner ≠ Meta description (different angles)
- [ ] Banner does NOT end with "Try it now!"
- [ ] Meta description has logical parallel structure (features grouped, benefits grouped)

**Content Quality:**
- [ ] Opening paragraph under 100 words, no hype/filler
- [ ] No em dashes (—) in body text
- [ ] No parenthetical asides for important info
- [ ] Bullet lists only in steps/features, not in paragraphs
- [ ] All parallel lists have dimensional and grammatical consistency
- [ ] Heading hierarchy is logically correct (no orphaned H3 above H2)
- [ ] "Kimi Claw Add Beyond" or similar value section uses connected paragraphs, NOT bullet lists
- [ ] 24/7 / always-on discussion comes AFTER all installation methods (user cognitive path: install first → maintain later)

**Product & Competitors:**
- [ ] Only Kimi recommended as LLM provider/API
- [ ] Non-Kimi methods described neutrally (no superlatives)
- [ ] Kimi Claw described as SaaS (not "cloud deployment")
- [ ] Kimi Claw core user benefit explicitly stated
- [ ] No definitive claims about external entities
- [ ] When mentioning Kimi Claw subscription, weave naturally (e.g., "Log in with your Kimi Allegretto account") — never in a standalone disclosure sentence

**Structure:**
- [ ] Steps are flat, imperative verb form, consistent format
- [ ] Kimi Claw: action steps BEFORE "Why choose" features
- [ ] Comparison table followed by navigation guidance + CTA (with anchor link to Kimi Claw section)
- [ ] Section transitions smooth (especially topic shifts)
- [ ] Conclusion is one paragraph, Value Summary → CTA, no problem rehash
- [ ] Troubleshooting section included (for how-to articles) — use real errors from SERP/community research
- [ ] No Table of Contents or reading time in draft
- [ ] Security/firewall settings merged into Prerequisites (not standalone section) unless article is security-focused

**SEO & Links:**
- [ ] All target keywords deployed and counted (including Alt text)
- [ ] Primary keyword density 0.5-1%, min 5 occurrences
- [ ] 2-5 internal links (not in Hero/Intro), diverse targets
- [ ] CTA buttons at required positions with contextual text
- [ ] CTA URLs match correct product pages
- [ ] FAQ title is exactly "FAQ"
- [ ] FAQ 3-5 questions, direct-answer first sentence, standalone
- [ ] FAQ questions sourced from real research (not invented) — each must have documented source
- [ ] Images in WebP with keyword-rich alt text

**Cross-Article Consistency:**
- [ ] Kimi Claw selling angle differs from other platform articles (e.g., macOS angle = "upgrade from local", Windows angle = "skip complex setup")
- [ ] Comparison table dimensions match the article's unique pain points (don't copy-paste from other articles)
- [ ] Troubleshooting errors are platform-specific (macOS: LaunchAgent, Xcode CLT; Windows: PATH, WSL systemd)
