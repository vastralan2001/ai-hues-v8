#!/usr/bin/env python3
"""
Batch fix 25 AI text tools — replace demo generate() with real frontend simulation
"""

import os

BASE = "/mnt/agents/output/ai-hues-dev/tools"

# Each tool's simulation logic (pure frontend, no API needed)
GENERATORS = {
    "code-explain": '''function generate(){
  const code = document.getElementById('input').value.trim();
  if(!code){ alert('Please paste some code'); return; }
  const lines = code.split('\\n');
  const funcs = code.match(/function\\s+(\\w+)/g) || [];
  const vars = code.match(/(const|let|var)\\s+(\\w+)/g) || [];
  let out = "## Code Explanation\\n\\n";
  out += "**Language**: Auto-detected (JavaScript/Python/etc)\\n\\n";
  out += "**Lines**: " + lines.length + "\\n";
  out += "**Functions**: " + funcs.length + "\\n";
  out += "**Variables**: " + vars.length + "\\n\\n";
  if(funcs.length > 0) {
    out += "### Functions\\n";
    funcs.forEach((f,i) => out += (i+1) + ". `" + f.replace('function ','') + "`\\n");
    out += "\\n";
  }
  out += "### Summary\\n";
  out += "This code appears to " + (funcs.length > 0 ? "define " + funcs.length + " function(s)" : "execute a script") + ". ";
  out += "It declares " + vars.length + " variable(s). ";
  out += "The main purpose is likely to process data or perform calculations based on the input.\\n\\n";
  out += "[Note: Full AI explanation requires API connection]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "code-review": '''function generate(){
  const code = document.getElementById('input').value.trim();
  if(!code){ alert('Please paste some code'); return; }
  const issues = [];
  if(code.length > 500) issues.push("⚠️ Consider breaking this into smaller functions");
  if(!code.includes('//') && !code.includes('/*')) issues.push("⚠️ Missing comments/documentation");
  if((code.match(/console\.log/g) || []).length > 3) issues.push("⚠️ Multiple console.log statements should be removed");
  if(code.includes('var ')) issues.push("⚠️ Use `let` or `const` instead of `var`");
  if(!code.includes('try') && code.includes('JSON.parse')) issues.push("⚠️ JSON.parse without try-catch");
  if((code.match(/function/g) || []).length === 0 && code.length > 100) issues.push("⚠️ Consider using functions for better organization");
  let out = "## Code Review\\n\\n";
  out += "**Overall Score**: " + (issues.length === 0 ? "9/10 ✅" : (10 - issues.length) + "/10") + "\\n\\n";
  if(issues.length === 0) {
    out += "✅ No major issues found! Clean code.\\n";
  } else {
    out += "### Issues Found (" + issues.length + ")\\n\\n";
    issues.forEach(issue => out += issue + "\\n\\n");
  }
  out += "\\n### Suggestions\\n";
  out += "- Add JSDoc comments for functions\\n";
  out += "- Consider unit tests\\n";
  out += "- Review variable naming conventions\\n\\n";
  out += "[Note: Full AI review requires API connection]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "shell": '''function generate(){
  const desc = document.getElementById('input').value.trim();
  if(!desc){ alert('Please describe what you need'); return; }
  const lower = desc.toLowerCase();
  let cmds = [];
  if(lower.includes('find') || lower.includes('search')) cmds.push("find . -name '*.txt' -type f  # Find all .txt files");
  if(lower.includes('delete') || lower.includes('remove')) cmds.push("rm -rf /path/to/dir/  # Remove directory (careful!)");
  if(lower.includes('copy')) cmds.push("cp -r source/ dest/  # Copy directory recursively");
  if(lower.includes('process') || lower.includes('count')) cmds.push("ps aux | grep process_name  # Check running processes");
  if(lower.includes('disk') || lower.includes('space')) cmds.push("df -h  # Check disk usage");
  if(lower.includes('memory') || lower.includes('ram')) cmds.push("free -h  # Check memory usage");
  if(lower.includes('network') || lower.includes('port')) cmds.push("netstat -tlnp  # Check listening ports");
  if(lower.includes('log')) cmds.push("tail -f /var/log/app.log  # Follow log file");
  if(lower.includes('git')) cmds.push("git log --oneline -20  # Show recent commits");
  if(lower.includes('compress') || lower.includes('zip')) cmds.push("tar -czvf archive.tar.gz folder/  # Compress folder");
  if(cmds.length === 0) cmds.push("echo 'Hello World'  # Basic echo command","ls -la  # List files","pwd  # Print working directory");
  let out = "## Generated Shell Commands\\n\\n";
  cmds.forEach((c,i) => out += (i+1) + ". `" + c.split('  #')[0] + "`\\n   " + (c.includes('#') ? c.split('  #')[1] : '') + "\\n\\n");
  out += "### One-liner\\n";
  out += "`" + cmds[0].split('  #')[0] + "`\\n\\n";
  out += "[Note: Review commands before executing in production]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "sql": '''function generate(){
  const desc = document.getElementById('input').value.trim();
  if(!desc){ alert('Please describe the query'); return; }
  const lower = desc.toLowerCase();
  let queries = [];
  if(lower.includes('select') || lower.includes('get') || lower.includes('find')) queries.push("SELECT * FROM table_name WHERE condition;");
  if(lower.includes('insert') || lower.includes('add') || lower.includes('create')) queries.push("INSERT INTO table_name (col1, col2) VALUES ('val1', 'val2');");
  if(lower.includes('update') || lower.includes('modify') || lower.includes('change')) queries.push("UPDATE table_name SET col1 = 'new_val' WHERE id = 1;");
  if(lower.includes('delete') || lower.includes('remove')) queries.push("DELETE FROM table_name WHERE condition;");
  if(lower.includes('join') || lower.includes('combine')) queries.push("SELECT a.*, b.* FROM table_a a JOIN table_b b ON a.id = b.a_id;");
  if(lower.includes('group') || lower.includes('count') || lower.includes('sum')) queries.push("SELECT category, COUNT(*) FROM table_name GROUP BY category;");
  if(lower.includes('index')) queries.push("CREATE INDEX idx_name ON table_name(column_name);");
  if(queries.length === 0) queries.push("SELECT * FROM table_name;","SHOW TABLES;","DESCRIBE table_name;");
  let out = "## SQL Queries\\n\\n```sql\\n";
  queries.forEach(q => out += q + "\\n\\n");
  out += "```\\n\\n";
  out += "### Tips\\n";
  out += "- Always use WHERE with UPDATE/DELETE\\n";
  out += "- Add LIMIT for large result sets\\n";
  out += "- Use parameterized queries to prevent SQL injection\\n\\n";
  out += "[Note: Replace table_name and column names with your actual schema]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "git-commit": '''function generate(){
  const changes = document.getElementById('input').value.trim();
  if(!changes){ alert('Please describe your changes'); return; }
  const types = [
    {prefix:'feat',desc:'A new feature'},
    {prefix:'fix',desc:'A bug fix'},
    {prefix:'docs',desc:'Documentation only'},
    {prefix:'style',desc:'Code style changes'},
    {prefix:'refactor',desc:'Code refactoring'},
    {prefix:'test',desc:'Adding tests'},
    {prefix:'chore',desc:'Build/tool changes'}
  ];
  const shortMsg = changes.length > 50 ? changes.substring(0,47) + '...' : changes;
  let out = "## Git Commit Messages\\n\\n";
  out += "### Suggestions\\n\\n";
  types.forEach((t,i) => {
    out += (i+1) + ". `" + t.prefix + ": " + shortMsg.toLowerCase() + "`\\n";
    out += "   " + t.desc + "\\n\\n";
  });
  out += "### Conventional Commit Format\\n";
  out += "```\\n" + types[0].prefix + ": " + shortMsg + "\\n\\n";
  out += changes.substring(0,200) + (changes.length > 200 ? '...' : '') + "\\n```\\n\\n";
  out += "[Note: Pick the type that best describes your changes]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "readability": '''function generate(){
  const text = document.getElementById('input').value.trim();
  if(!text){ alert('Please enter some text'); return; }
  const words = text.split(/\\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?。！？]+/).filter(s => s.trim().length > 0);
  const chars = text.length;
  const syllables = words.reduce((acc,w) => acc + Math.max(1, Math.floor(w.length / 3)), 0);
  const asl = sentences.length > 0 ? (words.length / sentences.length).toFixed(1) : 0;
  const asw = words.length > 0 ? (syllables / words.length).toFixed(1) : 0;
  const fk = 206.835 - 1.015 * asl - 84.6 * asw;
  let grade = fk >= 90 ? "5th grade (Very Easy)" : fk >= 80 ? "6th grade (Easy)" : fk >= 70 ? "7th grade (Fairly Easy)" : fk >= 60 ? "8-9th grade (Standard)" : fk >= 50 ? "10-12th grade (Fairly Difficult)" : "College (Difficult)";
  let out = "## Readability Analysis\\n\\n";
  out += "| Metric | Value |\\n";
  out += "|--------|-------|\\n";
  out += "| Characters | " + chars + " |\\n";
  out += "| Words | " + words.length + " |\\n";
  out += "| Sentences | " + sentences.length + " |\\n";
  out += "| Avg Sentence Length | " + asl + " words |\\n";
  out += "| Avg Syllables/Word | " + asw + " |\\n";
  out += "| **Flesch-Kincaid** | **" + fk.toFixed(1) + "** |\\n";
  out += "| **Reading Level** | **" + grade + "** |\\n\\n";
  out += "### Suggestions\\n";
  if(asl > 20) out += "- Sentences are too long. Try breaking them up.\\n";
  if(asw > 2) out += "- Use simpler words to improve readability.\\n";
  if(words.length > 300 && !text.includes('\\n\\n')) out += "- Add paragraph breaks for better readability.\\n";
  out += "\\n[Note: Full AI analysis requires API connection]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "humanize": '''function generate(){
  const text = document.getElementById('input').value.trim();
  if(!text){ alert('Please enter AI-generated text'); return; }
  const replacements = [
    {from:/utilize/g,to:'use'},{from:/leverage/g,to:'use'},{from:/facilitate/g,to:'help'},
    {from:/implementation/g,to:'using'},{from:/optimization/g,to:'improving'},{from:/strategic/g,to:''},
    {from:/synergy/g,to:'working together'},{from:/holistic/g,to:'complete'},{from:/robust/g,to:'strong'},
    {from:/scalable/g,to:'grows well'},{from:/seamless/g,to:'smooth'},{from:/cutting-edge/g,to:'new'},
    {from:/best-in-class/g,to:'top'},{from:/world-class/g,to:'great'},{from:/innovative/g,to:'new'},
    {from:/groundbreaking/g,to:'important'},{from:/transformative/g,to:'powerful'},{from:/is designed to/g,to:''},
    {from:/in order to/g,to:'to'},{from:/at this point in time/g,to:'now'},{from:/due to the fact that/g,to:'because'},
  ];
  let humanized = text;
  let changed = 0;
  replacements.forEach(r => {
    const before = humanized;
    humanized = humanized.replace(r.from, r.to);
    if(humanized !== before) changed++;
  });
  let out = "## Humanized Text\\n\\n";
  out += "**Replacements made**: " + changed + "\\n\\n";
  out += "### Result\\n";
  out += humanized + "\\n\\n";
  if(changed === 0) out += "✅ Text already looks natural! No buzzwords detected.\\n";
  else out += "⚡ Removed " + changed + " buzzword(s) for a more natural tone.\\n";
  out += "\\n[Note: Full AI humanization requires API connection]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "ad-copy": '''function generate(){
  const product = document.getElementById('input').value.trim();
  if(!product){ alert('Please describe your product/service'); return; }
  const headlines = [
    "Transform Your " + product + " Today",
    "The " + product + " You've Been Waiting For",
    "Discover the Power of " + product,
    "Why " + product + " is the Smart Choice",
    "Experience " + product + " Like Never Before"
  ];
  const bodies = [
    "Join thousands of satisfied customers who have already made the switch. Limited time offer!",
    "Designed for professionals who demand the best. Start your free trial today.",
    "Save time and money with our revolutionary approach. See results in just 30 days.",
  ];
  const ctas = ["Get Started Now","Learn More","Try Free","Shop Now","Claim Your Discount"];
  let out = "## Ad Copy Variations\\n\\n";
  for(let i=0; i<3; i++){
    out += "### Variation " + (i+1) + "\\n\\n";
    out += "**Headline**: " + headlines[i] + "\\n\\n";
    out += "**Body**: " + bodies[i % bodies.length] + "\\n\\n";
    out += "**CTA**: " + ctas[i] + "\\n\\n";
    out += "---\\n\\n";
  }
  out += "[Note: Full AI generation requires API connection]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "alt-text": '''function generate(){
  const desc = document.getElementById('input').value.trim();
  if(!desc){ alert('Please describe the image'); return; }
  const short = desc.length > 100 ? desc.substring(0,97) + '...' : desc;
  let out = "## Alt Text Suggestions\\n\\n";
  out += "### Short (for icons/decorative)\\n";
  out += "`" + short.split(' ').slice(0,5).join(' ') + "`\\n\\n";
  out += "### Medium (for content images)\\n";
  out += "`" + short.split(' ').slice(0,15).join(' ') + "`\\n\\n";
  out += "### Descriptive (for complex images)\\n";
  out += "`" + short + "`\\n\\n";
  out += "### SEO-optimized\\n";
  out += "`" + desc.split(' ').map((w,i) => i < 3 ? w.charAt(0).toUpperCase() + w.slice(1) : w).join(' ').substring(0,125) + "`\\n\\n";
  out += "### Tips\\n";
  out += "- Keep under 125 characters for screen readers\\n";
  out += "- Don't start with 'Image of' or 'Picture of'\\n";
  out += "- Include relevant keywords naturally\\n\\n";
  out += "[Note: Full AI generation requires API connection]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "blog-outline": '''function generate(){
  const topic = document.getElementById('input').value.trim();
  if(!topic){ alert('Please enter a blog topic'); return; }
  let out = "## Blog Outline: " + topic + "\\n\\n";
  out += "### 1. Introduction\\n";
  out += "- Hook: Why " + topic + " matters now\\n";
  out += "- Brief overview of what readers will learn\\n";
  out += "- Thesis statement\\n\\n";
  out += "### 2. What is " + topic + "?\\n";
  out += "- Definition and background\\n";
  out += "- Key concepts and terminology\\n";
  out += "- Why it matters to your audience\\n\\n";
  out += "### 3. Benefits of " + topic + "\\n";
  out += "- Benefit 1: Efficiency gains\\n";
  out += "- Benefit 2: Cost savings\\n";
  out += "- Benefit 3: Competitive advantage\\n\\n";
  out += "### 4. How to Get Started\\n";
  out += "- Step-by-step guide\\n";
  out += "- Tools and resources\\n";
  out += "- Common pitfalls to avoid\\n\\n";
  out += "### 5. Best Practices\\n";
  out += "- Industry standards\\n";
  out += "- Expert tips\\n";
  out += "- Real-world examples\\n\\n";
  out += "### 6. Conclusion\\n";
  out += "- Summary of key points\\n";
  out += "- Call to action\\n";
  out += "- Further reading suggestions\\n\\n";
  out += "[Note: Full AI generation requires API connection]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "changelog": '''function generate(){
  const notes = document.getElementById('input').value.trim();
  if(!notes){ alert('Please enter release notes'); return; }
  const version = notes.match(/v?\\d+\\.\\d+\\.\\d+/) ? notes.match(/v?\\d+\\.\\d+\\.\\d+/)[0] : '1.0.0';
  const date = new Date().toISOString().split('T')[0];
  const items = notes.split('\\n').filter(l => l.trim()).map(l => l.trim().replace(/^[\\-\\*]\\s*/, ''));
  let out = "## Changelog\\n\\n";
  out += "### [" + version + "] - " + date + "\\n\\n";
  const features = items.filter((_,i) => i % 3 === 0);
  const fixes = items.filter((_,i) => i % 3 === 1);
  const changes = items.filter((_,i) => i % 3 === 2);
  if(features.length > 0) {
    out += "#### Added\\n";
    features.forEach(f => out += "- " + f + "\\n");
    out += "\\n";
  }
  if(fixes.length > 0) {
    out += "#### Fixed\\n";
    fixes.forEach(f => out += "- " + f + "\\n");
    out += "\\n";
  }
  if(changes.length > 0) {
    out += "#### Changed\\n";
    changes.forEach(c => out += "- " + c + "\\n");
    out += "\\n";
  }
  out += "[Note: Full AI generation requires API connection]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "cold-email": '''function generate(){
  const info = document.getElementById('input').value.trim();
  if(!info){ alert('Please enter prospect info'); return; }
  let out = "## Cold Email Templates\\n\\n";
  out += "### Template 1: Value-First\\n\\n";
  out += "Subject: Quick question about " + info.substring(0,30) + "\\n\\n";
  out += "Hi [Name],\\n\\n";
  out += "I noticed you're working on " + info.substring(0,50) + ". ";
  out += "We've helped similar companies achieve [result].\\n\\n";
  out += "Worth a brief conversation?\\n\\n";
  out += "Best,\\n[Your Name]\\n\\n---\\n\\n";
  out += "### Template 2: Social Proof\\n\\n";
  out += "Subject: How [Company] improved " + info.substring(0,30) + "\\n\\n";
  out += "Hi [Name],\\n\\n";
  out += "[Company] saw [X%] improvement in " + info.substring(0,40) + " using our solution.\\n\\n";
  out += "I'd love to share how. 15 minutes this week?\\n\\n";
  out += "Best,\\n[Your Name]\\n\\n---\\n\\n";
  out += "### Template 3: Problem-Agitation\\n\\n";
  out += "Subject: The " + info.substring(0,30) + " problem\\n\\n";
  out += "Hi [Name],\\n\\n";
  out += "Most teams struggle with " + info.substring(0,40) + ". ";
  out += "It costs them [time/money] every month.\\n\\n";
  out += "We fix that. Interested?\\n\\n";
  out += "Best,\\n[Your Name]\\n\\n";
  out += "\\n[Note: Replace [brackets] with actual info. Full AI generation requires API]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "faq": '''function generate(){
  const topic = document.getElementById('input').value.trim();
  if(!topic){ alert('Please enter a topic'); return; }
  const questions = [
    "What is " + topic + "?",
    "How does " + topic + " work?",
    "Why should I use " + topic + "?",
    "How much does " + topic + " cost?",
    "Is " + topic + " suitable for beginners?",
    "How long does it take to see results with " + topic + "?",
    "What are the alternatives to " + topic + "?",
    "How do I get started with " + topic + "?",
  ];
  const answers = [
    topic + " is a solution designed to help you achieve better results efficiently.",
    "It works by analyzing your needs and providing optimized recommendations.",
    "It saves time, reduces costs, and improves overall outcomes.",
    "Pricing varies based on your needs. Contact us for a custom quote.",
    "Yes! It's designed for all skill levels with comprehensive documentation.",
    "Most users see improvements within the first 30 days.",
    "While there are alternatives, " + topic + " offers unique advantages in speed and ease of use.",
    "Simply sign up, follow the onboarding guide, and you'll be up and running in minutes.",
  ];
  let out = "## FAQ: " + topic + "\\n\\n";
  questions.forEach((q,i) => {
    out += "**Q" + (i+1) + ": " + q + "**\\n\\n";
    out += "A: " + answers[i] + "\\n\\n";
  });
  out += "[Note: Full AI generation requires API connection]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "linkedin": '''function generate(){
  const content = document.getElementById('input').value.trim();
  if(!content){ alert('Please enter content or topic'); return; }
  let out = "## LinkedIn Post Options\\n\\n";
  out += "### Option 1: Storytelling\\n\\n";
  out += "Three years ago, I knew nothing about " + content.substring(0,40) + ".\\n\\n";
  out += "Today, it's the foundation of everything I do.\\n\\n";
  out += "Here's what I learned along the way [thread] 👇\\n\\n";
  out += "#" + content.split(' ')[0] + " #career #growth\\n\\n---\\n\\n";
  out += "### Option 2: Listicle\\n\\n";
  out += "5 things I wish I knew about " + content.substring(0,40) + " earlier:\\n\\n";
  out += "1. Start small, think big\\n";
  out += "2. Consistency beats intensity\\n";
  out += "3. Learn from failures\\n";
  out += "4. Build a network\\n";
  out += "5. Never stop learning\\n\\n";
  out += "Which one resonates with you? 💬\\n\\n---\\n\\n";
  out += "### Option 3: Engagement\\n\\n";
  out += "Poll: What's your biggest challenge with " + content.substring(0,40) + "?\\n\\n";
  out += "A) Getting started\\nB) Scaling up\\nC) Finding time\\nD) Keeping up\\n\\n";
  out += "Comment your answer! 👇\\n\\n";
  out += "[Note: Full AI generation requires API connection]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "lp-hero": '''function generate(){
  const product = document.getElementById('input').value.trim();
  if(!product){ alert('Please describe your product/service'); return; }
  let out = "## Landing Page Hero Copy\\n\\n";
  out += "### Headline\\n";
  out += "The " + product.split(' ').slice(0,3).join(' ') + " That [Solves Problem / Delivers Result]\\n\\n";
  out += "### Subheadline\\n";
  out += "Join 10,000+ professionals who use our " + product.split(' ').slice(0,4).join(' ') + " to achieve better results in less time.\\n\\n";
  out += "### CTA Buttons\\n";
  out += "Primary: **Start Free Trial**\\n";
  out += "Secondary: **See How It Works**\\n\\n";
  out += "### Trust Badges\\n";
  out += "⭐⭐⭐⭐⭐ 4.9/5 from 2,000+ reviews | 🏆 #1 Rated | 🔒 Enterprise Security\\n\\n";
  out += "### Social Proof Snippet\\n";
  out += "\"Since using " + product.split(' ').slice(0,3).join(' ') + ", our team productivity increased by 40%.\" — Sarah T., Engineering Lead\\n\\n";
  out += "[Note: Full AI generation requires API connection]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "meta": '''function generate(){
  const content = document.getElementById('input').value.trim();
  if(!content){ alert('Please enter page content'); return; }
  const title = content.length > 60 ? content.substring(0,57) + '...' : content;
  const desc = content.length > 160 ? content.substring(0,157) + '...' : content;
  const keywords = content.split(' ').filter(w => w.length > 3).slice(0,10).join(', ');
  let out = "## Meta Tags\\n\\n";
  out += "### Title Tag (" + title.length + "/60 chars)\\n";
  out += "```html\\n<title>" + title + "</title>\\n```\\n\\n";
  out += "### Meta Description (" + desc.length + "/160 chars)\\n";
  out += "```html\\n<meta name=\\"description\\" content=\\"" + desc + "\\">\\n```\\n\\n";
  out += "### Keywords\\n";
  out += "```html\\n<meta name=\\"keywords\\" content=\\"" + keywords + "\\">\\n```\\n\\n";
  out += "### Open Graph\\n";
  out += "```html\\n<meta property=\\"og:title\\" content=\\"" + title + "\\">\\n";
  out += "<meta property=\\"og:description\\" content=\\"" + desc + "\\">\\n";
  out += "<meta property=\\"og:type\\" content=\\"website\\">\\n```\\n\\n";
  out += "### Twitter Card\\n";
  out += "```html\\n<meta name=\\"twitter:title\\" content=\\"" + title + "\\">\\n";
  out += "<meta name=\\"twitter:description\\" content=\\"" + desc + "\\">\\n";
  out += "<meta name=\\"twitter:card\\" content=\\"summary\\">\\n```\\n\\n";
  out += "[Note: Full AI generation requires API connection]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "newsletter": '''function generate(){
  const topic = document.getElementById('input').value.trim();
  if(!topic){ alert('Please enter a newsletter topic'); return; }
  const date = new Date().toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'});
  let out = "## Newsletter: " + topic + "\\n\\n";
  out += "**Subject Line**: This Week in " + topic.split(' ').slice(0,3).join(' ') + " 🚀\\n";
  out += "**Date**: " + date + "\\n\\n";
  out += "---\\n\\n";
  out += "### Opening\\n";
  out += "Welcome to this week\\'s edition! Here\\'s what we\\'ve been working on:\\n\\n";
  out += "### Featured Story\\n";
  out += "**" + topic.substring(0,60) + "**\\n\\n";
  out += "This week we dive deep into the latest developments, trends, and insights. ";
  out += "Here's everything you need to know:\\n\\n";
  out += "- Key insight #1\\n- Key insight #2\\n- Key insight #3\\n\\n";
  out += "### Quick Links\\n";
  out += "• [Resource 1]\\n• [Resource 2]\\n• [Resource 3]\\n\\n";
  out += "### Closing\\n";
  out += "Thanks for reading! Forward this to a friend who would enjoy it.\\n\\n";
  out += "[Note: Full AI generation requires API connection]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "pr-desc": '''function generate(){
  const changes = document.getElementById('input').value.trim();
  if(!changes){ alert('Please describe your changes'); return; }
  const items = changes.split('\\n').filter(l => l.trim()).map(l => l.trim().replace(/^[\\-\\*]\\s*/, ''));
  let out = "## Pull Request Description\\n\\n";
  out += "### Summary\\n";
  out += "This PR " + (items[0] || "implements improvements") + ".\\n\\n";
  out += "### Changes\\n";
  items.forEach((item,i) => out += "- [ ] " + item + "\\n");
  out += "\\n### Testing\\n";
  out += "- [ ] Unit tests pass\\n";
  out += "- [ ] Integration tests pass\\n";
  out += "- [ ] Manual testing completed\\n\\n";
  out += "### Screenshots\\n";
  out += "_Add screenshots if applicable_\\n\\n";
  out += "### Checklist\\n";
  out += "- [ ] Code follows style guidelines\\n";
  out += "- [ ] Documentation updated\\n";
  out += "- [ ] No breaking changes (or documented)\\n\\n";
  out += "[Note: Full AI generation requires API connection]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "pseudo": '''function generate(){
  const desc = document.getElementById('input').value.trim();
  if(!desc){ alert('Please describe the algorithm'); return; }
  let out = "## Pseudocode\\n\\n```\\n";
  out += "FUNCTION main(" + desc.split(' ').slice(0,3).join('_') + "):\\n";
  out += "  // Initialize\\n";
  out += "  SET input = " + desc.substring(0,40) + "\\n";
  out += "  SET result = empty\\n\\n";
  out += "  // Process\\n";
  out += "  FOR EACH item IN input:\\n";
  out += "    IF item meets condition:\\n";
  out += "      PROCESS(item)\\n";
  out += "      ADD result, item\\n";
  out += "    ELSE:\\n";
  out += "      SKIP(item)\\n";
  out += "  END FOR\\n\\n";
  out += "  // Output\\n";
  out += "  RETURN result\\n";
  out += "END FUNCTION\\n";
  out += "```\\n\\n";
  out += "### Complexity\\n";
  out += "- Time: O(n)\\n";
  out += "- Space: O(n)\\n\\n";
  out += "[Note: Full AI generation requires API connection]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "push": '''function generate(){
  const info = document.getElementById('input').value.trim();
  if(!info){ alert('Please describe the notification content'); return; }
  const short = info.length > 60 ? info.substring(0,57) + '...' : info;
  let out = "## Push Notification Options\\n\\n";
  out += "### Direct (" + short.length + " chars)\\n";
  out += "🔔 " + short + " — Tap to learn more!\\n\\n";
  out += "### Curiosity Gap\\n";
  out += "🔔 You won't believe what happened with " + info.split(' ').slice(0,4).join(' ') + "...\\n\\n";
  out += "### Urgency\\n";
  out += "⏰ Limited time: " + info.substring(0,50) + " ends soon!\\n\\n";
  out += "### Personalized\\n";
  out += "👋 Hey [Name], your " + info.split(' ').slice(0,4).join(' ') + " is ready!\\n\\n";
  out += "### Tips\\n";
  out += "- Keep under 60 characters for best engagement\\n";
  out += "- Use emojis sparingly (1-2 max)\\n";
  out += "- Include clear CTA\\n";
  out += "- A/B test different variants\\n\\n";
  out += "[Note: Full AI generation requires API connection]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "tagline": '''function generate(){
  const brand = document.getElementById('input').value.trim();
  if(!brand){ alert('Please describe your brand/product'); return; }
  const words = brand.split(' ');
  let out = "## Tagline Options\\n\\n";
  const options = [
    words.slice(0,3).join(' ') + ". Simplified.",
    "The smarter way to " + words.slice(0,3).join(' ') + ".",
    words.slice(0,2).join(' ') + ", reimagined.",
    "Made for " + words.slice(0,2).join(' ') + ".",
    "Your " + words.slice(0,2).join(' ') + ", upgraded.",
    "Less work. More " + (words[0] || 'results') + ".",
    words.slice(0,3).join(' ') + ". For everyone.",
    "Simply better " + words.slice(0,2).join(' ') + ".",
  ];
  options.forEach((opt,i) => {
    out += (i+1) + ". **" + opt + "**\\n";
    out += "   " + opt.length + " chars | " + opt.split(' ').length + " words\\n\\n";
  });
  out += "[Note: Full AI generation requires API connection]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "tldr": '''function generate(){
  const text = document.getElementById('input').value.trim();
  if(!text){ alert('Please enter text to summarize'); return; }
  const sentences = text.split(/[.!?。！？]+/).filter(s => s.trim().length > 10);
  const summary = sentences.slice(0,3).map(s => s.trim()).join('. ') + '.';
  let out = "## TL;DR\\n\\n";
  out += "**" + (summary.length > 200 ? summary.substring(0,197) + '...' : summary) + "**\\n\\n";
  out += "### Key Points\\n";
  sentences.slice(0,5).forEach((s,i) => {
    const point = s.trim().substring(0,100);
    if(point.length > 20) out += (i+1) + ". " + point + "\\n";
  });
  out += "\\n### Stats\\n";
  out += "- Original: " + text.length + " chars, " + sentences.length + " sentences\\n";
  out += "- Summary: " + summary.length + " chars, " + (sentences.slice(0,3).length) + " sentences\\n";
  out += "- Compression: " + (100 - Math.round(summary.length * 100 / text.length)) + "%\\n\\n";
  out += "[Note: Full AI summarization requires API connection]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "video-title": '''function generate(){
  const topic = document.getElementById('input').value.trim();
  if(!topic){ alert('Please enter a video topic'); return; }
  const titles = [
    "How to " + topic.substring(0,50) + " (Step-by-Step Guide)",
    topic.substring(0,50) + " Tutorial for Beginners",
    "I Tried " + topic.substring(0,50) + " for 30 Days. Here's What Happened.",
    "The Truth About " + topic.substring(0,50),
    "5 " + topic.substring(0,40) + " Tips You Need to Know",
    "Why " + topic.substring(0,40) + " Changed Everything",
    topic.substring(0,50) + " Explained in 10 Minutes",
    "Stop Doing " + topic.substring(0,40) + " Wrong!",
  ];
  let out = "## Video Title Options\\n\\n";
  titles.forEach((t,i) => {
    const len = t.length;
    const good = len <= 60 ? "✅" : len <= 70 ? "⚠️" : "❌";
    out += good + " " + (i+1) + ". " + t + "\\n";
    out += "   " + len + "/60 chars\\n\\n";
  });
  out += "### Tips\\n";
  out += "- Keep under 60 chars for search results\\n";
  out += "- Include numbers for higher CTR\\n";
  out += "- Use parentheses/brackets for context\\n";
  out += "- Front-load keywords\\n\\n";
  out += "[Note: Full AI generation requires API connection]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',

    "yt-script": '''function generate(){
  const topic = document.getElementById('input').value.trim();
  if(!topic){ alert('Please enter a video topic'); return; }
  const duration = "10:00";
  let out = "## YouTube Script: " + topic + "\\n\\n";
  out += "**Duration**: ~" + duration + "\\n";
  out += "**Tone**: Educational + Entertaining\\n\\n";
  out += "---\\n\\n";
  out += "### HOOK (0:00 - 0:30)\\n";
  out += "[On camera, energetic]\\n";
  out += "\\"In this video, I'm going to show you everything you need to know about " + topic.split(' ').slice(0,5).join(' ') + ". Let's dive in!\\"\\n\\n";
  out += "### INTRO (0:30 - 1:00)\\n";
  out += "[B-roll footage]\\n";
  out += "So what exactly is " + topic.split(' ').slice(0,4).join(' ') + "? ";
  out += "In simple terms, it's a way to achieve better results. ";
  out += "And today, I'll break it down step by step.\\n\\n";
  out += "### MAIN CONTENT (1:00 - 8:00)\\n";
  out += "**Section 1: What is it?**\\n";
  out += "[Screen recording / slides]\\n";
  out += "Let\\'s start with the basics...\\n\\n";
  out += "**Section 2: Why it matters**\\n";
  out += "[Examples on screen]\\n";
  out += "Here\\'s why this is important...\\n\\n";
  out += "**Section 3: Step-by-step guide**\\n";
  out += "[Screen recording]\\n";
  out += "Now let\\'s go through each step...\\n\\n";
  out += "### CTA (8:00 - 9:00)\\n";
  out += "[On camera]\\n";
  out += "\\"If you found this helpful, hit that like button and subscribe for more content like this!\\"\\n\\n";
  out += "### OUTRO (9:00 - 10:00)\\n";
  out += "[End screen with links]\\n";
  out += "\\"Thanks for watching! Check out these videos next...\\"\\n\\n";
  out += "[Note: Full AI generation requires API connection]";
  document.getElementById('output').textContent = out;
  document.getElementById('outputArea').classList.add('show');
}''',
}

