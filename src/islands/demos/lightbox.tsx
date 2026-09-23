import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const SHOTS = [
  {
    zh: { title: '海岸线', caption: '清晨的长曝光海景' },
    en: { title: 'Coastline', caption: 'Long-exposure seascape at dawn' },
    from: '#1d4e89',
    to: '#7dd3c0',
  },
  {
    zh: { title: '沙丘', caption: '午后光影下的纹理' },
    en: { title: 'Dunes', caption: 'Texture under afternoon light' },
    from: '#c9843a',
    to: '#f2d6a2',
  },
  {
    zh: { title: '雪峰', caption: '逆光的山脊线' },
    en: { title: 'Ridge', caption: 'Backlit ridgeline in snow' },
    from: '#4b5d67',
    to: '#e8eef2',
  },
];

function Shot({
  index,
  en,
  className,
  label,
}: {
  index: number;
  en: boolean;
  className?: string;
  label?: string;
}) {
  const s = SHOTS[index];
  const copy = en ? s.en : s.zh;
  return (
    <figure
      data-anatomy="2"
      className={`flex flex-col items-center justify-center overflow-hidden rounded-lg ${className ?? ''}`}
      style={{ background: `linear-gradient(145deg, ${s.from}, ${s.to})` }}
    >
      <figcaption className="px-3 text-center">
        <span className="font-serif text-sm font-semibold text-white drop-shadow">{copy.title}</span>
        <span className="mt-0.5 block text-[10px] text-white/85">{label ?? copy.caption}</span>
      </figcaption>
    </figure>
  );
}

function Lightbox({
  index,
  onIndex,
  onClose,
  en,
}: {
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  en: boolean;
}) {
  const s = SHOTS[index];
  const copy = en ? s.en : s.zh;
  const step = (delta: number) =>
    onIndex((index + delta + SHOTS.length) % SHOTS.length);

  return (
    <div
      data-anatomy="1"
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
      onClick={onClose}
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 p-4"
      style={{ animation: 'demo-lb-fade calc(160ms * var(--demo-speed, 1)) both' }}
    >
      <div className="relative flex w-full max-w-xs flex-col items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <Shot index={index} en={en} className="h-40 w-full shadow-2xl" />
        <p className="text-[11px] text-white/80">{copy.caption}</p>
        <p className="font-mono text-[10px] text-white/60">
          {index + 1} / {SHOTS.length}
        </p>
        <button
          data-anatomy="4"
          type="button"
          onClick={onClose}
          aria-label={en ? 'Close' : '关闭'}
          className="absolute -right-1 -top-9 h-7 w-7 rounded-full bg-white/15 text-sm text-white transition-colors hover:bg-white/30"
        >
          ×
        </button>
        <div data-anatomy="3" className="absolute inset-y-0 -left-1 flex items-center">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label={en ? 'Previous' : '上一张'}
            className="h-8 w-8 rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
          >
            ‹
          </button>
        </div>
        <div className="absolute inset-y-0 -right-1 flex items-center">
          <button
            type="button"
            onClick={() => step(1)}
            aria-label={en ? 'Next' : '下一张'}
            className="h-8 w-8 rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

const LightboxDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [variant, setVariant] = useState<'gallery' | 'zoom' | 'video'>('gallery');

  if (mode === 'variants') {
    return (
      <div className="mx-auto w-full max-w-sm text-center">
        <div className="mb-3 flex justify-center gap-1.5">
          {(
            [
              ['zoom', en ? 'Zoom' : '放大'],
              ['gallery', en ? 'Gallery' : '画廊'],
              ['video', en ? 'Video' : '视频'],
            ] as ['zoom' | 'gallery' | 'video', string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={variant === id}
              onClick={() => setVariant(id)}
              className={`rounded-md border px-2 py-1 text-xs ${
                variant === id ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            setIndex(variant === 'video' ? 2 : 0);
            setOpen(true);
          }}
          className="rounded-lg border border-line bg-raised px-3 py-1.5 text-xs text-ink-2 transition-colors hover:border-accent hover:text-accent"
        >
          {en ? 'Open lightbox' : '打开灯箱'}
        </button>
        <p className="mt-2 text-[11px] text-ink-3">
          {variant === 'zoom'
            ? en
              ? 'Single image, detail zoom.'
              : '单图放大查看细节。'
            : variant === 'gallery'
              ? en
                ? 'Photo set with arrows and counter.'
                : '组图浏览，带箭头与计数。'
              : en
                ? 'Video plays inside the overlay.'
                : '浮层内播放视频。'}
        </p>
        {open && (
          <Lightbox index={index} onIndex={setIndex} onClose={() => setOpen(false)} en={en} />
        )}
      </div>
    );
  }

  return (
    <div className="relative mx-auto h-64 w-full max-w-xs overflow-hidden rounded-xl border border-line bg-paper">
      <div className="flex h-full flex-col gap-2 p-3">
        <p className="text-xs font-medium text-ink-2">{en ? 'Album' : '相册'}</p>
        <div className="grid flex-1 grid-cols-3 gap-1.5">
          {SHOTS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              className="rounded-md transition-transform hover:scale-[1.03]"
            >
              <Shot
                index={i}
                en={en}
                label={`${i + 1} / ${SHOTS.length}`}
                className="h-full w-full"
              />
            </button>
          ))}
        </div>
        <p className="text-[10px] text-ink-3">
          {en ? 'Click a thumbnail to enlarge' : '点击缩略图放大预览'}
        </p>
      </div>
      {open && (
        <Lightbox index={index} onIndex={setIndex} onClose={() => setOpen(false)} en={en} />
      )}
      <style>{`
        @keyframes demo-lb-fade { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </div>
  );
};

export default LightboxDemo;
