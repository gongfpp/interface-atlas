# 三种现有样板的视觉迭代 · 2026-10-23

本轮范围为 Art Deco、Cyberpunk、Organic。核心目标是让首屏、导航后的内容和操作结果具备连续的品牌识别，按 typography、whitespace、visual hierarchy、color、motion、micro interaction、responsive、originality 八个维度逐项检查。保持原品牌、文案、导航、业务流程、中英版本和本地内存状态边界；不新增业务功能、不引入依赖。用户未批准降低任何体验目标。

## 对照依据与边界

[Awwwards — Moooi Digital flagship store](https://www.awwwards.com/sites/moooi-digital-flagship-store) 是 2020-12-01 Site of the Day；本轮实际查看官方留存首屏截图，对照其单一视觉焦点、轻字重标题、建筑纵深与克制的动作入口。这里借鉴构图原则，不复制素材、布局或品牌。

[Webby Best Visual Design – Aesthetic](https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-visual-design-aesthetic) 用于核对视觉评审范围，当前页面列出 Igloo Inc；[FWA Igloo Inc](https://thefwa.com/cases/igloo-inc) 动态案例页未能取得可读正文，浏览器参考页连接也超时，因此没有把其动态效果写成已经对照验证的结论。

获奖是外部评审结果，“没有任何可见改进空间”也不是可客观证明的完成条件。本轮记录实际观察、修正和验证，不宣称获奖或输出无差距认证。

| 维度 | 发现的差距 | 本轮落地与可观察验收 |
| --- | --- | --- |
| Typography | 主视觉虽换色，标题与控件仍偏同款 | AURELIA 轻衬线与宽字距标签；NEON 等宽高对比；MORI 轻衬线搭无衬线正文。320px 标题不越界 |
| Whitespace | 平铺卡片和大面积空色块缺少节奏 | MORI 图片与开放式商品排版；AURELIA 轴线和拱形结果卡；NEON 用留白与细线划分层级 |
| Visual hierarchy | 通用几何、柱状图和简化景观没有明确焦点 | 金色拱廊 / 城市信号图 / 自然静物各自成为主视觉；操作结果继续使用相同语言 |
| Color | NEON 辅助文字偏暗，光晕泛滥 | 提升正文和导航对比，减少泛光；三种模式中正文、选中与表单反馈保持可读 |
| Motion | 状态变化缺少品牌节奏 | AURELIA 280ms 入场和描边；NEON 160ms 阶梯入场、连接后一次信号展开；MORI 320ms 入场。不持续闪烁，减少动态模式关闭动画 |
| Micro interaction | 只有通用按钮背景反馈 | 输入与键盘焦点沿用原可访问控件；装备选中变亮、晚宴结果描边、商品图轻微缩放和清单入场 |
| Responsive | 主视觉和宽屏装饰容易被裁切 | SVG 完整缩放，装饰与语义文字分离；390/320px 单栏重排，原返回、清空、模式与重置路径可操作 |
| Originality | 三套样板仍共享通用占位图形 | 原创拱廊和信号图代码、为 MORI 单独生成统一光线的四张静物，未引用第三方获奖网站资产 |

第一轮实际画面复查发现城市图使用 slice 会裁掉上下标注，已改为完整展示；截图需要等待真实图像解码而不是把底色占位当作图片验收。开发服务器注入的工具条会挡住 320px 页尾按钮，也会使静态封面出现脚本；正式回归改为使用生产构建，不更改断言规避问题。

## 素材来源

四张图使用内置 imagegen 生成，日期 2026-10-23；无外部参考照片输入。原文件转为 WebP，Astro 再生成响应式尺寸。图片是虚构样板商品的 AI 静物，不是实际商品摄影。

- `src/assets/style-scenes/organic-still-life.webp`：主视觉。
- `src/assets/style-scenes/organic-linen.webp`：亚麻靠垫。
- `src/assets/style-scenes/organic-ceramic.webp`：陶杯。
- `src/assets/style-scenes/organic-wood.webp`：木托盘。

主图提示词：

> Use case: photorealistic-natural. Create one wide 3:2 landscape editorial still-life photograph for the existing 'mori / 森' natural homewares website. A sculptural matte terracotta handled cup rests on a low oval ashwood tray in the foreground, a softly creased natural flax linen cushion stands just behind on the left, a slender leafy olive branch enters from the upper right. Quiet sculptural composition on pale warm limestone, muted sage plaster wall, late afternoon side sunlight making a single beautiful diagonal shadow. Refined Japanese natural living editorial, tactile irregular ceramic, visible linen weave, honest wood grain, restrained earth palette of sand, moss and warm clay. All three products fully in frame with generous breathing room, centered composition works cropped to wide panorama or square. Shot on medium format 80mm, natural perspective, crisp material detail with gentle focus falloff. No text, no typography, no logo, no people, no border, no mockup, no collage, no decorative graphic overlays.

商品图共享提示词，分别替换 Subject：

> Use case: product-mockup. Editorial product photograph for the mori natural homewares catalog. Subject: [Subject]. One object alone fully visible, centered, generous whitespace around it, pale warm limestone ground and muted sage plaster backdrop, beautiful afternoon side light and soft diagonal shadow. High end Japanese natural living magazine art direction, tactile realistic materials, subdued sand, clay, moss palette. 4:3 landscape crop, natural 80mm perspective, not an overhead view. No text, no branding, no props, no people, no collage, no border.

- Linen Subject: one square natural flax linen cushion, finely visible woven fibers, soft creases and subtle piped seam
- Ceramic Subject: one hand-thrown matte warm terracotta ceramic cup with a single rounded handle, visible subtle clay texture
- Wood Subject: one empty low oval ashwood serving tray, raised shallow rim and beautiful honest flowing wood grain

## 运行验证

本地生产构建 500 页通过；类型检查 0 错误 / 0 警告，lint、单元检查、30 条黄金搜索通过。三种样板定向 Chromium 44 项最终通过（首轮 43 通过，1 项封面比较捕获了初始过渡；等待有限动画结束后 6 项封面对比复验通过）；WebKit 44 项全部通过。覆盖中英文、1280/390/320px、模式与重置、键盘选择器、状态反馈和商品图片加载。额外完成 12 组桌面/手机实际操作画面及 3 种减少动态检查，页面无横向溢出、无运行错误。

[Art Deco 实际运行截图](images/style-signatures/art-deco.png) · [Cyberpunk 实际运行截图](images/style-signatures/cyberpunk.png) · [Organic 实际运行截图](images/style-signatures/organic.png) · [手机浅色结果](images/style-signatures/art-deco-mobile.png)

三站正式发布由同一提交的完整 verify 门禁触发；远端全量结果及上线后的实际访问另行核对，不能由上述本地结果推定。
