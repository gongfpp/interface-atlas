# 风格完整页面与参考样张 / Full style pages and reference scenes

风格条目共 25 种。首页与列表的静态封面、详情里的交互视口、独立完整页面使用同一套页面 renderer，而不是为详情另做一个无关的控件 demo。原来的十种参考样张仍保留原品牌、首屏文案、照片和构图；交互内容沿同一品牌向下延续。

All 25 styles share a page renderer across static covers, the detail experience and independent pages, rather than mounting an unrelated component demo. The ten original reference scenes retain their brands, hero copy, photos and composition; interactive content continues the same brand.

## 架构与维护边界 / Architecture and maintenance

- [StyleThumb](<../src/components/StyleThumb.astro>) 是共享入口。[style-previews](<../src/lib/style-previews.ts>) 从已发布 YAML 读取规格、排序和双语文案，并确定十种 reference 分支。其余十五种以 YAML 的 `preview` 为品牌、素材描述、导航与 tokens 来源。
  / The shared entry reads published YAML specifications, order and translations; fifteen non-reference pages keep YAML preview as their source of brand, navigation and tokens.
- [ReferenceStyleScene](<../src/components/ReferenceStyleScene.astro>) 是十种参考样张的首屏结构、实际导航和素材事实来源；品牌从 [reference-style-data](<../src/lib/reference-style-data.ts>) 的 `REFERENCE_BRANDS` 共享读取，十种 YAML 的 `preview.brand` 已同步一致。维护品牌时同时核对元数据、页面标题与渲染结果，不改变首屏素材和布局。
  / The reference renderer defines hero structure, actual navigation and assets; brands come from shared REFERENCE_BRANDS, with all ten YAML preview.brand values aligned. Keep metadata, document titles and rendering consistent without changing hero assets or layout.
- [SceneAction](<../src/components/SceneAction.astro>) 在静态封面输出非交互 `span`，在交互文档输出真实 `button[data-scene-action]`。首页和列表整卡仍是进入详情的入口，不能在卡片链接内嵌套真实控件。浏览器地址和外框是 DOM/CSS 视觉语汇，不访问样张里的演示域名。
  / Static covers emit non-interactive spans; interactive documents enable semantic buttons. Do not nest live controls inside linked cards or visit fictional scene domains.
- [StyleScenePage](<../src/components/StyleScenePage.astro>) 提供独立 HTML 文档；中文路径为 `/style-scenes/{slug}/`，英文为 `/en/style-scenes/{slug}/`。[StyleExperience](<../src/components/StyleExperience.astro>) 在详情中嵌入该文档，提供宽度、演示模式、重载和独立打开入口。模式值是渲染输入，不代表每个风格的所有模式已完成验收。
  / Canonical routes render independent documents; detail iframes reuse them with width, mode, reload and open-page controls. A mode input is not proof of completed mode verification.
  原生弹窗打开后，容器将 iframe 滚动到外层可见区；视口高度也适配短窗口，避免半屏位置的菜单落到窗口之外。只观察 `open` 变化，不在按下按钮或切换焦点时移动点击目标；子文档更换时断开旧观察器。浮层仍在自己的文档内，不污染图谱的样式或状态。
  / Opening a native dialog reveals its height-adaptive iframe in the outer viewport. Only `open` mutations trigger this adjustment, never pointer focus, so controls do not move during clicks. Navigation disconnects the old observer; overlays remain document-scoped.
- 风格详情的站点导航与章节导航不吸顶，因为子文档原生弹窗不能越过父文档吸顶层；其它页面保留默认吸顶。风格宿主和独立文档还解除图谱的吸顶滚动留白与根节点平滑滚动，防止 Firefox 原生焦点调整在按下/抬起之间移动目标；短封面和长页预留一致的滚动条槽。其它页面仍保留原来的平滑滚动与 130px 留白。iframe 初始保持惰性加载，用户明确点击视口、模式或重置后改为立即加载，避免 Firefox 暂缓离屏 iframe 的新文档导航。必须使用真实点击验证完整项目/文章的关闭，不用局部菜单成功或强制点击代替。
  / Style details opt out of both sticky navigation layers. Other pages retain their defaults; validate complete modal flows using normal clicks, not forced clicks.
