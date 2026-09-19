# 部署说明

## GitHub Pages（当前默认，已启用）

站点：**https://gongfpp.github.io/interface-atlas/**（项目站点，挂在子路径 `/interface-atlas/`）

- 由 `.github/workflows/deploy-pages.yml` 在 push 到 `main` 时自动构建并发布。
- 构建命令 `npm run build:fast`（复用已提交的关键词搜索索引，无需在 CI 生成），并注入：
  - `PUBLIC_SITE_URL=https://gongfpp.github.io`
  - `PUBLIC_BASE_PATH=/interface-atlas`（所有站内链接/资源/robots/sitemap/canonical 都会带此前缀）
  - `PUBLIC_LOG_API=off`（GitHub Pages 无 Functions/KV，关闭查询落库，避免 404）
- 手动触发：Actions → Deploy to GitHub Pages → Run workflow。
- Pages 设置：Settings → Pages → Source = **GitHub Actions**（本会话已通过 API 设为 workflow 构建）。

> 若改用自定义域名：把 `PUBLIC_BASE_PATH` 改为 `/`、`PUBLIC_SITE_URL` 改为该域名即可（并在 Pages 里配自定义域）。根部署时 `base` 为空，行为与旧版一致。

> GitHub Pages 不运行 `functions/`（Cloudflare Functions），故 `PUBLIC_LOG_API=off`。

### GitHub Pages 访客统计

Actions 构建的站点，analytics 变量要配在仓库 **Settings → Secrets and variables → Actions → Variables**（不是 Pages 设置），由 `deploy-pages.yml` 注入构建：

- `PUBLIC_UMAMI_SRC`：Umami 脚本地址，如 `https://cloud.umami.is/script.js`（Umami Cloud）或自建实例 `https://umami.example.com/script.js`
- `PUBLIC_UMAMI_ID`：Umami 网站 ID
- 可选 `PUBLIC_CF_BEACON_TOKEN`：Cloudflare Web Analytics token（支持非 Cloudflare 站点，无 cookie）

配好后重新运行 “Deploy to GitHub Pages” 工作流即可生效；未配置则自动跳过。站内已内置无 PII 事件：`search-miss`、`prompt-copy`、`prompt-builder-copy`。
命令行设置：`gh variable set PUBLIC_UMAMI_SRC --body '…'`、`gh variable set PUBLIC_UMAMI_ID --body '…'`。

## Cloudflare Pages（可选）

### 构建配置

- Framework preset: **Astro**
- Build command: `npm run build:fast`
  （= api:build + astro build。关键词搜索索引 public/data/search-docs.json 已提交入库，
  内容更新时由本地/CI 的完整管线刷新）
- Build output: `dist`
- Node version: 22（环境变量 `NODE_VERSION=22`）
- `PUBLIC_BASE_PATH` 留空（根部署，base 为空）；`PUBLIC_SITE_URL` 设为 CF 分配/自定义域名
- `PUBLIC_LOG_API` 保持默认（启用 `/api/log-*`，需 KV 绑定）

### KV 绑定（搜索查询日志，PRD §9.3）

1. Dashboard → Workers & Pages → KV → Create namespace：`SEARCH_LOG`
2. Pages 项目 → Settings → Functions → KV namespace bindings：
   - Variable name: `SEARCH_LOG`
   - Namespace: 上一步创建的
3. Functions 路由已内置：`functions/api/log-search.js`、`functions/api/log-prompt.js`（部署后自动生效；未绑定 KV 时静默丢弃）

### Umami 埋点（PRD §27a）

环境变量（Settings → Environment variables）：

- `PUBLIC_UMAMI_SRC`: 如 `https://analytics.example.com/script.js`
- `PUBLIC_UMAMI_ID`: Umami 网站 ID

两个都配置后，BaseLayout 自动注入脚本。自定义事件（搜索、Prompt 复制）已通过 `/api/log-*` + sendBeacon 上报，不依赖 Umami 特殊配置。
配置 Umami 后，站内还会上报两个无 PII 的聚合事件：`search-miss`（弱命中/无结果次数）、`prompt-copy`（概念 + 层级）。

### 访客统计（Cloudflare Web Analytics）

不需要第三方账号，随 CF Pages 一起用：

1. Cloudflare Dashboard → Analytics & Logs → Web Analytics → Add a site（选择 Pages 项目域名）。
2. 复制得到的 **Beacon token**。
3. Pages 项目 → Settings → Environment variables 增加：
   - `PUBLIC_CF_BEACON_TOKEN`: 上一步的 token
4. 重新部署后，BaseLayout 注入无 cookie 的 `beacon.min.js`；访客数/浏览量在 CF Web Analytics 面板查看。

> 该统计不使用 cookie、不采集个人信息，符合 PRD 隐私约定。

## 站点域名与子路径

- `PUBLIC_SITE_URL`（如 `https://your-domain.com`）决定 canonical / sitemap / hreflang；不设置时回落到 `https://interface-atlas.dev`。
- `PUBLIC_BASE_PATH`（如 `/interface-atlas`）决定部署子路径；根部署留空。所有站内链接、资源、robots、sitemap、`/api/*.json`、`llms.txt` 都会自动带上该前缀。

### 自定义命令行部署（Cloudflare Pages，可选）

```bash
npx wrangler pages deploy dist --project-name=interface-atlas
```
