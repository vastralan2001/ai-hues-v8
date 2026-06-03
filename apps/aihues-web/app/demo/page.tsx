'use client';

import { useEffect } from 'react';

export default function DemoPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    const onScroll = () => {
      const nav = document.querySelector('nav');
      const current = window.pageYOffset;
      if (current > 50) {
        nav?.classList.add('shadow-sm');
      } else {
        nav?.classList.remove('shadow-sm');
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      <style>{`
  :root {
    --amber: #b45309;
    --amber-light: #d97706;
    --surface: #faf9f6;
    --surface-dark: #1c1917;
    --text-primary: #1c1917;
    --text-secondary: #78716c;
    --border: #e8e2d9;
  }
  * { font-family: 'Inter', sans-serif; }
  .font-display { font-family: 'Space Grotesk', sans-serif; }

  /* Custom animations */
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  .animate-float { animation: float 3s ease-in-out infinite; }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(180,83,9,0.15); }
    50% { box-shadow: 0 0 40px rgba(180,83,9,0.3); }
  }
  .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }

  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .slide-in { animation: slideInUp 0.6s ease-out forwards; }

  /* Scroll reveal */
  .reveal { opacity: 0; transform: translateY(24px); transition: all 0.5s ease-out; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  /* Radar chart */
  .radar-polygon { fill: rgba(180,83,9,0.15); stroke: #b45309; stroke-width: 2; }
  .radar-dot { fill: #b45309; }

  /* Workflow connector */
  .workflow-step::after {
    content: '';
    position: absolute;
    right: -20px;
    top: 50%;
    width: 20px;
    height: 2px;
    background: linear-gradient(90deg, #b45309, #d97706);
  }
  .workflow-step:last-child::after { display: none; }

  /* Glass effect */
  .glass {
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  /* Dark gradient card */
  .gradient-dark {
    background: linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%);
  }

  /* Code block styling */
  .code-block {
    background: #1c1917;
    border-radius: 12px;
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 13px;
    line-height: 1.6;
  }

  /* Smooth scroll */
  html { scroll-behavior: smooth; }

  /* Custom scrollbar */
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #faf9f6; }
  ::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #a8a29e; }
`}</style>
      <div
        dangerouslySetInnerHTML={{
          __html: `<!-- ========== NAVIGATION ========== -->
<nav class="fixed top-0 left-0 right-0 z-50 glass border-b border-[#e8e2d9]">
  <div class="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#b45309] to-[#d97706] flex items-center justify-center text-white font-bold text-sm">AI</div>
      <span class="font-display font-bold text-lg tracking-tight">AIHues</span>
      <span class="hidden sm:inline text-xs px-2 py-0.5 rounded-full bg-[#b45309]/10 text-[#b45309] font-medium">Ultimate</span>
    </div>
    <div class="hidden md:flex items-center gap-6 text-sm font-medium text-[#57534e]">
      <a href="#workflows" class="hover:text-[#b45309] transition-colors">Workflows</a>
      <a href="#tools" class="hover:text-[#b45309] transition-colors">Tools</a>
      <a href="#reviews" class="hover:text-[#b45309] transition-colors">Reviews</a>
      <a href="#community" class="hover:text-[#b45309] transition-colors">Community</a>
      <a href="#api" class="hover:text-[#b45309] transition-colors">API</a>
      <a href="#pricing" class="hover:text-[#b45309] transition-colors">Pricing</a>
    </div>
    <div class="flex items-center gap-3">
      <div class="hidden sm:flex items-center gap-1.5 rounded-full border border-[#e8e2d9] bg-white px-3 py-1.5 text-xs font-semibold">
        <span class="text-base">🪙</span>
        <span>100</span>
      </div>
      <button class="hidden sm:block text-xs px-3 py-1.5 rounded-lg border border-[#e8e2d9] hover:bg-[#f5f5f4] transition">EN</button>
      <button class="text-sm px-4 py-2 rounded-lg bg-[#b45309] text-white font-semibold hover:bg-[#92400e] transition-colors">Get Started</button>
    </div>
  </div>
</nav>

<!-- ========== HERO ========== -->
<section class="pt-32 pb-20 px-6">
  <div class="max-w-[900px] mx-auto text-center">
    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#b45309]/10 text-[#b45309] text-sm font-medium mb-8 slide-in" style="animation-delay:0.1s">
      <span class="w-2 h-2 rounded-full bg-[#b45309] animate-pulse"></span>
      57 AI Tools · 86 Reviews · Workflow Engine · Chrome Extension
    </div>

    <h1 class="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6 slide-in" style="animation-delay:0.2s">
      What do you want<br>
      to <span class="text-[#b45309]">create</span>?
    </h1>

    <p class="text-lg md:text-xl text-[#78716c] mb-10 max-w-[600px] mx-auto slide-in" style="animation-delay:0.3s">
      One platform. Every AI tool you need. Chain them into workflows. Write reviews. Build faster.
    </p>

    <!-- Search Box -->
    <div class="max-w-[640px] mx-auto mb-10 slide-in" style="animation-delay:0.4s">
      <div class="relative">
        <input
          type="text"
          placeholder="Write a blog post, Generate ad copy, Format JSON..."
          class="w-full px-6 py-4 pr-32 rounded-2xl border border-[#e8e2d9] bg-white text-[#1c1917] text-base shadow-sm focus:outline-none focus:border-[#b45309] focus:ring-2 focus:ring-[#b45309]/20 transition-all"
        />
        <button class="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-[#b45309] text-white font-semibold text-sm hover:bg-[#92400e] transition-colors">
          Create
        </button>
      </div>
      <div class="flex flex-wrap justify-center gap-2 mt-4 text-sm text-[#a8a29e]">
        <span>Try:</span>
        <button class="px-3 py-1 rounded-full bg-white border border-[#e8e2d9] hover:border-[#b45309] hover:text-[#b45309] transition">Blog Outline → SEO → Social</button>
        <button class="px-3 py-1 rounded-full bg-white border border-[#e8e2d9] hover:border-[#b45309] hover:text-[#b45309] transition">Code Review → PR Desc</button>
        <button class="px-3 py-1 rounded-full bg-white border border-[#e8e2d9] hover:border-[#b45309] hover:text-[#b45309] transition">Ad Copy → Landing Page</button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="flex flex-wrap justify-center gap-8 text-center slide-in" style="animation-delay:0.5s">
      <div><div class="text-3xl font-bold font-display">57</div><div class="text-sm text-[#78716c]">AI Tools</div></div>
      <div><div class="text-3xl font-bold font-display">86</div><div class="text-sm text-[#78716c]">Reviews</div></div>
      <div><div class="text-3xl font-bold font-display">12</div><div class="text-sm text-[#78716c]">Workflows</div></div>
      <div><div class="text-3xl font-bold font-display">3</div><div class="text-sm text-[#78716c]">Games</div></div>
      <div><div class="text-3xl font-bold font-display">∞</div><div class="text-sm text-[#78716c]">Possibilities</div></div>
    </div>
  </div>
</section>

<!-- ========== WORKFLOWS ========== -->
<section id="workflows" class="py-20 px-6 bg-white">
  <div class="max-w-[1100px] mx-auto">
    <div class="text-center mb-14">
      <h2 class="font-display text-3xl md:text-4xl font-bold mb-4">AI Workflows</h2>
      <p class="text-[#78716c] max-w-[500px] mx-auto">Chain multiple AI tools into automated pipelines. One input, multiple outputs.</p>
    </div>

    <!-- Featured Workflow -->
    <div class="gradient-dark rounded-[20px] p-8 md:p-10 text-white mb-10 reveal">
      <div class="flex items-center gap-3 mb-6">
        <span class="px-3 py-1 rounded-full bg-white/10 text-sm font-medium">Most Popular</span>
        <span class="text-white/50 text-sm">Used 2,847 times this week</span>
      </div>
      <h3 class="font-display text-2xl font-bold mb-2">🚀 Blog Launch Kit</h3>
      <p class="text-white/70 mb-8">From idea to published blog post + social promotion in 5 steps</p>

      <div class="flex flex-wrap items-center gap-4 mb-8">
        <div class="workflow-step relative flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
          <span class="text-xl">📝</span>
          <div><div class="text-sm font-semibold">Blog Outline</div><div class="text-xs text-white/50">Input: topic</div></div>
        </div>
        <div class="workflow-step relative flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
          <span class="text-xl">🔍</span>
          <div><div class="text-sm font-semibold">SEO Title</div><div class="text-xs text-white/50">Auto from outline</div></div>
        </div>
        <div class="workflow-step relative flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
          <span class="text-xl">🏷️</span>
          <div><div class="text-sm font-semibold">Meta Tags</div><div class="text-xs text-white/50">Auto from title</div></div>
        </div>
        <div class="workflow-step relative flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
          <span class="text-xl">🐦</span>
          <div><div class="text-sm font-semibold">X Post</div><div class="text-xs text-white/50">Auto from blog</div></div>
        </div>
        <div class="workflow-step relative flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
          <span class="text-xl">💼</span>
          <div><div class="text-sm font-semibold">LinkedIn</div><div class="text-xs text-white/50">Auto from blog</div></div>
        </div>
      </div>

      <div class="flex gap-3">
        <button class="px-6 py-3 rounded-xl bg-[#b45309] text-white font-semibold hover:bg-[#d97706] transition">▶ Run Workflow</button>
        <button class="px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition">Customize</button>
        <span class="ml-auto flex items-center gap-2 text-sm text-white/50">
          <span>🪙</span> 25 credits per run
        </span>
      </div>
    </div>

    <!-- Workflow Grid -->
    <div class="grid md:grid-cols-3 gap-6">
      <div class="border border-[#e8e2d9] rounded-2xl p-6 hover:border-[#b45309] hover:shadow-lg transition-all cursor-pointer reveal">
        <div class="text-3xl mb-4">🎯</div>
        <h4 class="font-semibold text-lg mb-2">Growth Marketing</h4>
        <p class="text-sm text-[#78716c] mb-4">Ad Copy → Landing Page → Email Sequence → Push Notification</p>
        <div class="flex items-center gap-2 text-xs text-[#a8a29e]">
          <span>4 steps</span> · <span>🪙 30 credits</span>
        </div>
      </div>
      <div class="border border-[#e8e2d9] rounded-2xl p-6 hover:border-[#b45309] hover:shadow-lg transition-all cursor-pointer reveal">
        <div class="text-3xl mb-4">💻</div>
        <h4 class="font-semibold text-lg mb-2">Developer Release</h4>
        <p class="text-sm text-[#78716c] mb-4">Code Review → PR Description → Changelog → Documentation</p>
        <div class="flex items-center gap-2 text-xs text-[#a8a29e]">
          <span>4 steps</span> · <span>🪙 40 credits</span>
        </div>
      </div>
      <div class="border border-[#e8e2d9] rounded-2xl p-6 hover:border-[#b45309] hover:shadow-lg transition-all cursor-pointer reveal">
        <div class="text-3xl mb-4">🎬</div>
        <h4 class="font-semibold text-lg mb-2">Video Content</h4>
        <p class="text-sm text-[#78716c] mb-4">Script → Title → Thumbnail Text → Social Clips</p>
        <div class="flex items-center gap-2 text-xs text-[#a8a29e]">
          <span>4 steps</span> · <span>🪙 35 credits</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ========== TOOLS ========== -->
<section id="tools" class="py-20 px-6">
  <div class="max-w-[1100px] mx-auto">
    <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
      <div>
        <h2 class="font-display text-3xl md:text-4xl font-bold mb-2">AI Tools</h2>
        <p class="text-[#78716c]">57 tools. 4 categories. Zero setup.</p>
      </div>
      <div class="flex gap-2 mt-4 md:mt-0">
        <button class="px-4 py-2 rounded-full bg-[#1c1917] text-white text-sm font-medium">All</button>
        <button class="px-4 py-2 rounded-full bg-white border border-[#e8e2d9] text-sm font-medium hover:border-[#b45309]">Developer</button>
        <button class="px-4 py-2 rounded-full bg-white border border-[#e8e2d9] text-sm font-medium hover:border-[#b45309]">AI Writing</button>
        <button class="px-4 py-2 rounded-full bg-white border border-[#e8e2d9] text-sm font-medium hover:border-[#b45309]">Utility</button>
      </div>
    </div>

    <!-- Price Filter -->
    <div class="flex gap-2 mb-8">
      <button class="px-3 py-1.5 rounded-lg border border-[#16a34a] bg-[#16a34a]/10 text-[#16a34a] text-xs font-semibold">Free</button>
      <button class="px-3 py-1.5 rounded-lg border border-[#d97706] bg-[#d97706]/10 text-[#d97706] text-xs font-semibold">Freemium</button>
      <button class="px-3 py-1.5 rounded-lg border border-[#dc2626] bg-[#dc2626]/10 text-[#dc2626] text-xs font-semibold">Credits</button>
    </div>

    <!-- Tool Cards -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Card 1 -->
      <div class="bg-white border border-[#e8e2d9] rounded-2xl p-5 hover:shadow-lg hover:border-[#b45309] transition-all cursor-pointer reveal">
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-[#b45309]/10 flex items-center justify-center text-xl">📝</div>
          <div class="flex gap-1">
            <span class="px-2 py-0.5 rounded-md bg-[#16a34a]/10 text-[#16a34a] text-[10px] font-bold">FREE</span>
          </div>
        </div>
        <h4 class="font-semibold mb-1">Blog Outline</h4>
        <p class="text-xs text-[#78716c] mb-3">Generate structured blog outlines with SEO keywords</p>
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-1">
            <span>⭐</span><span class="font-semibold">4.5</span><span class="text-[#a8a29e]">(128)</span>
          </div>
          <span class="text-[#a8a29e]">🪙 10</span>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="bg-white border border-[#e8e2d9] rounded-2xl p-5 hover:shadow-lg hover:border-[#b45309] transition-all cursor-pointer reveal">
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-[#b45309]/10 flex items-center justify-center text-xl">🐦</div>
          <div class="flex gap-1">
            <span class="px-2 py-0.5 rounded-md bg-[#dc2626]/10 text-[#dc2626] text-[10px] font-bold">CREDITS</span>
          </div>
        </div>
        <h4 class="font-semibold mb-1">X Post Generator</h4>
        <p class="text-xs text-[#78716c] mb-3">Viral tweets, threads, and engagement hooks</p>
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-1">
            <span>⭐</span><span class="font-semibold">4.2</span><span class="text-[#a8a29e]">(96)</span>
          </div>
          <span class="text-[#a8a29e]">🪙 5</span>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="bg-white border border-[#e8e2d9] rounded-2xl p-5 hover:shadow-lg hover:border-[#b45309] transition-all cursor-pointer reveal">
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-[#b45309]/10 flex items-center justify-center text-xl">🔍</div>
          <div class="flex gap-1">
            <span class="px-2 py-0.5 rounded-md bg-[#16a34a]/10 text-[#16a34a] text-[10px] font-bold">FREE</span>
          </div>
        </div>
        <h4 class="font-semibold mb-1">SEO Title</h4>
        <p class="text-xs text-[#78716c] mb-3">Google-optimized titles with keyword analysis</p>
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-1">
            <span>⭐</span><span class="font-semibold">4.7</span><span class="text-[#a8a29e]">(203)</span>
          </div>
          <span class="text-[#a8a29e]">🪙 0</span>
        </div>
      </div>

      <!-- Card 4 -->
      <div class="bg-white border border-[#e8e2d9] rounded-2xl p-5 hover:shadow-lg hover:border-[#b45309] transition-all cursor-pointer reveal">
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-[#b45309]/10 flex items-center justify-center text-xl">💻</div>
          <div class="flex gap-1">
            <span class="px-2 py-0.5 rounded-md bg-[#d97706]/10 text-[#d97706] text-[10px] font-bold">FREE</span>
          </div>
        </div>
        <h4 class="font-semibold mb-1">JSON Formatter</h4>
        <p class="text-xs text-[#78716c] mb-3">Format, validate, and minify JSON instantly</p>
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-1">
            <span>⭐</span><span class="font-semibold">4.9</span><span class="text-[#a8a29e]">(412)</span>
          </div>
          <span class="text-[#a8a29e]">🪙 0</span>
        </div>
      </div>

      <!-- Card 5 -->
      <div class="bg-white border border-[#e8e2d9] rounded-2xl p-5 hover:shadow-lg hover:border-[#b45309] transition-all cursor-pointer reveal">
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-[#b45309]/10 flex items-center justify-center text-xl">🔑</div>
          <div class="flex gap-1">
            <span class="px-2 py-0.5 rounded-md bg-[#d97706]/10 text-[#d97706] text-[10px] font-bold">FREE</span>
          </div>
        </div>
        <h4 class="font-semibold mb-1">JWT Parser</h4>
        <p class="text-xs text-[#78716c] mb-3">Decode and inspect JWT tokens locally</p>
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-1">
            <span>⭐</span><span class="font-semibold">4.8</span><span class="text-[#a8a29e]">(356)</span>
          </div>
          <span class="text-[#a8a29e]">🪙 0</span>
        </div>
      </div>

      <!-- Card 6 -->
      <div class="bg-white border border-[#e8e2d9] rounded-2xl p-5 hover:shadow-lg hover:border-[#b45309] transition-all cursor-pointer reveal">
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-[#b45309]/10 flex items-center justify-center text-xl">🎨</div>
          <div class="flex gap-1">
            <span class="px-2 py-0.5 rounded-md bg-[#16a34a]/10 text-[#16a34a] text-[10px] font-bold">FREE</span>
          </div>
        </div>
        <h4 class="font-semibold mb-1">Color Converter</h4>
        <p class="text-xs text-[#78716c] mb-3">HEX ↔ RGB ↔ HSL with preview</p>
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-1">
            <span>⭐</span><span class="font-semibold">4.6</span><span class="text-[#a8a29e]">(178)</span>
          </div>
          <span class="text-[#a8a29e]">🪙 0</span>
        </div>
      </div>

      <!-- Card 7 -->
      <div class="bg-white border border-[#e8e2d9] rounded-2xl p-5 hover:shadow-lg hover:border-[#b45309] transition-all cursor-pointer reveal">
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-[#b45309]/10 flex items-center justify-center text-xl">📧</div>
          <div class="flex gap-1">
            <span class="px-2 py-0.5 rounded-md bg-[#dc2626]/10 text-[#dc2626] text-[10px] font-bold">CREDITS</span>
          </div>
        </div>
        <h4 class="font-semibold mb-1">Cold Email</h4>
        <p class="text-xs text-[#78716c] mb-3">Personalized outreach with follow-up sequences</p>
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-1">
            <span>⭐</span><span class="font-semibold">4.3</span><span class="text-[#a8a29e]">(87)</span>
          </div>
          <span class="text-[#a8a29e]">🪙 15</span>
        </div>
      </div>

      <!-- Card 8 -->
      <div class="bg-white border border-[#e8e2d9] rounded-2xl p-5 hover:shadow-lg hover:border-[#b45309] transition-all cursor-pointer reveal">
        <div class="flex items-start justify-between mb-3">
          <div class="w-10 h-10 rounded-xl bg-[#b45309]/10 flex items-center justify-center text-xl">🎰</div>
          <div class="flex gap-1">
            <span class="px-2 py-0.5 rounded-md bg-[#d97706]/10 text-[#d97706] text-[10px] font-bold">GAME</span>
          </div>
        </div>
        <h4 class="font-semibold mb-1">Lucky Slots</h4>
        <p class="text-xs text-[#78716c] mb-3">Win credits! 3 free spins daily</p>
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-1">
            <span>⭐</span><span class="font-semibold">4.4</span><span class="text-[#a8a29e]">(312)</span>
          </div>
          <span class="text-[#a8a29e]">🪙 +5~100</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ========== REVIEWS ========== -->
<section id="reviews" class="py-20 px-6 bg-white">
  <div class="max-w-[1100px] mx-auto">
    <div class="text-center mb-14">
      <h2 class="font-display text-3xl md:text-4xl font-bold mb-4">Deep Reviews</h2>
      <p class="text-[#78716c] max-w-[500px] mx-auto">6-dimension scoring + radar charts. Not just ratings — real analysis.</p>
    </div>

    <div class="grid md:grid-cols-2 gap-8 items-center">
      <!-- Review Card -->
      <div class="border border-[#e8e2d9] rounded-2xl p-6 reveal">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-12 rounded-xl bg-[#b45309]/10 flex items-center justify-center text-2xl">📝</div>
          <div>
            <h4 class="font-semibold text-lg">Blog Outline</h4>
            <div class="flex items-center gap-2 text-sm">
              <span class="text-[#b45309] font-bold text-lg">4.2</span>
              <span class="text-[#a8a29e]">AIHues Team</span>
            </div>
          </div>
        </div>

        <!-- Radar Chart (SVG) -->
        <div class="flex justify-center mb-6">
          <svg viewBox="0 0 200 200" class="w-48 h-48">
            <!-- Grid -->
            <polygon points="100,20 170,65 170,135 100,180 30,135 30,65" fill="none" stroke="#e8e2d9" stroke-width="1"/>
            <polygon points="100,40 150,72 150,128 100,160 50,128 50,72" fill="none" stroke="#e8e2d9" stroke-width="1"/>
            <polygon points="100,60 130,80 130,120 100,140 70,120 70,80" fill="none" stroke="#e8e2d9" stroke-width="1"/>
            <!-- Data -->
            <polygon class="radar-polygon" points="100,36 166,69 166,131 100,164 34,131 34,69"/>
            <circle class="radar-dot" cx="100" cy="36" r="3"/>
            <circle class="radar-dot" cx="166" cy="69" r="3"/>
            <circle class="radar-dot" cx="166" cy="131" r="3"/>
            <circle class="radar-dot" cx="100" cy="164" r="3"/>
            <circle class="radar-dot" cx="34" cy="131" r="3"/>
            <circle class="radar-dot" cx="34" cy="69" r="3"/>
            <!-- Labels -->
            <text x="100" y="14" text-anchor="middle" font-size="9" fill="#78716c">Quality</text>
            <text x="182" y="60" text-anchor="start" font-size="9" fill="#78716c">Ease</text>
            <text x="182" y="145" text-anchor="start" font-size="9" fill="#78716c">Value</text>
            <text x="100" y="196" text-anchor="middle" font-size="9" fill="#78716c">Integrate</text>
            <text x="18" y="145" text-anchor="end" font-size="9" fill="#78716c">Speed</text>
            <text x="18" y="60" text-anchor="end" font-size="9" fill="#78716c">Community</text>
          </svg>
        </div>

        <div class="space-y-2 text-sm">
          <div class="flex items-center gap-2">
            <span class="text-[#16a34a]">✓</span>
            <span>Clear 6-section structure with strong logic</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[#16a34a]">✓</span>
            <span>Auto-generates SEO keyword suggestions</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[#dc2626]">✗</span>
            <span>Single output format, no customization</span>
          </div>
        </div>
      </div>

      <!-- Review Stats -->
      <div class="space-y-4 reveal">
        <div class="flex items-center justify-between p-4 rounded-xl bg-[#faf9f6]">
          <span class="text-sm font-medium">Output Quality</span>
          <div class="flex items-center gap-3">
            <div class="w-32 h-2 bg-[#e8e2d9] rounded-full overflow-hidden">
              <div class="h-full bg-[#b45309] rounded-full" style="width:84%"></div>
            </div>
            <span class="text-sm font-semibold w-8">4.2</span>
          </div>
        </div>
        <div class="flex items-center justify-between p-4 rounded-xl bg-[#faf9f6]">
          <span class="text-sm font-medium">Ease of Use</span>
          <div class="flex items-center gap-3">
            <div class="w-32 h-2 bg-[#e8e2d9] rounded-full overflow-hidden">
              <div class="h-full bg-[#b45309] rounded-full" style="width:90%"></div>
            </div>
            <span class="text-sm font-semibold w-8">4.5</span>
          </div>
        </div>
        <div class="flex items-center justify-between p-4 rounded-xl bg-[#faf9f6]">
          <span class="text-sm font-medium">Value for Money</span>
          <div class="flex items-center gap-3">
            <div class="w-32 h-2 bg-[#e8e2d9] rounded-full overflow-hidden">
              <div class="h-full bg-[#b45309] rounded-full" style="width:80%"></div>
            </div>
            <span class="text-sm font-semibold w-8">4.0</span>
          </div>
        </div>
        <div class="flex items-center justify-between p-4 rounded-xl bg-[#faf9f6]">
          <span class="text-sm font-medium">Integration</span>
          <div class="flex items-center gap-3">
            <div class="w-32 h-2 bg-[#e8e2d9] rounded-full overflow-hidden">
              <div class="h-full bg-[#b45309] rounded-full" style="width:60%"></div>
            </div>
            <span class="text-sm font-semibold w-8">3.0</span>
          </div>
        </div>
        <div class="flex items-center justify-between p-4 rounded-xl bg-[#faf9f6]">
          <span class="text-sm font-medium">Iteration Speed</span>
          <div class="flex items-center gap-3">
            <div class="w-32 h-2 bg-[#e8e2d9] rounded-full overflow-hidden">
              <div class="h-full bg-[#b45309] rounded-full" style="width:80%"></div>
            </div>
            <span class="text-sm font-semibold w-8">4.0</span>
          </div>
        </div>
        <div class="flex items-center justify-between p-4 rounded-xl bg-[#faf9f6]">
          <span class="text-sm font-medium">Community</span>
          <div class="flex items-center gap-3">
            <div class="w-32 h-2 bg-[#e8e2d9] rounded-full overflow-hidden">
              <div class="h-full bg-[#b45309] rounded-full" style="width:70%"></div>
            </div>
            <span class="text-sm font-semibold w-8">3.5</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ========== CHROME EXTENSION ========== -->
<section class="py-20 px-6">
  <div class="max-w-[1100px] mx-auto">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div class="reveal">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#b45309]/10 text-[#b45309] text-sm font-medium mb-6">
          <span>🚀</span> Coming Soon
        </div>
        <h2 class="font-display text-3xl md:text-4xl font-bold mb-4">AIHues Chrome Extension</h2>
        <p class="text-[#78716c] mb-8">Right-click any text on any website. Humanize, summarize, format, translate — without leaving the page.</p>

        <div class="space-y-4 mb-8">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-[#b45309]/10 flex items-center justify-center text-sm">⚡</div>
            <span class="text-sm">Right-click menu on any selected text</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-[#b45309]/10 flex items-center justify-center text-sm">🪟</div>
            <span class="text-sm">Side panel for long-form tools (JSON, Regex, Diff)</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-[#b45309]/10 flex items-center justify-center text-sm">⌨️</div>
            <span class="text-sm">Global shortcuts (Cmd+Shift+J for JSON formatter)</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-[#b45309]/10 flex items-center justify-center text-sm">🔒</div>
            <span class="text-sm">Local processing — no data leaves your browser</span>
          </div>
        </div>

        <button class="px-6 py-3 rounded-xl bg-[#1c1917] text-white font-semibold hover:bg-[#292524] transition-colors">
          Join Waitlist
        </button>
      </div>

      <!-- Extension Mockup -->
      <div class="relative reveal">
        <div class="bg-white border border-[#e8e2d9] rounded-2xl shadow-xl overflow-hidden">
          <!-- Fake Browser Bar -->
          <div class="bg-[#f5f5f4] px-4 py-3 flex items-center gap-2 border-b border-[#e8e2d9]">
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full bg-[#dc2626]"></div>
              <div class="w-3 h-3 rounded-full bg-[#d97706]"></div>
              <div class="w-3 h-3 rounded-full bg-[#16a34a]"></div>
            </div>
            <div class="flex-1 mx-3 bg-white rounded-lg px-3 py-1.5 text-xs text-[#a8a29e] border border-[#e8e2d9]">
              medium.com/article/ai-writing-tips
            </div>
          </div>
          <!-- Fake Content -->
          <div class="p-6">
            <div class="h-4 bg-[#e8e2d9] rounded w-3/4 mb-3"></div>
            <div class="h-3 bg-[#e8e2d9] rounded w-full mb-2"></div>
            <div class="h-3 bg-[#e8e2d9] rounded w-5/6 mb-2"></div>
            <div class="h-3 bg-[#e8e2d9] rounded w-full mb-2"></div>
            <div class="h-3 bg-[#e8e2d9] rounded w-4/5 mb-4"></div>
            <!-- Selected Text -->
            <div class="bg-[#b45309]/10 border border-[#b45309]/30 rounded-lg p-3 mb-4">
              <p class="text-sm">"AI writing tools have revolutionized content creation, but many still struggle with brand voice consistency..."</p>
            </div>
            <!-- Context Menu -->
            <div class="bg-white border border-[#e8e2d9] rounded-xl shadow-lg p-2 w-56 ml-auto mr-8">
              <div class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#faf9f6] cursor-pointer text-sm">
                <span>✨</span> Humanize
              </div>
              <div class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#faf9f6] cursor-pointer text-sm">
                <span>📝</span> Summarize
              </div>
              <div class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#faf9f6] cursor-pointer text-sm">
                <span>🔄</span> Rewrite
              </div>
              <div class="border-t border-[#e8e2d9] my-1"></div>
              <div class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#faf9f6] cursor-pointer text-sm text-[#b45309]">
                <span>🚀</span> Run Workflow...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ========== API ========== -->
<section id="api" class="py-20 px-6 bg-[#1c1917] text-white">
  <div class="max-w-[900px] mx-auto">
    <div class="text-center mb-14">
      <h2 class="font-display text-3xl md:text-4xl font-bold mb-4">API Access</h2>
      <p class="text-white/60 max-w-[500px] mx-auto">Build AIHues into your own products. One API key, 57 tools.</p>
    </div>

    <div class="code-block p-6 mb-8 reveal">
      <div class="flex items-center gap-2 mb-4 text-xs text-white/40">
        <span class="px-2 py-0.5 rounded bg-white/10">cURL</span>
        <span class="px-2 py-0.5 rounded bg-white/10">JavaScript</span>
        <span class="px-2 py-0.5 rounded bg-white/10">Python</span>
      </div>
      <pre class="text-sm text-white/80 overflow-x-auto"><code><span class="text-[#d97706]">curl</span> https://api.aihues.com/v1/generate \\
  <span class="text-[#d97706]">-H</span> <span class="text-[#16a34a]">"Authorization: Bearer sk_aihues_xxx"</span> \\
  <span class="text-[#d97706]">-H</span> <span class="text-[#16a34a]">"Content-Type: application/json"</span> \\
  <span class="text-[#d97706]">-d</span> <span class="text-[#16a34a]">'{
    "tool": "blog-outline",
    "input": "How to use AI for content marketing",
    "locale": "en"
  }'</span></code></pre>
    </div>

    <div class="grid sm:grid-cols-3 gap-6 text-center reveal">
      <div class="p-6 rounded-2xl bg-white/5 border border-white/10">
        <div class="text-3xl font-bold font-display mb-1">57</div>
        <div class="text-sm text-white/60">Tools via API</div>
      </div>
      <div class="p-6 rounded-2xl bg-white/5 border border-white/10">
        <div class="text-3xl font-bold font-display mb-1">99.9%</div>
        <div class="text-sm text-white/60">Uptime SLA</div>
      </div>
      <div class="p-6 rounded-2xl bg-white/5 border border-white/10">
        <div class="text-3xl font-bold font-display mb-1">&lt;500ms</div>
        <div class="text-sm text-white/60">Average latency</div>
      </div>
    </div>
  </div>
</section>

<!-- ========== COMMUNITY ========== -->
<section id="community" class="py-20 px-6">
  <div class="max-w-[1100px] mx-auto">
    <div class="text-center mb-14">
      <h2 class="font-display text-3xl md:text-4xl font-bold mb-4">Community Reviews</h2>
      <p class="text-[#78716c] max-w-[500px] mx-auto">Real users. Real insights. Certified reviewers earn credits.</p>
    </div>

    <div class="grid md:grid-cols-3 gap-6 mb-10">
      <div class="bg-white border border-[#e8e2d9] rounded-2xl p-6 reveal">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#b45309] to-[#d97706] flex items-center justify-center text-white font-bold text-sm">JD</div>
          <div>
            <div class="font-semibold text-sm">John Doe</div>
            <div class="text-xs text-[#a8a29e]">Marketing Lead @ TechCorp</div>
          </div>
          <span class="ml-auto px-2 py-0.5 rounded-full bg-[#b45309]/10 text-[#b45309] text-[10px] font-bold">VERIFIED</span>
        </div>
        <div class="flex items-center gap-1 mb-3 text-sm">
          <span>⭐⭐⭐⭐⭐</span>
          <span class="font-semibold">5.0</span>
        </div>
        <p class="text-sm text-[#57534e]">"The Blog Outline tool saved me 2 hours every week. The workflow feature is a game-changer — I can generate a full content package in one click."</p>
      </div>

      <div class="bg-white border border-[#e8e2d9] rounded-2xl p-6 reveal">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#16a34a] to-[#15803d] flex items-center justify-center text-white font-bold text-sm">AL</div>
          <div>
            <div class="font-semibold text-sm">Alice Liu</div>
            <div class="text-xs text-[#a8a29e]">Indie Developer</div>
          </div>
          <span class="ml-auto px-2 py-0.5 rounded-full bg-[#b45309]/10 text-[#b45309] text-[10px] font-bold">VERIFIED</span>
        </div>
        <div class="flex items-center gap-1 mb-3 text-sm">
          <span>⭐⭐⭐⭐</span>
          <span class="font-semibold">4.0</span>
        </div>
        <p class="text-sm text-[#57534e]">"JSON Formatter and JWT Parser are essential for my daily work. Love that everything runs locally — no data privacy concerns."</p>
      </div>

      <div class="bg-white border border-[#e8e2d9] rounded-2xl p-6 reveal">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#dc2626] to-[#b91c1c] flex items-center justify-center text-white font-bold text-sm">MK</div>
          <div>
            <div class="font-semibold text-sm">Mike Kim</div>
            <div class="text-xs text-[#a8a29e]">Content Creator</div>
          </div>
          <span class="ml-auto px-2 py-0.5 rounded-full bg-[#b45309]/10 text-[#b45309] text-[10px] font-bold">VERIFIED</span>
        </div>
        <div class="flex items-center gap-1 mb-3 text-sm">
          <span>⭐⭐⭐⭐⭐</span>
          <span class="font-semibold">4.8</span>
        </div>
        <p class="text-sm text-[#57534e]">"The Chrome extension is brilliant. I can humanize my drafts without switching tabs. The credit system makes it feel like a game!"</p>
      </div>
    </div>

    <div class="text-center">
      <button class="px-6 py-3 rounded-xl border border-[#b45309] text-[#b45309] font-semibold hover:bg-[#b45309] hover:text-white transition-colors">
        Become a Verified Reviewer
      </button>
    </div>
  </div>
</section>

<!-- ========== PRICING ========== -->
<section id="pricing" class="py-20 px-6 bg-white">
  <div class="max-w-[900px] mx-auto">
    <div class="text-center mb-14">
      <h2 class="font-display text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
      <p class="text-[#78716c]">Start free. Scale when you need.</p>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <!-- Free -->
      <div class="border border-[#e8e2d9] rounded-2xl p-6 reveal">
        <div class="text-sm font-medium text-[#a8a29e] mb-2">Free</div>
        <div class="text-4xl font-bold font-display mb-1">\$0</div>
        <div class="text-sm text-[#a8a29e] mb-6">per month</div>
        <ul class="space-y-3 text-sm mb-8">
          <li class="flex items-center gap-2"><span class="text-[#16a34a]">✓</span> 100 credits/month</li>
          <li class="flex items-center gap-2"><span class="text-[#16a34a]">✓</span> All 32 free tools</li>
          <li class="flex items-center gap-2"><span class="text-[#16a34a]">✓</span> 3 workflow runs/month</li>
          <li class="flex items-center gap-2"><span class="text-[#16a34a]">✓</span> Community reviews</li>
        </ul>
        <button class="w-full py-3 rounded-xl border border-[#e8e2d9] font-semibold hover:bg-[#faf9f6] transition">Get Started</button>
      </div>

      <!-- Pro -->
      <div class="border-2 border-[#b45309] rounded-2xl p-6 relative reveal">
        <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#b45309] text-white text-xs font-bold">MOST POPULAR</div>
        <div class="text-sm font-medium text-[#b45309] mb-2">Pro</div>
        <div class="text-4xl font-bold font-display mb-1">\$9</div>
        <div class="text-sm text-[#a8a29e] mb-6">per month</div>
        <ul class="space-y-3 text-sm mb-8">
          <li class="flex items-center gap-2"><span class="text-[#16a34a]">✓</span> 2,000 credits/month</li>
          <li class="flex items-center gap-2"><span class="text-[#16a34a]">✓</span> All 57 tools</li>
          <li class="flex items-center gap-2"><span class="text-[#16a34a]">✓</span> Unlimited workflows</li>
          <li class="flex items-center gap-2"><span class="text-[#16a34a]">✓</span> Custom workflow builder</li>
          <li class="flex items-center gap-2"><span class="text-[#16a34a]">✓</span> Priority support</li>
        </ul>
        <button class="w-full py-3 rounded-xl bg-[#b45309] text-white font-semibold hover:bg-[#92400e] transition">Upgrade to Pro</button>
      </div>

      <!-- Team -->
      <div class="border border-[#e8e2d9] rounded-2xl p-6 reveal">
        <div class="text-sm font-medium text-[#a8a29e] mb-2">Team</div>
        <div class="text-4xl font-bold font-display mb-1">\$29</div>
        <div class="text-sm text-[#a8a29e] mb-6">per month</div>
        <ul class="space-y-3 text-sm mb-8">
          <li class="flex items-center gap-2"><span class="text-[#16a34a]">✓</span> 10,000 credits/month</li>
          <li class="flex items-center gap-2"><span class="text-[#16a34a]">✓</span> Team workspace</li>
          <li class="flex items-center gap-2"><span class="text-[#16a34a]">✓</span> Shared templates</li>
          <li class="flex items-center gap-2"><span class="text-[#16a34a]">✓</span> API access</li>
          <li class="flex items-center gap-2"><span class="text-[#16a34a]">✓</span> Admin dashboard</li>
        </ul>
        <button class="w-full py-3 rounded-xl border border-[#e8e2d9] font-semibold hover:bg-[#faf9f6] transition">Contact Sales</button>
      </div>
    </div>
  </div>
</section>

<!-- ========== FOOTER ========== -->
<footer class="py-12 px-6 border-t border-[#e8e2d9]">
  <div class="max-w-[1100px] mx-auto">
    <div class="grid md:grid-cols-4 gap-8 mb-10">
      <div>
        <div class="flex items-center gap-2 mb-4">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#b45309] to-[#d97706] flex items-center justify-center text-white font-bold text-sm">AI</div>
          <span class="font-display font-bold text-lg">AIHues</span>
        </div>
        <p class="text-sm text-[#78716c]">AI Vibe Navigator — 57 tools, workflows, and deep reviews for creators.</p>
      </div>
      <div>
        <div class="font-semibold text-sm mb-3">Product</div>
        <ul class="space-y-2 text-sm text-[#78716c]">
          <li><a href="#" class="hover:text-[#b45309]">Tools</a></li>
          <li><a href="#" class="hover:text-[#b45309]">Workflows</a></li>
          <li><a href="#" class="hover:text-[#b45309]">Reviews</a></li>
          <li><a href="#" class="hover:text-[#b45309]">Chrome Extension</a></li>
          <li><a href="#" class="hover:text-[#b45309]">API</a></li>
        </ul>
      </div>
      <div>
        <div class="font-semibold text-sm mb-3">Resources</div>
        <ul class="space-y-2 text-sm text-[#78716c]">
          <li><a href="#" class="hover:text-[#b45309]">Blog</a></li>
          <li><a href="#" class="hover:text-[#b45309]">Community</a></li>
          <li><a href="#" class="hover:text-[#b45309]">GitHub</a></li>
          <li><a href="#" class="hover:text-[#b45309]">Changelog</a></li>
        </ul>
      </div>
      <div>
        <div class="font-semibold text-sm mb-3">Company</div>
        <ul class="space-y-2 text-sm text-[#78716c]">
          <li><a href="#" class="hover:text-[#b45309]">About</a></li>
          <li><a href="#" class="hover:text-[#b45309]">Pricing</a></li>
          <li><a href="#" class="hover:text-[#b45309]">Contact</a></li>
        </ul>
      </div>
    </div>
    <div class="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#e8e2d9] text-sm text-[#a8a29e]">
      <div>© 2026 AIHues. Open source under MIT License.</div>
      <div class="flex items-center gap-4 mt-4 md:mt-0">
        <a href="#" class="hover:text-[#b45309]">GitHub</a>
        <a href="#" class="hover:text-[#b45309]">X</a>
        <a href="#" class="hover:text-[#b45309]">Product Hunt</a>
      </div>
    </div>
  </div>
</footer>

`,
        }}
      />
    </>
  );
}