- [ReferenceStyleContent](<../src/components/ReferenceStyleContent.astro>) 与 [reference-style-runtime](<../src/lib/reference-style-runtime.ts>) 负责 VERTEX、The Paper Room；其余八种由 [ReferenceOtherContent](<../src/components/ReferenceOtherContent.astro>) 与 [other-reference-runtime](<../src/lib/other-reference-runtime.ts>) 延续。[GenericStyleContent](<../src/components/GenericStyleContent.astro>) 与 [generic-style-runtime](<../src/lib/generic-style-runtime.ts>) 承接其余十五种。运行时只初始化交互根节点，不给静态封面绑定业务状态。
  / Reference continuations and runtimes split the two exemplar brands from the other eight; the generic continuation/runtime handles the remaining fifteen. Initialize runtime state only inside interactive roots.

维护时保留已有 `variants`、`style_spec`、颜色、字体、边框、阴影和动效细节。新增整页工作流不是把设计规范替换成通用模板的理由。像素素材可以整数倍放大，但整张页面必须正常重排，不能把桌面画布整体缩小来冒充移动版。SYNTH-84 的当前首屏属于 `synth` 变体；奶油橙棕机身与 CRT 参数属于 `atompunk` / `cassette`，不得覆盖当前粉紫合成器落日构图。

Preserve variants and the original typography, palette, borders, shadows and motion specifications. Full-page flows do not justify generic design templates. Integer scaling belongs to pixel sprites, not the entire responsive page. SYNTH-84 uses the synth variant; warm casings and CRT parameters belong to atompunk/cassette instead of overriding its sunset composition.

## 新增或修改风格

1. 修改共享首屏、页面续页、固定演示数据与对应运行时，不去维护[旧同名 React 演示](<../src/islands/demos/>)作为另一份主体验。新增风格必须补齐自己的构图与实际业务流程，不能只添加 YAML 后使用一个空的通用工作区。
2. 已发布的 `preview` 由共享规格生成封面和双语独立路由；详情直接嵌入该路由。保留静态/交互两态的同构 DOM，只切换语义控件与是否初始化行为；封面不需要另行生成截图。
3. 新增风格时同步[品牌流程矩阵](<../tests/helpers/style-page-flows.mjs>)的 `STYLE_SLUGS`、具体操作及重置 oracle；原首屏的标题字形、素材填充和桌面几何也必须纳入同源检查。更新当前验收图时保留不可替换的历史基线。
4. 先构建，再执行内容、类型、Lint、完整浏览器回归；补测 1280/390/320、双语和已支持模式。所有流程能返回或重复，列表重建后安置相邻条目/空表入口焦点，不扩展真实后台。

## 品牌与操作合同 / Brand and operation contracts

下表说明实现方向及需要验证的真实操作，不是“已通过”清单。原导航、CTA、卡片和分页须到达对应内容、表单或可返回的面板；仅变颜色、占位链接或一句提示不算完成操作。

These are implementation and verification contracts, not passed-test claims. Original navigation, CTAs, cards and pagination must reach matching content, forms or reversible panels; color changes, placeholder links and click notices are not sufficient results.

设计特征标注（例如「直角与留白」「色块即层级」）保留为原来的静态说明，不伪装成业务操作，也不按卡片序号猜测和修改方案、装扮或曲目。项目、商品、文章和真实功能入口则使用可操作控件。

Design annotations such as “Clean edges and space” remain static descriptions. They never masquerade as actions or silently choose a plan, outfit or track by card index. Project, product, article and real feature entries remain operable controls.

