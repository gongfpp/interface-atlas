/** Progressive motion for real controls; no router, cloned content or business-state delay. */
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const animations = new WeakMap<HTMLElement, Animation>();
const closingDialogs = new WeakMap<HTMLDialogElement, Animation>();

export function showSceneDialog(dialog: HTMLDialogElement | null) {
  if (!dialog) return;
  closingDialogs.get(dialog)?.cancel();
  closingDialogs.delete(dialog);
  dialog.showModal();
}

export function dismissSceneDialog(dialog: HTMLDialogElement) {
  if (closingDialogs.has(dialog)) return;
  if (reduced()) { dialog.close(); return; }
  // Keep the native modal/focus boundary alive during exit, including engines without discrete transitions.
  const animation = dialog.animate([{ opacity: getComputedStyle(dialog).opacity }, { opacity: 0 }], { duration: 160, easing: 'ease-in', fill: 'forwards' });
  closingDialogs.set(dialog, animation);
  void animation.finished.then(() => {
    if (closingDialogs.get(dialog) !== animation) return;
    closingDialogs.delete(dialog);
    dialog.close();
    animation.cancel();
  }).catch(() => {});
}

export function revealMotion(element: HTMLElement | null) {
  if (!element || reduced() || element.closest('.no-motion,.motion-paused')) return;
  animations.get(element)?.cancel();
  const animation = element.animate([
    { opacity: .45, translate: '0 10px' },
    { opacity: 1, translate: '0 0' },
  ], { duration: 320, easing: 'cubic-bezier(.2,.7,.2,1)' });
  animations.set(element, animation);
}

export function scrollToScene(element: HTMLElement | null) {
  if (!element) return;
  element.scrollIntoView({ behavior: reduced() ? 'instant' : 'smooth', block: 'start' });
  element.focus({ preventScroll: true });
  revealMotion(element);
}

export function initInteractionMotion() {
  let lastAction = -Infinity;
  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    const control = target?.closest<HTMLElement>('button,summary,[role="button"],[role="tab"],input[type="checkbox"],input[type="radio"],a[href]');
    if (!control || control.matches(':disabled,[aria-disabled="true"]') || control.closest('.no-motion,.motion-paused')) return;
    lastAction = performance.now();
    if (reduced()) return;
    // Filter does not move hit targets, override a specimen transform or change layout.
    control.animate([{ filter: 'brightness(.78)' }, { filter: 'brightness(1)' }], { duration: 260, easing: 'ease-out' });
  }, true);

  // Visible state feedback also covers controls created later by React or specimen runtimes.
  new MutationObserver(changes => {
    if (reduced()) return;
    const arrivals = new Set<HTMLElement>();
    for (const change of changes) {
      const target = change.target instanceof HTMLElement ? change.target : change.target.parentElement;
      if (!target) continue;
      if (change.type === 'attributes' && !target.hidden && target.matches('[data-generic-panel],details[open]>nav,[role="tabpanel"]')) arrivals.add(target);
      if (change.type === 'attributes' && target.matches('details[open]')) {
        const menu = target.querySelector<HTMLElement>('nav'); if (menu) arrivals.add(menu);
      }
      if (change.type === 'childList') {
        for (const node of change.addedNodes) if (node instanceof HTMLElement) {
          if (node.matches('[role="dialog"],[role="menu"],[role="tabpanel"]')) arrivals.add(node);
        }
      }
      if (performance.now() - lastAction < 800) {
        const feedback = target.closest<HTMLElement>('[role="status"],[role="alert"]');
        if (feedback?.textContent?.trim()) arrivals.add(feedback);
        if (change.type === 'childList' && target.matches('.gs-results,[data-bag-items]')) arrivals.add(target);
      }
    }
    for (const element of arrivals) if (element.getClientRects().length) revealMotion(element);
  }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['hidden', 'open'] });
}

/** Native document transitions keep scripts, forms, history and browser link behavior intact. */
export function initPageMotion() {
  const native = 'CSSViewTransitionRule' in window && 'onpagereveal' in window;
  document.documentElement.dataset.pageMotion = native ? 'native' : 'fallback';
  if (native) return;
  let pending = 0;
  let departure: Animation | undefined;
  const restore = () => {
    pending++;
    departure?.cancel();
    revealMotion(document.querySelector('#main'));
  };
  window.addEventListener('pageshow', restore);
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reduced()) return;
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!link || link.download || (link.target && link.target !== '_self') || link.hasAttribute('data-no-motion')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !['http:', 'https:'].includes(url.protocol)) return;
    if (url.pathname === location.pathname && url.search === location.search) {
      pending++; departure?.cancel(); return;
    }
    const main = document.querySelector<HTMLElement>('#main');
    if (!main) return;
    event.preventDefault();
    const attempt = ++pending;
    departure?.cancel();
    departure = main.animate([{ opacity: 1 }, { opacity: .65 }], { duration: 140, easing: 'ease-in', fill: 'forwards' });
    void departure.finished.then(() => {
      if (attempt === pending) location.assign(url.href);
    }).catch(() => {});
  });
  // BFCache restoration must never retain a faded page or a delayed navigation.
  window.addEventListener('pagehide', () => { pending++; departure?.cancel(); });
}
