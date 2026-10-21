# 第二轮：25 种风格状态设计与阶段验收 / State-design delivery

> **阶段定稿，不是全平台全状态认证。** 按最新要求，本次停止继续扩大本地验证并提交部署准备；25 风格实现、C 证据与已执行专项如下。**C 完整跨引擎 980 本次未跑，留待下次；正式 Chromium 1100 由发布提交的平台 verify 强门禁执行，本文不预写通过。** 不覆盖[首轮验收](<style-page-acceptance.md>)，不借旧提交绿色结果冒充本轮。

## 1. 版本与交付边界 / Versions

- **Before**：`2bae6cd51a630bb6fa04869c50142b72b7df8608`，固定 production 4342。
- **实现 C**：`60b4b01bf6b5d4693382bbc248ad39a092a493fa`，production 4337。本地已核对实现 scope 相对 HEAD 无 diff；C 相对 A 仅计时文字幂等 guard 与两条真实按住回归（2 文件），CSS / markup / runner 不变。
- A `bb47233b3cecbb2137bd0785184a8ee2d90a7cdc` 及更早候选保留诊断；A 的 Chromium 1098 通过不等于 C 的完整 1100 通过。证据/本文提交不改变已验源码 C。最终发布 SHA 与 Actions 由 lead 的实际发布记录提供，避免本文自引用或猜测提交。
- 原首屏、照片、字体与品牌业务保留；续页、dialog、菜单、控件和反馈延续同一风格，不新增真实账号、支付、邮件、预订、AI 或云同步。状态仍限当前文档；刷新/模式/内部重置按原合同复位。

## 2. 共享设计与操作规则 / Shared contracts

1. [公共样式](<../src/styles/style-pages.css>)以低优先级 `:where` 做基础重置；品牌控制 `--scene-*` 的字体、表面、边框、圆角、阴影、blur、focus、selected/hover、invalid/success，顶层 dialog 不能回退为统一白面板。[八参考续页](<../src/styles/other-reference-pages.css>)与[十五配置续页](<../src/styles/generic-style-pages.css>)按各自材质/目的地区分布局；dark / variants 不统一成方角硬影，照片不反色。
2. [共享控件](<../src/lib/style-controls.ts>)保留 1px rendered、visually-hidden native `select` 作为值/校验/既有 `selectOption` 的 owner（非 hidden/display:none），用户操作真实 combobox 与顶层 popover listbox。值、label、selected、disabled、required、invalid 一致；程序化换商品、form.reset 和内部重建后重新幂等同步，不重复增强/残留 popup。
3. 真键盘 Tab / ShiftTab 进入，Arrow / Home / End / Enter / Space / Escape / Tab 操作；关闭后回可见 trigger，不激活 hidden owner。WebKit 触屏保留兼容 click，只阻止 mousedown 默认失焦；不以 pointerdown 代替真实业务 click。旧几何测试仅在先验证 owner/唯一 trigger 关联后排除该 owner 的尺寸，真实 trigger 与其他 native 控件仍受原目标/裁切门槛，不降标准。
4. [独立文档](<../src/components/StyleScenePage.astro>)在业务/APG 初始化前按 DOM defaultValue/defaultChecked/defaultSelected 还原初态，包含非 form 计时/材质控件，避免 Firefox reload 恢复旧值。预填 required 字段派发冒泡 input 清除旧空白 customError。
5. 字段 invalid、原业务具体 role=status 和可读 alert 均保留；native valid 不代表业务 success。成功提交自动清空下一条输入不能被误标失败，空白不增记录；只做本地业务，不增加伪 loading。实际 disabled 例含 Aurora 恢复与 Retro 历史边界；无对应业务状态时标 N/A，不造 UI。
6. dialog 打开/关闭/焦点返回、下拉展开、pointerdown-held 按压与具体结果分别验证；按真实计算样式、实际交互及看图判断，不能凭截图存在或按钮存在判通过。窄屏正常重排，长内容自身滚动，reduced-motion 不隐藏结果。

## 3. 全 25 风格规则与本轮结果 / Style matrix

