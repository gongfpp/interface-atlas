# 中文前端设计参考库 PRD

版本：v0.10
项目阶段：MVP
中文名称：界面图谱
英文名称：Interface Atlas（MVP 使用工作名，域名后定，改名成本 = 文案 + 301）

> v0.10 变更摘要（P1 功能落地）：① 收藏 + 浏览历史（localStorage，`/saved`，无账号、不上传）；② 类型列表页高级筛选（文本 + category chips，≥2 成员分类）；③ 概念页 Prompt Builder（概念 agent prompt + 风格 guide + 可选项组合成 agent-ready prompt，仅拼接人工维护内容）；④ 10 个 page 条目新增 `structure` 结构拆解（部件 + 说明）并在详情页展示；⑤ 埋点补强：Cloudflare Web Analytics 访客统计（`PUBLIC_CF_BEACON_TOKEN`）+ Umami 无 PII 事件（`search-miss`/`prompt-copy`/`prompt-builder-copy`），站点域名可用 `PUBLIC_SITE_URL` 覆盖。

> v0.8 变更摘要（P1 功能落地）：新增带过滤的随机探索页 `/explore`（中英双语）——按类型多选筛选、打乱顺序（每次进入随机排序）、随机跳转，复用 ConceptCard 静态渲染，交互由页面内联脚本完成（无新依赖）。

> v0.7 变更摘要（P1 功能落地）：① 新增概念对比浏览页 `/compare` 与 `/compare/<group>`（中英双语）——从 `compare.group` 数据生成，详情页内联对比改用共享 `CompareTable` 组件并新增"查看完整对比"入口；② CI 增加"同组 compare 维度键必须一致"校验；③ compare 维度英文标签集中到 `src/lib/i18n.ts` 的 `DIMENSION_LABELS`（键为中文维度名）。

> v0.6 变更摘要（P1 延后项落地，基于外部审计）：① `related` 类型化——`related: [{ id, relation }]`，按 §24 关系模型落地 7 种关系（alternative_to / similar_to / used_with / contains / uses / affects / applies_to），详情页相关概念显示关系标签；② Style 缩略预览规格并入 YAML `preview` 字段（含 `order` 排序），删除 `src/lib/style-thumbs.ts` 第二事实源，缩略图组件只做 renderer，风格列表显示名统一取条目 `name`。

> v0.4 变更摘要（2026-09 开发期）：① 新增灵感图库模块（§43）——AI 生成的设计参考图集 + 可复现生图 Prompt；② 竞品对标改进落地：机器可读层 `/api/concept/*.json` + `llms.txt`、搜索空态引导示例、首页数字概览（详见 `docs/competitor-research.md`）；③ 部署说明 `docs/deploy.md`。
> v0.5 变更摘要（平台收口，基于外部审计）：① 搜索弹窗 Hook 违规修复；② 内容校验器重写（全量加载→统一校验；compare 组 CI 严格）；③ 构建管线统一为 prebuild 链（content:check → api:build → search:build → astro build），YAML 成为唯一事实源；④ CI 增加 astro check + ESLint(react-hooks) + Playwright 搜索闭环 smoke test；⑤ 搜索日志隐私化：只记录无结果/弱命中查询 + PII 清洗 + 30 天 TTL（§9.3）；⑥ Astro 升级 7.x（消除 critical XSS 通告）；⑦ embedding 事实源统一为 multilingual-e5-small（§9.1）；⑧ Prompt 生产方式决策：人工在 YAML 中结构化维护，生成器推迟（§17）；⑨ README + AGPL-3.0 + sitemap/robots；⑩ 全库 YAML 规范化为块样式（消灭 flow mapping 静默拆键缺陷）并修复 196 处历史数据截断。
> v0.3 变更摘要（2026-09 会话确认）：① 站点视觉定调 Editorial Minimal（§42）；② 内容文案定调词典风（§42）；③ Embedding 选型本地 BGE-M3（§9.1）；④ 里程碑定义 M1/M2（§42）；⑤ 内容生产模式 = 主 Agent 建平台与规范 + 子 Agent 并行生产 + CI 把关（§42）。
> v0.2 变更摘要（基于 2026-09 会话确认的决策）：
> ① 搜索方案升级并量化验收（§9）；② 确认 90 条目全量最高质量、首批 5 样板（§25/§26）；③ Prompt 4 层由模板生成（§17）；④ 上线即中英双语（§7a）；⑤ 新增非功能性需求章节（§41）；⑥ 数据 Schema 修订 + CI 校验（§33）；⑦ Motion 播放器全量（§22）；⑧ 随机按钮进 P0（§8/§28）；⑨ 埋点进 P0（§27a）；⑩ 技术栈定 Astro + React Islands。

