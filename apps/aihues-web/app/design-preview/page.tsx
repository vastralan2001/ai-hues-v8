import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Design Preview — AIHues Review Module',
  robots: { index: false, follow: false },
};

/* ── 雷达图组件（纯SVG） ── */
function RadarChart({
  data,
  labels,
  size = 200,
}: {
  data: number[];
  labels: string[];
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const count = data.length;
  const angleStep = (Math.PI * 2) / count;

  const point = (i: number, r: number) => {
    const angle = i * angleStep - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  const pathData =
    data
      .map((v, i) => {
        const [x, y] = point(i, (v / 5) * radius);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ') + ' Z';

  return (
    <svg height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
      {/* 背景网格 */}
      {[1, 2, 3, 4, 5].map((level) => (
        <polygon
          fill='none'
          key={level}
          points={Array.from({ length: count }, (_, i) => {
            const [x, y] = point(i, (level / 5) * radius);
            return `${x},${y}`;
          }).join(' ')}
          stroke='#e7e5e4'
          strokeWidth={0.5}
        />
      ))}
      {/* 轴线 */}
      {Array.from({ length: count }, (_, i) => {
        const [x, y] = point(i, radius);
        return (
          <line
            key={i}
            stroke='#e7e5e4'
            strokeWidth={0.5}
            x1={cx}
            x2={x}
            y1={cy}
            y2={y}
          />
        );
      })}
      {/* 数据区域 */}
      <path
        d={pathData}
        fill='rgba(180,83,9,0.15)'
        stroke='#b45309'
        strokeWidth={2}
      />
      {/* 数据点 */}
      {data.map((v, i) => {
        const [x, y] = point(i, (v / 5) * radius);
        return <circle cx={x} cy={y} fill='#b45309' key={i} r={3} />;
      })}
      {/* 标签 */}
      {labels.map((label, i) => {
        const [x, y] = point(i, radius + 18);
        return (
          <text
            fill='#57534e'
            fontSize={10}
            fontWeight={600}
            key={i}
            textAnchor='middle'
            x={x}
            y={y + 4}
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

/* ── 评分维度建议 ── */
const DIMENSION_OPTIONS = [
  {
    key: 'ease',
    name: '易用性',
    nameEn: 'Ease of Use',
    desc: '上手门槛、交互直观度、学习曲线',
    weight: '核心',
  },
  {
    key: 'function',
    name: '功能性',
    nameEn: 'Functionality',
    desc: '功能完整度、覆盖场景、输出质量',
    weight: '核心',
  },
  {
    key: 'value',
    name: '性价比',
    nameEn: 'Value',
    desc: '价格 vs 能力、免费额度、升级路径',
    weight: '核心',
  },
  {
    key: 'design',
    name: '设计体验',
    nameEn: 'Design',
    desc: 'UI美观度、UX流畅度、视觉一致性',
    weight: '核心',
  },
  {
    key: 'speed',
    name: '响应速度',
    nameEn: 'Speed',
    desc: '生成/处理速度、加载时间、并发表现',
    weight: '核心',
  },
  {
    key: 'ecosystem',
    name: '生态兼容',
    nameEn: 'Ecosystem',
    desc: 'API开放度、集成能力、第三方插件',
    weight: '扩展',
  },
  {
    key: 'privacy',
    name: '隐私安全',
    nameEn: 'Privacy',
    desc: '数据处理方式、合规认证、本地部署支持',
    weight: '扩展',
  },
  {
    key: 'support',
    name: '社区支持',
    nameEn: 'Community',
    desc: '文档质量、客服响应、用户社区活跃度',
    weight: '扩展',
  },
];

/* ── 主页面 ── */
export default function DesignPreviewPage() {
  const radarA = [4.5, 4.0, 3.5, 4.5, 4.0, 3.0];
  const radarB = [3.0, 4.5, 4.5, 3.5, 4.0, 4.5];
  const labels = ['易用性', '功能性', '性价比', '设计', '速度', '生态'];

  return (
    <div className='min-h-screen bg-[#fafaf9]'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-[#e7e5e4] bg-white/90 backdrop-blur-md'>
        <div className='mx-auto flex h-14 max-w-[1100px] items-center px-6'>
          <span className='flex h-7 w-7 items-center justify-center rounded-md bg-[#b45309] text-xs font-bold text-white'>
            H
          </span>
          <span className='ml-2 text-sm font-bold text-[#1c1917]'>AIHues</span>
          <span className='mx-2 text-[#a8a29e]'>·</span>
          <span className='text-sm text-[#78716c]'>评测模块设计方案</span>
          <span className='ml-auto rounded-full bg-[rgba(180,83,9,0.08)] px-2.5 py-0.5 text-[11px] font-bold text-[#b45309]'>
            预览版 — 待确认
          </span>
        </div>
      </header>

      <main className='mx-auto max-w-[1100px] px-6 py-10'>
        {/* Intro */}
        <div className='mb-12 text-center'>
          <h1 className='text-[32px] font-extrabold tracking-[-1px] text-[#1c1917]'>
            AIHues 评测模块设计方案
          </h1>
          <p className='mx-auto mt-2 max-w-[560px] text-[15px] text-[#78716c]'>
            以下展示 4
            组设计方案，请选择你认为最合适的组合。确认后按选中的方案实施到正式网站。
          </p>
        </div>

        {/* ── Section 1: Tab 位置 ── */}
        <section className='mb-16'>
          <SectionTitle number={1} title='评测 Tab 位置方案' />

          <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
            {/* 方案A */}
            <SchemeCard
              badge='推荐'
              cons={['占用顶部空间', 'Tab 过多时拥挤']}
              features={['与工具描述平级', '切换流畅', '信息密度高']}
              pros={[
                '最直观，用户一眼看到',
                '符合主流产品习惯（App Store、Product Hunt）',
                'SEO 友好，评测内容在首屏',
              ]}
              title='方案 A：顶部 Tab 导航'
            >
              <div className='rounded-lg border border-[#e7e5e4] bg-white p-3'>
                <div className='flex gap-1 border-b border-[#e7e5e4] pb-2 text-[11px]'>
                  <span className='rounded px-2 py-0.5 text-[#78716c]'>
                    描述
                  </span>
                  <span className='rounded px-2 py-0.5 text-[#78716c]'>
                    用法
                  </span>
                  <span className='rounded bg-[rgba(180,83,9,0.08)] px-2 py-0.5 font-bold text-[#b45309]'>
                    评测
                  </span>
                  <span className='rounded px-2 py-0.5 text-[#78716c]'>
                    相关
                  </span>
                </div>
                <div className='mt-2 space-y-1.5'>
                  <div className='flex items-center gap-2'>
                    <RadarMini data={[4, 4, 3, 5, 4, 3]} />
                    <div className='text-[10px] text-[#78716c]'>JWT Parser</div>
                  </div>
                  <div className='h-1.5 w-24 rounded bg-[#e7e5e4]' />
                  <div className='h-1.5 w-20 rounded bg-[#e7e5e4]' />
                </div>
              </div>
            </SchemeCard>

            {/* 方案B */}
            <SchemeCard
              cons={['容易被忽略', '需要滚动才看到']}
              features={['默认折叠', '点击展开', '不占用首屏']}
              pros={[
                '首屏专注工具本身',
                '页面更简洁',
                '适合工具页内容多的场景',
              ]}
              title='方案 B：底部折叠面板'
            >
              <div className='rounded-lg border border-[#e7e5e4] bg-white p-3'>
                <div className='space-y-1.5'>
                  <div className='h-2 w-full rounded bg-[#e7e5e4]' />
                  <div className='h-2 w-[90%] rounded bg-[#e7e5e4]' />
                  <div className='h-2 w-[70%] rounded bg-[#e7e5e4]' />
                </div>
                <div className='mt-3 rounded-md border border-[#b45309]/20 bg-[rgba(180,83,9,0.04)] px-3 py-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-[11px] font-bold text-[#b45309]'>
                      ▼ 查看评测
                    </span>
                    <span className='text-[10px] text-[#78716c]'>4.5 ★</span>
                  </div>
                </div>
              </div>
            </SchemeCard>

            {/* 方案C */}
            <SchemeCard
              cons={['移动端不友好', '小屏需要隐藏']}
              features={['左侧工具', '右侧评测信息', '并排展示']}
              pros={[
                '桌面端信息密度最高',
                '工具和评测同时可见',
                '适合对比场景',
              ]}
              title='方案 C：右侧边栏（桌面端）'
            >
              <div className='flex gap-2 rounded-lg border border-[#e7e5e4] bg-white p-2'>
                <div className='flex-1 space-y-1'>
                  <div className='h-2 w-full rounded bg-[#e7e5e4]' />
                  <div className='h-2 w-[80%] rounded bg-[#e7e5e4]' />
                </div>
                <div className='w-20 rounded bg-[#fafaf9] p-1.5'>
                  <RadarMini data={[3, 5, 4, 4, 5, 3]} size={60} />
                  <div className='mt-1 text-center text-[8px] font-bold text-[#b45309]'>
                    4.2 ★
                  </div>
                </div>
              </div>
            </SchemeCard>
          </div>
        </section>

        {/* ── Section 2: Blog 工具推荐 ── */}
        <section className='mb-16'>
          <SectionTitle number={2} title='Blog 文章工具推荐位置' />

          <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
            {/* 方案A */}
            <SchemeCard
              badge='推荐'
              cons={['用户可能不读到底', '与正文内容割裂']}
              features={['文章末尾固定区块', '3-4 张卡片', '根据 tag 匹配']}
              pros={['不打扰阅读', '实现简单', 'SEO 内链效果好']}
              title='方案 A：文章末尾卡片'
            >
              <div className='rounded-lg border border-[#e7e5e4] bg-white p-3'>
                <div className='space-y-1'>
                  <div className='h-1.5 w-full rounded bg-[#e7e5e4]' />
                  <div className='h-1.5 w-[90%] rounded bg-[#e7e5e4]' />
                  <div className='h-1.5 w-[60%] rounded bg-[#e7e5e4]' />
                </div>
                <div className='mt-3 rounded-md bg-[#fafaf9] p-2'>
                  <div className='mb-1.5 text-[9px] font-bold text-[#78716c]'>
                    相关工具
                  </div>
                  <div className='flex gap-1.5'>
                    <div className='flex-1 rounded border border-[#e7e5e4] bg-white p-1.5'>
                      <div className='text-[8px] font-bold'>SEO Title</div>
                      <div className='text-[7px] text-[#a8a29e]'>
                        🔍 标题生成
                      </div>
                    </div>
                    <div className='flex-1 rounded border border-[#e7e5e4] bg-white p-1.5'>
                      <div className='text-[8px] font-bold'>Meta Tag</div>
                      <div className='text-[7px] text-[#a8a29e]'>
                        🏷️ Meta 标签
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SchemeCard>

            {/* 方案B */}
            <SchemeCard
              cons={['开发复杂', '可能遮挡内容', '移动端难做']}
              features={['文中关键词触发', '右侧浮动卡片', 'hover/点击展开']}
              pros={['上下文最精准', '转化率高', '体验现代']}
              title='方案 B：文中浮动推荐'
            >
              <div className='rounded-lg border border-[#e7e5e4] bg-white p-3'>
                <div className='relative'>
                  <div className='h-1.5 w-full rounded bg-[#e7e5e4]' />
                  <div className='mt-1 h-1.5 w-[85%] rounded bg-[#e7e5e4]' />
                  <div className='absolute -right-1 top-0 w-16 rounded border border-[#b45309]/20 bg-white p-1 shadow-sm'>
                    <div className='text-[7px] font-bold text-[#b45309]'>
                      JWT Parser
                    </div>
                    <div className='text-[6px] text-[#a8a29e]'>推荐工具</div>
                  </div>
                </div>
                <div className='mt-3 h-1.5 w-[70%] rounded bg-[#e7e5e4]' />
              </div>
            </SchemeCard>

            {/* 方案C */}
            <SchemeCard
              cons={['文章区域变窄', '移动端需隐藏', '与目录导航冲突']}
              features={['文章右侧固定栏', '始终可见', '滚动时高亮当前']}
              pros={['曝光率最高', '用户随时可点击', '适合长文']}
              title='方案 C：侧边栏固定列表'
            >
              <div className='flex gap-2 rounded-lg border border-[#e7e5e4] bg-white p-2'>
                <div className='flex-1 space-y-1'>
                  <div className='h-1.5 w-full rounded bg-[#e7e5e4]' />
                  <div className='h-1.5 w-[80%] rounded bg-[#e7e5e4]' />
                </div>
                <div className='w-16 rounded bg-[#fafaf9] p-1.5'>
                  <div className='text-[7px] font-bold text-[#78716c]'>
                    工具
                  </div>
                  <div className='mt-1 rounded bg-white px-1 py-0.5 text-[6px] text-[#b45309]'>
                    SEO Title
                  </div>
                  <div className='mt-0.5 rounded bg-white px-1 py-0.5 text-[6px]'>
                    Meta
                  </div>
                </div>
              </div>
            </SchemeCard>
          </div>
        </section>

        {/* ── Section 3: 对比页 ── */}
        <section className='mb-16'>
          <SectionTitle number={3} title='工具对比页方案' />

          <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
            {/* 方案A */}
            <SchemeCard
              badge='推荐'
              cons={['移动端横向滚动', '维度多时拥挤']}
              features={['横向表格', '行=维度', '列=工具']}
              pros={['信息密度最高', '一目了然', '适合2-4个工具对比']}
              title='方案 A：表格对比'
            >
              <div className='rounded-lg border border-[#e7e5e4] bg-white p-2'>
                <table className='w-full text-[8px]'>
                  <thead>
                    <tr className='border-b border-[#e7e5e4]'>
                      <th className='py-1 text-left text-[#78716c]'>维度</th>
                      <th className='py-1 text-center font-bold text-[#b45309]'>
                        A
                      </th>
                      <th className='py-1 text-center font-bold text-[#78716c]'>
                        B
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {['易用性', '功能', '价格'].map((d) => (
                      <tr className='border-b border-[#f5f5f4]' key={d}>
                        <td className='py-1 text-[#57534e]'>{d}</td>
                        <td className='py-1 text-center'>★★★★☆</td>
                        <td className='py-1 text-center'>★★★☆☆</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SchemeCard>

            {/* 方案B */}
            <SchemeCard
              cons={['占用空间大', '对比维度有限']}
              features={['每个工具一张卡片', '并排展示', '雷达图可视化']}
              pros={['视觉冲击力强', '适合展示评测结论', '移动端堆叠友好']}
              title='方案 B：卡片并排 + 雷达图'
            >
              <div className='flex gap-2 rounded-lg border border-[#e7e5e4] bg-white p-2'>
                <div className='flex-1 rounded bg-[#fafaf9] p-1.5 text-center'>
                  <div className='text-[8px] font-bold'>Tool A</div>
                  <RadarMini data={[4, 5, 3, 4, 5, 4]} size={50} />
                </div>
                <div className='flex-1 rounded bg-[#fafaf9] p-1.5 text-center'>
                  <div className='text-[8px] font-bold'>Tool B</div>
                  <RadarMini data={[3, 4, 5, 3, 4, 5]} size={50} />
                </div>
              </div>
            </SchemeCard>

            {/* 方案C */}
            <SchemeCard
              cons={['开发复杂度高', '需要状态管理']}
              features={['先选品类', '再选2-4个工具', '自动生成对比']}
              pros={['最灵活', '用户主动选择', '可扩展任意工具组合']}
              title='方案 C：交互式选择器'
            >
              <div className='rounded-lg border border-[#e7e5e4] bg-white p-3'>
                <div className='mb-2 flex gap-1'>
                  {['AI写作', '开发', '图像'].map((c) => (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[8px] ${c === 'AI写作' ? 'bg-[#b45309] text-white' : 'bg-[#f5f5f4] text-[#78716c]'}`}
                      key={c}
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <div className='space-y-1'>
                  {['✅ Jasper', '☑️ Copy.ai', '☑️ Writesonic'].map((t) => (
                    <div className='text-[9px] text-[#57534e]' key={t}>
                      {t}
                    </div>
                  ))}
                </div>
                <div className='mt-2 rounded bg-[rgba(180,83,9,0.08)] py-1 text-center text-[8px] font-bold text-[#b45309]'>
                  开始对比 →
                </div>
              </div>
            </SchemeCard>
          </div>
        </section>

        {/* ── Section 4: 雷达图展示 ── */}
        <section className='mb-16'>
          <SectionTitle number={4} title='雷达图评分展示效果' />

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='rounded-xl border border-[#e7e5e4] bg-white p-6'>
              <div className='mb-4 flex items-center gap-3'>
                <span className='text-2xl'>🔐</span>
                <div>
                  <h3 className='text-lg font-bold text-[#1c1917]'>
                    JWT Parser
                  </h3>
                  <div className='flex items-center gap-1 text-sm text-[#b45309]'>
                    <span>★★★★☆</span>
                    <span className='font-bold'>4.5</span>
                  </div>
                </div>
              </div>
              <div className='flex justify-center'>
                <RadarChart data={radarA} labels={labels} size={220} />
              </div>
              <div className='mt-4 grid grid-cols-3 gap-2 text-center text-[11px]'>
                {[
                  '易用性 4.5',
                  '功能性 4.0',
                  '性价比 3.5',
                  '设计 4.5',
                  '速度 4.0',
                  '生态 3.0',
                ].map((s) => (
                  <div className='rounded bg-[#fafaf9] py-1' key={s}>
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div className='rounded-xl border border-[#e7e5e4] bg-white p-6'>
              <div className='mb-4 flex items-center gap-3'>
                <span className='text-2xl'>📢</span>
                <div>
                  <h3 className='text-lg font-bold text-[#1c1917]'>
                    Ad Copy Generator
                  </h3>
                  <div className='flex items-center gap-1 text-sm text-[#b45309]'>
                    <span>★★★★☆</span>
                    <span className='font-bold'>4.2</span>
                  </div>
                </div>
              </div>
              <div className='flex justify-center'>
                <RadarChart data={radarB} labels={labels} size={220} />
              </div>
              <div className='mt-4 grid grid-cols-3 gap-2 text-center text-[11px]'>
                {[
                  '易用性 3.0',
                  '功能性 4.5',
                  '性价比 4.5',
                  '设计 3.5',
                  '速度 4.0',
                  '生态 4.5',
                ].map((s) => (
                  <div className='rounded bg-[#fafaf9] py-1' key={s}>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 5: 评分维度 ── */}
        <section className='mb-16'>
          <SectionTitle number={5} title='评分维度建议（待确认）' />

          <div className='rounded-xl border border-[#e7e5e4] bg-white p-6'>
            <p className='mb-4 text-[14px] text-[#78716c]'>
              建议分<strong>核心维度</strong>（必选，影响总分）和
              <strong>扩展维度</strong>（可选，丰富画像）：
            </p>

            <div className='mb-6'>
              <h3 className='mb-3 flex items-center gap-2 text-[14px] font-bold text-[#1c1917]'>
                <span className='rounded bg-[rgba(180,83,9,0.08)] px-2 py-0.5 text-[11px] text-[#b45309]'>
                  核心
                </span>
                必选维度（5个）
              </h3>
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                {DIMENSION_OPTIONS.filter((d) => d.weight === '核心').map(
                  (d) => (
                    <DimensionCard
                      key={d.key}
                      desc={d.desc}
                      name={d.name}
                      nameEn={d.nameEn}
                    />
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className='mb-3 flex items-center gap-2 text-[14px] font-bold text-[#1c1917]'>
                <span className='rounded bg-[#f5f5f4] px-2 py-0.5 text-[11px] text-[#78716c]'>
                  扩展
                </span>
                可选维度（3个）
              </h3>
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                {DIMENSION_OPTIONS.filter((d) => d.weight === '扩展').map(
                  (d) => (
                    <DimensionCard
                      key={d.key}
                      desc={d.desc}
                      name={d.name}
                      nameEn={d.nameEn}
                    />
                  )
                )}
              </div>
            </div>

            <div className='mt-6 rounded-lg bg-[#fafaf9] p-4'>
              <h4 className='mb-2 text-[13px] font-bold text-[#1c1917]'>
                总分计算方式
              </h4>
              <div className='text-[13px] text-[#57534e]'>
                <p>
                  核心维度平均分 × 80% + 扩展维度平均分 × 20% = 最终评分（1-5
                  星）
                </p>
                <p className='mt-1 text-[#78716c]'>
                  例：一个工具核心维度 [4,5,3,4,5] + 扩展维度 [4,3,5] =
                  (4.2×0.8) + (4.0×0.2) = <strong>4.16 ★</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 确认区 ── */}
        <section className='mb-20 rounded-xl border-2 border-[#b45309]/20 bg-[rgba(180,83,9,0.03)] p-8'>
          <h2 className='mb-4 text-[20px] font-bold text-[#1c1917]'>
            📋 需要你确认的选择
          </h2>
          <div className='space-y-3 text-[15px] text-[#57534e]'>
            <p>
              <strong>1. 评测 Tab 位置：</strong>方案 ___ （A / B / C）
            </p>
            <p>
              <strong>2. Blog 工具推荐：</strong>方案 ___ （A / B / C）
            </p>
            <p>
              <strong>3. 对比页形式：</strong>方案 ___ （A / B / C）
            </p>
            <p>
              <strong>4. 评分维度：</strong>
              核心5个是否足够？扩展维度要不要减少到2个？
            </p>
            <p>
              <strong>5. 维度名称：</strong>有没有需要替换或新增的？
            </p>
          </div>
          <p className='mt-4 text-[13px] text-[#78716c]'>
            把选择回复给我，我立刻按确认的方案实施到正式网站。
          </p>
        </section>
      </main>
    </div>
  );
}

/* ── 子组件 ── */

function SectionTitle({ number, title }: { number: number; title: string }) {
  return (
    <div className='mb-6 flex items-center gap-3'>
      <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-[#1c1917] text-sm font-bold text-white'>
        {number}
      </span>
      <h2 className='text-[20px] font-bold text-[#1c1917]'>{title}</h2>
    </div>
  );
}

function SchemeCard({
  title,
  features,
  pros,
  cons,
  badge,
  children,
}: {
  title: string;
  features: string[];
  pros: string[];
  cons: string[];
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col rounded-xl border border-[#e7e5e4] bg-white p-4 transition-shadow hover:shadow-md'>
      <div className='mb-3 flex items-center justify-between'>
        <h3 className='text-[14px] font-bold text-[#1c1917]'>{title}</h3>
        {badge && (
          <span className='rounded-full bg-[rgba(180,83,9,0.08)] px-2 py-0.5 text-[10px] font-bold text-[#b45309]'>
            {badge}
          </span>
        )}
      </div>

      {/* Mock UI */}
      <div className='mb-4 rounded-lg bg-[#fafaf9] p-2'>{children}</div>

      {/* Features */}
      <div className='mb-3 flex flex-wrap gap-1'>
        {features.map((f) => (
          <span
            className='rounded bg-[#f5f5f4] px-1.5 py-0.5 text-[10px] text-[#57534e]'
            key={f}
          >
            {f}
          </span>
        ))}
      </div>

      {/* Pros */}
      <div className='mb-2 space-y-1'>
        {pros.map((p) => (
          <div
            className='flex items-start gap-1.5 text-[11px] text-[#57534e]'
            key={p}
          >
            <span className='mt-0.5 text-[#22c55e]'>✓</span>
            <span>{p}</span>
          </div>
        ))}
      </div>

      {/* Cons */}
      <div className='mt-auto space-y-1 border-t border-[#f5f5f4] pt-2'>
        {cons.map((c) => (
          <div
            className='flex items-start gap-1.5 text-[11px] text-[#a8a29e]'
            key={c}
          >
            <span className='mt-0.5'>×</span>
            <span>{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DimensionCard({
  name,
  nameEn,
  desc,
}: {
  name: string;
  nameEn: string;
  desc: string;
}) {
  return (
    <div className='rounded-lg border border-[#e7e5e4] bg-[#fafaf9] p-3'>
      <div className='mb-1 text-[13px] font-bold text-[#1c1917]'>
        {name}
        <span className='ml-1 text-[11px] font-normal text-[#a8a29e]'>
          ({nameEn})
        </span>
      </div>
      <div className='text-[11px] text-[#78716c]'>{desc}</div>
    </div>
  );
}

function RadarMini({ data, size = 80 }: { data: number[]; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.35;
  const count = data.length;
  const angleStep = (Math.PI * 2) / count;

  const point = (i: number, r: number) => {
    const angle = i * angleStep - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  const pathData =
    data
      .map((v, i) => {
        const [x, y] = point(i, (v / 5) * radius);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ') + ' Z';

  return (
    <svg height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
      <path
        d={pathData}
        fill='rgba(180,83,9,0.12)'
        stroke='#b45309'
        strokeWidth={1}
      />
    </svg>
  );
}
