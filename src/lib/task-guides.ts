import type { Locale } from './i18n';

type Copy = Record<Locale, string>;
export type TaskGuide = {
  id: string;
  title: Copy;
  intro: Copy;
  outcome: Copy;
  picks: { path: string; title: Copy; why: Copy }[];
};

export const TASK_GUIDES: TaskGuide[] = [
  {
    id: 'dashboard',
    title: { zh: '我要做一个后台页面', en: 'Build an admin workspace' },
    intro: { zh: '从导航到数据操作，先把常见任务串成一条清楚的路径。', en: 'Connect navigation, data and actions into a clear daily workflow.' },
    outcome: { zh: '先用侧栏确定位置，用表格浏览数据，再选择筛选方式。保留加载、空结果和失败状态，最后才决定视觉风格。', en: 'Establish location with a sidebar, scan data in a table, then choose a filtering pattern. Account for loading, empty results and failure before choosing a visual style.' },
    picks: [
      { path: '/pages/dashboard', title: { zh: '仪表盘：确定页面骨架', en: 'Dashboard: establish the page' }, why: { zh: '先确定哪些指标需要立即看到，哪些操作需要深入。不要让所有卡片抢同一层注意力。', en: 'Decide which metrics need immediate attention and which actions need detail. Avoid giving every card the same emphasis.' } },
      { path: '/components/sidebar', title: { zh: '侧边栏：告诉用户身在何处', en: 'Sidebar: establish location' }, why: { zh: '适合频繁切换的稳定分区。导航很多时按任务分组，小屏保留明确的打开与关闭入口。', en: 'Use for stable, frequently visited sections. Group navigation by task and provide clear open and close controls on small screens.' } },
      { path: '/components/table', title: { zh: '表格：比较与操作同类数据', en: 'Table: compare similar records' }, why: { zh: '适合逐行比较字段。先确定最关键列，窄屏允许横向滚动，不把所有单元格挤得无法阅读。', en: 'Use when users compare fields across rows. Prioritize important columns and allow horizontal scrolling instead of squeezing every cell.' } },
      { path: '/compare/overlay-container', title: { zh: '弹窗与抽屉：选择筛选空间', en: 'Modal vs drawer: choose a filtering space' }, why: { zh: '筛选时是否需要看到背景结果？体验遮挡、关闭与保留选择，再决定使用哪个容器。', en: 'Do users need to see background results while filtering? Compare occlusion, closing and retained choices before choosing a container.' } },
      { path: '/patterns/empty-state', title: { zh: '空状态：给出下一步', en: 'Empty state: provide a next step' }, why: { zh: '区分还没有数据与筛选后没有结果，分别提供创建与清除筛选的操作。', en: 'Distinguish no data yet from no matching results; offer creation or clearing filters accordingly.' } },
    ],
  },
  {
    id: 'forms',
    title: { zh: '我要让表单更容易填写', en: 'Make a form easier to complete' },
    intro: { zh: '亲手走完填写、校验、失败与恢复，理解组件怎样组成一个完整流程。', en: 'Try input, validation, failure and recovery to see how components form a complete flow.' },
    outcome: { zh: '保留用户已经填写的内容，在字段旁说明如何修正，保存时防止重复提交，失败后允许重试。下面的两个样板可以完整体验这些状态。', en: 'Preserve entered values, explain corrections beside each field, prevent duplicate submissions and allow retries after failure. The two interactive examples below cover the complete path.' },
    picks: [
      { path: '/components/input', title: { zh: '输入框：标签与帮助先行', en: 'Input: start with labels and help' }, why: { zh: '标签持续可见，示例只作补充。先告诉用户要填什么，再在必要时指出错误。', en: 'Keep labels visible and use examples as supporting text. Explain what is needed before showing an error.' } },
      { path: '/patterns/form-validation', title: { zh: '表单校验：解释如何改正', en: 'Validation: explain the correction' }, why: { zh: '错误与字段关联，并把焦点带到第一个错误。校验失败不清空已经填写的内容。', en: 'Associate errors with fields and move focus to the first invalid field. Failed validation must not erase entered values.' } },
      { path: '/components/file-upload', title: { zh: '文件上传：让过程可理解', en: 'Upload: make progress understandable' }, why: { zh: '选择、上传中、失败、重试和完成都需要反馈。浏览器选择文件并不等于服务器已经保存。', en: 'Provide feedback for selection, upload, failure, retry and completion. Choosing a local file does not mean it has been saved on a server.' } },
      { path: '/components/alert', title: { zh: '提示信息：把恢复操作放近一点', en: 'Alert: keep recovery close' }, why: { zh: '需要用户处理的错误持续显示，说明发生了什么以及下一步可以做什么。', en: 'Keep actionable errors visible and explain both what happened and what the user can do next.' } },
      { path: '/foundation/spacing-scale', title: { zh: '间距：让关系一眼可见', en: 'Spacing: reveal relationships' }, why: { zh: '同一字段的标签、输入和帮助文字靠近，不同字段组之间留出更大的空间。', en: 'Keep a field’s label, input and help close together, with more space between separate groups.' } },
    ],
  },
  {
    id: 'identify',
    title: { zh: '我想知道截图里的效果叫什么', en: 'Name what you see in a screenshot' },
    intro: { zh: '先拆结构，再认效果：用一张编号示意图找到可以借用的具体部分。', en: 'Separate structure from effects, then use numbered examples to name the parts you want to borrow.' },
    outcome: { zh: '对照你手上的截图，先找导航、内容分组、主操作与浮层，再找透明、模糊、阴影等视觉特征。这是人工对照指南，不会上传或自动识别图片。', en: 'Compare your screenshot with navigation, content groups, primary actions and overlays, then look for transparency, blur and shadows. This is a manual visual guide; it does not upload or automatically identify images.' },
    picks: [
      { path: '/components/sidebar', title: { zh: '侧边栏 Sidebar', en: 'Sidebar' }, why: { zh: '边缘固定的一列入口用来切换主要分区。临时出现的面板可能是抽屉，要结合交互判断。', en: 'A persistent column of navigation switches primary sections. A temporary panel may be a drawer; the interaction matters.' } },
      { path: '/components/card', title: { zh: '卡片 Card', en: 'Card' }, why: { zh: '把同一个对象的标题、描述与操作放在一起。卡片适合独立内容，不要用过多边框把连续信息切碎。', en: 'Group one object’s title, description and actions. Cards work for independent content; too many borders fragment continuous information.' } },
      { path: '/components/button', title: { zh: '主操作按钮 Primary button', en: 'Primary button' }, why: { zh: '更醒目的填充提示下一步。一个任务区域通常只需要一个主要操作，不能只靠颜色区分含义。', en: 'A stronger fill emphasizes the next step. A task area usually needs one primary action; meaning must not depend on color alone.' } },
      { path: '/styles/glassmorphism', title: { zh: '玻璃拟态 Glassmorphism', en: 'Glassmorphism' }, why: { zh: '背景透出并带模糊效果。它是视觉风格，不是组件名称；复杂背景下要特别检查文字对比度。', en: 'Background content shows through a blurred surface. This is a visual style, not a component; check text contrast over complex backgrounds.' } },
    ],
  },
];

