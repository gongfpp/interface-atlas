/** 仅共享行为；表面、字形和状态色继承各风格页面。 */
export function initStyleControls(root: HTMLElement): void {
  let serial = 0;
  const whitespaceErrors = new WeakSet<HTMLInputElement | HTMLTextAreaElement>();
  const synchronizers = new WeakMap<HTMLSelectElement, () => void>();
  let opened: { panel: HTMLElement; close: (focus?: boolean) => void; position: () => void } | null = null;
  const english = document.documentElement.lang.startsWith('en');

  function enhance(select: HTMLSelectElement) {
    if (select.dataset.sceneNativeSelect !== undefined) { synchronizers.get(select)?.(); return; }
    if (select.multiple || select.size > 1) return;
    const label = select.closest('label');
    const labelCopy = label?.cloneNode(true) as HTMLElement | undefined;
    labelCopy?.querySelectorAll('select,button,input').forEach(node => node.remove());
    const name = select.getAttribute('aria-label') || labelCopy?.textContent?.trim() || (english ? 'Choose an option' : '选择选项');
    const wrapper = document.createElement('span');
    wrapper.className = 'scene-select';
    select.before(wrapper);
    wrapper.append(select);
    select.dataset.sceneNativeSelect = '';
    // 保留 1px 真实表单控件，兼容原生校验与现有 selectOption 操作。
    select.setAttribute('aria-hidden', 'true');
    select.tabIndex = -1;
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'scene-select-trigger';
    trigger.setAttribute('role', 'combobox');
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    const panel = document.createElement('div');
    panel.className = 'scene-select-panel';
    panel.id = `scene-options-${++serial}`;
    panel.setAttribute('role', 'listbox');
    panel.setAttribute('aria-label', name);
    panel.setAttribute('popover', 'manual');
    trigger.setAttribute('aria-controls', panel.id);
    wrapper.append(trigger, panel);
    let active = select.selectedIndex;
    let typeahead = '';
    let typedAt = 0;
    const options = Array.from(select.options);
    const items = options.map((option, index) => {
      const item = document.createElement('div');
      item.className = 'scene-select-option';
      item.id = `${panel.id}-${index}`;
      item.setAttribute('role', 'option');
      item.setAttribute('aria-disabled', String(option.disabled));
      item.textContent = option.label;
      // WebKit 触屏取消 pointerdown 会丢兼容 click；只阻止 mouse 默认失焦，保留触屏滚动/确认。
      item.addEventListener('mousedown', event => event.preventDefault());
      // option 仍在原 label 内；阻止 label 的默认激活把焦点送回 1px owner。
      item.addEventListener('click', event => { event.preventDefault(); choose(index); });
      panel.append(item);
      return item;
    });
    function mark() {
      items.forEach((item, index) => {
        item.dataset.active = String(index === active);
        item.setAttribute('aria-selected', String(index === select.selectedIndex));
      });
      if (active >= 0) trigger.setAttribute('aria-activedescendant', items[active].id);
      items[active]?.scrollIntoView({ block: 'nearest' });
    }
    function sync() {
      const selectedLabel = options[select.selectedIndex]?.label || name;
      // scan 会在业务展示/复位后重同步；只在值改变时写 DOM，避免 observer 自激循环。
      if (trigger.textContent !== selectedLabel) trigger.textContent = selectedLabel;
      trigger.setAttribute('aria-label', `${name}: ${trigger.textContent}`);
      trigger.disabled = select.disabled;
      trigger.setAttribute('aria-required', String(select.required));
      trigger.setAttribute('aria-invalid', select.getAttribute('aria-invalid') || 'false');
      items.forEach((item, index) => item.setAttribute('aria-selected', String(index === select.selectedIndex)));
    }
    function position() {
      const rect = trigger.getBoundingClientRect();
      const viewport = window.visualViewport;
      const top = viewport?.offsetTop ?? 0;
      const height = viewport?.height ?? innerHeight;
      const width = viewport?.width ?? innerWidth;
      const below = Math.max(0, top + height - rect.bottom - 12);
      const above = Math.max(0, rect.top - top - 12);
      const useAbove = below < Math.min(panel.scrollHeight, 180) && above > below;
      panel.style.width = `${Math.min(Math.max(rect.width, 180), width - 24)}px`;
      panel.style.maxHeight = `${Math.min(300, Math.max(44, useAbove ? above : below))}px`;
      panel.style.left = `${Math.max(12, Math.min(rect.left, width - panel.getBoundingClientRect().width - 12))}px`;
      panel.style.top = `${useAbove ? Math.max(top + 12, rect.top - panel.getBoundingClientRect().height - 6) : rect.bottom + 6}px`;
    }
    function close(focus = false) {
      if (panel.matches(':popover-open')) panel.hidePopover();
      trigger.setAttribute('aria-expanded', 'false');
      trigger.removeAttribute('aria-activedescendant');
      if (opened?.panel === panel) opened = null;
      if (focus && trigger.isConnected) trigger.focus({ preventScroll: true });
    }
    function open() {
      if (trigger.disabled) return;
      opened?.close();
      active = select.selectedIndex;
      trigger.focus({ preventScroll: true });
      panel.showPopover();
      trigger.setAttribute('aria-expanded', 'true');
      opened = { panel, close, position };
      position();
      mark();
    }
    function choose(index: number) {
      if (options[index]?.disabled) return;
      select.selectedIndex = index;
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
      sync();
      close(true);
    }
    trigger.addEventListener('click', () => trigger.getAttribute('aria-expanded') === 'true' ? close() : open());
    trigger.addEventListener('keydown', event => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      if (event.key === 'Tab') { close(); return; }
      if (event.key === 'Escape' && isOpen) { event.preventDefault(); event.stopPropagation(); close(true); return; }
      if (['Enter', ' '].includes(event.key)) { event.preventDefault(); if (isOpen) choose(active); else open(); return; }
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        if (!isOpen) open();
        const direction = event.key === 'ArrowUp' || event.key === 'End' ? -1 : 1;
        let next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : active + direction;
        while (next >= 0 && next < options.length && options[next].disabled) next += direction;
        if (next >= 0 && next < options.length) active = next;
        mark();
      } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        if (!isOpen) open();
        typeahead = Date.now() - typedAt < 700 ? typeahead + event.key : event.key;
        typedAt = Date.now();
        const found = options.findIndex(option => !option.disabled && option.label.toLocaleLowerCase().startsWith(typeahead.toLocaleLowerCase()));
        if (found >= 0) { active = found; mark(); }
      }
    });
    trigger.addEventListener('blur', () => close());
    synchronizers.set(select, sync);
    select.addEventListener('change', sync);
    select.form?.addEventListener('reset', () => queueMicrotask(sync));
    label?.addEventListener('click', event => {
      const target = event.target as Element;
      if (target.closest('button,a,input,textarea')) return;
      event.preventDefault();
      if (!target.closest('[role="option"]')) trigger.focus();
    });
    sync();
  }

  function feedback() {
    root.querySelectorAll<HTMLElement>('[role="status"]').forEach(status => {
      status.toggleAttribute('data-feedback', Boolean(status.textContent?.trim()));
    });
  }
  function scan() {
    if (opened && (!opened.panel.isConnected || !opened.panel.matches(':popover-open'))) opened.close();
    root.querySelectorAll<HTMLSelectElement>('select').forEach(enhance);
    feedback();
  }
  root.addEventListener('invalid', event => {
    const field = event.target as HTMLInputElement;
    if (!field.form) return;
    field.setAttribute('aria-invalid', 'true');
    if (field.matches('select[data-scene-native-select]')) field.closest('.scene-select')?.querySelector('[role="combobox"]')?.setAttribute('aria-invalid', 'true');
    field.form.dataset.state = 'invalid';
    let error = field.form.querySelector<HTMLElement>('.scene-validation');
    if (!error) {
      error = document.createElement('p');
      error.className = 'scene-validation';
      error.setAttribute('role', 'alert');
      field.form.append(error);
    }
    error.textContent = english ? 'Please check the highlighted fields before continuing.' : '请检查标记的字段，再继续操作。';
  }, true);
  root.addEventListener('input', event => {
    const field = event.target as HTMLInputElement;
    if (typeof field.checkValidity !== 'function' || !field.form) return;
    if (whitespaceErrors.has(field)) { field.setCustomValidity(''); whitespaceErrors.delete(field); }
    if (field.validity.valid) field.removeAttribute('aria-invalid');
    if (field.form.dataset.state === 'success') delete field.form.dataset.state;
    if (!field.form.querySelector('[aria-invalid="true"]')) {
      field.form.querySelector('.scene-validation')?.remove();
      delete field.form.dataset.state;
    }
  });
  root.addEventListener('submit', event => {
    const form = event.target as HTMLFormElement;
    // 在业务成功处理器清空必填控件之前捕获提交结果。
    const whitespace = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[required],textarea[required]')).find(field => field.value && !field.value.trim());
    if (whitespace) {
      whitespaceErrors.add(whitespace);
      whitespace.setCustomValidity(english ? 'Please enter text, not just spaces.' : '请填写内容，而不只是空格。');
      whitespace.reportValidity();
      event.preventDefault(); event.stopImmediatePropagation();
      return;
    }
    if (form.matches(':valid')) {
      form.dataset.state = 'success';
      form.querySelector('.scene-validation')?.remove();
      form.querySelectorAll('[aria-invalid]').forEach(field => field.matches('.scene-select-trigger') ? field.setAttribute('aria-invalid', 'false') : field.removeAttribute('aria-invalid'));
    }
  }, true);
  document.addEventListener('pointerdown', event => {
    if (opened && !(event.target as Element).closest('.scene-select')) opened.close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && opened) { event.preventDefault(); event.stopPropagation(); opened.close(true); }
  }, true);
  window.addEventListener('resize', () => opened?.position());
  window.visualViewport?.addEventListener('resize', () => opened?.position());
  document.addEventListener('scroll', () => opened?.position(), true);
  // 商品切换会程序化重置 selectedIndex；对话框/区域再次展示时必须同步可见标签。
  new MutationObserver(scan).observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['open', 'hidden'] });
  scan();
}
