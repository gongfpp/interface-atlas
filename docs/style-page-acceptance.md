# 风格整页统一：迁移与验收

## 改造入口与原始差异

视觉基线为源码提交 [`9e652dc8`](<https://github.com/gongfpp/interface-atlas/commit/9e652dc8fb1c64b2abf7109b3f3e0bd15111871c>) 的实际预览。本文已入库全部 25 种原始预览与当前页面的中文截图；双语内容、同源 DOM 和操作另外由完整矩阵验证。没有更换五张原始照片或字体资产。

- **R**：十种精细参考构图原先来自 [ReferenceStyleScene](<../src/components/ReferenceStyleScene.astro>)，不是 YAML 中的另一套英雄区文案。
- **G**：其余十五种原先来自 [StyleThumb](<../src/components/StyleThumb.astro>) 的配置构图与各风格 YAML。
- 旧交互均来自各自同名的 [React demos](<../src/islands/demos/>)，经 [DemoMount](<../src/islands/demos/DemoMount.tsx>) 加载，与原预览各自维护。下表记录实际差异，而不是将旧 Demo 放大。

| 风格 | 原预览 | 旧交互的主要差异 | 当前页面中的具体操作 |
| --- | --- | --- | --- |
| [极简](<../src/content/styles/minimalism.yaml>) | R · LUMO 设备照片 | Quiet 字体卡、邮箱与 Follow | 产品规格/款式、购物袋加减/移除/订单预览、提示分页 |
| [瑞士](<../src/content/styles/swiss-style.yaml>) | R · VERTEX 硬网格/红海报 | Die Ordnung 排版表格与搜索框 | 四栏导航、菜单/语言、三案例、联系简介 |
| [杂志编辑](<../src/content/styles/editorial.yaml>) | R · The Paper Room 照片与三篇侧栏 | 独立字体文章示例 | 四篇文章、分类/搜索、收藏/取消、返回 |
| [玻璃拟态](<../src/content/styles/glassmorphism.yaml>) | R · Aurora 雪山创作工具 | 登录表单，与 AI 创作落地页无关 | 主题/语气生成本地模板、编辑、内存快照/恢复、导出文本 |
| [便当](<../src/content/styles/bento-grid.yaml>) | R · Tasko 日历/任务/笔记 | Studio K 访问量/存储/点赞 | 跨月份日期、任务新增/完成、笔记、本地昵称 |
| [新拟态](<../src/content/styles/neumorphism.yaml>) | R · Mellow 天气/时钟/工具 | STILL 音乐播放器 | 专注开始/暂停/重置、时长、任务/统计/设置、提示分页 |
| [拟物](<../src/content/styles/skeuomorphism.yaml>) | R · Daily Goods 相机/木桌 | VINTAGE AUDIO 电源/频道面板 | 商品/搜索、款式、购物袋数量/移除/合计 |
| [粗野](<../src/content/styles/brutalism.yaml>) | R · STUDIO VOID 建筑/大字 | RAW.STUDIO 拍击计数与输入 | 不同项目详情、工作室/动态/联系、本地提案 |
| [新粗野](<../src/content/styles/neobrutalism.yaml>) | R · PlayLab 叠窗/清单 | BRUTAL* 贴纸点赞卡 | 项目案例、服务勾选、目标/时间简报 |
| [复古互联网](<../src/content/styles/retro-web.yaml>) | R · GoodOldNet 完整旧浏览器 | 品牌接近，但只有另一套局部页/留言布局 | 五页目录、Go 内部地址、历史/菜单/搜索/收藏/窗口、内存留言 |
| [扁平](<../src/content/styles/flat-design.yaml>) | G · Flatly | 独立 newsletter 订阅卡 | 名称与计划创建本地工作区、移除、方案/博客内容 |
| [包豪斯](<../src/content/styles/bauhaus.yaml>) | G · BAUHAUS | 几何姓名卡与 Swap | 三基本形构图、最多 12 次放置、清空、形式/色彩/工坊内容 |
| [Y2K](<../src/content/styles/y2k.yaml>) | G · CyberDream | CYBER PRINCESS handle/chrome 卡 | 昵称/装扮生成会员卡、音乐/装扮/社群资料 |
| [赛博朋克](<../src/content/styles/cyberpunk.yaml>) | G · NEON://CITY | N1GHT//C1TY_OS 文本终端 | 离线街区接入/断开、装备勾选与 HUD、不同城市资料 |
| [孟菲斯](<../src/content/styles/memphis.yaml>) | G · Milano '88 | Milano 1981 派对颜色卡 | 名称/人数/配色制作邀请、家具/图案/派对资料 |
| [复古未来](<../src/content/styles/retro-futurism.yaml>) | G · SYNTH-84 | 1968 年原子火箭控制台，时代与构图均不同 | 本机合成音、三曲/音量/播放/暂停、巡演与磁带资料 |
| [黏土](<../src/content/styles/claymorphism.yaml>) | G · Claymates | Squish Console 字符卡 | 选色、捏压、小屋收集、独立黏土构图 |
| [极光](<../src/content/styles/aurora.yaml>) | G · Borealis | Aurora 邮箱/呼吸效果卡 | 光谱/强度实时光场、保存配方、不同观测参考 |
| [有机](<../src/content/styles/organic.yaml>) | G · mori / 森 | 同品牌但另一张分类/陶器插画卡 | 三种材料产品、清单/移除/合计、来源与养护内容 |
| [装饰艺术](<../src/content/styles/art-deco.yaml>) | G · THE AURELIA | 同品牌但另一套居中几何订位卡 | 称呼/日期/人数保存晚宴意向、空间/餐饮资料 |
| [企业孟菲斯](<../src/content/styles/corporate-memphis.yaml>) | G · alegria 生产力构图 | ALEGRIA 人物任务卡，与日历/数据页不同 | 原日历跨月选日、5 项任务/12 篇笔记、任务/日期进度、笔记读取新增删除、客户/计划/招聘内容 |
| [手绘](<../src/content/styles/hand-drawn.yaml>) | G · scribble& 纸张构图 | Scribble & Co. 单张便笺 | 笔记保存、关键词过滤、删除、材料/日记资料 |
| [液态玻璃](<../src/content/styles/liquid-glass.yaml>) | G · Lumen | 无品牌的局部材质试样 | 材质/厚度/角度真实试样变化、配方、光学/价格内容 |
| [像素](<../src/content/styles/pixel-art.yaml>) | G · BITMAP | PLAYER1 Pixel Quest 生命/金币卡 | 虚拟 Coin、8×8 六色画板、方向键/空格、清空、图鉴 |
| [蒸汽波](<../src/content/styles/vaporwave.yaml>) | G · MALL★95 | 同品牌但局部播放/故障面板 | 楼层导览、去重护照打卡、商店/美食/中庭资料 |

## 现在如何共享页面

[StyleScenePage](<../src/components/StyleScenePage.astro>) 与 [StyleCoverPage](<../src/components/StyleCoverPage.astro>) 都调用同一个 [StyleThumb](<../src/components/StyleThumb.astro>)。R 的整页结构继续在原参考组件中；G 的原始英雄区也没有被替换。封面关闭交互并裁取初始构图；详情的整页预览本身就是可操作页面，不存在第二份内容不同的 Demo。两类独立文档还共享[文档边界样式](<../src/styles/style-document.css>)，让根滚动策略与经典滚动条槽保持一致，避免短封面和长页出现布局宽度差。

[StyleExperience](<../src/components/StyleExperience.astro>) 仅负责惰性 iframe、真实视口宽度、模式、重置和独立打开；[ConceptDetail](<../src/components/ConceptDetail.astro>) 不再把另一套 React Demo 接在预览下方。独立打开保留当前模式及内页切换后的语言。旧设备入口也重定向到同一品牌页面。风格详情显式取消外层站点导航与章节导航吸顶，防止子文档弹窗被父文档导航遮住；[Header](<../src/components/Header.astro>) 和 [BaseLayout](<../src/layouts/BaseLayout.astro>) 的默认吸顶行为仍用于其它页面。文章/项目数据、品牌名称由 [共享数据](<../src/lib/reference-style-data.ts>) 提供。

续页内容分别在 [ReferenceStyleContent](<../src/components/ReferenceStyleContent.astro>)、[ReferenceOtherContent](<../src/components/ReferenceOtherContent.astro>) 和 [GenericStyleContent](<../src/components/GenericStyleContent.astro>)；对应行为在 [Swiss/杂志运行时](<../src/lib/reference-style-runtime.ts>)、[其他参考页运行时](<../src/lib/other-reference-runtime.ts>)、[十五种品牌运行时](<../src/lib/generic-style-runtime.ts>)。alegria 的任务、笔记和日期种子由 [team-scene-data](<../src/lib/team-scene-data.ts>) 同时供服务端首屏与运行时使用，不分别维护两份初值。

状态限定在当前文档：重置、刷新和模式切换复位；不会注册、支付、预订、发邮件、云同步或调用 AI。外层收藏与主题不受演示状态影响。SYNTH-84 使用明确的本机合成音；Aurora 草稿只在明确导出时下载。设计特征说明保持静态，不能点击「直角与留白」却偷偷改选业务方案。

## 代表性画面对照

以下为真实 Chromium 截图，不是重画设计稿。改造前后均为中文、默认模式、1088px 页面渲染宽度；原预览来自 1280px 宿主中的容器；新独立窗口按滚动条槽补偿，让场景 DOM 宽度仍为 1088px，实际窗口尺寸记录在元数据中。封面允许裁剪首屏，长页后续内容可在原位置继续滚动访问。

[全部 25 种风格前后截图索引](<images/style-pages/README.md>)与[尺寸及浏览器元数据](<images/style-pages/manifest.json>)已入库。当前封面与交互的一致性测试则使用完全相同的独立文档视口，不把宿主宽度差异或截图裁切当成一致性的证明。

### VERTEX

改造前：

![VERTEX 原始参考预览，保留大标题与红色海报](<images/style-pages/swiss-before.png>)

同一构图成为真实可操作页面：

![VERTEX 可操作初始页面](<images/style-pages/swiss-after.png>)

项目入口后的独立案例内容：

![VERTEX NORTH 案例详情及关闭返回入口](<images/style-pages/swiss-case.png>)

### The Paper Room

改造前：

![The Paper Room 原始杂志构图与照片](<images/style-pages/editorial-before.png>)

同一构图成为真实可操作页面：

![The Paper Room 可操作初始页面](<images/style-pages/editorial-after.png>)

原侧栏故事入口后的文章：

![The Paper Room 文章详情与收藏及返回控件](<images/style-pages/editorial-story.png>)

### 触屏与手机重排

WebKit iPhone 13 模拟视口为 390×844，以下截图为 3× 设备像素，不是把桌面页面整体缩小：

- VERTEX：[手机初始页面](<images/style-pages/swiss-style-mobile.png>)、[触摸打开 NORTH 项目](<images/style-pages/swiss-style-mobile-interaction.png>)。
- The Paper Room：[手机初始页面](<images/style-pages/editorial-mobile.png>)、[触摸打开并收藏文章](<images/style-pages/editorial-mobile-interaction.png>)。

## 本次统一验收记录

以下 25/25 均完成本地候选验收，不以实现接入或构建成功代替实测。尺寸按 1280、390、320 检查，双语均覆盖；当前封面与交互另在相同 1088px 独立视口逐节点比较。各行具体业务结果及返回路径见第一张清单，截图见上方索引。正式发布还必须通过源码同一 SHA 的完整工作流门禁。

| 风格 | 画面/素材对应 | 具体操作及返回 | 长页/浮层完整 | 桌面/390/320 | 双语/模式/重置/外层能力 |
| --- | --- | --- | --- | --- | --- |
| minimalism | 通过 | 通过 | 通过 | 通过 | 通过 |
| swiss-style | 通过 | 通过 | 通过 | 通过 | 通过 |
| editorial | 通过 | 通过 | 通过 | 通过 | 通过 |
| glassmorphism | 通过 | 通过 | 通过 | 通过 | 通过 |
| bento-grid | 通过 | 通过 | 通过 | 通过 | 通过 |
| neumorphism | 通过 | 通过 | 通过 | 通过 | 通过 |
| skeuomorphism | 通过 | 通过 | 通过 | 通过 | 通过 |
| brutalism | 通过 | 通过 | 通过 | 通过 | 通过 |
| neobrutalism | 通过 | 通过 | 通过 | 通过 | 通过 |
| retro-web | 通过 | 通过 | 通过 | 通过 | 通过 |
| flat-design | 通过 | 通过 | 通过 | 通过 | 通过 |
| bauhaus | 通过 | 通过 | 通过 | 通过 | 通过 |
| y2k | 通过 | 通过 | 通过 | 通过 | 通过 |
| cyberpunk | 通过 | 通过 | 通过 | 通过 | 通过 |
| memphis | 通过 | 通过 | 通过 | 通过 | 通过 |
| retro-futurism | 通过 | 通过 | 通过 | 通过 | 通过 |
| claymorphism | 通过 | 通过 | 通过 | 通过 | 通过 |
| aurora | 通过 | 通过 | 通过 | 通过 | 通过 |
| organic | 通过 | 通过 | 通过 | 通过 | 通过 |
| art-deco | 通过 | 通过 | 通过 | 通过 | 通过 |
| corporate-memphis | 通过 | 通过 | 通过 | 通过 | 通过 |
| hand-drawn | 通过 | 通过 | 通过 | 通过 | 通过 |
| liquid-glass | 通过 | 通过 | 通过 | 通过 | 通过 |
| pixel-art | 通过 | 通过 | 通过 | 通过 | 通过 |
| vaporwave | 通过 | 通过 | 通过 | 通过 | 通过 |

## 检查记录与验证边界

- 单元 357/357；Astro 检查 321 个文件，0 错误、0 警告；lint、静态构建及搜索回归通过。
- Chromium 52 项封面/旧视口回归通过，其中 50 项比较全部风格的双语初始构图，逐节点几何阈值仍为 1.5px，另断言根滚动及滚动条槽一致、静态封面零脚本。
- 最终 Chromium 24 项完整嵌入/离屏模式回归通过；Firefox/WebKit 536/536，通过且无跳过或重试成功：300 项品牌完整语义流、100 项同源比较、32 项完整嵌入流程、48 项连续键盘删除、40 项滚动隔离、16 项离屏模式导航。
- WebKit iPhone 13：50/50 双语完整品牌流程通过，把所有点击转换为真实 tap，检查可信 touchstart、touch pointer 和 click 及具体业务结果，不是只验证首个按钮。
- 按 `/interface-atlas-web` 构建的生产前缀：63/63 品牌、素材/API、嵌入及旧入口检查通过；最后显式加载修正后，额外 14/14 双语嵌入模式与旧入口通过。前后 50 份独立页面 HTML、13 个引用资源及 25 份 API 字节一致，触屏与品牌矩阵对应的页面未变化。
- 正式工作流执行完整 Chromium 994 项，必须匹配发布 SHA 且全部通过后才能部署；上述针对性本地结果不冒充已经运行完的新版本完整 CI。

执行方法与新增/修改风格的同步规则见 [维护说明](<style-reference-scenes.md>)。**实体 iOS/Android 真机未验证**；真实登录、支付、预订、邮件、云同步和 AI 后台按任务范围不实现，均有明确的本地演示结果。不能据浏览器模拟声称完成真机或真实业务验收。
