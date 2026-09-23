import { useState } from 'react';
import type { DemoComponent } from '@/islands/DemoStage';

const SWATCHES = ['#0f766e', '#1d4ed8', '#b45309', '#be123c', '#6d28d9', '#334155', '#000000', '#ffffff'];

function hsvToHex(h: number, s: number, v: number): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    const x = v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
    return Math.round(x * 255);
  };
  const to = (n: number) => n.toString(16).padStart(2, '0');
  return `#${to(f(5))}${to(f(3))}${to(f(1))}`;
}

function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return { h: 0, s: 0, v: 0 };
  const int = parseInt(m[1], 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = 60 * (((g - b) / d) % 6);
    else if (max === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
  }
  if (h < 0) h += 360;
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

function hexToOklabRough(hex: string): string {
  const int = parseInt(hex.replace('#', ''), 16) || 0;
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  const l = Math.round((0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b) * 100) / 100;
  return `oklch(${Math.round(l * 100)}% 0.05 ${Math.round(hexToHsv(hex).h)})`;
}

function SwatchGrid({
  value,
  onChange,
}: {
  value: string;
  onChange: (hex: string) => void;
}) {
  return (
    <div data-anatomy="3" className="grid grid-cols-8 gap-1.5">
      {SWATCHES.map((s) => (
        <button
          key={s}
          type="button"
          aria-label={s}
          aria-pressed={value.toLowerCase() === s.toLowerCase()}
          onClick={() => onChange(s)}
          className={`h-6 w-6 rounded-md border transition-transform hover:scale-110 ${
            value.toLowerCase() === s.toLowerCase() ? 'border-accent ring-1 ring-accent' : 'border-line'
          }`}
          style={{ background: s }}
        />
      ))}
    </div>
  );
}

function HsvCanvas({
  h,
  s,
  v,
  onPick,
}: {
  h: number;
  s: number;
  v: number;
  onPick: (s: number, v: number) => void;
}) {
  const hue = hsvToHex(h, 1, 1);
  return (
    <div
      data-anatomy="1"
      role="application"
      aria-label="HSV canvas"
      className="relative h-28 w-full cursor-crosshair rounded-lg border border-line"
      style={{
        background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hue})`,
      }}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const ns = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        const nv = Math.min(1, Math.max(0, 1 - (e.clientY - rect.top) / rect.height));
        onPick(ns, nv);
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute h-3 w-3 rounded-full border-2 border-white shadow"
        style={{
          left: `calc(${s * 100}% - 6px)`,
          top: `calc(${(1 - v) * 100}% - 6px)`,
          background: hsvToHex(h, s, v),
        }}
      />
    </div>
  );
}

const ColorPickerDemo: DemoComponent = ({ mode, locale }) => {
  const en = locale === 'en';
  const [hsv, setHsv] = useState({ h: 174, s: 0.78, v: 0.46 });
  const [alpha, setAlpha] = useState(100);
  const [hexInput, setHexInput] = useState('');
  const [variant, setVariant] = useState<'swatch' | 'hsv' | 'native'>('hsv');
  const hex = hsvToHex(hsv.h, hsv.s, hsv.v);

  const applyHex = (raw: string) => {
    setHexInput(raw);
    if (/^#?[0-9a-f]{6}$/i.test(raw.trim())) {
      setHsv(hexToHsv(raw.trim().startsWith('#') ? raw.trim() : `#${raw.trim()}`));
    }
  };

  const pickerBody = (
    <div className="flex w-full max-w-xs flex-col gap-3 rounded-xl border border-line bg-paper p-4 text-sm">
      {variant === 'swatch' && (
        <SwatchGrid
          value={hex}
          onChange={(s) => {
            setHsv(hexToHsv(s));
            setHexInput(s);
          }}
        />
      )}
      {variant === 'hsv' && (
        <>
          <HsvCanvas
            h={hsv.h}
            s={hsv.s}
            v={hsv.v}
            onPick={(s, v) => setHsv((prev) => ({ ...prev, s, v }))}
          />
          <div data-anatomy="2" className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-[11px] text-ink-3">
              <span className="w-10 font-mono">{en ? 'Hue' : '色相'}</span>
              <input
                type="range"
                min={0}
                max={360}
                value={Math.round(hsv.h)}
                onChange={(e) => setHsv((p) => ({ ...p, h: Number(e.target.value) }))}
                className="flex-1"
                style={{
                  accentColor: hsvToHex(hsv.h, 1, 1),
                  background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
                  borderRadius: 999,
                }}
              />
            </label>
            <label className="flex items-center gap-2 text-[11px] text-ink-3">
              <span className="w-10 font-mono">{en ? 'Alpha' : '透明'}</span>
              <input
                type="range"
                min={0}
                max={100}
                value={alpha}
                onChange={(e) => setAlpha(Number(e.target.value))}
                className="flex-1"
                style={{
                  accentColor: hex,
                  background: `linear-gradient(to right, ${hex}00, ${hex})`,
                  borderRadius: 999,
                }}
              />
            </label>
          </div>
          <SwatchGrid
            value={hex}
            onChange={(s) => {
              setHsv(hexToHsv(s));
              setHexInput(s);
            }}
          />
        </>
      )}
      {variant === 'native' && (
        <label className="flex items-center gap-3 text-xs text-ink-2">
          <input
            type="color"
            value={hex}
            onChange={(e) => {
              setHsv(hexToHsv(e.target.value));
              setHexInput(e.target.value);
            }}
            className="h-10 w-14 cursor-pointer rounded border border-line bg-raised"
          />
          {en ? 'System picker' : '调用系统取色器'}
        </label>
      )}
      <div data-anatomy="4" className="flex items-center gap-2">
        <span
          className="h-8 w-8 shrink-0 rounded-md border border-line"
          style={{ background: hex, opacity: alpha / 100 }}
        />
        <input
          value={hexInput || hex}
          onChange={(e) => applyHex(e.target.value)}
          aria-label={en ? 'Colour value' : '颜色值'}
          className="min-w-0 flex-1 rounded-lg border border-line bg-raised px-2 py-1 font-mono text-xs text-ink"
        />
        <span className="font-mono text-[10px] text-ink-3">{hexToOklabRough(hex)}</span>
      </div>
    </div>
  );

  if (mode === 'variants') {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-3">
        <div className="flex gap-1.5">
          {(
            [
              ['swatch', en ? 'Swatches' : '色板'],
              ['hsv', 'HSV'],
              ['native', en ? 'Native' : '原生'],
            ] as ['swatch' | 'hsv' | 'native', string][]
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
        {pickerBody}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xs">
      <p className="mb-2 text-xs font-medium text-ink-2">
        {en ? 'Brand colour' : '品牌色'}
      </p>
      {pickerBody}
    </div>
  );
};

export default ColorPickerDemo;
