# 风格参考样张

首页「先看风格」精选两张用户提供的《前端网页设计风格参考》中的十种视觉语言。风格列表沿用同一顺序，详情页显示更大的同款样张，并保留独立的真实交互场景。

## 表现范围

- 十种样张：极简、瑞士国际主义、杂志编辑、玻璃拟态、便当布局、新拟态、拟物主义、粗野主义、新粗野主义、复古互联网。
- 网页文字、导航外观、网格、时钟、图表、叠窗与旧浏览器边框均由 DOM/CSS/SVG 排版，未把整页截图当作界面。
- 样张中的控件外观是视觉示例，首页与列表整卡打开详情。真实可操作控件在详情的「交互场景」中；样张里的演示地址不访问外网。
- 风格条目现在共 25 种，原有 24 种仍可访问。组件实验室仍是 46 个组件 × 8 套风格，共 368 套变体；本次没有扩展组件变体范围。
- 样张使用容器相对尺寸保持参考构图。窄屏在卡片下方保留正常字号名称与入口，详情继续提供独立的响应式交互区。

## 图像与字体来源

构图依据用户在 2026-10-06 提供的两张风格参考图。下面五张照片由内建图像生成工具针对参考中的主视觉重新生成，属于构图和材质近似，不是原图素材，也不声称像素级复刻。生成图不含网页文字和控件。

| 源码资产 | 用途与生成要求 |
| --- | --- |
| `src/assets/style-scenes/minimalism.png` | 白色圆角静音设备、白石台和右后天然灰石，近白背景与柔光 |
| `src/assets/style-scenes/editorial.png` | 晨光木桌、书本、咖啡、陶瓶枝叶、窗影 |
| `src/assets/style-scenes/skeuomorphism.png` | 银黑复古相机、米白书、木桌、绿植与暖灰泥墙 |
| `src/assets/style-scenes/brutalism.png` | 低角度黑白裸露混凝土建筑、深窗洞与强阴影 |
| `src/assets/style-scenes/mountains.png` | 3:1 宽幅雪峰、蓝雾、粉紫蓝暮色天空 |

源码保留 PNG 原始生成字节，Astro Image 仅在构建时产出适合页面的 WebP。照片的可见区域由 CSS 决定；其他局部小图复用这五个资产，不新增外部图片请求。

粗黑压缩标题使用 [Anton](https://github.com/google/fonts/tree/main/ofl/anton)，版权 © 2020 The Anton Project Authors，SIL Open Font License 1.1，许可证随站点放在 `public/licenses/Anton-OFL.txt`。备用压缩英文展示字使用 [Bebas Neue](https://github.com/google/fonts/tree/main/ofl/bebasneue)，版权 © 2010 Dharma Type，SIL Open Font License 1.1。原字体保存在 `src/assets/fonts/`，许可证随站点放在 `public/licenses/BebasNeue-OFL.txt`。其余字体沿用系统字体。

## 验证与发布边界

`tests/style-reference-scenes.spec.mjs` 检查中英文、1280/390/320px、图片解码、页面溢出、首页/风格列表/详情入口、收藏及现有交互。新增复古互联网样例的留言仅存在组件状态，不发送到服务、不保存到浏览器存储。

私有 PR 工作流对 Chromium、Firefox、WebKit 分别生成与候选提交绑定的 PNG、JSON 和哈希，先保留目标截图，再跑已有完整回归。截图只作为私有 Actions 工件，不进入公开站点。此需求分支排除自动公开预览和手动生产发布；验收通过不自动合并或上线。
