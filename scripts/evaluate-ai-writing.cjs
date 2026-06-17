const fs = require('fs');
const path = require('path');

const API_URL =
  process.env.AIHUES_EVAL_API_URL || 'http://localhost:3000/api/ai-generate';
const LOCALE = 'zh';

const testCases = [
  {
    tool: 'humanize',
    inputs: {
      text: '在当今数字化转型的浪潮中，企业必须 leveraging 云计算、大数据和人工智能等 robust 技术，才能 streamline 业务流程并提升核心竞争力。值得注意的是，这不仅是技术升级，更是组织能力的全面提升。',
    },
  },
  {
    tool: 'ad-copy',
    inputs: {
      product: '智能日程助手 App',
      audience: '25-35 岁职场人',
    },
  },
  {
    tool: 'blog-outline',
    inputs: {
      topic: 'AI 工具如何提升远程团队效率',
      audience: '团队负责人',
    },
  },
  {
    tool: 'changelog',
    inputs: {
      version: '2.0',
      changes:
        '新增 Campaign 工作流；新增 Agent UI；工具数量扩展到 58 个；优化移动端搜索体验；修复部分工具暗色模式显示问题',
    },
  },
  {
    tool: 'code-explain',
    inputs: {
      language: 'JavaScript',
      code: `function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}`,
    },
  },
  {
    tool: 'cold-email',
    inputs: {
      recipient: '海外科技博主',
      product: 'AIHues 出海营销工具站',
      purpose: '邀请体验并撰写评测',
    },
  },
  {
    tool: 'docs',
    inputs: {
      product: 'AIHues Campaign API',
      params: 'goal, locale, steps',
    },
  },
  {
    tool: 'faq',
    inputs: {
      product: 'AIHues',
      questions: 'AIHues 和其他 AI 写作工具有什么区别？数据是否安全？',
    },
  },
  {
    tool: 'linkedin',
    inputs: {
      topic: 'AI 工具对出海营销团队的价值',
      tone: '专业',
    },
  },
  {
    tool: 'lp-hero',
    inputs: {
      product: 'AIHues',
      benefit: '让出海营销团队 10 分钟生成一套 campaign 物料',
    },
  },
  {
    tool: 'meta',
    inputs: {
      topic: 'AIHues — 出海营销 AI 工具站',
      keyword: 'AI 写作工具',
    },
  },
  {
    tool: 'newsletter',
    inputs: {
      topic: '本周推荐：5 个提升邮件回复率的 AI 工具',
      audience: '出海营销人',
    },
  },
  {
    tool: 'pr-desc',
    inputs: {
      changes:
        '新增 Campaign 工作流；支持 Agent 多步生成；优化 prompt 输出格式',
    },
  },
  {
    tool: 'pseudo',
    inputs: {
      code: `function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}`,
    },
  },
  {
    tool: 'push',
    inputs: {
      product: 'AIHues',
      scenario: '新工具上线',
    },
  },
  {
    tool: 'seo-title',
    inputs: {
      keyword: 'AI 写作工具',
      topic: '提升文案效率',
    },
  },
  {
    tool: 'tagline',
    inputs: {
      brand: 'AIHues',
      benefit: '出海营销 AI 工具站',
    },
  },
  {
    tool: 'tldr',
    inputs: {
      text: `近年来，AI 写作工具已经成为出海营销团队的重要生产力工具。它们不仅能快速生成广告文案、邮件主题、社交媒体帖子，还能根据不同的目标受众自动调整语气和表达方式。然而，许多团队在实际使用中发现，AI 生成的内容往往带有明显的"AI 味"，缺乏品牌个性和真实感。为了解决这一问题，越来越多的团队开始将 AI 工具与人类编辑相结合，通过人工润色和注入真实案例，使内容更具说服力。此外，随着大模型能力的提升，未来的 AI 写作工具将更加注重上下文理解、品牌一致性以及多语言本地化能力，从而帮助企业在全球市场中建立统一且有温度的品牌形象。`,
    },
  },
  {
    tool: 'video-title',
    inputs: {
      topic: '5 个 AI 工具实测',
      style: '教程',
    },
  },
  {
    tool: 'x-post',
    inputs: {
      topic: 'AIHues 新增 Campaign 工作流',
      tone: '专业',
    },
  },
  {
    tool: 'yt-script',
    inputs: {
      topic: '5 个提升出海邮件回复率的技巧',
      duration: '8 分钟',
    },
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callTool(testCase, index) {
  const start = Date.now();
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool: testCase.tool,
        locale: LOCALE,
        inputs: testCase.inputs,
      }),
    });
    const latency = Date.now() - start;
    if (!res.ok) {
      const err = await res.text();
      return {
        index,
        tool: testCase.tool,
        ok: false,
        status: res.status,
        error: err,
        latency,
      };
    }
    const data = await res.json();
    return {
      index,
      tool: testCase.tool,
      ok: true,
      result: data.result || '',
      latency,
    };
  } catch (err) {
    return {
      index,
      tool: testCase.tool,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      latency: Date.now() - start,
    };
  }
}