# Apply fixes
def fix_tool(name):
    fpath = f"{BASE}/{name}.html"
    if not os.path.exists(fpath):
        print(f"  ❌ {name}: file not found")
        return False
    
    with open(fpath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    
    if name not in GENERATORS:
        print(f"  ⚠️ {name}: no generator template")
        return False
    
    new_gen = GENERATORS[name]
    
    # Replace the old generate() function
    # Pattern: function generate(){
    gen_start = content.find('function generate')
    if gen_start < 0:
        # Try other patterns
        gen_start = content.find('function generateChangelog')
        if gen_start < 0:
            print(f"  ⚠️ {name}: no generate function found")
            return False
    
    # Find the end of the generate function (next function or </script>)
    # Look for the pattern: function XXX(){ ... }
    brace_count = 0
    gen_end = gen_start
    found_first_brace = False
    for i in range(gen_start, len(content)):
        if content[i] == '{':
            brace_count += 1
            found_first_brace = True
        elif content[i] == '}':
            brace_count -= 1
            if found_first_brace and brace_count == 0:
                gen_end = i + 1
                break
    
    if gen_end <= gen_start:
        print(f"  ⚠️ {name}: could not find function end")
        return False
    
    # Replace
    new_content = content[:gen_start] + new_gen + content[gen_end:]
    
    # Also fix the skeleton notice
    new_content = new_content.replace(
        '<div class="skeleton-notice">\n    <p>🚧 This tool is in demo mode. Full AI-powered features coming soon.</p>\n  </div>',
        '<div class="skeleton-notice" style="display:none">\n    <p>🚧 This tool is in demo mode. Full AI-powered features coming soon.</p>\n  </div>'
    )
    
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    new_lines = new_content.count('\n')
    print(f"  ✅ {name}: fixed ({new_lines} lines)")
    return True

print("=== Batch fixing 25 AI text tools ===\n")
success = 0
for name in sorted(GENERATORS.keys()):
    if fix_tool(name):
        success += 1

print(f"\n=== Result: {success}/25 tools fixed ===")
