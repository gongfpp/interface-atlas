import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import type { ButtonMotion } from '@/lib/button-motions';
import { buttonMotionHint } from '@/lib/button-motion-copy';
import '@/styles/button-motions.css';

type Phase = 'idle' | 'running' | 'done';
type Props = { motion: ButtonMotion; locale: 'zh' | 'en' };
const timed = new Set(['loading-morph', 'success-morph', 'progress-button', 'text-scramble']);

export default function ButtonMotionDemo({ motion: m, locale }: Props) {
  const zh = locale === 'zh';
  const hint = buttonMotionHint(m, locale);
  const [phase, setPhase] = useState<Phase>('idle');
  const expanded = phase !== 'idle';
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const [version, setVersion] = useState(0);
  const [copied, setCopied] = useState<'LINK' | 'MAIL' | 'COPY' | ''>('');
  const [submitted, setSubmitted] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const frame = useRef<number | undefined>(undefined);
  const held = useRef(false);
  const drag = useRef(0);
  const complete = useRef(false);
  function clear() {
    clearInterval(timer.current);
    if (frame.current !== undefined) cancelAnimationFrame(frame.current);
    held.current = false;
  }
  useEffect(() => () => {
    clearInterval(timer.current);
    if (frame.current !== undefined) cancelAnimationFrame(frame.current);
  }, []);
  // Focus only after React has removed inert and the entrance is visible.
  useEffect(() => {
    if (!expanded || !['button-input', 'expand-panel'].includes(m.id)) return;
    const focusTimer = setTimeout(() => {
      if (m.id === 'button-input') field.current?.focus();
      else root.current?.querySelector<HTMLButtonElement>('.bm-panel-actions button')?.focus();
    }, 420);
    return () => clearTimeout(focusTimer);
  }, [expanded, m.id]);

  function reset() {
    clear();
    complete.current = false;
    drag.current = 0;
    setPhase('idle');
    setProgress(0);
    setActive(false);
    setCopied('');
    setSubmitted(false);
    setVersion(v => v + 1);
  }
  function closeExpanded() {
    reset();
    frame.current = requestAnimationFrame(() => root.current?.querySelector<HTMLButtonElement>('.bm-button')?.focus());
  }
  function start() {
    clear();
    complete.current = false;
    setPhase('running');
    setProgress(0);
    setVersion(v => v + 1);
    setCopied('');
    setSubmitted(false);
    const duration = timed.has(m.id) ? (m.id === 'text-scramble' ? 520 : 1800) : m.duration;
    const began = performance.now();
    timer.current = setInterval(() => {
      const next = Math.min(100, (performance.now() - began) / duration * 100);
      setProgress(next);
      if (next >= 100) {
        clearInterval(timer.current);
        complete.current = true;
        setPhase('done');
      }
    }, 30);
  }
  function beginHold() {
    if (held.current) return;
    clear();
    complete.current = false;
    held.current = true;
    setProgress(0);
    setPhase('running');
    const began = performance.now();
    timer.current = setInterval(() => {
      const next = Math.min(100, (performance.now() - began) / 900 * 100);
      setProgress(next);
      if (next >= 100) {
        clearInterval(timer.current);
        held.current = false;
        complete.current = true;
        setPhase('done');
      }
    }, 20);
  }
  function cancelHold() {
    if (held.current && !complete.current) {
      clear();
      setPhase('idle');
      setProgress(0);
    }
  }
  function finishDrag() {
    if (drag.current >= 92) {
      complete.current = true;
      setProgress(100);
      setPhase('done');
    } else {
      drag.current = 0;
      setProgress(0);
      setPhase('idle');
    }
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    const target = root.current;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const buttonRect = target.querySelector('.bm-button')?.getBoundingClientRect() ?? rect;
    target.style.setProperty('--x', `${Math.max(0, Math.min(100, (event.clientX - buttonRect.left) / buttonRect.width * 100))}%`);
    target.style.setProperty('--y', `${Math.max(0, Math.min(100, (event.clientY - buttonRect.top) / buttonRect.height * 100))}%`);
    target.style.setProperty('--mx', `${Math.max(-16, Math.min(16, (x - rect.width / 2) * .12))}px`);
    target.style.setProperty('--my', `${Math.max(-16, Math.min(16, (y - rect.height / 2) * .12))}px`);
  }
  function enter(event: PointerEvent<HTMLDivElement>) {
    if (m.id === 'directional-hover' && root.current) {
      const r = root.current.getBoundingClientRect();
      const distances = [event.clientX - r.left, r.right - event.clientX, event.clientY - r.top, r.bottom - event.clientY];
      const side = distances.indexOf(Math.min(...distances));
      root.current.style.setProperty('--origin', ['0% 50%', '100% 50%', '50% 0%', '50% 100%'][side]);
      root.current.dataset.edge = ['left', 'right', 'top', 'bottom'][side];
    }
    setActive(true);
    if (m.trigger === 'hover') start();
    move(event);
  }
  const done = phase === 'done';
  const running = phase === 'running';
  const on = active || (m.trigger === 'hover' && running);
  const open = phase !== 'idle';
  const style = { '--duration': `${m.duration}ms`, '--progress': `${progress}%` } as CSSProperties;
  const label = m.id === 'hold-confirm' ? (done ? 'CONFIRMED ✓' : 'HOLD TO CONFIRM')
    : m.id === 'shake-error' ? (open ? 'TRY AGAIN' : 'SUBMIT')
      : m.id === 'bounce-confirm' ? (open ? 'CONFIRMED ✓' : 'CONFIRM')
        : m.id === 'particle-burst' ? (open ? '♥ Liked' : '♡ Like')
          : m.id === 'lock-unlock' ? (open ? 'UNLOCKED' : 'LOCKED')
            : m.id === 'progress-button' ? (done ? '✓ COMPLETE' : running ? `${Math.floor(progress)}%` : 'UPLOAD')
              : m.id === 'success-morph' ? (done ? 'DONE' : 'SUBMIT')
                : m.id === 'loading-morph' ? (done ? '✓ DONE' : 'SUBMIT')
                  : m.id === 'shine-sweep' ? 'UPGRADE'
                    : m.id === 'border-beam' ? 'GENERATE'
                      : m.id === 'underline-grow' ? 'VIEW PROJECT'
                        : m.id === 'radial-reveal' ? 'DISCOVER'
                          : m.id === 'directional-hover' ? 'HOVER'
                            : m.id === 'gooey-merge' ? 'PLAY'
                              : ['arrow-loop', 'icon-orbit'].includes(m.id) ? 'NEXT' : 'Explore';
  const scramble = 'EXPLORE →'.split('').map((c, i) => i < progress / 100 * 9 || !running ? c : '#7@?X*%'.charAt((Math.floor(progress) + i * 3) % 7)).join('');
  async function copy(value: string, action: 'LINK' | 'COPY') {
    try { await navigator.clipboard.writeText(value); setCopied(action); }
    catch { setCopied(''); }
  }
  const face = <>
    {m.id === 'border-draw' && <svg className="bm-border" viewBox="0 0 160 52" preserveAspectRatio="none" aria-hidden="true"><rect x="1" y="1" width="158" height="50" rx="9" pathLength="100" /></svg>}
    {m.id === 'border-beam' && <svg className="bm-beam" viewBox="0 0 160 52" preserveAspectRatio="none" aria-hidden="true"><rect x="1" y="1" width="158" height="50" rx="9" pathLength="100" /></svg>}
    {['fill-sweep', 'liquid-fill', 'radial-reveal', 'directional-hover', 'progress-button', 'hold-confirm'].includes(m.id) && <span className="bm-fill" aria-hidden="true" />}
    {m.id === 'ripple-click' && running && <span key={version} className="bm-ripple" aria-hidden="true" />}
    {m.id === 'lock-unlock' && <svg className="bm-lock" viewBox="0 0 32 36" aria-hidden="true"><path className="bm-shackle" d="M8 17V11a8 8 0 0 1 16 0v6" /><rect x="4" y="17" width="24" height="17" rx="2" /><circle cx="16" cy="25" r="1.5" /></svg>}
    {m.id === 'icon-morph' ? <span className="bm-plus" aria-hidden="true"><i /><i /></span>
      : m.id === '3d-flip' ? <span className="bm-flipper"><span className="bm-front">DOWNLOAD</span><span className="bm-back">DOWNLOADED ✓</span></span>
        : m.id === 'text-swap' ? <span className="bm-text-window"><span>FOLLOW</span><span>LET’S GO →</span></span>
          : m.id === 'rolling-text' ? <span className="bm-rolling"><span>VIEW</span><span>OPEN</span><span>EXPLORE</span></span>
            : m.id === 'split-reveal' ? <><span className="bm-under">START ↓</span><span className="bm-door bm-door-left">DOWN</span><span className="bm-door bm-door-right">LOAD</span></>
              : m.id === 'character-wave' ? <span className="bm-characters" aria-hidden="true">{'EXPLORE'.split('').map((c, i) => <span key={i} style={{ '--i': i } as CSSProperties}>{c}</span>)}</span>
                : <span className="bm-label">{m.id === 'text-scramble' ? <span aria-hidden="true">{phase === 'idle' ? 'EXPLORE' : scramble}</span> : label}</span>}
    {['arrow-slide', 'arrow-loop', 'icon-orbit', 'explode-rebuild'].includes(m.id) && <span className="bm-arrow" aria-hidden="true">→</span>}
    {m.id === 'arrow-loop' && <span className="bm-arrow-new" aria-hidden="true">→</span>}
    {['loading-morph', 'success-morph'].includes(m.id) && running && <span className="bm-spinner" aria-hidden="true" />}
    {m.id === 'success-morph' && done && <svg key={version} className="bm-check" viewBox="0 0 32 32" aria-hidden="true"><path d="m6 16 7 7L27 8" pathLength="100" /></svg>}
    {m.id === 'explode-rebuild' && <><span className="bm-fragment bm-fragment-a" aria-hidden="true" /><span className="bm-fragment bm-fragment-b" aria-hidden="true" /></>}
  </>;
  return <div className="bm-demo" role="group" aria-label={zh ? `${m.zh}交互预览` : `${m.en} interactive preview`} aria-describedby={`${m.id}-description ${m.id}-hint`}>
    <div className={`bm-stage ${['glow-pulse', 'shine-sweep', 'border-beam', 'text-scramble'].includes(m.id) ? 'bm-stage-dark' : ''}`}>
      <div ref={root} className={`bm-effect ${on ? 'is-active' : ''}`} data-kind={m.id} data-phase={phase} style={style}
        onPointerEnter={enter} onPointerMove={move} onPointerLeave={() => { setActive(false); cancelHold(); }}>
        {m.id === 'drag-confirm' ? <div className={`bm-drag ${done ? 'bm-confirmed' : ''}`}>
          <span aria-hidden="true">{done ? '✓ CONFIRMED' : 'SLIDE TO CONFIRM →'}</span>
          <input type="range" min="0" max="100" step="1" value={progress} onPointerDown={() => { if (complete.current) reset(); }} aria-label={zh ? '拖动确认' : 'Drag to confirm'} aria-valuetext={done ? (zh ? '已确认' : 'Confirmed') : `${Math.round(progress)}%`} onChange={event => { const value = Number(event.target.value); drag.current = value; setProgress(value); setPhase('running'); }} onPointerUp={finishDrag} onPointerCancel={() => { drag.current = 0; finishDrag(); }} onKeyUp={event => { if (drag.current >= 92 || ['Enter', ' ', 'Home'].includes(event.key)) finishDrag(); }} onBlur={finishDrag} />
        </div> : m.id === 'expand-panel' ? <div className={`bm-panel ${open ? 'bm-open' : ''}`}>
          <button type="button" className="bm-button" aria-expanded={open} aria-hidden={open} tabIndex={open ? -1 : undefined} onClick={start}>SHARE</button>
          <div className="bm-panel-actions" inert={!open} aria-hidden={!open}>
            <button type="button" aria-label={zh ? '关闭分享' : 'Close share panel'} onClick={closeExpanded}>×</button>
            <button type="button" aria-label="LINK" onClick={() => { void copy(window.location.href, 'LINK'); }}>{copied === 'LINK' ? '✓' : 'LINK'}</button>
            <button type="button" aria-label="MAIL" onClick={() => setCopied('MAIL')}>{copied === 'MAIL' ? '✓' : 'MAIL'}</button>
            <button type="button" aria-label="COPY" onClick={() => { void copy('Interface Atlas — Button Motion', 'COPY'); }}>{copied === 'COPY' ? '✓' : 'COPY'}</button>
          </div>
        </div> : m.id === 'button-input' ? <form className={`bm-input-form ${open ? 'bm-open' : ''} ${submitted ? 'bm-submitted' : ''}`} onSubmit={event => { event.preventDefault(); setSubmitted(true); }}>
          <button type="button" className="bm-button" aria-expanded={open} aria-hidden={open} tabIndex={open ? -1 : undefined} onClick={start}>SUBSCRIBE</button>
          <div className="bm-input-fields" inert={!open} aria-hidden={!open}><input ref={field} type="email" required placeholder="YOUR EMAIL…" aria-label={zh ? '演示邮箱（不发送）' : 'Demo email (not sent)'} onChange={() => setSubmitted(false)} /><button type="submit" aria-label={zh ? '确认订阅演示' : 'Confirm demo subscription'}>{submitted ? '✓' : '→'}</button><button type="button" aria-label={zh ? '取消订阅演示' : 'Cancel demo subscription'} onClick={closeExpanded}>×</button></div>
        </form> : <>
          {m.id === 'gooey-merge' && <><svg className="bm-filter" aria-hidden="true"><defs><filter id={`goo-${m.id}`}><feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -9" /></filter></defs></svg><span className="bm-goo" aria-hidden="true"><i /><i /></span></>}
          <button type="button" className="bm-button" data-run={version % 2} aria-label={m.id === 'icon-morph' ? (open ? (zh ? '关闭图标，点击重播' : 'Close icon, replay') : (zh ? '加号变关闭图标' : 'Morph plus to close')) : m.id === 'text-scramble' || m.id === 'character-wave' ? 'Explore' : undefined}
            aria-pressed={['icon-morph', 'lock-unlock', 'particle-burst', '3d-flip'].includes(m.id) ? open : undefined}
            aria-busy={timed.has(m.id) && m.id !== 'text-scramble' ? running : undefined}
            onFocus={() => { setActive(true); if (m.trigger === 'hover' && phase === 'idle') start(); }} onBlur={() => { setActive(false); cancelHold(); }}
            onPointerDown={event => { move(event as unknown as PointerEvent<HTMLDivElement>); if (m.id === 'hold-confirm') { event.currentTarget.setPointerCapture(event.pointerId); beginHold(); } }}
            onPointerUp={cancelHold} onPointerCancel={cancelHold} onLostPointerCapture={cancelHold}
            onKeyDown={event => { if (m.id === 'hold-confirm' && [' ', 'Enter'].includes(event.key)) { event.preventDefault(); if (!event.repeat) beginHold(); } }}
            onKeyUp={event => { if (m.id === 'hold-confirm' && [' ', 'Enter'].includes(event.key)) { event.preventDefault(); cancelHold(); } }}
            onClick={() => { if (m.id !== 'hold-confirm') { if (['icon-morph', 'lock-unlock', 'particle-burst', '3d-flip'].includes(m.id) && open) reset(); else start(); } }}>
            <span key={['press-scale', 'elastic-stretch', 'shake-error', 'explode-rebuild'].includes(m.id) ? version : 0} className="bm-face">{face}</span>
          </button>
          {m.id === 'particle-burst' && running && <span key={version} className="bm-particles" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ '--angle': `${i * 15}deg`, '--distance': `${50 + i % 4 * 10}px` } as CSSProperties} />)}</span>}
        </>}
      </div>
    </div>
    <p className="bm-hint" id={`${m.id}-hint`}><span className="bm-pointer-hint">{hint.pointer}</span><span className="bm-touch-hint">{hint.touch}</span></p>
  </div>;
}