**“实施完成”指本轮同品牌状态设计交付，专项和图审严格按第5节范围；不是宣称每种 tab × 深层状态 × 双语 × 全模式均人工穷举。** M / D / S 为弹出菜单 / dialog / 单选下拉；N/A 只表示这类 UI 不存在，普通导航/tab 不当弹出菜单。★ 为六重点。

| 风格 / Brand | 续页、控件与反馈的设计规则 / Rule | 代表中间态 / State path | M / D / S | 本轮阶段结果 |
| --- | --- | --- | --- | --- |
| minimalism · LUMO | 大留白、Georgia 标题、灰阶发丝线与黑胶囊；商品/购物袋延续安静产品页，不是通用白表单。 / Quiet whitespace, serif titles and fine rules. | 商品规格 dialog → 款式下拉展开 → 加入购物袋反馈；数量/移除/订单预览后可返回。 | N/A / D / S | 实施完成；按下述范围验证 |
| swiss-style · VERTEX ★ | 保留 49/27/24 首屏；续页是编号项目索引、红/黑硬切与压缩大字。菜单有编号/横线，案例 dialog 有红色顶线；联系字段保持网格和清楚底线。 / Numbered index, red-black rules, condensed menu. | NORTH 案例关闭前 → 四栏菜单打开/返回 → 联系 invalid / 成功简介。 | M / D / N/A | 实施完成；按下述范围验证 |
| editorial · The Paper Room | 暖纸、Georgia 阅读节奏、发丝线与克制棕色；文章、搜索、收藏按同一刊物处理，saved 状态清楚而非通用亮色块。 / Warm paper and restrained bookmarks. | 文章 dialog 收藏/取消 → 搜索与空结果 → 返回文章入口。 | N/A / D / N/A | 实施完成；按下述范围验证 |
| glassmorphism · Aurora ★ | 雪山首屏之后继续蓝紫透色工作玻璃；编辑/草稿分区、功能 dialog、下拉、error/status 都有半透明表面、白色细边、圆角、内高光和真实 blur。 / Translucent layered creation surfaces. | 功能 dialog 关闭前 → 语气下拉展开 → 生成/保存快照反馈；检查编辑稿/恢复/显式下载。 | N/A / D / S | 实施完成；按下述范围验证 |
| bento-grid · ◉ Tasko | 不等面积任务主格、笔记辅助格与浅蓝/淡紫/浅绿块；选中任务、日期、昵称 dialog 延续有序卡格，不统一三列卡。 / Unequal task and note tiles. | 新增任务反馈 → 勾选/日期摘要 → 笔记及本地昵称 dialog；重载复位。 | N/A / D / N/A | 实施完成；按下述范围验证 |
| neumorphism · Mellow ★ | 灰色同材质凸起按钮、凹陷字段/选中项与圆形时间刻面；按压为 inset，focus 有独立可见轮廓，高对比度不依赖双阴影。 / Raised-to-inset material states. | 时长下拉 → pointerdown-held 按压 → running → paused → reset；昵称/设置 dialog。 | N/A / D / S | 实施完成；按下述范围验证 |
| skeuomorphism · Daily Goods | 暖纸、棕色渐变物理按钮、顶部高光、凹面字段和细缝线；商品/袋内行、下拉和反馈保留触感。 / Warm paper and tangible brown controls. | 商品 dialog → 款式展开 → added 状态 → 购物袋数量/移除/合计与返回。 | N/A / D / S | 实施完成；按下述范围验证 |
| brutalism · STUDIO VOID | 黑白硬切、方角、粗横线和 Atlas Heavy；案例与联系是原始网格，按钮可见边界，不被 reset 变透明裸字。 / Square monochrome case grids. | 项目 dialog → 关闭返回 → 联系 invalid / 完整提案。 | N/A / D / N/A | 实施完成；按下述范围验证 |
| neobrutalism · PlayLab ★ | 粉/黄/蓝/绿贴纸表面、粗黑边、方角和硬投影延续到案例、brief、时间下拉及结果；按下吃掉投影。 / Sticker borders and hard shadows. | 续页项目 → brief dialog → timeline 展开 → brief 结果；检查服务选择与返回。 | N/A / D / S | 实施完成；按下述范围验证 |
| retro-web · GoodOldNet | 系统灰窗、蓝标题、inset/outset 凹凸边；搜索/收藏/地址 dialog 和留言状态仍是旧浏览器语汇，保留现代焦点与可读字号。 / Beveled browser-era surfaces. | 留言反馈 → 搜索 dialog → Go 内部地址/未知地址 → 历史/菜单返回。 | M / D / N/A | 实施完成；按下述范围验证 |
| flat-design · Flatly | 蓝黄平涂、清楚色块层级；workspace、价格、journal 有各自信息结构，选中和校验不靠阴影。 / Solid color with distinct pricing/editorial structure. | plan 展开 → 具名工作区结果 → 移除/重置；价格与博客目的地。 | N/A / N/A / S | 实施完成；按下述范围验证 |
| bauhaus · BAUHAUS | 米色、红蓝黄与圆方三角，构图与颜色参考是网格/几何研究，不套通用商店；选形和画布计数独立。 / Geometric composition and primary-color studies. | 选择形状 → 放置/计数 → 清空；形式/色彩/工坊目的地。 | N/A / N/A / N/A | 实施完成；按下述范围验证 |
| y2k · CyberDream | 银紫粉、圆体字、糖果/透明感卡片；音乐、装扮、社群与会员卡保留轻闪亮层次和可读前景。 / Candy-soft identity and outfit surfaces. | outfit 展开 → 昵称会员卡 → 修改装扮；音乐/星球目的地。 | N/A / N/A / S | 实施完成；按下述范围验证 |
| cyberpunk · NEON://CITY | 暗夜等宽终端、青色实体描边与受控微光；装备、街区、市场目录呈现不同 HUD/档案密度，disabled/invalid 仍可辨。 / Cyan-edged terminal and archive density. | 街区展开 → offline connected / disconnected → 装备 HUD 变化。 | N/A / N/A / S | 实施完成；按下述范围验证 |
| memphis · Milano '88 | 奶油底、粉黄青撞色、几何图案和硬偏移；邀请卡、家居、图案/派对目的地不同构成，选色项与结果匹配。 / Clashing patterns and invitation composition. | palette 展开 → 名称/人数邀请结果 → 修改/重置；目的地收藏。 | N/A / N/A / S | 实施完成；按下述范围验证 |
| retro-futurism · SYNTH-84 | 粉紫合成器电台，播放器、磁带资料与巡演行程延续屏显字体和霓虹；不是原子火箭/奶油机身；只有播放时均衡器动。 / Synth radio, tapes and tour schedules. | playing → 切曲 → volume → paused；巡演/磁带目的地。 | N/A / N/A / N/A | 实施完成；按下述范围验证 |
| claymorphism · Claymates ★ | 大圆角粉彩与带色外影/上下内高光；凸起按钮 active 内陷、小屋软垫、商店三款真实球形色样都要软黏土，不只给通用卡换底色。 / Puffy-to-inset controls, soft cabin and three dimensional shop swatches. | 真实三色色样展开 → Peach → 捏压/收集结果 → 内部 reset 后重新增强。 | N/A / N/A / S | 实施完成；按下述范围验证 |
| aurora · Borealis | 深夜绿紫粉光场、浅透卡和光谱资料；控制台/配方/观测参考保留呼吸感与可读文字，不误写为 Aurora AI 品牌。 / Ambient fields and observation references. | spectrum 展开 → 强度变化 → 保存光配方；光/色/场目的地。 | N/A / N/A / S | 实施完成；按下述范围验证 |
| organic · mori / 森 | 米白、苔绿、衬线标题与自然材质物件；系列是拱形材质目录，养护为清楚无衬线正文，控件边界仍明确。 / Arched material catalogue, serif titles and readable sans care text. | 三产品加入/移除 → 清单合计 → 关于/材料目录。 | N/A / N/A / N/A | 实施完成；按下述范围验证 |
| art-deco · THE AURELIA | 午夜蓝黑、暖金细边、轴对称和宽字距短标签；晚宴意向/体验资料保持仪式感但表单不繁复。 / Symmetric gold-framed evening planning. | guests 展开 → name/date 意向 invalid / 结果 → 修改；非真实订位。 | N/A / N/A / S | 实施完成；按下述范围验证 |
| corporate-memphis · alegria | 友好紫黄桃色与原四列日历/任务/笔记，团队看板、客户、计划、招聘有各自密度；不另造主导首屏的人物模板。 / Friendly calendar/team records, distinct business destinations. | owner 展开 → 新任务/完成进度 → 12 笔记读取/增删 → 种子复位。 | N/A / N/A / S | 实施完成；按下述范围验证 |
| hand-drawn · scribble& | 纸白、墨色、橘色、非对称圆角与轻纸影；日记/素材如笔记本而非统一 SaaS 卡，手感只在视觉层不破坏命中。 / Notebook rhythm with predictable targets. | paper 展开 → 保存/自动清空 success → 查找/删除/空结果。 | N/A / N/A / S | 实施完成；按下述范围验证 |
| liquid-glass · Lumen ★ | 厚玻璃边缘、上下高光、透色层叠与浮层控制；Clear 透明低 blur、Frost 高 blur 漫射、Prism 彩色边缘，secondary 三样本也须有差别，不只是换文案。 / Distinct clear low-blur, diffused frost and prismatic-edge samples. | material 展开 → Clear / Frost / Prism 三状态 → depth/angle → 配方保存。 | N/A / N/A / S | 实施完成；按下述范围验证 |
| pixel-art · BITMAP | 整数像素硬边、直角描边、等宽标签；画板/图鉴/商店使用像素网格和有限画笔色，不能把整页缩放当手机。 / Sharp pixel board and atlas structure. | Coin → 方向键/空格/点击绘制 → clear；图鉴与商店。 | N/A / N/A / N/A | 实施完成；按下述范围验证 |
| vaporwave · MALL★95 | 粉紫青、霓虹招牌与网格地图；音像、美食、楼层/护照如商场导览，不统一成三张可换色卡。 / Neon mall guide and stamped passport. | floor 展开 → 楼层变化 → 去重打卡结果 → 重置。 | N/A / N/A / S | 实施完成；按下述范围验证 |

