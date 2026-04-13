import Link from 'next/link';

const shellClass = 'mx-auto w-[min(1120px,calc(100vw-32px))]';
const primaryButtonClass =
  'inline-flex min-h-12 items-center justify-center rounded-[2px] bg-accent px-[18px] font-semibold uppercase tracking-[2px] text-white transition-all duration-200 hover:-translate-y-px hover:brightness-110 focus-visible:-translate-y-px focus-visible:brightness-110';

export default function NotFound() {
  return (
    <main className={shellClass}>
      <section className="mx-auto mt-[72px] grid max-w-[720px] gap-7 rounded-[5px] border border-line bg-surface-strong p-9 text-center shadow-panel max-md:p-7">
        <p className="text-[0.82rem] font-bold uppercase tracking-[0.16em] text-accent-strong">
          404
        </p>
        <h1 className="font-serif text-[clamp(3rem,8vw,5rem)] leading-[0.96]">
          页面不存在
        </h1>
        <p className="leading-[1.7] text-muted">
          你访问的页面已经被移动，或者这个路由还没有实现。
        </p>
        <div className="flex flex-wrap justify-center gap-3.5">
          <Link className={primaryButtonClass} href="/">
            返回首页
          </Link>
        </div>
      </section>
    </main>
  );
}
