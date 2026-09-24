import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const DPRS = [1, 2, 3];
const ASSETS = [1, 2, 3];

function PixelGrid({ dpr, size = 120 }: { dpr: number; size?: number }) {
  return (
    <div
      data-anatomy="2"
      className="grid overflow-hidden rounded-xl border border-line-strong bg-code-bg"
      style={{ width: size, height: size, gridTemplateColumns: `repeat(${dpr}, 1fr)`, gap: 1 }}
    >
      {Array.from({ length: dpr * dpr }).map((_, i) => (
        <span key={i} data-anatomy={i === 0 ? '1' : undefined} className="bg-accent-soft" />
      ))}
    </div>
  );
}

function Bitmap({ dpr, asset, label }: { dpr: number; asset: number; label: string }) {
  const block = (6 * dpr) / asset;
  return (
    <div className="flex items-center gap-3">
      <div
        data-anatomy="4"
        aria-hidden="true"
        className="h-16 w-16 shrink-0 rounded-lg border border-line"
        style={{
          backgroundImage:
            'repeating-conic-gradient(var(--color-ink) 0% 25%, var(--color-paper) 0% 50%)',
          backgroundSize: `${block}px ${block}px`,
          transition: 'background-size calc(200ms * var(--demo-speed, 1)) ease',
        }}
      />
      <div>
        <p className="text-[11px] font-medium text-ink">{label}</p>
        <p className="text-[10px] leading-relaxed text-ink-3">
          {asset} image px per CSS px
        </p>
      </div>
    </div>
  );
}

const PixelDensityMain = ({ en }: { en: boolean }) => {
  const [dpr, setDpr] = useState(2);
  const [asset, setAsset] = useState(1);
  const blurry = asset < dpr;
  const oversized = asset > dpr;
  const verdict = blurry
    ? { text: en ? 'Blurry on this screen' : '在这块屏上发虚', cls: 'bg-red-500/10 text-red-600 dark:text-red-400' }
    : oversized
      ? { text: en ? 'Sharp but oversized' : '清晰但资源偏大', cls: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' }
      : { text: en ? 'Sharp match' : '密度刚好，锐利', cls: 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400' };

  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-xl border border-line bg-raised p-4">
        <div className="mb-2 flex items-center justify-between">
          <span data-anatomy="3" className="text-[10px] uppercase tracking-wider text-ink-3">
            {en ? 'Device pixel ratio (DPR)' : '设备像素比 DPR'}
          </span>
          <span className="font-mono text-xs text-accent">{dpr}x</span>
        </div>
        <div className="grid grid-cols-3 gap-1" role="group" aria-label={en ? 'DPR' : '设备像素比'}>
          {DPRS.map((d) => (
            <button
              key={d}
              aria-pressed={dpr === d}
              onClick={() => setDpr(d)}
              className={`demo-tool border border-line font-mono ${dpr === d ? '' : 'text-ink-2'}`}
            >
              {d}x
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <PixelGrid dpr={dpr} />
          <div className="min-w-0">
            <p className="text-[11px] leading-relaxed text-ink-2">
              {en
                ? 'One magnified CSS pixel, split into the device pixels underneath.'
                : '放大的一个 CSS 像素，里面每一格是一个设备像素。'}
            </p>
            <p className="mt-2 font-mono text-[11px] text-accent">
              1 CSS px = {dpr} × {dpr} = {dpr * dpr} device px
            </p>
            <p className="mt-1 font-mono text-[10px] text-ink-3">
              {en ? 'A 24px icon needs' : '一个 24px 图标占'} {24 * dpr} device px
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-line pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-ink-3">
              {en ? 'Bitmap density' : '位图密度'}
            </span>
            <div className="flex gap-1" role="group" aria-label={en ? 'Asset density' : '图片倍率'}>
              {ASSETS.map((a) => (
                <button
                  key={a}
                  aria-pressed={asset === a}
                  onClick={() => setAsset(a)}
                  className={`demo-tool border border-line font-mono ${asset === a ? '' : 'text-ink-2'}`}
                >
                  {a}x
                </button>
              ))}
            </div>
          </div>
          <Bitmap dpr={dpr} asset={asset} label={en ? `${asset}x image on a ${dpr}x screen` : `${asset}x 图片显示在 ${dpr}x 屏幕上`} />
          <p className={`mt-3 inline-block rounded-md px-2 py-0.5 text-[10px] font-medium ${verdict.cls}`}>
            {verdict.text}
          </p>
        </div>

        <div data-anatomy="5" className="mt-4 flex items-center gap-3 border-t border-line pt-4">
          <span className="leading-none text-ink" style={{ fontSize: '24px', lineHeight: 1 }}>
            Aa
          </span>
          <p className="text-[10px] leading-relaxed text-ink-3">
            {en
              ? 'Text is sized in CSS px (rem), so it re-renders per device pixel instead of being stretched.'
              : '文字用 CSS 像素（rem）排版，由浏览器按设备像素重新渲染，而不是被拉伸。'}
          </p>
        </div>
      </div>
    </div>
  );
};

function VariantCard({ dpr, asset, en }: { dpr: number; asset: number; en: boolean }) {
  const block = (6 * dpr) / asset;
  const ok = asset === dpr;
  return (
    <div className="rounded-xl border border-line bg-raised p-3">
      <p className="specimen-eyebrow">
        {asset}x → {dpr}x
      </p>
      <div
        className="mt-2 h-20 w-full rounded-lg border border-line"
        style={{
          backgroundImage:
            'repeating-conic-gradient(var(--color-ink) 0% 25%, var(--color-paper) 0% 50%)',
          backgroundSize: `${block}px ${block}px`,
        }}
      />
      <p className={`mt-2 text-[10px] font-medium ${ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-ink-3'}`}>
        {ok ? (en ? 'Crisp' : '锐利') : asset < dpr ? (en ? 'Blurry' : '发虚') : en ? 'Oversized' : '过大'}
      </p>
    </div>
  );
}

const PixelDensityVariants = ({ en }: { en: boolean }) => (
  <div className="mx-auto grid max-w-md gap-3">
    <VariantCard dpr={1} asset={1} en={en} />
    <VariantCard dpr={2} asset={1} en={en} />
    <VariantCard dpr={2} asset={2} en={en} />
    <p className="text-center text-[11px] leading-relaxed text-ink-3">
      {en
        ? 'Same image, three screens. A 1x bitmap cannot fill a 2x screen, so it is enlarged and softens.'
        : '同一张图、三块屏。1x 位图喂不饱 2x 屏，被放大后自然变软。'}
    </p>
  </div>
);

const PixelDensityDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  if (mode === 'variants') return <PixelDensityVariants en={en} />;
  return <PixelDensityMain en={en} />;
};

export default PixelDensityDemo;