| 风格 / Style | 实际品牌 / Brand | 具体操作 / Concrete flow |
| --- | --- | --- |
| minimalism | LUMO | 设备规格、款式、购物袋与订单预览；三条生活灵感 / Device details, finishes, bag/order preview; three daily rituals |
| swiss-style | VERTEX | NORTH / OPEN / FORM 案例、菜单和四栏导航、联系简介 / Case studies, menu/four sections, contact brief |
| editorial | The Paper Room | 四篇文章与分类、搜索数量与无匹配、收藏/取消 / Four stories and categories, counted search/no matches, save/unsave |
| glassmorphism | Aurora | 固定模板生成可编辑草稿、快照恢复、显式导出文本 / Editable template drafts, snapshot restore, explicit text export |
| bento-grid | ◉ Tasko | 真实月份/日期、任务新增/完成、笔记、本地昵称 / Calendar dates, add/complete tasks, notes, local nickname |
| neumorphism | Mellow | 计时开始/暂停/重置、任务、统计、设置与提示分页 / Timer start/pause/reset, tasks, stats, settings and tips |
| skeuomorphism | Daily Goods | 系列、搜索、商品款式、购物袋数量/移除/合计 / Collections, search, finishes, bag quantities/removal/totals |
| brutalism | STUDIO VOID | 项目详情、工作室/动态/联系、本地提案 / Project cases, studio/news/contact, local inquiry |
| neobrutalism | PlayLab | 项目案例、服务勾选、项目目标与时间简报 / Cases, service selection, project goal/timeline brief |
| retro-web | GoodOldNet | 五页目录、Go 内部地址与未知/外部地址拒绝、历史、菜单、搜索、收藏、窗口与留言 / Five-page directory, Go internal addresses with invalid/external rejection, history, menus, search, bookmarks, window controls and guestbook |
| flat-design | Flatly | 名称与 plan 创建本地工作区 / Create a named workspace with a plan |
| bauhaus | BAUHAUS | 红圆/蓝方/黄角，最多 12 个构成、清空 / Three primary shapes, up to 12 placements, clear |
| y2k | ☆ CyberDream ☆ | 昵称与装扮生成会员卡 / Nickname/outfit member-card creation |
| cyberpunk | NEON://CITY | 所选街区离线接入/断开，装备勾选与 HUD / Offline district connect/disconnect, gear and HUD |
| memphis | Milano '88 | 名称、人数、配色生成邀请卡 / Name, guest count and palette invitation maker |
| retro-futurism | SYNTH-84 | 用户手势启动合成单音，三曲、音量、播放/暂停 / Gesture-started synthesized tone, three tracks, volume, play/pause |
| claymorphism | Claymates | 选色、捏压计数、小屋收藏 / Color, squeeze counter and cabin collection |
| aurora | Borealis | 光谱/强度实时光场与配方保存 / Live spectrum/intensity light field and recipes |
| organic | mori / 森 | 三产品清单、移除与合计 / Three-product selection, removal and totals |
| art-deco | THE AURELIA | 称呼、日期、人数保存晚宴意向 / Guest/date/party-size dinner interest |
| corporate-memphis | alegria | 原日历切月/选日、5 项任务/12 篇笔记、负责人/任务与日期摘要、笔记读取/新增/删除、重置恢复种子 / Calendar months/dates, five tasks/twelve notes, ownership and dated summaries, note read/add/delete and seed reset |
| hand-drawn | scribble& | 笔记保存、关键词过滤、删除 / Save, keyword-filter and delete notes |
| liquid-glass | Lumen | 材质/厚度/角度试样、配方保存 / Material/depth/angle specimen and recipes |
| pixel-art | BITMAP | INSERT COIN、8×8 六色画板、方向键/空格、清空 / 8×8 six-color board, arrows/Space and clear |
| vaporwave | MALL★95 | 楼层导览、护照去重打卡 / Floor guide and deduplicated passport stamps |

### 本地状态与真实服务边界 / Local state versus real services

- 十种 reference 的运行时数据只在当前文档内：文章收藏、购物袋、Tasko 任务/笔记、Mellow 计时统计、Aurora 快照、GoodOldNet 历史/留言等在重载后恢复初始状态，不写浏览器持久存储。Aurora 只有用户点击导出时才在设备生成文本文件。
  / Reference runtime data is document-scoped and resets on reload, without persistent browser storage. Aurora generates a local text file only after an explicit export action.
- 十五种配置页的工作区、任务、笔记、配方、画布、清单和打卡同样只在当前页面内存中，不使用 `localStorage` / `sessionStorage`。刷新、工具栏重载/重置及模式切换均复位；内部「重置本地体验」清空本次状态并恢复初始内容，笔记另可逐项删除。必须分别验证页内撤销与整页重载，不能把「保存」写成跨页面或刷新后持久保留。
  / The fifteen configurable pages also keep workspaces, tasks, notes, recipes, canvases, selections and stamps only in page memory, without localStorage/sessionStorage. Reload, toolbar reset and mode changes restore initial state; in-page Reset local experience clears this visit and restores initial content. Notes can also be deleted individually. Test in-page undo separately from document reload; Save never implies cross-page persistence.
