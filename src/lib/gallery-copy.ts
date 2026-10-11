import { beacon, track, analyticsPath } from '@/lib/track';

export function initGalleryCopy() {
  document.querySelectorAll<HTMLButtonElement>('.copy-btn').forEach(button => {
    const label = button.textContent;
    let revision = 0;
    button.addEventListener('click', async () => {
      const current = ++revision;
      const data = { concept: `gallery:${analyticsPath()}`, layer: 'image', source: 'gallery-prompt', prompt_locale: button.dataset.promptLocale || 'zh' };
      try {
        await navigator.clipboard.writeText(button.dataset.text || '');
        track('prompt-copy', { ...data, outcome: 'success' });
        beacon('/api/log-prompt', { concept: data.concept, layer: 'image' });
        if (current !== revision) return;
        button.textContent = document.documentElement.lang.startsWith('en') ? '✓ Copied' : '✓ 已复制';
        setTimeout(() => { if (current === revision) button.textContent = label; }, 1500);
      } catch {
        track('prompt-copy-failed', { ...data, outcome: 'failed' });
      }
    });
  });
}
