const shellClass = 'mx-auto w-[min(1120px,calc(100vw-32px))]';

export function SiteFooter() {
  return (
    <footer
      className={`${shellClass} mt-16 flex flex-col items-start gap-4 border-t border-line py-6 pb-12 text-[0.94rem] leading-[1.7] text-muted md:flex-row md:justify-between md:gap-6`}
    >
      <p>Aiushtha 是一个 Next.js 产品站基线，默认运行在 Node 环境中。</p>
      <p>工程重点是 SEO、动态扩展、可维护性和清晰的前后端边界。</p>
    </footer>
  );
}
