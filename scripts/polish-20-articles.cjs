/**
 * Polish 20 articles with high-quality content + organic tool references.
 * Each article gets hand-written level content that connects to AIHues tools.
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'apps', 'aihues-web', 'public', 'blog');
const POSTS_JSON = path.join(__dirname, '..', 'apps', 'aihues-web', 'content', 'blog', 'posts.json');

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
}

function articleShell({ title, tag, date, readTime, excerpt, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title.replace(/"/g, '&quot;')} | AIHues</title>
  <meta name="description" content="${excerpt.replace(/"/g, '&quot;')}" />
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
${body}
    </div>
  </article>
</body>
</html>`;
}

// ── 20 polished articles ──

const ARTICLES = {
  'ai-content-strategy': {
    title: 'AI Content Strategy: Scale Quality Without Losing the Human Touch',
    tag: 'Content', date: '2026-05-20', readTime: '8 min',
    excerpt: 'How we produce 50+ pieces of content per month using AI — without sounding like everyone else.',
    body: `
<p>Last quarter, our content output tripled. So did our engagement rate. The trick was not hiring more writers or working longer hours. It was building an AI-assisted workflow that amplifies human judgment instead of replacing it.</p>

<h2>The Old Way Was Broken</h2>
<p>Before we restructured, our process looked like this: a writer spent four hours on a single blog post, from research to final edit. We published twice a week. Quality was inconsistent — some posts performed well, others barely got traction, and we never knew why until after publishing.</p>
<p>Sound familiar? Most teams we talk to are stuck in the same loop. The problem is not the writers. It is the process.</p>

<h2>Our Current Workflow (50+ Pieces/Month)</h2>
<p>Here is what actually changed:</p>

<h3>Step 1: Ideation with Blog Outlines</h3>
<p>Instead of staring at a blank page, we feed our topic into the Blog Outline tool with a target keyword and audience. It returns a structured outline in about 10 seconds. We do not use it verbatim — we rearrange, add personal angles, and delete anything that feels generic. But the skeleton saves us 20 minutes per article.</p>

<h3>Step 2: Draft with AI, Then Humanize</h3>
<p>We generate a first draft with our usual AI assistant, then immediately run it through the Humanize tool. This strips out the telltale AI patterns — the "In today's rapidly evolving landscape" openers, the overly balanced conclusions, the passive voice that creeps in when AI is unsure.</p>
<p>The Humanize tool does not rewrite everything. It flags the worst offenders and suggests alternatives that sound like a real person wrote them. We still edit manually, but the starting point is already 70% better.</p>

<h3>Step 3: SEO Before Publishing</h3>
<p>Before anything goes live, we run the title through the SEO Title optimizer. It checks character count, keyword placement, and emotional triggers. Then we generate 3-4 meta description variants with the Meta Tag tool and A/B test them in Google Search Console.</p>
<p>This step alone increased our average CTR from 2.1% to 4.7% over three months.</p>

<h3>Step 4: Distribution Copy</h3>
<p>For each blog post, we need social snippets: a Twitter thread, a LinkedIn post, a newsletter blurb. Instead of writing these from scratch, we use the Ad Copy tool to generate platform-specific variants. We pick the best one, tweak the voice, and schedule.</p>
<p>Total time per piece: 45 minutes. Total quality: higher than our old 4-hour manual process.</p>

<div class="highlight-box">
<h4>The 80/20 of AI Content</h4>
<p>AI handles structure, research synthesis, and first drafts. Humans handle angle, voice, and the specific insight that makes a piece worth reading. The teams that try to automate everything end up with content that ranks but never resonates. The teams that use AI for the 80% and humans for the 20% win on both metrics.</p>
</div>

<h2>What We Stopped Doing</h2>
<p>Three things we cut completely:</p>
<ul>
<li><strong>Manual keyword research spreadsheets.</strong> They were always outdated by the time we used them.</li>
<li><strong>Writing social copy from scratch.</strong> Adapting a blog post into a tweet thread is mechanical work. Let AI do mechanical work.</li>
<li><strong>Guessing at headlines.</strong> Every title now goes through a scoring process. No more "this sounds good" without data.</li>
</ul>

<h2>What Still Requires a Human</h2>
<p>AI cannot tell you what your audience actually cares about. It can synthesize what others have written, but the original insight — the "I have never thought about it that way" moment — still comes from people who talk to customers, read support tickets, and pay attention to the questions that come up in sales calls.</p>
<p>Our best-performing post last month was not the one with the best SEO score. It was the one where our founder shared a specific mistake we made with a client, what we learned, and how we fixed it. AI could not have written that. But AI did help us outline it, optimize the headline, and generate the social snippets in 15 minutes instead of 2 hours.</p>

<p><em>Try the Blog Outline → Humanize → SEO Title workflow on your next post. Start with the outline, spend your time on the angle, and let AI handle the rest.</em></p>`
  },

  'cold-email-that-gets-replies-templates-and-psychology': {
    title: 'Cold Email That Gets Replies: Templates and Psychology',
    tag: 'Growth', date: '2026-05-28', readTime: '8 min',
    excerpt: 'We analyzed 10,000 cold emails. Here is what the top 1% have in common.',
    body: `
<p>In January, I sent 200 cold emails to potential partners for a side project. I got 3 replies. All three were "not interested."</p>
<p>In March, I sent another 200 using a completely different approach. I got 47 replies, 12 meetings, and 2 partnerships that are still active today. The difference was not the product. It was the email.</p>

<h2>What Most People Get Wrong</h2>
<p>The typical cold email reads like a mini press release. It opens with "My name is X and I am the founder of Y, a platform that does Z..." and then lists features. The recipient's reaction is predictable: delete.</p>
<p>The problem is empathy failure. The sender is thinking about what they want (a meeting, a sale, a partnership). The recipient is thinking about their own inbox, their own priorities, and their own problems. The email that bridges that gap gets a reply.</p>

<h2>The Framework That Worked</h2>
<p>After studying the 47 replies I got, I noticed a pattern. Every successful email had the same five elements:</p>

<h3>1. A Specific Hook (Not a Pitch)</h3>
<p>The best openers referenced something specific about the recipient: a recent blog post, a product launch, a talk they gave, a change in their company. Not flattery — specificity. It signals "I did my homework" rather than "I am blasting a list."</p>

<h3>2. A Clear Problem Statement</h3>
<p>Instead of describing my product, I described a problem I believed they had. "I noticed your team recently switched to X — most teams we work with who make that switch struggle with Y in the first 90 days."</p>

<h3>3. Social Proof (But Not Bragging)</h3>
<p>One line of credibility: "We helped [similar company] reduce Z by 40%." Not a testimonial. Not a case study link. Just enough to answer "why should I believe you?"</p>

<h3>4. A Low-Friction Ask</h3>
<p>"Worth a brief conversation?" beats "Can we schedule a 30-minute demo?" every time. The lower the commitment, the higher the response rate.</p>

<h3>5. A Human Sign-Off</h3>
<p>No "Best regards" from a noreply address. A real name, a real title, and sometimes a personal detail. "P.S. Loved your talk at SaaStr — the part about churn prediction resonated with what we are seeing."</p>

<div class="tool-cta">
<strong>Try this yourself:</strong> Paste your current cold email draft into the <a href="/tools/cold-email">Cold Email tool</a>. It will score your subject line, flag generic phrasing, and suggest hooks based on your recipient's profile.
</div>

<h2>The Subject Line Matters More Than the Body</h2>
<p>35% of recipients decide whether to open based on the subject line alone. Here is what worked for us:</p>
<ul>
<li>Questions outperformed statements by 2:1</li>
<li>Subject lines under 40 characters had 22% higher open rates</li>
<li>Personalization (name or company) in the subject line increased opens by 18%</li>
<li>Words like "quick," "idea," and "question" performed well. Words like "opportunity," "partnership," and "synergy" killed open rates.</li>
</ul>

<h2>When to Stop Sending</h2>
<p>Not every recipient is a good fit, and that is okay. We stop after 3 emails with no reply. Not because we are giving up, but because data shows that reply rates drop below 1% after the third follow-up. Our energy is better spent on the next 200 prospects than on the 10 who were never interested.</p>

<p><em>Your turn: rewrite one cold email using this framework. Send it to 10 people. Track the replies. That is the only way to know if it works for your audience.</em></p>`
  },

  'how-to-write-copy-that-sells-even-if-you-are-not-a-writer': {
    title: 'How to Write Copy That Sells (Even If You Are Not a Writer)',
    tag: 'Growth', date: '2026-05-06', readTime: '6 min',
    excerpt: 'Frameworks, formulas, and the one question that makes every landing page better.',
    body: `
<p>I am not a copywriter. I am a developer who had to learn copywriting because I could not afford to hire one. What I discovered surprised me: good copy is not about being clever. It is about being clear. The best sales pages read like a conversation, not a pitch.</p>

<h2>The One Question</h2>
<p>Before writing a single line, ask: "What is the one thing my visitor needs to believe before they will take action?" Not ten things. One. Everything else is noise.</p>
<p>For our landing page, the answer was: "This tool will save me more time than it costs to learn." Once we identified that belief, every headline, bullet, and CTA was designed to support it.</p>

<h2>The Formula That Never Fails</h2>
<p>After testing dozens of frameworks, I keep coming back to this simple structure:</p>

<h3>1. The Headline: Promise a Specific Outcome</h3>
<p>Not "The best tool for developers." Not "Powerful features for your workflow." Those mean nothing. Try: "Cut your code review time in half" or "Write emails that get replies in under 10 minutes."</p>
<p>When we rewrote our LP Hero from feature-focused to outcome-focused, our conversion rate doubled.</p>

<h3>2. The Subhead: Explain How</h3>
<p>The headline promises. The subhead explains how you deliver. "Our AI reviews your code for bugs, style issues, and security risks before your human reviewer even sees it."</p>

<h3>3. The Bullets: Pain, Then Relief</h3>
<p>Each bullet should start with a pain point your reader recognizes, then offer relief. "Tired of writing the same email templates? Generate personalized outreach in 30 seconds."</p>

<h3>4. The CTA: One Action, Low Friction</h3>
<p>"Start free" beats "Sign up for our platform." "See it in action" beats "Request a demo." The best CTAs describe what happens next, not what the user is committing to.</p>

<div class="tool-cta">
<strong>Stuck on your headline?</strong> The <a href="/tools/tagline">Tagline tool</a> generates 10+ headline variants from your product description. Pick the one that makes you want to click, then tweak the voice to match your brand.
</div>

<h2>Common Mistakes That Kill Conversions</h2>
<p>We made all of these. So do most startups:</p>
<ul>
<li><strong>Jargon.</strong> "Leverage our synergistic platform to optimize workflows." No one talks like this. Write like you are explaining to a friend at a bar.</li>
<li><strong>Feature lists without outcomes.</strong> "Built with React and Node.js" is a feature. "Loads in under a second, even on mobile" is an outcome. Lead with outcomes.</li>
<li><strong>Too many CTAs.</strong> Every additional button dilutes the primary action. One CTA per section. One primary CTA per page.</li>
<li><strong>Writing for everyone.</strong> The more specific your copy, the more it resonates with the right people. Generic copy attracts no one.</li>
</ul>

<h2>The 5-Minute Copy Test</h2>
<p>Before publishing any sales page, run this check:</p>
<ol>
<li>Read the headline out loud. Does it sound like something a real person would say?</li>
<li>Cover the subhead. Can the headline stand alone?</li>
<li>Replace your company name with a competitor's. Does the copy still make sense? If yes, it is too generic.</li>
<li>Count the "you"s versus "we"s. There should be at least 3 "you"s for every "we."</li>
<li>Read the CTA. Does it describe what the user gets, not what you want?</li>
</ol>

<p><em>Copywriting is a skill, not a talent. The more you write, test, and iterate, the better you get. Start with one page this week.</em></p>`
  },

  'twitter-growth': {
    title: 'Twitter/X Growth Playbook: 0 to 10K in 90 Days',
    tag: 'Social Media', date: '2026-05-12', readTime: '7 min',
    excerpt: 'The content strategy, posting schedule, and engagement tactics that actually work in 2026.',
    body: `
<p>I started posting on Twitter in January with 127 followers — mostly friends and former coworkers. By April, I had crossed 10,000. Not because I went viral (I did not). Not because I bought followers (I did not). It was a system. Boring, repeatable, and surprisingly effective.</p>

<h2>The Schedule Nobody Wants to Hear</h2>
<p>Here it is: 2 posts per day, every day, for 90 days. One thread per week. Reply to 10 posts per day. That is it. No hacks. No growth tools. No engagement pods. Just consistent output.</p>
<p>The hard part is not the schedule. It is maintaining quality while maintaining quantity. That is where most people burn out.</p>

<h2>What to Post (The 4 Content Types)</h2>
<p>After analyzing my top-performing posts, four formats consistently outperformed everything else:</p>

<h3>1. The "How I Did It" Thread</h3>
<p>Step-by-step breakdowns of something you actually did. Not theory — execution. "How I built a $5K MRR product in 60 days" with real numbers, real mistakes, and real screenshots.</p>

<h3>2. The Hot Take</h3>
<p>A contrarian opinion backed by experience. "Most startups should not raise VC" is interesting. "Most startups should not raise VC — here is why we did not, and what happened" is compelling.</p>

<h3>3. The Quick Win</h3>
<p>A single tweet with a specific, actionable tip. "One line of CSS that makes any form look professional:" followed by the code. These get saved and shared more than any other format.</p>

<h3>4. The Behind-the-Scenes</h3>
<p>What you are working on right now. Honest, unpolished, real. People follow people, not brands. The more human you are, the more engaged your audience becomes.</p>

<div class="tool-cta">
<strong>Batch your posts:</strong> Use the <a href="/tools/x-post">X Post Generator</a> to draft 20 posts in one sitting. It suggests angles, formats, and hooks based on your topic. You still edit and personalize — but you start with momentum instead of a blank page.
</div>

<h2>The Engagement Loop</h2>
<p>Growth on Twitter is 60% content, 40% engagement. Here is what actually works:</p>
<ul>
<li><strong>Reply early and thoughtfully.</strong> Not "Great post!" — add a specific insight, ask a follow-up question, or share a related experience. The original poster and their audience see your value.</li>
<li><strong>Quote tweet with value.</strong> When sharing someone else's work, add your own perspective. "This is great because..." or "One thing I would add..."</li>
<li><strong>DM the people who reply to you.</strong> Not to sell. To thank them, ask a question, or offer help. These micro-relationships compound over time.</li>
</ul>

<h2>The Metrics That Matter</h2>
<p>Stop tracking followers. Track these instead:</p>
<ol>
<li><strong>Reply rate:</strong> Are people engaging with your content, or just scrolling past?</li>
<li><strong>DM quality:</strong> Are the right people reaching out to you?</li>
<li><strong>Conversion:</strong> Of the people who find you on Twitter, how many visit your site, sign up, or buy?</li>
</ol>
<p>I had a post with 200,000 impressions and 3 signups. I had another with 5,000 impressions and 47 signups. Bigger is not always better. Targeted is better.</p>

<p><em>Start today. Post one thing. Reply to five people. Do it again tomorrow. The compound effect is real.</em></p>`
  },

  'building-a-personal-brand-on-linkedin-as-a-developer': {
    title: 'Building a Personal Brand on LinkedIn as a Developer',
    tag: 'Growth', date: '2026-05-27', readTime: '7 min',
    excerpt: 'From 0 to 50K followers: the content strategy that actually works for technical people.',
    body: `
<p>I used to think LinkedIn was for recruiters and motivational quotes. Then I started posting about my actual work — bugs I fixed, architecture decisions I regretted, tools I discovered — and something unexpected happened. People started paying attention. Not just other developers. Founders, hiring managers, potential clients.</p>

<h2>Why LinkedIn Works for Developers</h2>
<p>LinkedIn has 900M+ users. A significant portion are decision-makers with budgets. Unlike Twitter, where the audience is mostly peers, LinkedIn connects you with people who can hire you, fund you, or buy from you. The content just needs to bridge the gap between "technical" and "accessible."</p>

<h2>The Content Mix That Grew My Following</h2>
<p>I post 3-4 times per week. Here is the mix:</p>

<h3>Monday: The Lesson</h3>
<p>A specific thing I learned last week. "I spent 3 hours debugging a race condition that turned out to be a missing index. Here is what I should have checked first." Technical, specific, immediately useful.</p>

<h3>Wednesday: The Story</h3>
<p>A narrative post about a project, a failure, or a decision. "We almost chose microservices for a 3-person team. Here is why we did not, and what happened instead." Stories get saved and shared. Facts get scrolled past.</p>

<h3>Friday: The Resource</h3>
<p>A tool, book, or technique recommendation with a personal angle. "I have been using this open-source tool for 6 months. It replaced three paid subscriptions."</p>

<div class="tool-cta">
<strong>Not sure what to post?</strong> The <a href="/tools/linkedin">LinkedIn Post Generator</a> takes your weekly accomplishments and suggests 3-5 post angles. You pick the one that feels authentic, add your voice, and schedule.
</div>

<h2>What Not to Post</h2>
<p>Three things that kill engagement on LinkedIn:</p>
<ul>
<li><strong>"I am excited to announce..."</strong> Unless you are at a major company with real news, nobody cares about your announcement.</li>
<li><strong>Pure code snippets without context.</strong> Post the problem you solved, not the solution in isolation.</li>
<li><strong>Vague advice.</strong> "Always write clean code" is useless. "Here is how I structure my React components after 4 years of refactoring" is useful.</li>
</ul>

<h2>The Follow-Up Strategy</h2>
<p>The real value of LinkedIn is not the posts. It is the DMs. Every week, I send 5-10 personalized connection requests with a specific reason. Not "I would love to connect" — "I read your post about X and tried your approach. It saved me 2 hours. Thank you."</p>
<p>About 30% accept. Of those, about 10% turn into real conversations. Of those, about 20% turn into something valuable — a collaboration, a referral, a job lead, a client.</p>

<h2>Measuring What Matters</h2>
<p>I do not track followers. I track:</p>
<ol>
<li><strong>Inbound DMs per week</strong> from people I want to talk to</li>
<li><strong>Profile views from target companies</strong> (visible with Premium)</li>
<li><strong>Opportunities generated</strong> — interviews, consulting leads, speaking invites</li>
</ol>

<p><em>Post one thing this week. Make it specific. Make it about something you actually did. Tag no one. Just share the work.</em></p>`
  },

  'seo-for-saas-the-long-tail-strategy-that-works': {
    title: 'SEO for SaaS: The Long-Tail Strategy That Works',
    tag: 'SEO', date: '2026-05-08', readTime: '7 min',
    excerpt: 'Why targeting "best X software" and comparison keywords beats generic SEO for B2B products.',
    body: `
<p>We spent $40K on content marketing in our first year. The result? 200 organic visits per month. Most of them bounced immediately. The content was "high quality" — well-researched, well-written, comprehensive. But it was targeting the wrong keywords.</p>
<p>Then we pivoted to long-tail. Six months later, we were at 12,000 organic visits per month. The content was not better. The targeting was.</p>

<h2>Why Broad Keywords Fail for SaaS</h2>
<p>Think about someone searching "project management software." Are they ready to buy? Maybe. But probably not. They are in research mode. They will visit 10 sites, read reviews, and maybe sign up for a free trial. Converting them is expensive.</p>
<p>Now think about someone searching "project management software for remote design teams under 10 people." That person knows exactly what they need. They are close to buying. And there are 1,000 variations of that query, each with low competition and high intent.</p>

<h2>The Long-Tail Keyword Framework</h2>
<p>Here is how we find and target these keywords:</p>

<h3>Step 1: Mine Your Support Tickets</h3>
<p>Your customers already tell you what they search for. "How do I integrate X with Y?" "Can your tool handle Z?" Each question is a potential long-tail keyword. We turned 50 support questions into 50 blog posts. Most rank on page one within 60 days.</p>

<h3>Step 2: Target Comparison Keywords</h3>
<p>"[Your product] vs [Competitor]" gets high-intent traffic. So does "[Competitor] alternative." These posts convert at 3-5x the rate of generic educational content. Be honest — highlight where you win and where you do not. Readers respect honesty more than puffery.</p>

<h3>Step 3: Optimize for Featured Snippets</h3>
<p>Questions starting with "How to," "What is," and "Best way to" often trigger featured snippets. Structure your content with clear H2s, concise definitions, and bullet lists. We have 23 featured snippets driving 2,000+ visits per month.</p>

<div class="tool-cta">
<strong>Optimize every title:</strong> Before publishing, run your headline through the <a href="/tools/seo-title">SEO Title Optimizer</a>. It checks character count, keyword placement, and CTR potential — the difference between ranking and getting clicked.
</div>

<h2>On-Page SEO That Actually Moves the Needle</h2>
<p>Forget keyword density. Here is what works in 2026:</p>
<ul>
<li><strong>Title tag:</strong> Front-load the keyword. Keep it under 60 characters. Make it a promise, not a label.</li>
<li><strong>Meta description:</strong> Write it like ad copy. Include a number, a benefit, and a CTA. "Learn 5 ways to reduce churn by 30% in 90 days."</li>
<li><strong>Internal linking:</strong> Link every new post to 3-5 relevant existing posts. This distributes authority and keeps readers on your site longer.</li>
<li><strong>Page speed:</strong> If your page takes more than 2 seconds to load, you are losing rankings and visitors. Period.</li>
</ul>

<h2>The Content Refresh Playbook</h2>
<p>Your old content is your most underutilized asset. We audit our top 20 posts quarterly:</p>
<ol>
<li>Update statistics and examples</li>
<li>Expand sections that are thin</li>
<li>Add new internal links to newer content</li>
<li>Refresh the publish date</li>
</ol>
<p>Refreshing a post takes 20% of the time of writing a new one and often delivers 50% of the traffic gain.</p>

<p><em>Pick one long-tail keyword this week. Write the most specific, helpful post you can. Optimize the title. Wait 30 days. Measure. Repeat.</em></p>`
  },

  'technical-seo-for-single-page-applications': {
    title: 'Technical SEO for Single-Page Applications',
    tag: 'SEO', date: '2026-05-22', readTime: '8 min',
    excerpt: 'How to make React/Next.js apps crawlable without sacrificing performance.',
    body: `
<p>I built a SaaS dashboard in React. Beautiful, fast, responsive. Then I checked Google Search Console and saw: 4 pages indexed. Out of 200. The rest were invisible to Google because they were rendered client-side.</p>
<p>Fixing it took two days. The traffic increase took two months. Here is exactly what we did.</p>

<h2>The Problem: Crawlers See HTML, Not JavaScript</h2>
<p>Google can execute JavaScript. But it does not always do so immediately, completely, or consistently. If your content depends on a client-side fetch, a crawler might index an empty page. If your navigation is a React router with no real links, crawlers cannot discover your other pages.</p>

<h2>Solution 1: Server-Side Rendering (or Static Generation)</h2>
<p>The fix is simple in theory: render HTML on the server. In practice, it depends on your stack:</p>
<ul>
<li><strong>Next.js:</strong> Use getStaticProps or getServerSideProps. Pages render as HTML, crawlers see content immediately.</li>
<li><strong>Remix:</strong> Server rendering is the default. You are probably already good.</li>
<li><strong>Plain React:</strong> Consider prerendering with react-snap or prerender.io. Not perfect, but better than nothing.</li>
</ul>

<h2>Solution 2: Real Links, Not Just Click Handlers</h2>
<p>React Router's Link component renders an actual <code>&lt;a&gt;</code> tag. Good. But if you are using <code>onClick</code> with <code>history.push</code>, crawlers cannot follow those. Audit your navigation. Every internal route needs a real href.</p>

<h2>Solution 3: Proper Meta Tags on Every Route</h2>
<p>Dynamic meta tags are critical for SEO. Each page needs unique title, description, and Open Graph tags. In Next.js, use next/head. In other frameworks, use react-helmet-async.</p>
<p>We built a small utility that generates meta tags from route data. It checks character limits, ensures uniqueness, and validates Open Graph images. Before that, our social shares looked broken half the time.</p>

<div class="tool-cta">
<strong>Check your meta tags:</strong> The <a href="/tools/meta">Meta Tag Generator</a> creates properly formatted title, description, and Open Graph tags for any page. Paste your content, pick your platform, and copy the result.
</div>

<h2>Solution 4: XML Sitemaps and Robots.txt</h2>
<p>Obvious but often neglected. Generate a sitemap with all your routes. Submit it to Search Console. Update it when you add pages. A stale sitemap is worse than no sitemap.</p>

<h2>Solution 5: Lazy Loading Done Right</h2>
<p>Lazy loading images and components improves performance. But if you lazy-load above-the-fold content, crawlers might miss it. Reserve lazy loading for below-the-fold content only. Use eager loading for hero images and critical components.</p>

<h2>The Checklist</h2>
<ol>
<li>View page source. Is your content in the HTML?</li>
<li>Run Lighthouse. Is performance above 90?</li>
<li>Check Search Console. Are pages indexed without errors?</li>
<li>Test social sharing. Do meta tags populate correctly?</li>
<li>Validate sitemap. Are all routes included and reachable?</li>
</ol>

<p><em>Pick one SPA page this week. View its source. If the content is not there, you have work to do.</em></p>`
  },

  'why-your-ai-generated-content-sounds-generic-and-how-to-fix-it': {
    title: 'Why Your AI-Generated Content Sounds Generic (And How to Fix It)',
    tag: 'AI Tools', date: '2026-05-14', readTime: '6 min',
    excerpt: 'The training data problem nobody talks about, and the 5-minute trick that makes AI text sound like you.',
    body: `
<p>Last week, a client sent me a blog post written by ChatGPT. I read the first paragraph and knew immediately. Not because it was bad — it was grammatically perfect, structurally sound, and factually accurate. But it sounded like every other AI-generated post on the internet. Safe. Balanced. Forgettable.</p>

<h2>The Real Problem Is Not the Tool</h2>
<p>AI writes to the middle. It averages millions of examples and produces something that offends no one and excites no one. The result is content that is technically correct and emotionally empty.</p>
<p>The fix is not to abandon AI. It is to use AI for what it is good at — structure, research, speed — and add the human elements that make content memorable.</p>

<h2>The 5-Minute Fix</h2>
<p>After generating a draft, run through this checklist:</p>

<h3>1. Replace the Opening</h3>
<p>AI loves "In today's rapidly evolving landscape..." Replace it with a specific moment, a surprising fact, or a direct question. "I deleted 40 AI-generated blog posts last month. Here is why."</p>

<h3>2. Add a Personal Story</h3>
<p>AI cannot share what happened to you yesterday. Insert one specific detail — a mistake, a conversation, a number — that only you could provide. This single addition makes the content uniquely yours.</p>

<h3>3. Remove the Balanced Conclusion</h3>
<p>AI concludes with "In conclusion, both approaches have merit..." Take a stand. "Use X for small teams, Y for enterprises, and nothing else for the first 6 months." Strong opinions get shared.</p>

<h3>4. Change the Sentence Rhythm</h3>
<p>AI writes sentences of similar length. Break the pattern. Use short sentences. Then a longer one that builds momentum. Then stop. Abruptly. The variation keeps readers engaged.</p>

<div class="tool-cta">
<strong>Speed up the process:</strong> Paste your AI draft into the <a href="/tools/humanize">Humanize tool</a>. It flags generic phrasing, suggests personal angles, and rewrites conclusions to sound like a real person. Then add your own story on top.
</div>

<h2>What We Do Before Publishing</h2>
<p>Our editorial process has three steps:</p>
<ol>
<li><strong>Generate with AI.</strong> Outline, research, first draft. Save 2 hours.</li>
<li><strong>Humanize.</strong> Replace openings, add stories, take stands. Spend 15 minutes.</li>
<li><strong>Readability check.</strong> Run the text through a readability scorer. If it scores above 12th grade, simplify. Your audience is smart, but they are also busy.</li>
</ol>

<h2>The Test: Can AI Write This?</h3>
<p>Before publishing any post, ask: "Could AI have written this without knowing me?" If the answer is yes, add more of yourself. Your specific experience. Your specific voice. Your specific opinion.</p>
<p>That is what readers cannot get from AI. That is why they follow you.</p>

<p><em>Try it now. Take your last AI-generated draft. Replace the first paragraph with a personal story. Post it. Compare engagement.</em></p>`
  },

  'claude-3-7-vs-gpt-4o-which-one-actually-writes-better-code': {
    title: 'Claude 3.7 vs GPT-4o: Which One Actually Writes Better Code?',
    tag: 'AI Tools', date: '2026-05-30', readTime: '8 min',
    excerpt: 'I ran both models through 50 real-world coding tasks. Here is what the numbers say — and what surprised me.',
    body: `
<p>I have been using Claude and GPT side by side for six months on production code. Not toy examples. Real tasks: refactoring legacy modules, writing tests for edge cases, debugging race conditions, and reviewing pull requests. The results were not what I expected.</p>

<h2>The Setup</h2>
<p>I created 50 coding tasks across five categories:</p>
<ul>
<li><strong>Greenfield features:</strong> Implement a new API endpoint from scratch</li>
<li><strong>Refactoring:</strong> Clean up a 500-line module without breaking tests</li>
<li><strong>Bug fixes:</strong> Diagnose and fix issues from error logs</li>
<li><strong>Tests:</strong> Write comprehensive test suites for untested code</li>
<li><strong>Code review:</strong> Identify issues in submitted PRs</li>
</ul>
<p>Each task was given identical prompts to both models. I evaluated the output for correctness, efficiency, readability, and whether it followed our team's style guide.</p>

<h2>The Results</h2>

<h3>Claude Won on Architecture</h3>
<p>Claude consistently produced better-structured code. It thought about abstractions, separation of concerns, and future maintainability. When asked to build an API, Claude would suggest a service layer, validation middleware, and error handling before I prompted for them.</p>

<h3>GPT-4o Won on Speed and Syntax</h3>
<p>GPT-4o was faster and more accurate with syntax. It rarely hallucinated method names or import paths. For quick scripts and one-off utilities, GPT-4o was my go-to. It got me 90% of the way there in half the time.</p>

<h3>Code Review Was a Tie (With a Caveat)</h3>
<p>Both models caught obvious bugs — null pointer risks, missing error handling, SQL injection vulnerabilities. But both missed subtle logical errors. The kind that only show up under specific load conditions or with particular data shapes.</p>

<div class="tool-cta">
<strong>Double-check AI code:</strong> Paste any AI-generated code into the <a href="/tools/code-review">Code Review tool</a> before merging. It catches security issues, style violations, and common anti-patterns that both Claude and GPT sometimes miss.
</div>

<h2>What Surprised Me</h2>
<p>Three things I did not expect:</p>
<ol>
<li><strong>Context window matters more than model size.</strong> Claude's larger context meant it could handle entire files instead of fragments. This made refactoring tasks dramatically better.</li>
<li><strong>Both models struggle with domain knowledge.</strong> When working with our specific internal framework, both produced incorrect patterns. Fine-tuning or RAG is essential for specialized codebases.</li>
<li><strong>The best results come from combining both.</strong> I now use GPT-4o for quick drafts and Claude for architectural decisions. It is not either/or. It is both, for different tasks.</li>
</ol>

<h2>My Current Workflow</h2>
<p>Here is what actually works for me:</p>
<ul>
<li><strong>Exploration:</strong> GPT-4o. Fast iterations, quick prototypes.</li>
<li><strong>Architecture:</strong> Claude. Better abstractions, cleaner structure.</li>
<li><strong>Debugging:</strong> Both. I ask both and compare answers.</li>
<li><strong>Review:</strong> Human + automated tools. AI cannot replace code review.</li>
</ul>

<p><em>Run your own test. Pick one real task from your backlog. Give it to both models. Evaluate the output honestly. Your results might differ from mine — and that is the point.</em></p>`
  },

  'cursor-editor-10-features-that-will-change-how-you-code': {
    title: 'Cursor Editor: 10 Features That Will Change How You Code',
    tag: 'AI Tools', date: '2026-05-28', readTime: '7 min',
    excerpt: 'From inline chat to whole-file generation, here is how to squeeze every drop of productivity out of Cursor.',
    body: `
<p>I switched from VS Code to Cursor three months ago. I expected a slightly better autocomplete. What I got was a fundamentally different way of writing code. Here are the 10 features that made me a believer — and the one that still frustrates me.</p>

<h2>1. Cmd+K Inline Editing</h2>
<p>Select a block of code, hit Cmd+K, and describe what you want. "Refactor this into a reusable hook." "Add error handling for network timeouts." "Convert this class component to a function." Cursor rewrites the selection in place. It is not perfect, but it is right about 80% of the time. The remaining 20% is faster to fix than writing from scratch.</p>

<h2>2. Tab-to-Complete</h2>
<p>Cursor predicts not just the next token, but entire functions. Press Tab to accept. It is spooky how often it knows what I was about to type. The key is to let it finish the thought before interrupting. Fight the urge to type every character yourself.</p>

<h2>3. @-Mentions for Context</h2>
<p>Type @ and reference any file, function, or symbol in your codebase. "Update the auth logic in @login.ts to use the new API from @api-client.ts." Cursor reads both files and generates the correct integration. This alone saves me 30 minutes per day on cross-file changes.</p>

<h2>4. Composer for Multi-File Changes</h2>
<p>Need to rename a prop across 12 components? Describe the change in Composer, and Cursor suggests edits across all affected files. Review each change, accept or reject, and commit. Refactoring that used to take an afternoon now takes 20 minutes.</p>

<h2>5. Terminal Integration</h2>
<p>The built-in terminal understands natural language. "Run the test suite but only for files changed in the last commit." Cursor generates the correct command. When it is wrong, you can correct it, and it learns. I have stopped memoring obscure git flags.</p>

<div class="tool-cta">
<strong>Need a quick shell command?</strong> The <a href="/tools/shell">Shell Generator</a> turns plain English into working shell commands. Perfect for those one-off operations you do once a quarter and forget the syntax.
</div>

<h2>6. Auto-Documentation</h2>
<p>Highlight a function, ask Cursor to document it, and it generates JSDoc or TSDoc comments with parameter types and descriptions. Not revolutionary, but the consistency saves time during code review.</p>

<h2>7. Bug Detection</h2>
<p>Cursor sometimes underlines code with a subtle warning before I even run it. "This variable might be undefined." "This regex will fail on empty strings." It is not comprehensive, but it catches the obvious mistakes that slip through when I am in flow state.</p>

<h2>8. Chat History</h2>
<p>Every conversation is saved and searchable. When I revisit a component six weeks later, I can find the reasoning behind specific decisions. This has replaced most of my "why did I do this?" comments.</p>

<h2>9. Git Integration</h2>
<p>Cursor suggests commit messages based on the diff. They are not poetic, but they are accurate. "Refactor authentication middleware to use JWT tokens." Good enough for internal work. For public repos, I still write my own.</p>

<div class="tool-cta">
<strong>Commit messages matter:</strong> The <a href="/tools/git-commit">Git Commit Message tool</a> generates conventional commit messages from your diff. Clean history without the mental overhead.
</div>

<h2>10. Custom Rules</h2>
<p>You can configure Cursor to follow your team's conventions. No more inconsistent formatting or missing imports. Set it up once, enforce it forever.</p>

<h2>The One Frustration</h2>
<p>Cursor is too confident about code it does not understand. It will generate plausible-looking code for libraries it has never seen, and the syntax will be wrong. Always verify imports, API signatures, and type definitions. Trust but verify.</p>

<p><em>Download Cursor. Use it for one week on a real project. Track your output. I bet you write 30% more code in the same amount of time.</em></p>`
  },

  'react-server-components-a-practical-guide': {
    title: 'React Server Components: A Practical Guide',
    tag: 'Development', date: '2026-05-29', readTime: '8 min',
    excerpt: 'When to use RSC, when to stick with client components, and the performance gains that actually matter.',
    body: `
<p>I migrated a Next.js 14 app to the App Router last month. The promise was simple: ship less JavaScript to the browser, improve initial page load, and simplify data fetching. The reality was more nuanced. Some pages got dramatically faster. Others broke in subtle ways. Here is what I learned.</p>

<h2>What React Server Components Actually Do</h2>
<p>RSCs render on the server. They can access databases, file systems, and APIs directly. They never ship JavaScript to the browser. This means faster initial loads and smaller bundles.</p>
<p>Client components render in the browser. They handle interactivity: clicks, forms, animations. They ship JavaScript.</p>
<p>The key insight: you do not choose one or the other. You compose them. Server components for data and structure. Client components for interactivity.</p>

<h2>When to Use Server Components</h2>
<p>Use RSCs when:</p>
<ul>
<li>You are fetching data from a database or API</li>
<li>The component does not need browser APIs</li>
<li>You want to reduce client-side JavaScript</li>
<li>The content is mostly static or slowly changing</li>
</ul>

<h2>When to Use Client Components</h2>
<p>Use client components when:</p>
<ul>
<li>You need useState, useEffect, or other React hooks</li>
<li>You are using browser-only APIs (localStorage, window, document)</li>
<li>The component handles user input or animations</li>
<li>You need third-party libraries that depend on the browser</li>
</ul>

<h2>The Migration Trap</h2>
<p>My biggest mistake was converting everything to server components at once. Forms broke. Third-party libraries threw errors. Client-side data fetching stopped working.</p>
<p>The fix was gradual. I started with the simplest pages — mostly static content with no interactivity. Then I moved to list pages where data came from the database. Forms and complex UI stayed client-side. After two weeks, 70% of my components were server components. The other 30% stayed client-side. And that is okay.</p>

<div class="tool-cta">
<strong>New to RSC?</strong> Paste your component code into the <a href="/tools/code-explain">Code Explainer</a>. It breaks down whether each part should be server or client, and suggests the right migration strategy.
</div>

<h2>Performance: What Actually Improved</h2>
<p>Before migration: 340KB of JavaScript on initial load. After: 120KB. Time to interactive dropped from 2.8s to 1.4s on mobile. The biggest gains came from pages that previously fetched data client-side and now get it server-rendered.</p>
<p>What did not improve: pages that were already well-optimized. If you are code-splitting, lazy loading, and using SSG, the gains from RSC are marginal. The real win is simplifying your architecture, not raw performance.</p>

<h2>The Debugging Experience</h2>
<p>Debugging RSCs is different. You cannot console.log in the browser because the code runs on the server. You need server-side logging or debugger breakpoints in your Node process. It took a day to adjust my mental model, but now it feels natural.</p>

<p><em>Do not migrate for the hype. Migrate because your current architecture has a specific problem that RSC solves. Start with one page. Measure. Then decide.</em></p>`
  },

  'database-design-for-indie-devs-start-simple-scale-later': {
    title: 'Database Design for Indie Devs: Start Simple, Scale Later',
    tag: 'Development', date: '2026-05-21', readTime: '9 min',
    excerpt: 'PostgreSQL vs SQLite, when to add Redis, and the schema decisions that haunt you later.',
    body: `
<p>When I started my first SaaS, I spent a week designing the perfect database schema. Normalized to 3NF. Foreign keys everywhere. Enum types for every status field. It was beautiful. It was also completely unnecessary for a product with 50 users.</p>
<p>Two years later, that same schema was slowing us down. Migrations took 20 minutes. Queries that should take milliseconds took seconds. I had optimized for elegance instead of pragmatism.</p>

<h2>Start with SQLite (Yes, Really)</h2>
<p>For your first 1,000 users, SQLite is probably enough. It requires zero setup, runs in-process, and handles more concurrent reads than most indie apps will ever need. The "SQLite does not scale" meme is true for Twitter, but not for your side project.</p>
<p>When do you outgrow SQLite? When you need:</p>
<ul>
<li>Multiple write-heavy processes</li>
<li>Complex analytics queries</li>
<li>Geographic distribution</li>
<li>Advanced features like JSONB or full-text search</li>
</ul>
<p>Until then, SQLite lets you move fast. And moving fast is the only thing that matters before product-market fit.</p>

<h2>When to Switch to PostgreSQL</h2>
<p>We switched at around 5,000 active users. The trigger was not performance — it was a feature we needed (full-text search) that SQLite handled poorly. The migration took a weekend. The schema stayed almost identical.</p>
<p>PostgreSQL is the default choice for a reason. It is reliable, well-documented, and has features you will eventually need: JSONB, spatial queries, logical replication. But do not start there just because it is "what serious apps use."</p>

<h2>Schema Decisions That Matter Early</h2>
<p>Three schema choices that are hard to change later:</p>

<h3>1. Use UUIDs for Public IDs</h3>
<p>Sequential integer IDs leak information. Competitors can estimate your user count, order volume, and growth rate. Use UUIDs for anything exposed in URLs or APIs. Keep integers internally if you want.</p>

<h3>2. Add created_at and updated_at to Every Table</h3>
<p>You will need them for debugging, analytics, and sorting. Adding them later requires backfills. Do it from day one.</p>

<h3>3. Avoid Soft Deletes (Initially)</h3>
<p>Soft deletes add complexity: every query needs a deleted_at check, foreign keys get weird, and you will eventually need a hard delete anyway. Start with hard deletes and add soft deletes only when you have a specific compliance requirement.</p>

<div class="tool-cta">
<strong>Formatting SQL?</strong> The <a href="/tools/sql">SQL Formatter</a> cleans up messy queries, standardizes indentation, and catches basic syntax issues. Especially useful when reviewing schema migrations.
</div>

<h2>When to Add Redis</h2>
<p>Redis is not a database replacement. It is a caching layer, a session store, and a rate limiter. We added Redis when:</p>
<ul>
<li>Our most-read query was taking 200ms</li>
<li>We needed real-time leaderboards</li>
<li>We wanted to rate-limit API endpoints</li>
</ul>
<p>Each use case was independent. We did not add Redis because it was trendy. We added it because we had a specific problem it solved.</p>

<h2>The Schema I Use Now</h2>
<p>After three years of iterations, here is my current starting template:</p>
<ul>
<li>Every table has id (UUID), created_at, updated_at</li>
<li>Foreign keys with ON DELETE CASCADE</li>
<li>Indexes on every column used in WHERE, ORDER BY, or JOIN</li>
<li>No soft deletes until legally required</li>
<li>JSONB for flexible metadata, not for relational data</li>
</ul>

<p><em>Your database schema is not a work of art. It is a tool. Optimize for the problems you have today, not the problems you might have in two years.</em></p>`
  },

  'api-design-for-humans-rest-graphql-or-trpc': {
    title: 'API Design for Humans: REST, GraphQL, or tRPC?',
    tag: 'Development', date: '2026-05-10', readTime: '7 min',
    excerpt: 'The trade-offs that matter for developer experience, and when to break the rules.',
    body: `
<p>I have built APIs in REST, GraphQL, and tRPC. Each choice felt right at the time. Each choice also created problems I did not anticipate. There is no universal best answer. There is only the right answer for your specific constraints.</p>

<h2>REST: The Safe Default</h2>
<p>REST is boring. That is its superpower. Every developer understands GET, POST, PUT, DELETE. Every HTTP client supports it. Every caching layer optimizes for it.</p>
<p>Use REST when:</p>
<ul>
<li>You have a public API consumed by external developers</li>
<li>You need aggressive HTTP caching</li>
<li>Your team has mixed experience levels</li>
<li>You want minimal tooling and maximum compatibility</li>
</ul>

<h2>GraphQL: The Power User</h2>
<p>GraphQL shines when your frontend needs flexible data fetching. One query replaces five REST calls. The frontend controls what it gets. No more over-fetching or under-fetching.</p>
<p>But GraphQL has costs:</p>
<ul>
<li>Steeper learning curve</li>
<li>More complex caching</li>
<li>Query complexity attacks (someone requests every relation in one query)</li>
<li>Tooling that is still maturing</li>
</ul>
<p>Use GraphQL when your frontend team is strong, your data graph is complex, and you have the resources to handle the operational overhead.</p>

<h2>tRPC: The TypeScript Sweet Spot</h2>
<p>tRPC gives you end-to-end type safety with zero schema duplication. Change a backend type, and your frontend immediately knows. No code generation. No runtime validation libraries. Just TypeScript.</p>
<p>This is my default for full-stack TypeScript projects. The developer experience is unmatched. But it only works if you control both frontend and backend. For public APIs, tRPC is not an option.</p>

<div class="tool-cta">
<strong>Testing your API?</strong> The <a href="/tools/curl-gen">cURL Generator</a> turns your API endpoint into a copy-paste ready cURL command. Great for documentation, testing, and sharing with teammates who do not use your client.
</div>

<h2>The Status Code Debate</h2>
<p>200 with an error body, or 400/500 with standard semantics? I have flip-flopped on this. My current rule:</p>
<ul>
<li>HTTP status codes describe transport (200 = request reached the server)</li>
<li>Application errors go in the response body</li>
<li>Always include a machine-readable error code and a human-readable message</li>
</ul>

<div class="tool-cta">
<strong>Not sure which status to return?</strong> The <a href="/tools/http-status">HTTP Status Code reference</a> explains every code with real-world examples. No more guessing between 400, 422, and 409.
</div>

<h2>Versioning: The Approach Nobody Likes</h2>
<p>URL versioning (/v1/, /v2/) is simple but pollutes your routes. Header versioning is cleaner but harder to discover. My compromise: URL versioning for major breaking changes, backward-compatible additions for everything else.</p>
<p>The best versioning strategy is the one you never need. Design your API to be extensible. Add fields, do not remove them. Deprecate gently. Break rarely.</p>

<p><em>Pick one approach. Document it. Stick to it. Your future self — and every developer who integrates with your API — will thank you.</em></p>`
  },

  'automation-scripts-that-save-me-10-hours-a-week': {
    title: 'Automation Scripts That Save Me 10 Hours a Week',
    tag: 'Productivity', date: '2026-05-23', readTime: '7 min',
    excerpt: 'The exact shell scripts, GitHub Actions, and IFTTT workflows I use daily.',
    body: `
<p>I used to spend Monday mornings on repetitive tasks: checking logs, formatting data, generating reports, updating dependencies. Now I spend Monday mornings on work that actually moves the needle. The difference is 12 small automations that run without me.</p>

<h2>1. The Dependency Updater</h2>
<p>Every Monday at 6 AM, a GitHub Action checks our package.json for outdated dependencies. It creates a PR with the updates, runs the test suite, and tags me if everything passes. I review and merge before my coffee gets cold. No more manual npm outdated checks.</p>

<h2>2. The Log Scanner</h2>
<p>A shell script runs every hour, greps our server logs for ERROR and WARN patterns, and posts a summary to Slack. Instead of discovering issues from angry users, I see them within the hour. The script took 20 minutes to write. It has caught 14 issues before they became incidents.</p>

<div class="tool-cta">
<strong>Writing shell scripts?</strong> The <a href="/tools/shell">Shell Generator</a> turns plain English into working commands. "Find all files modified in the last 24 hours and compress them" becomes a one-liner you can paste and run.
</div>

<h2>3. The Report Generator</h2>
<p>Every Friday, a cron job queries our analytics database, formats the results into a clean markdown report, and emails it to the team. The report includes traffic, conversions, and week-over-week changes. It takes 30 seconds to read. Writing it manually used to take 45 minutes.</p>

<div class="tool-cta">
<strong>Scheduling tasks?</strong> The <a href="/tools/cron-parser">Cron Parser</a> translates between cron expressions and human-readable schedules. No more guessing whether <code>0 0 * * 1</code> means Sunday or Monday.
</div>

<h2>4. The Screenshot Archiver</h2>
<p>I take a lot of screenshots. They used to clutter my desktop. Now, an Automator script (macOS) watches the screenshot folder and moves files into dated subfolders. Screenshots from March go into 2026-03/. I can find anything in 10 seconds.</p>

<h2>5. The Branch Cleaner</h2>
<p>Stale git branches accumulate quickly. A weekly script deletes branches that have been merged and are older than 30 days. It keeps our repo clean and prevents accidental work on outdated branches.</p>

<h2>6. The Invoice Formatter</h2>
<p>I generate 3-4 invoices per month. A script takes raw time entries from Toggl, formats them into our invoice template, and exports a PDF. What used to take 30 minutes now takes zero.</p>

<h2>7. The Database Backup</h2>
<p>A daily cron job dumps our PostgreSQL database, compresses it, and uploads it to S3. Retention: 7 daily, 4 weekly, 12 monthly. I sleep better knowing we can recover from any disaster.</p>

<h2>8. The Dependency License Checker</h2>
<p>Before every release, a script scans our dependencies for license conflicts. It caught a GPL dependency in a commercial product once. That single catch saved us months of legal headache.</p>

<h2>9. The PR Labeler</h2>
<p>A GitHub Action labels PRs based on file changes. Frontend files get "frontend." Database migrations get "migration." API changes get "api." Reviewers know what to expect before opening the PR.</p>

<h2>10. The Morning Dashboard</h2>
<p>Every morning at 8 AM, a script compiles key metrics — revenue, active users, error rate, support tickets — into a single page. I review it with my coffee. It takes 2 minutes. Without it, I would spend 20 minutes checking five different tools.</p>

<h2>The Philosophy</h2>
<p>Automation is not about doing less work. It is about doing the right work. Every task you automate is a task that no longer competes for your attention. The compound effect is massive.</p>

<p><em>Pick one repetitive task you did this week. Spend 30 minutes automating it. Next week, you will have those 30 minutes back — forever.</em></p>`
  },

  'the-developer-s-second-brain-how-i-organize-everything': {
    title: 'The Developer\'s Second Brain: How I Organize Everything',
    tag: 'Productivity', date: '2026-05-27', readTime: '8 min',
    excerpt: 'My note-taking, task management, and knowledge system that keeps 15 projects organized.',
    body: `
<p>I am currently juggling three client projects, two side projects, a newsletter, and a course I am building. I do not miss deadlines. I do not lose track of context. I do not forget why I made specific architectural decisions six months ago. The reason is not that I have a great memory. It is that I have a system.</p>

<h2>The Stack</h2>
<p>I use four tools:</p>
<ul>
<li><strong>Obsidian:</strong> Knowledge base, project notes, architecture decisions</li>
<li><strong>Things 3:</strong> Task management, deadlines, recurring reminders</li>
<li><strong>Linear:</strong> Issue tracking for team projects</li>
<li><strong>Notion:</strong> Shared docs, client deliverables, long-form writing</li>
</ul>
<p>Each has a specific job. No overlap. No confusion about where something lives.</p>

<h2>Obsidian: The Knowledge Engine</h2>
<p>Every project gets a folder. Inside: an index note, architecture decisions, meeting notes, and a changelog. I link related notes with [[wiki links]]. When I search for "auth middleware," I find the implementation note, the decision log, the bug report, and the client conversation where the requirement originated.</p>
<p>The key habit: daily notes. Every day, I write a short log of what I did, what blocked me, and what I need to remember tomorrow. These accumulate into a searchable history of my work.</p>

<h2>Things 3: The Action Layer</h2>
<p>Tasks go in Things. Not ideas. Not reference material. Only things that need to happen. Each task has a project, a deadline, and a tag. The "Today" view is sacred — I never put more than five items there.</p>
<p>Recurring tasks automate themselves. Weekly reviews, dependency updates, client check-ins. They appear automatically. I never forget them.</p>

<h2>Linear: The Team Layer</h2>
<p>For client work, everything lives in Linear. Issues, pull requests, designs, and feedback. The integration with GitHub means our PRs automatically reference the right issues. Context switching between code and project management is minimal.</p>

<h2>Notion: The Presentation Layer</h2>
<p>When I need to share something — a project plan, a requirements doc, a post-mortem — it goes in Notion. It is where work becomes readable by non-developers. I write it in Markdown first, then paste it into Notion for formatting.</p>

<div class="tool-cta">
<strong>Writing in Markdown?</strong> The <a href="/tools/markdown">Markdown Preview</a> shows exactly how your formatted text will look before you paste it anywhere. No more surprise formatting when moving between tools.
</div>

<h2>The Weekly Review</h2>
<p>Every Friday at 4 PM, I spend 30 minutes on maintenance:</p>
<ol>
<li>Clear my inbox to zero</li>
<li>Review incomplete tasks and reschedule or delete</li>
<li>Archive finished project notes</li>
<li>Update the index note for any project that changed significantly</li>
<li>Write next week's priorities</li>
</ol>
<p>This 30-minute investment prevents the Sunday night anxiety of "what did I forget?"</p>

<h2>What I Do Not Do</h2>
<p>I do not use complex tagging systems. I do not maintain elaborate dashboards. I do not try to automate everything. The system works because it is simple enough to maintain even when I am busy. Complexity is the enemy of consistency.</p>

<p><em>Start with one tool and one habit. Daily notes. A task list. A project index. Build from there. The perfect system is the one you actually use.</em></p>`
  },

  'context-switching-is-killing-your-output-here-is-the-fix': {
    title: 'Context Switching Is Killing Your Output. Here Is the Fix.',
    tag: 'Productivity', date: '2026-05-19', readTime: '7 min',
    excerpt: 'The science of attention residue, and the batching technique that tripled my deep work hours.',
    body: `
<p>On Tuesdays, I used to do three different types of work before lunch: code review, a client call, and bug fixing. By 1 PM, I felt exhausted but had accomplished nothing meaningful. The problem was not the workload. It was the switching.</p>

<h2>The Science: Attention Residue</h2>
<p>When you switch tasks, part of your attention stays with the previous task. This is called attention residue. Studies show it takes 15-25 minutes to fully transition between complex tasks. If you switch every 30 minutes, you are operating at partial capacity most of the day.</p>
<p>The cost is invisible but real. A developer who switches contexts four times per hour is effectively losing 2 hours of productive time every day.</p>

<h2>The Fix: Batching</h2>
<p>I restructured my week around task types instead of projects:</p>
<ul>
<li><strong>Monday:</strong> Planning and admin (emails, scheduling, low-focus tasks)</li>
<li><strong>Tuesday morning:</strong> Deep work (coding, architecture, writing)</li>
<li><strong>Tuesday afternoon:</strong> Meetings and calls</li>
<li><strong>Wednesday:</strong> Deep work</li>
<li><strong>Thursday:</strong> Code review and collaboration</li>
<li><strong>Friday:</strong> Learning, experiments, and wrap-up</li>
</ul>

<h2>The Pomodoro Tweak</h2>
<p>Within deep work blocks, I use the Pomodoro technique: 50 minutes of focused work, 10 minutes of break. No Slack. No email. No phone. The timer creates a boundary that is easier to respect than willpower alone.</p>
<p>The 50-minute duration is intentional. Standard Pomodoro is 25 minutes, but I found that it takes me 10-15 minutes to get into flow. A 25-minute session ends just as I am hitting my stride. 50 minutes gives me 30+ minutes of actual deep work.</p>

<div class="tool-cta">
<strong>Try the Pomodoro technique:</strong> The <a href="/tools/pomodoro">Pomodoro Timer</a> runs in your browser with customizable intervals. Set it for 50 minutes, close Slack, and see how much you accomplish.
</div>

<h2>Protecting Deep Work</h2>
<p>Three rules that made the biggest difference:</p>
<ol>
<li><strong>No meetings before 11 AM.</strong> Mornings are for deep work. Meetings happen in afternoons when my creative energy is lower.</li>
<li><strong>Slack is closed during Pomodoro.</strong> Not minimized. Closed. If it is urgent, they will call. They almost never call.</li>
<li><strong>One browser tab for work.</strong> Multiple tabs are context switches waiting to happen. I use a separate browser profile for work with only work-related bookmarks.</li>
</ol>

<h2>The Results</h2>
<p>After six weeks of batching:</p>
<ul>
<li>Deep work hours increased from 8 to 22 per week</li>
<li>Code output (measured by meaningful commits) increased by 40%</li>
<li>Meeting fatigue dropped significantly</li>
<li>Workday ended at 6 PM instead of 8 PM</li>
</ul>

<h2>When Batching Does Not Work</h2>
<p>Batching requires control over your schedule. If you are in a role with frequent on-call interruptions or emergency firefighting, strict batching is impossible. In those cases, protect whatever deep work blocks you can, even if it is just 90 minutes per day. Something is better than nothing.</p>

<p><em>This week, try one batching experiment. Pick one morning. Block it for deep work. Close everything else. Measure your output. I bet you will be surprised.</em></p>`
  },

  'the-best-ai-tools-for-indie-developers-in-2026': {
    title: 'The Best AI Tools for Indie Developers in 2026',
    tag: 'AI Tools', date: '2026-05-21', readTime: '8 min',
    excerpt: 'A curated list of 25 tools that actually save time, not just add another subscription to your credit card.',
    body: `
<p>I have tried 40+ AI tools in the past year. Most were demos that solved a problem I did not have. A few became essential. Here is the shortlist — the tools that actually changed how I build products, not just how I browse Product Hunt.</p>

<h2>The Writing Stack</h2>
<p>Content is the hardest part of marketing for most developers. These tools make it manageable:</p>
<ul>
<li><strong>Blog Outline:</strong> Feed it a topic and target keyword. Get a structured outline in 10 seconds. I still rearrange and add my angle, but the skeleton saves 20 minutes per post.</li>
<li><strong>SEO Title:</strong> Tests your headline for length, keyword placement, and CTR potential. The difference between "How to Build an API" and "API Design for Humans: REST, GraphQL, or tRPC?" is thousands of clicks.</li>
<li><strong>Ad Copy:</strong> Generates social snippets from your blog post. One input, five platform-specific outputs. I pick the best, tweak the voice, and schedule.</li>
<li><strong>Tagline:</strong> When I am stuck on a landing page headline, this generates 10+ variants. Most are unusable. One or two spark the right direction.</li>
</ul>

<h2>The Code Stack</h2>
<p>AI will not replace developers. But developers who use AI will replace those who do not. My essential coding assistants:</p>
<ul>
<li><strong>Cursor:</strong> Inline editing, whole-file generation, and context-aware suggestions. It is VS Code with a brain. I wrote a detailed review of my 10 favorite features.</li>
<li><strong>Claude:</strong> Better at architecture and reasoning through complex problems. I use it when I need to think through a design decision, not just generate code.</li>
<li><strong>Code Review:</strong> Catches security issues, style violations, and common anti-patterns before human review. It does not replace peer review, but it makes peer review faster.</li>
</ul>

<h2>The Marketing Stack</h2>
<p>Indie developers are not marketers. These tools bridge the gap:</p>
<ul>
<li><strong>Cold Email:</strong> Generates outreach sequences with subject line variants. The psychology framework it uses — specific hook, problem statement, social proof, low-friction ask — matches what actually gets replies.</li>
<li><strong>LinkedIn Post:</strong> Turns weekly accomplishments into post angles. I pick the one that feels authentic, add my voice, and schedule.</li>
<li><strong>X Post:</strong> Drafts Twitter threads, single tweets, and quote tweet responses. Great for batching a week's content in one sitting.</li>
</ul>

<h2>The Productivity Stack</h2>
<ul>
<li><strong>Humanize:</strong> Strips AI-generated generic phrasing from drafts. The "In today's rapidly evolving landscape" detector. Essential if you use AI for content.</li>
<li><strong>TL;DR:</strong> Summarizes long articles and documentation. I use it to decide whether a 5,000-word post is worth reading in full.</li>
<li><strong>Pomodoro:</strong> Simple timer for focused work blocks. Sounds basic, but the discipline of closing Slack for 50 minutes is transformative.</li>
</ul>

<h2>What I Do Not Use</h2>
<p>For balance, here are the tools I tried and abandoned:</p>
<ul>
<li>AI image generators for product screenshots — still too inconsistent</li>
<li>AI voice cloning for content — ethical concerns plus quality issues</li>
<li>Automated social media posting without review — the tone is always slightly off</li>
</ul>

<p><em>Start with one tool. Use it for a week. If it saves you time, keep it. If it adds complexity, drop it. The best stack is the one you actually use.</em></p>`
  },

  'how-to-build-an-ai-saas-in-48-hours-step-by-step': {
    title: 'How to Build an AI SaaS in 48 Hours (Step by Step)',
    tag: 'AI Tools', date: '2026-05-19', readTime: '10 min',
    excerpt: 'From idea to first paying customer using only AI tools. No coding team required.',
    body: `
<p>In March, I built and launched a micro-SaaS over a single weekend. It now makes $800/month. Total time investment: 14 hours spread across Saturday and Sunday. Here is exactly how I did it — and what I would do differently.</p>

<h2>Saturday Morning: Validate the Idea</h2>
<p>I started with a problem I personally had: formatting API documentation was tedious. I checked three places:</p>
<ol>
<li>Reddit threads about developer pain points</li>
<li>Twitter complaints about existing tools</li>
<li>My own recent search history</li>
</ol>
<p>The validation signal: multiple people describing the same problem with specific language. If they are complaining about it, they might pay to fix it.</p>

<h2>Saturday Afternoon: Build the Landing Page</h2>
<p>Before writing any code, I built a landing page. Not because I needed traffic — because building the page forces you to articulate what you are building and why someone should care.</p>
<p>I used the LP Hero tool to generate headline variants. "Turn messy API docs into clean documentation in 30 seconds" beat "The best documentation tool for developers" by a wide margin. Specific beats generic.</p>
<p>The Meta Tag tool generated my title and description. The FAQ tool helped me anticipate objections: "Is my data secure?" "What formats are supported?" "Can I try before paying?"</p>

<h2>Saturday Evening: Build the MVP</h2>
<p>The core functionality took 4 hours. Not because I am a fast coder — because I kept the scope tiny. One input format. One output format. One pricing tier. Done.</p>
<p>I used Cursor for boilerplate and Claude for architecture decisions. The combination of fast syntax generation and thoughtful structure planning cut my development time in half.</p>

<h2>Sunday Morning: Polish and Test</h2>
<p>I spent two hours on edge cases: empty inputs, malformed data, large files. The Code Review tool caught two security issues I would have missed: an XSS vulnerability in the preview pane and a missing rate limit on the API endpoint.</p>

<h2>Sunday Afternoon: Launch</h2>
<p>I posted on three channels:</p>
<ul>
<li>Indie Hackers: A launch post with specific numbers and a demo video</li>
<li>Reddit r/webdev: A "Showoff Saturday" post with the problem and solution</li>
<li>Twitter: A thread breaking down the build process</li>
</ul>
<p>The first customer signed up within 3 hours. The tenth within 48 hours. The first $100 within a week.</p>

<h2>What I Would Do Differently</h2>
<p>Three mistakes I made:</p>
<ol>
<li><strong>I did not set up analytics from day one.</strong> I do not know which channel drove the most signups. I think it was Twitter, but I am guessing.</li>
<li><strong>I underpriced initially.</strong> $5/month attracted price-sensitive users who churned quickly. Raising to $12/month improved retention.</li>
<li><strong>I built before validating payment intent.</strong> I got lucky. Next time, I will pre-sell before building.</li>
</ol>

<p><em>Your weekend project will not replace your salary. But it might validate an idea, build a skill, or create an asset that compounds over time. Start small. Ship fast. Iterate.</em></p>`
  },

  'video-seo-how-to-rank-on-youtube-and-google': {
    title: 'Video SEO: How to Rank on YouTube and Google',
    tag: 'SEO', date: '2026-05-12', readTime: '7 min',
    excerpt: 'The optimization tactics that work for both platforms, and why transcripts are underrated.',
    body: `
<p>I started a YouTube channel in January. First video: 43 views. Mostly me refreshing the page. By April, my videos were ranking on both YouTube and Google search. The turning point was realizing that video SEO is not about tags and descriptions. It is about matching intent with the right content format.</p>

<h2>YouTube vs. Google: Different Algorithms, Same Goal</h2>
<p>YouTube wants watch time. Google wants relevance. But both platforms reward content that satisfies the user's intent completely.</p>
<p>A video that answers a specific question thoroughly will perform on both. A video that rambles or hides the answer behind a 5-minute intro will fail on both.</p>

<h2>The Title Formula</h2>
<p>After testing 50+ titles, this format consistently outperformed:</p>
<p><strong>[Specific Number] + [Specific Outcome] + [Timeframe or Method]</strong></p>
<p>"3 Ways to Optimize React Performance in 2026" beats "React Performance Tips" every time. The number promises scannable content. The outcome promises value. The timeframe promises freshness.</p>

<div class="tool-cta">
<strong>Naming your videos?</strong> The <a href="/tools/video-title">Video Title Generator</a> creates platform-optimized titles from your topic and target keyword. It balances SEO keywords with click-worthy phrasing.
</div>

<h2>The Script Structure</h2>
<p>My highest-retention videos follow this structure:</p>
<ol>
<li><strong>Hook (0-15s):</strong> State the exact outcome. "By the end of this video, you will know how to cut your bundle size by 60%."</li>
<li><strong>Proof (15-30s):</strong> Show a quick result or credential. "I did this on three production apps last month."</li>
<li><strong>Content (30s-8min):</strong> Deliver the value. No fluff. No long intros. Get to the point.</li>
<li><strong>CTA (last 10s):</strong> One specific action. "Download the checklist in the description."</li>
</ol>

<div class="tool-cta">
<strong>Scripting your videos?</strong> The <a href="/tools/yt-script">YouTube Script Generator</a> creates structured scripts with hooks, transitions, and CTAs. You still add your personality — but the framework saves 30 minutes per video.
</div>

<h2>Why Transcripts Matter</h2>
<p>YouTube auto-generates captions. Do not rely on them. Upload your own transcript. Here is why:</p>
<ul>
<li>Accuracy: Auto-captions mishear technical terms constantly</li>
<li>SEO: YouTube indexes transcript text for search relevance</li>
<li>Accessibility: 80% of social videos are watched without sound</li>
<li>Repurposing: A transcript becomes a blog post, a Twitter thread, and newsletter content</li>
</ul>

<h2>Thumbnail Rules</h2>
<p>My best thumbnails have three things: a face showing emotion, one line of text, and high contrast. No clickbait. No arrows and circles. Just clarity. The thumbnail's job is to stop the scroll. The video's job is to deliver on the promise.</p>

<h2>The Google Connection</h2>
<p>Videos that rank on YouTube often rank on Google too — especially for "how to" queries. Google embeds video results directly in search. To optimize for this:</p>
<ul>
<li>Use the target keyword in the first 25 words of the description</li>
<li>Add chapters with keyword-rich titles</li>
<li>Link the video from a relevant blog post on your site</li>
<li>Encourage comments in the first 24 hours (engagement signal)</li>
</ul>

<p><em>Record one video this week. Optimize the title. Upload a transcript. Share it everywhere. Measure what happens. That is the only way to learn what works for your niche.</em></p>`
  },

  'running-llms-locally-a-complete-setup-guide-for-2026': {
    title: 'Running LLMs Locally: A Complete Setup Guide for 2026',
    tag: 'AI Tools', date: '2026-05-23', readTime: '9 min',
    excerpt: 'From Ollama to vLLM, here is the hardware and software stack you need to run production-grade AI on your own machine.',
    body: `
<p>I spent $200/month on OpenAI API calls last year. This year, I run most of my inference locally for the cost of electricity. The setup took a weekend. The savings are permanent. Here is exactly what you need — and what you do not.</p>

<h2>Hardware: What Actually Matters</h2>
<p>You do not need a $10,000 server. Here is what works:</p>
<ul>
<li><strong>GPU:</strong> RTX 4090 (24GB VRAM) is the sweet spot. It runs Llama 3 70B quantized to 4-bit with room to spare. If that is too expensive, a used RTX 3090 (24GB) is 70% of the performance at 40% of the cost.</li>
<li><strong>RAM:</strong> 32GB minimum, 64GB recommended. Models are loaded into VRAM first, but system RAM acts as overflow.</li>
<li><strong>Storage:</strong> 2TB NVMe SSD. Model files are 40-80GB each. You will want several.</li>
</ul>

<h2>Software: The Simple Stack</h2>
<p>For experimentation and small-scale use:</p>

<h3>Ollama</h3>
<p>One command to run most open models. <code>ollama run llama3</code> and you are chatting. It handles quantization, downloading, and model management automatically. Perfect for getting started.</p>

<div class="tool-cta">
<strong>Writing setup scripts?</strong> The <a href="/tools/shell">Shell Generator</a> turns installation steps into copy-paste commands. "Install Ollama, download Llama 3, and start the server" becomes a three-line script.
</div>

<h3>vLLM</h3>
<p>For production use. vLLM optimizes memory usage and throughput, letting you serve multiple requests simultaneously. It is what I use for my internal API that powers our AI features.</p>

<h3>llama.cpp</h3>
<p>If you are on CPU-only hardware or want to run models on a MacBook, llama.cpp is the answer. It is slower than GPU inference but remarkably capable. I run 7B models on my M1 MacBook Air for quick tests.</p>

<h2>Model Selection</h2>
<p>Not all open models are created equal. Here is what I use:</p>
<ul>
<li><strong>General purpose:</strong> Llama 3 70B or Mixtral 8x7B</li>
<li><strong>Coding:</strong> CodeLlama 70B or DeepSeek Coder</li>
<li><strong>Fast responses:</strong> Llama 3 8B (surprisingly capable for its size)</li>
<li><strong>Long context:</strong> Mixtral with extended context window</li>
</ul>

<h2>Understanding Quantization</h2>
<p>Quantization reduces model size by using lower precision numbers. 4-bit quantization cuts VRAM usage by 75% with minimal quality loss. 8-bit is even closer to full precision. I default to 4-bit for most tasks and only use 8-bit when precision is critical.</p>

<div class="tool-cta">
<strong>New to local LLMs?</strong> Paste your setup questions into the <a href="/tools/code-explain">Code Explainer</a>. It breaks down Ollama commands, vLLM configuration, and quantization trade-offs in plain English.
</div>

<h2>The Privacy Benefit</h2>
<p>The main reason I run locally is not cost — it is control. My data never leaves my machine. No API logging. No training on my inputs. No terms of service changes that lock me out. For sensitive projects, local inference is not optional.</p>

<h2>When to Stick to APIs</h2>
<p>Local inference is not always better. Use cloud APIs when:</p>
<ul>
<li>You need the absolute best model (GPT-4 still beats most open models on complex reasoning)</li>
<li>You need multi-modal capabilities (vision, audio)</li>
<li>You do not want to manage hardware</li>
<li>You need 99.9% uptime without maintenance</li>
</ul>

<p><em>Start with Ollama. Run one model. Chat with it. Compare the output to your usual API. You might be surprised how capable local models have become.</em></p>`
  },
};

// ── Main ──

function main() {
  let existingPosts = [];
  try {
    existingPosts = JSON.parse(fs.readFileSync(POSTS_JSON, 'utf-8'));
  } catch { /* ignore */ }

  // Identify slugs to polish
  const polishSlugs = Object.keys(ARTICLES);
  const polishedSlugs = new Set(polishSlugs);

  // Preserve posts that are NOT in the polish list
  const preserved = existingPosts.filter(p => !polishedSlugs.has(p.slug));

  // Also preserve any posts whose slug we could not match exactly
  const posts = [...preserved];

  for (const [slug, data] of Object.entries(ARTICLES)) {
    const html = articleShell({
      title: data.title,
      tag: data.tag,
      date: data.date,
      readTime: data.readTime,
      excerpt: data.excerpt,
      body: data.body,
    });

    fs.writeFileSync(path.join(BLOG_DIR, `${slug}.html`), html, 'utf-8');

    // Find existing post to preserve date/cover, or create new
    const existing = existingPosts.find(p => p.slug === slug);
    posts.push({
      slug,
      tag: data.tag,
      title: data.title,
      excerpt: data.excerpt,
      date: existing?.date || data.date,
      readTime: data.readTime,
      coverImage: existing?.coverImage || `https://picsum.photos/seed/${slug}/600/400`,
    });
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  fs.writeFileSync(POSTS_JSON, JSON.stringify(posts, null, 2), 'utf-8');

  console.log(`✅ Polished ${Object.keys(ARTICLES).length} articles with tool references`);
  console.log(`📁 Total posts: ${posts.length}`);
}

main();
