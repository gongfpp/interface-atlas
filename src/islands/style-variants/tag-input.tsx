import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import { useState, type KeyboardEvent } from 'react';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

interface Tag {
  id: number;
  label: string;
}

let uid = 0;
const make = (label: string): Tag => ({ id: ++uid, label });

/** Enter 提交；输入法组合中（中文/日文候选）不提交，避免误触发。 */
function isSubmit(e: KeyboardEvent<HTMLInputElement>) {
  return e.key === 'Enter' && !e.nativeEvent.isComposing;
}

function Minimal({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [tags, setTags] = useSessionState(session, 'tags', [{ id: -2, label: 'design' }, { id: -1, label: 'systems' }]);
  const [value, setValue] = useSessionState(session, 'tagDraft', '');
  const add = () => {
    const v = value.trim();
    if (v) setTags((prev) => [...prev, make(v)]);
    setValue('');
  };
  return (
    <div className="mx-auto w-full max-w-sm border border-black/15 bg-white p-5 text-black">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">{en ? 'Topics' : '主题'}</p>
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
        {tags.map((t) => (
          <span key={t.id} className="inline-flex items-center gap-1 text-sm">
            <span className="border-b border-black/30">{t.label}</span>
            <button type="button" onClick={() => setTags((prev) => prev.filter((x) => x.id !== t.id))} aria-label={en ? `Remove ${t.label}` : `移除 ${t.label}`} className="focus-visible:outline-2 focus-visible:outline-offset-2 text-black/40 hover:text-black">×</button>
          </span>
        ))}
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (isSubmit(e)) { e.preventDefault(); add(); } }}
        aria-label={en ? 'Add tag' : '添加标签'}
        placeholder={en ? 'Add tag…' : '添加标签…'}
        className="focus-visible:outline-2 focus-visible:outline-offset-2 mt-5 w-full border-b border-black/30 bg-transparent pb-1 text-sm outline-none placeholder:text-black/30 focus:border-black"
      />
    </div>
  );
}

function Memphis({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [tags, setTags] = useSessionState(session, 'tags', [{ id: -2, label: 'pop' }, { id: -1, label: 'wow' }]);
  const [value, setValue] = useSessionState(session, 'tagDraft', '');
  const add = () => {
    const v = value.trim();
    if (v) setTags((prev) => [...prev, make(v)]);
    setValue('');
  };
  const chips = ['-rotate-3 bg-[#ff6bd6]', 'rotate-2 bg-[#61dafb]', '-rotate-2 bg-[#a2f39a]'];
  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border-2 border-black bg-[#fff1a8] p-5 text-black">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">{en ? 'Tags!!' : '标签！！'}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((t, n) => (
          <button type="button" key={t.id} onClick={() => setTags((prev) => prev.filter((x) => x.id !== t.id))} aria-label={en ? `Remove ${t.label}` : `移除 ${t.label}`} className={`focus-visible:outline-2 focus-visible:outline-offset-2 border-2 border-black px-3 py-1 text-xs font-bold ${chips[n % chips.length]}`}>
            {t.label} ×
          </button>
        ))}
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (isSubmit(e)) { e.preventDefault(); add(); } }}
        aria-label={en ? 'Add tag' : '添加标签'}
        placeholder={en ? '+ type a tag' : '+ 输入标签'}
        className="focus-visible:outline-2 focus-visible:outline-offset-2 mt-4 w-full rounded-full border-2 border-black bg-white px-3 py-2 text-sm outline-none placeholder:text-black/40"
      />
    </div>
  );
}

function Brutal({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [tags, setTags] = useSessionState(session, 'tags', [{ id: -2, label: 'RAW' }, { id: -1, label: 'FORM' }]);
  const [value, setValue] = useSessionState(session, 'tagDraft', '');
  const add = () => {
    const v = value.trim();
    if (v) setTags((prev) => [...prev, make(v.toUpperCase())]);
    setValue('');
  };
  return (
    <div className="mx-auto w-full max-w-sm border-4 border-white bg-black p-5 font-mono text-white">
      <p className="text-[10px] uppercase tracking-[0.3em]">{en ? 'Input / tags' : '输入 / 标签'}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <button type="button" key={t.id} onClick={() => setTags((prev) => prev.filter((x) => x.id !== t.id))} aria-label={en ? `Remove ${t.label}` : `移除 ${t.label}`} className="focus-visible:outline-2 focus-visible:outline-offset-2 border-2 border-white px-2 py-1 text-sm uppercase hover:bg-white hover:text-black">
            {t.label} ×
          </button>
        ))}
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (isSubmit(e)) { e.preventDefault(); add(); } }}
        aria-label={en ? 'Add tag' : '添加标签'}
        placeholder={en ? '> ADD…' : '> 添加…'}
        className="focus-visible:outline-2 focus-visible:outline-offset-2 mt-5 w-full border-b-4 border-white bg-transparent pb-2 text-2xl uppercase text-white outline-none placeholder:text-white/40"
      />
      <p className="mt-3 text-[10px] leading-relaxed text-white/50">{en ? 'TYPE + ENTER. NO APOLOGIES.' : '输入 + 回车。无需抱歉。'}</p>
    </div>
  );
}