---

# 1. 产品定义

## 1.1 一句话定义

一个面向中文前端开发者、独立开发者和 AI Coding 用户的：

**前端设计概念百科 + 可交互设计参考库 + Agent Prompt 库。**

帮助用户完成：

**不知道叫什么 → 找到专业名称 → 理解设计类型 → 查看真实效果 → 选择设计方案 → 复制 Prompt / 实现方式 → 交给 Coding Agent 开发。**

---

# 2. 产品要解决的问题

* 知道想要什么效果，但不知道专业名称。
* 知道组件名称，但不知道有哪些设计形式。
* 知道某种视觉风格，但不知道适用于哪些组件。
* 找到好看的截图，但不知道为什么好看。
* 找到组件代码，但不知道它是否适合自己的产品。
* 使用 Codex、Claude Code 等工具时，不知道如何准确描述设计要求。
* AI 能写出功能，但生成出来的页面经常趋同。
* 中文搜索结果大量停留在教程文章，缺少结构化设计知识。

---

# 3. 产品核心价值

不以"收集最多 UI"为目标。核心价值是：

> 建立一套可以被人和 AI 同时理解的前端设计知识结构。

每个设计概念回答五个问题：

1. 这是什么？ 2. 它叫什么？ 3. 它长什么样？ 4. 什么情况下应该使用？ 5. 怎么让开发者或 AI 实现？

---

# 4. 产品定位

| 产品 | 主要解决问题 |
| --- | --- |
| NameThatUI | UI 元素叫什么 |
| LearnUI | 中文/英文 UI 术语学习 |
| Mobbin / Refero | 真实产品怎么设计 |
| Component Gallery | 不同 Design System 如何实现组件 |
| 21st.dev | 找到组件并直接交给 Agent |
| Uiverse | 获取具体前端组件代码 |
| 本项目 | **理解设计概念、发现方案、做设计选择并交给 AI 实现** |

LearnUI 已实现双语 UI 词典、交互 Demo、Style 和 Agent Prompt，本项目不以"NameThatUI 汉化"为竞争方向。21st.dev 已有成熟 Registry、Prompt、CLI 和 MCP，本项目 MVP 不做"大规模组件市场"。

---

# 5. 目标用户

### AI Coding 用户
工具：Codex、Claude Code、Cursor、Windsurf、Lovable、v0。
需求："我知道我要什么感觉，但不知道怎么准确告诉 AI。"

### 前端开发者
能实现代码，但缺少系统设计知识。"这种组件叫什么？""这里除了 Modal 还能怎么做？""这个页面为什么看起来这么像 AI 生成的？"

### 独立开发者
兼任产品 + UI + 前端 + 后端，需要快速完成：参考 → 决策 → 实现。

### UI 初学者
理解 UI 专业术语、常见组件、页面结构、视觉风格、Motion、UX Pattern。

---

# 6. 核心产品模型

五种 Design Object：

- **Component**（§6.1）：Button、Input、Select、Navbar、Sidebar、Breadcrumb、Modal、Toast、Tooltip、Card、Table、Tabs、Pagination、Command Palette……
- **Pattern**（§6.2）：Infinite Scroll、Pagination、Progressive Disclosure、Master Detail、Command Palette、Inline Editing、Optimistic UI、Skeleton Loading、Empty State、Pull to Refresh……回答"这种交互问题可以怎么解决？"
- **Style**（§6.3）：Minimalism、Neobrutalism、Glassmorphism、Skeuomorphism、Flat Design、Swiss Style、Bauhaus、Y2K、Cyberpunk、Memphis、Bento、Editorial、Retro Futurism……回答"页面应该长成什么感觉？"
- **Page**（§6.4）：Landing Page、Dashboard、Login、Signup、Pricing、Settings、Profile、Search、Detail、Checkout、Documentation、Portfolio、SaaS Homepage、Admin Panel……回答"一个完整页面通常应该如何组织？"
- **Motion**（§6.5）：Hover Lift、Hover Glow、Magnetic Button、Press Feedback、Loading、Skeleton、Page Transition、Scroll Reveal、Parallax、Shared Element Transition、Text Reveal、Number Counter、Marquee……回答"用户操作之后界面应该如何反馈？"