- 以上均不创建真实账号、订单、订位、邮件或云同步，不接入真实 AI。SYNTH-84 是本机合成音，不是外部广播；NEON://CITY 是离线城市模拟；Lumen 是网页光学近似。不能用成功文案暗示后台已完成真实服务。
  / No real account, order, booking, email, cloud sync or AI request occurs. SYNTH-84 synthesizes sound locally, NEON://CITY simulates offline connections, and Lumen approximates optics on the web. Success copy must not imply backend services ran.

下拉框保留原生 `select` 的键盘、触屏与辅助技术语义。WebKit 在系统菜单外观下会限制实际高度；因此交互页采用 `appearance: none`、可见箭头和至少 44px 的控件高度，而不是把它改成不带语义的自制菜单。`none` 仅移除原生外观、不移除控件功能的说明见 [MDN appearance](<https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/appearance>)。此修复须在真实 WebKit 中复测，不能只看 CSS 声明中的 `min-height`。

Native selects retain keyboard, touch and assistive semantics. The interactive page removes only OS-native appearance, draws a visible caret and enforces a 44px target. Validate the actual WebKit control rather than trusting a declared CSS minimum.

## 图像与字体来源 / Image and font provenance

构图依据用户在 2026-10-06 提供的两张《前端网页设计风格参考》。以下五张照片由内建图像生成工具针对原主视觉重新生成，仅为构图和材质近似，不是原图素材或像素级复刻。生成图不含网页文字与控件，文字、导航、网格、时钟、图表、窗口均由 DOM/CSS/SVG 构成。

Composition follows two user-provided reference sheets dated 2026-10-06. These five generated photographs approximate composition/materials rather than copying original assets pixel-for-pixel. They contain no UI text or controls; text, navigation, grids, clocks, charts and windows remain DOM/CSS/SVG.

| 源码资产 / Source asset | 用途 / Subject |
| --- | --- |
| [minimalism.png](<../src/assets/style-scenes/minimalism.png>) | 白色圆角设备、白石台、灰石与柔光 / White rounded device, plinth, grey stone and soft light |
| [editorial.png](<../src/assets/style-scenes/editorial.png>) | 晨光木桌、书、咖啡、陶瓶枝叶与窗影 / Morning table, book, coffee, vase, branches and window shadows |
| [skeuomorphism.png](<../src/assets/style-scenes/skeuomorphism.png>) | 银黑相机、书、木桌、绿植与暖灰墙 / Silver-black camera, book, wood, plant and warm-grey wall |
| [brutalism.png](<../src/assets/style-scenes/brutalism.png>) | 黑白裸露混凝土建筑、深窗洞和强阴影 / Monochrome concrete, deep windows and hard shadows |
| [mountains.png](<../src/assets/style-scenes/mountains.png>) | 3:1 雪峰、蓝雾与粉紫蓝暮色 / 3:1 snowy peaks, blue mist and dusk |

源码保留 PNG 原始生成字节，Astro Image 在构建时生成 WebP；CSS 决定裁切。其他局部图片复用这五项，不新增外部图片请求。

Source PNG bytes are retained; Astro Image generates WebP at build time and CSS determines cropping. Secondary imagery reuses these five assets without external image requests.

