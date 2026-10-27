# 访问与行为统计

本轮范围仅正式 EdgeOne `https://atlas.gongfpp.icu`；不切 GitHub Pages、旧 edgeone.cool 或 Cloudflare 统计。原 `PUBLIC_UMAMI_SRC`、`PUBLIC_UMAMI_ID` 保留给既有站点，GH/CF原默认会话与隐私路径不变。新增 `PUBLIC_EDGEONE_UMAMI_SRC=https://stats.gongfpp.icu/script.js`、`PUBLIC_EDGEONE_UMAMI_ID` 只在工作流的 EdgeOne 构建步骤传入，且只由该正式 site 构建选择；不修改共享旧变量。未给EO新配置时仍回退原配置，不提前启用增强。

正式增强还须实际运行于精确 HTTPS origin、HTML `data-analytics-upgrade=true`；原生脚本 `data-domains=atlas.gongfpp.icu` 再锁域。下面新增闲置/GPC/90天身份行为仅适用该增强路径。stats.gongfpp.icu 下 `/_qa/analytics-20261027/` 的显式 `data-analytics-qa=true` 只供独立 QA website ID，不是生产通道。自托管接入仍需核实实际网站 ID 与生产接收；不启用第二 tracker，不添加手工 pageview。GitHub Pages 无日志接收端，仍 `PUBLIC_LOG_API=off`。

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
| 哪些 Prompt 被带走？ | `prompt-copy` 记录成功复制的 concept / layer / style / mode / variant / source；Agent 任务为 `layer=agent`。图库另有 `prompt_locale`，参考册使用 `notebook-copy`。普通按钮点击仅表示尝试，不能当作复制成功。 |
| 在哪里手动复制、剪切、粘贴？ | `clipboard-copy` / `clipboard-cut` / `clipboard-paste` → region / target / label，只记录操作位置。程序复制另外记录 API 成功结果；站外粘贴与具体外部 Coding Agent 无法被本站观察。 |
| 哪些选择被改变？ | `control-change` 记录选择控件的位置，不记录输入值。关键实验室、Prompt 和动效操作通过可读 label 标识；ui-click 的 `state_before` 保存操作前的 aria 状态。 |
| 加载慢不慢？ | Umami 脚本启用 `data-performance=true`，由该服务采集浏览器支持的 Core Web Vitals。 |

所有自定义事件附带 `page`、`locale`、`page_type` 和 `schema=2`，以及 `session_id`、`visit_id`、`page_step`、`sequence`、`session_sequence`、`event_time`、`session_started`、`entry_page`、`entry_source`、`embedded`。因此成功复制、搜索等业务事件也能与访问和点击串联，而非各自独立计数。

`session_id` 为随机匿名编号，仅通过当前标签页的 sessionStorage 跨页面保存，不识别真实人。30 分钟无真实页面操作后，下一次操作或返回前台轮换会话，同时封存旧访问快照、建立新 visit 并重置累计计时；心跳和隐藏快照不能续期。`visit_id` 每次进入页面、闲置会话恢复及 BFCache 恢复时更新，`sequence` 是本次访问内顺序，`session_sequence` 是标签页内跨页面顺序。存储受限时仍上报本页事件，但跨页面关联可能不完整。`embedded=true` 标识设备预览 iframe，分析主浏览路径时应排除它。

2026-10-27 用户批准仅本站使用、90 天到期的随机匿名访客号，随后明确本轮只接正式 EdgeOne。此候选仅在上述增强路径以 `ia:analytics:visitor:v1` 存入当前 origin 的 localStorage；`visitor_id` 和 `visitor_born_at` 成对附带到 schema2 事件。期限从创建时固定计算，不随访问续期；到期、损坏或关闭统计后重新启用时换号，不跨站、跨域、浏览器或设备关联。关闭统计、DNT、GPC、预览时不创建不上报，并尽力清理旧本地统计身份；存储不可读/写时不生成可上报的长期身份，仍保留原有匿名会话能力。无访客号的旧事件或存储受限事件不能当作长期用户留存样本。

