# 界面图谱 · Interface Atlas

**前端设计概念百科 · 可交互设计参考库 · Agent Prompt 库**

帮助前端开发者、独立开发者和 AI Coding 用户完成：

> 不知道叫什么 → 找到专业名称 → 理解设计类型 → 查看真实效果 → 选择设计方案 → 复制 Prompt → 交给 Coding Agent

## 这是什么

- **风格**（18）：Editorial Minimal 站点本身 + 18 种视觉语言的完整迷你网页示范
- **组件**（36）：每个概念带可交互 Live Demo、Variants、Anatomy
- **交互模式**（15）：解决某类交互问题的方法
- **动效**（20）：真实可运行，带播放器（Play / Replay / Slow Motion / Before-After）
- **页面**（10）：页面类型的结构拆解与布局变体
- **灵感图库**（5 套 / 40 张）：AI 生成的设计参考图集，每套附可复现的生图 Prompt

组件详情增加交互任务与使用检查点；演示区支持重置、窄屏预览、模式切换与结构高亮，并可直接浏览对应参考图集。

新增组件：分段控制器、步骤条、可搜索选择框、文件上传区、评分、时间线。新增风格：有机自然、装饰艺术、新拟态。

每个 Concept 都包含：中英双语名称 / Aliases（含口语描述）/ 定义 / When to Use / **When NOT to Use** / Variants / Related / Compare / 实现要点 / 4 层 Agent Prompt / 参考来源。

面向 AI 的机器可读层：`/api/concept/<type>/<id>.json` + [`/llms.txt`](public/llms.txt)。

## 搜索

口语化模糊查询是第一公民：

```text
"加载的时候灰色一闪一闪"  → 骨架屏 Skeleton Loading
"Mac 那种快捷搜索框"      → Command Palette
"卡片鼠标放上去浮起来"    → Hover Lift
```

关键词/Alias/Tags/正文加权匹配，构建时生成约 80 KB 的静态索引，无运行时模型、无 API 依赖。
30 条黄金查询回归测试，验收线 Top-3 命中率 ≥ 80%（`npm run search:test`）。

## 开发

```bash
npm install
npm run dev          # 本地开发
npm run build        # 全量管线：content:check → api:build → search:build → astro build
npm run check        # astro check
npm run lint         # eslint（含 react-hooks 规则）
npm run test:smoke   # Playwright 搜索闭环 smoke test
npm run search:test  # 黄金查询回归
npm run content:check # 内容校验（引用完整性 / 双语必填 / compare 组）
npm run gen:registry # 重新生成 Demo 注册表
```

内容生产规范见 [docs/content-guide.md](docs/content-guide.md)；产品定义见 [docs/PRD.md](docs/PRD.md)；部署（Cloudflare Pages）见 [docs/deploy.md](docs/deploy.md)。

## License

[AGPL-3.0](LICENSE)。商业授权请联系作者。