function Expanded({ session, locale, style }: VariantDemoProps & { style: RecipeStyleId }) {
  const zh = locale === 'zh';
  const r = recipe(style);
  const [tags, setTags] = useSessionState<Tag[]>(session, 'tags', [{ id: -2, label: 'design' }, { id: -1, label: 'systems' }]);
  const [value, setValue] = useSessionState(session, 'tagDraft', '');
  const [message, setMessage] = useState('');
  const add = () => {
    const next = value.trim();
    if (!next) { setMessage(zh ? '请先输入标签。' : 'Enter a tag first.'); return; }
    setTags((current) => [...current, make(next)]); setValue(''); setMessage(zh ? '已添加标签。' : 'Tag added.');
  };
  return <RecipeFrame style={style} locale={locale} title={zh ? '主题标签' : 'Topic tags'}>
    <ul className="flex flex-wrap gap-2">{tags.map((tag) => <li key={tag.id} className={`flex max-w-full items-center gap-1 pl-3 ${r.item}`}>
      <span className="min-w-0 break-all text-sm">{tag.label}</span><button type="button" onClick={() => { setTags((current) => current.filter((item) => item.id !== tag.id)); setMessage(zh ? '已移除标签。' : 'Tag removed.'); }} aria-label={zh ? `移除 ${tag.label}` : `Remove ${tag.label}`} className={`focus-visible:outline-2 focus-visible:outline-offset-2 shrink-0 ${r.secondary}`}>×</button>
    </li>)}</ul>
    <label className="mt-4 block text-sm">{zh ? '新标签' : 'New tag'}
      <input value={value} onChange={(event) => { setValue(event.target.value); setMessage(''); }} onKeyDown={(event) => { if (isSubmit(event)) { event.preventDefault(); add(); } }} placeholder={zh ? '输入后按回车' : 'Type and press Enter'} className={`focus-visible:outline-2 focus-visible:outline-offset-2 mt-2 w-full ${r.field}`} />
    </label>
    <div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={add} className={r.control}>{zh ? '添加' : 'Add'}</button><button type="button" onClick={() => { setTags([]); setValue(''); setMessage(zh ? '已清除全部标签。' : 'All tags cleared.'); }} className={r.secondary}>{zh ? '清除全部' : 'Clear all'}</button></div>
    <p role="status" className={`mt-3 min-h-5 text-sm ${r.muted}`}>{message || (zh ? `已添加 ${tags.length} 个标签` : `${tags.length} tags added`)}</p>
  </RecipeFrame>;
}

const styleVariants: StyleVariantSet = [
  {
    style: 'minimalism',
    name: {"zh":"极简主义","en":"Minimalism"},
    note: {
      zh: '标签只是带下划线的文字，删除是细小的 ×，输入框只有一条会变黑的底线，无胶囊无阴影。',
      en: 'Tags are merely underlined words with a tiny ×, and the field is one baseline rule that darkens on focus — no pills, no shadow.',
    },
    Demo: Minimal,
  },
  {
    style: 'memphis',
    name: {"zh":"孟菲斯风格","en":"Memphis Design"},
    note: {
      zh: '彩色标签像贴纸一样各自倾斜、黑描边、撞色循环，输入框是圆胖的形状，整块糖果底。',
      en: 'Colourful tags tilt like stickers with black outlines and cycling clashes, over a candy ground with a fat rounded field.',
    },
    Demo: Memphis,
  },
  {
    style: 'brutalism',
    name: {"zh":"粗野主义","en":"Brutalism"},
    note: {
      zh: '黑底白字等宽全大写，标签是方括号般的硬边块，输入行 2xl 巨大、下划线 4px，反差拉满。',
      en: 'Black ground, white monospace caps; tags are hard blocks and the 2xl input sits on a 4px rule for maximum harshness.',
    },
    Demo: Brutal,
  },
  recipeVariant('flat-design', (props) => <Expanded {...props} style="flat-design" />, { zh: "纯色块与清晰层级，不依赖阴影；标签、输入区与添加按钮保持一致材质，支持回车、独立重复标签、定向删除和清空。", en: "Solid blocks and clear hierarchy without shadows; tags, fields and add controls share materials with Enter, independent duplicate tags, targeted removal and clear." }),
  recipeVariant('swiss-style', (props) => <Expanded {...props} style="swiss-style" />, { zh: "编号网格、直角边界与红色强调；标签、输入区与添加按钮保持一致材质，支持回车、独立重复标签、定向删除和清空。", en: "An indexed grid, square edges and a red accent; tags, fields and add controls share materials with Enter, independent duplicate tags, targeted removal and clear." }),
  recipeVariant('neobrutalism', (props) => <Expanded {...props} style="neobrutalism" />, { zh: "粗黑描边、硬投影与高对比选中；标签、输入区与添加按钮保持一致材质，支持回车、独立重复标签、定向删除和清空。", en: "Heavy black outlines, hard shadows and bold selection; tags, fields and add controls share materials with Enter, independent duplicate tags, targeted removal and clear." }),
  recipeVariant('neumorphism', (props) => <Expanded {...props} style="neumorphism" />, { zh: "同色曲面、双向阴影与实体边界；标签、输入区与添加按钮保持一致材质，支持回车、独立重复标签、定向删除和清空。", en: "Shared soft surfaces, paired shadows and explicit borders; tags, fields and add controls share materials with Enter, independent duplicate tags, targeted removal and clear." }),
  recipeVariant('organic', (props) => <Expanded {...props} style="organic" />, { zh: "大地色与不规则圆角，柔和而清楚；标签、输入区与添加按钮保持一致材质，支持回车、独立重复标签、定向删除和清空。", en: "Earth tones and irregular corners, soft yet clear; tags, fields and add controls share materials with Enter, independent duplicate tags, targeted removal and clear." }),
];

export default styleVariants;
