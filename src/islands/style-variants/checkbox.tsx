import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function Neumorph({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [on, setOn] = useSessionState(session, 'checked', true);
  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl bg-[#e6ebf2] p-6 text-[#5a6473]">
      <p className="mb-4 text-xs font-semibold tracking-wide">{zh ? '偏好设置' : 'Preferences'}</p>
      <button type="button"
        role="checkbox" aria-checked={on} onClick={() => setOn(!on)}
        className={`focus-visible:outline-2 focus-visible:outline-offset-2 flex w-full items-center gap-4 rounded-xl bg-[#e6ebf2] px-4 py-3 text-left transition-all duration-200 ${
          on
            ? 'shadow-[6px_6px_12px_#c3cad6,-6px_-6px_12px_#ffffff]'
            : 'shadow-[inset_5px_5px_10px_#c3cad6,inset_-5px_-5px_10px_#ffffff]'
        }`}
      >
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-md bg-[#e6ebf2] text-xs font-bold transition-all duration-200 ${
            on
              ? 'text-[#5566ff] shadow-[inset_2px_2px_4px_#c3cad6,inset_-2px_-2px_4px_#ffffff]'
              : 'text-transparent shadow-[3px_3px_6px_#c3cad6,-3px_-3px_6px_#ffffff]'
          }`}
        >
          ✓
        </span>
        <span className="text-sm">{zh ? '给我发送摘要邮件' : 'Email me the digest'}</span>
      </button>
      <p className="mt-4 text-[11px] leading-relaxed text-[#8b93a3]">{zh ? '同色表面的内外阴影随勾选切换；仅在本地演示，不发送邮件。' : 'Shared-surface shadows invert when checked. Local demo only; no email is sent.'}</p>
    </div>
  );
}

function Pixel({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [on, setOn] = useSessionState(session, 'checked', false);
  return (
    <div className="mx-auto w-full max-w-sm bg-[#1a1c2c] p-5 font-mono text-[#f4f4f4]">
      <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#94b0c2]">{zh ? '选项' : 'Options'}</p>
      <button type="button" role="checkbox" aria-checked={on} onClick={() => setOn(!on)} className="focus-visible:outline-2 focus-visible:outline-offset-2 flex w-full items-center gap-3 border-4 border-[#94b0c2] bg-[#333c57] p-3 text-left">
        <span
          className={`flex h-6 w-6 items-center justify-center border-4 text-[10px] font-bold ${
            on ? 'border-[#41a6f6] bg-[#41a6f6] text-[#1a1c2c]' : 'border-[#94b0c2] bg-[#1a1c2c] text-transparent'
          }`}
        >
          X
        </span>
        <span className="text-xs">{on ? (zh ? '音乐 开' : 'MUSIC ON') : zh ? '音乐 关' : 'MUSIC OFF'}</span>
      </button>
      <p className="mt-4 text-[11px] leading-relaxed text-[#94b0c2]">{zh ? '方角粗边在两个像素状态间切换，仅在本地演示。' : 'Chunky square edges snap between pixel states. Local demo only.'}</p>
    </div>
  );
}

function Neobrutal({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const [on, setOn] = useSessionState(session, 'checked', true);
  return (
    <div className="mx-auto w-full max-w-sm border-[3px] border-black bg-[#ffe066] p-5 text-black">
      <button type="button"
        role="checkbox" aria-checked={on} onClick={() => setOn(!on)}
        className={`focus-visible:outline-2 focus-visible:outline-offset-2 flex w-full items-center gap-3 border-[3px] border-black px-3 py-3 text-left transition-all duration-100 ${
          on ? 'bg-white shadow-none' : 'bg-[#ff8fab] shadow-[4px_4px_0_0_#000]'
        }`}
      >
        <span
          className={`flex h-7 w-7 items-center justify-center border-[3px] border-black text-sm font-black ${
            on ? 'bg-black text-white' : 'bg-white text-transparent'
          }`}
        >
          ✓
        </span>
        <span className="text-xs font-black uppercase tracking-wider">{zh ? '我接受条款' : 'I accept the terms'}</span>
      </button>
      <p className="mt-4 text-[11px] font-medium leading-relaxed">{zh ? '勾选后硬投影压下；这是本地演示，不代表接受任何真实条款。' : 'Checking presses down the hard shadow. Local demo only; no real terms are accepted.'}</p>
    </div>
  );
}


/** 原生复选框保留空格键和标签点击，样式同时落到选项与方框。 */
function Expanded({ session, locale, style }: VariantDemoProps & { style: RecipeStyleId }) {
  const zh = locale === 'zh';
  const r = recipe(style);
  const [checked, setChecked] = useSessionState(session, 'checked', true);
  return <RecipeFrame style={style} locale={locale} title={zh ? '偏好设置' : 'Preferences'}>
    <label className={`flex min-h-14 cursor-pointer items-center gap-3 p-3 ${checked ? r.active : r.item}`}>
      <input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} className="focus-visible:outline-2 focus-visible:outline-offset-2 h-5 w-5 shrink-0 accent-current focus-visible:outline-2 focus-visible:outline-offset-2" />
      <span>{zh ? '给我发送摘要邮件' : 'Email me the digest'}</span>
    </label>
    <p role="status" className={`mt-3 text-sm ${r.muted}`}>{checked ? (zh ? '已勾选演示选项' : 'Demo option checked') : (zh ? '未勾选' : 'Unchecked')}</p>
    <button type="button" onClick={() => setChecked(false)} className={`focus-visible:outline-2 focus-visible:outline-offset-2 mt-3 ${r.secondary}`}>{zh ? '清除选择' : 'Clear choice'}</button>
  </RecipeFrame>;
}

const styleVariants: StyleVariantSet = [
  {
    style: 'neumorphism',
    name: {"zh":"新拟态","en":"Neumorphism"},
    note: {
      zh: '整行从同色黏土面挤出，勾选时内外双阴影反向，凹陷感和浮起感互换。',
      en: 'The row is extruded from a same-colour clay surface; checking flips the dual shadows so raised becomes sunken.',
    },
    Demo: Neumorph,
  },
  {
    style: 'pixel-art',
    name: {"zh":"像素风","en":"Pixel Art UI"},
    note: {
      zh: '4px 方角粗边配合寥寥几色的调色板，勾选框在两帧像素状态间硬切换。',
      en: 'Chunky 4px square borders and a tiny palette; the box snaps between two pixel states without easing.',
    },
    Demo: Pixel,
  },
  {
    style: 'neobrutalism',
    name: {"zh":"新粗野主义","en":"Neobrutalism"},
    note: {
      zh: '3px 黑描边加硬边投影，勾选后投影消失、方块反转为黑，反馈被直接放大。',
      en: 'A 3px outline with a hard offset shadow; ticking removes the shadow and inverts the box to black.',
    },
    Demo: Neobrutal,
  },
  recipeVariant('minimalism', (props) => <Expanded {...props} style="minimalism" />, { zh: "发丝线、黑白反转与留白；复选项与方框同步选中；保留原生空格键与可清除状态。", en: "Hairlines, monochrome inversion and whitespace; selection styles the checkbox row while native Space toggling and clear remain available." }),
  recipeVariant('flat-design', (props) => <Expanded {...props} style="flat-design" />, { zh: "纯色块与清晰层级，不依赖阴影；复选项与方框同步选中；保留原生空格键与可清除状态。", en: "Solid blocks and clear hierarchy without shadows; selection styles the checkbox row while native Space toggling and clear remain available." }),
  recipeVariant('swiss-style', (props) => <Expanded {...props} style="swiss-style" />, { zh: "编号网格、直角边界与红色强调；复选项与方框同步选中；保留原生空格键与可清除状态。", en: "An indexed grid, square edges and a red accent; selection styles the checkbox row while native Space toggling and clear remain available." }),
  recipeVariant('organic', (props) => <Expanded {...props} style="organic" />, { zh: "大地色与不规则圆角，柔和而清楚；复选项与方框同步选中；保留原生空格键与可清除状态。", en: "Earth tones and irregular corners, soft yet clear; selection styles the checkbox row while native Space toggling and clear remain available." }),
  recipeVariant('glassmorphism', (props) => <Expanded {...props} style="glassmorphism" />, { zh: "深色背景上的磨砂透明层与高亮边缘；复选项与方框同步选中；保留原生空格键与可清除状态。", en: "Frosted layers and highlighted edges over a deep backdrop; selection styles the checkbox row while native Space toggling and clear remain available." }),
];

export default styleVariants;