---

# 7. 信息架构

```text
Home
├── Discover（Components / Patterns / Styles / Pages / Motion）
├── Components（Navigation / Input / Controls / Data Display / Feedback / Overlay）
├── Patterns（Navigation / Input / Search / Loading / Content / Feedback）
├── Styles
├── Pages
├── Motion
└── Search
```

MVP 不建立社区、商城和复杂账户体系。

---

# 7a. 多语言（v0.2 新增）

- **上线即中英双语**。路由结构第一天就是 i18n：中文为默认语言、URL 无前缀；英文使用 `/en/` 前缀（如 `/en/patterns/skeleton-loading`）。
- **90 个条目上线即全双语**：所有内容字段（含 4 层 Prompt、When/When-Not、Variants 说明）中英双份。
- 双语字段在 Schema 中全部必填（见 §33），由 CI 校验。
- 站点界面 UI 文案（导航、按钮、搜索占位等）同步双语。
- SEO：中文面向中文长尾词（§35），英文页面对应英文关键词；`hreflang` 标注两种语言互为替代。

---

# 8. 首页需求

首页首先解决：**"我不知道该搜什么。"**

## Hero
标题：**前端设计，不知道叫什么？**
搜索框：`搜索组件、页面、设计风格、交互效果……`
支持："Modal"、"弹窗"、"毛玻璃"、"按钮悬浮起来"、"左边有菜单的后台"、"苹果那种透明玻璃效果"、"加载时候灰色一闪一闪"。

## Explore by Type
五大入口：Component / Pattern / Style / Page / Motion。

## Popular Concepts
展示常见设计概念：Command Palette、Glassmorphism、Bento Grid、Skeleton Loading、Neobrutalism、Scroll Reveal。

## Random Discovery（P0）
首页提供**"随便看看"随机按钮**：随机跳转到任一已发布条目（v0.2 明确进 P0）。带过滤的完整随机探索页已于 v0.8 落地（`/explore`：类型筛选 + 打乱顺序 + 随机跳转）。

---

# 9. 搜索系统（v0.2 重写）

搜索是核心闭环（§31）的成败点。**目标不是"能搜"，而是达到 §38 的口语化模糊查询验收。**

## 9.1 检索方案（两层）

1. **基线层**：中英名称 + Alias + Tags + Keywords + Related Terms + Description Keywords 的加权匹配（结构化数据见 §33）。
2. **增强层**：构建时对每个条目的 description + aliases 生成 embedding；运行时对全库（约 90 条）做内存余弦检索。不训练模型、不依赖运行时 LLM，兜住"按钮点下去缩一下"这类与维护词表不重合的口语查询。**选型（v0.5 更正）：本地 transformers.js + Xenova/multilingual-e5-small（q8 量化）**，构建脚本生成索引，无 API key、无持续费用、结果可复现；中英双语。模型仅在关键词弱命中时于浏览器端懒加载（约 27MB WASM），90 条规模下优先做好 alias 运营，语义层贡献待实测后再评估增减。

搜索结果页按五大类型（Component / Pattern / Style / Page / Motion）分组展示。

## 9.2 黄金测试集与验收线

- 把 §38 的 5 个用例扩充为 **20～30 条黄金查询**，存放于仓库（`fixtures/search-golden.*`），每条查询对应期望命中的 concept id 列表。
- CI 跑搜索回归，验收线：**Top-3 命中率 ≥ 80%**。不达标不算 MVP 完成。

## 9.3 查询日志回流

- **只记录无结果 / 弱命中查询**（强命中原文不入库）；客户端与服务端双重 PII 清洗（邮箱、连续数字）；KV 原文保留 30 天，聚合后的 alias 结论长期保存。配合 §27a 埋点，部署在 Cloudflare，用 KV/D1 承载。
- 高频未命中查询定期补充进条目的 aliases / keywords——这是内容运营飞轮的一部分（§32）。

---

# 10. Design Concept 详情页

详情页是网站最核心页面。**实际结构 = 1 个共享骨架 + 5 套类型专属区块（v0.2 明确）**，Component/Pattern 共享度最高，Style / Page / Motion 各有专属区块（见 §20/§21/§22）。

以 Skeleton Loading 为例的共享骨架：

# Skeleton Loading
中文：骨架屏 / 骨架加载　|　分类：Pattern → Loading

## What
100～200 字，避免百科式长文章。

