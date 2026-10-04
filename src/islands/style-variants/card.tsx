import { useId, type ReactNode } from 'react';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function useCardDemo({ session, locale }: VariantDemoProps) {
  const id = useId();
  const [open, setOpen] = useSessionState(session, 'cardDetailsOpen', false);
  const [saved, setSaved] = useSessionState(session, 'cardBookmarked', false);
  const [changed, setChanged] = useSessionState(session, 'cardBookmarkChanged', false);
  return {
    id, zh: locale === 'zh', open, saved, changed,
    toggleDetails() { setOpen((previous) => !previous); },
    toggleSaved() { setSaved((previous) => !previous); setChanged(true); },
  };
}

type CardDemo = ReturnType<typeof useCardDemo>;

/** 使用真正的本地操作按钮；卡片本身不作为嵌套点击目标。 */
function CardControls({ demo, buttonClassName, detailClassName = '', children, changelog = false }: {
  demo: CardDemo; buttonClassName: string; detailClassName?: string; children: ReactNode; changelog?: boolean;
}) {
  const show = changelog ? demo.zh ? '展开更新日志' : 'Show changelog' : demo.zh ? '展开详情' : 'Show details';
  const hide = changelog ? demo.zh ? '收起更新日志' : 'Hide changelog' : demo.zh ? '收起详情' : 'Hide details';
  return (
    <div className="mt-4 min-w-0 text-xs leading-relaxed [overflow-wrap:anywhere]">
      <div className="flex flex-wrap gap-3">
        <button type="button" data-card-detail-toggle aria-expanded={demo.open} aria-controls={`${demo.id}-details`} onClick={demo.toggleDetails} className={`min-h-11 max-w-full px-3 py-2 text-left font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${buttonClassName}`}>
          {demo.open ? hide : show}
        </button>
        <button type="button" aria-label={demo.zh ? '在本地演示中收藏' : 'Bookmark in this local demo'} aria-pressed={demo.saved} onClick={demo.toggleSaved} className={`min-h-11 max-w-full px-3 py-2 text-left font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${buttonClassName}`}>
          <span aria-hidden="true">{demo.saved ? '✓ ' : '+ '}</span>{demo.saved ? demo.zh ? '已收藏' : 'Bookmarked' : demo.zh ? '收藏' : 'Bookmark'}
        </button>
      </div>
      <div id={`${demo.id}-details`} hidden={!demo.open} role="region" aria-labelledby={`${demo.id}-details-title`} className={`mt-4 border-t border-current/25 pt-3 ${detailClassName}`}>
        <h4 id={`${demo.id}-details-title`} className="mb-2 font-semibold">{demo.zh ? '本地预览详情' : 'Local preview details'}</h4>
        {children}
      </div>
      <p role="status" className="mt-3 min-h-5">
        {demo.changed ? demo.saved
          ? demo.zh ? '已在本次演示中收藏。可再次点击撤销。' : 'Bookmarked for this demo. Select again to undo.'
          : demo.zh ? '已取消本次演示的收藏。' : 'Bookmark removed from this demo.'
          : ''}
      </p>
      <p className="mt-2 text-[11px]">{demo.zh ? '本地交互演示 · 不会打开外部页面或同步账号' : 'Local interaction demo · No external page or account sync'}</p>
    </div>
  );
}

function MinimalCard(props: VariantDemoProps) {
  const demo = useCardDemo(props);
  return (
    <article className="mx-auto w-full max-w-sm border border-black/15 bg-white p-5 text-black [overflow-wrap:anywhere]">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/65">{demo.zh ? '随笔' : 'Essay'}</p>
      <h3 className="mt-2 text-2xl font-semibold leading-tight tracking-tight">{demo.zh ? '克制的形状' : 'The shape of restraint'}</h3>
      <p className="mt-2 text-xs leading-relaxed text-black/65">{demo.zh ? '发丝边框、两级字号，仅此而已。' : 'Hairline border, two type sizes, nothing else.'}</p>
      <p className="mt-5 border-t border-black/10 pt-3 text-[11px] uppercase tracking-wider text-black/65">{demo.zh ? '阅读时间 · 6 分钟' : 'Reading time · 6 min'}</p>
      <CardControls demo={demo} buttonClassName="border-b border-black hover:bg-black/5">
        <p>{demo.zh ? '让标题、摘要和操作分别承担一个任务。用留白表达层级，不叠加装饰。' : 'Give the title, summary and actions one job each. Let whitespace establish hierarchy without added decoration.'}</p>
      </CardControls>
    </article>
  );
}

