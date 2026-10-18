import type { Locale } from './i18n';

export const REFERENCE_BRANDS: Record<string, string> = {
  minimalism:'LUMO', 'swiss-style':'VERTEX', editorial:'The Paper Room',
  glassmorphism:'Aurora', 'bento-grid':'◉ Tasko', neumorphism:'Mellow',
  skeuomorphism:'Daily Goods', brutalism:'STUDIO VOID', neobrutalism:'PlayLab', 'retro-web':'GoodOldNet',
};

export const SWISS_PROJECTS = [
  { title:'NORTH / Brand identity', mark:'N↗', description:{zh:'为一家城市建筑事务所建立方向清晰的品牌系统。箭头标记与压缩字体连接街道导视、项目手册和响应式网站，让复杂空间的信息一目了然。',en:'A clear identity for an urban architecture practice. An arrow mark and condensed typography connect street wayfinding, project books and a responsive website, making complex spaces easy to understand.'} },
  { title:'OPEN / Digital culture', mark:'OPEN', description:{zh:'为开放文化节设计数字入口。活动按日期与场馆组织，鲜明的文字索引与可访问的报名流程，让每位访客找到自己的下一场相遇。',en:'A digital gateway for an open culture festival. Events organized by date and venue, bold typographic indexes and accessible registration help every visitor find their next encounter.'} },
  { title:'FORM / Future objects', mark:'F/', description:{zh:'将可持续材料研究转化为可理解的产品故事。模数网格串联物件摄影、材料来源与维护指南，形成从展览标签到手机页面的一致体验。',en:'Sustainable material research becomes an understandable product story. A modular grid connects object photography, material origins and care guides, from exhibition labels to mobile pages.'} },
];

export function getEditorialStories(locale: Locale) {
  const l = (zh: string, en: string) => locale === 'zh' ? zh : en;
  return [
    { title:l('群山间的清晨','Morning in the mountains'), description:l('在山色与晨光中慢下来','Slow down with the morning light'), date:'2024.04.12', body:l('清晨的山色从蓝变绿。一杯热咖啡，伴着山谷里的风，提醒我们重新找回自己的节奏。','The mountains turn from blue to green. A warm coffee and the valley breeze help us find our own rhythm.') },
    { title:l('城市漫游指南','The art of wandering'), description:l('在熟悉的街巷中发现新鲜','A fresh look at familiar streets'), date:'2024.04.08', body:l('沿着熟悉的街道，试着走进从未注意过的小巷。城市的故事，往往藏在地图没有标注的地方。','Follow a familiar street into an unfamiliar lane. A city’s best stories live beyond the markings on a map.') },
    { title:l('慢下来的周末','A slower weekend'), description:l('关于生活节奏的重新思考','Finding your own rhythm'), date:'2024.04.01', body:l('把周末留白，不需要完成清单。读一页书、做一顿饭，让日常重新成为值得期待的事。','Leave the weekend open. Read a page, make a meal and let everyday life become something to look forward to.') },
    { title:l('与陶艺师的一次午后谈话','An afternoon with a potter'), description:l('手作器物与创作者','Objects and their makers'), date:'2024.03.28', body:l('陶艺师安在工作室里谈起第一只手作杯子。泥土的纹理与手指的痕迹，让每一件器物都有自己的故事。','In her studio, potter An remembers her first handmade cup. The clay’s texture and the maker’s fingerprints give each object its own story.') },
  ];
}
