import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function BentoMenu({ session }: VariantDemoProps) {
  const [active, setActive] = useSessionState(session, 'active', 'Home');
  const items = ['Home', 'Explore', 'Library', 'Inbox', 'Profile'];
  return (
    <div className="mx-auto grid w-full max-w-sm grid-cols-2 gap-3 bg-paper p-1">
      {items.map((it, i) => (
        <button
          key={it}
          onClick={() => setActive(it)}
          className={`rounded-2xl border p-4 text-left transition-colors ${i === 0 ? 'col-span-2' : ''} ${
            active === it ? 'border-accent bg-accent-soft' : 'border-line bg-raised'
          }`}
        >
          <span className="font-mono text-[10px] text-ink-3">0{i + 1}</span>
          <span className="mt-6 block text-sm font-medium text-ink">{it}</span>
        </button>
      ))}
    </div>
  );
}

function CyberMenu({ session }: VariantDemoProps) {
  const [active, setActive] = useSessionState(session, 'active', 0);
  const items = ['/dashboard', '/net-runner', '/black-market', '/settings'];
  return (
    <div
      className="mx-auto w-full max-w-sm bg-[#05060a] p-5 font-mono"
      style={{ border: '1px solid #00f0ff55', boxShadow: '0 0 24px #00f0ff22' }}
    >
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#ff2e88]">// system menu</p>
      <nav className="mt-3 flex flex-col">
        {items.map((it, i) => (
          <button
            key={it}
            onClick={() => setActive(i)}
            className={`border-l-2 py-2 pl-3 text-left text-sm transition-colors ${
              active === i ? 'border-[#00f0ff] text-[#00f0ff]' : 'border-[#33384a] text-[#8b93b0]'
            }`}
          >
            <span className="mr-2 text-[#ff2e88]">{String(i + 1).padStart(2, '0')}</span>
            {it}
          </button>
        ))}
      </nav>
    </div>
  );
}

function OrganicMenu({ session }: VariantDemoProps) {
  const [active, setActive] = useSessionState(session, 'active', 'Garden');
  const items = ['Garden', 'Harvest', 'Compost'];
  return (
    <div className="mx-auto w-full max-w-sm rounded-[2.5rem] bg-[#eef3e2] p-6 text-[#35482e]">
      <p className="px-2 text-xs uppercase tracking-[0.2em] text-[#7a8a63]">Menu</p>
      <nav className="mt-3 flex flex-col gap-2">
        {items.map((it) => (
          <button
            key={it}
            onClick={() => setActive(it)}
            className={`rounded-[2rem] px-5 py-3 text-left text-sm transition-colors ${
              active === it ? 'bg-[#5c7a4a] text-[#f3f7e8]' : 'bg-[#e2ead0] text-[#35482e]'
            }`}
          >
            {it}
          </button>
        ))}
      </nav>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'bento-grid',
    name: { zh: '便当网格', en: 'Bento Grid' },
    note: {
      zh: '导航项被打成大小不一的圆角模块，首项横跨两列做主角，选中态用主题色描边与浅底标出。',
      en: 'Nav items become rounded modules of unequal size, the first spanning two columns as hero and selection marked by accent border and tint.',
    },
    Demo: BentoMenu,
  },
  {
    style: 'cyberpunk',
    name: { zh: '赛博朋克', en: 'Cyberpunk' },
    note: {
      zh: '近黑底上等宽路径名配青色霓虹左轨与洋红序号，选中项整行发光，像终端里的活动条目。',
      en: 'Monospace routes on near-black carry cyan neon rails and magenta indices, the active row glowing like a live terminal entry.',
    },
    Demo: CyberMenu,
  },
  {
    style: 'organic',
    name: { zh: '有机自然', en: 'Organic' },
    note: {
      zh: '大面积圆角与奶油绿分层色，选中项化作深苔绿药丸，轮廓柔软到几乎没有直线。',
      en: 'Generous curves and layered cream-greens let the chosen item become a deep moss pill, with hardly a straight edge anywhere.',
    },
    Demo: OrganicMenu,
  },
];

export default styleVariants;