15 种配置风格没有 dialog，不能为填表新造；10 种参考风格有 dialog。主95代表路径实际打开8种，Tasko/Mellow profile 标 available-not-visited；独立 extra 补 profile，不倒改主95summary。无异步业务的 loading 为 N/A；无表单的工坊/画板用原画布/计数结果而不是伪提交。

## 4. 同视口证据与六组配对 / Reproducible evidence

[18组配对与25品牌图库](<../public/evidence/style-states/index.html>)。Before/After 均为真实 DOM 截图，默认模式、CSS pixels、900px 高；桌面1280中文，六重点390/320英文。每侧各 **37路径 / 95 PNG / 95 computed JSON / 3 manifest**。Before193文件17,142,112 bytes；C193文件20,159,811 bytes已逐大小/SHA核对原字节一致。

| 范围 | Before manifest | C manifest |
| --- | --- | --- |
| 全25 · zh · 1280×900 | [Before](<../public/evidence/style-states/before/all25-desktop-zh/manifest.json>) | [C](<../public/evidence/style-states/after/all25-desktop-zh/manifest.json>) |
| 六重点 · en · 390×900 | [Before](<../public/evidence/style-states/before/focus-390-en/manifest.json>) | [C](<../public/evidence/style-states/after/focus-390-en/manifest.json>) |
| 六重点 · en · 320×900 | [Before](<../public/evidence/style-states/before/focus-320-en/manifest.json>) | [C](<../public/evidence/style-states/after/focus-320-en/manifest.json>) |

