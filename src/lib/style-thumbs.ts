/**
 * 风格缩略图规格 v2：目标是对标"前端网页设计风格参考"海报的还原度。
 * 5 个标志性风格有专属场景（lumo/vertex/paper/aurora/tasko），其余走增强通用场景。
 */
export interface StyleThumbSpec {
  slug: string;
  nameEn: string;
  nameZh: string;
  keywords: { en: string; zh: string };
  url: string;
  /** 场景模板：专属或通用 */
  scene: 'lumo' | 'vertex' | 'paper' | 'aurora' | 'tasko' | 'generic';
  brand: string;
  nav: string[];
  /** 导航右侧次要项（EN/中文、登录…） */
  navExt?: string[];
  heroTitle: string;
  heroTitle2?: string;
  heroSub: string;
  cta: string;
  heroCaption?: string;
  /** 功能卡 ×3 */
  features?: Array<{ t: string; s: string }>;
  /** 右侧视觉面板类型 */
  panel?: 'device' | 'photo' | 'mountain' | 'shapes' | 'chart' | 'screen';
  tokens: {
    bg: string;
    fg: string;
    sub: string;
    accent: string;
    accentFg: string;
    card: string;
    cardBorder: string;
    radius: string;
    shadow?: string;
    font: string;
    blur?: string;
    upper?: boolean;
    italic?: boolean;
    triCards?: [string, string, string];
    /** 大标题字号增益 */
    heroSize?: string;
  };
}

const sans = `'Helvetica Neue', 'PingFang SC', 'Noto Sans CJK SC', sans-serif`;
const serif = `Georgia, 'Songti SC', 'Noto Serif CJK SC', serif`;
const mono = `'SF Mono', Menlo, monospace`;

