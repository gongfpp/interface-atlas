import { expect } from '@playwright/test';
import { STYLE_SLUGS, REFERENCE_STYLES, pathFor } from './style-page-flows.mjs';

export { STYLE_SLUGS };
export const FOCUS_STYLES = ['glassmorphism', 'neobrutalism', 'neumorphism', 'swiss-style', 'claymorphism', 'liquid-glass'];
export const SELECT_STYLES = ['minimalism', 'glassmorphism', 'neumorphism', 'skeuomorphism', 'neobrutalism', 'flat-design', 'y2k', 'cyberpunk', 'memphis', 'claymorphism', 'aurora', 'art-deco', 'corporate-memphis', 'hand-drawn', 'liquid-glass', 'vaporwave'];
export const DIALOG_STYLES = ['minimalism', 'swiss-style', 'editorial', 'glassmorphism', 'bento-grid', 'neumorphism', 'skeuomorphism', 'brutalism', 'neobrutalism', 'retro-web'];
const action = (root, name) => root.locator(`[data-scene-action="${name}"]`).first();
const command = (root, name) => root.locator(`[data-command="${name}"]`).first();

export async function openStyleStatePage(page, slug, locale = 'zh', mode = 'default') {
  await page.goto(pathFor(locale, `/style-scenes/${slug}/?mode=${mode}`));
  const root = page.locator(`[data-style-scene="${slug}"][data-scene-interactive="true"]`);
  await expect(root).toBeVisible();
  await expect(root).toHaveAttribute('data-scene-locale', locale);
  await root.evaluate(() => document.fonts.ready);
  return root;
}

export async function computedState(root, targets = []) {
  return root.evaluate((scene, selectors) => {
    const visible = element => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden';
    const nodes = new Set([scene]);
    for (const selector of ['dialog[open]', '[role="listbox"]', '[role="option"]', '[role="status"]', 'button', 'input', 'textarea', 'select', ...selectors]) {
      scene.querySelectorAll(selector).forEach(element => { if (visible(element)) nodes.add(element); });
    }
    const keys = ['display','position','backgroundColor','backgroundImage','backgroundSize','borderTopWidth','borderTopStyle','borderTopColor','borderRightWidth','borderBottomWidth','borderLeftWidth','paddingTop','paddingRight','paddingBottom','paddingLeft','borderRadius','boxShadow','backdropFilter','webkitBackdropFilter','filter','color','fontFamily','fontSize','fontWeight','lineHeight','outlineStyle','outlineWidth','outlineColor','opacity','minHeight','maxHeight'];
    return {
      slug: scene.dataset.styleScene, locale: scene.dataset.sceneLocale, mode: document.body.dataset.mode,
      viewport: { width: innerWidth, height: innerHeight }, url: location.href,
      dialogApplicable: !!scene.querySelector('dialog'),
      openDialogs: [...scene.querySelectorAll('dialog[open]')].map(element => element.dataset.otherDialog || element.dataset.sceneDialog),
      elements: [...nodes].map(element => {
        const styles = getComputedStyle(element), rect = element.getBoundingClientRect();
        return {
          tag: element.tagName, id: element.id, className: element.getAttribute('class'),
          action: element.dataset.sceneAction || element.dataset.command || '',
          role: element.getAttribute('role'), expanded: element.getAttribute('aria-expanded'), pressed: element.getAttribute('aria-pressed'), feedback: element.hasAttribute('data-feedback'), formState: element.dataset.state || null,
          material: element.dataset.material || null, value: 'value' in element ? element.value : null,
          text: (element.getAttribute('aria-label') || element.textContent || '').trim().slice(0, 240),
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          styles: Object.fromEntries(keys.map(key => [key, styles[key]])),
          optionSample: element.getAttribute('role') === 'option' ? (() => {
            const sample = getComputedStyle(element, '::before');
            return Object.fromEntries(['content','backgroundColor','backgroundImage','backdropFilter','boxShadow','borderRadius','width','height'].map(key => [key, sample[key]]));
          })() : null,
        };
      }),
    };
  }, targets);
}

