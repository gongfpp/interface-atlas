import { useId } from 'react';
import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

const OPTS_EN = ['Day', 'Week', 'Month'];
const OPTS_ZH = ['日', '周', '月'];

function Minimal({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const OPTS = en ? OPTS_EN : OPTS_ZH;
  const [i, setI] = useSessionState(session, 'active', 1);
  return (
    <div className="mx-auto w-full max-w-sm border border-black/10 bg-white p-5 text-black">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">{en ? 'Range' : '范围'}</p>
      <div className="flex border border-black/20">
        {OPTS.map((o, k) => (
          <button type="button"
            key={o}
            aria-pressed={i === k}
            onClick={() => setI(k)}
            className={`focus-visible:outline-2 focus-visible:outline-offset-2 flex-1 border-r border-black/20 py-2 text-xs uppercase tracking-wider last:border-r-0 ${
              i === k ? 'bg-black text-white' : 'text-black/60 hover:bg-black/5'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      <p className="mt-3 font-mono text-[11px] tabular-nums text-black/50">{en ? `${OPTS[i]} · ${[42, 286, 1240][i]} sample sessions` : `${OPTS[i]} · ${[42, 286, 1240][i]} 次示例会话`}</p>
    </div>
  );
}

function Brutal({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const OPTS = en ? OPTS_EN : OPTS_ZH;
  const [i, setI] = useSessionState(session, 'active', 0);
  return (
    <div className="mx-auto w-full max-w-sm border-[3px] border-black bg-[#c6f24e] p-5 text-black">
      <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.2em]">{en ? 'Range' : '范围'}</p>
      <div className="flex gap-2">
        {OPTS.map((o, k) => (
          <button type="button"
            key={o}
            aria-pressed={i === k}
            onClick={() => setI(k)}
            className={`focus-visible:outline-2 focus-visible:outline-offset-2 flex-1 border-[2.5px] border-black px-1 py-2 text-[11px] font-black uppercase shadow-[3px_3px_0_0_#000] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
              i === k ? 'bg-[#ff5d5d]' : 'bg-white'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[11px] font-bold">{en ? `${OPTS[i]} selected` : `已选 ${OPTS[i]}`}</p>
    </div>
  );
}

function Glass({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const OPTS = en ? OPTS_EN : OPTS_ZH;
  const [i, setI] = useSessionState(session, 'active', 1);
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-br from-[#7c5cff] via-[#ff6ec7] to-[#5ad1ff] p-6 text-white">
      <span className="pointer-events-none absolute -right-6 -top-10 h-28 w-28 rounded-full bg-white/40 blur-2xl" />
      <span className="pointer-events-none absolute -bottom-10 -left-4 h-24 w-24 rounded-full bg-white/25 blur-2xl" />
      <p className="relative mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">{en ? 'Range' : '范围'}</p>
      <div className="relative flex rounded-full border border-white/40 bg-white/15 p-1 backdrop-blur-md">
        {OPTS.map((o, k) => (
          <button type="button"
            key={o}
            aria-pressed={i === k}
            onClick={() => setI(k)}
            className={`focus-visible:outline-2 focus-visible:outline-offset-2 flex-1 rounded-full px-2 py-1.5 text-xs font-semibold transition-all ${
              i === k ? 'bg-white/40 shadow-lg shadow-black/20' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      <p className="relative mt-3 text-[11px] text-white/80">{OPTS[i]}</p>
    </div>
  );
}


function Expanded({ session, locale, style }: VariantDemoProps & { style: RecipeStyleId }) {
  const zh = locale === 'zh';
  const r = recipe(style);
  const name = useId();
  const [active, setActive] = useSessionState(session, 'active', 1);
  const options = zh ? OPTS_ZH : OPTS_EN;
  const counts = [42, 286, 1240];
  return <RecipeFrame style={style} locale={locale} title={zh ? '统计范围' : 'Reporting range'}>
    <fieldset><legend className={`mb-3 text-sm ${r.muted}`}>{zh ? '选择时间范围' : 'Choose a time range'}</legend>
      <div className={`grid grid-cols-3 ${style === 'swiss-style' || style === 'minimalism' ? 'gap-px' : 'gap-2'}`}>
        {options.map((option, i) => <label key={option} className={`flex min-h-12 cursor-pointer items-center justify-center gap-1 p-2 text-sm ${active === i ? r.active : r.item}`}>
          <input type="radio" name={name} checked={active === i} onChange={() => setActive(i)} value={i} className="focus-visible:outline-2 focus-visible:outline-offset-2 h-4 w-4 accent-current focus-visible:outline-2 focus-visible:outline-offset-2" />{option}
        </label>)}
      </div>
    </fieldset>
    <p role="status" className={`mt-4 p-3 text-sm ${r.item}`}>{zh ? `${options[active]} · ${counts[active]} 次示例会话` : `${options[active]} · ${counts[active]} sample sessions`}</p>
    <button type="button" onClick={() => setActive(1)} className={`focus-visible:outline-2 focus-visible:outline-offset-2 mt-3 ${r.secondary}`}>{zh ? '恢复周视图' : 'Reset to week'}</button>
  </RecipeFrame>;
}

const styleVariants: StyleVariantSet = [
  {
    style: 'minimalism',
    name: {"zh":"极简主义","en":"Minimalism"},
    note: {
      zh: '去掉圆角与阴影，只用一条发丝外框和黑白反转表达选中，读数随选择同步。',
      en: 'No radius or shadow: a single hairline frame and black/white inversion mark the choice while the readout updates.',
    },
    Demo: Minimal,
  },
  {
    style: 'neobrutalism',
    name: {"zh":"新粗野主义","en":"Neobrutalism"},
    note: {
      zh: '2.5px 黑描边加硬边投影，选中段填亮红，按下时整段向下重力下沉。',
      en: 'A 2.5px black outline with a hard offset shadow; the active segment fills bright red and sinks under gravity on press.',
    },
    Demo: Brutal,
  },
  {
    style: 'glassmorphism',
    name: {"zh":"玻璃拟态","en":"Glassmorphism"},
    note: {
      zh: '胶囊形磨砂容器浮在彩色渐变上，选中项是抬升的半透明白块加投影。',
      en: 'A frosted pill floats over a colour gradient, and the selected segment is a raised translucent white block with a shadow.',
    },
    Demo: Glass,
  },
  recipeVariant('flat-design', (props) => <Expanded {...props} style="flat-design" />, { zh: "纯色块与清晰层级，不依赖阴影；分段表面与结果面板保持统一，原生单选切换会更新示例数据。", en: "Solid blocks and clear hierarchy without shadows; segment surfaces and the result panel stay unified, with native selection updating sample data." }),
  recipeVariant('swiss-style', (props) => <Expanded {...props} style="swiss-style" />, { zh: "编号网格、直角边界与红色强调；分段表面与结果面板保持统一，原生单选切换会更新示例数据。", en: "An indexed grid, square edges and a red accent; segment surfaces and the result panel stay unified, with native selection updating sample data." }),
  recipeVariant('neumorphism', (props) => <Expanded {...props} style="neumorphism" />, { zh: "同色曲面、双向阴影与实体边界；分段表面与结果面板保持统一，原生单选切换会更新示例数据。", en: "Shared soft surfaces, paired shadows and explicit borders; segment surfaces and the result panel stay unified, with native selection updating sample data." }),
  recipeVariant('organic', (props) => <Expanded {...props} style="organic" />, { zh: "大地色与不规则圆角，柔和而清楚；分段表面与结果面板保持统一，原生单选切换会更新示例数据。", en: "Earth tones and irregular corners, soft yet clear; segment surfaces and the result panel stay unified, with native selection updating sample data." }),
  recipeVariant('cyberpunk', (props) => <Expanded {...props} style="cyberpunk" />, { zh: "等宽终端、霓虹边界与高对比选中；分段表面与结果面板保持统一，原生单选切换会更新示例数据。", en: "Monospace terminals, neon edges and vivid selection; segment surfaces and the result panel stay unified, with native selection updating sample data." }),
];

export default styleVariants;
