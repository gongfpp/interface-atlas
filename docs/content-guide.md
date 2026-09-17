# 内容生产规范（Content Production Guide）

> 供子 Agent 批量生产 Concept 条目使用。权威定义见 `docs/PRD.md`（§26 最低标准、§33 Schema、§42.2 词典风）。
> 最佳范本：`src/content/patterns/skeleton-loading.yaml`（结构最全）与 `src/content/components/sidebar.yaml`。

## 0. 你（子 Agent）的任务边界

- **只写**：`src/content/<type>/<id>.yaml` 与 `src/islands/demos/<id>.tsx`。
- **不写**：`src/islands/demos/registry.ts`（主会话统一注册）、任何其他文件。
- 完成后对每个 YAML 跑：`node -e "require('js-yaml').load(require('fs').readFileSync('<file>','utf8'))"`（用 `npx node --input-type=module` 时 import `{load}`），确保可解析。
- 不要运行完整构建（主会话统一做）。

## 1. 条目 YAML 规范

### 1.1 必填字段（published 条目，缺一即 CI 失败）

```yaml
status: published
name: { zh: ..., en: ... }          # 双语
aliases: [...]                       # 至少 3 条，必须含中文口语（见 1.2）
category: [...]                      # 英文类别词
description: { zh, en }              # 各 80～160 字，词典风
use_when: [{ zh, en }, ...]          # ≥2 条
avoid_when: [{ zh, en }, ...]        # ≥2 条
tags: [...]                          # 小写英文
variants: [{ id, name{zh,en}, note{zh,en} }, ...]   # ≥2
anatomy: [...]                       # 组件/页面类建议给；纯动效类可省
related: [...]                       # 3～5 个，只能引用全库清单里的 id（见 §3）
demo: { component: <id>, modes: [default, dark, variants] }  # component 一律等于条目 id
sources: [{ name, url }, ...]        # ≥1，权威来源（Material/HIG/Fluent/MDN/W3C 等）
implementation: { css: [...], notes: { zh, en } }
prompts: { basic/design/implementation/agent × { zh, en } }
compare:                             # 仅当同组 ≥2 成员才写（组名见任务清单）
```

### 1.2 aliases 是搜索语料，不是阅读文本

大胆收录口语："下拉选择"、"左边菜单"、"加载灰色一闪一闪"、"苹果那种透明玻璃效果"。
黄金查询依赖 alias 命中——中文用户怎么口语描述这个东西，就收录什么。

### 1.3 YAML 安全规则（踩过的坑，违反即解析失败）

**全库已规范化为块样式（js-yaml dump），禁止再写 flow mapping `{ zh: ..., en: ... }`**：
plain 标量里的 ASCII 逗号会让解析器**静默拆键**（值截断 + 产生 null 键），不报错但数据损坏，
校验脚本 `scripts/validate-content.mjs` + 全量 null 值扫描负责拦截。新写内容时：

1. 双语字段用块样式：`zh:` / `en:` 各占一行，长文本用 `>-` 块标量。
2. 列表项含冒号（如 `- "position: fixed"`）仍需双引号。
3. 破折号 `—`、中文标点安全；`#` 出现在值中间要引号。

### 1.4 词典风文案口径

- description：判断句开头（"用……表示……"、"固定在……的……"），不用"想象你……"。
- use_when/avoid_when：一行一个场景，短句。
- agent prompt：固定骨架（先检查现有体系 → 要求列表 → 尊重 reduced-motion → 不加依赖 → 运行检查并列出修改文件）。
- 中英不是逐字翻译，是同一判断的两种自然表达。

### 1.5 related 引用约束

