import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import { useId, useState } from 'react';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function useRating(session: VariantDemoProps['session']) {
  const [rating, setRating] = useSessionState(session, 'value', 0);
  const [hover, setHover] = useState(0);
  return { rating, hover, setRating, setHover };
}

function Retro({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const { rating, hover, setRating, setHover } = useRating(session);
  const active = hover || rating;
  return (
    <div
      className="mx-auto w-full max-w-sm rounded-xl bg-gradient-to-b from-[#2a1a2e] to-[#120a1a] p-6 text-center text-[#ffd166]"
      style={{ border: '1px solid #ff8a3d55', boxShadow: 'inset 0 0 24px #ff8a3d22' }}
      onMouseLeave={() => setHover(0)}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ff8a3d]">{zh ? '为信号评分' : 'Rate the signal'}</p>
      <div className="my-4 flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button type="button"
            key={n}
            aria-label={zh ? `${n} 分` : `${n} stars`}
            aria-pressed={rating === n}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            onMouseEnter={() => setHover(n)}
            onClick={() => setRating(n)}
            className={`focus-visible:outline-2 focus-visible:outline-offset-2 text-3xl transition-all ${n <= active ? 'text-[#ffd166]' : 'text-[#ffd16633]'}`}
            style={{ textShadow: n <= active ? '0 0 10px #ff8a3d, 2px 2px 0 #b3400a' : undefined }}
          >
            ★
          </button>
        ))}
      </div>
      <p className="font-mono text-[11px] text-[#ffd166]">{rating ? (zh ? `等级 ${rating}/5` : `LEVEL ${rating}/5`) : zh ? '等待输入' : 'awaiting input'}</p>
      <button type="button" onClick={() => { setRating(0); setHover(0); }} className="mt-3 min-h-11 border border-current px-3 text-xs text-inherit focus-visible:outline-2 focus-visible:outline-offset-2">{zh ? '清除评分' : 'Clear rating'}</button>
      <p className="mt-2 text-xs text-inherit">{zh ? '本地交互演示，不发布评分。' : 'Local interaction demo. Rating is not published.'}</p>
    </div>
  );
}

function Y2K({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const { rating, hover, setRating, setHover } = useRating(session);
  const active = hover || rating;
  return (
    <div className="mx-auto w-full max-w-sm rounded-[28px] bg-gradient-to-br from-[#dff3ff] via-[#f6e6ff] to-[#ffe3f5] p-6 text-center text-[#674388]" onMouseLeave={() => setHover(0)}>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a4fa0]">rate_me.exe</p>
      <div className="my-4 flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button type="button"
            key={n}
            aria-label={zh ? `${n} 分` : `${n} stars`}
            aria-pressed={rating === n}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            onMouseEnter={() => setHover(n)}
            onClick={() => setRating(n)}
            className={`focus-visible:outline-2 focus-visible:outline-offset-2 flex h-9 w-9 items-center justify-center rounded-full border text-lg font-bold transition-transform hover:scale-110 ${
              n <= active
                ? 'border-white bg-gradient-to-b from-white via-[#b9f0ff] to-[#7fd2ff] text-[#0b5c8a] shadow-[inset_0_4px_6px_#fff,0_3px_6px_#7fd2ff88]'
                : 'border-white/70 bg-white/40 text-[#a9c4d6]'
            }`}
          >
            ★
          </button>
        ))}
      </div>
      <p className="font-mono text-[11px] text-[#7a4fa0]">{rating ? `>> ${rating}/5` : zh ? '点击气泡' : 'click a bubble'}</p>
      <button type="button" onClick={() => { setRating(0); setHover(0); }} className="mt-3 min-h-11 border border-current px-3 text-xs text-inherit focus-visible:outline-2 focus-visible:outline-offset-2">{zh ? '清除评分' : 'Clear rating'}</button>
      <p className="mt-2 text-xs text-inherit">{zh ? '本地交互演示，不发布评分。' : 'Local interaction demo. Rating is not published.'}</p>
    </div>
  );
}

function Memphis({ session, locale }: VariantDemoProps) {
  const zh = locale === 'zh';
  const { rating, hover, setRating, setHover } = useRating(session);
  const active = hover || rating;
  const colors = ['#ff3d7f', '#ffd23f', '#00b8a9', '#3d5aff', '#ff6b35'];
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border-[3px] border-black bg-[#fef6e4] p-6 text-center text-black" onMouseLeave={() => setHover(0)}>
      <span className="absolute -right-3 -top-3 h-10 w-10 rounded-full bg-[#00b8a9]" />
      <span className="absolute bottom-3 left-4 h-2 w-2 rounded-full bg-[#ff3d7f]" />
      <p className="font-black uppercase tracking-tight text-black">{zh ? '来评分！' : 'Rate it!'}</p>
      <div className="my-4 flex justify-center gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button type="button"
            key={n}
            aria-label={zh ? `${n} 分` : `${n} stars`}
            aria-pressed={rating === n}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            onMouseEnter={() => setHover(n)}
            onClick={() => setRating(n)}
            className="focus-visible:outline-2 focus-visible:outline-offset-2 text-3xl transition-transform hover:rotate-12"
            style={{ color: n <= active ? colors[n - 1] : '#d8cfc0', WebkitTextStroke: '1.5px #000' }}
          >
            ★
          </button>
        ))}
      </div>
      <p className="font-mono text-xs font-bold text-black">{rating ? `${rating} / 5` : zh ? '选一颗星' : 'pick a star'}</p>
      <button type="button" onClick={() => { setRating(0); setHover(0); }} className="mt-3 min-h-11 border border-current px-3 text-xs text-inherit focus-visible:outline-2 focus-visible:outline-offset-2">{zh ? '清除评分' : 'Clear rating'}</button>
      <p className="mt-2 text-xs text-inherit">{zh ? '本地交互演示，不发布评分。' : 'Local interaction demo. Rating is not published.'}</p>
    </div>
  );
}