async function waitForServer(retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch('http://localhost:3000');
      if (res.ok || res.status < 500) return true;
    } catch {
      // not ready yet
    }
    await sleep(1000);
  }
  return false;
}

function formatInputs(inputs) {
  return Object.entries(inputs)
    .map(([k, v]) => `- **${k}**: ${String(v).slice(0, 400)}`)
    .join('\n');
}

function buildMarkdown(results) {
  const date = new Date().toISOString().slice(0, 10);
  const total = results.length;
  const success = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  const avgLatency = Math.round(
    results.reduce((sum, r) => sum + (r.latency || 0), 0) / total
  );

  let md = `# AI 写作工具输出效果评估 — ${date}

> 模型：Kimi via 千循代理（环境变量 \`KIMI_API_MODEL\`）
> 接口：\`${API_URL}\`
> 语言：\`${LOCALE}\`
> 工具数：${total} | 成功：${success} | 失败：${failed} | 平均延迟：${avgLatency}ms

## 评估说明

- 每个工具使用一组固定、贴近真实场景的测试输入。
- 输出由当前 \`app/lib/ai-prompts.ts\` 的 prompt 生成，未做人工修改。
- 本报告用于快速发现：格式不听话、内容太 AI 味、创意不足、语言错乱、字段缺失等问题。

## 总体观察

<!-- 运行时自动生成占位，阅读时可手动补充 -->

- 待补充：整体风格一致性
- 待补充：中英文语言保持情况
- 待补充：格式 compliance 比例
- 待补充：最值得优先修复的 3 个工具

---

`;

  for (const r of results) {
    md += `## ${r.index + 1}. \`${r.tool}\`\n\n`;
    md += `**延迟**: ${r.latency}ms\n\n`;
    const testCase = testCases[r.index];
    md += `**输入**:\n${formatInputs(testCase.inputs)}\n\n`;
    if (r.ok) {
      md += `**输出**:\n\n\`\`\`\n${r.result}\n\`\`\`\n\n`;
    } else {
      md += `**错误**:\n\n\`\`\`\n${r.error}\n\`\`\`\n\n`;
    }
    md += `**人工评估（待填）**:\n- 格式合规：\n- 内容质量：\n- AI 味程度：\n- 主要问题：\n\n---\n\n`;
  }

  return md;
}

async function main() {
  console.log('等待开发服务器就绪...');
  const ready = await waitForServer();
  if (!ready) {
    console.error('服务器 30 秒内未就绪，退出。');
    process.exit(1);
  }
  console.log('服务器就绪，开始评估...');

  const results = [];
  for (let i = 0; i < testCases.length; i++) {
    const r = await callTool(testCases[i], i);
    results.push(r);
    console.log(
      `${i + 1}/${testCases.length} ${r.tool}: ${r.ok ? 'ok' : 'failed'} (${r.latency}ms)`
    );
    await sleep(500);
  }

  const md = buildMarkdown(results);
  const outPath = path.resolve(
    __dirname,
    '..',
    'docs',
    `ai-writing-evaluation-${new Date().toISOString().slice(0, 10)}.md`
  );
  fs.writeFileSync(outPath, md, 'utf8');
  console.log(`\n报告已生成: ${outPath}`);

  // 同时保存 JSON 原始结果便于后续分析
  const jsonPath = outPath.replace('.md', '.json');
  fs.writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        apiUrl: API_URL,
        locale: LOCALE,
        generatedAt: new Date().toISOString(),
        results,
      },
      null,
      2
    ),
    'utf8'
  );
  console.log(`原始数据: ${jsonPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
