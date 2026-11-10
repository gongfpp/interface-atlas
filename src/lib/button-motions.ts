export type ButtonMotion = {
  id: string;
  en: string;
  zh: string;
  trigger: 'hover' | 'click' | 'hold' | 'drag';
  duration: number;
  params: string;
  stages: [string, string, string, string];
};

// Reference sheets 01–08, five effects per sheet; order is part of the catalogue contract.
export const BUTTON_MOTIONS: ButtonMotion[] = [
  { id: 'fill-sweep', en: 'Fill Sweep', zh: '颜色扫入', trigger: 'hover', duration: 300, params: 'left → right · #3B82F6', stages: ['DEFAULT', '30% FILL', '70% FILL', 'FULL HOVER'] },
  { id: 'border-draw', en: 'Border Draw', zh: '描边绘制', trigger: 'hover', duration: 400, params: '1.5px · clockwise', stages: ['TEXT ONLY', 'TOP STROKE', 'HALF BORDER', 'COMPLETE'] },
  { id: 'magnetic-hover', en: 'Magnetic Hover', zh: '磁吸跟随', trigger: 'hover', duration: 300, params: 'max-offset 16px · spring return', stages: ['APPROACH', 'FOLLOW', 'MAX OFFSET', 'RETURN'] },
  { id: 'press-scale', en: 'Press Scale', zh: '按压缩放', trigger: 'click', duration: 200, params: '1 → 1.03 → .95 → 1.02 → 1', stages: ['DEFAULT', 'HOVER', 'PRESS', 'RELEASE'] },
  { id: 'arrow-slide', en: 'Arrow Slide', zh: '箭头滑入', trigger: 'hover', duration: 300, params: 'icon 16px · text −8px', stages: ['TEXT', 'TEXT SHIFT', 'ARROW ENTER', 'FINAL'] },
  { id: 'ripple-click', en: 'Ripple Click', zh: '涟漪点击', trigger: 'click', duration: 600, params: 'origin: click · opacity .3 → 0', stages: ['CLICK POINT', 'SMALL RIPPLE', 'EXPAND', 'FADE OUT'] },
  { id: 'glow-pulse', en: 'Glow Pulse', zh: '光晕脉冲', trigger: 'hover', duration: 800, params: 'shadow 0 → 24px · scale 1.02', stages: ['NO GLOW', 'SOFT GLOW', 'PEAK GLOW', 'OUTER PULSE'] },
  { id: 'liquid-fill', en: 'Liquid Fill', zh: '液体填充', trigger: 'hover', duration: 700, params: 'wave 6px · bottom → top', stages: ['EMPTY', '30% FILL', '65% FILL', '100% FILL'] },
  { id: 'split-reveal', en: 'Split Reveal', zh: '分裂展开', trigger: 'hover', duration: 500, params: 'panels ±100% · reveal CTA', stages: ['CLOSED', 'SPLIT', 'OPENING', 'REVEALED'] },
  { id: 'shadow-lift', en: 'Shadow Lift', zh: '悬浮抬升', trigger: 'hover', duration: 300, params: 'y −6px · shadow 0 12px 24px', stages: ['REST', 'HOVER LIFT', 'MAX LIFT', 'PRESS DOWN'] },
  { id: 'loading-morph', en: 'Loading Morph', zh: '加载形变', trigger: 'click', duration: 400, params: 'rect → circle · spinner', stages: ['SUBMIT', 'TEXT FADE', 'SHRINK', 'SPINNER'] },
  { id: 'success-morph', en: 'Success Morph', zh: '成功状态', trigger: 'click', duration: 500, params: 'spinner → check · #10B981', stages: ['LOADING', 'SPINNER STOP', 'CHECK DRAW', 'SUCCESS'] },
  { id: 'progress-button', en: 'Progress Button', zh: '进度按钮', trigger: 'click', duration: 600, params: '0 → 100% · simulated upload', stages: ['UPLOAD', '30%', '70%', 'COMPLETE'] },
  { id: 'icon-morph', en: 'Icon Morph', zh: '图标变形', trigger: 'click', duration: 400, params: 'plus → close · rotate 45°', stages: ['PLUS', 'MORPH 1', 'MORPH 2', 'CLOSE'] },
  { id: 'text-swap', en: 'Text Swap', zh: '文案切换', trigger: 'hover', duration: 300, params: 'translateY −100% · mask', stages: ['FOLLOW', 'OLD TEXT UP', 'CROSSING', 'LET’S GO →'] },
  { id: 'elastic-stretch', en: 'Elastic Stretch', zh: '弹性拉伸', trigger: 'click', duration: 400, params: '1.12 / .96 · spring rebound', stages: ['DEFAULT', 'STRETCH', 'SQUASH', 'SETTLE'] },
  { id: 'blob-morph', en: 'Blob Morph', zh: '有机形变', trigger: 'hover', duration: 500, params: 'organic radius · fluid contour', stages: ['RECT', 'DISTORTION', 'BLOB', 'RETURN'] },
  { id: 'particle-burst', en: 'Particle Burst', zh: '粒子爆发', trigger: 'click', duration: 600, params: '24 particles · fade 800ms', stages: ['LIKE', 'BURST', 'MAX PARTICLES', 'LIKED'] },
  { id: '3d-flip', en: '3D Flip', zh: '3D 翻转', trigger: 'click', duration: 600, params: 'rotateY 180° · perspective 800px', stages: ['FRONT', '45°', '90°', 'BACK ✓'] },
  { id: 'cursor-interaction', en: 'Cursor Interaction', zh: '光标互动', trigger: 'hover', duration: 300, params: 'radial-gradient · cursor follow', stages: ['CURSOR LEFT', 'FOLLOW', 'CENTER', 'CURSOR RIGHT'] },
  { id: 'shine-sweep', en: 'Shine Sweep', zh: '高光扫过', trigger: 'hover', duration: 280, params: '45° reflection · ease-out', stages: ['IDLE', 'LIGHT ENTER', 'CENTER SHINE', 'LIGHT EXIT'] },
  { id: 'border-beam', en: 'Border Beam', zh: '流光边框', trigger: 'hover', duration: 1200, params: 'perimeter loop · linear', stages: ['12 O’CLOCK', '3 O’CLOCK', '6 O’CLOCK', '9 O’CLOCK'] },
  { id: 'radial-reveal', en: 'Radial Reveal', zh: '径向揭示', trigger: 'hover', duration: 320, params: 'circle mask · origin: cursor', stages: ['DEFAULT', 'SMALL CIRCLE', 'LARGE CIRCLE', 'FULL COVER'] },
  { id: 'underline-grow', en: 'Underline Grow', zh: '下划线生长', trigger: 'hover', duration: 240, params: 'width 0 → 100% · left → right', stages: ['0%', '35%', '70%', '100%'] },
  { id: 'icon-orbit', en: 'Icon Orbit', zh: '图标环绕', trigger: 'hover', duration: 520, params: 'arc 180° · return', stages: ['DEFAULT', 'LEAVE POSITION', 'ORBITING', 'RETURN'] },
  { id: 'hold-confirm', en: 'Hold to Confirm', zh: '长按确认', trigger: 'hold', duration: 900, params: 'release early → cancel · demo only', stages: ['READY', '30% HOLD', '70% HOLD', 'CONFIRMED ✓'] },
  { id: 'drag-confirm', en: 'Drag to Confirm', zh: '拖动确认', trigger: 'drag', duration: 300, params: 'threshold 92% · snap return', stages: ['START', '35%', '75%', 'CONFIRMED ✓'] },
  { id: 'shake-error', en: 'Shake Error', zh: '错误震动', trigger: 'click', duration: 360, params: 'x 0 / −8 / 7 / −5 / 3 / 0', stages: ['SUBMIT', '−8px', '+7px', 'TRY AGAIN'] },
  { id: 'bounce-confirm', en: 'Bounce Confirm', zh: '弹跳确认', trigger: 'click', duration: 460, params: 'squash .92 · jump −34px', stages: ['REST', 'SQUASH', 'JUMP', 'LAND'] },
  { id: 'lock-unlock', en: 'Lock Unlock', zh: '锁定解锁', trigger: 'click', duration: 420, params: 'shackle y −10px · rotate 18°', stages: ['LOCKED', 'SHACKLE MOVE', 'ROTATE', 'UNLOCKED'] },
  { id: 'text-scramble', en: 'Text Scramble', zh: '字符扰动', trigger: 'hover', duration: 520, params: '30ms / glyph · decode left → right', stages: ['EXPLORE', 'E#7@?X', 'EXPL?RE', 'EXPLORE →'] },
  { id: 'rolling-text', en: 'Rolling Text', zh: '滚轮文字', trigger: 'hover', duration: 360, params: 'VIEW → OPEN → EXPLORE · vertical mask', stages: ['VIEW', 'ROLL 1', 'ROLL 2', 'EXPLORE'] },
  { id: 'letter-spread', en: 'Letter Spread', zh: '字距展开', trigger: 'hover', duration: 300, params: 'tracking 0 → 8px · width expand', stages: ['TRACKING +0', '+2', '+5', '+8'] },
  { id: 'arrow-loop', en: 'Arrow Loop', zh: '箭头循环', trigger: 'hover', duration: 420, params: 'old x +52px · new x −52px', stages: ['DEFAULT', 'OLD EXIT', 'NEW ENTER', 'LOOPED'] },
  { id: 'character-wave', en: 'Character Wave', zh: '字符波浪', trigger: 'hover', duration: 560, params: 'stagger 20ms · y −12px', stages: ['IDLE', 'WAVE A', 'WAVE B', 'RETURN'] },
  { id: 'expand-panel', en: 'Expand to Panel', zh: '按钮展开面板', trigger: 'click', duration: 380, params: 'width 150 → 300px · stagger 40ms', stages: ['SHARE', 'EXPANDING', 'WIDE PANEL', 'ACTIONS'] },
  { id: 'button-input', en: 'Button to Input', zh: '按钮变输入框', trigger: 'click', duration: 420, params: 'width 150 → 300px · autofocus', stages: ['SUBSCRIBE', 'WIDTH EXPAND', 'CURSOR', 'EMAIL INPUT'] },
  { id: 'directional-hover', en: 'Directional Hover', zh: '方位感应', trigger: 'hover', duration: 260, params: 'nearest entry edge · adaptive origin', stages: ['LEFT', 'RIGHT', 'TOP / BOTTOM', 'ACTIVE'] },
  { id: 'gooey-merge', en: 'Gooey Merge', zh: '黏性融合', trigger: 'hover', duration: 520, params: 'metaball · blur + contrast · 54 → 4px', stages: ['SEPARATE', 'APPROACH', 'GOOEY BRIDGE', 'MERGED'] },
  { id: 'explode-rebuild', en: 'Explode & Rebuild', zh: '解构重组', trigger: 'click', duration: 600, params: 'stroke / text / arrow · max offset 30px', stages: ['NORMAL', 'SEPARATE', 'MAX EXPLOSION', 'REASSEMBLE'] },
];

export const MOTION_PAGE_SIZE = 10;
export const MOTION_PAGE_COUNT = BUTTON_MOTIONS.length / MOTION_PAGE_SIZE;
export function buttonMotionPath(page = 1) {
  return `/motion/buttons${page === 1 ? '' : `/${page}`}`;
}
