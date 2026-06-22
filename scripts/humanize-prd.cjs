/**
 * Humanize the design-refresh PRD markdown by calling the LLM API.
 * Usage: OPENAI_API_KEY=xxx OPENAI_API_BASE_URL=xxx node scripts/humanize-prd.cjs
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, 'prd-design-refresh.md');
const OUTPUT = path.join(__dirname, 'prd-design-refresh-humanized.md');



const systemPrompt = `你是一位资深编辑，专门去掉文本里的 AI 味。改写时遵循以下原则：

1. 保持原意和原文语言，不添加解释，不总结。
2. 替换 AI 套话：不用"值得一提的是 / 显著地 / 此外 / 另外 / 综上所述 / leverage / robust / streamline / delve / facilitate / foster"等词。
3. 减少 hedging（软化词）：把"一般来说 / 通常情况下 / often / typically / in many cases / it is important to note that"换成直接断言；不确定时用人话表达，比如"我不太确定，但……"。
4. 增加人味：允许口语化连接词、第一/第二人称、反问、偶尔的自我纠正；让句子长短错落，不要一长串并列。
5. 不要 bullet、编号、"综上所述"或"In conclusion"。
6. 保留 Markdown 标题结构（# / ## / ###），只改写正文段落。`;

async function humanize(text) {
  // Use local dev server endpoint which already has the LLM proxy configured
  const res = await fetch('http://localhost:3000/api/ai-generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tool: 'humanize',
      locale: 'zh',
      inputs: { text },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.result || text;
}

function splitSections(markdown) {
  const lines = markdown.split('\n');
  const sections = [];
  let current = [];

  for (const line of lines) {
    if (line.startsWith('#')) {
      if (current.length > 0) {
        sections.push(current.join('\n'));
        current = [];
      }
      sections.push(line); // heading stays as-is
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) sections.push(current.join('\n'));
  return sections;
}

async function main() {
  const markdown = fs.readFileSync(INPUT, 'utf8');
  const sections = splitSections(markdown);
  const results = [];

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.startsWith('#') || section.trim().length < 20) {
      results.push(section);
      continue;
    }

    console.log(`Humanizing section ${i + 1}/${sections.length}...`);
    try {
      const rewritten = await humanize(section);
      results.push(rewritten);
    } catch (err) {
      console.error(`Section ${i + 1} failed:`, err.message);
      results.push(section);
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  fs.writeFileSync(OUTPUT, results.join('\n\n'), 'utf8');
  console.log(`Done. Output: ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
