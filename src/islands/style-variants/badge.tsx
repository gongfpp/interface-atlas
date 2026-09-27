import type { StyleVariantSet, VariantDemoProps } from './types';

function BrutalBadge({ locale }: VariantDemoProps) {
  const en = locale === 'en';
  return (
    <div className="mx-auto flex w-full max-w-sm flex-wrap items-center gap-4 bg-[#e8ff6b] p-6 text-black" style={{ border: '3px solid #000' }}>
      <span className="border-[3px] border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-wide shadow-[4px_4px_0_0_#000]">{en ? 'New' : '新品'}</span>
      <span className="border-[3px] border-black bg-[#ff5d5d] px-3 py-1 text-xs font-black uppercase tracking-wide text-white shadow-[4px_4px_0_0_#000]">{en ? 'Sale' : '促销'}</span>
      <span className="rounded-full border-[3px] border-black bg-black px-3 py-1 text-xs font-black uppercase tracking-wide text-[#e8ff6b]">v2.0</span>
    </div>
  );
}

function EditorialBadge({ locale }: VariantDemoProps) {
  const en = locale === 'en';
  return (
    <div className="mx-auto w-full max-w-sm border-y-2 border-ink bg-raised px-2 py-5">
      <div className="flex items-baseline gap-4">
        <span className="font-serif text-2xl italic text-accent">{en ? 'Exclusive' : '独家'}</span>
        <span className="h-px flex-1 bg-line-strong" />
        <span className="font-serif text-[11px] uppercase tracking-[0.3em] text-ink-2">Issue 04</span>
      </div>
      <div className="mt-4 flex gap-2">
        <span className="border border-ink px-2 py-0.5 font-serif text-[11px] uppercase tracking-[0.15em]">Design</span>
        <span className="border border-ink px-2 py-0.5 font-serif text-[11px] uppercase tracking-[0.15em]">Culture</span>
        <span className="bg-ink px-2 py-0.5 font-serif text-[11px] uppercase tracking-[0.15em] text-paper">Print</span>
      </div>
    </div>
  );
}

function GlossBadge({ locale }: VariantDemoProps) {
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
      <p className="mt-4 text-[11px] leading-relaxed text-[#3a4250]">Raised bevels and top highlights mimic physical enamel pins.</p>
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'neobrutalism',
    name: { zh: '新粗野主义', en: 'Neobrutalism' },
    note: {
      zh: '3px 黑描边加 4px 硬偏移投影、荧光底与全大写黑体，标签像被贴上去的实体贴纸。',
      en: 'A 3px black outline with a 4px hard offset shadow on fluorescent ground makes each badge read as a physically stuck-on sticker.',
    },
    Demo: BrutalBadge,
  },
  {
    style: 'editorial',
    name: { zh: '杂志编辑', en: 'Editorial' },
    note: {
      zh: '上下粗规线夹住斜体衬线大词与超宽字距小标签，用排版层级而非色块做徽标。',
      en: 'Heavy horizontal rules bracket an italic serif headline and wide-tracked small caps, making hierarchy purely typographic.',
    },
    Demo: EditorialBadge,
  },
  {
    style: 'skeuomorphism',
    name: { zh: '拟物主义', en: 'Skeuomorphism' },
    note: {
      zh: '圆角胶囊叠垂直渐变、内高光与外侧投影，复刻搪瓷徽章那种可触摸的凸起感。',
      en: 'Rounded capsules stack vertical gradients, inner highlights and drop shadows to reproduce the raised, touchable feel of enamel pins.',
    },
    Demo: GlossBadge,
  },
];

export default styleVariants;
