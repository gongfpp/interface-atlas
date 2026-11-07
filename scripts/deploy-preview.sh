#!/usr/bin/env bash
set -euo pipefail

# 独立开发验收环境；dev 是 Pages 预览分支，不触发三站正式发布。
cd "$(dirname "$0")/.."
export PUBLIC_SITE_URL=https://dev.interface-atlas-9po.pages.dev
export PUBLIC_BASE_PATH=/
export PUBLIC_LOG_API=off
export PUBLIC_UMAMI_SRC=
export PUBLIC_UMAMI_ID=
export PUBLIC_CF_BEACON_TOKEN=

npm run build -- --outDir out/cloudflare-preview
cd out/cloudflare-preview
npx --yes wrangler@4.152.0 pages deploy . \
  --project-name interface-atlas \
  --branch dev \
  --commit-dirty=true
