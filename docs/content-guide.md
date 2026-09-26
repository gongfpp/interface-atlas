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
api: [...]                           # 可选：对应 Web 平台 API 符号（元素 / role / 属性），组件类建议给
framework_names:                     # 可选但组件类建议给：多框架命名对照（ARIA / shadcn / MUI / AntD…）
  - framework: shadcn/ui
    name: Dialog
    url: https://ui.shadcn.com/docs/components/dialog
    note:
      zh: ...
      en: ...
disambiguation:                      # 可选：一名两义 / 词义边界辨析
  zh: ...
  en: ...
confusable:                          # 可选：易混淆概念（id + 一句辨析）
  - id: dropdown
    note:
      zh: ...
      en: ...
structure: [{ part{zh,en}, note{zh,en} }, ...]   # 可选：page 结构拆解（部件 + 说明），页面类建议给
related: [{ id, relation }, ...]     # 3～5 条边，id 只能引用全库清单（见 §3），relation 见 §1.5
demo: { component: <id>, modes: [default, dark, variants] }  # component 一律等于条目 id
sources: [{ name, url }, ...]        # ≥1，权威来源（Material/HIG/Fluent/MDN/W3C 等）
implementation: { css: [...], notes: { zh, en } }
prompts: { basic/design/implementation/agent × { zh, en } }
compare:                             # 仅当同组 ≥2 成员才写（组名见任务清单）
                                     # 维度 key 用中文；同组必须键完全一致（CI 强制）
                                     # 英文维度标签在 src/lib/i18n.ts 的 DIMENSION_LABELS 维护，新增维度需同步补 en
```

组件条目应填写 `playground.task`（双语体验任务）与 `playground.checks`（至少两条双语使用检查点）；描述需要验证的体验，不把检查点写成尚未验证的合格声明。Demo 可接收 `locale`，新增示例应提供中英文文案。

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

### 1.5 related 关系约束（类型化，PRD §24）

`related` 是边列表，每条边写作 `{ id, relation }`，id 只能引用 §3 全库清单。`relation` 的取值与判定规则：

| relation | 含义 | 判定 |
| --- | --- | --- |
| `alternative_to` | 同类可替代 | 双方同属一个 `compare.group`（可跨类型，如 loading-indicator） |
| `contains` | 页面包含组件 | pages → components |
| `uses` | 页面使用交互模式 | pages → patterns |
| `affects` | 风格影响组件 | styles → components |
| `applies_to` | 动效应用于组件 | motion → components |
| `similar_to` | 同类相近 | 同类型且无共同 compare 组 |
| `used_with` | 跨类搭配 | 其余跨类型关系 |

`applicable_styles` 只能引用 styles/*；`applicable_components` 只能引用 components/*；`applicable_pages` 只能引用 pages/*（CI 强制）。

### 1.6 Style 预览规格（仅 styles 条目）

Style 的"风格实况"缩略图完全由 YAML 的 `preview` 字段驱动——`src/lib/style-previews.ts` 只做读取与派生，`StyleThumb.astro` 只做 renderer，不存在第二份风格数据。新增或修改风格时：

- `preview.order`：整数，决定 `/styles` 列表与首页风格墙的展示顺序（从 1 连续编号）。
- `scene` / `brand` / `nav` / `heroTitle` / `heroSub` / `cta` / `features` / `panel` / `tokens` 等定义缩略图的视觉与文案，schema 见 `src/content.config.ts` 的 `stylePreview`。
- `slug` 与显示名不写进 `preview`：组件从条目 id 与 `name`（zh/en）派生，因此 `name` 即列表上显示的规范名称。

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
- Motion 条目：`modes` 只用 `default` / `variants`（`dark` 对 motion 无意义，不要声明）。
  播放器自带的播放/重播/慢速/前后对比由 `demo.motionControls` 显式声明**真实生效**的项；
  demo 内部**不要**再放与播放器重复的「重播 / 暂停 / 重置」按钮，交互型 demo（hover / press / pointer）
  没有对应控件时写 `motionControls: []`，避免出现点了没反应的按钮。
- Anatomy 高亮：给关键区域加 `data-anatomy="1"` `"2"` …（与 YAML `anatomy` 列表顺序对应）。
- 动画写法：keyframes 用 `<style>` 内联定义，时长一律写 `calc(<时长> * var(--demo-speed, 1))`。
  播放器契约（MotionPlayer）：慢速 = 把 --demo-speed 调大到 3（时长变长），暂停 = `.motion-paused` 类
  （对全部后代 animation-play-state: paused）；重播/重置 = key 重挂载。Demo 要么循环播放，要么自带触发按钮。
  JS 驱动的动画（rAF / Web Animations）也要读取 `--demo-speed` 才能响应慢速。
- 不引入任何新依赖。纯视觉/换色类改动不要求测试；修正行为或无障碍问题时，在 `tests/` 下补一条能证明结果的相称断言（断言用户结果，而不是只断言 `aria-pressed`）。
- 尺寸克制：常规示例优先控制在 240～480px；完整表单和多变体允许自然增高，不裁切内容，内容居中。

## 2b. 组件跨风格变体（style-variants）

组件详情页的「不同风格下的它」由 `src/islands/style-variants/<组件id>.tsx` 提供，按需加载（`import.meta.glob`，无需注册表）。

```tsx
import { useState } from 'react';
import type { StyleVariantSet } from './types';