粗黑压缩标题使用 [Anton](https://github.com/google/fonts/tree/main/ofl/anton)，© 2020 The Anton Project Authors，SIL OFL 1.1；许可证见 [Anton-OFL.txt](<../public/licenses/Anton-OFL.txt>)。备用展示字为 [Bebas Neue](https://github.com/google/fonts/tree/main/ofl/bebasneue)，© 2010 Dharma Type，SIL OFL 1.1；许可证见 [BebasNeue-OFL.txt](<../public/licenses/BebasNeue-OFL.txt>)。其余沿用系统字体。

Anton and the fallback Bebas Neue are distributed under SIL OFL 1.1 with the linked licenses; other typography uses system fonts.

## 验收方法与当前边界 / Verification method and current boundary

VERTEX 与 The Paper Room 是交互与窄屏方法的样板，不代替其余风格验收。本次逐风格结果、基线差异和同尺寸前后截图集中在 [迁移与验收记录](<style-page-acceptance.md>)；早期样板或旧提交的绿色结果不能当作新候选的通过证明。

VERTEX and The Paper Room are interaction/reflow exemplars, not substitutes for the remaining styles. Per-style results, baseline differences and same-width screenshots live in the linked acceptance record. Early exemplar observations or green checks for an older commit never prove a new candidate passed.

1. 对照原封面：检查品牌、首屏文案、图像解码、构图、字体与 tokens 未被改写，首页/列表整卡可进入详情，静态封面无嵌套交互控件。
   / Compare original covers for unchanged identity, copy, decoded images, composition, type and tokens; check linked-card entry and no nested live controls.
2. 比较详情 iframe 与独立路由：相同语言/模式/视口应渲染同一首屏和内容；逐一验证原导航、主 CTA、卡片、分页、菜单、搜索与页尾返回。
   / Compare iframe and canonical route at matching language/mode/width; exercise every original navigation, CTA, card, pagination, menu, search and return control.
3. 按品牌合同完成具体流程，再撤销或修改：含有效/空白/无匹配输入、取消与 Esc、焦点返回、数量合计、计时暂停、音频停止、重复打卡、删除与重置。核对当前文档内存、刷新清空和显式下载的边界。
   / Complete and revise/undo each brand flow, including invalid/empty/no-match input, cancel/Escape, focus return, totals, timer pause, audio stop, duplicate stamps, deletion and reset. Inspect document memory, reset-on-reload and explicit download boundaries.
4. 在 1280px 桌面与 390px、320px 窄视口检查文档和 iframe 的真实换行重排；字号、表单、按钮可读可点，无文档横向溢出；不要只测卡片缩放。双语、可见焦点、键盘、辅助名称、状态播报和 reduced-motion 同时检查。
   / Check real document/iframe reflow at desktop 1280px, 390px and 320px, without horizontal document overflow or shrinking the desktop canvas. Test readable targets, both languages, focus, keyboard, accessible names, status announcements and reduced motion.
   同时检查真实文字 Range 未越出标题区域，以及照片/山景的百分比高度包裹层确实填满画布；`overflow:hidden`、零高插画或遮住长词都不能算画面通过。
   / Check actual text ranges and filled illustration geometry: hidden overflow, collapsed artwork and obscured long words are not visual acceptance.
5. [style-reference-scenes 测试](<../tests/style-reference-scenes.spec.mjs>) 是回归入口之一，不代表已覆盖此表全部新工作流。结合内容校验、项目检查、针对性流程回归和 Chromium / Firefox / WebKit 的视觉检查；记录命令、最终 SHA、语言、视口、浏览器、截图/结果及待验项，不虚报矩阵覆盖。
   / The existing reference-scene test is one regression entry, not evidence of coverage for every new flow. Combine content/project checks, targeted flows and Chromium/Firefox/WebKit visual checks; record commands, final SHA, locale, viewport, browser, artifacts/results and pending work.

可重复运行的补充矩阵见[跨浏览器风格配置](<../playwright.styles.config.mjs>)；它使用独立预览端口和附件目录，不会清空默认 Chromium 回归的证据。先完成构建，验证过程中不要重新覆盖同一份构建产物。

```sh
npm run build
npx playwright install firefox webkit
npx playwright test --config=playwright.styles.config.mjs --grep '完整风格语义流|嵌入浮层|1088px|键盘移除|风格滚动边界|非风格滚动策略|离屏模式'
```

功能分支在验收完成前不推送发布。完成后按 [项目 Git 约定](<../AGENTS.md>) 提交并推送源码 main，再执行正式部署流程；该流程在同一提交上先完成 verify，才构建并增量发布到生成仓库。不要手工修改 interface-atlas-web。历史私有仓库截图工作流不作为当前公开仓库的验收依据。

Do not publish unfinished feature work. Follow the project Git contract after acceptance: commit and push the source main, then use the official deployment workflow. Its verify job gates building and incremental publication of the same commit. Never hand-edit interface-atlas-web, and do not use historical private-only screenshot runs as current evidence.