// native popup属于浏览器UI，不把单张page截图中的闭合select冒充展开证据。
export async function captureSelectState(select, capture, name = 'select-expanded') {
  const label = select.locator('xpath=ancestor::label[1]');
  const enhanced = label.locator('button[role="combobox"]');
  if (await enhanced.count()) {
    await enhanced.click();
    await expect(enhanced).toHaveAttribute('aria-expanded', 'true');
    const id = await enhanced.getAttribute('aria-controls');
    const listbox = select.page().locator(`[role="listbox"][id="${id}"]`);
    await expect(listbox).toBeVisible();
    await expect(listbox.getByRole('option')).not.toHaveCount(0);
    await capture(name, { stateIntent: name, kind: 'dom-listbox-expanded', targets: ['[role="combobox"]', '[role="listbox"]'], expandedVerified: true });
    await enhanced.press('Escape');
    await expect(listbox).not.toBeVisible();
    await expect(enhanced).toHaveAttribute('aria-expanded', 'false');
    return;
  }
  await select.focus();
  await select.press('Space');
  const nativeOpen = await select.evaluate(element => { try { return element.matches(':open'); } catch { return null; } });
  await capture(`${name}-native-attempt`, {
    stateIntent: name, kind: 'native-popup-attempt', targets: ['select'], expandedVerified: false,
    nativeOpenPseudo: nativeOpen, note: 'Native browser popup pixels are not guaranteed in a page screenshot; this is not DOM-expanded visual evidence.',
  });
  // 旧版dialog的Esc处理会连同原生popup关闭父dialog；Tab退出原生UI，不伪造DOM listbox。
  await select.press('Tab');
}

export async function selectForState(select, value) {
  await select.selectOption(value);
}

export async function representativeSelect(root, slug) {
  if (['minimalism', 'skeuomorphism'].includes(slug)) {
    await action(root, 'primary').click(); await action(root, 'goods-detail-0').click();
  } else if (slug === 'glassmorphism') await action(root, 'aurora-create').click();
  else if (slug === 'neobrutalism') await action(root, 'play-brief').click();
  else await action(root, 'primary').click();
  const selectors = {
    minimalism:'[data-product-finish]', skeuomorphism:'[data-product-finish]', glassmorphism:'[name="tone"]', neumorphism:'[data-mellow-duration]', neobrutalism:'[name="timeline"]',
    'flat-design':'[name="plan"]', y2k:'[name="outfit"]', cyberpunk:'[data-district]', memphis:'[name="palette"]', claymorphism:'[data-clay-color]', aurora:'[data-spectrum]',
    'art-deco':'[name="guests"]', 'corporate-memphis':'[name="owner"]', 'hand-drawn':'[name="paper"]', 'liquid-glass':'[data-glass-material]', vaporwave:'[data-floor]',
  };
  if (!selectors[slug]) throw new Error(`无select代表路径：${slug}`);
  return root.locator(`select${selectors[slug]}`).first();
}

export async function holdPressState(button, capture) {
  await button.scrollIntoViewIfNeeded();
  const box = await button.boundingBox();
  const page = button.page();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  try { await capture(); } finally { await page.mouse.up(); }
}