C三批 versionLabel/source.commit 均为完整C、src diff为空内容SHA、untrackedSources=[]、sourceChangedDuringCapture=false；runner hashes与正式Before相同。Before source未变，但其worktree另有生成API/node_modules，不假称全树无dirty。artifact均用相对basename。原始 captured-not-visually-approved / pending **不事后篡改**，人工决定另记；源码检查、capture、行为断言、人工视觉是不同证据等级。

以下六组均为 **390×900 / en / default / Chromium**，不是拿首轮1088px或844px高图混配：

| 品牌与状态 | Before PNG | After C PNG | Computed JSON |
| --- | --- | --- | --- |
| Aurora · 功能 dialog | [Before](<../public/evidence/style-states/before/focus-390-en/glassmorphism-en-390-01-aurora-feature-dialog.png>) | [After](<../public/evidence/style-states/after/focus-390-en/glassmorphism-en-390-01-aurora-feature-dialog.png>) | [Before](<../public/evidence/style-states/before/focus-390-en/glassmorphism-en-390-01-aurora-feature-dialog.json>) / [After](<../public/evidence/style-states/after/focus-390-en/glassmorphism-en-390-01-aurora-feature-dialog.json>) |
| PlayLab · brief dialog | [Before](<../public/evidence/style-states/before/focus-390-en/neobrutalism-en-390-02-playlab-brief-dialog.png>) | [After](<../public/evidence/style-states/after/focus-390-en/neobrutalism-en-390-02-playlab-brief-dialog.png>) | [Before](<../public/evidence/style-states/before/focus-390-en/neobrutalism-en-390-02-playlab-brief-dialog.json>) / [After](<../public/evidence/style-states/after/focus-390-en/neobrutalism-en-390-02-playlab-brief-dialog.json>) |
| Mellow · 实际持续按压 | [Before](<../public/evidence/style-states/before/focus-390-en/neumorphism-en-390-02-mellow-active-press.png>) | [After](<../public/evidence/style-states/after/focus-390-en/neumorphism-en-390-02-mellow-active-press.png>) | [Before](<../public/evidence/style-states/before/focus-390-en/neumorphism-en-390-02-mellow-active-press.json>) / [After](<../public/evidence/style-states/after/focus-390-en/neumorphism-en-390-02-mellow-active-press.json>) |
| VERTEX · NORTH 案例 | [Before](<../public/evidence/style-states/before/focus-390-en/swiss-style-en-390-01-project-dialog-open.png>) | [After](<../public/evidence/style-states/after/focus-390-en/swiss-style-en-390-01-project-dialog-open.png>) | [Before](<../public/evidence/style-states/before/focus-390-en/swiss-style-en-390-01-project-dialog-open.json>) / [After](<../public/evidence/style-states/after/focus-390-en/swiss-style-en-390-01-project-dialog-open.json>) |
| Claymates · Peach 收集结果 | [Before](<../public/evidence/style-states/before/focus-390-en/claymorphism-en-390-02-brand-result.png>) | [After](<../public/evidence/style-states/after/focus-390-en/claymorphism-en-390-02-brand-result.png>) | [Before](<../public/evidence/style-states/before/focus-390-en/claymorphism-en-390-02-brand-result.json>) / [After](<../public/evidence/style-states/after/focus-390-en/claymorphism-en-390-02-brand-result.json>) |
| Lumen · Prism 已选控制区（非本体可见证据） | [Before](<../public/evidence/style-states/before/focus-390-en/liquid-glass-en-390-04-lumen-material-prism.png>) | [After](<../public/evidence/style-states/after/focus-390-en/liquid-glass-en-390-04-lumen-material-prism.png>) | [Before](<../public/evidence/style-states/before/focus-390-en/liquid-glass-en-390-04-lumen-material-prism.json>) / [After](<../public/evidence/style-states/after/focus-390-en/liquid-glass-en-390-04-lumen-material-prism.json>) |

