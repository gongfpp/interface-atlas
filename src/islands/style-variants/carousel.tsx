import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

const editionsEn = [
  { kicker: 'Feature', title: 'The Quiet Grid', deck: 'Whitespace as structure, rules as rhythm.' },
  { kicker: 'Essay', title: 'Type at Scale', deck: 'A display serif carries the hierarchy.' },
  { kicker: 'Profile', title: 'Paper & Ink', deck: 'Masthead, deck, caption — nothing else.' },
];

function Editorial({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [i, setI] = useSessionState(session, 'index', 0);
  const editions = en ? editionsEn : [
    { kicker: '专题', title: '宁静的网格', deck: '留白即结构，规则即节奏。' },
    { kicker: '文章', title: '字体的尺度', deck: '展示衬线体承担信息层级。' },
    { kicker: '专访', title: '纸张与墨水', deck: '刊头、引言与图说，恰到好处。' },
  ];
  const s = editions[i];
  return (
    <div className="mx-auto w-full max-w-sm border border-line bg-raised p-6 font-serif text-ink">
      <div className="flex items-baseline justify-between border-b-2 border-ink pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-2">
        <span>{en ? 'Atlas Review' : 'Atlas 评论'}</span>
        <span>{i + 1} / {editions.length}</span>
      </div>
      <div aria-live="polite" className="mt-5 min-h-28">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">{s.kicker}</p>
        <h3 className="mt-2 text-2xl leading-tight">{s.title}</h3>
        <p className="mt-2 text-sm italic leading-relaxed text-ink-2">{s.deck}</p>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-line pt-3 text-[11px] uppercase tracking-widest">
        <button type="button" onClick={() => setI((i + editions.length - 1) % editions.length)} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none hover:text-accent">{en ? '← Prev' : '← 上一张'}</button>
        <span className="flex gap-1.5">
          {editions.map((_, n) => (
            <button type="button" key={n} aria-pressed={n === i} aria-label={en ? `Slide ${n + 1}` : `第 ${n + 1} 张`} onClick={() => setI(n)} className="flex min-h-11 w-8 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2"><span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${n === i ? 'bg-ink' : 'bg-line-strong'}`} /></button>
          ))}
        </span>
        <button type="button" onClick={() => setI((i + 1) % editions.length)} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none hover:text-accent">{en ? 'Next →' : '下一张 →'}</button>
      </div>
    </div>
  );
}



function Cyberpunk({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const feeds = en ? ['NEON DISTRICT', 'CHROME RAIN', 'DATA DRIFT'] : ['霓虹街区', '铬色雨幕', '数据漂流'];
  const [i, setI] = useSessionState(session, 'index', 0);
  return (
    <div className="mx-auto w-full max-w-sm border border-[#00f0ff]/60 bg-[#08080f] p-5 font-mono text-[#7df9ff] shadow-[0_0_22px_rgba(0,240,255,0.3)]">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-[#ff2bd6]">
        <span>// feed_{i + 1}</span>
        <span>sys.ok</span>
      </div>
      <div aria-live="polite" className="mt-4 border-l-2 border-[#ff2bd6] pl-3">
        <h3 className="text-lg tracking-wide text-[#eaffff]">{feeds[i]}</h3>
        <p className="mt-1 text-[11px] leading-relaxed text-[#7df9ff]/70">{en ? 'night market · chrome rain · data drift' : '夜市 · 铬色雨幕 · 数据漂流'}</p>
      </div>
      <div className="mt-5 flex items-center gap-2 text-xs">
        <button type="button" aria-label={en ? 'Previous slide' : '上一张'} onClick={() => setI((i + feeds.length - 1) % feeds.length)} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none border border-[#00f0ff] px-3 py-1 hover:bg-[#00f0ff] hover:text-[#08080f]">[ &lt; ]</button>
        <button type="button" aria-label={en ? 'Next slide' : '下一张'} onClick={() => setI((i + 1) % feeds.length)} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none border border-[#00f0ff] px-3 py-1 hover:bg-[#00f0ff] hover:text-[#08080f]">[ &gt; ]</button>
        <span className="ml-auto flex gap-1">
          {feeds.map((_, n) => <span key={n} className={`h-3 w-1 ${n === i ? 'bg-[#ff2bd6]' : 'bg-[#00f0ff]/30'}`} />)}
        </span>
      </div>
    </div>
  );
}



function Pixel({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const frames = en ? ['STAGE 1UP', 'STAGE QUEST', 'STAGE SAVE'] : ['关卡：升级', '关卡：任务', '关卡：存档'];
  const [i, setI] = useSessionState(session, 'index', 0);
  return (
    <div className="mx-auto w-full max-w-sm border-4 border-[#41a6f6] bg-[#1a1c2c] p-5 font-mono text-[#f4f4f4]">
      <div className="flex items-center justify-between text-[10px] uppercase text-[#ef7d57]">
        <span>◆ atlas.exe</span>
        <span>{i + 1}/{frames.length}</span>
      </div>
      <div aria-live="polite" className="mt-4 min-h-24 border-4 border-[#566c86] bg-[#333c57] p-4">
        <h3 className="text-base uppercase tracking-widest">{frames[i]}</h3>
        <p className="mt-2 text-[11px] uppercase leading-relaxed text-[#94b0c2]">{en ? 'Use the arrows to change slides' : '使用箭头切换幻灯片'}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button type="button" aria-label={en ? 'Previous slide' : '上一张'} onClick={() => setI((i + frames.length - 1) % frames.length)} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none border-4 border-[#41a6f6] px-3 py-1 text-xs uppercase text-[#41a6f6] hover:bg-[#41a6f6] hover:text-[#1a1c2c]">◀◀</button>
        <span className="flex gap-1">
          {frames.map((_, n) => <span key={n} className={`h-2 w-3 ${n === i ? 'bg-[#ef7d57]' : 'bg-[#566c86]'}`} />)}
        </span>
        <button type="button" aria-label={en ? 'Next slide' : '下一张'} onClick={() => setI((i + 1) % frames.length)} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none border-4 border-[#41a6f6] px-3 py-1 text-xs uppercase text-[#41a6f6] hover:bg-[#41a6f6] hover:text-[#1a1c2c]">▶▶</button>
      </div>
    </div>
  );
}


function AdaptedCarousel({ style, session, locale }: VariantDemoProps & { style: RecipeStyleId }) {
  const en = locale === 'en';
  const r = recipe(style);
  const [index, setIndex] = useSessionState(session, 'index', 0);
  const slides = en ? [['Space', 'Room to think', 'Whitespace gives a composition its rhythm.'], ['Type', 'A voice for every scale', 'Clear hierarchy makes complex stories readable.'], ['Colour', 'One deliberate accent', 'Colour directs attention to what matters.']] : [['空间', '留出思考的空间', '留白为构图赋予节奏。'], ['字体', '让层级清楚发声', '清晰层级让复杂故事易于阅读。'], ['色彩', '一种有意的强调', '色彩将注意力引向重要内容。']];
  return <RecipeFrame style={style} locale={locale} title={en ? 'Design stories' : '设计故事'}>
    <section aria-roledescription={en ? 'carousel' : '轮播'} aria-label={en ? 'Design stories' : '设计故事'}>
      <div role="group" aria-roledescription={en ? 'slide' : '幻灯片'} aria-label={`${index + 1} / 3`} aria-live="polite" className={`min-h-44 p-5 ${r.item}`}>
        <p className={`text-xs uppercase tracking-widest ${r.muted}`}>0{index + 1} / {slides[index][0]}</p><h3 className={`mt-4 text-2xl ${r.title}`}>{slides[index][1]}</h3><p className={`mt-3 text-sm leading-relaxed ${r.body}`}>{slides[index][2]}</p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2"><button type="button" aria-label={en ? 'Previous slide' : '上一张'} onClick={() => setIndex((index + 2) % 3)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none px-3 ${r.control}`}>←</button>
        <div className="flex gap-1">{slides.map((_, i) => <button key={i} type="button" aria-label={en ? `Go to slide ${i + 1}` : `前往第 ${i + 1} 张`} aria-pressed={index === i} onClick={() => setIndex(i)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none min-w-9 px-2 text-xs ${index === i ? r.active : r.secondary}`}>{i + 1}</button>)}</div>
        <button type="button" aria-label={en ? 'Next slide' : '下一张'} onClick={() => setIndex((index + 1) % 3)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none px-3 ${r.control}`}>→</button></div>
    </section>
  </RecipeFrame>;
}

function localDemo(Demo: StyleVariantSet[number]['Demo']) {
  return function LocalDemo(props: VariantDemoProps) {
    return <><Demo {...props} /><p className="mx-auto mt-4 w-full max-w-md text-xs leading-relaxed text-ink-2">{props.locale === 'en' ? 'Local interaction demo. Nothing is sent or saved outside this page.' : '本地交互演示，不会向外发送或保存数据。'}</p></>;
  };
}

const adaptedNotes = {
  "minimalism": {
    "zh": "白底细边、宽松留白和黑白反转状态，移除多余装饰。真实前后翻页与编号定位更新故事内容，末页和首页可循环切换。",
    "en": "White space, fine borders and monochrome inversion remove unnecessary decoration. Previous/next controls and numbered selectors update story content, wrapping between the last and first slide."
  },
  "flat-design": {
    "zh": "蓝色实心面、简洁圆角与无投影的层级，让选中项清晰可辨。真实前后翻页与编号定位更新故事内容，末页和首页可循环切换。",
    "en": "Solid blue surfaces, simple corners and shadow-free hierarchy make selection explicit. Previous/next controls and numbered selectors update story content, wrapping between the last and first slide."
  },
  "swiss-style": {
    "zh": "编号书眉和严格对齐的网格配黑色规则线，红色侧轨标记选中状态。真实前后翻页与编号定位更新故事内容，末页和首页可循环切换。",
    "en": "A numbered masthead and aligned grid use black rules, with red rails marking selection. Previous/next controls and numbered selectors update story content, wrapping between the last and first slide."
  },
  "neobrutalism": {
    "zh": "黄色底、3px 黑描边、粉色选中块与硬偏移投影，让控件像实体拼贴。真实前后翻页与编号定位更新故事内容，末页和首页可循环切换。",
    "en": "Yellow ground, 3px black outlines, pink selections and hard offset shadows make tactile collage-like controls. Previous/next controls and numbered selectors update story content, wrapping between the last and first slide."
  },
  "art-deco": {
    "zh": "深炭底上用对称金色双线、菱形书眉和大字距衬线标题构成秩序。真实前后翻页与编号定位更新故事内容，末页和首页可循环切换。",
    "en": "Symmetric gold double rules, a diamond masthead and tracked serif titles structure a charcoal surface. Previous/next controls and numbered selectors update story content, wrapping between the last and first slide."
  }
};

const styleVariants: StyleVariantSet = [
  {
    style: 'editorial',
    name: {"zh":"杂志编辑风","en":"Editorial"},
    note: {
      zh: '把轮播做成杂志跨页：衬线大标题配上下细线，页码取代圆点，翻页是字距很开的小字。',
      en: 'The carousel becomes a magazine spread — serif display headline, hairline rules, page numbers instead of dots.',
    },
    Demo: localDemo(Editorial),
  },
  {
    style: 'cyberpunk',
    name: {"zh":"赛博朋克","en":"Cyberpunk"},
    note: {
      zh: '近黑底上的霓虹描边与辉光，方括号导航和竖条进度条模拟终端讯号。',
      en: 'Neon outlines and glow on near-black, with bracketed nav and vertical progress bars reading like a terminal feed.',
    },
    Demo: localDemo(Cyberpunk),
  },
  {
    style: 'pixel-art',
    name: {"zh":"像素风","en":"Pixel Art UI"},
    note: {
      zh: '全直角加粗像素边框、等宽大写字母和 NES 调色板，翻页键形如手柄按钮。',
      en: 'Hard pixel corners, chunky borders, monospace caps and an NES palette make the slides feel like a game cartridge screen.',
    },
    Demo: localDemo(Pixel),
  },
  ...(['minimalism', 'flat-design', 'swiss-style', 'neobrutalism', 'art-deco'] as const).map(style => recipeVariant(style, (props: VariantDemoProps) => <AdaptedCarousel {...props} style={style} />, adaptedNotes[style])),
];

export default styleVariants;
