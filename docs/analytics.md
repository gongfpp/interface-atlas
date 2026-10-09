# 访问与行为统计

生产站沿用 Umami Cloud，网站 ID 由源仓库 Actions Variables 中的 `PUBLIC_UMAMI_ID` 配置。GitHub Pages 没有日志接收端，所有行为统计直接发给 Umami；`PUBLIC_LOG_API=off`，不向静态站的 `/api/log-*` 发送请求。

在 [Umami Cloud](https://cloud.umami.is/) 登录已有账号，选择界面图谱对应的网站。网站概览看访问量、访客、来源、设备、地区和热门页面；Events 的 Properties 查看下表中的事件属性分布。Journey 可分析从首页开始的实际页面访问路径及流失，权限和可用报告以账号套餐为准。站点不公开统计后台或访问凭据。

| 问题 | 事件与查看方式 |
| --- | --- |
| 首页最常点到哪个页面？ | `home-navigation` → `destination`，按次数排序；`region` / `source` 区分首屏、风格、任务、搜索和随机探索入口。统计的是跳转意图，`new_tab` 标识新标签页。 |
| 实际从哪一页来？ | `page-arrival` → `from`；配合 Umami 自动 pageview 和 Journey。直接访问或浏览器隐藏来源时 `from` 为空。 |
| 最常离开哪个页面？ | `page-leave` → `page`；它表示离开当前文档，包含站内跳转、站外跳转、后退、刷新和关闭。离站/会话结束应结合 Journey 最后页面分析。 |
| 读了多久、是否挂后台？ | `page-leave` → `elapsed_ms` 为打开总时长，`visible_ms` 为前台可见时长，`active_ms` 为近 30 秒有输入/点击/滚动的活跃时长，单位均为毫秒。活跃时间是近似值，静止阅读超过 30 秒仍计入可见时间。 |
| 阅读到了哪里？ | `scroll-depth` → `depth` 为 25/50/75/100 里程碑；`section-view` → `region` 为进入视口中部的内容区块；离开事件的 `max_scroll` 为正文底部最高可见百分比。 |
| 点了哪些地方？ | `ui-click` → `region`、`target`（DOM 结构位置）、`control`、`label`（明确标注的操作名），`x_pct` / `y_pct` 为相对页面位置。键盘激活坐标为 -1，`pointer` 区分键盘/指针。支持普通链接、演示按钮、空白位置和中键打开。 |
| 链接目标与打开方式？ | `page-navigation` → `destination`、`kind`（internal / external / anchor）、`new_tab`；站内目标只含路径，站外目标只含域名。 |
| 搜索是否有效？ | `search` → `query_length`、`results`、`weak`；稳定输入 900ms 后记录。`search-miss` 保留弱命中统计；`search-result` → `destination`、`rank`、`source`，覆盖鼠标与回车。 |
| 哪些功能被尝试？ | `field-interaction` 记录每个输入控件本次访问首次修改的位置与类型；`form-submit` 记录提交动作。`ui-click` 还覆盖参考册、复制、Demo、主题和语言切换。 |
| 哪些 Prompt 被带走？ | `prompt-copy` 保留原有成功复制埋点及 concept / layer / style。普通按钮点击仅表示尝试，不能当作复制成功。 |
| 加载慢不慢？ | Umami 脚本启用 `data-performance=true`，由该服务采集浏览器支持的 Core Web Vitals。 |

所有自定义事件附带 `page`、`locale`、`page_type` 和 `schema=1`。页面生命周期事件、全局点击与区块事件还带随机的 `visit_id` 和递增 `sequence`，用于区分同一页面访问内的记录；ID 仅存在于内存，不用于跨会话识别。

前台每 30 秒上报 `page-engagement`，其中 `visible_delta_ms` / `active_delta_ms` 为相对上一次心跳的增量，其他时长字段为本次访问累计值。切后台时上报 `page-hidden`，回前台上报 `page-resume`。**不能把心跳、隐藏、离开事件中的累计时长直接相加**；完整访问使用 `page-leave`，缺少离开事件时用同一 `visit_id` 的最后快照，心跳增量可用于观察进行中的访问。短于 30 秒的访问由离开/隐藏快照覆盖。

`pagehide` 每次仅结算一次；BFCache 返回重新建立访问 ID 和计时周期，不重复注册监听。浏览器强退、系统杀进程、断网、拦截插件或服务额度限制仍可能导致漏报，无法从浏览器可靠区分“关闭标签”与“关闭整个浏览器”。`page-hidden` 不是退出。Umami 当前脚本使用 `fetch(..., { keepalive: true })` 发送事件，早期操作在脚本加载前最多暂存 100 条、等待 30 秒，失败不阻塞产品功能。

不读取输入值、按键内容、参考册正文、评论或页面文本；查询参数与 hash 不进入自动 pageview。区块/操作标签由代码明确标记，便于后续给重要入口补充可读名称。页面页脚有统计说明；尊重 Do Not Track 和 `localStorage['umami.disabled']='1'`。`PUBLIC_PREVIEW=true` 时不注入统计脚本、不采集事件。未配置 Umami 的本地构建不采集，测试通过替身验证，不把自动回归访问送到生产统计。

## 验证与发布

`tests/analytics.spec.mjs` 覆盖首页点击及下一页来源、时长与后台排除、滚动去重、搜索原文排除及键盘跳转、BFCache 事件恢复、排除设置、预览停采、脚本延迟及故障。时长使用浏览器虚拟时钟，隐藏和 BFCache 恢复使用生命周期事件模拟；普通首页到详情页的跳转及离开使用真实导航。

发布仍由 `.github/workflows/deploy-web.yml` 在同一提交上验证后增量构建到公开仓库；不能只根据源码 push 判断线上生效。发布后检查线上 HTML 的统计属性和新脚本，并实际观察 Umami 接收事件。已有数据不会补出此次增加的历史字段，新增统计只从新版本生效时开始。
