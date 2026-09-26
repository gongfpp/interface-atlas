import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function GlassToast({ session }: VariantDemoProps) {
  const [show, setShow] = useSessionState(session, 'visible', true);
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-[#5b3df5] via-[#ff5fa2] to-[#33d6ff] p-6 text-white">
      <span className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/40 blur-2xl" />
      <button
        onClick={() => setShow((v) => !v)}
        className="relative rounded-lg border border-white/40 bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-md"
      >
        {show ? 'Dismiss' : 'Notify me'}
      </button>
      <div className={`relative mt-4 transition-all duration-300 ${show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
        <div className="flex items-start gap-3 rounded-xl border border-white/50 bg-white/20 p-3 shadow-lg shadow-black/20 backdrop-blur-md">
          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-white" />
          <div>
            <p className="text-xs font-semibold">Export ready</p>
            <p className="text-[11px] text-white/80">Your file finished rendering.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PixelToast({ session }: VariantDemoProps) {
  const [show, setShow] = useSessionState(session, 'visible', true);
  return (
    <div
      className="mx-auto w-full max-w-sm bg-[#1a1c2c] p-5 font-mono text-[#f4f4f4]"
      style={{ boxShadow: '0 0 0 4px #1a1c2c, 0 0 0 8px #41a6f6' }}
    >
      <button
        onClick={() => setShow((v) => !v)}
        className="border-2 border-[#f4f4f4] bg-[#41a6f6] px-3 py-1 text-[11px] uppercase tracking-widest text-[#1a1c2c]"
        style={{ boxShadow: '3px 3px 0 #1a1c2c' }}
      >
        {show ? 'Hide' : 'Show'}
      </button>
      {show && (
        <div
          className="mt-4 flex items-center gap-3 border-4 border-[#f4f4f4] bg-[#29366f] p-3"
          style={{ boxShadow: 'inset -4px -4px 0 #1a1c2c' }}
        >
          <span className="grid h-6 w-6 shrink-0 place-items-center border-2 border-[#f4f4f4] bg-[#ef7d57] text-[10px]">!</span>
          <div>
            <p className="text-[11px] uppercase tracking-wider">Saved</p>
            <p className="text-[10px] text-[#c0cbdc]">Checkpoint #12</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ClayToast({ session }: VariantDemoProps) {
  const [show, setShow] = useSessionState(session, 'visible', true);
  return (
    <div className="mx-auto w-full max-w-sm rounded-[28px] bg-[#f4e9ff] p-6 text-[#5b4a6b]">
      <button
        onClick={() => setShow((v) => !v)}
        className="rounded-2xl bg-[#cdb4f6] px-4 py-2 text-xs font-bold text-white"
        style={{ boxShadow: '0 6px 0 #b394e8, 0 10px 18px #b394e855' }}
      >
        {show ? 'Dismiss' : 'Show toast'}
      </button>
      {show && (
        <div
          className="mt-5 flex items-center gap-3 rounded-3xl bg-white p-4"
          style={{ boxShadow: '0 10px 0 #e3d3f7, 0 16px 26px #c9b4e64d' }}
        >
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#a3e2c8] text-[10px] font-black text-white"
            style={{ boxShadow: 'inset 0 -4px 0 #7fc9aa' }}
          >
            OK
          </span>
          <div>
            <p className="text-sm font-extrabold">Payment received</p>
            <p className="text-[11px] text-[#9480a8]">Receipt sent by email.</p>
          </div>
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
      zh: '提示卡片是一层磨砂玻璃浮在彩色渐变上，消失时轻轻下沉淡出。',
      en: 'The toast is frosted glass over a colourful gradient, sinking and fading as it dismisses.',
    },
    Demo: GlassToast,
  },
  {
    style: 'pixel-art',
    name: { zh: '像素风', en: 'Pixel Art UI' },
    note: {
      zh: '4px 硬边框加内嵌暗边，所有文字等宽大写，像游戏存档提示条。',
      en: 'A 4px hard frame with inset bevel and all-caps monospace text, like a game save prompt.',
    },
    Demo: PixelToast,
  },
  {
    style: 'claymorphism',
    name: { zh: '黏土风', en: 'Claymorphism' },
    note: {
      zh: '粉彩圆角块靠超厚底阴影浮成 3D 黏土，图标做成凹进去的软胶按钮。',
      en: 'Pastel rounded blocks float as 3D clay on thick drop shadows, with an inset squishy icon.',
    },
    Demo: ClayToast,
  },
];

export default styleVariants;
