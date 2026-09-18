# Cloudflare Pages 部署说明

## 构建配置

- Framework preset: **Astro**
- Build command: `npm run build:fast`
  （= api:build + astro build。搜索索引 public/data/search-index.json 已提交入库，
  内容更新时由本地/CI 的完整管线刷新；避免在 CF 构建环境下载 30MB embedding 模型）
- Build output: `dist`
- Node version: 22（环境变量 `NODE_VERSION=22`）

## KV 绑定（搜索查询日志，PRD §9.3）

1. Dashboard → Workers & Pages → KV → Create namespace：`SEARCH_LOG`
2. Pages 项目 → Settings → Functions → KV namespace bindings：
   - Variable name: `SEARCH_LOG`
   - Namespace: 上一步创建的
3. Functions 路由已内置：`functions/api/log-search.js`、`functions/api/log-prompt.js`（部署后自动生效；未绑定 KV 时静默丢弃）

## Umami 埋点（PRD §27a）

环境变量（Settings → Environment variables）：

- `PUBLIC_UMAMI_SRC`: 如 `https://analytics.example.com/script.js`
- `PUBLIC_UMAMI_ID`: Umami 网站 ID

两个都配置后，BaseLayout 自动注入脚本。自定义事件（搜索、Prompt 复制）已通过 `/api/log-*` + sendBeacon 上报，不依赖 Umami 特殊配置。
配置 Umami 后，站内还会上报两个无 PII 的聚合事件：`search-miss`（弱命中/无结果次数）、`prompt-copy`（概念 + 层级）。

## 访客统计（Cloudflare Web Analytics）

不需要第三方账号，随 CF Pages 一起用：

1. Cloudflare Dashboard → Analytics & Logs → Web Analytics → Add a site（选择 Pages 项目域名）。
2. 复制得到的 **Beacon token**。
3. Pages 项目 → Settings → Environment variables 增加：
   - `PUBLIC_CF_BEACON_TOKEN`: 上一步的 token
4. 重新部署后，BaseLayout 注入无 cookie 的 `beacon.min.js`；访客数/浏览量在 CF Web Analytics 面板查看。

> 该统计不使用 cookie、不采集个人信息，符合 PRD 隐私约定。

## 站点域名

`PUBLIC_SITE_URL`（如 `https://your-domain.com`）决定 canonical / sitemap / hreflang。
不设置时回落到 `https://interface-atlas.dev`。部署前务必设为真实域名，否则 canonical 会指向错误地址。


## 自定义命令行部署（可选）

```bash
npx wrangler pages deploy dist --project-name=interface-atlas
```