**Before native popup 像素无法由page截图保证捕获，展开视觉配对为 N/A。** native-popup-attempt / expandedVerified=false（即使 :open=true）不冒充展开证据；新版16品牌为实际DOM listbox展开。无dialog的G15亦为N/A，不代表免验续页。

C主95对A：83 PNG完全同字节、12差异图均实际read_image C新文件；只有相同字节且原图确已看过才绑定原审阅，不转移A运行门禁，不称本轮95张全部直接看过。Lead的Swiss/Paper6图亦按实际同SHA绑定。

Lumen390/320的既有900px高控制图里主试样在下方，只证明控制区/已选材质；本体外观另看桌面 [Clear](<../public/evidence/style-states/after/all25-desktop-zh/liquid-glass-zh-1280-02-lumen-material-clear.png>) / [Frost](<../public/evidence/style-states/after/all25-desktop-zh/liquid-glass-zh-1280-03-lumen-material-frost.png>) / [Prism](<../public/evidence/style-states/after/all25-desktop-zh/liquid-glass-zh-1280-04-lumen-material-prism.png>)及补充整段图。PlayLab长brief在dialog内滚动后完整summary可读，不声称顶端表单/close与全部长简报同时入镜。

### C补证与人工范围

- [extra](<../public/evidence/style-states/extra/evidence.json>)：9 case / 18 PNG；Tasko/Mellow中文1280/390/320 profile打开→昵称保存/目的焦点→重开→关闭/入口焦点，及Swiss三宽菜单/项目。动作由JSON证明，不能从PNG推断。
- [extra-states](<../public/evidence/style-states/extra-states/evidence.json>)：15 case / 15 PNG；含PlayLab滚动后summary、LUMO/Tasko/Goods/VOID/Retro英文两窄宽反馈及Editorial正文/Saved。
- [mobile](<../public/evidence/style-states/mobile/manifest.json>)：15 G × 390/320共30路径、36 PNG + 36 JSON，0 page/request errors/overflow，sourceChanged=false，浏览器已关。整段结果与Lumen三材质补图不冒充其余未见深层状态。
- reference C77：69图与实际已批准A图同字节，8个差异C文件新看；主styles仅8品牌，Swiss/Editorial在supplementary，不虚增品牌数。配置15品牌C80：75图（含全部mobile36）与已实看A图完全同SHA绑定，5个变化Lumen320图已fresh read_image批准。合并后的[公开人工验收记录](<../public/evidence/style-states/review.json>)列出C25品牌、130个explicit图与24个supplementary范围；不把capture pending改成自动批准，不声称全模式/所有tab全部人工覆盖。