head 中的同步身份准备与 Umami `before-send` 共用一个身份读取器，在首个自动 pageview 发出前设置 `payload.id`，自定义事件附带同一个 visitor_id；不增加 identify 请求、第二个 tracker 或手工 pageview。到期边界晚到的旧事件不挂到后来出生的新身份，保留匿名路径。仅新版本实际生效且有成熟 cohort 后才可计算同源 D1/D7，不补造历史留存。

自定义事件另带 `project=interface-atlas`、实际 `hostname` 和精确来源映射的 `channel`（github-pages / edgeone-pages / cloudflare-pages / unknown）。不同来源不拼成同一用户。技术心跳、可见性、滚动与区块曝光不作为业务成功计数；复制以成功回执计，表单提交/普通点击只表明操作意图。

在 Events 的属性筛选中按 `session_id` 查看一段匿名访问，按 `session_sequence`（或采集时的 `event_time`）排序；将同一 `visit_id` 的到达、停留快照、操作和离开合并，即得到“来源 → 页面与停留 → 点击/复制/粘贴 → 跳转 → 下一页 → 最后页面”。首页去向按 `home-navigation.destination` 统计；点击量按 `ui-click` 统计。比较页面阅读时长时，每个 visit_id 取最后的 visible_ms / active_ms 再按 page 汇总，而非累加所有快照。只有切后台而没有后续记录时，最后页面是推测的流失位置；不能证明当时已经关闭标签页。

前台每 30 秒上报 `page-engagement`，其中 `visible_delta_ms` / `active_delta_ms` 为相对上一次心跳的增量，其他时长字段为本次访问累计值。切后台时上报 `page-hidden`，回前台上报 `page-resume`。**不能把心跳、隐藏、离开事件中的累计时长直接相加**；完整访问使用 `page-leave`，缺少离开事件时用同一 `visit_id` 的最后快照，心跳增量可用于观察进行中的访问。短于 30 秒的访问由离开/隐藏快照覆盖。

`pagehide` 每次仅结算一次；BFCache 返回重新建立访问 ID 和计时周期，不重复注册监听。浏览器强退、系统杀进程、断网、拦截插件或服务额度限制仍可能导致漏报，无法从浏览器可靠区分“关闭标签”与“关闭整个浏览器”。`page-hidden` 不是退出。Umami 当前脚本使用 `fetch(..., { keepalive: true })` 发送事件，早期操作在脚本加载前最多暂存 100 条、等待 30 秒，失败不阻塞产品功能。

不读取输入值、按键内容、参考册正文、评论或剪贴板正文；手动复制仅用选区所在 DOM 定位，不读取选中文字。查询参数与 hash 不进入自动 pageview。区块/操作标签由代码明确标记，便于后续给重要入口补充可读名称。页面页脚有统计说明；自定义事件与 Umami `data-before-send` 钩子同时尊重 GPC、Do Not Track 和 `localStorage['umami.disabled']='1'`。隐私关闭时丢弃晚加载队列，不在重新启用时补报。`PUBLIC_PREVIEW=true` 时不注入统计脚本、不采集事件。未配置 Umami 的本地构建不采集，测试通过替身验证，不把自动回归访问送到生产统计。

## 验证与发布

`tests/analytics.spec.mjs` 覆盖首页点击及下一页来源、时长与后台排除、滚动去重、搜索原文排除及键盘跳转、BFCache 事件恢复、排除设置、预览停采、脚本延迟及故障。时长使用浏览器虚拟时钟，隐藏和 BFCache 恢复使用生命周期事件模拟；普通首页到详情页的跳转及离开使用真实导航。

发布仍由 `.github/workflows/deploy-web.yml` 在同一提交上验证后增量构建到公开仓库；不能只根据源码 push 判断线上生效。发布后检查线上 HTML 的统计属性和新脚本，并实际观察 Umami 接收事件。已有数据不会补出此次增加的历史字段，新增统计只从新版本生效时开始。