function AuroraCard(props: VariantDemoProps) {
  const demo = useCardDemo(props);
  return (
    <article className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-white/15 bg-[#0b0f1f] p-5 text-[#e7ecff] [overflow-wrap:anywhere]">
      <span aria-hidden="true" className="pointer-events-none absolute -left-10 -top-12 h-40 w-40 rounded-full bg-[#5b8cff] opacity-40 blur-3xl" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-16 -right-8 h-40 w-40 rounded-full bg-[#b45bff] opacity-40 blur-3xl" />
      <span aria-hidden="true" className="pointer-events-none absolute right-10 top-4 h-24 w-24 rounded-full bg-[#3ff0c0] opacity-30 blur-3xl" />
      <div className="relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#c4cdec]">{demo.zh ? '示例版本 3.0' : 'Sample release 3.0'}</p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight">{demo.zh ? '把极光，装进界面。' : 'Northern lights, shipped.'}</h3>
        <p className="mt-2 text-xs leading-relaxed text-[#c4cdec]">{demo.zh ? '柔焦渐变光斑，映衬玻璃边框。' : 'Soft gradient blooms behind a glass border.'}</p>
        <CardControls demo={demo} changelog buttonClassName="rounded-full border border-white/40 bg-white/10 hover:bg-white/20 focus-visible:outline-[#e6b4ff]">
          <ul className="list-inside list-disc space-y-2">
            <li>{demo.zh ? '示例：更清晰的键盘焦点。' : 'Sample: clearer keyboard focus.'}</li>
            <li>{demo.zh ? '示例：无需离开卡片即可展开详情。' : 'Sample: details that open inside the card.'}</li>
          </ul>
        </CardControls>
      </div>
    </article>
  );
}

function BentoCard(props: VariantDemoProps) {
  const demo = useCardDemo(props);
  return (
    <article className="mx-auto grid w-full max-w-sm grid-cols-3 gap-2 rounded-2xl bg-[#eef0f3] p-2 text-[#1c1f24] [overflow-wrap:anywhere]">
      <div className="col-span-3 min-w-0 rounded-xl bg-white p-3 shadow-[0_1px_2px_#0000000d]">
        <h3 className="text-sm font-semibold">{demo.zh ? '每周报告 · 示例数据' : 'Weekly report · Sample data'}</h3>
        <p className="mt-1 text-xs text-[#505966]">{demo.zh ? '整齐模块、等距间隙、柔和圆角。' : 'Tidy modules, equal gaps, soft radii.'}</p>
      </div>
      <div className="col-span-2 min-w-0 rounded-xl bg-[#1c1f24] p-3 text-white">
        <p className="text-2xl font-bold tracking-tight">82%</p>
        <p className="text-[10px] uppercase tracking-wider text-[#ced3da]">{demo.zh ? '已完成' : 'Done'}</p>
      </div>
      <div className="col-span-1 min-w-0 rounded-xl bg-[#d7f36a] p-3">
        <p className="text-2xl font-bold tracking-tight">+12</p>
        <p className="text-[10px] uppercase tracking-wider">{demo.zh ? '新增' : 'New'}</p>
      </div>
      <div className="col-span-3 min-w-0 rounded-xl bg-white px-3 pb-3">
        <CardControls demo={demo} buttonClassName="rounded-lg border border-[#66717e] hover:bg-[#eef0f3]">
          <p>{demo.zh ? '这些数字是布局演示数据。较宽模块突出完成度，较窄模块补充增量；没有连接真实报告。' : 'These are sample figures. The wider module emphasizes completion while the smaller one adds a count; no live report is connected.'}</p>
        </CardControls>
      </div>
    </article>
  );
}

function EditorialCard(props: VariantDemoProps) {
  const demo = useCardDemo(props);
  return (
    <article className="mx-auto w-full max-w-sm border-y-4 border-double border-[#29251f] bg-[#fbf9f4] p-5 text-[#29251f] [overflow-wrap:anywhere]">
      <p className="border-b border-[#a49b8e] pb-3 font-mono text-[10px] uppercase tracking-[0.2em]">{demo.zh ? '设计周刊 / 第 06 期' : 'The Design Journal / No. 06'}</p>
      <div className="mt-5 grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
        <span aria-hidden="true" className="font-serif text-4xl italic text-[#80502f]">A</span>
        <div className="min-w-0">
          <h3 className="font-serif text-3xl italic leading-tight">{demo.zh ? '给思想，留出空白' : 'Room for a thought'}</h3>
          <p className="mt-3 font-serif text-sm leading-relaxed">{demo.zh ? '双线书眉、窄栏编号与舒展的文字，让卡片像一页可阅读的杂志。' : 'A double-rule masthead, narrow index and airy type turn the card into a readable journal page.'}</p>
        </div>
      </div>
      <CardControls demo={demo} buttonClassName="border-b border-[#80502f] font-serif italic hover:text-[#80502f] focus-visible:outline-[#29251f] focus-visible:outline-dotted" detailClassName="font-serif text-sm">
        <p>{demo.zh ? '编者手记：先建立阅读节奏，再安排操作。细线承担分隔，衬线与斜体负责叙事。' : 'Editor’s note: establish a reading rhythm before placing actions. Rules separate sections; serif and italic type carry the story.'}</p>
      </CardControls>
    </article>
  );
}

function NeobrutalCard(props: VariantDemoProps) {
  const demo = useCardDemo(props);
  return (
    <article className="mx-auto w-full max-w-sm border-[3px] border-black bg-[#fff6dc] text-black shadow-[5px_5px_0_#000] [overflow-wrap:anywhere]">
      <p className="border-b-[3px] border-black bg-[#ff6b00] px-4 py-3 text-xs font-black uppercase tracking-wide">{demo.zh ? '设计实验 / 06' : 'Design experiment / 06'}</p>
      <div className="p-5">
        <h3 className="text-3xl font-black uppercase leading-none tracking-tight">{demo.zh ? '大声表达。' : 'Make it loud.'}</h3>
        <p className="mt-4 border-l-[3px] border-black pl-3 text-sm font-semibold">{demo.zh ? '厚边框、硬阴影与紧凑堆叠，让内容直截了当。' : 'Heavy outlines, hard shadows and tight stacks make a direct statement.'}</p>
        <CardControls demo={demo} buttonClassName="border-2 border-black bg-white font-black uppercase shadow-[3px_3px_0_#000] hover:bg-[#ffe66d] active:shadow-none motion-safe:active:translate-x-px motion-safe:active:translate-y-px">
          <p>{demo.zh ? '边框与投影都使用实体黑色。按压反馈可以减弱，但焦点轮廓与文字状态始终保留。' : 'Borders and shadows use solid black. Press motion can be reduced while focus outlines and text states remain visible.'}</p>
        </CardControls>
      </div>
    </article>
  );
}

function NeumorphicCard(props: VariantDemoProps) {
  const demo = useCardDemo(props);
  return (
    <article className="mx-auto w-full max-w-sm rounded-3xl bg-[#e7ecf2] p-6 text-[#283c50] shadow-[8px_8px_18px_#bcc6d1,-8px_-8px_18px_#ffffff] [overflow-wrap:anywhere]">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#c5cfda] text-xl font-semibold text-[#1756a9] shadow-[inset_5px_5px_10px_#c1cbd6,inset_-5px_-5px_10px_#ffffff]" aria-hidden="true">06</div>
      <h3 className="text-2xl font-semibold leading-tight">{demo.zh ? '柔软，有分寸' : 'Soft, with structure'}</h3>
      <p className="mt-3 text-sm leading-relaxed text-[#4d6175]">{demo.zh ? '同一块灰蓝材质上的凸起卡面与凹陷徽章。' : 'A raised card and inset badge shaped from one blue-grey surface.'}</p>
      <CardControls demo={demo} buttonClassName="rounded-xl border border-[#738496] bg-[#e7ecf2] shadow-[4px_4px_8px_#bdc8d3,-4px_-4px_8px_#ffffff] hover:border-[#1756a9] aria-pressed:border-[#1756a9] aria-pressed:text-[#1756a9] aria-pressed:shadow-[inset_3px_3px_6px_#bdc8d3,inset_-3px_-3px_6px_#ffffff] focus-visible:outline-[#1756a9]">
        <p>{demo.zh ? '明暗双阴影表达材质，而文字、实线边界与可见焦点共同表达交互状态。' : 'Paired light and dark shadows express material; text, solid boundaries and visible focus communicate interaction states.'}</p>
      </CardControls>
    </article>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'minimalism', name: { zh: '极简主义', en: 'Minimalism' },
    note: { zh: '发丝边框与字号分层，细线页脚提供可撤销的本地详情和收藏操作。', en: 'A hairline box and type hierarchy end in a thin footer with reversible local details and bookmarking.' },
    Demo: MinimalCard,
  },
  {
    style: 'aurora', name: { zh: '极光渐变', en: 'Aurora Gradient' },
    note: { zh: '蓝紫青柔焦光斑与玻璃边框衬托内容；更新日志在卡内真实展开。', en: 'Soft blue, purple and teal blooms frame content behind a glass border; the sample changelog opens inside the card.' },
    Demo: AuroraCard,
  },
  {
    style: 'bento-grid', name: { zh: '便当盒网格', en: 'Bento Grid' },
    note: { zh: '不等宽圆角模块用间隙与色块组织示例指标，操作区独立成格。', en: 'Unequal rounded modules organize sample metrics through gaps and colour, with a separate action tile.' },
    Demo: BentoCard,
  },
  {
    style: 'editorial', name: { zh: '杂志编辑风', en: 'Editorial' },
    note: { zh: '双线书眉、窄栏编号与衬线斜体形成杂志页面，细线替代卡片外框。', en: 'A double-rule masthead, narrow index and italic serif headline form a journal page with rules instead of a box.' },
    Demo: EditorialCard,
  },
  {
    style: 'neobrutalism', name: { zh: '新粗野主义', en: 'Neobrutalism' },
    note: { zh: '橙色刊头、超粗标题、3px 黑边与硬投影紧凑堆叠，操作有明确文字反馈。', en: 'An orange banner, ultra-bold headline, 3px black border and hard shadow stack tightly around explicit action feedback.' },
    Demo: NeobrutalCard,
  },
  {
    style: 'neumorphism', name: { zh: '新拟态', en: 'Neumorphism' },
    note: { zh: '灰蓝同色底配凸起卡面、凹陷徽章和双阴影按钮，同时保留可见边界与焦点。', en: 'A shared blue-grey material shapes a raised card, inset badge and paired-shadow buttons with visible boundaries and focus.' },
    Demo: NeumorphicCard,
  },
];

export default styleVariants;