function Expanded({ session, locale, style }: VariantDemoProps & { style: RecipeStyleId }) {
  const zh = locale === 'zh';
  const r = recipe(style);
  const name = useId();
  const { rating, setRating } = useRating(session);
  return <RecipeFrame style={style} locale={locale} title={zh ? '体验评分' : 'Rate the experience'}>
    <fieldset><legend className={`mb-3 text-sm ${r.muted}`}>{zh ? '从 1 到 5 分选择评分' : 'Choose a rating from 1 to 5'}</legend>
      <div className="grid grid-cols-5 gap-2">{[1, 2, 3, 4, 5].map((score) => <label key={score} className={`flex min-h-16 !min-w-0 cursor-pointer flex-col items-center justify-center gap-1 !p-1 text-lg ${score <= rating ? r.active : r.item}`}>
        <input type="radio" name={name} value={score} checked={rating === score} onChange={() => setRating(score)} aria-label={zh ? `${score} 分` : `${score} stars`} className="focus-visible:outline-2 focus-visible:outline-offset-2 h-4 w-4 accent-current focus-visible:outline-2 focus-visible:outline-offset-2" />
        <span aria-hidden="true">{score <= rating ? '★' : '☆'}</span><span className="text-xs">{score}</span>
      </label>)}</div>
    </fieldset>
    <p role="status" className={`mt-4 text-sm ${r.muted}`}>{rating ? (zh ? `已选 ${rating} / 5 分` : `Selected ${rating} / 5`) : (zh ? '尚未评分' : 'Not rated yet')}</p>
    <button type="button" onClick={() => setRating(0)} className={`focus-visible:outline-2 focus-visible:outline-offset-2 mt-3 ${r.secondary}`}>{zh ? '清除评分' : 'Clear rating'}</button>
  </RecipeFrame>;
}

const styleVariants: StyleVariantSet = [
  {
    style: 'retro-futurism',
    name: {"zh":"复古未来主义","en":"Retro-Futurism"},
    note: {
      zh: '暖色暗底上霓虹描边与硬投影星标发光，像老式仪表盘的读数。',
      en: 'Neon-outlined stars with a hard offset shadow glow on a warm dark base like an old dashboard readout.',
    },
    Demo: Retro,
  },
  {
    style: 'y2k',
    name: {"zh":"Y2K 千禧美学","en":"Y2K Aesthetic"},
    note: {
      zh: '镀铬泡泡按钮带内高光与粉蓝渐变底，选中像被点亮的玻璃球。',
      en: 'Chrome bubble buttons with inner highlights on a pink-blue gradient light up like glossy glass orbs.',
    },
    Demo: Y2K,
  },
  {
    style: 'memphis',
    name: {"zh":"孟菲斯风格","en":"Memphis Design"},
    note: {
      zh: '粗黑描边彩色星形配撞色圆点装饰，选中的颜色从鲜艳噪声里跳出来。',
      en: 'Black-stroked stars in clashing brights with dot confetti; the chosen colour pops out of the playful noise.',
    },
    Demo: Memphis,
  },
  recipeVariant('flat-design', (props) => <Expanded {...props} style="flat-design" />, { zh: "纯色块与清晰层级，不依赖阴影；评分单元使用风格化表面和轮廓，实际单选 1–5 分并可清除。", en: "Solid blocks and clear hierarchy without shadows; rating cells use styled surfaces and outlines with real 1\\u20135 selection and clearing." }),
  recipeVariant('minimalism', (props) => <Expanded {...props} style="minimalism" />, { zh: "发丝线、黑白反转与留白；评分单元使用风格化表面和轮廓，实际单选 1–5 分并可清除。", en: "Hairlines, monochrome inversion and whitespace; rating cells use styled surfaces and outlines with real 1\\u20135 selection and clearing." }),
  recipeVariant('neobrutalism', (props) => <Expanded {...props} style="neobrutalism" />, { zh: "粗黑描边、硬投影与高对比选中；评分单元使用风格化表面和轮廓，实际单选 1–5 分并可清除。", en: "Heavy black outlines, hard shadows and bold selection; rating cells use styled surfaces and outlines with real 1\\u20135 selection and clearing." }),
  recipeVariant('neumorphism', (props) => <Expanded {...props} style="neumorphism" />, { zh: "同色曲面、双向阴影与实体边界；评分单元使用风格化表面和轮廓，实际单选 1–5 分并可清除。", en: "Shared soft surfaces, paired shadows and explicit borders; rating cells use styled surfaces and outlines with real 1\\u20135 selection and clearing." }),
  recipeVariant('organic', (props) => <Expanded {...props} style="organic" />, { zh: "大地色与不规则圆角，柔和而清楚；评分单元使用风格化表面和轮廓，实际单选 1–5 分并可清除。", en: "Earth tones and irregular corners, soft yet clear; rating cells use styled surfaces and outlines with real 1\\u20135 selection and clearing." }),
];

export default styleVariants;