## 5. 已执行测试与发布门禁 / Executed checks and release gate

引擎实际launch版本：Chromium **153.0.8010.12**、Firefox **155.0**、WebKit **26.6**。以下是本次实际范围，不把父提交或被取消run移作C结果。

| 范围 | 真实结果 | 不扩大的边界 |
| --- | --- | --- |
| C静态/构建 | check/lint、unit357、build500pages、实际search:test30/30通过 | 此前误用不存在golden:check的包装命令exit1保留；更正命令通过不改写原exit。 |
| C Chromium reference+state+lifecycle | **186/186，144.8s≈2.4m，exit0** | 不是完整1100。 |
| C Firefox/WebKit lifecycle | **78/78，21.0s，exit0** | 39条×2引擎定向，不是完整980。 |
| C原WebKit完整Mellow case×30 | **30/30，109.0s≈1.8m，exit0** | 原A29/30反证保留，不洗原失败。 |
| A Chromium完整 | 历史 **1098/1098** | 仅A，不冒称C完整。 |
| C完整跨引擎980 | **本次未跑，按最新暂停要求留待下次** | 不等待/不写全绿。 |
| 正式完整Chromium1100 | **由发布提交的平台verify执行，本文不预判** | [部署工作流](<../.github/workflows/deploy-web.yml>)的build-and-deploy强needs:verify，同发布SHA门禁不通过不部署；不是本地已跑结果。 |

结果统计来自已collect的实际报告；C三组已执行报告errors/skip/unexpected/flaky为0。正式发布SHA与Actions由lead实际发布回复/平台记录给出，不在包含本文的提交中猜写自身SHA。后续只证据/本文提交不得改变已验源码C；若源码改变，重新绑定与验收。

## 6. 真实阻塞、修法与未消除记录 / Findings retained

