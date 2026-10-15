import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';
import { withStyleSamples } from '../shared/styleSamples';

function Skeuo({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [on, setOn] = useSessionState(session, 'on', true);
  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-[#b8bcc4] bg-gradient-to-b from-[#f2f3f5] to-[#d9dce1] p-6 text-[#333] shadow-[inset_0_1px_0_#fff,0_8px_20px_#0000001a]">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#5b6069]">{zh ? '飞行模式' : 'Airplane mode'}</p>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={zh ? '飞行模式' : 'Airplane mode'}
        onClick={() => setOn(!on)}
        className={`focus-visible:outline-2 focus-visible:outline-offset-2 relative h-10 w-20 rounded-full border border-[#9aa0aa] shadow-[inset_0_2px_5px_#00000055] ${
          on ? 'bg-gradient-to-b from-[#5ec26a] to-[#2f8f3d]' : 'bg-gradient-to-b from-[#c6c9cf] to-[#a7abb3]'
        }`}
      >
        <span
          className={`absolute top-1 h-8 w-8 rounded-full border border-[#8b9099] bg-gradient-to-b from-white to-[#cfd3d9] shadow-[0_2px_4px_#0006,inset_0_1px_0_#fff] motion-safe:transition-all motion-safe:duration-200 ${
            on ? 'left-11' : 'left-1'
          }`}
        >
          <span className="absolute left-1 top-1 h-3 w-2 rounded-full bg-white/70 blur-[2px]" />
        </span>
      </button>
      <p className="mt-4 text-[11px] leading-relaxed text-[#6a707a]">{zh ? '真实斜面、旋钮高光与内凹轨道仿真拨杆；仅改变本地演示状态。' : 'Real bevels, a glossy knob and an inset track imitate a physical toggle. Local demo state only.'}</p>
    </div>
  );
}

function Flat({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [on, setOn] = useSessionState(session, 'on', false);
  return (
    <div className="mx-auto w-full max-w-sm rounded-xl bg-[#f4f5f7] p-6 text-[#111827]">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{zh ? '通知' : 'Notifications'}</span>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label={zh ? '通知' : 'Notifications'}
          onClick={() => setOn(!on)}
          className={`focus-visible:outline-2 focus-visible:outline-offset-2 relative h-7 w-14 rounded-full ${on ? 'bg-[#22c55e]' : 'bg-[#d1d5db]'}`}
        >
          <span
            className="absolute top-1 h-5 w-5 rounded-full bg-white motion-safe:transition-all motion-safe:duration-150"
            style={{ left: on ? '2rem' : '0.25rem' }}
          />
        </button>
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-[#6b7280]">{zh ? "两种纯色与圆形滑块以位置表达开关，仅改变本地演示状态。" : "Two flat colour states and a plain circle \u2014 no shadow or gradient anywhere, only position and hue. Local demo state only."}</p>
    </div>
  );
}

function Aurora({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [on, setOn] = useSessionState(session, 'on', true);
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-[#070b16] p-6 text-white">
      <span
        className={`pointer-events-none absolute -top-10 left-6 h-32 w-48 rounded-full bg-[#22d3ee]/50 blur-3xl motion-safe:transition-opacity motion-safe:duration-500 ${
          on ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <span
        className={`pointer-events-none absolute -bottom-12 right-4 h-32 w-40 rounded-full bg-[#a855f7]/50 blur-3xl motion-safe:transition-opacity motion-safe:duration-500 ${
          on ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">{zh ? '极光模式' : 'Aurora mode'}</span>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label={zh ? '极光模式' : 'Aurora mode'}
          onClick={() => setOn(!on)}
          className={`focus-visible:outline-2 focus-visible:outline-offset-2 relative h-8 w-16 rounded-full border motion-safe:transition-colors motion-safe:duration-500 ${
            on ? 'border-white/30 bg-white/10 shadow-[0_0_24px_#22d3ee55]' : 'border-white/15 bg-white/5'
          }`}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full motion-safe:transition-all motion-safe:duration-500 ${
              on ? 'left-9 bg-[#7df9ff] shadow-[0_0_16px_#7df9ff]' : 'left-1 bg-white/40'
            }`}
          />
        </button>
      </div>
      <p className="relative mt-4 text-[11px] leading-relaxed text-white/70">{zh ? "开启后两团彩光与明亮旋钮构成极光，仅改变本地演示状态。" : "Turning it on blooms two blurred colour fields behind the glass and lights the knob like a small aurora. Local demo state only."}</p>
    </div>
  );
}


function Expanded({ session, locale, style }: VariantDemoProps & { style: RecipeStyleId }) {
  const zh = locale === 'zh';
  const r = recipe(style);
  const [on, setOn] = useSessionState(session, 'on', false);
  const square = style === 'minimalism' || style === 'swiss-style' || style === 'neobrutalism';
  return <RecipeFrame style={style} locale={locale} title={zh ? '通知设置预览' : 'Notification setting preview'}>
    <div className={`flex flex-wrap items-center justify-between gap-4 p-4 ${r.item}`}>
      <span className="text-sm font-semibold">{zh ? '通知' : 'Notifications'}</span>
      <button type="button" role="switch" aria-checked={on} aria-label={zh ? '通知' : 'Notifications'} onClick={() => setOn(!on)} className={`focus-visible:outline-2 focus-visible:outline-offset-2 flex min-h-11 w-20 items-center p-1 ${on ? r.active : r.secondary} ${square ? 'rounded-none' : 'rounded-full'}`}>
        <span aria-hidden="true" className={`flex h-8 w-8 shrink-0 items-center justify-center border border-current bg-white text-black ${on ? 'ml-auto' : 'mr-auto'} ${square ? 'rounded-none' : 'rounded-full'}`}>{on ? '✓' : '−'}</span>
      </button>
    </div>
    <p role="status" className={`mt-4 text-sm ${r.muted}`}>{on ? (zh ? '演示开关已开启' : 'Demo switch is on') : (zh ? '演示开关已关闭' : 'Demo switch is off')}</p>
    <button type="button" onClick={() => setOn(false)} className={`focus-visible:outline-2 focus-visible:outline-offset-2 mt-3 ${r.secondary}`}>{zh ? '恢复关闭' : 'Reset to off'}</button>
  </RecipeFrame>;
}

const styleVariants: StyleVariantSet = [
  {
    style: 'skeuomorphism',
    name: {"zh":"拟物化","en":"Skeuomorphism"},
    note: {
      zh: '内外斜面、金属渐变轨道与旋钮上的高光色块，让它读起来像一枚真实拨杆。',
      en: 'Inner and outer bevels, a metallic gradient track and a glossy knob blob make it feel like a real hardware toggle.',
    },
    Demo: Skeuo,
  },
  {
    style: 'flat-design',
    name: {"zh":"扁平化设计","en":"Flat Design"},
    note: {
      zh: '只有两种纯色状态和一个素圆点，靠位置与色相表达开关，不用任何阴影渐变。',
      en: 'Just two flat colour states and a plain circle — state is told by position and hue, with no shadow or gradient.',
    },
    Demo: Flat,
  },
  {
    style: 'aurora',
    name: {"zh":"极光渐变","en":"Aurora Gradient"},
    note: {
      zh: '开启时两团模糊彩光在暗底玻璃后晕开，旋钮亮成小极光，关闭则光斑隐去。',
      en: 'Switching on blooms two blurred colour fields behind dark glass and lights the knob like a tiny aurora.',
    },
    Demo: Aurora,
  },
  recipeVariant('minimalism', (props) => <Expanded {...props} style="minimalism" />, { zh: "发丝线、黑白反转与留白；开关轨道与旋钮采用相应几何和材质，状态可切换并恢复关闭。", en: "Hairlines, monochrome inversion and whitespace; switch track and thumb use matching geometry and materials, with toggling and reset to off." }),
  recipeVariant('swiss-style', (props) => <Expanded {...props} style="swiss-style" />, { zh: "编号网格、直角边界与红色强调；开关轨道与旋钮采用相应几何和材质，状态可切换并恢复关闭。", en: "An indexed grid, square edges and a red accent; switch track and thumb use matching geometry and materials, with toggling and reset to off." }),
  recipeVariant('neobrutalism', (props) => <Expanded {...props} style="neobrutalism" />, { zh: "粗黑描边、硬投影与高对比选中；开关轨道与旋钮采用相应几何和材质，状态可切换并恢复关闭。", en: "Heavy black outlines, hard shadows and bold selection; switch track and thumb use matching geometry and materials, with toggling and reset to off." }),
  recipeVariant('neumorphism', (props) => <Expanded {...props} style="neumorphism" />, { zh: "同色曲面、双向阴影与实体边界；开关轨道与旋钮采用相应几何和材质，状态可切换并恢复关闭。", en: "Shared soft surfaces, paired shadows and explicit borders; switch track and thumb use matching geometry and materials, with toggling and reset to off." }),
  recipeVariant('organic', (props) => <Expanded {...props} style="organic" />, { zh: "大地色与不规则圆角，柔和而清楚；开关轨道与旋钮采用相应几何和材质，状态可切换并恢复关闭。", en: "Earth tones and irregular corners, soft yet clear; switch track and thumb use matching geometry and materials, with toggling and reset to off." }),
  recipeVariant('glassmorphism', (props) => <Expanded {...props} style="glassmorphism" />, { zh: "磨砂玻璃轨道、透亮边缘与柔化暗底表达开关状态；可切换并恢复关闭。", en: "A frosted glass track, bright edge and softened dark ground express the switch state; toggling and reset remain available." }),
  recipeVariant('pixel-art', (props) => <Expanded {...props} style="pixel-art" />, { zh: "方角像素轨道与硬切位置变化呈现游戏菜单开关，不依赖平滑位移动效。", en: "A pixel-square track and snapped thumb position create a game-menu switch without relying on smooth movement." }),
  recipeVariant('art-deco', (props) => <Expanded {...props} style="art-deco" />, { zh: "金色双线铭牌、几何旋钮和衬线标签让开关成为对称装饰构件。", en: "Gold double-rule framing, a geometric thumb and serif label turn the switch into a symmetric decorative element." }),
  recipeVariant('cyberpunk', (props) => <Expanded {...props} style="cyberpunk" />, { zh: "暗色控制台、霓虹轨道和终端字形强化开关状态，仍支持键盘切换。", en: "A dark console, neon track and terminal typography sharpen the switch state while keyboard toggling remains available." }),
];

export default withStyleSamples('switch', styleVariants);