export function taskPrompt(guide: TaskGuide, locale: Locale): string {
  const intro = locale === 'zh' ? '请实现以下界面任务' : 'Implement this interface task';
  const needs = locale === 'zh'
    ? '实现要求：提供响应式布局、可见焦点和键盘操作；为加载、空结果、错误与成功提供明确反馈；不只靠颜色表达状态。先说明技术栈与必要假设。'
    : 'Requirements: responsive layout, visible focus and keyboard operation; clear loading, empty, error and success feedback; never rely on color alone. State the stack and necessary assumptions first.';
  const flows = guide.id === 'forms' ? (locale === 'zh'
    ? '\n\n完整流程：\n- 文件上传：选择文件 → 显示文件名 → 上传进度 → 可取消 → 失败并保留选择 → 重试 → 成功 → 删除；明确文件类型和大小限制，并区分本地选择与服务器持久化。\n- 编辑资料：字段标签 → 必填与邮箱校验 → 聚焦第一个错误 → 保存中禁用重复提交 → 失败保留输入 → 重试 → 成功反馈；离开未保存内容时提供继续编辑和放弃修改。\n- 演示可使用可控的一次性失败；实际项目必须接入真实接口，不把模拟成功当作已保存。'
    : '\n\nComplete workflows:\n- File upload: choose → show file name → upload progress → cancellation → failure retaining selection → retry → success → removal. State accepted types and size limits; distinguish local selection from server persistence.\n- Edit profile: persistent labels → required and email validation → focus first invalid field → prevent duplicate saves → preserve input on failure → retry → success feedback; offer keep editing or discard when leaving unsaved changes.\n- A demo may use a controllable one-time failure. Production must use real endpoints; never report simulated success as persisted data.') : '';
  return `${intro}：${guide.title[locale]}\n\n${guide.outcome[locale]}\n\n${guide.picks.map(p => `- ${p.title[locale]}：${p.why[locale]}`).join('\n')}${flows}\n\n${needs}`;
}
