import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function Skeuo({ session }: VariantDemoProps) {
  const [on, setOn] = useSessionState(session, 'on', true);
  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-[#b8bcc4] bg-gradient-to-b from-[#f2f3f5] to-[#d9dce1] p-6 text-[#333] shadow-[inset_0_1px_0_#fff,0_8px_20px_#0000001a]">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#5b6069]">Airplane mode</p>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label="Airplane mode"
        onClick={() => setOn(!on)}
        className={`relative h-10 w-20 rounded-full border border-[#9aa0aa] shadow-[inset_0_2px_5px_#00000055] ${
          on ? 'bg-gradient-to-b from-[#5ec26a] to-[#2f8f3d]' : 'bg-gradient-to-b from-[#c6c9cf] to-[#a7abb3]'
        }`}
      >
        <span
          className={`absolute top-1 h-8 w-8 rounded-full border border-[#8b9099] bg-gradient-to-b from-white to-[#cfd3d9] shadow-[0_2px_4px_#0006,inset_0_1px_0_#fff] transition-all duration-200 ${
            on ? 'left-11' : 'left-1'
          }`}
        >
          <span className="absolute left-1 top-1 h-3 w-2 rounded-full bg-white/70 blur-[2px]" />
        </span>
      </button>
      <p className="mt-4 text-[11px] leading-relaxed text-[#6a707a]">Real bevels, a glossy specular blob on the knob and an inset track — it reads as a physical toggle.</p>
    </div>
  );
}

function Flat({ session }: VariantDemoProps) {
  const [on, setOn] = useSessionState(session, 'on', false);
  return (
    <div className="mx-auto w-full max-w-sm rounded-xl bg-[#f4f5f7] p-6 text-[#111827]">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Notifications</span>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label="Notifications"
          onClick={() => setOn(!on)}
          className={`relative h-7 w-14 rounded-full ${on ? 'bg-[#22c55e]' : 'bg-[#d1d5db]'}`}
        >
          <span
            className="absolute top-1 h-5 w-5 rounded-full bg-white transition-all duration-150"
            style={{ left: on ? '2rem' : '0.25rem' }}
          />
        </button>
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-[#6b7280]">Two flat colour states and a plain circle — no shadow or gradient anywhere, only position and hue.</p>
    </div>
  );
}

function Aurora({ session }: VariantDemoProps) {
  const [on, setOn] = useSessionState(session, 'on', true);
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-[#070b16] p-6 text-white">
      <span
        className={`pointer-events-none absolute -top-10 left-6 h-32 w-48 rounded-full bg-[#22d3ee]/50 blur-3xl transition-opacity duration-500 ${
          on ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <span
        className={`pointer-events-none absolute -bottom-12 right-4 h-32 w-40 rounded-full bg-[#a855f7]/50 blur-3xl transition-opacity duration-500 ${
          on ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">Aurora mode</span>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label="Aurora mode"
          onClick={() => setOn(!on)}
          className={`relative h-8 w-16 rounded-full border transition-colors duration-500 ${
            on ? 'border-white/30 bg-white/10 shadow-[0_0_24px_#22d3ee55]' : 'border-white/15 bg-white/5'
          }`}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full transition-all duration-500 ${
              on ? 'left-9 bg-[#7df9ff] shadow-[0_0_16px_#7df9ff]' : 'left-1 bg-white/40'
            }`}
          />
        </button>
      </div>
      <p className="relative mt-4 text-[11px] leading-relaxed text-white/70">Turning it on blooms two blurred colour fields behind the glass and lights the knob like a small aurora.</p>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'skeuomorphism',
    name: { zh: '拟物化', en: 'Skeuomorphism' },
    note: {
      zh: '内外斜面、金属渐变轨道与旋钮上的高光色块，让它读起来像一枚真实拨杆。',
      en: 'Inner and outer bevels, a metallic gradient track and a glossy knob blob make it feel like a real hardware toggle.',
    },
    Demo: Skeuo,
  },
  {
    style: 'flat-design',
    name: { zh: '扁平化设计', en: 'Flat Design' },
    note: {
      zh: '只有两种纯色状态和一个素圆点，靠位置与色相表达开关，不用任何阴影渐变。',
      en: 'Just two flat colour states and a plain circle — state is told by position and hue, with no shadow or gradient.',
    },
    Demo: Flat,
  },
  {
    style: 'aurora',
    name: { zh: '极光渐变', en: 'Aurora Gradient' },
    note: {
      zh: '开启时两团模糊彩光在暗底玻璃后晕开，旋钮亮成小极光，关闭则光斑隐去。',
      en: 'Switching on blooms two blurred colour fields behind dark glass and lights the knob like a tiny aurora.',
    },
    Demo: Aurora,
  },
];

export default styleVariants;