## Live Demo
必须提供真实可运行 Demo：Default / Dark Mode / Loading-Loaded，必要时多个 Variant。Demo 优先使用自己实现的组件。

## Anatomy
适合拆解的组件显示结构（如 Card：① Container ② Header ③ Media ④ Content ⑤ Actions），Hover Anatomy 标签时对应区域高亮。

---

# 11. Variants

展示同一设计对象的不同形式（如 Button：Primary / Secondary / Ghost / Outline / Text / Icon / Floating Action / Split）。

这是区别于普通词典的重要部分：用户不仅知道"它叫 Button"，还知道"Button 有哪些设计方法"。

---

# 12. When to Use

明确适用场景。例：Skeleton 适用于内容加载结构相对稳定、预计加载时间不会特别长的页面。

# 13. When Not to Use

必须提供不推荐场景（重要设计决策层）。例：Skeleton 不适合完全不可预测的内容结构、非常短的瞬时加载、页面结构不变的 后台操作。

---

# 14. Related Concepts

形成知识图谱。例：Skeleton Loading → Spinner、Progress Bar、Shimmer、Placeholder、Optimistic UI、Lazy Loading。关系数据由 CI 校验存在性（§33）。

# 15. Style 应用展示

同一组件可切换设计风格（Button × Minimal / Neobrutalism / Glassmorphism / Retro / Cyberpunk / Y2K），建立 **Component × Style** 关系——本产品重要数据资产之一（Schema 字段 `applicable_styles`）。

# 16. Prompt

每个 Concept 提供适合 Coding Agent 的描述，提供**复制 Prompt**。示例（Skeleton）：

```text
创建一个 Skeleton Loading 组件。用于文章列表加载状态。要求：
- 使用灰色占位块表示内容结构
- 使用轻微 Shimmer 动画
- 保持与最终内容尺寸基本一致
- 支持 Dark Mode
- 尊重 prefers-reduced-motion
- 加载完成后平滑替换为真实内容
```

---

# 17. Prompt 层级（v0.2 修订）

提供 4 层：

- **Basic**：描述设计是什么。
- **Design**：强调视觉要求。
- **Implementation**：强调技术实现。（v0.1 遗漏，v0.2 补上）
- **Agent Task**：可直接提交给 Coding Agent。

```text
在当前项目中实现以下 Skeleton Loading。
先检查现有组件体系和 Design Token，优先复用当前组件。
保持现有项目视觉风格。不要新增不必要依赖。
完成后运行现有检查，并说明修改文件。
```

**生产方式（v0.5 决策）**：4 层 Prompt 作为结构化内容由人工直接维护在各条目 YAML 中（与 description/use_when 同级，同为数据资产），不设生成器。理由：双语 × 4 层的语义质量门槛高，模板生成的口径收益低于人工维护成本；结构化存储已保证机器可读与 CI 校验。若未来条目规模超过 300 条，再评估模板化生成 + 人工审核的流水线。

---

# 18. Implementation

MVP 不定位成大型代码组件市场，提供：

- **CSS Concept**：核心 CSS 思路（transform / box-shadow / transition / backdrop-filter 等）。
- **Implementation Notes**：关键实现机制。
- **Example**：基础 Demo。

第一阶段统一 **React + Tailwind**（已随 §41 技术栈确认），不维护 React / Vue / Svelte / Angular 四套实现。

---

# 19. Compare

允许比较相似概念（Modal vs Drawer vs Popover），按维度展示（打断程度 / 内容容量 / Mobile / 上下文保持）。**MVP 阶段 Compare 数据"适用即做全"（§26 底线之上，见 §25a）；独立 Compare 浏览功能已于 v0.7 落地（`/compare`、`/compare/<group>`，中英双语）。** 数据人工维护，Schema 见 §33 的 `compare` 字段。

# 20. 页面类型详情

Page 不只展示截图。Dashboard 需展示典型结构（Header / Sidebar / KPI Cards / Charts / Table / Filters）及不同结构变体（Sidebar / Top Navigation / Dense / Card / Analytical Dashboard）。**v0.10：每个 page 条目新增 `structure` 字段（部件 + 一句话说明），详情页新增「页面结构」区；与 `anatomy`（Demo 联动高亮标签）、`variants`（结构变体）互补。**

# 21. Style 详情

Style 页面结构：简介、视觉特征、Typography、Color、Border、Shadow、Spacing、Button、Input、Card、Navbar、完整页面 Demo、适合、不适合、容易混淆、相关风格、Prompt。**Style 页面不能只是 Moodboard，必须能指导实际开发。**

