import { useId } from 'react';
import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

const TREE = [
  { label: 'src', children: ['app.tsx', 'styles.css'] },
  { label: 'public', children: ['logo.svg', 'favicon.ico'] },
];
const ROMAN = ['I', 'II', 'III'];
const toggleIn = (list: string[], k: string) => (list.includes(k) ? list.filter((x) => x !== k) : [...list, k]);

function BrutalistTree({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [expanded, setExpanded] = useSessionState(session, 'expanded', ['src']);
  const [selected, setSelected] = useSessionState(session, 'selectedFile', 'app.tsx');
  const treeId = useId();
  return (
    <div className="mx-auto w-full max-w-sm border-4 border-black bg-white font-mono text-black">
      <p className="border-b-4 border-black bg-black px-4 py-2 text-sm font-black uppercase tracking-widest text-white">{en ? 'Files' : '文件'}</p>
      <ul>
        {TREE.map((node, i) => {
          const on = expanded.includes(node.label);
          return (
            <li key={node.label} className="border-b-2 border-black last:border-b-0">
              <button type="button" aria-expanded={on} aria-controls={`${treeId}-group-${i}`} onClick={() => setExpanded((o) => toggleIn(o, node.label))} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex w-full items-center gap-2 px-4 py-3 text-left text-lg font-black uppercase hover:bg-[#ff2d2d] hover:text-white">
                <span className="w-4">{on ? '−' : '+'}</span>
                {node.label}
              </button>
              <ul hidden={!on} id={`${treeId}-group-${i}`} className="bg-[#f0f0f0]">
                  {node.children.map((c) => (
                    <li key={c} className="border-t-2 border-black text-base font-bold lowercase"><button type="button" aria-pressed={selected === c} onClick={() => setSelected(c)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none w-full py-2 pl-10 pr-4 text-left ${selected === c ? 'bg-black text-white' : 'text-black'}`}>{c}</button></li>
                  ))}
                </ul>
            </li>
          );
        })}
      </ul>
      <p role="status" className="p-3 text-xs">{en ? `Selected file: ${selected}` : `已选择文件：${selected}`}</p>
    </div>
  );
}

function EditorialTree({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [expanded, setExpanded] = useSessionState(session, 'expanded', ['src']);
  const [selected, setSelected] = useSessionState(session, 'selectedFile', 'app.tsx');
  const treeId = useId();
  return (
    <div className="mx-auto w-full max-w-sm bg-paper px-5 py-6 font-serif text-ink">
      <p className="text-center text-[10px] uppercase tracking-[0.4em] text-ink-3">{en ? 'Contents' : '目录'}</p>
      <ul className="mt-4">
        {TREE.map((node, i) => {
          const on = expanded.includes(node.label);
          return (
            <li key={node.label} className="border-t border-line last:border-b">
              <button type="button" aria-expanded={on} aria-controls={`${treeId}-group-${i}`} onClick={() => setExpanded((o) => toggleIn(o, node.label))} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex w-full items-baseline justify-between py-3 text-left">
                <span className="text-lg italic">{ROMAN[i]}. {node.label}</span>
                <span className="text-xs">{on ? '—' : '+'}</span>
              </button>
              <ul hidden={!on} id={`${treeId}-group-${i}`} className="pb-3 pl-6">
                  {node.children.map((c) => (
                    <li key={c} className="flex items-baseline justify-between py-1 text-sm text-ink-2">
                      <button type="button" aria-pressed={selected === c} onClick={() => setSelected(c)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex-1 text-left ${selected === c ? 'font-bold underline decoration-accent' : ''}`}>{c}</button>
                      <span className="font-mono text-[10px] text-ink-3">{String(c.length).padStart(2, '0')}</span>
                    </li>
                  ))}
                </ul>
            </li>
          );
        })}
      </ul>
      <p role="status" className="p-3 text-xs">{en ? `Selected file: ${selected}` : `已选择文件：${selected}`}</p>
    </div>
  );
}

function NeumorphicTree({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [expanded, setExpanded] = useSessionState(session, 'expanded', ['src']);
  const [selected, setSelected] = useSessionState(session, 'selectedFile', 'app.tsx');
  const treeId = useId();
  const raised = 'shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.9)]';
  const inset = 'shadow-[inset_4px_4px_8px_rgba(163,177,198,0.55),inset_-4px_-4px_8px_rgba(255,255,255,0.9)]';
  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl bg-[#e6e9f0] p-6 text-[#4a5568]">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#8a97ad]">{en ? 'Explorer' : '资源管理器'}</p>
      <ul className="mt-4 space-y-3">
        {TREE.map((node, i) => {
          const on = expanded.includes(node.label);
          return (
            <li key={node.label}>
              <button type="button" aria-expanded={on} aria-controls={`${treeId}-group-${i}`} onClick={() => setExpanded((o) => toggleIn(o, node.label))} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex w-full items-center justify-between rounded-2xl bg-[#e6e9f0] px-4 py-3 text-left text-sm font-semibold ${on ? inset : raised}`}>
                {node.label}
                <span>{on ? '▾' : '▸'}</span>
              </button>
              <ul hidden={!on} id={`${treeId}-group-${i}`} className="mt-3 space-y-2 pl-4">
                  {node.children.map((c) => (
                    <li key={c}><button type="button" aria-pressed={selected === c} onClick={() => setSelected(c)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none w-full rounded-xl border border-[#738496] bg-[#e6e9f0] px-4 py-2 text-left text-[13px] text-[#4a5568] ${selected === c ? inset : raised}`}>{c}</button></li>
                  ))}
                </ul>
            </li>
          );
        })}
      </ul>
      <p role="status" className="p-3 text-xs">{en ? `Selected file: ${selected}` : `已选择文件：${selected}`}</p>
    </div>
  );
}


function AdaptedTree({ style, session, locale }: VariantDemoProps & { style: RecipeStyleId }) {
  const en = locale === 'en';
  const r = recipe(style);
  const id = useId();
  const [expanded, setExpanded] = useSessionState(session, 'expanded', ['src']);
  const [selected, setSelected] = useSessionState(session, 'selectedFile', 'app.tsx');
  return <RecipeFrame style={style} locale={locale} title={en ? 'File explorer' : '文件管理器'}>
    <ul aria-label={en ? 'Folders and files' : '文件夹和文件'} className="space-y-3">{TREE.map((node, i) => <li key={node.label} className={r.item}><button type="button" aria-expanded={expanded.includes(node.label)} aria-controls={`${id}-folder-${i}`} onClick={() => setExpanded(list => toggleIn(list, node.label))} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex w-full items-center gap-3 p-3 text-left text-sm ${r.secondary}`}><span aria-hidden="true">{expanded.includes(node.label) ? '▾' : '▸'}</span><span className="font-mono">{node.label}</span><span className={`ml-auto text-xs ${r.muted}`}>{en ? 'folder' : '文件夹'}</span></button>
      <ul id={`${id}-folder-${i}`} hidden={!expanded.includes(node.label)} className="space-y-1 p-2 pl-6">{node.children.map(file => <li key={file}><button type="button" aria-pressed={selected === file} onClick={() => setSelected(file)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none w-full px-3 py-2 text-left font-mono text-xs ${selected === file ? r.active : r.control}`}>{file}</button></li>)}</ul>
    </li>)}</ul><p role="status" className={`mt-3 p-3 text-xs ${r.body}`}>{en ? `Selected file: ${selected}` : `已选择文件：${selected}`}</p>
  </RecipeFrame>;
}

function localDemo(Demo: StyleVariantSet[number]['Demo']) {
  return function LocalDemo(props: VariantDemoProps) {
    return <><Demo {...props} /><p className="mx-auto mt-4 w-full max-w-md text-xs leading-relaxed text-ink-2">{props.locale === 'en' ? 'Local interaction demo. Nothing is sent or saved outside this page.' : '本地交互演示，不会向外发送或保存数据。'}</p></>;
  };
}

const adaptedNotes = {
  "minimalism": {
    "zh": "白底细边、宽松留白和黑白反转状态，移除多余装饰。文件夹控制嵌套文件列表，选择文件后保留高亮与当前文件说明。",
    "en": "White space, fine borders and monochrome inversion remove unnecessary decoration. Folder controls reveal nested file lists; selecting a file preserves its highlight and current-file status."
  },
  "flat-design": {
    "zh": "蓝色实心面、简洁圆角与无投影的层级，让选中项清晰可辨。文件夹控制嵌套文件列表，选择文件后保留高亮与当前文件说明。",
    "en": "Solid blue surfaces, simple corners and shadow-free hierarchy make selection explicit. Folder controls reveal nested file lists; selecting a file preserves its highlight and current-file status."
  },
  "swiss-style": {
    "zh": "编号书眉和严格对齐的网格配黑色规则线，红色侧轨标记选中状态。文件夹控制嵌套文件列表，选择文件后保留高亮与当前文件说明。",
    "en": "A numbered masthead and aligned grid use black rules, with red rails marking selection. Folder controls reveal nested file lists; selecting a file preserves its highlight and current-file status."
  },
  "neobrutalism": {
    "zh": "黄色底、3px 黑描边、粉色选中块与硬偏移投影，让控件像实体拼贴。文件夹控制嵌套文件列表，选择文件后保留高亮与当前文件说明。",
    "en": "Yellow ground, 3px black outlines, pink selections and hard offset shadows make tactile collage-like controls. Folder controls reveal nested file lists; selecting a file preserves its highlight and current-file status."
  },
  "art-deco": {
    "zh": "深炭底上用对称金色双线、菱形书眉和大字距衬线标题构成秩序。文件夹控制嵌套文件列表，选择文件后保留高亮与当前文件说明。",
    "en": "Symmetric gold double rules, a diamond masthead and tracked serif titles structure a charcoal surface. Folder controls reveal nested file lists; selecting a file preserves its highlight and current-file status."
  }
};

const styleVariants: StyleVariantSet = [
  {
    style: 'brutalism',
    name: {"zh":"粗野主义","en":"Brutalism"},
    note: {
      zh: '超大字重等宽目录树，4px 黑边与整行反白悬停，结构粗暴直接。',
      en: 'An oversized monospace directory tree with 4px black borders and full-row inverted hover — structure stated bluntly.',
    },
    Demo: localDemo(BrutalistTree),
  },
  {
    style: 'editorial',
    name: {"zh":"杂志编辑风","en":"Editorial"},
    note: {
      zh: '像杂志目录页，衬线斜体标题配罗马数字与细横线，子项右侧标字符数。',
      en: 'A magazine table of contents: serif italic headings with roman numerals and fine rules, child items counter-numbered on the right.',
    },
    Demo: localDemo(EditorialTree),
  },
  {
    style: 'neumorphism',
    name: {"zh":"新拟态","en":"Neumorphism"},
    note: {
      zh: '同色浅灰底上用双向阴影挤出或按入节点，展开的节点呈现为凹陷状态。',
      en: 'On a same-colour pale ground, dual shadows extrude or press nodes; an expanded node reads as a soft inset well.',
    },
    Demo: localDemo(NeumorphicTree),
  },
  ...(['minimalism', 'flat-design', 'swiss-style', 'neobrutalism', 'art-deco'] as const).map(style => recipeVariant(style, (props: VariantDemoProps) => <AdaptedTree {...props} style={style} />, adaptedNotes[style])),
];

export default styleVariants;
