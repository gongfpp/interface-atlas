/** Material-specific dialog motion. Closing retraces the opening gesture. */
export function atlasDialogMotion(slug: string, duration: number) {
  const cut = ['swiss-style', 'brutalism', 'retro-web', 'bauhaus'].includes(slug);
  const poses: Record<string, Keyframe> = {
    minimalism: { opacity: 0 },
    editorial: { opacity: 0, transform: 'translateX(18px)' },
    glassmorphism: { opacity: 0, transform: 'translateY(14px)', filter: 'blur(4px)' },
    'bento-grid': { opacity: 0, transform: 'scale(.8)' },
    neumorphism: { opacity: 0, transform: 'scale(.98)' },
    skeuomorphism: { opacity: 0, transform: 'translateY(24px)' },
    neobrutalism: { opacity: 0, transform: 'translate(-8px,-8px)' },
    'flat-design': { opacity: 0, transform: 'translateY(8px)' },
    y2k: { opacity: 0, transform: 'scale(.88) rotate(-2deg)' },
    cyberpunk: { opacity: 0, transform: 'scaleY(.92)', clipPath: 'inset(45% 0)' },
    memphis: { opacity: 0, transform: 'translateY(16px) rotate(-4deg)' },
    'retro-futurism': { opacity: 0, clipPath: 'inset(0 0 100%)' },
    claymorphism: { opacity: 0, transform: 'scale(.85,.9)' },
    aurora: { opacity: 0, filter: 'blur(8px)' },
    organic: { opacity: 0, transform: 'translateY(12px) rotate(-1deg)' },
    'art-deco': { opacity: 0, clipPath: 'inset(0 49%)' },
    'corporate-memphis': { opacity: 0, transform: 'translateY(12px)' },
    'hand-drawn': { opacity: 0, transform: 'translateY(-12px) rotate(-3deg)' },
    'liquid-glass': { opacity: 0, transform: 'scale(.93)', filter: 'blur(3px)' },
    'pixel-art': { opacity: 0, transform: 'translateY(12px)' },
    vaporwave: { opacity: 0, transform: 'translateX(20px)', filter: 'blur(2px)' },
  };
  const rest: Keyframe = { opacity: 1, transform: 'none', filter: 'blur(0px)', clipPath: 'inset(0)' };
  const frames = [poses[slug] ?? { opacity: 0 }, rest];
  if (slug === 'claymorphism') frames.splice(1, 0, { ...rest, transform: 'scale(1.025,.985)', offset: .75 });
  return {
    frames,
    duration: cut ? 0 : duration,
    easing: ['cyberpunk', 'pixel-art'].includes(slug) ? 'steps(4)' : 'cubic-bezier(.2,.7,.2,1)',
  };
}

/** 菜单的运动幅度小于弹窗，保留各材质的动作与回弹。 */
export function atlasMenuMotion(slug: string, duration: number, up = false) {
  const motion = atlasDialogMotion(slug, duration);
  const y = up ? -6 : 6;
  const start: Record<string, Keyframe> = {
    editorial: { opacity: 0, clipPath: `inset(${up ? '0 0 15%' : '15% 0 0'})` },
    'bento-grid': { opacity: 0, transform: 'scale(.96)' },
    skeuomorphism: { opacity: 0, transform: `translateY(${-y}px)` },
    neobrutalism: { opacity: 0, transform: 'translate(-3px,-3px)' },
    memphis: { opacity: 0, transform: 'rotate(-2deg) translateY(-4px)' },
    claymorphism: { opacity: 0, transform: 'scale(.94,.88)' },
    'hand-drawn': { opacity: 0, transform: 'rotate(-2deg) translateY(-5px)' },
    'pixel-art': { opacity: 0, transform: `translateY(${up ? -8 : 8}px)` },
  };
  const first = start[slug] ?? { ...motion.frames[0], transform: `translateY(${y}px)` };
  const rest = motion.frames.at(-1)!;
  return { ...motion, duration: Math.min(motion.duration, 180), frames: slug === 'claymorphism'
    ? [first, { ...rest, transform: 'scale(1.01,.99)', offset: .75 }, rest]
    : [first, rest] };
}

/** 整页交接使用小幅度，避免把弹窗的强缩放套在整个长页面上。 */
export function atlasPageMotion(slug: string, duration: number) {
  const motion = atlasDialogMotion(slug, duration);
  const frames = motion.frames.map(frame => ({ ...frame }));
  if (slug === 'bento-grid') frames[0].transform = 'scale(.96)';
  if (slug === 'neumorphism') frames[0].transform = 'scale(.99)';
  if (slug === 'y2k') frames[0].transform = 'scale(.96) rotate(-.5deg)';
  if (slug === 'claymorphism') { frames[0].transform = 'scale(.97,.95)'; frames[1].transform = 'scale(1.005,.995)'; }
  return { ...motion, frames };
}