# 22. Motion 页面（v0.2 修订）

Motion 必须真实运行，不能静态截图描述动画。**播放器全量能力（v0.2 确认）：Play、Replay、Slow Motion、Before/After 对比。** 运行时契约（v0.5 固化，见 docs/content-guide.md）：所有 Motion Demo 的动画时长写法统一为 `calc(时长 * var(--demo-speed, 1))`；慢速 = 调大系数（1→3）；暂停 = `.motion-paused` 类对全部后代生效；重播 = key 重挂载复位内部状态。

---

# 23. 标签系统

每个 Concept 支持多维标签：Platform（Web / Mobile / Desktop）、Usage（Marketing / Dashboard / E-commerce / Portfolio / SaaS）、Complexity（Basic / Intermediate / Advanced）、Interaction（Static / Hover / Click / Scroll / Drag / Loading）、Style（Minimal / Bold / Playful / Professional / Experimental）。

# 24. 内容关系模型

```text
Component → Variants / Applicable Styles / Related Patterns
Page → Contains Components / Uses Patterns
Style → Affects Components
Motion → Applies To Components
```

最终形成前端设计知识图谱。所有关系 id 由 CI 校验（§33）。

**类型化边（v0.6）**：每条 `related` 边带 `relation` 标签，取值：

| relation | 含义 | 判定规则 |
| --- | --- | --- |
| `alternative_to` | 同类可替代 | 双方同属一个 `compare.group`（可跨类型） |
| `contains` | 页面包含组件 | pages → components |
| `uses` | 页面使用交互模式 | pages → patterns |
| `affects` | 风格影响组件 | styles → components |
| `applies_to` | 动效应用于组件 | motion → components |
| `similar_to` | 同类相近 | 同类型且无共同 compare 组 |
| `used_with` | 跨类搭配 | 其余跨类型关系 |

---

# 25. MVP 范围（v0.2 修订）

| 类型 | 数量 |
| --- | --- |
| Components | 30 |
| Patterns | 15 |
| Styles | 15 |
| Pages | 10 |
| Motion | 20 |
| **合计** | **约 90** |

**质量原则（v0.2 确认）**：工作量不是决策因子。90 个条目全部按 §26 完整标准做到最高质量，分批上线；§26 是底线不是上限——适用条目做到全深度（Anatomy、Compare 数据、Component × Style 应用）。

## 25a. 首批样板条目

首批 5 个端到端样板（即 §38 验收概念），用于打通全流程并反推生产流水线：

1. Skeleton Loading（Pattern）
2. Press Feedback（Motion）
3. Command Palette（Component / Pattern）
4. Sidebar（Component）
5. Hover Lift（Motion）

---

# 26. MVP 每个 Concept 最低内容标准

```text
中文名称 / 英文名称 / Aliases / 分类 / 一句话定义 / 说明
Live Demo / Variants / 适用场景 / 不适用场景
相关 Concept / Tags
Basic Prompt / Design Prompt / Implementation Prompt / Agent Prompt
Sources（引用来源，v0.2 新增必填）
```

缺少这些内容的条目不进入正式内容库（由 CI 自动校验，见 §33）。内容为原创，引用以 `sources` 字段落库并在详情页外链，不复制正文。

---

# 27. MVP P0 功能

```text
首页 / 全文搜索（§9 两层方案）/ 五大分类
Concept 列表 / Concept 详情页（1 + 5 模板）
Live Demo / Variants / Related Concepts
中英文名称 / Tags / Prompt Copy（4 层）
i18n 双语路由（§7a）/ Dark Mode / Responsive
"随便看看"随机按钮（§8）
Motion 播放器（Play / Replay / Slow Motion / Before-After）
埋点（§27a）/ SEO 基础（每条目独立可索引页 + hreflang）
```

## 27a. 埋点与度量（v0.2 新增）

§37 的指标要求 P0 具备埋点。实现：**Umami 自定义事件**，搜索查询原文经 Cloudflare KV/D1 落库（§9.3）。事件清单：

- 搜索（含查询原文、结果点击）
- Concept 浏览、Related 点击
- Demo 交互、Motion 播放器操作
- Prompt 复制（含层级：basic / design / implementation / agent）

匿名 ID 即可，不采集个人信息。

# 28. P1

