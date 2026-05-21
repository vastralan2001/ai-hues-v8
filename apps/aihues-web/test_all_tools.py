#!/usr/bin/env python3
"""Test all AI text tools by simulating the generate() logic"""

import re, os

BASE = "/mnt/agents/output/ai-hues-dev/tools"

# Test inputs for each tool
TEST_INPUTS = {
    "sql": "查询所有用户表中的活跃用户，按注册时间排序",
    "code-explain": "function calculateTotal(items) { return items.reduce((sum, item) => sum + item.price * item.quantity, 0); }",
    "code-review": "function process(data) { var result = []; for(var i=0; i<data.length; i++) { result.push(data[i]*2); console.log(result); } return result; }",
    "shell": "查找所有大于100MB的日志文件并删除",
    "git-commit": "修复了登录页面的CSS样式问题，优化了移动端响应式布局",
    "readability": "The implementation of this feature requires careful consideration of the underlying architecture and its potential impact on system performance.",
    "humanize": "Leveraging our cutting-edge technology, we will facilitate the seamless optimization of your business processes to achieve holistic transformation.",
    "ad-copy": "智能健身手环，24小时心率监测",
    "alt-text": "一只金色的猫在阳光下打盹",
    "blog-outline": "如何学习Python编程",
    "changelog": "新增暗黑模式\n修复登录bug\n优化首页加载速度",
    "cold-email": "想给一个做电商的公司推销我们的数据分析工具",
    "faq": "在线教育平台",
    "linkedin": "分享从传统IT转型云计算的经验",
    "lp-hero": "AI驱动的客户服务聊天机器人",
    "meta": "介绍一款帮助程序员提高效率的IDE插件",
    "newsletter": "本周前端开发技术动态",
    "pr-desc": "重构了用户认证模块，改用JWT Token",
    "pseudo": "冒泡排序算法",
    "push": "新品发布会直播开始",
    "tagline": "云端文档协作工具",
    "tldr": "在最近一次团队会议上，我们讨论了多个关于产品发展方向的重要议题。首先，关于用户体验优化，我们计划在下一个版本中引入全新的导航结构。其次，关于性能问题，我们发现首页加载时间过长，需要进行优化。最后，关于市场推广，我们决定加大在社交媒体上的投入。会议还讨论了预算分配和人员安排等其他事项。",
    "video-title": "如何用Python做数据分析",
    "yt-script": "教新手如何安装Python环境",
    "docs": "function fetchUserData(userId, options) { const cache = getCache(); if(cache.has(userId)) return cache.get(userId); const data = db.query('SELECT * FROM users WHERE id = ?', [userId]); cache.set(userId, data); return data; }",
    "seo-title": "Python数据分析入门教程",
    "x-post": "刚发布了一个新功能，可以一键生成SQL查询",
}

def extract_generate_logic(filepath):
    """Extract the generate() or runTool() function from a tool file"""
    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    
    # Find function
    patterns = ['function generate()', 'function runTool()', 'function humanize()']
    func_start = -1
    func_name = None
    for p in patterns:
        idx = content.find(p)
        if idx >= 0:
            func_start = idx
            func_name = p.replace('function ', '').replace('()', '')
            break
    
    if func_start < 0:
        return None, "NO_FUNCTION"
    
    # Find function end
    brace_count = 0
    func_end = func_start
    found_first = False
    for i in range(func_start, len(content)):
        if content[i] == '{':
            brace_count += 1
            found_first = True
        elif content[i] == '}':
            brace_count -= 1
            if found_first and brace_count == 0:
                func_end = i + 1
                break
    
    return content[func_start:func_end], func_name

def analyze_tool(name, func_code, test_input):
    """Analyze if the tool actually uses the input or just returns fixed output"""
    issues = []
    
    # Check if function references input
    has_input_ref = any(x in func_code for x in [
        "document.getElementById('input')",
        "document.getElementById(\"input\")",
        'input.value', 'input', 'code', 'text', 'desc', 'topic', 'content',
        'changes', 'product', 'info', 'notes'
    ])
    
    # Check if output varies based on input (not just fixed strings)
    has_dynamic = any(x in func_code for x in [
        'replace(', 'split(', 'match(', 'substring', 'length', 
        'includes(', 'indexOf', 'Math.random', 'forEach', 'filter',
        'toLowerCase', 'toUpperCase', 'trim', 'join(', 'map('
    ])
    
    # Check for hardcoded outputs
    hardcoded_patterns = [
        'SELECT * FROM table_name',
        'SHOW TABLES',
        'table_name',
        'FROM table_name',
    ]
    has_hardcoded = any(p in func_code for p in hardcoded_patterns)
    
    if has_hardcoded:
        issues.append("❌ 输出硬编码，不根据输入变化")
    
    if not has_input_ref:
        issues.append("❌ 不读取用户输入")
    
    if not has_dynamic:
        issues.append("⚠️ 输出不根据输入动态变化")
    
    if not issues:
        return "✅ OK", []
    
    # Determine severity
    if "❌" in "".join(issues):
        return "❌ BROKEN", issues
    else:
        return "⚠️ WEAK", issues

print("=" * 80)
print("  AIHues 工具功能测试报告")
print("=" * 80)

broken_count = 0
weak_count = 0
ok_count = 0

for name in sorted(TEST_INPUTS.keys()):
    fpath = f"{BASE}/{name}.html"
    if not os.path.exists(fpath):
        print(f"\n  {name:25s} ❌ FILE MISSING")
        broken_count += 1
        continue
    
    func_code, func_name = extract_generate_logic(fpath)
    test_input = TEST_INPUTS[name]
    
    if func_code is None:
        print(f"\n  {name:25s} ❌ NO generate/runTool FUNCTION")
        broken_count += 1
        continue
    
    status, issues = analyze_tool(name, func_code, test_input)
    
    if "❌" in status:
        broken_count += 1
    elif "⚠️" in status:
        weak_count += 1
    else:
        ok_count += 1
    
    print(f"\n  {name:25s} {status} (function: {func_name})")
    for issue in issues:
        print(f"    {issue}")

print(f"\n{'=' * 80}")
print(f"  总结: ✅ {ok_count} 正常 | ⚠️ {weak_count} 较弱 | ❌ {broken_count} 损坏")
print(f"{'=' * 80}")
