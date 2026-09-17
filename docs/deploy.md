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

## 自定义命令行部署（可选）

```bash
npx wrangler pages deploy dist --project-name=interface-atlas
```