P1 项已全部落地：
- Concept Compare 独立浏览页（v0.7，见 §19）
- 带过滤的随机探索页（v0.8，见 §8）
- 收藏 / 浏览历史（v0.10，localStorage，`/saved`）
- 高级 Filter（v0.10，类型列表页文本 + category 筛选）
- Prompt Builder（v0.10，概念 × 风格组合，详情页）
- 页面结构拆解深化（v0.10，见 §20）

# 29. P2

自然语言 AI 搜索（升级版）/ 上传截图识别 UI / 图片 → Design Concept / MCP Server / Agent Skill / CLI / Figma Plugin / VS Code Plugin / 社区投稿 / 个人设计收藏库。

# 30. 明确不进入 MVP 的东西

社区、评论、点赞、用户上传组件、组件商城、付费订阅、复杂账户系统、大量真实产品截图抓取（含爬取 Mobbin / Refero）、1000+ UI 数据库、多框架代码实现、AI 自动生成所有内容、MCP。这些功能都不能帮助验证最核心的产品假设。

---

# 31. 产品核心闭环

```text
不知道怎么描述 → 搜索 → 找到 Design Concept → 理解是什么
→ 浏览 Variants → 选择设计方向 → Live Demo 验证
→ 复制 Prompt → 交给 Agent → 实现
```

如果用户只是"打开网站 → 看几张漂亮图片 → 离开"，则产品没有建立真正价值。

# 32. 内容生产策略

**结构化人工策展 + AI 辅助整理 + 人工审核。**

内容参考来源：W3C / ARIA、Material Design、Apple HIG、Microsoft Fluent、Shopify Polaris、Atlassian Design System、Carbon、shadcn/ui、Radix、Tailwind 及各类公开 Design System（Component Gallery 已证明横向整理 95 个 Design System 的参考价值）。

本站不直接复制正文，主要提取标准名称、设计关系和自己的解释，并以 `sources` 链接原始资料（§26）。

**查询日志回流（v0.2）**：搜索日志中的高频未命中查询定期补进 aliases / keywords（§9.3），作为内容运营飞轮。

---

# 33. 数据结构（v0.2 修订）

所有页面由结构化数据生成，不建 CMS。内容格式：**YAML + Zod Schema 校验**（Astro Content Collections），双语字段全部必填。

```yaml
id: skeleton-loading            # = URL slug，稳定，全库唯一；改名需维护 301 重定向表
type: pattern
status: published               # draft | published（审核流）

name:
  en: Skeleton Loading
  zh: 骨架屏

aliases:
  - Skeleton
  - 骨架加载
  - 内容占位
  - 灰色占位                     # 允许收录口语描述，服务搜索

category: [Feedback, Loading]

description:
  zh: >
    用与内容结构一致的灰色占位块表示加载状态……
  en: >
    Grey placeholder blocks that mirror the content structure while loading…

use_when:
  - { zh: 内容结构相对稳定, en: Content structure is stable }
avoid_when:
  - { zh: 瞬时加载（< 300ms）, en: Instant loads (< 300ms) }

tags: [loading, animation, feedback]

variants:
  - id: static
    name: { en: Static, zh: 静态占位 }
  - id: shimmer
    name: { en: Shimmer, zh: 微光扫过 }

anatomy: [container, header, media]      # 可空

api: [<progress>, role="progressbar"]    # 可选：Web 平台 API 符号（元素 / role / 属性），组件类建议给

applicable_styles: [minimal, bento]      # Component × Style
applicable_components: []
applicable_pages: []

related:                                  # 类型化边（PRD §24）
  - id: loading-spinner
    relation: alternative_to
  - id: progress-bar
    relation: alternative_to
  - id: optimistic-ui
    relation: similar_to
  - id: lazy-loading
    relation: similar_to

compare:                                  # 可空；独立浏览页 P1
  group: loading-indicator                # 比较组，组内共享维度定义
  dimensions:
    打断程度: { zh: 低, en: Low }

demo:                                     # 指向仓库内已注册的 Demo 组件
  component: SkeletonDemo
  modes: [default, dark, loading]

sources:                                  # 必填
  - name: Material Design
    url: https://m3.material.io/

prompts:                                  # 模板生成 + 人工审核（§17）
  basic: { zh: "", en: "" }
  design: { zh: "", en: "" }
  implementation: { zh: "", en: "" }
  agent: { zh: "", en: "" }
```

## CI 校验规则

