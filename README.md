# 界面图谱 · Interface Atlas

**前端设计概念百科 · 可交互的设计参考库 · 面向 AI Coding 的 Prompt 库**

> 不知道叫什么 → 找到专业名称 → 看懂设计类型 → 亲手试效果 → 选定方案 → 复制 Prompt → 交给 Coding Agent

在线站点：<https://gongfpp.github.io/interface-atlas-web/>

界面图谱把「视觉风格、组件、交互模式、动效、页面、设计基础、无障碍」这些前端设计里天天遇到、却常常叫不出名字的东西，整理成一套可检索、可交互、可交给 AI 的参考库。它不教你某个框架怎么用，而是帮你和你的 AI 助手先在同一套词汇上对齐。

## 它解决什么问题

- **叫不出名字**：用口语描述就能找到专业术语（「加载的时候灰色一闪一闪」→ 骨架屏 Skeleton Loading）。
- **看不到效果**：每个概念都有真实可运行的 Live Demo，而不是截图或 GIF。
- **不知道何时不该用**：每个条目都有 When to Use 与 When NOT to Use、易混淆概念辨析。
- **不知道怎么交给 AI**：每个条目带 4 层可直接复制的 Prompt，另附机器可读 JSON / Markdown。

## 内容规模

| 分区 | 数量 | 内容 |
| --- | --- | --- |
| 风格 Styles | 24 | 每种视觉语言的完整迷你网页示范（可运行） |
| 组件 Components | 46 | Live Demo、Variants、Anatomy、多框架命名对照 |
| 交互模式 Patterns | 21 | 解决某类交互问题的方法与取舍 |
| 动效 Motion | 23 | 真实运行，带播放器（播放 / 重播 / 慢速 / 前后对比） |
| 页面 Pages | 10 | 页面类型的结构拆解与布局变体 |
| 基础 Foundation | 8 | 字号、字体栈、行高、行宽、调色板、语义色、对比度、层级 |
| 无障碍 A11y | 6 | 焦点环、跳过链接、减弱动效、键盘导航、实时区域、替代文本 |
| 灵感图库 Gallery | 5 套 / 40 张 | AI 生成的设计参考图集，每套附可复现的生图 Prompt |

每个概念条目包含：中英双语名称 / Aliases（含口语描述）/ 定义 / When to Use / When NOT to Use / Variants / Related / Compare / 实现要点 / 4 层 Agent Prompt / 参考来源。

## 核心能力

- **口语化搜索**：「骨架屏」「卡片鼠标放上去浮起来」「Mac 那种快捷搜索框」都能命中；关键词 / Alias / Tags / 正文加权匹配，构建时生成静态索引，无运行时模型、无 API 依赖。
- **交互实验室**：详情页可以切换形态、预览窄屏、重置、高亮结构拆解；动效页自带播放器。
- **面向 AI 的机器可读层**：`/api/concept/<type>/<id>.json`、全库打包 `/api/terms.json`、`/llms.txt`、`/llms-full.txt`，以及每页的 `/<type>/<id>.md` Markdown 镜像。
- **双语**：中文为默认，英文在 `/en/` 下完整镜像。

## 技术栈

Astro（静态输出）+ React Islands + Tailwind CSS v4 + TypeScript。无后端、无数据库，可部署到任意静态托管；评论走 giscus（GitHub Discussions）。

## 快速开始

```bash
npm install
npm run dev            # 本地开发
npm run build          # 全量管线：content:check → api:build → search:build → astro build
npm run preview        # 预览构建产物
```

### 校验与测试

```bash
npm run content:check  # 内容校验：引用完整性 / 双语必填 / compare 组
npm run check          # astro check（类型）
npm run lint           # eslint（含 react-hooks 规则）
npm run test:smoke     # Playwright：搜索闭环 / 各页无横向溢出 / 无障碍
npm run search:test    # 黄金查询回归（Top-3 命中率 ≥ 80%）
npm run gen:registry   # 新增 Demo 后重新生成 Demo 注册表
```

## 项目结构

```text
src/
  content/          # 全部内容条目（YAML，按类型分目录），内容即数据
  islands/          # React 交互岛（搜索、Prompt、Demo）
  components/       # Astro 组件与页面区块
  pages/            # 文件路由（zh 无前缀，en 在 /en 下）
  layouts/          # BaseLayout
  lib/              # 搜索、i18n、内容读取
  styles/           # Tailwind v4 主题令牌与全局样式
scripts/            # 内容校验、API 层、搜索索引、注册表生成
docs/               # PRD / 内容生产规范 / 部署说明 / 竞品调研
public/             # 静态资源、生成好的 API 与 llms 文本
```

## 参与贡献

内容条目规范见 [docs/content-guide.md](docs/content-guide.md)；产品定义见 [docs/PRD.md](docs/PRD.md)。新增一个概念通常只需要：写一个 `src/content/<type>/<id>.yaml`，配一个同名的 `src/islands/demos/<id>.tsx`，然后 `npm run gen:registry` 并跑一次 `npm run content:check`。

## License

[AGPL-3.0](LICENSE)。如需商业授权请联系作者。