| 问题 | 已做修复/证据，不改写历史 |
| --- | --- |
| 高优先级reset抹品牌按钮/表面 | 低优先级基础重置、完整品牌tokens传递；dialog/下拉/续页按品牌设计，不用高权重补丁统一白面板。 |
| picker生命周期与hidden owner默认激活 | 幂等同步程序化换商品/form.reset；阻止option/装饰label默认激活把焦点送入1px owner，保留native兼容与真实trigger门槛。 |
| WebKit触屏不选择 | pointerdown preventDefault导致兼容click缺失；改仅mousedown防失焦/open focus。三引擎两品牌12case A/B：WK原index0/change0→修改index1/change1/closed/triggerfocus。 |
| Prism厚度只改label不改画面 | 固定blur6覆盖slider，改depth*.5保留默认/static6；真实range4/20下Clear4/20、Frost12/28、Prism2/10 computed断言不弱化。 |
| required预填残留customError | 仅Aurora topic/Retro address受影响；合法预填派发input清校验。native valid也不代表Retro未知地址/PlayLab无服务业务success。 |
| Flatly浅底白placeholder | 原旧gs-fg白色/.65导致真实视觉FAIL，直接改品牌muted/opacity1；default/dark/variants实际对比度≥4.5回归。 |
| Firefox重载恢复旧值 | 业务init前DOM defaults恢复，含非form计时/材质；不删原18断言。API focus启发式none另经真Tab证明非产品bug，oracle改真ShiftTab/Tab；variants采iframe全部真实样式，不给产品假差异。 |
| Retro具体role=status被共享空白capture截断 | 业务native invalid listener复用原双语具体反馈；保留shared守卫/旧4测试，双语empty/spaces→修正→重复empty不增。 |
| Mellow跨250ms tick按住丢click | 同值textContent替换按下时Text节点；幂等guard保留节点，不更改tick/deadline或把业务移pointerdown。新独立页/iframe350ms真实hold在旧A均红例，C通过。 |