1. `related` / `applicable_*` / `compare.group` 引用的 id 或组必须存在；`related` 的 `relation` 必须是 §24 定义的枚举值；
2. §26 必填字段（含 `sources`、4 层双语 `prompts`）齐全，否则构建失败——"不进入正式内容库"自动化；
3. `id` 全库唯一且符合 slug 规则；
4. 黄金测试集搜索回归通过（Top-3 命中率 ≥ 80%）。

---

# 34. 内容 URL（v0.2 修订）

URL 清晰、稳定、可分享：

```text
/components/button          /components/command-palette
/patterns/skeleton-loading  /styles/neobrutalism
/pages/dashboard            /motion/hover-lift
```

- slug 一律英文；中文为默认语言无前缀，英文 `/en/` 前缀（§7a）。
- 中文长尾 SEO 由页面 `<title>` / H1 / description 承载，不靠中文 slug。
- slug 稳定；确需改名时维护 301 重定向表（CI 校验项）。

---

# 35. SEO

天然适合 Long Tail SEO。目标搜索词：

```text
骨架屏是什么 / 网页侧边栏叫什么 / 毛玻璃 UI / Bento Grid 是什么
Modal 和 Drawer 区别 / Button 有哪些类型 / 网页设计风格有哪些
Hover 动效有哪些 / Dashboard 布局有哪些 / 前端 UI 组件名称
```

每个 Concept 对应一个独立可索引页面；中英页面互挂 `hreflang`（§7a）。

---

# 36. 产品差异化

四层能力：

1. **Name**：这东西叫什么？
2. **Understand**：它是什么？
3. **Choose**：什么时候应该使用？还有哪些选择？
4. **Build**：怎么让开发者 / AI 实现？

核心护城河不是 Demo 本身，而是：

> **设计概念之间的结构化关系。**

```text
Concept Graph + Chinese Terminology + Decision Knowledge
+ Runnable Example + Agent Context
```

（LLM 本身也在成为"问 UI 叫什么"的入口，本项目的回答正是：结构化 + 可运行 + 可复制 Prompt。）

---

# 37. 成功指标

核心指标：Search → Concept CTR / Concept → Related CTR / Prompt Copy Rate / Demo Interaction Rate / Return Rate。

最重要的验证信号：**用户开始把网站当"前端设计词典 / 设计决策工具"使用。**

（事件采集方案见 §27a；P0 上线即埋点，否则 MVP 无法评估。）

---

# 38. MVP 验收标准

用户能够输入中文模糊描述：

```text
按钮点下去缩一下      → Press Feedback
加载的时候灰色占位    → Skeleton Loading
Mac 那种快捷搜索框    → Command Palette
网页左边固定菜单      → Sidebar
卡片鼠标放上去浮起来  → Hover Lift
```

**验收机制（v0.2）**：以上用例扩充为 20～30 条黄金测试集进仓库，CI 回归，Top-3 命中率 ≥ 80%（§9.2）。

用户进入页面后：可以看到效果、理解概念、查看替代方案、复制 Prompt、交给 Coding Agent。整个流程不依赖用户掌握 UI 专业术语。

---

# 39. 最重要的产品原则

- **不是图库**：每条内容必须提供知识。
- **不是组件市场**：核心不是安装组件，而是帮助选择设计。
- **不是 UI 教科书**：信息必须短、可视化、可操作。
- **Demo 优于截图**：可以运行的东西尽量不用静态图解释。
- **关系优于数量**：100 个互相关联的 Concept 比 5000 个孤立截图更有价值。
- **决策优于灵感**：告诉用户"这是什么、为什么这么设计、什么时候应该使用"。
- **Agent-ready**：所有知识最终能转换成结构化上下文供 Coding Agent 使用；但 Agent 能力建立在知识库之上，而不是反过来。

---

# 40. 产品长期形态

长期从 **Frontend Design Atlas** 演化为：

```text
Human → Design Atlas → Design Knowledge Graph → Agent → Code
```

届时 MCP 的核心能力不是"给 Agent 一个 Button"，而是：

```text
search_design_concept()  compare_patterns()      get_component_variants()
get_style_guidelines()   get_page_structure()    get_motion_pattern()
get_agent_prompt()
```

让 Coding Agent 在写代码之前先拥有一层结构化设计知识。

---

# 41. 非功能性需求（v0.2 新增）

## 技术栈（已确认）
- **Astro + React Islands**：内容页默认纯静态，Demo / Motion 播放器按需水合 React 岛。
- 内容：**YAML + Zod Schema**（Astro Content Collections）。
- Demo：统一 **React + Tailwind**（§18）。

