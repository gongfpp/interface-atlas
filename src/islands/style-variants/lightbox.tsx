import type { StyleVariantSet, VariantDemoProps } from './types';
import { useSessionState } from './session';

function ArtDecoLightbox({ session }: VariantDemoProps) {
  const [open, setOpen] = useSessionState(session, 'open', false);
  const [index, setIndex] = useSessionState(session, 'index', 0);
  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden border border-[#c9a227] bg-[#0d0d0b] p-6 text-center text-[#e8d5a1]">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-[#c9a227]" />
        <span className="font-serif text-xs uppercase tracking-[0.4em]">Gallery</span>
        <span className="h-px flex-1 bg-[#c9a227]" />
      </div>
      <button type="button" onClick={() => openAt(0)} className="mt-5 block w-full">
        <span
          className="mx-auto block h-32 w-32 border-2 border-[#c9a227] p-1"
          style={{
            background:
              'repeating-conic-gradient(from -90deg at 50% 100%, #c9a227 0deg 1.5deg, #0d0d0b 1.5deg 7deg)',
          }}
        >
          <span className="block h-full w-full bg-[#0d0d0b]" />
        </span>
        <span className="mt-3 block text-[10px] uppercase tracking-[0.3em] text-[#c9a227]/80">Open plate I</span>
      </button>
      {open && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#080806]/95 p-6" data-index={index}>
          <div className="border-2 border-[#c9a227] p-1.5">
            <div className="border border-[#c9a227]/60 px-8 py-6">
              <p className="font-serif text-2xl tracking-[0.25em]">MCMXXV</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.35em] text-[#c9a227]">Sunburst · No. 1</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-5 border border-[#c9a227] px-5 py-1.5 text-[10px] uppercase tracking-[0.3em] hover:bg-[#c9a227] hover:text-[#0d0d0b]"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

function AuroraLightbox({ session }: VariantDemoProps) {
  const [open, setOpen] = useSessionState(session, 'open', false);
  const [index, setIndex] = useSessionState(session, 'index', 0);
  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-[#070b1c] p-6 text-slate-100">
      <span className="pointer-events-none absolute -top-16 left-4 h-40 w-40 rounded-full bg-[#4f7cff]/40 blur-3xl" />
      <span className="pointer-events-none absolute -bottom-20 right-0 h-44 w-44 rounded-full bg-[#16e0c0]/30 blur-3xl" />
      <span className="pointer-events-none absolute right-16 top-8 h-32 w-32 rounded-full bg-[#b64bff]/30 blur-3xl" />
      <p className="relative font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400">Night shots</p>
      <div className="relative mt-4 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => openAt(i)}
            className="aspect-square rounded-lg border border-white/15 bg-gradient-to-br from-[#2a3a8f] to-[#0b1030] transition hover:border-white/40"
          />
        ))}
      </div>
      {open && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#04060f]/95 p-6" data-index={index}>
          <div className="h-28 w-full max-w-[220px] rounded-xl border border-white/20 bg-gradient-to-tr from-[#101a40] via-[#3a2a7a] to-[#1a8f9c] shadow-[0_0_40px_#2ee6c966]" />
          <p className="mt-4 font-mono text-[11px] text-slate-300">IMG_0042 · 35mm</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-4 rounded-full border border-white/25 px-5 py-1.5 text-[11px] hover:bg-white/10"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

function PixelLightbox({ session }: VariantDemoProps) {
  const [open, setOpen] = useSessionState(session, 'open', false);
  const [index, setIndex] = useSessionState(session, 'index', 0);
  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };
  const tiles = ['#22c55e', '#38bdf8', '#f59e0b'];
  return (
    <div className="relative mx-auto w-full max-w-sm border-4 border-black bg-[#1b1b3a] p-5 font-mono text-[#8ff0a4]">
      <p className="text-[11px] uppercase tracking-[0.2em]">◈ Sprite box</p>
      <div className="mt-3 grid grid-cols-3 gap-1">
        {tiles.map((c, i) => (
          <button key={c} type="button" onClick={() => openAt(i)} className="h-14 border-4 border-black" style={{ background: c }} />
        ))}
      </div>
      <p className="mt-3 text-[10px] text-[#b9b9e6]">Click a tile</p>
      {open && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/85 p-4" data-index={index}>
          <div className="w-full max-w-[280px] border-4 border-[#8ff0a4] bg-[#1b1b3a] p-4 shadow-[6px_6px_0_0_#000]">
            <div className="flex h-32 items-center justify-center border-4 border-black bg-[#22c55e] text-4xl">★</div>
            <div className="mt-3 flex items-center justify-between text-[11px]">
              <span>sprite_01.png</span>
              <button type="button" onClick={() => setOpen(false)} className="border-2 border-[#8ff0a4] px-2 py-0.5 hover:bg-[#8ff0a4] hover:text-black">
                [X]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styleVariants: StyleVariantSet = [
  {
    style: 'art-deco',
    name: { zh: '装饰艺术', en: 'Art Deco' },
    note: {
      zh: '深色底配金色双线框与对称放射纹，灯箱像装裱画框一样居中对称。',
      en: 'A dark ground with a gold double rule and symmetric sunburst; the lightbox sits centred like a framed plate.',
    },
    Demo: ArtDecoLightbox,
  },
  {
    style: 'aurora',
    name: { zh: '极光', en: 'Aurora' },
    note: {
      zh: '近黑夜里铺开三团彩色辉光，缩略图打开后玻璃面板仍浸在极光渐变中。',
      en: 'Three colour blooms glow over near-black night; opening a thumbnail keeps the glass panel bathed in aurora gradients.',
    },
    Demo: AuroraLightbox,
  },
  {
    style: 'pixel-art',
    name: { zh: '像素艺术', en: 'Pixel Art' },
    note: {
      zh: '全部硬像素直角与 4px 黑框，灯箱是用硬边投影堆出的 8-bit 对话框。',
      en: 'Everything is hard pixel corners and 4px black frames; the lightbox is an 8-bit dialog built from stepped hard shadows.',
    },
    Demo: PixelLightbox,
  },
];

export default styleVariants;
