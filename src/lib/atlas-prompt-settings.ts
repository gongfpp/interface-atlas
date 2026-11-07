/** 从当前控件读取设计参数；复制内容与页面上可见的配置一致。 */
export function atlasPromptSettings(root: HTMLElement, zh: boolean) {
  const settings: string[] = [];
  const range = root.querySelector<HTMLInputElement>('[data-art-range]');
  if (range && root.dataset.slug !== 'retro-futurism') {
    const label = root.querySelector('.atlas-range-label > span')!.textContent!.trim();
    const value = root.dataset.slug === 'neumorphism' ? `${Math.round(Number(range.value) * 3.6)}°`
      : `${range.value}/100 (${zh ? '调节档位' : 'control level'})`;
    settings.push(`${label}: ${value}`);
  }
  for (const selector of ['[data-compact]', '[data-glass-clear]', '[data-soft-light]', '[data-atmosphere]']) {
    const input = root.querySelector<HTMLInputElement>(selector);
    if (input) settings.push(`${input.closest('label')!.textContent!.trim()}: ${input.checked ? (zh ? '开启' : 'on') : (zh ? '关闭' : 'off')}`);
  }
  const layout = root.querySelector('[data-flat-layout][aria-pressed=true]');
  if (layout) settings.push(`${zh ? '布局' : 'Layout'}: ${layout.textContent!.trim()}`);
  return settings.length ? `${zh ? '当前设计参数' : 'Current design settings'}:\n${settings.join('\n')}` : '';
}