## 可访问性（全站内容标准）
本站教别人做 UI，自己必须示范：所有 Demo 尊重 `prefers-reduced-motion`、键盘可达、对比度达标。该标准同时写进每条目的 Prompt 生成模板（§17）。

## 部署与基础设施（已确认）
- **Cloudflare Pages**：Astro 零配置；后续搜索查询日志用 CF KV/D1 承载（§9.3），不额外购服务。
- **Umami** 埋点（§27a）。
- 纯静态 + 按需水合，性能目标：内容页静态直出，交互岛不阻塞首屏。

## 版本管理
本文档（`docs/PRD.md`）为产品事实唯一权威来源；演进历史由 Git 承担，文档只表达当前有效状态。

---

# 42. 设计基调与生产模式（v0.3 新增）

## 42.1 站点视觉：Editorial Minimal
- 大量留白、强排版层级，中文衬线标题 + 无衬线正文，黑白灰为主 + 单一强调色。
- 浅色为默认主题，Dark Mode 完整支持。
- 理由：产品承接中文长尾搜索来的大众用户，可读性与可信度是第一印象。

## 42.2 内容文案：词典风
- 短句、判断明确（"用于…不用于…"），零铺垫，服务 §39"决策优于灵感"。
- 例外：`aliases` 与示例查询自由收录口语——那是搜索语料，不是阅读文本。
- 双语口吻一致：英文同为词典风。

## 42.3 里程碑
- **M1（竖井）**：站点框架（五大分类页、i18n 路由、两层搜索、埋点、CI 校验、Motion 播放器）+ 首批 5 样板条目全流程走通，部署 Cloudflare Pages 可访问；黄金测试集先覆盖 5 条。
- **M2 起（横扩）**：用验证过的流水线批量生产剩余 85 条，每批 CI 回归；随后竞品对标（NameThatUI / Mobbin / Component Gallery / 21st.dev 等）取长补短，补全缺失的风格与元素类型条目。

## 42.4 内容生产模式
- 主 Agent 负责平台、Schema 规范、质检清单与首批样板；
- 批量条目由子 Agent 按生产规范并行生产，产物经主 Agent 审核 + CI 校验进主干；
- 生产规范为仓库内文档（`docs/content-guide.md`），是内部生产资产。


---

# 43. 灵感图库模块（v0.4 新增）

定位：存放**用来生成设计参考图的 skill / prompt**，以及用这些 prompt 产出的成套参考图片。它是"概念词条"的姊妹资产：词条教"怎么做"，图库展示"长什么样"并提供复现手段。

## 43.1 内容模型

- 每个条目 = 一套图集（同一组件主题、同一 prompt 模板生成的 8 张编号海报）：
  - 双语名称 / 描述 / aliases（进搜索）
  - `images[]`：每张图的双语标题 + 文件路径（`/images/gallery/<slug>/<n>.webp`，构建时由原始 PNG 压缩转制）
  - `prompt`：中英双份生图 Prompt，可直接复制到即梦 / Midjourney / DALL-E 等；模板中仅「编号 + 主题」变化，保证整套风格统一
  - `tips`：使用该 prompt 的经验（如"浮层组件必须要求展开态"）
  - `related_component`：链接到对应概念词条
- 图集来源：个人收集的前端设计参考图集（导航栏 / 菜单和下拉框 / 输入框 / tab:segmented control / 搜索框，共 40 张）。原图不入库，入库的是压缩 webp。

## 43.2 页面与集成

- `/gallery` 列表页 + `/gallery/<id>` 详情页（中英双语路由）；prompt 一键复制并计入埋点（`layer: image`）。
- 详情页图集支持点击看原图；顶部 prompt 区中英两份。
- 图库条目进入全站搜索（类型分组新增"灵感图库 / Gallery"）。
- 导航新增"图库"入口；概念详情页可通过 `related_component` 反向关联（词条 → 图库链接在图库侧维护）。

## 43.3 扩展约定

- 新增图集：补一个 `src/content/gallery/<id>.yaml` + `public/images/gallery/<id>/` 图片目录即可，Schema 校验与搜索集成自动生效。
- Prompt 模板原则：固定版式描述（背景色、标题结构、5 条目网格、关键词格式），只把"编号 / 主题 / 模式名清单"作为变量——这是整套图风格一致的关键。
