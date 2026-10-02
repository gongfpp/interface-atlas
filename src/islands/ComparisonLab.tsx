import { useEffect, useId, useRef, useState } from 'react';
import { localePath, type Locale } from '@/lib/i18n';
import '@/styles/comparison-lab.css';

type Task = 'overlay' | 'browse' | 'sections';
type Overlay = 'modal' | 'drawer' | 'sheet';
const copy = (locale: Locale, zh: string, en: string) => locale === 'zh' ? zh : en;
const products = [
  { zh: '桌面灯', en: 'Desk lamp', category: 'home', price: 129 },
  { zh: '随行杯', en: 'Travel cup', category: 'home', price: 89 },
  { zh: '无线键盘', en: 'Wireless keyboard', category: 'tech', price: 269 },
  { zh: '帆布包', en: 'Canvas bag', category: 'wear', price: 79 },
  { zh: '蓝牙音箱', en: 'Bluetooth speaker', category: 'tech', price: 399 },
  { zh: '收纳盒', en: 'Storage box', category: 'home', price: 59 },
];

function FilterPreview({ mode, locale }: { mode: Overlay; locale: Locale }) {
  const t = (zh: string, en: string) => copy(locale, zh, en);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('all');
  const [price, setPrice] = useState(500);
  const [picked, setPicked] = useState<string>();
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const title = mode === 'modal' ? t('弹窗', 'Modal') : mode === 'drawer' ? t('侧边抽屉', 'Side drawer') : t('底部面板', 'Bottom sheet');
  const result = products.filter(p => (category === 'all' || category === p.category) && p.price <= price);
  const close = () => { setOpen(false); requestAnimationFrame(() => trigger.current?.focus()); };
  useEffect(() => { if (open) panel.current?.querySelector<HTMLButtonElement>('button')?.focus(); }, [open]);
  return <article className="comparison-card" data-comparison={mode}>
    <header><h3>{title}</h3><span>{mode === 'drawer' ? t('非模态', 'Non-modal') : t('遮罩覆盖', 'Overlay')}</span></header>
    <div className={`comparison-shop comparison-shop-${mode}`} onKeyDown={e => { if (e.key === 'Escape' && open) { e.stopPropagation(); close(); } }}>
      <div className="comparison-products" inert={open && mode !== 'drawer' ? true : undefined}>
        <div className="comparison-shop-heading"><strong>{t('日常好物', 'Everyday goods')}</strong><button ref={trigger} onClick={() => setOpen(true)} aria-expanded={open} aria-controls={id}>{t('筛选', 'Filter')}</button></div>
        <p className="comparison-result" role="status">{t(`${result.length} 件商品 · ¥${price} 以内`, `${result.length} items · up to ¥${price}`)}</p>
        <div className="comparison-product-grid">{result.map(p => <button key={p.en} className={picked === p.en ? 'is-picked' : ''} onClick={() => setPicked(p.en)} aria-pressed={picked === p.en}><span>{p[locale]}</span><strong>¥{p.price}</strong></button>)}</div>
        {result.length === 0 && <p>{t('没有匹配商品，调整筛选试试。', 'No matches. Try changing your filters.')}</p>}
        <p className="comparison-note">{picked ? t(`已选：${products.find(p => p.en === picked)?.zh}`, `Selected: ${picked}`) : t('点击商品即可选中', 'Select an item to try the result area')}</p>
      </div>
      {open && <div className={`comparison-filter-layer ${mode}`}>
        {mode !== 'drawer' && <button className="comparison-backdrop" tabIndex={-1} aria-label={t('关闭筛选遮罩', 'Close filter overlay')} onClick={close} />}
        <div ref={panel} id={id} role="dialog" aria-label={`${title} · ${t('筛选商品', 'Filter products')}`} className="comparison-filter-panel" onKeyDown={e => {
          if (e.key !== 'Tab' || mode === 'drawer') return;
          const items = Array.from(panel.current?.querySelectorAll<HTMLElement>('button, select, input') ?? []);
          if (e.shiftKey && document.activeElement === items[0]) { e.preventDefault(); items.at(-1)?.focus(); }
          if (!e.shiftKey && document.activeElement === items.at(-1)) { e.preventDefault(); items[0]?.focus(); }
        }}>
          <div className="comparison-shop-heading"><strong>{t('筛选商品', 'Filter products')}</strong><button onClick={close} aria-label={t('关闭筛选', 'Close filters')}>×</button></div>
          <label>{t('类别', 'Category')}<select value={category} onChange={e => setCategory(e.target.value)}><option value="all">{t('全部', 'All')}</option><option value="home">{t('家居', 'Home')}</option><option value="tech">{t('数码', 'Tech')}</option><option value="wear">{t('配饰', 'Accessories')}</option></select></label>
          <label>{t('最高价格', 'Maximum price')} · ¥{price}<input aria-label={t('最高价格', 'Maximum price')} type="range" min={50} max={500} step={10} value={price} onChange={e => setPrice(Number(e.target.value))} /></label>
          <p role="status">{t(`${result.length} 件匹配 · 立即生效`, `${result.length} matches · applied immediately`)}</p>
          <div className="comparison-actions"><button onClick={() => { setCategory('all'); setPrice(500); }}>{t('清除条件', 'Clear filters')}</button><button onClick={close}>{t('查看结果', 'View results')}</button></div>
        </div>
      </div>}
    </div>
    <p className="comparison-explanation">{mode === 'modal' ? t('遮住结果、集中完成选择；关闭后才能操作商品。', 'Covers results to focus on a choice. Close it to interact with products.') : mode === 'drawer' ? t('本例使用非模态抽屉：条件变化时，左侧结果仍可点击。窄容器下结果可见面积会减少。', 'This non-modal drawer keeps results interactive on the left. Narrow containers leave less room for results.') : t('从底部展开，保留上方场景；内容增加时，面板内部滚动。', 'Opens from below, retaining context above. Extra content scrolls inside the panel.')}</p>
    <a className="comparison-detail-link" href={localePath(`/components/${mode === 'sheet' ? 'bottom-sheet' : mode}`, locale)}>{t('选择这个组件 →', 'Explore this component →')}</a>
  </article>;
}

