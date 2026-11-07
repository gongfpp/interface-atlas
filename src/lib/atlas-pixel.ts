/** 画布拥有一个 Tab 入口；方向键移动，指针拖动连续绘制。 */
export function initAtlasPixelCanvas(root: HTMLElement) {
  const grid = root.querySelector<HTMLElement>('.atlas-pixel-grid');
  if (!grid) return;
  const cells = [...grid.querySelectorAll<HTMLButtonElement>('[data-pixel]')];
  let colour = root.querySelector<HTMLElement>('[data-pixel-color][aria-pressed=true]')!.dataset.pixelColor!;
  let pointer: number | null = null;
  let last: number | null = null;
  const focusCell = (index: number, focus = true) => {
    cells.forEach((cell, i) => { cell.tabIndex = i === index ? 0 : -1; });
    if (focus) cells[index].focus({ preventScroll: true });
  };
  const paint = (index: number) => {
    cells[index].style.background = colour;
    cells[index].setAttribute('aria-pressed', 'true');
  };
  const drawTo = (index: number) => {
    const from = last ?? index;
    const x = from % 8, y = Math.floor(from / 8);
    const dx = index % 8 - x, dy = Math.floor(index / 8) - y;
    const steps = Math.max(Math.abs(dx), Math.abs(dy), 1);
    for (let i = 0; i <= steps; i++) paint(Math.round(y + dy * i / steps) * 8 + Math.round(x + dx * i / steps));
    last = index;
  };
  root.querySelectorAll<HTMLButtonElement>('[data-pixel-color]').forEach(button => {
    button.addEventListener('click', () => {
      colour = button.dataset.pixelColor!;
      root.querySelectorAll('[data-pixel-color]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    });
  });
  cells.forEach((cell, index) => {
    cell.addEventListener('click', () => { paint(index); focusCell(index, false); });
    cell.addEventListener('focus', () => focusCell(index, false));
    cell.addEventListener('keydown', event => {
      const row = Math.floor(index / 8), col = index % 8;
      const next: Record<string, number> = {
        ArrowLeft: row * 8 + Math.max(0, col - 1), ArrowRight: row * 8 + Math.min(7, col + 1),
        ArrowUp: Math.max(0, row - 1) * 8 + col, ArrowDown: Math.min(7, row + 1) * 8 + col,
        Home: event.ctrlKey ? 0 : row * 8, End: event.ctrlKey ? 63 : row * 8 + 7,
      };
      if (event.key in next) { event.preventDefault(); focusCell(next[event.key]); }
    });
  });
  grid.addEventListener('pointerdown', event => {
    if (event.button !== 0 || pointer !== null) return;
    const cell = (event.target as Element).closest<HTMLElement>('[data-pixel]');
    if (!cell) return;
    event.preventDefault();
    pointer = event.pointerId;
    grid.setPointerCapture(pointer);
    const index = Number(cell.dataset.pixel);
    focusCell(index); drawTo(index);
  });
  grid.addEventListener('pointermove', event => {
    if (event.pointerId !== pointer) return;
    const cell = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-pixel]');
    if (cell && grid.contains(cell)) drawTo(Number(cell.dataset.pixel));
    else last = null;
  });
  const release = () => {
    const previous = pointer;
    pointer = null; last = null;
    if (previous !== null && grid.hasPointerCapture(previous)) grid.releasePointerCapture(previous);
  };
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) grid.addEventListener(name, release);
  window.addEventListener('blur', release);
  window.addEventListener('pagehide', release);
  root.querySelector('[data-clear-pixels]')!.addEventListener('click', () => {
    release();
    cells.forEach(cell => { cell.style.background = ''; cell.setAttribute('aria-pressed', 'false'); });
  });
}