export const STYLE_SPECS: StyleThumbSpec[] = [
  {
    slug: 'minimalism', nameEn: 'Minimalism', nameZh: '极简主义',
    keywords: { en: 'LESS. BUT BETTER.', zh: '留白 · 克制 · 内容优先' },
    url: 'https://lumo.space', scene: 'lumo',
    brand: 'L U M O', nav: ['产品', '关于', '灵感', '支持'], navExt: ['更多干扰 更纯粹生活'],
    heroTitle: 'A calmer', heroTitle2: 'digital life', heroSub: '简洁的工具，成就更专注的你。', cta: '立即体验 →',
    heroCaption: '让专注成为一种日常',
    features: [
      { t: '专注模式', s: '屏蔽一切打扰' },
      { t: '极简界面', s: '只留下必要' },
      { t: '自然提醒', s: '轻声不吵闹' },
    ],
    panel: 'device',
    tokens: { bg: '#FBFBF9', fg: '#161513', sub: '#9B9B95', accent: '#161513', accentFg: '#fff', card: '#FFFFFF', cardBorder: '#EDEDE9', radius: '14px', shadow: '0 1px 2px rgba(0,0,0,.04)', font: serif, heroSize: '26px' },
  },
  {
    slug: 'swiss-style', nameEn: 'Swiss Style', nameZh: '瑞士国际主义',
    keywords: { en: 'GRID. CLARITY. IMPACT.', zh: '网格 · 清晰 · 有力的表达' },
    url: 'https://vertex.studio', scene: 'vertex',
    brand: 'VERTEX', nav: ['WORK', 'STUDIO', 'APPROACH', 'CONTACT'], navExt: ['EN / 中文'],
    heroTitle: 'IDEAS', heroTitle2: 'BUILD TOMORROW', heroSub: '用设计构建更好的未来', cta: '探索项目 →',
    tokens: { bg: '#F2F1ED', fg: '#101010', sub: '#5B5B55', accent: '#E63312', accentFg: '#fff', card: '#FFFFFF', cardBorder: '#101010', radius: '0px', font: sans, upper: true },
  },
  {
    slug: 'editorial', nameEn: 'Editorial', nameZh: '杂志编辑风',
    keywords: { en: 'STORIES & TYPE', zh: '衬线 · 叙事 · 呼吸感' },
    url: 'https://paperroom.co', scene: 'paper',
    brand: 'The Paper Room', nav: ['专栏', '生活', '旅行', '人物'], navExt: ['🔍'],
    heroTitle: 'Good Life', heroTitle2: 'in Small Things', heroSub: '我们记录真实的生活方式、人与地方的故事，\n恰在寻常之中，藏着最动人的答案。', cta: '阅读更多 →',
    features: [
      { t: '一间面朝山腰的房子', s: '2024.04.12' },
      { t: '城市漫游指南', s: '2024.04.09' },
      { t: '慢下来的周末', s: '2024.04.01' },
    ],
    panel: 'photo',
    tokens: { bg: '#FBF9F4', fg: '#26241F', sub: '#8A857A', accent: '#9A6B3F', accentFg: '#fff', card: '#FFFFFF', cardBorder: '#E8E3D8', radius: '8px', font: serif, italic: true },
  },
  {
    slug: 'glassmorphism', nameEn: 'Glassmorphism', nameZh: '玻璃拟态',
    keywords: { en: 'TRANSPARENT LAYERS', zh: '通透 · 层次 · 光' },
    url: 'https://aurora.app', scene: 'aurora',
    brand: 'Aurora', nav: ['产品', '方案', '价格', '关于'], navExt: ['立即体验'],
    heroTitle: '让灵感', heroTitle2: '自然流动', heroSub: 'Aurora 是一款全新的 AI 创作工具，\n在想法与灵感之间，创建更短的距离。', cta: '免费开始 →',
    features: [
      { t: 'AI 灵感助手', s: '激发灵感、辅助创作' },
      { t: '云端同步', s: '随时随用、灵感不丢失' },
      { t: '多格式导出', s: '连接创作的工作流' },
    ],
    panel: 'mountain',
    tokens: {
      bg: 'linear-gradient(160deg,#5B8DEF 0%,#7D6BE8 40%,#C86BD9 78%,#E989B8 100%)', fg: '#FFFFFF', sub: 'rgba(255,255,255,.72)',
      accent: 'rgba(255,255,255,.85)', accentFg: '#3B2E6E', card: 'rgba(255,255,255,.18)', cardBorder: 'rgba(255,255,255,.45)',
      radius: '16px', blur: 'blur(14px) saturate(150%)', font: sans, heroSize: '24px',
    },
  },
  {
    slug: 'neobrutalism', nameEn: 'Neobrutalism', nameZh: '新粗野主义',
    keywords: { en: 'RAW & LOUD', zh: '粗边 · 高对比 · 直给' },
    url: 'https://brutal.wtf', scene: 'generic',
    brand: 'BRUTAL*', nav: ['WORK', 'ABOUT', 'SHOP'], navExt: ['CART (2)'],
    heroTitle: 'MAKE IT', heroTitle2: 'LOUD.', heroSub: '粗野直给的设计，绝不拐弯。', cta: 'GO →',
    heroCaption: 'NO GRADIENTS. NO MERCY.',
    features: [
      { t: 'HUGE TYPE', s: '字要大，话要狠' },
      { t: 'THICK BORDER', s: '3px 起步的黑边' },
      { t: 'HARD SHADOW', s: '位移阴影不模糊' },
    ],
    panel: 'shapes',
    tokens: { bg: '#FDF3E3', fg: '#111111', sub: '#6B6B6B', accent: '#FF6B00', accentFg: '#111', card: '#FFFFFF', cardBorder: '#111111', radius: '0px', shadow: '5px 5px 0 #111', font: sans, upper: true, heroSize: '26px' },
  },
  {
    slug: 'skeuomorphism', nameEn: 'Skeuomorphism', nameZh: '拟物化',
    keywords: { en: 'REAL TEXTURES', zh: '质感 · 拟真 · 凹凸' },
    url: 'https://woodnote.app', scene: 'generic',
    brand: 'WoodNote', nav: ['笔记', '图书馆', '同步'], navExt: ['⚙︎'],
    heroTitle: 'Real as Physical', heroSub: '像真实物件一样可靠、可触。', cta: '打开面板',
    heroCaption: '皮革纹理 · 纸张质感 · 金属旋钮',
    features: [
      { t: '拟真书架', s: '木纹与皮革' },
      { t: '真实纸张', s: '书写有阻力' },
      { t: '物理旋钮', s: '转动见反馈' },
    ],
    panel: 'screen',
    tokens: {
      bg: 'linear-gradient(180deg,#E9ECEF,#D7DBE0)', fg: '#2C3E50', sub: '#7F8C8D', accent: '#3498DB', accentFg: '#fff',
      card: 'linear-gradient(180deg,#FFFFFF,#EDEFF2)', cardBorder: '#B9C0C7', radius: '12px',
      shadow: '0 6px 14px rgba(0,0,0,.18), inset 0 1px 0 #fff', font: sans, heroSize: '22px',
    },
  },
  {
    slug: 'flat-design', nameEn: 'Flat Design', nameZh: '扁平化',
    keywords: { en: 'SOLID & SIMPLE', zh: '平涂 · 直接 · 去装饰' },
    url: 'https://flatly.io', scene: 'generic',
    brand: 'Flatly', nav: ['功能', '价格', '博客'], navExt: ['登录'],
    heroTitle: 'Simple & Solid', heroSub: '去掉装饰，信息直达。', cta: '开始使用',
    heroCaption: '没有渐变 · 没有阴影 · 只有信息',
    features: [
      { t: '色块即层级', s: '大色块分区' },
      { t: '图标即语言', s: '几何小图标' },
      { t: '直角与留白', s: '克制的圆角' },
    ],
    panel: 'shapes',
    tokens: { bg: '#1FA2FF', fg: '#FFFFFF', sub: 'rgba(255,255,255,.75)', accent: '#FFD54F', accentFg: '#333333', card: 'rgba(255,255,255,.16)', cardBorder: 'rgba(255,255,255,.35)', radius: '8px', font: sans, heroSize: '24px', triCards: ['#FFD54F', '#FFFFFF', '#36CFC9'] },
  },
  {
    slug: 'bauhaus', nameEn: 'Bauhaus', nameZh: '包豪斯',
    keywords: { en: 'FORM & FUNCTION', zh: '几何 · 三原色 · 秩序' },
    url: 'https://staatliches.bau', scene: 'generic',
    brand: 'BAUHAUS', nav: ['形式', '色彩', '工坊'], navExt: ['1923'],
    heroTitle: 'FORM &', heroTitle2: 'FUNCTION', heroSub: '几何与三原色的秩序。', cta: '进入工坊',
    heroCaption: '圆 · 三角 · 方块',
    features: [
      { t: '红之圆', s: '统一的起点' },
      { t: '蓝之方', s: '功能的稳定' },
      { t: '黄之角', s: '能量的指向' },
    ],
    panel: 'shapes',
    tokens: { bg: '#F4EFE6', fg: '#141414', sub: '#77716A', accent: '#E23B2E', accentFg: '#fff', card: '#FFFFFF', cardBorder: '#141414', radius: '0px', font: sans, upper: true, heroSize: '24px', triCards: ['#E23B2E', '#21409A', '#F2B705'] },
  },
  {
    slug: 'y2k', nameEn: 'Y2K', nameZh: '千禧风',
    keywords: { en: 'METAL & BUBBLE', zh: '金属 · 气泡 · 梦幻' },
    url: 'https://cyberdream.jp', scene: 'generic',
    brand: '☆ CyberDream ☆', nav: ['音乐', '装扮', '星球'], navExt: ['会员卡'],
    heroTitle: 'Y2K CYBER', heroTitle2: 'DREAM ✦', heroSub: '千禧年的怀旧未来主义。', cta: '立即进入',
    heroCaption: '金属光泽 · 气泡字 · 荧光小熊',
    features: [
      { t: '镭射背景', s: '流动的银紫' },
      { t: '气泡按钮', s: '圆滚滚的触感' },
      { t: '像素贴纸', s: '闪星与小熊' },
    ],
    panel: 'chart',
    tokens: {
      bg: 'linear-gradient(160deg,#DDE7F5 0%,#EFD3E8 55%,#C9C8F4 100%)', fg: '#3A3A55', sub: '#7A7A99',
      accent: '#7B61FF', accentFg: '#fff', card: 'rgba(255,255,255,.78)', cardBorder: '#B8B8E0', radius: '20px',
      shadow: '0 8px 18px rgba(123,97,255,.18)', font: `ui-rounded, 'Arial Rounded MT Bold', 'PingFang SC', sans-serif`, heroSize: '22px',
    },
  },
  {
    slug: 'cyberpunk', nameEn: 'Cyberpunk', nameZh: '赛博朋克',
    keywords: { en: 'NEON NIGHTS', zh: '霓虹 · 夜色 · 终端' },
    url: 'https://neon.city:2077', scene: 'generic',
    brand: 'NEON://CITY', nav: ['街区', '装备', '黑市'], navExt: ['[SYS:OK]'],
    heroTitle: 'WAKE UP,', heroTitle2: 'SAMURAI', heroSub: '霓虹永不熄灭。', cta: '接入网络',
    heroCaption: '高对比 · 霓虹边框 · 全息投影',
    features: [
      { t: '义体改造', s: '+15% 神经速率' },
      { t: '黑客接口', s: '破防只要 3 秒' },
      { t: '黑市信用', s: '匿名交易' },
    ],
    panel: 'chart',
    tokens: {
      bg: '#0B0F1A', fg: '#EAF6FF', sub: '#5B7A94', accent: '#00E5FF', accentFg: '#050810',
      card: 'rgba(0,229,255,.06)', cardBorder: 'rgba(0,229,255,.35)', radius: '4px',
      shadow: '0 0 14px rgba(0,229,255,.25)', font: mono, upper: true, heroSize: '22px',
    },
  },
  {
    slug: 'memphis', nameEn: 'Memphis', nameZh: '孟菲斯',
    keywords: { en: 'PLAY & REPEAT', zh: '撞色 · 波点 · 顽皮' },
    url: 'https://milano-88.it', scene: 'generic',
    brand: "Milano '88", nav: ['家居', '图案', '派对'], navExt: ['意大利制造'],
    heroTitle: 'PLAY &', heroTitle2: 'REPEAT!', heroSub: '八十年代的顽皮几何。', cta: '开派对',
    heroCaption: '波点 · 折线 · 甜品色',
    features: [
      { t: '撞色格纹', s: '粉蓝黄绿' },
      { t: '几何贴纸', s: '圆点与折线' },
      { t: '歪斜排版', s: '故意不整齐' },
    ],
    panel: 'shapes',
    tokens: { bg: '#FFF4E3', fg: '#232323', sub: '#8A7A66', accent: '#FF5C8A', accentFg: '#fff', card: '#FFFFFF', cardBorder: '#232323', radius: '2px', shadow: '4px 4px 0 #232323', font: sans, heroSize: '24px', triCards: ['#FF5C8A', '#FFD23F', '#3EC6A8'] },
  },
  {
    slug: 'bento-grid', nameEn: 'Bento Grid', nameZh: '便当盒布局',
    keywords: { en: 'MODULAR & FLEX', zh: '模块化 · 一切尽在掌控' },
    url: 'https://tasko.app', scene: 'tasko',
    brand: '◉ Tasko', nav: ['产品', '模板', '资源', '定价'], navExt: ['登录', '免费注册'],
    heroTitle: '高效生活', heroTitle2: '从有序开始', heroSub: 'Tasko 帮助你管理任务、笔记与日程，让每一天更专注、更有意义。', cta: '开始使用 →',
    features: [
      { t: '任务 5', s: '今日待完成' },
      { t: '笔记 12', s: '记录灵感' },
      { t: '专注 3h24m', s: '比上周 +40%' },
    ],
    tokens: { bg: '#F5F5F7', fg: '#17181C', sub: '#83858D', accent: '#5B5BD6', accentFg: '#fff', card: '#FFFFFF', cardBorder: '#E5E7EB', radius: '16px', shadow: '0 1px 3px rgba(0,0,0,.06)', font: sans },
  },
  {
    slug: 'retro-futurism', nameEn: 'Retro Futurism', nameZh: '复古未来主义',
    keywords: { en: 'SYNTH 84', zh: '霓虹渐变 · 复古日落' },
    url: 'https://synthwave84.fm', scene: 'generic',
    brand: 'SYNTH-84', nav: ['电台', '巡演', '磁带'], navExt: ['REC ●'],
    heroTitle: 'DRIVE INTO', heroTitle2: 'THE SUNSET', heroSub: '回到 1984 年想象的未来。', cta: '播放电台',
    heroCaption: '合成器 · 网格地平线 · 铬金标题',
    features: [
      { t: '日落渐变', s: '粉紫橙三段' },
      { t: '透视网格', s: '无尽公路感' },
      { t: '铬金字', s: '金属反光标题' },
    ],
    panel: 'chart',
    tokens: {
      bg: 'linear-gradient(180deg,#140A33 0%,#3D1170 62%,#7A1F63 100%)', fg: '#FFE8F6', sub: '#B78BB8',
      accent: '#FF71CE', accentFg: '#2A0A2E', card: 'rgba(255,113,206,.12)', cardBorder: 'rgba(255,113,206,.45)',
      radius: '6px', font: mono, upper: true, heroSize: '22px',
    },
  },
  {
    slug: 'claymorphism', nameEn: 'Claymorphism', nameZh: '黏土风',
    keywords: { en: 'SOFT & PUFFY', zh: '软糯 · 圆润 · 大圆角' },
    url: 'https://claymates.fun', scene: 'generic',
    brand: 'Claymates', nav: ['主页', '小屋', '商店'], navExt: ['🧸'],
    heroTitle: 'Soft & Squishy', heroSub: '捏一捏就有好心情。', cta: '捏一下',
    heroCaption: '内阴影 · 大圆角 · 糖果色',
    features: [
      { t: '软糖按钮', s: '按下会回弹' },
      { t: '黏土角色', s: '圆润无棱角' },
      { t: '奶油底色', s: '低饱和背景' },
    ],
    panel: 'device',
    tokens: {
      bg: '#EDF0FF', fg: '#3A3F5C', sub: '#8A90B8', accent: '#6C7BFF', accentFg: '#fff',
      card: '#FFFFFF', cardBorder: 'rgba(108,123,255,.18)', radius: '22px',
      shadow: '0 14px 28px rgba(108,123,255,.22), inset 0 -6px 12px rgba(108,123,255,.10)', font: sans, heroSize: '22px',
    },
  },
  {
    slug: 'aurora', nameEn: 'Aurora', nameZh: '极光渐变',
    keywords: { en: 'GRADIENT GLOW', zh: '光晕 · 流动 · 暗夜' },
    url: 'https://borealis.ux', scene: 'generic',
    brand: 'Borealis', nav: ['光', '色', '场'], navExt: ['v2.0'],
    heroTitle: 'Flow with', heroTitle2: 'the Light', heroSub: '让颜色像极光一样流动。', cta: '点亮',
    heroCaption: '暗夜底 · 光斑 · 渐变文字',
    features: [
      { t: '极光底色', s: '绿紫粉光晕' },
      { t: '玻璃浮层', s: '轻透的内容卡' },
      { t: '流动渐变', s: '缓慢变色动画' },
    ],
    panel: 'mountain',
    tokens: {
      bg: 'radial-gradient(60% 80% at 20% 10%, rgba(52,211,153,.35), transparent), radial-gradient(55% 70% at 80% 25%, rgba(129,140,248,.4), transparent), radial-gradient(60% 60% at 50% 95%, rgba(236,72,153,.3), transparent), #0D0B1E',
      fg: '#F4F3FF', sub: '#9C99C2', accent: '#A5B4FC', accentFg: '#1E1B4B',
      card: 'rgba(255,255,255,.08)', cardBorder: 'rgba(165,180,252,.3)', radius: '14px', font: sans, heroSize: '22px',
    },
  },
];
