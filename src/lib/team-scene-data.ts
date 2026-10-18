/** alegria 场景的固定演示数据；封面、正文与运行时使用同一份初始记录。 */
type TeamLocale = 'zh' | 'en';
export const TEAM_INITIAL_DATE = '2024-01-17';
export const TEAM_INITIAL_YEAR = 2024;
export const TEAM_INITIAL_MONTH = 0;

export function getTeamSceneData(locale: TeamLocale) {
  const l = (zh: string, en: string) => locale === 'zh' ? zh : en;
  const tasks = [
    [l('整理欢迎页文案', 'Review welcome-page copy'), 'Alex'],
    [l('确认插画配色', 'Confirm illustration colors'), 'Jamie'],
    [l('检查移动端布局', 'Check the mobile layout'), 'Sam'],
    [l('准备团队演示', 'Prepare the team walkthrough'), 'Alex'],
    [l('分享本周进展', 'Share this week’s progress'), 'Jamie'],
  ].map(([text, detail]) => ({ text, detail, done: false, due: TEAM_INITIAL_DATE }));
  const notes = [
    [l('欢迎页的第一句话', 'The first line of the welcome page'), l('用一句友好的问候开始，让新伙伴知道下一步去哪里。', 'Begin with a friendly greeting and show new teammates where to go next.')],
    [l('品牌配色', 'Brand colors'), l('紫色用于关键操作，黄色与桃色用于轻松的辅助插画。', 'Use violet for key actions, with yellow and peach for friendly supporting illustrations.')],
    [l('每周站会', 'Weekly stand-up'), l('每个人分享一项进展、一件困难和一个需要帮助的地方。', 'Share one update, one challenge and one place where help would make a difference.')],
    [l('远程协作约定', 'Remote collaboration'), l('先写下背景与目标，再邀请同伴讨论；不要默认每个人同时在线。', 'Write down context and goals before inviting discussion. Do not assume everyone is online together.')],
    [l('欢迎新伙伴', 'Welcoming a teammate'), l('准备入门清单，介绍一位可以随时提问的伙伴。', 'Prepare an onboarding checklist and introduce someone who can answer questions.')],
    [l('无障碍检查', 'Accessibility check'), l('检查键盘焦点、按钮名称和小屏幕上的点击范围。', 'Check keyboard focus, button names and touch targets on small screens.')],
    [l('客户反馈', 'Customer feedback'), l('把观察与推测分开记录，保留原话，也写清使用场景。', 'Separate observations from assumptions. Keep the original wording and the usage context.')],
    [l('设计交接', 'Design handoff'), l('除了画面，还要说明空状态、错误状态与交互后的结果。', 'Explain empty states, errors and interaction outcomes, not just the finished screen.')],
    [l('内容语气', 'Tone of voice'), l('清楚、友好、具体。不用一句泛泛的成功提示代替实际结果。', 'Clear, friendly and specific. Show the actual result instead of a generic success message.')],
    [l('下次迭代', 'The next iteration'), l('先解决阻碍用户完成任务的问题，再考虑增加新的功能。', 'Remove barriers to completing a task before adding new features.')],
    [l('小小的进步', 'Small steps'), l('每完成一件小事，就给团队留一条可以看见的进展。', 'Make each small accomplishment visible to the team.')],
    [l('周末之前', 'Before the weekend'), l('整理未完成的事项，写清下一步，然后放心休息。', 'Review unfinished work, write down the next step and take a proper break.')],
  ].map(([title, body], i) => ({ id: `note-${i+1}`, title, body }));
  return { tasks, notes };
}

/** 周一开头的固定六周网格，切月不会改变卡片高度。 */
export function getTeamCalendarDays(year: number, month: number): (number | null)[] {
  const date = new Date(0);
  date.setUTCFullYear(year, month, 1);
  const offset = (date.getUTCDay() + 6) % 7;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const length = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  return Array.from({ length: 42 }, (_, i) => i >= offset && i < offset + length ? i-offset+1 : null);
}

export function teamDate(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, '0')}-${String(month+1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function teamMonthLabel(year: number, month: number, locale: TeamLocale): string {
  const zh = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
  const en = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${(locale === 'zh' ? zh : en)[month]} ${year}`;
}
