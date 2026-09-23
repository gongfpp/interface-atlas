import type { DemoComponent } from '@/islands/DemoStage';
import { useRef, useState } from 'react';

const NAV = ['产品', '解决方案', '文档', '定价', '关于'];
const NAV_EN = ['Product', 'Solutions', 'Docs', 'Pricing', 'About'];

type Stop = 'skip' | 'nav' | 'main';

const SkipLinkDemo: DemoComponent = ({ mode, locale = 'zh' }) => {
  const en = locale === 'en';
  const nav = en ? NAV_EN : NAV;
  const [stop, setStop] = useState<Stop | null>(null);
  const [navIndex, setNavIndex] = useState(-1);
  const [skipped, setSkipped] = useState(false);
  const mainRef = useRef<HTMLDivElement | null>(null);

  const advance = () => {
    if (stop === null) {
      setStop('skip');
      setNavIndex(-1);
      return;
    }
    if (stop === 'skip') {
      setStop('nav');
      setNavIndex(0);
      return;
    }
    if (stop === 'nav') {
      if (navIndex < nav.length - 1) setNavIndex(navIndex + 1);
      else {
        setStop('main');
        setNavIndex(-1);
      }
    }
  };

  const reset = () => {
    setStop(null);
    setNavIndex(-1);
    setSkipped(false);
  };

  const jump = () => {
    setStop('main');
    setNavIndex(-1);
    setSkipped(true);
    mainRef.current?.focus();
  };

  const where =
    stop === 'skip'
      ? en
        ? 'Skip link (tab stop 1)'
        : '跳过链接（第 1 个 Tab 站点）'
      : stop === 'nav'
        ? `${en ? 'Nav link' : '导航链接'} ${navIndex + 1}/${nav.length}`
        : stop === 'main'
          ? en
            ? 'Main content'
            : '主内容区'
          : en
            ? 'Nothing focused yet'
            : '尚未聚焦';

  if (mode === 'variants') {
    const styles: Array<[string, string]> = [
      [en ? 'Corner chip' : '左上角芯片', 'rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-paper'],
      [en ? 'Full-width bar' : '全宽横条', 'block w-full bg-accent py-2 text-center text-xs font-medium text-paper'],
      [en ? 'Weak inline (bad)' : '弱行内（反例）', 'text-[10px] text-ink-3 underline decoration-dotted'],
    ];
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
        {styles.map(([label, cls]) => (
          <div key={label} className="rounded-xl border border-line bg-raised p-3">
            <p className="mb-2 text-[10px] uppercase tracking-wider text-ink-3">{label}</p>
            <span className={cls}>{en ? 'Skip to main content' : '跳到主内容'}</span>
          </div>
        ))}
        <p className="text-[11px] leading-relaxed text-ink-3">
          {en
            ? 'The weak inline style is nearly invisible when focused — contrast and size matter.'
            : '弱行内样式聚焦时几乎看不见——尺寸与对比度同样要达标。'}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={advance}
          className="rounded-lg border border-line bg-raised px-3 py-1.5 text-xs text-ink transition-colors hover:border-accent hover:text-accent"
        >
          {en ? 'Press Tab ▸' : '模拟按 Tab ▸'}
        </button>
        <button
          onClick={reset}
          className="rounded-lg border border-line bg-raised px-3 py-1.5 text-xs text-ink-2 transition-colors hover:border-accent hover:text-accent"
        >
          {en ? 'Reset' : '重置'}
        </button>
        <span className="ml-auto text-[10px] text-ink-3">{where}</span>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-line bg-paper">
        <button
          data-anatomy="1"
          onClick={jump}
          tabIndex={-1}
          className={`absolute left-2 top-2 z-10 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-paper transition-all ${
            stop === 'skip' ? 'opacity-100' : 'pointer-events-none -translate-y-4 opacity-0'
          }`}
        >
          {en ? 'Skip to main content' : '跳到主内容'}
        </button>

        <div data-anatomy="2" className="flex flex-wrap gap-1 border-b border-line bg-raised px-3 py-2.5">
          <span className="mr-1 self-center text-[10px] font-semibold text-ink-3">ATLAS</span>
          {nav.map((item, i) => (
            <span
              key={item}
              className={`rounded px-1.5 py-1 text-[11px] ${
                stop === 'nav' && navIndex === i
                  ? 'bg-code-bg text-ink shadow-[0_0_0_2px_var(--color-accent)]'
                  : 'text-ink-2'
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <div
          ref={mainRef}
          tabIndex={-1}
          className={`px-3 py-4 ${stop === 'main' ? 'shadow-[inset_0_0_0_2px_var(--color-accent)]' : ''}`}
        >
          <p className="text-xs font-medium text-ink">{en ? 'Main content' : '主内容区'}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-ink-2">
            {skipped
              ? en
                ? `Jumped past ${nav.length} nav links in one keystroke.`
                : `一次按键跳过了 ${nav.length} 个导航链接。`
              : en
                ? 'A skip link lives here, hidden until you focus it.'
                : '这里藏着跳过链接，聚焦后才会现身。'}
          </p>
        </div>
      </div>

      <p className="text-[11px] leading-relaxed text-ink-3">
        {en
          ? 'Walk the stops with the Tab button. On the skip link, press it again or click to jump.'
          : '用「模拟按 Tab」走一遍焦点站点。焦点落在跳过链接上时，再点一次或直接点击它即可跳过导航。'}
      </p>
    </div>
  );
};

export default SkipLinkDemo;
