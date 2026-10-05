import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function FlatAvatar({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [picked, setPicked] = useSessionState(session, 'selected', 0);
  const people: [string, string][] = [
    ['AF', '#b92626'],
    ['MK', '#205cb2'],
    ['JS', '#705b00'],
  ];
  return (
    <div className="mx-auto w-full max-w-sm bg-raised p-5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">{en ? 'Team' : '团队'}</p>
      <div className="mt-3 flex -space-x-2">
        {people.map(([init, color], i) => (
          <button type="button" aria-label={en ? `View teammate ${i + 1}` : `查看成员 ${i + 1}`} aria-pressed={picked === i} onClick={() => setPicked(i)}
            key={init}
            className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex h-11 w-11 items-center justify-center rounded-full border-2 border-raised text-xs font-bold text-white"
            style={{ background: color, outline: picked === i ? '3px solid #111' : undefined, outlineOffset: 2 }}
          >
            {init}
          </button>
        ))}

      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-ink-2">{en ? 'Solid fills and zero depth; overlap and hue carry identity.' : '纯色平面以叠放和色相区分身份。'}</p>
      <p role="status" className="mt-4 text-xs">{en ? `Selected: ${['Amelia', 'Morgan', 'Jules'][picked]}` : `已选择：${['阿梅莉亚', '摩根', '朱尔斯'][picked]}`}</p>
    </div>
  );
}

function MemphisAvatar({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [picked, setPicked] = useSessionState(session, 'selected', 0);
  const people = ['AF', 'MK', 'JS'];
  const colors = ['#ff3d9a', '#00d2e0', '#ffe23d'];
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden bg-[#fdf3ff] p-5 text-black" style={{ border: '3px solid #000' }}>
      <span className="absolute right-4 top-3 h-4 w-4 rounded-full" style={{ background: '#00d2e0' }} />
      <span className="absolute right-9 top-7 h-2 w-2 rounded-full bg-black" />
      <p className="text-xs font-black uppercase tracking-[0.15em]">{en ? 'Pick a buddy' : '选个伙伴'}</p>
      <div className="mt-4 flex gap-4">
        {people.map((p, i) => (
          <button type="button"
            key={p}
            onClick={() => setPicked(i)} aria-pressed={picked === i} aria-label={en ? `View teammate ${i + 1}` : `查看成员 ${i + 1}`}
            className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex h-14 w-14 items-center justify-center rounded-full text-lg font-black transition-transform"
            style={{
              background: colors[i],

              boxShadow: picked === i ? '2px 2px 0 #000' : '4px 4px 0 #000',
              outline: '3px solid #000',
            }}
          >
            {p}
          </button>
        ))}
      </div>
      <p className="mt-4 text-[11px] font-bold">{en ? 'Candy colours, hard black offsets and confetti dots.' : '糖果色、黑色硬投影和纸屑圆点。'}</p>
      <p role="status" className="mt-4 text-xs">{en ? `Selected: ${['Amelia', 'Morgan', 'Jules'][picked]}` : `已选择：${['阿梅莉亚', '摩根', '朱尔斯'][picked]}`}</p>
    </div>
  );
}

function DecoAvatar({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [picked, setPicked] = useSessionState(session, 'selected', 0);
  return (
    <div className="mx-auto w-full max-w-sm bg-[#10131c] p-6 text-center text-[#f3e6c4]" style={{ border: '1px solid #c8a24a' }}>
      <div className="mx-auto flex w-fit items-center gap-3 text-[#c8a24a]">
        <span className="h-px w-10 bg-[#c8a24a]" />
        <span className="text-[10px] tracking-[0.4em]">{en ? 'MEMBER' : '会员'}</span>
        <span className="h-px w-10 bg-[#c8a24a]" />
      </div>
      <div className="mx-auto mt-5 flex h-20 w-20 rotate-45 items-center justify-center border-2 border-[#c8a24a]">
        <span className="-rotate-45 font-serif text-3xl text-[#f3e6c4]">{['AF', 'MK', 'JS'][picked]}</span>
      </div>
      <p className="mt-6 font-serif text-lg text-[#f3e6c4]">{(en ? ['Amelia', 'Morgan', 'Jules'] : ['阿梅莉亚', '摩根', '朱尔斯'])[picked]}</p>
      <p className="font-serif text-[11px] italic text-[#c8a24a]">{(en ? ['Design lead', 'Engineer', 'Researcher'] : ['设计负责人', '工程师', '研究员'])[picked]}</p>
      <div className="mt-4 flex justify-center gap-2">{['AF', 'MK', 'JS'].map((initial, i) => <button key={i} type="button" aria-pressed={picked === i} aria-label={en ? `View teammate ${i + 1}` : `查看成员 ${i + 1}`} onClick={() => setPicked(i)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none border border-[#c8a24a] px-3 text-xs ${picked === i ? 'bg-[#c8a24a] text-[#10131c]' : 'text-[#f3e6c4]'}`}>{initial}</button>)}</div>
      <p role="status" className="mt-4 text-xs">{en ? `Selected: ${['Amelia', 'Morgan', 'Jules'][picked]}` : `已选择：${['阿梅莉亚', '摩根', '朱尔斯'][picked]}`}</p>
    </div>
  );
}


function AdaptedAvatar({ style, session, locale }: VariantDemoProps & { style: RecipeStyleId }) {
  const en = locale === 'en';
  const r = recipe(style);
  const [selected, setSelected] = useSessionState(session, 'selected', 0);
  const people = en ? ['Amelia', 'Morgan', 'Jules'] : ['阿梅莉亚', '摩根', '朱尔斯'];
  const roles = en ? ['Design lead', 'Engineer', 'Researcher'] : ['设计负责人', '工程师', '研究员'];
  return <RecipeFrame style={style} locale={locale} title={en ? 'Project team' : '项目团队'}>
    <div aria-label={en ? 'Choose a teammate' : '选择团队成员'} className="flex flex-wrap justify-center gap-3">{people.map((person, i) => <button key={i} type="button" aria-label={en ? `View ${person}` : `查看${person}`} aria-pressed={selected === i} onClick={() => setSelected(i)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none flex h-16 w-16 items-center justify-center text-xl ${selected === i ? r.active : r.secondary}`}>{['AF','MK','JS'][i]}</button>)}</div>
    <section role="status" className={`mt-4 p-4 text-center ${r.item}`}><h3 className={r.title}>{people[selected]}</h3><p className={`mt-2 text-sm ${r.muted}`}>{roles[selected]}</p><p className={`mt-3 text-xs ${r.body}`}>{en ? 'Sample profile · available for review' : '示例资料 · 可参与审阅'}</p></section>
  </RecipeFrame>;
}

function localDemo(Demo: StyleVariantSet[number]['Demo']) {
  return function LocalDemo(props: VariantDemoProps) {
    return <><Demo {...props} /><p className="mx-auto mt-4 w-full max-w-md text-xs leading-relaxed text-ink-2">{props.locale === 'en' ? 'Local interaction demo. Nothing is sent or saved outside this page.' : '本地交互演示，不会向外发送或保存数据。'}</p></>;
  };
}

const adaptedNotes = {
  "minimalism": {
    "zh": "白底细边、宽松留白和黑白反转状态，移除多余装饰。头像本体可选择，选中成员的姓名与职责在资料卡中同步更新。",
    "en": "White space, fine borders and monochrome inversion remove unnecessary decoration. Avatar controls select a teammate and update the associated name and role card."
  },
  "neobrutalism": {
    "zh": "黄色底、3px 黑描边、粉色选中块与硬偏移投影，让控件像实体拼贴。头像本体可选择，选中成员的姓名与职责在资料卡中同步更新。",
    "en": "Yellow ground, 3px black outlines, pink selections and hard offset shadows make tactile collage-like controls. Avatar controls select a teammate and update the associated name and role card."
  },
  "organic": {
    "zh": "奶油与苔绿表面配不对称大圆角，选中态以深绿色柔软块面出现。头像本体可选择，选中成员的姓名与职责在资料卡中同步更新。",
    "en": "Cream and moss surfaces use asymmetric rounded contours, with a deep-green soft selected shape. Avatar controls select a teammate and update the associated name and role card."
  },
  "glassmorphism": {
    "zh": "蓝紫底上的半透明描边与磨砂层次，让浅色选中玻璃片从深色控件中浮出。头像本体可选择，选中成员的姓名与职责在资料卡中同步更新。",
    "en": "Frosted layers and translucent borders over blue-purple let a light selected glass pane stand out from dark controls. Avatar controls select a teammate and update the associated name and role card."
  },
  "hand-drawn": {
    "zh": "暖纸底、虚线墨边和不规则圆角配手写感衬线体，选中态像黄色记号。头像本体可选择，选中成员的姓名与职责在资料卡中同步更新。",
    "en": "Warm paper, dashed ink borders, irregular corners and handwritten-style serifs use yellow marker-like selection. Avatar controls select a teammate and update the associated name and role card."
  }
};

const styleVariants: StyleVariantSet = [
  {
    style: 'flat-design',
    name: {"zh":"扁平化设计","en":"Flat Design"},
    note: {
      zh: '纯色圆形叠放成头像组，没有阴影或渐变，只靠色相与白色描边区分个体。',
      en: 'Solid-colour circles stack into an avatar group with no shadow or gradient, using only hue and a white ring to separate members.',
    },
    Demo: localDemo(FlatAvatar),
  },
  {
    style: 'memphis',
    name: {"zh":"孟菲斯风格","en":"Memphis Design"},
    note: {
      zh: '荧光粉蓝黄圆头像配 4px 黑色硬投影与随机圆点，选中时阴影缩短形成按压态。',
      en: 'Neon pink, cyan and yellow circles carry 4px black hard shadows and stray dots, and the chosen one uses a shorter pressed shadow.',
    },
    Demo: localDemo(MemphisAvatar),
  },
  {
    style: 'art-deco',
    name: {"zh":"装饰艺术","en":"Art Deco"},
    note: {
      zh: '深底金色双线轴对称，首字母嵌在旋转 45° 的菱形徽章里，配衬线姓名与斜体头衔。',
      en: 'Dark gold hairlines mirror symmetrically around an initial set in a 45°-rotated lozenge, finished with serif name and italic title.',
    },
    Demo: localDemo(DecoAvatar),
  },
  ...(['minimalism', 'neobrutalism', 'organic', 'glassmorphism', 'hand-drawn'] as const).map(style => recipeVariant(style, (props: VariantDemoProps) => <AdaptedAvatar {...props} style={style} />, adaptedNotes[style])),
];

export default styleVariants;
