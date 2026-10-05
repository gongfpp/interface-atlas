# 私有浏览器验收

该隔离 QA 分支基于 `3a4a5e087d6a740cc63df3db18a66a50aad68ee2`。不修改 main、原任务分支或公开站点。

## 执行与证据

- `node scripts/verify-private-qa.mjs` 验证工作流保护和全部测试文件的请求隔离入口。
- 常规门禁：unit、Astro check、lint、完整 build、search:test。
- `npx playwright test --config=playwright.private-qa.config.mjs` 执行 Chromium 测试。
- 完整门禁前，一个按钮计时场景与全部 16 个 Tooltip 桌面交错事件场景各独立重复五次，共 85 次；重试仍为零。测试仅修正时钟和指针位置假设，保留原有行为断言，并在 2.5 秒上限内观察原生滚动/实际几何停止，再确认移入提示前内容完全处于视口中。重复回归结果单独保存，不混入全量计数。
- 46 个组件的八套样式均覆盖中文 / 英文 × 390 / 1280 像素，共 1,472 次样式选择检查。
- 按钮、输入框、卡片、提示的每套样式均保存四种语言/宽度组合的成功截图，共计划 128 张；截图文件名标识组件、风格、语言和宽度。
- 按钮、输入框和卡片的行为回归同样扩展至四种组合；提示保留鼠标、键盘和触屏模拟检查。
- 窄屏页头另测收藏、撤销及存储失败提示；布局几何报告区分页面溢出与合法的内部滚动容器。
- 报告中“收集到测试”不代表实际执行；截图已产生也不代表完成视觉人工审阅。

Actions artifact 名称包含运行提交 SHA。`commit.txt`、`tree.txt`、`parents.txt`、浏览器报告与截图哈希记录同一次运行的来源。报告、截图和失败 trace 只保存在当前私有仓库的七天期 artifact 中，不进入公开构建仓库。

## 发布保护

仅精确 QA 分支的 push 运行本工作流，job 再次核验私有仓库与分支。令牌仅有 contents: read，checkout 不持久化凭据。两个部署工作流的全部 job 显式关闭。本分支的隔离工作流不可直接合并到生产。

构建关闭分析和日志上报；测试 fixture 阻断非本地浏览器请求。失败注入使用 route.fallback 保留 allowlist，APIRequestContext 检查只允许本地目标并禁用重定向。不测试留言提交或登录。

本验收不包含真实 iOS/Android 硬件、WebKit/Firefox、第三方留言服务、公开部署或发布后验证。

玻璃按钮的文字使用不透明深色，针对配置中的全部渐变色标保留至少 4.5:1 的静态配色回归，并在双语、两种宽度的浏览器检查中核验实际前景色。此项修复不改变玻璃材质、布局或演示计时；它不是全站 WCAG 合规声明。判定依据：[W3C Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)。
