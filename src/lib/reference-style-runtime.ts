import { localePath } from './i18n';
import { getEditorialStories, SWISS_PROJECTS } from './reference-style-data';

/** 每个独立文档仅持有自己的状态；静态封面不调用。 */
export function initReferenceStyle(root: HTMLElement) {
  const slug = root.dataset.styleScene;
  if (slug !== 'swiss-style' && slug !== 'editorial') return;
  const en = root.dataset.sceneLocale === 'en';
  const l = (zh: string, english: string) => en ? english : zh;
  const stories = getEditorialStories(en ? 'en' : 'zh');
  const saved = new Set<number>();
  let currentStory = 0;
  let opener: HTMLElement | null = null;
  let navigationTarget: HTMLElement | null = null;
  function closeDialogs() {
    root.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach(d => d.close());
  }
  function openDialog(name: string, target: HTMLElement) {
    // 连续打开详情时保留页面上的首个入口，不能把焦点归还给已关闭弹窗里的按钮。
    if (!target.closest('dialog')) opener = target;
    navigationTarget = null;
    closeDialogs();
    root.querySelector<HTMLDialogElement>(`[data-scene-dialog="${name}"]`)?.showModal();
  }
  root.querySelectorAll<HTMLDialogElement>('dialog').forEach(dialog => {
    dialog.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); dialog.close(); } });
    dialog.addEventListener('close', () => {
      if (root.querySelector('dialog[open]')) return;
      // Firefox 嵌入文档需等原生关闭完成、解除 inert 后才能将焦点送往导航目的地。
      const destination = navigationTarget;
      navigationTarget = null;
      if (destination) destination.focus({preventScroll:true});
      else opener?.focus();
    });
    dialog.addEventListener('click', event => { if ((event.target as HTMLElement).closest('[data-close-dialog]')) dialog.close(); });
  });
  root.addEventListener('click', event => {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-scene-action]');
    if (!target) return;
    const action = target.dataset.sceneAction!;
    if (action === 'language') {
      const mode = document.body.dataset.mode || 'default';
      location.href = `${localePath(`/style-scenes/${slug}/`, en ? 'zh' : 'en')}?mode=${mode}`;
    } else if (action === 'home') {
      window.scrollTo({top:0});
    } else if (action === 'menu' || action === 'search') {
      openDialog(action, target);
    } else if (action.startsWith('nav-') || action === 'primary') {
      opener = null;
      const index = action === 'primary' ? 0 : Number(action.slice(4));
      const section = root.querySelector<HTMLElement>(`#scene-section-${index}`);
      navigationTarget = root.querySelector('dialog[open]') ? section : null;
      closeDialogs();
      section?.scrollIntoView({block:'start'}); section?.focus({preventScroll:true});
    } else if (action.startsWith('project-')) {
      const i = Number(action.slice(8));
      root.querySelector('[data-project-title]')!.textContent = SWISS_PROJECTS[i].title;
      const art = root.querySelector<HTMLElement>('[data-project-art]')!;
      art.textContent = SWISS_PROJECTS[i].mark;
      art.dataset.projectIndex = String(i);
      root.querySelector('[data-project-copy]')!.textContent = SWISS_PROJECTS[i].description[en ? 'en' : 'zh'];
      openDialog('project', target);
    } else if (action.startsWith('story-')) {
      currentStory = Number(action.slice(6));
      root.querySelector('#story-title')!.textContent = stories[currentStory].title;
      root.querySelector('[data-story-body]')!.textContent = stories[currentStory].body;
      root.querySelectorAll<HTMLElement>('[data-story-photo]').forEach(image => { image.hidden = image.dataset.storyPhoto !== String(currentStory); });
      updateSaved(); openDialog('story', target);
    } else if (action === 'save-story') {
      if (saved.has(currentStory)) saved.delete(currentStory); else saved.add(currentStory);
      updateSaved();
    }
  });
  function updateSaved() {
    const button = root.querySelector<HTMLButtonElement>('[data-scene-action="save-story"]');
    if (!button) return;
    button.setAttribute('aria-pressed', String(saved.has(currentStory)));
    button.textContent = saved.has(currentStory) ? l('已收藏 · 取消收藏','Saved · Remove') : l('收藏文章','Save story');
  }
  root.querySelector<HTMLInputElement>('[data-story-search]')?.addEventListener('input', event => {
    const query = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
    let count = 0;
    root.querySelectorAll<HTMLButtonElement>('[data-search-results] button').forEach(button => {
      button.hidden = !button.textContent!.toLocaleLowerCase().includes(query);
      if (!button.hidden) count++;
    });
    root.querySelector('[data-search-status]')!.textContent = l(`找到 ${count} 篇文章`,`Found ${count} stories`);
  });
  root.querySelector<HTMLFormElement>('[data-scene-form="contact"]')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const brief = String(data.get('brief') ?? '').trim();
    const status = form.querySelector('[role="status"]')!;
    if (!name || !brief) {
      status.textContent = l('请填写姓名和项目简介，不能仅为空格。','Enter a name and project brief, not just spaces.');
      return;
    }
    status.textContent = l(`已整理 ${name} 的项目简介：${brief}。可继续修改并再次提交。此演示未发送邮件。`,`Project brief for ${name}: ${brief}. You can edit and submit again. No email was sent.`);
  });
}
