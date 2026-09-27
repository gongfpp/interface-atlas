import type { StyleVariantSet, VariantDemoProps } from './types';
import { useDisclosure } from './behavior';

function NeumorphDropdown({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const { open, setOpen, toggle } = useDisclosure(session, 'open');
  const items = en ? ['Duplicate', 'Rename', 'Archive'] : ['复制', '重命名', '归档'];
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-3 bg-[#e6e9ef] p-6 text-[#3b4252]">
      <button
        onClick={toggle}
        className="rounded-2xl bg-[#e6e9ef] px-5 py-2.5 text-sm font-semibold shadow-[6px_6px_12px_#c3c8d2,-6px_-6px_12px_#ffffff]"
      >
        {en ? 'Options ▾' : '选项 ▾'}
      </button>
      {open && (
        <div className="w-full rounded-2xl bg-[#e6e9ef] p-2 shadow-[8px_8px_16px_#c3c8d2,-8px_-8px_16px_#ffffff]">
          {items.map((it) => (
            <button
              key={it}
              onClick={() => setOpen(false)}
              className="block w-full rounded-xl px-3 py-2 text-left text-sm transition-shadow hover:shadow-[inset_3px_3px_6px_#c3c8d2,inset_-3px_-3px_6px_#ffffff]"
            >
              {it}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Y2kDropdown({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const { open, setOpen, toggle } = useDisclosure(session, 'open');
  const items = en ? ['My Profile', 'Buddies', 'Sign Out'] : ['个人资料', '好友', '退出登录'];
  return (
    <div className="mx-auto w-full max-w-sm rounded-[1.5rem] bg-gradient-to-b from-[#c8f0ff] to-[#e9d5ff] p-6">
      <button
        onClick={toggle}
        className="rounded-full border border-white/80 bg-gradient-to-b from-white to-[#9fb8d6] px-5 py-2 text-sm font-bold text-[#1b2a44] shadow-[0_4px_10px_#5b6fa055,inset_0_1px_2px_#fff]"
      >
        {en ? 'menu.exe' : '菜单.exe'}
      </button>
      {open && (
        <div className="mt-3 overflow-hidden rounded-2xl border-2 border-white bg-gradient-to-b from-[#dff1ff] to-[#b9d6f5] p-1.5 shadow-[0_8px_20px_#4b6a9940]">
          {items.map((it) => (
            <button key={it} onClick={() => setOpen(false)} className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-[#16324f] hover:bg-white/70">
              {it}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SketchDropdown({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const { open, setOpen, toggle } = useDisclosure(session, 'open');
  const items = en ? ['Rename sketch', 'Duplicate', 'Delete'] : ['重命名草稿', '复制', '删除'];
  return (
    <div className="mx-auto w-full max-w-sm bg-[#fbf7ec] p-6 text-[#2b2b2b]">
      <button
        onClick={toggle}
        className="rotate-[-1deg] rounded-[0.6rem_1.2rem_0.7rem_1rem] border-2 border-dashed border-[#2b2b2b] bg-white/70 px-4 py-2 font-serif text-sm italic"
      >
        {en ? 'Tools ✎' : '工具 ✎'}
      </button>
      {open && (
        <div className="mt-3 rotate-[0.6deg] rounded-[1rem_0.6rem_1.2rem_0.7rem] border-2 border-dashed border-[#2b2b2b] bg-white/80 p-2">
          {items.map((it) => (
            <button key={it} onClick={() => setOpen(false)} className="block w-full px-3 py-1.5 text-left font-serif text-sm hover:bg-[#f0e6c8]">
              {it}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'neumorphism',
    name: { zh: '新拟物', en: 'Neumorphism' },
    note: {
      zh: '触发器与菜单都从同一块灰底“挤”出来，双向柔光阴影取代边框，悬停时菜单项向内凹陷。',
      en: 'Trigger and menu are extruded from the same grey ground with dual soft shadows instead of borders, and hover presses each row inward.',
    },
    Demo: NeumorphDropdown,
  },
  {
    style: 'y2k',
    name: { zh: '千禧年', en: 'Y2K' },
    note: {
      zh: '气泡胶囊外壳套白色厚描边与铬合金垂直渐变，整体像一颗会弹开的金属软糖。',
      en: 'A bubbly capsule with thick white borders and chrome vertical gradients makes the whole control feel like a spring-loaded metal gumdrop.',
    },
    Demo: Y2kDropdown,
  },
  {
    style: 'hand-drawn',
    name: { zh: '手绘', en: 'Hand-Drawn' },
    note: {
      zh: '虚线描边配左右微旋转和不等圆角，佐以衬线斜体，像用铅笔在纸上随手框出来的菜单。',
      en: 'Dashed outlines, tiny opposing rotations and uneven corner radii plus serif italics read like a menu boxed by pencil on paper.',
    },
    Demo: SketchDropdown,
  },
];

export default styleVariants;