只能引用 §3 全库清单中的 id。不确定就不写。类型前缀规则（CI 强制）：
`applicable_styles` 只能引用 styles/*；`applicable_components` 只能引用 components/*；`applicable_pages` 只能引用 pages/*；`related` 任意。

## 2. Demo 组件规范

文件：`src/islands/demos/<id>.tsx`，与条目 id 同名。签名：

```tsx
import type { DemoComponent } from '@/islands/DemoStage';

const XDemo: DemoComponent = ({ mode }) => (
  <div className="...">...</div>
);
export default XDemo;
```

- 可用主题令牌（Tailwind class）：`bg-raised text-ink border-line bg-code-bg text-ink-2 text-ink-3 bg-accent text-accent bg-accent-soft`；字体 `font-serif font-mono`。
- `mode`：`default` 展示主形态；`dark` 深色形态；`variants` 展示多变体并列；`loading`（如适用）。
- **必须可交互**：按钮能点、开关能拨、tab 能切（用 useState）。Motion 类 demo 需要可反复触发（按钮触发动画）。
- Anatomy 高亮：给关键区域加 `data-anatomy="1"` `"2"` …（与 YAML `anatomy` 列表顺序对应）。
- 动画写法：keyframes 用 `<style>` 内联定义，时长一律写 `calc(<时长> * var(--demo-speed, 1))`。
  播放器契约（MotionPlayer）：慢速 = 把 --demo-speed 调大到 3（时长变长），暂停 = `.motion-paused` 类
  （对全部后代 animation-play-state: paused），重播 = key 重挂载。Demo 要么循环播放，要么自带触发按钮。
- 不引入任何新依赖；不写测试文件。
- 尺寸克制：演示画布高度 ≤ 320px，内容居中。

## 3. 全库 id 清单（90，引用只允许这里面）

**components (30)**：button, input, select, textarea, checkbox, radio, switch, slider, date-picker, navbar, sidebar, breadcrumb, tabs, pagination, modal, drawer, popover, tooltip, toast, alert, card, table, progress-bar, avatar, badge, accordion, dropdown, menu, command-palette, filter-panel

**patterns (15)**：infinite-scroll, progressive-disclosure, master-detail, inline-editing, optimistic-ui, empty-state, pull-to-refresh, lazy-loading, form-validation, drag-and-drop-sorting, undo-action, search-filtering, onboarding-tour, kanban-board, skeleton-loading

**styles (15)**：minimalism, neobrutalism, glassmorphism, skeuomorphism, flat-design, swiss-style, bauhaus, y2k, cyberpunk, memphis, bento-grid, editorial, retro-futurism, claymorphism, aurora

**pages (10)**：dashboard, landing-page, login, pricing, settings, profile, search, checkout, documentation, signup

**motion (20)**：hover-lift, press-feedback, hover-glow, magnetic-button, loading-spinner, page-transition, scroll-reveal, parallax, shared-element-transition, text-reveal, number-counter, marquee, stagger-reveal, ripple, morphing-icon, drawer-slide, toast-slide-in, accordion-expand, confetti, elastic-bounce

**compare 组**（组内 ≥2 才成立）：loading-indicator（skeleton/loading-spinner/progress-bar）、click-feedback（press-feedback/ripple）、hover-feedback（hover-lift/hover-glow）、navigation-overlay（command-palette/modal/drawer/popover）、primary-navigation（sidebar/navbar/menu）、primary-display（table/card/list 无 list 用 card+table）、overlay-container（modal/drawer/popover）、scroll-loading（infinite-scroll/pagination/pull-to-refresh）、auth-pages（login/signup）、form-feedback（toast/alert/inline form-validation）。同组成员的 `compare.dimensions` 键必须完全一致。

## 4. 质检清单（提交前自查）

- [ ] YAML 可解析（§0 命令）
- [ ] 所有 published 必填字段齐全且双语
- [ ] related/applicable_* 只引用 §3 清单 id 且类型前缀正确
- [ ] 同 compare 组的 dimensions 键一致
- [ ] demo.component = 条目 id；tsx 文件存在、默认导出、无新依赖
- [ ] 动画乘 --demo-speed；data-anatomy 与 YAML anatomy 对齐
- [ ] aliases 含 ≥2 条中文口语