function BrowsePreview({ infinite, locale }: { infinite: boolean; locale: Locale }) {
  const t = (zh: string, en: string) => copy(locale, zh, en);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(4);
  const [chosen, setChosen] = useState<number>();
  const scroller = useRef<HTMLDivElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!infinite || count >= 12 || !sentinel.current || !scroller.current) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) setCount(c => Math.min(c + 4, 12));
    }, { root: scroller.current, threshold: 0.1 });
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [infinite, count]);
  const numbers = Array.from({ length: infinite ? count : 4 }, (_, i) => infinite ? i + 1 : (page - 1) * 4 + i + 1);
  return <article className="comparison-card" data-comparison={infinite ? 'infinite' : 'pagination'}>
    <header><h3>{t(infinite ? '无限滚动' : '分页', infinite ? 'Infinite scroll' : 'Pagination')}</h3><span>12 {t('份记录', 'records')}</span></header>
    <div ref={scroller} className="comparison-records" tabIndex={0} role="region" aria-label={t(infinite ? '连续记录列表' : '分页记录列表', infinite ? 'Continuous records' : 'Paginated records')}>
      {numbers.map(n => <button key={n} className={`comparison-record ${chosen === n ? 'is-picked' : ''}`} aria-pressed={chosen === n} onClick={() => setChosen(n)}><span>{t('设计提案', 'Design proposal')} <strong>#{String(n).padStart(2, '0')}</strong><small>{t('同一组内容 · 点击标记', 'Shared dataset · select to mark')}</small></span><span aria-hidden="true">{chosen === n ? '✓' : '↗'}</span></button>)}
      {infinite && count < 12 && <div ref={sentinel} className="comparison-sentinel"><button onClick={() => setCount(c => Math.min(c + 4, 12))}>{t('加载更多', 'Load more')}</button></div>}
      {infinite && count === 12 && <p className="comparison-note">{t('全部 12 份记录已加载', 'All 12 records loaded')}</p>}
    </div>
    {!infinite && <nav className="comparison-pagination" aria-label={t('记录分页', 'Record pages')}>{[1, 2, 3].map(n => <button key={n} aria-current={page === n ? 'page' : undefined} onClick={() => { setPage(n); scroller.current?.scrollTo(0, 0); }}>{n}</button>)}</nav>}
    <p className="comparison-result" role="status">{chosen ? t(`已标记 #${String(chosen).padStart(2, '0')}`, `Marked #${String(chosen).padStart(2, '0')}`) : t('任务：找到并标记第 11 份记录', 'Task: find and mark record #11')}{infinite ? t(` · 已加载 ${count}/12`, ` · ${count}/12 loaded`) : t(` · 第 ${page}/3 页`, ` · page ${page}/3`)}</p>
    <p className="comparison-explanation">{infinite ? t('向下滚动自动追加，也可用“加载更多”。连续浏览顺畅，但找回具体位置更费力；本例用 12 条记录演示有限批次。', 'Scrolling appends records; Load more is also keyboard accessible. Good for exploration, but returning to an exact location takes more work. This demo ends after 12 records.') : t('可以直接跳到第 3 页，并在切换页面后保留标记。适合定位、回查和有明确终点的任务。', 'Jump directly to page 3; your mark survives page changes. Useful for locating records, revisiting them, and completing a bounded task.')}</p>
    <a className="comparison-detail-link" href={localePath(infinite ? '/patterns/infinite-scroll' : '/components/pagination', locale)}>{t('查看实现与方案 →', 'Explore implementation and options →')}</a>
  </article>;
}

function SectionPreview({ accordion, locale }: { accordion: boolean; locale: Locale }) {
  const t = (zh: string, en: string) => copy(locale, zh, en);
  const [active, setActive] = useState(0);
  const id = useId();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const sections = [
    { title: t('配送', 'Delivery'), body: t('订单确认后 2 个工作日内发货。标准配送免费，偏远地区需多 3–5 天。', 'Dispatch within 2 working days. Standard delivery is free; remote areas need another 3–5 days.') },
    { title: t('退货', 'Returns'), body: t('签收后 14 天内可申请退货。保留包装并保持商品完好；质量问题由商家承担运费。', 'Request a return within 14 days. Keep the packaging and item intact. The seller pays shipping for faulty items.') },
    { title: t('保修', 'Warranty'), body: t('提供一年保修。提交订单号和问题照片后，我们会在 1 个工作日内答复。', 'One-year warranty. Send the order number and a photo of the issue; expect a reply within 1 working day.') },
  ];
  return <article className="comparison-card" data-comparison={accordion ? 'accordion' : 'tabs'}>
    <header><h3>{t(accordion ? '折叠面板' : '标签页', accordion ? 'Accordion' : 'Tabs')}</h3><span>{t('商品说明', 'Product guide')}</span></header>
    <div className="comparison-section-body">
      {accordion ? sections.map((s, i) => <details key={s.title} open={i === 0 ? true : undefined}><summary>{s.title}</summary><p>{s.body}</p></details>) : <>
        <div role="tablist" aria-label={t('商品说明', 'Product guide')} className="comparison-tabs">{sections.map((s, i) => <button key={s.title} ref={el => { tabs.current[i] = el; }} role="tab" id={`${id}-tab-${i}`} aria-controls={`${id}-panel-${i}`} aria-selected={active === i} tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={e => {
          const next = e.key === 'ArrowRight' ? (i + 1) % 3 : e.key === 'ArrowLeft' ? (i + 2) % 3 : e.key === 'Home' ? 0 : e.key === 'End' ? 2 : undefined;
          if (next !== undefined) { e.preventDefault(); setActive(next); tabs.current[next]?.focus(); }
        }}>{s.title}</button>)}</div>
        {sections.map((s, i) => <div key={s.title} role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={active !== i} tabIndex={0}><p>{s.body}</p></div>)}
      </>}
    </div>
    <p className="comparison-explanation">{accordion ? t('可同时展开配送和退货，方便交叉核对；内容越多，页面越长。', 'Open Delivery and Returns together to cross-check. More expanded content makes a longer page.') : t('每次聚焦一类说明，页面高度稳定；交叉核对需要反复切换。用左右方向键切换标签。', 'Focus on one topic in a stable area. Cross-checking requires switching. Use Left and Right arrow keys between tabs.')}</p>
    <a className="comparison-detail-link" href={localePath(`/components/${accordion ? 'accordion' : 'tabs'}`, locale)}>{t('选择这个组件 →', 'Explore this component →')}</a>
  </article>;
}

export default function ComparisonLab({ locale = 'zh', initialTask = 'overlay' }: { locale?: Locale; initialTask?: Task }) {
  const [task, setTask] = useState<Task>(initialTask);
  const [revision, setRevision] = useState(0);
  const t = (zh: string, en: string) => copy(locale, zh, en);
  const choices: Array<{ id: Task; zh: string; en: string }> = [{ id: 'overlay', zh: '筛选商品', en: 'Filter products' }, { id: 'browse', zh: '查找记录', en: 'Find a record' }, { id: 'sections', zh: '核对说明', en: 'Check a guide' }];
  return <section id="comparison-lab" className="comparison-lab" aria-label={t('同任务体验对比', 'Same-task comparison')}>
    <div className="comparison-lab-heading"><div><p className="comparison-eyebrow">{t('先试，再选', 'TRY BEFORE YOU CHOOSE')}</p><h2>{t('同一个任务，不同的操作体验', 'One task. Different ways to do it.')}</h2></div><button onClick={() => setRevision(n => n + 1)}>{t('重置本组', 'Reset this group')}</button></div>
    <div className="comparison-task-switch" aria-label={t('选择体验任务', 'Choose a task')}>{choices.map(c => <button key={c.id} aria-pressed={task === c.id} onClick={() => setTask(c.id)}>{c[locale]}</button>)}</div>
    <p className="comparison-task">{task === 'overlay' ? t('试试：筛选 ¥200 以内的家居商品，关闭再打开，再点选结果。观察什么被挡住、条件是否保留。三个预览独立操作，关闭不会清除条件；重置或离开本组会清除。', 'Try filtering Home items below ¥200. Close, reopen, then select a result. Notice what gets covered and which choices persist. Previews are independent; closing preserves filters, while resetting or leaving this group clears them.') : task === 'browse' ? t('试试：从同一批 12 份设计提案中，找到并标记 #11，然后返回 #03。比较直接定位与连续浏览。', 'Try finding and marking #11 in the same set of 12 proposals, then return to #03. Compare direct navigation with continuous browsing.') : t('试试：核对配送时效与退货期限。两边使用完全相同的说明，尝试把两项同时留在眼前。', 'Try checking delivery time against the return window. Both previews use identical text. Try keeping both topics visible at once.')}</p>
    <div key={`${task}-${revision}`} className={`comparison-grid ${task === 'overlay' ? 'three' : ''}`}>
      {task === 'overlay' ? (['modal', 'drawer', 'sheet'] as Overlay[]).map(mode => <FilterPreview key={mode} mode={mode} locale={locale} />) : task === 'browse' ? <><BrowsePreview infinite={false} locale={locale} /><BrowsePreview infinite locale={locale} /></> : <><SectionPreview accordion={false} locale={locale} /><SectionPreview accordion locale={locale} /></>}
    </div>
    <p className="comparison-footnote">{t('这是受限容器里的交互样板，用于比较行为；抽屉也可设计为模态。实际项目仍需测试设备视口、长内容与辅助技术。', 'These bounded previews compare behavior. Drawers can also be modal. Test real device viewports, long content, and assistive technology in your project.')}</p>
  </section>;
}
