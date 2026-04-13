import Link from 'next/link';

const shellClass = 'mx-auto w-[min(1120px,calc(100vw-32px))]';
const panelClass = 'panel-shell';
const cardClass = 'card-shell';
const eyebrowClass = 'kicker-line';
const primaryButtonClass = 'button-primary';
const secondaryButtonClass = 'button-secondary';

export default function HomePage() {
  return (
    <main>
      <section
        className={`${shellClass} ${panelClass} mt-6 grid gap-8 rounded-panel p-7 md:grid-cols-[1.35fr_0.85fr] md:p-14`}
      >
        <div className="relative z-10">
          <p className={eyebrowClass}>React-first delivery</p>
          <h1 className="max-w-[10ch] font-serif text-[clamp(3rem,8vw,5.9rem)] leading-[0.92] text-ink max-md:max-w-none">
            为产品型站点准备的 Next.js 基线
          </h1>
          <p className="mt-6 max-w-[60ch] text-[1.04rem] leading-[1.7] text-muted">
            这套骨架面向类似 papers.cool 的站点：既要多页面
            SEO，也要保留搜索、动态数据、个性化交互和后续 API
            聚合能力。前端统一使用 React，部署方式改为 Node 可运行的 standalone
            产物。
          </p>

          <div className="mt-7 flex flex-wrap gap-3.5">
            <Link className={primaryButtonClass} href="/about">
              查看架构建议
            </Link>
            <a
              className={secondaryButtonClass}
              href="https://nextjs.org/docs/app"
              target="_blank"
              rel="noreferrer"
            >
              Next.js 文档
            </a>
          </div>
        </div>

        <aside className="relative z-10 grid gap-3" aria-label="工程特性">
          <div className={`${cardClass} rounded-card px-5 py-[18px]`}>
            <span className="block text-[0.84rem] uppercase tracking-[3px] text-gold">
              路由模式
            </span>
            <strong className="mt-2 block text-[1.28rem] text-ink">
              App Router
            </strong>
          </div>
          <div className={`${cardClass} rounded-card px-5 py-[18px]`}>
            <span className="block text-[0.84rem] uppercase tracking-[3px] text-gold">
              运行方式
            </span>
            <strong className="mt-2 block text-[1.28rem] text-ink">
              Node Standalone
            </strong>
          </div>
          <div className={`${cardClass} rounded-card px-5 py-[18px]`}>
            <span className="block text-[0.84rem] uppercase tracking-[3px] text-gold">
              适用场景
            </span>
            <strong className="mt-2 block text-[1.28rem] text-ink">
              内容 + 动态产品页
            </strong>
          </div>
        </aside>
      </section>

      <section
        className={`${shellClass} mt-[22px] grid gap-[18px] md:grid-cols-3`}
      >
        <article className={`${cardClass} rounded-card p-7`}>
          <p className="block text-[0.84rem] uppercase tracking-[3px] text-gold">
            01
          </p>
          <h2 className="mt-2.5 font-serif text-[1.9rem] leading-[0.96] text-ink">
            服务端优先
          </h2>
          <p className="mt-3 leading-[1.7] text-muted">
            列表页、详情页和 SEO
            元数据优先走服务端渲染，首屏内容可以稳定被搜索引擎获取。
          </p>
        </article>
        <article className={`${cardClass} rounded-card p-7`}>
          <p className="block text-[0.84rem] uppercase tracking-[3px] text-gold">
            02
          </p>
          <h2 className="mt-2.5 font-serif text-[1.9rem] leading-[0.96] text-ink">
            交互分层
          </h2>
          <p className="mt-3 leading-[1.7] text-muted">
            默认使用 Server
            Component，只有搜索栏、偏好设置、阅读记录等交互区域再切到 Client
            Component。
          </p>
        </article>
        <article className={`${cardClass} rounded-card p-7`}>
          <p className="block text-[0.84rem] uppercase tracking-[3px] text-gold">
            03
          </p>
          <h2 className="mt-2.5 font-serif text-[1.9rem] leading-[0.96] text-ink">
            后端解耦
          </h2>
          <p className="mt-3 leading-[1.7] text-muted">
            Next 负责站点和轻量
            BFF，抓取、搜索索引、摘要生成、队列任务保持独立服务，更利于演进。
          </p>
        </article>
      </section>

      <section
        className={`${shellClass} ${panelClass} mt-[22px] grid gap-7 rounded-panel p-9 md:grid-cols-[1.1fr_0.9fr] md:p-9`}
      >
        <div className="relative z-10">
          <p className={eyebrowClass}>推荐拆分</p>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] leading-[0.94] text-ink">
            适合从官网演进到产品站
          </h2>
          <p className="mt-4 leading-[1.7] text-muted">
            主页、说明页、分类页、论文详情页都能留在同一套 React
            工程里。后续如果加入站内搜索、用户偏好、订阅、LLM
            摘要或推荐服务，可以逐步把复杂能力拆到 API、搜索引擎和
            worker，而不是推翻前端。
          </p>
        </div>

        <div className="relative z-10 grid gap-3">
          <div className={`${cardClass} rounded-card px-5 py-[18px]`}>
            <span className="block text-[0.84rem] uppercase tracking-[3px] text-gold">
              Framework
            </span>
            <strong className="mt-2 block text-[1.28rem] text-ink">
              Next.js 16
            </strong>
          </div>
          <div className={`${cardClass} rounded-card px-5 py-[18px]`}>
            <span className="block text-[0.84rem] uppercase tracking-[3px] text-gold">
              Language
            </span>
            <strong className="mt-2 block text-[1.28rem] text-ink">
              TypeScript
            </strong>
          </div>
          <div className={`${cardClass} rounded-card px-5 py-[18px]`}>
            <span className="block text-[0.84rem] uppercase tracking-[3px] text-gold">
              Rendering
            </span>
            <strong className="mt-2 block text-[1.28rem] text-ink">
              SSR + RSC
            </strong>
          </div>
          <div className={`${cardClass} rounded-card px-5 py-[18px]`}>
            <span className="block text-[0.84rem] uppercase tracking-[3px] text-gold">
              Deploy
            </span>
            <strong className="mt-2 block text-[1.28rem] text-ink">
              Node / Container
            </strong>
          </div>
        </div>
      </section>
    </main>
  );
}