公开[30case受控A/B](<../public/evidence/style-states/diagnostics/mellow-held-click-ab.json>)及[方法/字段说明](<../public/evidence/style-states/diagnostics/mellow-held-click-method.json>)：WK原5/5无click、改后5/5 Paused，Chrome/FF两组各5/5；sameTextNode在mouseup后采样，修改组false可因有效暂停改label，回归另在mouseup前检查节点。相关官方 [WebKit252810](<https://bugs.webkit.org/show_bug.cgi?id=252810>) / [278150](<https://bugs.webkit.org/show_bug.cgi?id=278150>) 是NEW历史报告，不承诺所有版本已修；本地A/B才是本项目根因证据。

**仍未知**：A第一次跨引擎完整为975/976，FF corporate详情reset5s predicate超时，无trace/poll实际值；纯监听trace12/12、55–131ms及后一完整run原例pass，不证明首次根因已解决。后一run的WK Mellow是真实不同缺陷，已定位修复，不能拿它解释FF未知问题。旧v4/v5及取消run不标通过；旧button墙30s预算在未改2bae/2workers亦复现，未改其他栏目源码/预算换绿。

## 7. 上轮暂停时的待办（历史） / Previous checkpoint

以下保留上轮暂停时的真实状态，不表示当前仍未执行；2026-10-21 的续验、发现与版本见第 8 节。

1. **C完整Firefox/WebKit980**：本次明确未跑；冻结C/独占资源、原2workers/retry0/原5s与原断言重跑，保留首次FF reset未知与旧失败记录，不用单例重复洗整套绿。
2. 实体iOS/Android、旧Popover API不支持引擎降级、辅助技术组合；目前支持边界是已测现代三引擎，不是全设备认证。
3. 深层tab/搜索空状态/错误修正/全部dark-variants及更长内容补验；人工仅listed代表图与相同字节绑定，不假称每状态均逐张看过。
4. 查看同发布SHA的平台verify/部署结果；不通过则先修复并重验，不绕过强needs发布。平台结果由实际Actions裁定。

### 维护与复现

[采集脚本](<../scripts/capture-style-states.mjs>)只向/tmp输出，明确冻结实现SHA；每引擎/模式另目录，不覆盖原证据。维护[状态路径](<../tests/helpers/style-state-paths.mjs>)、[专项测试](<../tests/style-state-design.spec.mjs>)及[生命周期回归](<../tests/style-controls-lifecycle.spec.mjs>)，同时遵守[维护指南](<style-reference-scenes.md>)。下列是复现示例，不是新增执行记录：

```sh
node scripts/capture-style-states.mjs --base-url=http://127.0.0.1:4337 \
  --repo="$PWD" --version=60b4b01bf6b5d4693382bbc248ad39a092a493fa \
  --out=/tmp/style-states-C-recapture/all25-desktop-zh \
  --slugs=all --widths=1280 --locales=zh
# 六重点两窄宽分别输出focus-390-en/focus-320-en；--engine按实际浏览器选择
```

## 8. 本轮续验（2026-10-21） / Remaining verification

经人类确认继续，先核实已发布 B=`cbc6acb6e973dd4efbd2099a984b212e94d90c03`，保留其实现与旧证据；未重写风格页面。本轮唯一实现修复是 [Swiss dark invalid token](<../src/styles/style-pages.css>)：`#bc2611` → `#ff7755`。修复提交 S=`a2d1ddfe0881c57f4b4d40d7a03005680b062878`，同时新增两条 [实际背景合成对比度回归](<../tests/style-state-design.spec.mjs>)；default、其他品牌、布局、业务均未改变。

| 本轮实际执行 | 结果与版本 | 边界 |
| --- | --- | --- |
| 原完整 Firefox/WebKit | B **980/980，14.4m**；S **984/984，14.1m** | 各自原配置、2 workers、retry0、0 skip/unexpected/flaky；不把 B 结果转标 S。S 每引擎492例。 |
| 新增错误对比度红/绿 | 旧 B 构建＋新工作树测试 **4例红**；修复实现 **三引擎6/6绿，4.7s** | 390px/en 与320px/zh；实测祖先纯色背景合成，非只检查 CSS 声明。 |
| 静态与构建 | unit **357**、check、lint、build、search:test **30/30** 通过 | 新实现检查；最终发布提交的平台完整 Chromium 仍由精确 SHA 的 verify 裁定，不在这里预判。 |
| 六重点模式主图 | B、S 各 **12唯一组合／40 PNG＋40 computed JSON** | 两批均真实 WebKit26.6、英文，dark390×900、variants320×900；不是Firefox图，不将截图存在视为逐图批准。 |
| 同组合补段 | B、S 各 **4次重访／7图** | Swiss菜单、错误→修正→成功、项目关闭精确焦点；PlayLab错误→完整摘要→关闭焦点；Lumen两模式真实Prism本体。4次不是新增4维组合。 |

**构建及完整测试通过后，真实截图仍发现了问题。** B 的 VERTEX 错误正文为14px/400、`rgb(188,38,17)`，背景实测合成为`rgb(25,25,25)`，对比度仅 **2.8663:1**；该图明确拒绝。S 保留暖红语义，实测`rgb(255,119,85)`，同背景 **6.7161:1**，满足本次普通正文4.5:1门槛。新图实际重新查看；字段错误边界、具体反馈与修正成功均保留，没有通过删掉错误状态过关。

完整 [47对原图与逐状态JSON](<../public/evidence/style-states/verification-20261021/index.html>)、[版本/执行范围](<../public/evidence/style-states/verification-20261021/results-summary.json>)、[独立逐图批准与拒绝](<../public/evidence/style-states/verification-20261021/review.json>)、[实测红绿对比度](<../public/evidence/style-states/verification-20261021/regressions.json>)及 [文件字节清单](<../public/evidence/style-states/verification-20261021/inventory.json>) 已归档。旧 C、B 的 raw pending 与失败图均未改写。B 27张确实看过：26通过、1拒绝；S 27张指定图中26张与已看B图**原始PNG SHA256完全相同**才继承，1张变化错误图新看。每套其余20张仍仅采集，不自动升级为人工通过。

补段还验证：Swiss无效字段清除后成功且不再有alert；PlayLab长摘要实际在dialog内可滚动、完整可达；关闭回到精确原入口；Lumen stage完整在视口内、选中Prism且expanded popup关闭、焦点回trigger。所有新采集源码前后稳定、单context串行、0 page/request/HTTP错误、无横溢出、所有context/browser关闭；对应断言与几何见原JSON。

**剩余支持边界**：实体iOS/Android、旧Popover不支持引擎、辅助技术组合及所有深层状态穷举不在本轮认证内。第6节的首次Firefox reset根因仍未知；B980与S984整套自然通过不证明其首次根因已被定位。发布SHA、正式CI及线上核对由实际平台结果给出，不能用截图版本猜发布结果。
