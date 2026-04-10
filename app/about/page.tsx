import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '方案',
  description: 'Next.js 产品站基线的推荐架构和上线边界。',
};

const shellClass = 'mx-auto w-[min(1120px,calc(100vw-32px))]';
const panelClass =
  'border border-white/55 bg-surface shadow-panel backdrop-blur-[18px]';
const eyebrowClass =
  'text-[0.82rem] font-bold uppercase tracking-[0.16em] text-accent-strong';

const checklist = [
  '官网页、分类页、详情页优先留在 Next.js 内，减少多套前端工程并存。',
  '站内搜索、推荐、抓取同步、摘要生成等能力拆成独立服务，不塞进页面渲染链路。',
  '前端只在需要交互的区域使用 Client Component，其余页面默认保持服务端组件。',
  '部署时使用 .next/standalone、.next/static 和 public 作为完整运行产物。',
];

export default function AboutPage() {
  return (
    <main className={`${shellClass} pt-6`}>
      <section
        className={`${panelClass} grid gap-7 rounded-panel p-9 max-md:p-7`}
      >
        <p className={eyebrowClass}>Delivery model</p>
        <h1 className="max-w-[12ch] font-serif text-[clamp(3rem,8vw,5.2rem)] leading-[0.96] max-md:max-w-none">
          Next.js 产品站架构建议
        </h1>
        <p className="max-w-[62ch] leading-[1.7] text-muted">
          前端不再强制纯静态导出，而是直接以 Next.js App Router
          为中心组织页面、SEO 和部分 BFF
          API。这样更适合从官网逐步演进到带搜索、动态数据和个性化能力的产品站。
        </p>
      </section>

      <section className={`${panelClass} mt-[22px] rounded-card p-7`}>
        <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] leading-[0.96]">
          推荐链路
        </h2>
        <p className="mt-4 leading-[1.7] text-muted">
          页面层使用 Next.js
          统一承接品牌页、内容页和产品页。需要首屏可索引的页面直接走服务端渲染；需要浏览器交互的区域再挂载客户端组件。真正重的后端能力，如爬虫、索引、队列和
          LLM 调用，拆成独立服务，通过 API 接入站点。
        </p>
      </section>

      <section className={`${panelClass} mt-[22px] rounded-card p-7`}>
        <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] leading-[0.96]">
          上线检查项
        </h2>
        <ul className="mt-[18px] list-disc space-y-2.5 pl-5 leading-[1.7] text-muted">
          {checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
