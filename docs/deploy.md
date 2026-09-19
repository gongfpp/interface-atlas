# 部署说明

## GitHub Pages（当前默认，已启用）

公开站点：**https://gongfpp.github.io/interface-atlas-web/**（项目站点，挂在子路径 `/interface-atlas-web/`）

源代码仓库 `gongfpp/interface-atlas` 为 **private**，只保存源码与 CI；对外发布走公开的构建仓库 `gongfpp/interface-atlas-web`（与 `Iscream` → `Iscream-web` 同一模式）：

- 源仓库 `.github/workflows/deploy-web.yml` 在 push 到 `main` 时构建，再把 `dist/` 强制 push 到公开仓库的 `main` 分支。
- 跨仓库推送用 SSH Deploy Key：公开仓库 Settings → Deploy keys 加一把可写 key（title `interface-atlas-deploy`）；私钥存源仓库 Secret `WEB_DEPLOY_KEY`。
- 构建命令 `npm run build:fast`（复用已提交的关键词搜索索引，无需在 CI 生成），并注入：
  - `PUBLIC_SITE_URL=https://gongfpp.github.io`
  - `PUBLIC_BASE_PATH=/interface-atlas-web`（所有站内链接/资源/robots/sitemap/canonical 都会带此前缀）
  - `PUBLIC_LOG_API=off`（GitHub Pages 无 Functions/KV，关闭查询落库，避免 404）
- 公开仓库 Pages 设置：Source = **Deploy from a branch** → `main` / `/`（legacy），不需要 workflow；构建产物根带 `.nojekyll`（禁用 Jekyll，保留 Astro 的 `/_astro/`）。
- 手动触发：源仓库 Actions → **Deploy site to interface-atlas-web** → Run workflow。

> 若改用自定义域名：把 `PUBLIC_BASE_PATH` 改为 `/`、`PUBLIC_SITE_URL` 改为该域名即可（并在公开仓库 Pages 里配自定义域）。根部署时 `base` 为空，行为与旧版一致。

> GitHub Pages 不运行 `functions/`（Cloudflare Functions），故 `PUBLIC_LOG_API=off`。

### GitHub Pages 访客统计

analytics 变量要配在**源仓库** **Settings → Secrets and variables → Actions → Variables**（随 `deploy-web.yml` 注入构建）：

- `PUBLIC_UMAMI_SRC`：Umami 脚本地址，如 `https://cloud.umami.is/script.js`（Umami Cloud）或自建实例 `https://umami.example.com/script.js`
- `PUBLIC_UMAMI_ID`：Umami 网站 ID
- 可选 `PUBLIC_CF_BEACON_TOKEN`：Cloudflare Web Analytics token（支持非 Cloudflare 站点，无 cookie）

配好后重新运行 “Deploy site to interface-atlas-web” 工作流即可生效；未配置则自动跳过。站内已内置无 PII 事件：`search-miss`、`prompt-copy`、`prompt-builder-copy`。
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

## 留言板（giscus / GitHub Discussions）

`/board`（中英共用同一讨论串）通过 [giscus](https://giscus.app) 把评论挂在**公开仓库 `gongfpp/interface-atlas-web`** 的 GitHub Discussions 上：纯静态可用、免费、留言公开可见，评论需 GitHub 登录，数据在 GitHub，审核也在 GitHub。（源仓库为 private，不能承载 giscus，故挂在公开仓库。）

一次性配置（仓库 Owner）：

1. 公开仓库 **Settings → General → Features → Discussions** 勾选启用（本仓库已启用）。
2. 安装 giscus GitHub App：打开 <https://github.com/apps/giscus> → **Install** → 选择 `gongfpp/interface-atlas-web`。**未安装时评论区会报错/空白，这一步必须做。**
3. 在 <https://giscus.app> 填入仓库名，选择 Discussions 分类（当前用 `General`）与 `specific` 映射，把生成的 `data-repo-id` / `data-category-id` 填进 `src/components/GiscusComments.astro` 的 `GISCUS` 常量。
4. 删除/锁定/转移留言在 GitHub Discussions 页面操作；被 giscus 拉起的每个线程标题即 `data-term`（当前 `interface-atlas-board`）。

> 主题跟随站点深色/浅色切换（组件内 MutationObserver 监听 `<html class>`）。giscus 不写入站点域名的 cookie；登录态与主题偏好由 giscus.app 的 iframe 管理。

## 站点域名与子路径

- `PUBLIC_SITE_URL`（如 `https://your-domain.com`）决定 canonical / sitemap / hreflang；不设置时回落到 `https://interface-atlas.dev`。
- `PUBLIC_BASE_PATH`（如 `/interface-atlas-web`）决定部署子路径；根部署留空。所有站内链接、资源、robots、sitemap、`/api/*.json`、`llms.txt` 都会自动带上该前缀。

### 自定义命令行部署（Cloudflare Pages，可选）

```bash
npx wrangler pages deploy dist --project-name=interface-atlas
```