const styleVariants: StyleVariantSet = [
  { style: 'neobrutalism', name: { zh: '新粗野主义', en: 'Neobrutalism' }, note: { zh: '…', en: '…' }, Demo: Variant },
  // …共 3 个
];
export default styleVariants;
```

- 每个组件 3 个变体，各选一种站点风格；必须按该风格**重新设计**（形态 / 边框 / 投影 / 字体 / 间距 / 交互），不是换色。
- `Demo` 收到 `{ locale, session }: VariantDemoProps`。业务状态用 `useSessionState(session, '<key>', initial)`，**同一组件的所有变体共用同一 key**，这样切换风格会保留输入 / 选择 / 展开等状态；hover、按压、指针等瞬态状态留作局部 `useState`。
- 只引用 `react`、`./types`、`./session`，不新增依赖；暗色风格自行铺底色（画廊画布是 `bg-paper`）。
- 未提供文件的组件不显示该区块，可按组件增量补齐。

## 3. 全库 id 清单（164；新增时同步更新此处，并以内容校验结果为准）

**components (46)**：button, input, select, textarea, checkbox, radio, switch, slider, date-picker, navbar, sidebar, breadcrumb, tabs, pagination, modal, drawer, popover, tooltip, toast, alert, card, table, progress-bar, avatar, badge, accordion, dropdown, menu, command-palette, filter-panel, segmented-control, stepper, combobox, file-upload, rating, timeline, carousel, bottom-sheet, fab, tag-input, toolbar, multi-select, lightbox, split-button, tree-view, color-picker

**patterns (21)**：infinite-scroll, progressive-disclosure, master-detail, inline-editing, optimistic-ui, empty-state, pull-to-refresh, lazy-loading, form-validation, drag-and-drop-sorting, undo-action, search-filtering, onboarding-tour, kanban-board, skeleton-loading, wizard, drag-and-drop, bulk-actions, cookie-consent, paywall, keyboard-shortcuts

**styles (24)**：minimalism, neobrutalism, glassmorphism, skeuomorphism, flat-design, swiss-style, bauhaus, y2k, cyberpunk, memphis, bento-grid, editorial, retro-futurism, claymorphism, aurora, organic, art-deco, neumorphism, brutalism, corporate-memphis, hand-drawn, liquid-glass, pixel-art, vaporwave

**pages (26)**：dashboard, landing-page, login, pricing, settings, profile, search, checkout, documentation, signup, onboarding, error-404, error-500, faq, blog-index, blog-post, about, contact, notification-center, chat, calendar, help-center, features-comparison, order-confirmation, changelog, team

**motion (23)**：hover-lift, press-feedback, hover-glow, magnetic-button, loading-spinner, page-transition, scroll-reveal, parallax, shared-element-transition, text-reveal, number-counter, marquee, stagger-reveal, ripple, morphing-icon, drawer-slide, toast-slide-in, accordion-expand, confetti, elastic-bounce, view-transition, scroll-driven-animation, spring-animation

**foundation (18)**：type-scale, font-stack, line-height, measure, color-palette, semantic-color, contrast-ratio, elevation, pixel-density, relative-units, spacing-scale, border-radius, border-stroke, z-index, grid-system, breakpoints, touch-target, motion-duration

**a11y (6)**：focus-ring, skip-link, reduced-motion, keyboard-navigation, aria-live, alt-text

**compare 组**（组内 ≥2 才成立）：loading-indicator（skeleton/loading-spinner/progress-bar）、click-feedback（press-feedback/ripple）、hover-feedback（hover-lift/hover-glow）、navigation-overlay（command-palette/modal/drawer/popover/bottom-sheet）、primary-navigation（sidebar/navbar/menu）、primary-display（table/card/list 无 list 用 card+table）、overlay-container（modal/drawer/popover/bottom-sheet）、scroll-loading（infinite-scroll/pagination/pull-to-refresh）、auth-pages（login/signup）、form-feedback（toast/alert/inline form-validation）、typography-trio（type-scale/line-height/measure，维度：适用文本/调节粒度/响应式）。同组成员的 `compare.dimensions` 键必须完全一致。

## 4. 质检清单（提交前自查）

- [ ] YAML 可解析（§0 命令）
- [ ] 所有 published 必填字段齐全且双语
- [ ] related/applicable_* 只引用 §3 清单 id 且类型/关系合法（related 每条为 { id, relation }）
- [ ] 同 compare 组的 dimensions 键一致
- [ ] demo.component = 条目 id；tsx 文件存在、默认导出、无新依赖
- [ ] 动画乘 --demo-speed；data-anatomy 与 YAML anatomy 对齐
- [ ] aliases 含 ≥2 条中文口语
