import type { StyleVariantSet, VariantDemoProps } from './types';
import { useDisclosure } from './behavior';

function Glass({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const { open, setOpen } = useDisclosure(session, 'open');
  return (
    <div className="relative mx-auto h-64 w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-[#7c5cff] via-[#ff6ec7] to-[#5ad1ff] p-5 text-white">
      <span className="pointer-events-none absolute -left-8 top-0 h-24 w-24 rounded-full bg-white/40 blur-xl" />
      <button onClick={() => setOpen(true)} className="rounded-xl border border-white/50 bg-white/20 px-4 py-2 text-xs font-semibold backdrop-blur-md">{en ? 'Open sheet' : '打开面板'}</button>
      {open && (
        <div className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-white/50 bg-white/25 p-5 backdrop-blur-xl">
          <span className="mx-auto block h-1 w-10 rounded-full bg-white/60" />
          <h3 className="mt-3 text-sm font-semibold">{en ? 'Share this view' : '分享此视图'}</h3>
          <p className="mt-1 text-[11px] text-white/80">Frosted glass rises over the gradient.</p>
          <div className="mt-3 flex gap-2">
            <button className="rounded-lg border border-white/50 bg-white/25 px-3 py-1.5 text-[11px] font-semibold backdrop-blur-md">{en ? 'Copy link' : '复制链接'}</button>
            <button onClick={() => setOpen(false)} className="rounded-lg px-3 py-1.5 text-[11px] text-white/90 hover:bg-white/15">{en ? 'Close' : '关闭'}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Neumorph({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const { open, setOpen } = useDisclosure(session, 'open');
  const raised = { boxShadow: '8px 8px 16px #b8bcc4, -8px -8px 16px #ffffff' };
  return (
    <div className="relative mx-auto h-64 w-full max-w-sm overflow-hidden rounded-3xl bg-[#e0e5ec] p-5 text-[#4a5568]">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8792a2]">{en ? 'Controls' : '控制'}</p>
      <button onClick={() => setOpen(true)} className="mt-4 rounded-2xl bg-[#e0e5ec] px-5 py-3 text-sm font-semibold" style={raised}>{en ? 'Open options' : '打开选项'}</button>
      {open && (
        <div className="absolute inset-x-3 bottom-3 rounded-3xl bg-[#e0e5ec] p-5" style={raised}>
          <span className="mx-auto block h-1.5 w-12 rounded-full bg-[#c3c9d4]" />
          <h3 className="mt-3 text-sm font-bold">{en ? 'Sheet title' : '面板标题'}</h3>
          <p className="mt-1 text-[11px] leading-relaxed text-[#8792a2]">Soft extruded clay, no borders.</p>
          <button onClick={() => setOpen(false)} className="mt-4 w-full rounded-2xl bg-[#e0e5ec] py-2 text-xs font-semibold" style={raised}>{en ? 'Done' : '完成'}</button>
        </div>
      )}
    </div>
  );
}

function Swiss({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const { open, setOpen } = useDisclosure(session, 'open');
  return (
    <div className="relative mx-auto h-64 w-full max-w-sm overflow-hidden border border-line bg-raised p-5 text-ink">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-2">Grid / 12</p>
      <button onClick={() => setOpen(true)} className="mt-4 bg-ink px-4 py-2 text-xs font-bold uppercase tracking-wider text-paper">{en ? 'Open panel' : '打开面板'}</button>
      {open && (
        <div className="absolute inset-x-0 bottom-0 border-t-4 border-[#e2001a] bg-raised p-5">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-bold uppercase tracking-tight">{en ? 'Options' : '选项'}</h3>
            <span className="font-mono text-[10px] text-ink-3">03</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-px bg-line">
            {(en ? ['Copy', 'Move', 'Delete'] : ['复制', '移动', '删除']).map((a) => (
              <button key={a} className="bg-raised py-3 text-xs font-medium uppercase tracking-wide hover:bg-[#e2001a] hover:text-white">{a}</button>
            ))}
          </div>
          <button onClick={() => setOpen(false)} className="mt-4 text-[11px] uppercase tracking-widest text-ink-2 underline decoration-[#e2001a] underline-offset-4">{en ? 'Close' : '关闭'}</button>
        </div>
      )}
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'glassmorphism',
    name: { zh: '玻璃拟态', en: 'Glassmorphism' },
    note: {
      zh: '底部抽屉是升起的磨砂玻璃：彩色渐变底、白色半透明面、顶部把手与 backdrop blur。',
      en: 'The bottom sheet is rising frosted glass — colourful gradient backdrop, translucent white panel, handle and backdrop blur.',
    },
    Demo: Glass,
  },
  {
    style: 'neumorphism',
    name: { zh: '新拟态', en: 'Neumorphism' },
    note: {
      zh: '同色底上用双向阴影把抽屉“挤”出来，没有边框，只靠明暗双影和柔和高光。',
      en: 'On a single-colour ground the sheet is extruded with dual soft shadows — no border, just highlight and shade.',
    },
    Demo: Neumorph,
  },
  {
    style: 'swiss-style',
    name: { zh: '瑞士风格', en: 'Swiss Style' },
    note: {
      zh: '抽屉严格贴网格：红色顶线、编号、三等分操作格与无衬线大写，去掉一切阴影。',
      en: 'The sheet snaps to a strict grid — red top rule, numbering, a three-column action grid and grotesque caps, zero shadow.',
    },
    Demo: Swiss,
  },
];

export default styleVariants;
