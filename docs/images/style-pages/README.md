# 25 种风格的原始预览与同源页面证据

这些图片仅用于验收，不用于列表封面渲染。实际封面与交互均使用共享 DOM。

- 原始图片保留自源码基线 `9e652dc8fb1c64b2abf7109b3f3e0bd15111871c`，不可用新页面替换历史基线。
- 以下均为中文、默认模式、1088px 页面渲染宽度。原预览来自 1280px 宿主窗口中的 1088px 容器；新独立文档按实际滚动条槽补偿窗口宽度，使共享场景的 DOM 宽度仍为 1088px。各图保留实际高度，没有强制缩放或拉伸。
- 一致性自动测试另在完全相同的独立文档视口下逐节点比较**当前封面与当前交互**的内容、素材、字体、颜色和几何：参考风格 20 项、配置风格 30 项。
- 原生控件的可读字号、真实触控目标和必要高度是明确的交互改进；不会将旧的微缩文字放大视为同一手机布局。
- [截图元数据](<manifest.json>)记录原始尺寸、浏览器版本与各文件位置；[逐风格验收](<../../style-page-acceptance.md>)记录行为、设备与现有能力检查。

| 风格 | 原始预览 | 当前完整页面首屏 |
| --- | --- | --- |
| minimalism | [前](<baseline/minimalism.png>) | [后](<current/minimalism.png>) |
| swiss-style | [前](<baseline/swiss-style.png>) | [后](<current/swiss-style.png>) |
| editorial | [前](<baseline/editorial.png>) | [后](<current/editorial.png>) |
| glassmorphism | [前](<baseline/glassmorphism.png>) | [后](<current/glassmorphism.png>) |
| bento-grid | [前](<baseline/bento-grid.png>) | [后](<current/bento-grid.png>) |
| neumorphism | [前](<baseline/neumorphism.png>) | [后](<current/neumorphism.png>) |
| skeuomorphism | [前](<baseline/skeuomorphism.png>) | [后](<current/skeuomorphism.png>) |
| brutalism | [前](<baseline/brutalism.png>) | [后](<current/brutalism.png>) |
| neobrutalism | [前](<baseline/neobrutalism.png>) | [后](<current/neobrutalism.png>) |
| retro-web | [前](<baseline/retro-web.png>) | [后](<current/retro-web.png>) |
| flat-design | [前](<baseline/flat-design.png>) | [后](<current/flat-design.png>) |
| bauhaus | [前](<baseline/bauhaus.png>) | [后](<current/bauhaus.png>) |
| y2k | [前](<baseline/y2k.png>) | [后](<current/y2k.png>) |
| cyberpunk | [前](<baseline/cyberpunk.png>) | [后](<current/cyberpunk.png>) |
| art-deco | [前](<baseline/art-deco.png>) | [后](<current/art-deco.png>) |
| retro-futurism | [前](<baseline/retro-futurism.png>) | [后](<current/retro-futurism.png>) |
| claymorphism | [前](<baseline/claymorphism.png>) | [后](<current/claymorphism.png>) |
| aurora | [前](<baseline/aurora.png>) | [后](<current/aurora.png>) |
| organic | [前](<baseline/organic.png>) | [后](<current/organic.png>) |
| liquid-glass | [前](<baseline/liquid-glass.png>) | [后](<current/liquid-glass.png>) |
| memphis | [前](<baseline/memphis.png>) | [后](<current/memphis.png>) |
| corporate-memphis | [前](<baseline/corporate-memphis.png>) | [后](<current/corporate-memphis.png>) |
| hand-drawn | [前](<baseline/hand-drawn.png>) | [后](<current/hand-drawn.png>) |
| pixel-art | [前](<baseline/pixel-art.png>) | [后](<current/pixel-art.png>) |
| vaporwave | [前](<baseline/vaporwave.png>) | [后](<current/vaporwave.png>) |

## 修改页面后的同步

修改共享页面、数据或 CSS 并构建，封面、详情 iframe、独立页面即同时更新，不需要截图作为发布输入。回归当前同源几何：

```sh
npm run build
npx playwright test tests/style-full-pages.spec.mjs tests/style-generic-parity.spec.mjs --grep 1088px
```

需要更新验收图时，以 Chromium 打开对应 `/style-scenes/{slug}/`，固定中文、默认模式与 900px 窗口高度；先从 1088px 窗口宽度读取 `[data-style-scene]` 的实际宽度，再补偿滚动条槽，确保场景 DOM 宽度为 1088px。等待字体与图片解码，把鼠标移到左上角，保存真实首屏裁剪及实际窗口元数据，不做图像缩放。完整页与手机证据见相应浏览器测试附件；不截取未完成加载、带操作状态的图片充作默认初始状态。
