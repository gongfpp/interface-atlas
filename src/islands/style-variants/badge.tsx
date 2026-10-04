import { useSessionState } from './session';
import { recipe, RecipeFrame, recipeVariant, type RecipeStyleId } from '../shared/styleRecipe';
import type { StyleVariantSet, VariantDemoProps } from './types';

function BrutalBadge({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  return (
    <div className="mx-auto flex w-full max-w-sm flex-wrap items-center gap-4 bg-[#e8ff6b] p-6 text-black" style={{ border: '3px solid #000' }}>
      <span className="border-[3px] border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-wide shadow-[4px_4px_0_0_#000]">{en ? 'New' : '新品'}</span>
      <span className="border-[3px] border-black bg-[#ff5d5d] px-3 py-1 text-xs font-black uppercase tracking-wide text-white shadow-[4px_4px_0_0_#000]">{en ? 'Sale' : '促销'}</span>
      <span className="rounded-full border-[3px] border-black bg-black px-3 py-1 text-xs font-black uppercase tracking-wide text-[#e8ff6b]">v2.0</span>
      <BadgeUnread session={session} locale={locale} />
    </div>
  );
}

function EditorialBadge({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  return (
    <div className="mx-auto w-full max-w-sm border-y-2 border-ink bg-raised px-2 py-5">
      <div className="flex items-baseline gap-4">
        <span className="font-serif text-2xl italic text-accent">{en ? 'Exclusive' : '独家'}</span>
        <span className="h-px flex-1 bg-line-strong" />
        <span className="font-serif text-[11px] uppercase tracking-[0.3em] text-ink-2">{en ? 'Issue 04' : '第 04 期'}</span>
      </div>
      <div className="mt-4 flex gap-2">
        <span className="border border-ink px-2 py-0.5 font-serif text-[11px] uppercase tracking-[0.15em]">{en ? 'Design' : '设计'}</span>
        <span className="border border-ink px-2 py-0.5 font-serif text-[11px] uppercase tracking-[0.15em]">{en ? 'Culture' : '文化'}</span>
        <span className="bg-ink px-2 py-0.5 font-serif text-[11px] uppercase tracking-[0.15em] text-paper">{en ? 'Print' : '印刷'}</span>
      </div>
      <BadgeUnread session={session} locale={locale} />
    </div>
  );
}

function GlossBadge({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  return (
    <div
      className="mx-auto w-full max-w-sm rounded-xl bg-gradient-to-b from-[#e9edf2] to-[#c7ced8] p-6"
      style={{ border: '1px solid #9aa4b2' }}
    >
      <div className="flex flex-wrap gap-3">
        <span className="rounded-full border border-[#3f8f3f] bg-gradient-to-b from-[#8fe08f] to-[#3f9f3f] px-3 py-1 text-xs font-bold text-[#0d3d0d] shadow-[inset_0_1px_0_#dfffe0,0_2px_3px_#0004]">
          {en ? 'In stock' : '有货'}
        </span>
        <span className="rounded-full border border-[#b06a12] bg-gradient-to-b from-[#ffd98a] to-[#e69a1f] px-3 py-1 text-xs font-bold text-[#5a3800] shadow-[inset_0_1px_0_#fff6dd,0_2px_3px_#0004]">
          {en ? 'Low' : '库存偏低'}
        </span>
        <span className="rounded-full border border-[#8b1b1b] bg-gradient-to-b from-[#ff9a9a] to-[#d63b3b] px-3 py-1 text-xs font-bold text-white shadow-[inset_0_1px_0_#ffd6d6,0_2px_3px_#0004]">
          {en ? 'Sold out' : '售罄'}
        </span>
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-[#3a4250]">{en ? 'Raised bevels and top highlights mimic enamel pins.' : '凸起斜面与顶部高光模拟搪瓷徽章。'}</p>
      <BadgeUnread session={session} locale={locale} />
    </div>
  );
}


function BadgeUnread({ session, locale }: VariantDemoProps) {
  const en = locale === 'en';
  const [read, setRead] = useSessionState(session, 'badgeRead', false);
  return <div className="mt-4 w-full text-inherit"><span role="status" className="inline-block border border-current px-2 py-1 text-xs">{read ? (en ? 'All read' : '全部已读') : (en ? '3 new' : '3 条新消息')}</span><button type="button" onClick={() => setRead(!read)} className="min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none ml-2 min-h-11 border border-current px-3 py-2 text-xs">{read ? (en ? 'Restore unread badges' : '恢复未读徽标') : (en ? 'Mark sample messages read' : '将示例消息标为已读')}</button></div>;
}

function AdaptedBadge({ style, session, locale }: VariantDemoProps & { style: RecipeStyleId }) {
  const en = locale === 'en';
  const r = recipe(style);
  const [read, setRead] = useSessionState(session, 'badgeRead', false);
  return <RecipeFrame style={style} locale={locale} title={en ? 'Notification badges' : '通知徽标'}>
    <div className={`p-4 ${r.item}`}><div className="flex flex-wrap items-center justify-between gap-3"><span className={r.title}>{en ? 'Inbox' : '收件箱'}</span><span role="status" aria-label={en ? `${read ? 0 : 3} unread messages` : `${read ? 0 : 3} 条未读消息`} className={`px-3 py-1 text-xs ${read ? r.secondary : r.active}`}>{read ? (en ? 'All read' : '全部已读') : (en ? '3 new' : '3 条新消息')}</span></div>
    <div className="mt-4 flex flex-wrap gap-2"><span className={`px-2 py-1 text-xs ${r.secondary}`}>{en ? 'Design' : '设计'}</span><span className={`px-2 py-1 text-xs ${r.control}`}>{en ? 'Review ready' : '待审阅'}</span></div></div>
    <button type="button" onClick={() => setRead(!read)} className={`min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none mt-4 px-4 text-xs ${r.control}`}>{read ? (en ? 'Restore unread badges' : '恢复未读徽标') : (en ? 'Mark sample messages read' : '将示例消息标为已读')}</button>
  </RecipeFrame>;
}

function localDemo(Demo: StyleVariantSet[number]['Demo']) {
  return function LocalDemo(props: VariantDemoProps) {
    return <><Demo {...props} /><p className="mx-auto mt-4 w-full max-w-md text-xs leading-relaxed text-ink-2">{props.locale === 'en' ? 'Local interaction demo. Nothing is sent or saved outside this page.' : '本地交互演示，不会向外发送或保存数据。'}</p></>;
  };
}

const adaptedNotes = {
  "flat-design": {
    "zh": "蓝色实心面、简洁圆角与无投影的层级，让选中项清晰可辨。收件箱徽标以数字与文字显示未读状态，可标为已读再恢复。",
    "en": "Solid blue surfaces, simple corners and shadow-free hierarchy make selection explicit. Inbox badges express unread state with text and counts, with reversible read/reset actions."
  },
  "minimalism": {
    "zh": "白底细边、宽松留白和黑白反转状态，移除多余装饰。收件箱徽标以数字与文字显示未读状态，可标为已读再恢复。",
    "en": "White space, fine borders and monochrome inversion remove unnecessary decoration. Inbox badges express unread state with text and counts, with reversible read/reset actions."
  },
  "swiss-style": {
    "zh": "编号书眉和严格对齐的网格配黑色规则线，红色侧轨标记选中状态。收件箱徽标以数字与文字显示未读状态，可标为已读再恢复。",
    "en": "A numbered masthead and aligned grid use black rules, with red rails marking selection. Inbox badges express unread state with text and counts, with reversible read/reset actions."
  },
  "cyberpunk": {
    "zh": "近黑终端底配青色边轨、洋红硬投影和等宽文字，活动状态以霓虹实心块提示。收件箱徽标以数字与文字显示未读状态，可标为已读再恢复。",
    "en": "A near-black terminal, cyan rails, magenta offset shadows and monospace labels expose active state as a solid neon block. Inbox badges express unread state with text and counts, with reversible read/reset actions."
  },
  "art-deco": {
    "zh": "深炭底上用对称金色双线、菱形书眉和大字距衬线标题构成秩序。收件箱徽标以数字与文字显示未读状态，可标为已读再恢复。",
    "en": "Symmetric gold double rules, a diamond masthead and tracked serif titles structure a charcoal surface. Inbox badges express unread state with text and counts, with reversible read/reset actions."
  }
};

const styleVariants: StyleVariantSet = [
  {
    style: 'neobrutalism',
    name: {"zh":"新粗野主义","en":"Neobrutalism"},
    note: {
      zh: '3px 黑描边加 4px 硬偏移投影、荧光底与全大写黑体，标签像被贴上去的实体贴纸。',
      en: 'A 3px black outline with a 4px hard offset shadow on fluorescent ground makes each badge read as a physically stuck-on sticker.',
    },
    Demo: localDemo(BrutalBadge),
  },
  {
    style: 'editorial',
    name: {"zh":"杂志编辑风","en":"Editorial"},
    note: {
      zh: '上下粗规线夹住斜体衬线大词与超宽字距小标签，用排版层级而非色块做徽标。',
      en: 'Heavy horizontal rules bracket an italic serif headline and wide-tracked small caps, making hierarchy purely typographic.',
    },
    Demo: localDemo(EditorialBadge),
  },
  {
    style: 'skeuomorphism',
    name: {"zh":"拟物化","en":"Skeuomorphism"},
    note: {
      zh: '圆角胶囊叠垂直渐变、内高光与外侧投影，复刻搪瓷徽章那种可触摸的凸起感。',
      en: 'Rounded capsules stack vertical gradients, inner highlights and drop shadows to reproduce the raised, touchable feel of enamel pins.',
    },
    Demo: localDemo(GlossBadge),
  },
  ...(['flat-design', 'minimalism', 'swiss-style', 'cyberpunk', 'art-deco'] as const).map(style => recipeVariant(style, (props: VariantDemoProps) => <AdaptedBadge {...props} style={style} />, adaptedNotes[style])),
];

export default styleVariants;
