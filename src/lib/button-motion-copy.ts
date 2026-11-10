import type { ButtonMotion } from './button-motions';
import type { Locale } from './i18n';

/** One observable effect per sentence; controls explain their own trigger separately. */
export const BUTTON_MOTION_DESCRIPTIONS: Record<string, Record<Locale, string>> = {
  'fill-sweep': { zh: '蓝色背景从左向右填满按钮，移开后恢复。', en: 'Blue sweeps across the button from left to right, then recedes when you leave.' },
  'border-draw': { zh: '描边沿按钮轮廓逐段绘制，让文字变成完整按钮。', en: 'A stroke traces the outline, turning plain text into a bordered button.' },
  'magnetic-hover': { zh: '按钮轻微跟随光标偏移，离开后弹回原位。', en: 'The button follows nearby pointer movement and springs back when you leave.' },
  'press-scale': { zh: '按下时按钮缩小，松开后轻轻回弹。', en: 'The button compresses on press and rebounds on release.' },
  'arrow-slide': { zh: '文字向左让位，箭头从右侧滑入。', en: 'The label shifts left as an arrow slides into view.' },
  'ripple-click': { zh: '圆形涟漪从点击位置扩散，逐渐消失。', en: 'A circular ripple expands from the click position and fades out.' },
  'glow-pulse': { zh: '蓝色光晕在按钮周围明暗起伏，持续呼吸。', en: 'A blue glow pulses around the button while it is active.' },
  'liquid-fill': { zh: '蓝色液面从底部升起，边缘保持波浪起伏。', en: 'Blue liquid rises from the bottom with a gently moving surface.' },
  'split-reveal': { zh: '两侧盖板向外分开，露出底下的行动文字。', en: 'Two panels slide apart to reveal the call to action underneath.' },
  'shadow-lift': { zh: '按钮向上抬起，阴影随之展开，按下时落回。', en: 'The button rises with a deeper shadow and settles back on press.' },
  'loading-morph': { zh: '按钮收缩成圆形加载器，模拟完成后展开。', en: 'The button shrinks into a circular spinner and expands when the demo finishes.' },
  'success-morph': { zh: '加载结束后绘制勾号，并切换为绿色成功状态。', en: 'A check draws after loading, followed by a green success state.' },
  'progress-button': { zh: '进度在按钮内部从左向右推进，完成后变绿。', en: 'Progress fills the button from left to right and turns green on completion.' },
  'icon-morph': { zh: '加号旋转变成关闭图标，再次点击还原。', en: 'A plus rotates into a close icon; click again to restore it.' },
  'text-swap': { zh: '原文字向上退出，新文字从底部接替。', en: 'The original label slides up as a new label enters from below.' },
  'elastic-stretch': { zh: '按钮先拉宽、再压缩，像弹簧一样回到原形。', en: 'The button stretches, squashes and springs back to its original shape.' },
  'blob-morph': { zh: '规整边框变成柔软的不规则轮廓，持续缓慢形变。', en: 'A regular outline softens into an organic shape that keeps morphing.' },
  'particle-burst': { zh: '点赞瞬间向四周散出粒子，按钮保留选中状态。', en: 'Particles burst outward on like, leaving the button in its selected state.' },
  '3d-flip': { zh: '按钮绕竖轴翻转，露出背面的完成状态。', en: 'The button flips around its vertical axis to reveal a completed state.' },
  'cursor-interaction': { zh: '局部高光跟随光标移动，照亮按钮表面。', en: 'A local highlight follows the pointer across the button surface.' },
  'shine-sweep': { zh: '一束斜向高光快速扫过按钮表面。', en: 'A diagonal reflection sweeps quickly across the button.' },
  'border-beam': { zh: '一小段亮色流光沿按钮边框循环移动。', en: 'A bright beam travels continuously around the button border.' },
  'radial-reveal': { zh: '紫色背景以光标位置为圆心，向外扩散覆盖按钮。', en: 'Purple expands outward from the pointer position to cover the button.' },
  'underline-grow': { zh: '文字下方的细线从左向右延伸，移开后收回。', en: 'An underline grows from left to right and retracts when you leave.' },
  'icon-orbit': { zh: '箭头沿弧线绕行，再回到文字旁边。', en: 'The arrow follows an arc and returns beside the label.' },
  'hold-confirm': { zh: '持续按住时填满进度，完成后显示确认状态。', en: 'Holding fills the progress bar until the button confirms the action.' },
  'drag-confirm': { zh: '把滑块拖到右端完成确认，未到位时松开会复位。', en: 'Drag the handle to the right to confirm; releasing too early resets it.' },
  'shake-error': { zh: '按钮左右震动并变红，用动作表达操作失败。', en: 'The button shakes from side to side and turns red to signal an error.' },
  'bounce-confirm': { zh: '按钮先压缩蓄力、再向上弹起，落下后显示确认。', en: 'The button squashes, jumps and lands in a confirmed state.' },
  'lock-unlock': { zh: '锁梁抬起并旋转，以图标变化表达解锁。', en: 'The shackle lifts and rotates to show the unlocked state.' },
  'text-scramble': { zh: '随机字符逐个解码，最终还原成完整文字。', en: 'Scrambled characters resolve from left to right into the final label.' },
  'rolling-text': { zh: '多组文字沿竖直方向滚动，在同一窗口中依次切换。', en: 'Labels roll vertically through the same masked window.' },
  'letter-spread': { zh: '字母间距逐渐拉开，按钮宽度随文字一起展开。', en: 'Letter spacing increases as the button widens to fit the label.' },
  'arrow-loop': { zh: '旧箭头向右滑出，新箭头从另一侧接续滑入。', en: 'One arrow exits to the right as another slides in to replace it.' },
  'character-wave': { zh: '字母按顺序向上跳起，形成一段连续波浪。', en: 'Letters rise in sequence to create a travelling wave.' },
  'expand-panel': { zh: '紧凑按钮横向展开，变成一组分享操作。', en: 'A compact button expands horizontally into a group of sharing actions.' },
  'button-input': { zh: '按钮展开为邮箱输入框，并自动定位输入光标。', en: 'The button expands into an email field and automatically focuses the input.' },
  'directional-hover': { zh: '底色从光标进入的一侧滑入，响应不同来向。', en: 'The fill enters from the edge nearest the arriving pointer.' },
  'gooey-merge': { zh: '侧边小球靠近按钮，连接成柔软的黏性轮廓。', en: 'A small orb approaches the button and joins it with a gooey bridge.' },
  'explode-rebuild': { zh: '边框、文字和箭头短暂分散，再重新拼成按钮。', en: 'The border, label and arrow separate briefly, then reassemble.' },
};

