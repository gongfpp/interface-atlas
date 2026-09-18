# 竞品对标研究（2026-09-17）

> 调研对象：NameThatUI、Learn UI Name（learnui.qiaomu.ai）、Component Gallery、21st.dev、Mobbin（未抓到，以公开常识补充）。
> 结论去向：值得抄的进「改进清单」，本项目已有优势进「保持项」。供 PRD 后续版本引用。

## 1. 各家亮点（值得借鉴）

### NameThatUI（76 元素，Web/macOS）
- **口语描述 → 名称 → API 符号 → 粘贴即用 Prompt** 整条链路——与我们 §38 验收同构，但它每个条目给 **API 符号**（`NSPopover`、`role="combobox"`）。
- **易混淆对比条目**：Modal vs Drawer vs Sheet、Skeleton vs Spinner 作为独立内容类型。
- 搜索失败时给「怎么描述」的引导示例。

### Learn UI Name（界面叫啥，62 元素）
- **双击查词**：站内任意英文单词双击出释义。
- 词条卡片 = 可视化示例（纯 HTML/CSS 渲染）+ 技术名/关键词 + 一句解释。
- **Quiz 测验板块**：用测验巩固术语记忆——低成本高传播。
- 搜索不到时用示例教用户描述（「三个点的菜单」「红绿灯」）。
- Guides 解决「起名前」的决策（原生 vs Web、AppKit vs SwiftUI）。

### Component Gallery（60 组件 × 95 设计系统）
- **横向对比是核心资产**：同一组件在不同设计系统中的实现并列展示。
- 首页顶部的 **数字概览**（60 components, 95 design systems, 2,671 examples）。
- 诚实标注：连 "Accessibility issues" 都列出。
- 技术栈标注（React / Web Components / Tailwind）。

### 21st.dev
- **两条交付路径**：CLI 一键安装 **或** Copy prompt 交给 Agent——我们已经只有后者，前者不在 MVP 范围（正确）。
- **Agent-ready 的机器可读层**：每页可加 `.md` 后缀拿 markdown 版、llms.txt、OpenAPI、agent skills。**这个值得 MVP 后立刻抄**——本站所有 YAML 本来就是结构化数据，加一条 `/api/concept/<id>.json` 路由成本极低。
- 开放发布 + 署名。

## 2. 我们已领先的部分（保持，不折腾）

- 双语深度（中英全字段 vs 他们的英文为主/仅术语对照）。
- Decision 层（When/When-Not + Compare 数据）——竞品都没有成体系。
- Motion 全量可运行 + 播放器——竞品用静态图或 GIF。
- 五大类型含 Page 与 Style 的结构化拆解（Typography/Color/Border…）。

## 3. 改进清单（按成本排序，P0/P1 内可消化）

| # | 改进 | 来源 | 成本 |
|---|------|------|------|
| 1 | **API 符号字段**：条目加 `api` 字段（`<dialog>`、`role="combobox"`、`aria-expanded`），详情页展示，进入 agent prompt | NameThatUI | 低——Schema 加可选字段 |
| 2 | **机器可读层**：每条目 `/api/concept/<id>.json`（构建时生成）+ `/llms.txt` 索引 | 21st.dev | 低——YAML 已有 |
| 3 | **易混淆对比页**：`/compare/<group>` 独立路由，从 compare.group 数据生成 | NameThatUI | 中——数据已有（§19 P1 提前部分实现）|
| 4 | **搜索失败引导**：结果为空时展示示例查询按钮（「三个点的菜单」）| LN / NameThatUI | 低 |
| 5 | **首页数字概览**：N concepts · M demos · 双语 | Component Gallery | 低 |
| 6 | **Quiz 模式**（P2 候选）：术语测验 | Learn UI Name | 中 |
| 7 | **双击查词**（P2 候选） | Learn UI Name | 中 |

**落地状态（2026-09，PRD v0.7）**：#2 机器可读层、#4 搜索失败引导、#5 首页数字概览、#3 易混淆对比独立页（`/compare`、`/compare/<group>`）均已落地；#1 `api` 符号字段目前只以 `implementation.notes` 文字形式存在，未做结构化字段；#6 Quiz、#7 双击查词为 P2 候选，未做。

## 4. 补条目决策（结合研究）

- 风格清单原 15 个已含 Claymorphism/Aurora（较新）。研究确认无重大缺口，**保留 15**。
- **新增 1 个高价值对比条目**：`empty-state` 已在清单；补 `cookie-consent`？否——超范围。**结论：不扩量，把 90 做全做透**。