/** 每风格一条短代表路径；在弹层关闭前、真实下拉展开时和具体反馈出现后采集。 */
export async function runStyleStatePath(page, slug, locale, capture = async () => {}) {
  const root = page.locator(`[data-style-scene="${slug}"]`);
  const form = name => root.locator(`[data-generic-form="${name}"]`);
  const otherForm = name => root.locator(`[data-other-form="${name}"]`);
  const otherDialog = name => root.locator(`[data-other-dialog="${name}"]`);
  const en = locale === 'en';
  let dialogCaptured = false;
  const record = (name, options = {}) => {
    if (options.kind === 'dialog-open') dialogCaptured = true;
    return capture(name, { slug, locale, dialogApplicable: DIALOG_STYLES.includes(slug), ...options });
  };
  const dropdown = async (select, value) => { await captureSelectState(select, record); await selectForState(select, value); };
  const submit = async (target, fields) => {
    for (const [name, value] of Object.entries(fields)) await target.locator(`[name="${name}"]`).fill(value);
    await target.locator('[type="submit"]').click();
  };
  if (['minimalism','skeuomorphism'].includes(slug)) {
    await action(root, 'primary').click(); await action(root, 'goods-detail-0').click();
    const dialog = otherDialog('product'); await expect(dialog).toBeVisible();
    await record('product-dialog-open', { kind: 'dialog-open', targets: ['[data-other-dialog="product"]', '[data-product-title]'] });
    await dropdown(dialog.locator('[data-product-finish]'), { index: 1 });
    await action(dialog, 'goods-add').click(); await expect(dialog.locator('[data-product-status]')).toContainText(en ? 'Added' : '已加入');
    await record('product-added-status', { targets: ['[data-product-status]'] });
  } else if (slug === 'swiss-style') {
    await action(root, 'primary').click(); await action(root, 'project-0').click();
    await expect(root.locator('[data-scene-dialog="project"]')).toBeVisible();
    await record('project-dialog-open', { kind: 'dialog-open', targets: ['[data-scene-dialog="project"]','[data-project-copy]'] });
    await root.locator('[data-scene-dialog="project"] [data-close-dialog]').click();
    await action(root, 'nav-3').click();
    await submit(root.locator('[data-scene-form="contact"]'), { name: 'State Atlas', email: 'state@example.com', brief: 'A clear library identity.' });
    await expect(root.locator('[data-scene-form="contact"] [role="status"]')).toContainText('A clear library identity.');
    await record('contact-status', { targets: ['[data-scene-form="contact"]'] });
  } else if (slug === 'editorial') {
    await action(root, 'story-0').click();
    const dialog = root.locator('[data-scene-dialog="story"]'); await expect(dialog).toBeVisible();
    await action(dialog, 'save-story').click(); await expect(action(dialog, 'save-story')).toHaveAttribute('aria-pressed','true');
    await record('saved-story-dialog', { kind: 'dialog-open', targets: ['[data-scene-dialog="story"]','[data-story-body]'] });
  } else if (slug === 'glassmorphism') {
    await action(root, 'aurora-feature-0').click(); await expect(otherDialog('aurora-feature')).toBeVisible();
    await record('aurora-feature-dialog', { kind: 'dialog-open', targets: ['[data-other-dialog="aurora-feature"]','[data-feature-copy]'] });
    await otherDialog('aurora-feature').locator('[data-other-close]').click(); await action(root, 'aurora-create').click();
    await dropdown(otherForm('aurora').locator('[name="tone"]'), 'clear');
    await submit(otherForm('aurora'), { topic: 'A rainy atlas' });
    await expect(root.locator('[data-aurora-draft]')).toHaveValue(/A rainy atlas/);
    await action(root, 'aurora-save').click(); await expect(root.locator('[data-aurora-status]')).toContainText(en ? 'snapshot saved' : '已保存');
    await record('aurora-saved-status', { targets: ['[data-aurora-status]','[data-aurora-draft]'] });
  } else if (slug === 'bento-grid') {
    await action(root, 'primary').click(); await submit(otherForm('task'), { task: 'An atlas task' });
    await expect(root.locator('[data-task-status]')).toContainText('0 / 6');
    await record('task-added-status', { targets: ['[data-task-status]','.task-list'] });
  } else if (slug === 'neumorphism') {
    await action(root, 'primary').click(); await dropdown(root.locator('[data-mellow-duration]'), '5');
    await holdPressState(action(root, 'mellow-toggle'), () => record('mellow-active-press', { kind: 'pointerdown-held', targets: ['[data-scene-action="mellow-toggle"]'] }));
    await expect(root.locator('[data-focus-status]')).toContainText(en ? 'Focusing' : '专注中');
    await record('mellow-running', { targets: ['[data-focus-time]','[data-scene-action="mellow-toggle"]','[data-focus-status]'] });
    await action(root, 'mellow-toggle').click(); await expect(root.locator('[data-focus-status]')).toContainText(en ? 'Paused' : '已暂停');
    await record('mellow-paused', { targets: ['[data-focus-status]','[data-scene-action="mellow-toggle"]'] });
  } else if (slug === 'brutalism') {
    await action(root, 'primary').click(); await action(root, 'void-case-0').click(); await expect(otherDialog('void-case')).toBeVisible();
    await record('void-case-dialog', { kind: 'dialog-open', targets: ['[data-other-dialog="void-case"]'] });
    await otherDialog('void-case').locator('[data-other-close]').click(); await action(root, 'nav-3').click();
    await submit(otherForm('void-contact'), { name: 'Atlas', email: 'state@example.com', brief: 'A public map.' });
    await expect(root.locator('[data-contact-summary]')).toContainText('A public map.'); await record('inquiry-status');
  } else if (slug === 'neobrutalism') {
    await action(root, 'nav-0').click();
    await record('playlab-continuation', { targets: ['.other-neobrutalism .other-cards button'] });
    await action(root, 'play-brief').click(); const dialog = otherDialog('play-brief'); await expect(dialog).toBeVisible();
    await record('playlab-brief-dialog', { kind: 'dialog-open', targets: ['[data-other-dialog="play-brief"]','[data-other-form="play-brief"] button'] });
    await dropdown(otherForm('play-brief').locator('[name="timeline"]'), { index: 1 });
    await submit(otherForm('play-brief'), { name: 'Atlas playground', goal: 'Make a local collection.' });
    await expect(root.locator('[data-play-summary]')).toContainText('Atlas playground'); await record('playlab-brief-status');
  } else if (slug === 'retro-web') {
    await action(root, 'retro-page-4').click(); await submit(otherForm('guestbook'), { name: 'Atlas', message: 'Hello, quiet web.' });
    await expect(root.locator('[data-guest-messages]')).toContainText('Hello, quiet web.'); await record('guestbook-status');
    await action(root, 'retro-search').click(); await expect(otherDialog('retro-search')).toBeVisible();
    await record('retro-search-dialog', { kind: 'dialog-open', targets: ['[data-other-dialog="retro-search"]'] });
  } else {
    await action(root, 'primary').click();
    if (slug === 'flat-design') {
      await dropdown(form('workspace').locator('[name="plan"]'), { index: 1 }); await submit(form('workspace'), { name: 'State workspace' });
      await expect(root.locator('[data-workspaces]')).toContainText('State workspace');
    } else if (slug === 'bauhaus') {
      await root.locator('[data-command="shape"][data-value="2"]').click(); await command(root,'place').click();
      await expect(root.locator('[data-composition] i')).toHaveCount(1);
    } else if (slug === 'y2k') {
      await dropdown(form('member').locator('[name="outfit"]'), 'Bubble Dream'); await submit(form('member'), { name: 'StateDreamer' });
      await expect(root.locator('[data-member-name]')).toHaveText('StateDreamer');
    } else if (slug === 'cyberpunk') {
      await dropdown(root.locator('[data-district]'), { index: 1 }); await expect(root.locator('[data-network-route]')).toContainText('PACIFICA');
    } else if (slug === 'memphis') {
      await dropdown(form('party').locator('[name="palette"]'), 'Yellow / Blue'); await submit(form('party'), { name: 'Atlas party', guests: '12' });
      await expect(root.locator('[data-party-name]')).toHaveText('Atlas party');
    } else if (slug === 'retro-futurism') {
      await expect(command(root,'play')).toHaveAttribute('aria-pressed','true'); await command(root,'next').click(); await expect(root.locator('[data-track]')).toContainText('Neon Coast');
      await record('radio-playing', { targets: ['[data-radio-status]','[data-equalizer]'] }); await command(root,'play').click();
    } else if (slug === 'claymorphism') {
      await dropdown(root.locator('[data-clay-color]'), '#FFB5A5'); await command(root,'squeeze').click(); await command(root,'adopt').click();
      await expect(root.locator('[data-clay-cabin]')).toContainText(en ? 'Peach' : '蜜桃');
    } else if (slug === 'aurora') {
      await dropdown(root.locator('[data-spectrum]'), '255'); await command(root,'save-light').click(); await expect(root.locator('[data-light-saves]')).toContainText('Violet');
    } else if (slug === 'organic') {
      await command(root,'basket').click(); await expect(root.locator('[data-basket-total]')).toContainText('48');
    } else if (slug === 'art-deco') {
      await dropdown(form('reservation').locator('[name="guests"]'), '4'); await submit(form('reservation'), { name: 'State Guest', date: '2099-06-15' });
      await expect(root.locator('[data-reservation]')).toContainText('State Guest');
    } else if (slug === 'corporate-memphis') {
      await dropdown(form('team').locator('[name="owner"]'), 'Sam'); await submit(form('team'), { task: 'State design review' });
      await expect(root.locator('[data-team-tasks]')).toContainText('State design review');
    } else if (slug === 'hand-drawn') {
      await dropdown(form('note').locator('[name="paper"]'), { index: 1 }); await submit(form('note'), { note: 'A line of state evidence.' });
      await expect(root.locator('[data-notes]')).toContainText('A line of state evidence.');
    } else if (slug === 'liquid-glass') {
      const material = root.locator('[data-glass-material]'); await captureSelectState(material, record);
      for (const value of ['Clear','Frost','Prism']) {
        await material.selectOption(value); await expect(root.locator('[data-glass-values]')).toContainText(value);
        await record(`lumen-material-${value.toLowerCase()}`, { targets: ['[data-glass-specimen]','[data-glass-stage]'] });
      }
      await command(root,'save-glass').click(); await expect(root.locator('[data-glass-saves]')).toContainText('Prism');
    } else if (slug === 'pixel-art') {
      await root.locator('[data-pixel="0"]').click(); await expect(root.locator('[data-pixel="0"]')).toHaveAttribute('aria-pressed','true');
    } else if (slug === 'vaporwave') {
      await dropdown(root.locator('[data-floor]'), { index: 2 }); await command(root,'visit').click(); await expect(root.locator('[data-passport]')).toContainText('SKY GARDEN');
    } else throw new Error(`代表路径未覆盖：${slug}`);
    await record('brand-result', { targets: ['.gs-card','[data-blob]','[data-glass-specimen]','[data-composition]','[data-invitation]','[data-member]'] });
  }
  return { slug, locale, dialog: !DIALOG_STYLES.includes(slug) ? 'not-applicable' : dialogCaptured ? 'open-state-captured' : 'available-not-visited', generic: !REFERENCE_STYLES.includes(slug) };
}