export function buttonMotionHint(motion: ButtonMotion, locale: Locale): { pointer: string; touch: string } {
  const text = (zh: string, en: string) => locale === 'zh' ? zh : en;
  let pointer = text('点击体验', 'Click to try');
  let touch = text('轻点体验', 'Tap to try');
  if (motion.trigger === 'hover') pointer = text('悬停体验', 'Hover to try');
  if (['magnetic-hover', 'cursor-interaction'].includes(motion.id)) pointer = text('移入后移动鼠标', 'Move the pointer across the button');
  if (motion.id === 'directional-hover') pointer = text('从不同方向移入', 'Enter from different edges');
  if (['icon-morph', 'lock-unlock', 'particle-burst', '3d-flip'].includes(motion.id)) {
    pointer = text('点击切换，再点还原', 'Click to toggle; click again to reset');
    touch = text('轻点切换，再点还原', 'Tap to toggle; tap again to reset');
  }
  if (motion.trigger === 'hold') pointer = touch = text('按住 0.9 秒确认，提前松开取消', 'Hold for 0.9 s; release early to cancel');
  if (motion.trigger === 'drag') pointer = touch = text('拖至右端确认，未到位松手复位', 'Drag to the right; release early to reset');
  if (motion.id === 'progress-button') { pointer = text('点击模拟上传，不会上传文件', 'Click to simulate; no file is uploaded'); touch = text('轻点模拟上传，不会上传文件', 'Tap to simulate; no file is uploaded'); }
  if (motion.id === 'expand-panel') { pointer = text('点击 SHARE 展开，× 收起；MAIL 仅演示', 'Click SHARE to open, × to close; MAIL is a demo'); touch = text('轻点 SHARE 展开，× 收起；MAIL 仅演示', 'Tap SHARE to open, × to close; MAIL is a demo'); }
  if (motion.id === 'button-input') { pointer = text('点击输入，× 收起；仅演示，不发送', 'Click to enter an email, × to close; nothing is sent'); touch = text('轻点输入，× 收起；仅演示，不发送', 'Tap to enter an email, × to close; nothing is sent'); }
  return { pointer, touch };
}
