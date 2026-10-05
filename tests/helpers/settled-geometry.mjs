import { expect } from './private-browser.mjs';

// 观察原生焦点滚动与实际元素几何；不修改页面滚动方式或注入焦点目标。
export async function observeSettledGeometry(trigger) {
  const observation = await trigger.evaluate(node => new Promise(resolve => {
    const started = performance.now();
    let previous = null, stableSince = started, frame = 0, settled = false;
    const read = () => {
      const rect = node.getBoundingClientRect();
      return { scrollX, scrollY, x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    };
    const initial = read();
    const finish = () => {
      cancelAnimationFrame(frame);
      clearTimeout(deadline);
      resolve({ settled, elapsed: performance.now() - started, initial, final: read() });
    };
    const deadline = setTimeout(finish, 2500);
    const sample = now => {
      const current = read();
      if (!previous || Object.keys(current).some(key => Math.abs(current[key] - previous[key]) > 0.25)) stableSince = now;
      previous = current;
      if (now - stableSince >= 150) { settled = true; finish(); }
      else frame = requestAnimationFrame(sample);
    };
    frame = requestAnimationFrame(sample);
  }));
  expect(observation.settled, JSON.stringify(observation)).toBe(true);
  return observation;
}
