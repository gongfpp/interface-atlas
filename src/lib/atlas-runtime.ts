import { atlasDialogMotion, atlasPageMotion } from './atlas-motion';
import { bindAtlasForm } from './atlas-forms';
import { initAtlasSelect } from './atlas-select';
import { applyAtlasMaterial, captureAtlasMaterial } from './atlas-variants';
import { initPageMotion } from './interaction-motion';
import { atlasPromptSettings } from './atlas-prompt-settings';
import { initAtlasPixelCanvas } from './atlas-pixel';
import { createAtlasSynth } from './atlas-audio';

/** Live behaviours for the image-led full-page style atlas. No remote generation. */
export function initAtlasPage() {
  const candidate = document.querySelector<HTMLElement>("[data-atlas-root]");
  if (!candidate || candidate.dataset.ready) return;
  const root: HTMLElement = candidate;
  root.dataset.ready = "true";
  const nav = root.querySelector<HTMLElement>(".atlas-nav")!;
  const sizeNav = () =>
    root.style.setProperty(
      "--atlas-nav-height",
      `${nav.getBoundingClientRect().height}px`,
    );
  new ResizeObserver(sizeNav).observe(nav);
  sizeNav();
  const zh = root.dataset.locale === "zh";
  const say = (cn: string, en: string) => (zh ? cn : en);
  const q = <T extends HTMLElement>(selector: string) =>
    root.querySelector<T>(selector)!;
  const status = q<HTMLElement>("[data-atlas-status]");
  function announce(message: string, destination?: HTMLElement) {
    const section = document.activeElement?.closest('.atlas-section');
    let local = destination ?? section?.querySelector<HTMLElement>('[data-local-status]');
    if (!local && section) {
      local = document.createElement('p');
      local.className = 'atlas-feedback';
      local.dataset.localStatus = '';
      local.setAttribute('role', 'status');
      section.append(local);
    }
    const anchor = document.activeElement?.closest('.approved-check,.atlas-tool-group,.atlas-toggle,.atlas-transport');
    if (!destination && local && anchor && section?.contains(anchor)) anchor.after(local);
    (local ?? status).textContent = message;
  }
  const data = JSON.parse(
    q<HTMLScriptElement>("[data-atlas-prompt-data]").textContent || "{}",
  ) as { base: string; variants: { id: string; name: string; note: string }[] };
  const baseMaterial = captureAtlasMaterial(root);
  const select = q<HTMLSelectElement>("[data-variant]");
  const output = q<HTMLTextAreaElement>("[data-prompt-output]");
  const form = q<HTMLFormElement>("[data-prompt-form]");
  const notice = q<HTMLElement>("[data-prompt-notice]");
  let promptEdited = false;
  let selected = 0;
  const syncSelect = initAtlasSelect(root, index => changeVariant(index));
  const compose = () => {
    const fields = new FormData(form);
    const project = String(fields.get("project") || "").trim();
    const brief = String(fields.get("brief") || "").trim();
    const variant = data.variants[selected];
    return [
      project ? `${say("项目", "Project")}: ${project}` : "",
      brief ? `${say("需求", "Brief")}: ${brief}` : "",
      data.base,
      `${say("风格变体", "Variant")}: ${variant.name}. ${variant.note}`,
      atlasPromptSettings(root, zh),
    ]
      .filter(Boolean)
      .join("\n\n");
  };
  function changeVariant(index: number) {
    selected = Math.max(0, Math.min(index, data.variants.length - 1));
    select.value = String(selected);
    syncSelect();
    applyAtlasMaterial(root, baseMaterial, root.dataset.slug!, data.variants[selected].id);
    root.dataset.variant = String(selected);
    if (root.dataset.slug === 'retro-futurism') {
      const headlines: Record<string, string> = { atompunk: 'ORBIT / 1962', cassette: 'SYSTEM / 1984', synth: 'TOMORROW / 1984' };
      q<HTMLElement>('.approved-headline').textContent = headlines[data.variants[selected].id];
    }
    root.style.setProperty("--variant", String(selected));
    // 页脚在 root 外，沿用当前整页的颜色，不留下旧版底色。
    const pageColours = getComputedStyle(root);
    for (const token of ['--ap', '--as', '--ai', '--aa', '--ab'])
      document.body.style.setProperty(token, pageColours.getPropertyValue(token));
    q<HTMLElement>("[data-variant-note]").textContent =
      data.variants[selected].note;
    root
      .querySelectorAll<HTMLButtonElement>("[data-variant-choice]")
      .forEach((b) =>
        b.setAttribute(
          "aria-pressed",
          String(Number(b.dataset.variantChoice) === selected),
        ),
      );
    if (!promptEdited) {
      output.value = compose();
      notice.textContent = "";
    } else
      notice.textContent = say(
        "已保留你编辑的文字；点“组合提示词”可按当前变体重新生成。",
        "Your edits are preserved. Compose again to use the selected variant.",
      );
  }
  select.addEventListener("change", () => changeVariant(Number(select.value)));
  root
    .querySelectorAll<HTMLButtonElement>("[data-variant-choice]")
    .forEach((b) =>
      b.addEventListener("click", () =>
        changeVariant(Number(b.dataset.variantChoice)),
      ),
    );
  output.addEventListener("input", () => {
    promptEdited = true;
  });
  function refreshSettings() {
    if (!promptEdited) output.value = compose();
    else notice.textContent = say('参数已更新；已保留你的文字，点“组合提示词”可加入当前参数。', 'Settings changed. Your edits are preserved; compose to include the current settings.');
  }
  root.querySelectorAll<HTMLInputElement>('[data-art-range], [data-compact], [data-glass-clear], [data-soft-light], [data-atmosphere]')
    .forEach(input => input.addEventListener(input.type === 'range' ? 'input' : 'change', refreshSettings));
  bindAtlasForm(form, () => {
    promptEdited = false;
    output.value = compose();
    notice.textContent = say(
      "已按当前风格与需求组合，可继续编辑。",
      "Composed from this style and your brief. You can edit it.",
    );
  });
  q<HTMLButtonElement>("[data-reset-prompt]").addEventListener("click", () => {
    promptEdited = false;
    output.value = compose();
    notice.textContent = say(
      "已恢复当前风格提示词。",
      "Style prompt restored.",
    );
  });
  q<HTMLButtonElement>("[data-copy-prompt]").addEventListener(
    "click",
    async () => {
      try {
        await navigator.clipboard.writeText(output.value);
        announce(say("提示词已复制", "Prompt copied"), notice);
      } catch {
        output.focus();
        output.select();
        notice.textContent = say(
          "无法自动复制，已选中文字，请手动复制。",
          "Copy is unavailable. Text selected; please copy manually.",
        );
      }
    },
  );
  changeVariant(0);
  // Dialog navigation uses a real history entry; Forward reopens it, Back restores the page.
  const guide = q<HTMLDialogElement>("[data-guide]");
  const example = q<HTMLDialogElement>("[data-example-dialog]");
  let returnFocus: HTMLElement | null = null;
  let exampleIndex = 0;
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration =
    parseInt(getComputedStyle(root).getPropertyValue("--motion")) || 0;
  const motion = atlasDialogMotion(root.dataset.slug!, duration);
  const pageMotion = atlasPageMotion(root.dataset.slug!, duration);
  // Fallback document navigation uses the same material gestures as native transitions.
  initPageMotion({
    enter: element => {
      const composition = element.querySelector<HTMLElement>('.approved-composition') ?? element;
      if (!reduced() && pageMotion.duration) composition.animate(pageMotion.frames, { duration: pageMotion.duration, easing: pageMotion.easing });
    },
    leave: element => !reduced() && pageMotion.duration ? (element.querySelector<HTMLElement>('.approved-composition') ?? element).animate(
      [pageMotion.frames.at(-1)!, pageMotion.frames[0]],
      { duration: Math.min(pageMotion.duration, 160), easing: pageMotion.easing, fill: 'forwards' },
    ) : null,
  });
  let dialogFrames = motion.frames;
  let opening: Animation | undefined;
  let closing: Animation | undefined;
  let navigatingBack = false;
  function revealDialog(dialog: HTMLDialogElement) {
    closing?.cancel();
    closing = undefined;
    if (dialog.open) return;
    // 背景即将锁定，先停止先前焦点触发的未结束滚动。
    window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' });
    dialog.showModal();
    if (reduced() || !motion.duration) return;
    dialogFrames = motion.frames.map(frame => ({ ...frame }));
    if (root.dataset.slug === "bento-grid" && returnFocus) {
      const source = returnFocus.getBoundingClientRect(),
        target = dialog.getBoundingClientRect();
      dialogFrames[0].transform = `translate(${source.x + source.width / 2 - target.x - target.width / 2}px,${source.y + source.height / 2 - target.y - target.height / 2}px) scale(.75)`;
    }
    opening?.cancel();
    opening = dialog.animate(dialogFrames, {
      duration: motion.duration,
      easing: motion.easing,
    });
  }
  function hideDialogs() {
    const dialog = example.open ? example : guide.open ? guide : null;
    if (!dialog || closing) return;
    const finish = () => {
      dialog.close();
      returnFocus?.focus({ preventScroll: true });
      returnFocus = null;
      closing = undefined;
    };
    if (reduced() || !motion.duration) {
      finish();
      return;
    }
    // If Back/Escape interrupts entry, close from its current pose without jumping.
    const current = getComputedStyle(dialog);
    const from: Keyframe = { opacity: current.opacity, transform: current.transform, filter: current.filter, clipPath: current.clipPath };
    opening?.cancel();
    closing = dialog.animate([from, dialogFrames[0]], {
      duration: Math.min(motion.duration, 220),
      easing: motion.easing,
    });
    void closing.finished.then(finish).catch(() => {});
  }
  const preview = q<HTMLElement>("[data-example-preview]");
  const previewForm = q<HTMLFormElement>('[data-preview-form]');
  const previewInput = q<HTMLInputElement>('[data-preview-input]');
  const previewHeading = q<HTMLElement>('[data-preview-heading]');
  const previewHelp = q<HTMLElement>('[data-preview-help]');
  const previewToggle = q<HTMLInputElement>('[data-preview-help-toggle]');
  const previewStatus = q<HTMLElement>('[data-preview-status]');
  const previewError = q<HTMLElement>('#atlas-preview-error');
  const drafts = new Map<number, { value: string; title: string; help: boolean; feedback: string; error: string; state: string }>();
  let previewRendered = false;
  let switching: Animation | undefined;
  bindAtlasForm(previewForm, () => {
    previewHeading.textContent = previewInput.value.trim();
    previewStatus.textContent = say('✓ 标题已更新到上方卡片。', '✓ The card title has been updated.');
  });
  previewToggle.addEventListener('change', () => { previewHelp.hidden = !previewToggle.checked; });
  function resetPreview() {
    previewInput.value = data.variants[exampleIndex].name;
    previewHeading.textContent = previewInput.value;
    previewToggle.checked = true;
    previewHelp.hidden = false;
    previewInput.removeAttribute('aria-invalid');
    previewError.hidden = true;
    previewError.textContent = '';
    previewStatus.textContent = '';
    previewForm.dataset.state = 'idle';
  }
  q<HTMLButtonElement>('[data-preview-reset]').addEventListener('click', resetPreview);
  q<HTMLButtonElement>('[data-example-apply]').addEventListener('click', () => {
    changeVariant(exampleIndex);
    closeDialog();
  });
  function renderExample(index: number, animate = false) {
    const previous = exampleIndex;
    if (previewRendered) drafts.set(previous, { value: previewInput.value, title: previewHeading.textContent!, help: previewToggle.checked, feedback: previewStatus.textContent!, error: previewError.hidden ? '' : previewError.textContent!, state: previewForm.dataset.state ?? 'idle' });
    exampleIndex = Math.max(0, Math.min(index, data.variants.length - 1));
    const item = data.variants[exampleIndex];
    q<HTMLElement>("#atlas-example-title").textContent = item.name;
    q<HTMLElement>("[data-example-description]").textContent = item.note;
    q<HTMLElement>("[data-example-count]").textContent =
      `${exampleIndex + 1} / ${data.variants.length}`;
    q<HTMLButtonElement>("[data-example-prev]").disabled = exampleIndex === 0;
    q<HTMLButtonElement>("[data-example-next]").disabled =
      exampleIndex === data.variants.length - 1;
    resetPreview();
    const draft = drafts.get(exampleIndex);
    if (draft) {
      previewInput.value = draft.value;
      previewHeading.textContent = draft.title;
      previewToggle.checked = draft.help;
      previewHelp.hidden = !draft.help;
      previewStatus.textContent = draft.feedback;
      previewError.textContent = draft.error;
      previewError.hidden = !draft.error;
      previewInput.setAttribute('aria-invalid', String(!!draft.error));
      previewForm.dataset.state = draft.state;
    }
    applyAtlasMaterial(preview, baseMaterial, root.dataset.slug!, item.id);
    preview.dataset.previewVariant = String(exampleIndex);
    previewRendered = true;
    switching?.cancel();
    if (animate && !reduced() && motion.duration) {
      const from = { ...motion.frames[0] };
      if (root.dataset.slug === 'editorial') from.transform = `translateX(${exampleIndex > previous ? 22 : -22}px)`;
      switching = preview.animate([from, motion.frames.at(-1)!], { duration: Math.min(motion.duration, 240), easing: motion.easing });
    }
  }
  function syncDialog() {
    navigatingBack = false;
    const hash = location.hash;
    const match = hash.match(/^#variant-(\d+)$/);
    if (match && Number(match[1]) < data.variants.length) {
      if (guide.open) guide.close();
      renderExample(Number(match[1]));
      revealDialog(example);
    } else if (hash === "#guide") {
      if (example.open) example.close();
      revealDialog(guide);
    } else {
      hideDialogs();
    }
  }
  function openDialog(hash: string, opener: HTMLButtonElement) {
    returnFocus = opener;
    history.pushState({ ...history.state, atlasModal: true }, "", hash);
    syncDialog();
  }
  function closeDialog() {
    if (navigatingBack) return;
    if (history.state?.atlasModal) {
      navigatingBack = true;
      history.back();
    } else {
      history.replaceState(
        history.state,
        "",
        location.pathname + location.search,
      );
      syncDialog();
    }
  }
  root.querySelectorAll<HTMLButtonElement>("[data-open-guide], [data-approved-guide]").forEach((button) =>
    button.addEventListener("click", () => openDialog("#guide", button)),
  );
  root
    .querySelectorAll<HTMLButtonElement>("[data-example], [data-current-example]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        openDialog(`#variant-${button.dataset.example ?? selected}`, button),
      ),
    );
  root
    .querySelectorAll<HTMLButtonElement>("[data-close-dialog]")
    .forEach((button) => button.addEventListener("click", closeDialog));
  for (const dialog of [guide, example]) {
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeDialog();
    });
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const b = dialog.getBoundingClientRect();
      if (
        event.clientX < b.left ||
        event.clientX > b.right ||
        event.clientY < b.top ||
        event.clientY > b.bottom
      )
        closeDialog();
    });
  }
  for (const [selector, delta] of [
    ["[data-example-prev]", -1],
    ["[data-example-next]", 1],
  ] as const)
    q<HTMLButtonElement>(selector).addEventListener("click", event => {
      const index = exampleIndex + delta;
      if (index < 0 || index >= data.variants.length) return;
      const button = event.currentTarget as HTMLButtonElement;
      const hadFocus = document.activeElement === button;
      history.replaceState(history.state, "", `#variant-${index}`);
      renderExample(index, true);
      // Disabled end controls must not strand keyboard focus.
      if (hadFocus && button.disabled) q<HTMLButtonElement>(index === 0 ? '[data-example-next]' : '[data-example-prev]').focus({ preventScroll: true });
    });
  addEventListener("popstate", syncDialog);
  addEventListener("hashchange", syncDialog);
  syncDialog();
  // Parameter controls alter the actual artwork and composition.
  const range = root.querySelector<HTMLInputElement>("[data-art-range]");
  function updateRange() {
    if (!range) return;
    root.style.setProperty("--art-value", range.value);
    root.style.setProperty("--art-unit", String(Number(range.value) / 100));
    const min = Number(range.min || 0), max = Number(range.max || 100);
    range.style.setProperty("--range-progress", `${(Number(range.value) - min) / (max - min || 1) * 100}%`);
    const dial = root.querySelector<HTMLElement>("[data-dial-value]");
    const display = dial ? `${Math.round(Number(range.value) * 3.6)}°` : range.value;
    q<HTMLOutputElement>("[data-range-output]").value = display;
    if (dial) { dial.textContent = display; range.setAttribute('aria-valuetext', display); }
  }
  range?.addEventListener("input", updateRange);
  updateRange();
  // 审批版组件的输入与机械开关直接驱动同页样本。
  const specimenInput = root.querySelector<HTMLInputElement>("[data-specimen-input]");
  const specimenPreview = root.querySelector<HTMLElement>("[data-specimen-preview]");
  if (specimenInput && specimenPreview) {
    const initial = specimenPreview.textContent;
    specimenInput.addEventListener("input", () => {
      specimenPreview.textContent = specimenInput.value.trim() || initial;
    });
  }
  const demoCheck = root.querySelector<HTMLInputElement>("[data-demo-check]");
  demoCheck?.addEventListener("change", () => {
    announce(demoCheck.checked ? say("已标记为理解", "Marked as understood") : say("已取消标记", "Mark removed"));
  });
  const power = root.querySelector<HTMLInputElement>("[data-instrument-power]");
  if (power) {
    root.dataset.powered = String(power.checked);
    power.addEventListener("change", () => { root.dataset.powered = String(power.checked); });
  }
  for (const [selector, attr] of [
    ["[data-compact]", "compact"],
    ["[data-glass-clear]", "clear"],
    ["[data-soft-light]", "softLight"],
    ["[data-atmosphere]", "atmosphere"],
  ] as const) {
    const input = root.querySelector<HTMLInputElement>(selector);
    if (input) {
      input.addEventListener("change", () => {
        root.dataset[attr] = String(input.checked);
      });
      root.dataset[attr] = String(input.checked);
    }
  }
  root
    .querySelectorAll<HTMLButtonElement>("[data-flat-layout]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        root.dataset.flat = button.dataset.flatLayout;
        const vertical = root.dataset.flat === 'vertical';
        const scene = root.querySelector<SVGElement>('[data-flat-scene]');
        scene?.setAttribute('viewBox', vertical ? '0 0 420 600' : '0 0 720 340');
        scene?.setAttribute('aria-label', vertical ? say('蓝橙色纵向信息服务台', 'Blue and orange vertical information desk') : say('蓝橙色横向信息服务台', 'Blue and orange horizontal information desk'));
        announce(vertical ? say('服务台已切换为纵向构图。', 'The desk now uses a vertical composition.') : say('服务台已切换为横向构图。', 'The desk now uses a horizontal composition.'));
        root
          .querySelectorAll("[data-flat-layout]")
          .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
        refreshSettings();
      }),
    );
  // Geometric composition has undo/redo, including clear. Branching discards redo.
  const shapes = root.querySelector<HTMLElement>("[data-shapes]");
  if (shapes) {
    let entries: string[][] = [[]];
    let cursor = 0;
    function draw() {
      shapes!.replaceChildren();
      entries[cursor].forEach((shape, i) => {
        const node = document.createElement("i");
        node.className = shape;
        node.style.left = `${8 + ((i * 23) % 72)}%`;
        node.style.top = `${10 + ((i * 17) % 65)}%`;
        shapes!.append(node);
      });
      q<HTMLButtonElement>("[data-undo]").disabled = cursor === 0;
      q<HTMLButtonElement>("[data-redo]").disabled =
        cursor === entries.length - 1;
      q<HTMLButtonElement>("[data-clear-shapes]").disabled =
        entries[cursor].length === 0;
    }
    function record(next: string[]) {
      entries = entries.slice(0, cursor + 1);
      entries.push(next);
      cursor++;
      draw();
    }
    root.querySelectorAll<HTMLButtonElement>("[data-shape]").forEach((button) =>
      button.addEventListener("click", () => {
        if (entries[cursor].length >= 12) {
          announce(
            say(
              "画布已放入 12 个形状，可撤销或清空。",
              "12 shapes placed. Undo or clear to continue.",
            ),
          );
          return;
        }
        record([...entries[cursor], button.dataset.shape!]);
      }),
    );
    q<HTMLButtonElement>("[data-undo]").addEventListener("click", () => {
      if (cursor > 0) {
        cursor--;
        draw();
      }
    });
    q<HTMLButtonElement>("[data-redo]").addEventListener("click", () => {
      if (cursor < entries.length - 1) {
        cursor++;
        draw();
      }
    });
    q<HTMLButtonElement>("[data-clear-shapes]").addEventListener("click", () =>
      record([]),
    );
    draw();
  }
  initAtlasPixelCanvas(root);
  const tasks = root.querySelectorAll<HTMLInputElement>("[data-task]");
  tasks.forEach((task) =>
    task.addEventListener("change", () => {
      const count = [...tasks].filter((t) => t.checked).length;
      q<HTMLProgressElement>("[data-progress]").value = count;
      q<HTMLOutputElement>("[data-progress-output]").value =
        `${count} / ${tasks.length}`;
    }),
  );
  root
    .querySelector<HTMLButtonElement>("[data-pin-note]")
    ?.addEventListener("click", () => {
      const input = q<HTMLTextAreaElement>('[data-note-input]');
      const error = q<HTMLElement>('#atlas-note-error');
      const text = input.value.trim();
      error.hidden = !!text;
      input.setAttribute('aria-invalid', String(!text));
      if (!text) {
        error.textContent = say('先写下一点想法，再贴上去。', 'Write a thought before pinning it.');
        input.focus();
        return;
      }
      for (const note of root.querySelectorAll<HTMLElement>('[data-pinned-note], [data-note-result]')) {
        note.hidden = false;
        note.textContent = text;
        note.getAnimations().forEach(a => a.cancel());
        if (!reduced()) note.animate([{ opacity: 0, transform: 'translateY(-16px) rotate(-6deg)' }, { opacity: 1, transform: 'none' }], { duration: 240, easing: 'ease-out' });
      }
    });
  root.querySelector<HTMLTextAreaElement>('[data-note-input]')?.addEventListener('input', event => {
    const input = event.currentTarget as HTMLTextAreaElement;
    if (input.value.trim()) { input.removeAttribute('aria-invalid'); q<HTMLElement>('#atlas-note-error').hidden = true; }
  });
  root
    .querySelector<HTMLButtonElement>("[data-clear-note]")
    ?.addEventListener("click", () => {
      q<HTMLTextAreaElement>("[data-note-input]").value = "";
      q<HTMLElement>("[data-pinned-note]").textContent = "";
      q<HTMLElement>('[data-note-result]').hidden = true;
      q<HTMLElement>('#atlas-note-error').hidden = true;
      q<HTMLTextAreaElement>('[data-note-input]').removeAttribute('aria-invalid');
    });
  const squish = root.querySelector<HTMLButtonElement>('[data-squish]');
  if (squish) {
    const piece = q<HTMLElement>('[data-clay-object]');
    const feedback = q<HTMLElement>('[data-clay-status]');
    let held = false;
    let physicalAt = -Infinity;
    const press = () => {
      if (held) return;
      held = true;
      piece.getAnimations().forEach(a => a.cancel());
      piece.dataset.pressed = 'true';
      feedback.textContent = say('正在受压……松开试试。', 'Under pressure… release to restore.');
    };
    const release = () => {
      if (!held) return;
      held = false;
      physicalAt = performance.now();
      const from = getComputedStyle(piece).transform;
      piece.dataset.pressed = 'false';
      if (!reduced()) piece.animate([{ transform: from }, { transform: 'scale(.97,1.06)', offset: .65 }, { transform: 'none' }], { duration: 320, easing: 'ease-out' });
      feedback.textContent = say('已松开，黏土恢复原形。', 'Released. The clay returns to its shape.');
    };
    squish.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      physicalAt = performance.now();
      squish.setPointerCapture(event.pointerId);
      press();
    });
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture', 'blur']) squish.addEventListener(type, release);
    squish.addEventListener('keydown', event => {
      if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); physicalAt = performance.now(); press(); }
    });
    squish.addEventListener('keyup', event => {
      if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); release(); }
    });
    // Assistive technology may activate a button without pointer/key down events.
    squish.addEventListener('click', () => {
      if (performance.now() - physicalAt < 150) return;
      press(); release();
    });
    window.addEventListener('pagehide', release);
    window.addEventListener('blur', release);
  }
  root.querySelectorAll<HTMLButtonElement>("[data-sticker]").forEach((button) =>
    button.addEventListener("click", () => {
      const board = q<HTMLElement>("[data-stickers]");
      if (board.childElementCount >= 5) board.firstElementChild?.remove();
      const sticker = document.createElement('span');
      sticker.className = 'atlas-sticker';
      sticker.textContent = '★';
      const angle = board.childElementCount % 2 ? 7 : -6;
      sticker.style.setProperty('--sticker-angle', `${angle}deg`);
      board.append(sticker);
      if (!reduced()) sticker.animate([{ opacity: 0, transform: 'translateY(-14px) scale(1.25)' }, { opacity: 1, transform: `scale(.9) rotate(${angle}deg)`, offset: .7 }, { transform: `rotate(${angle}deg)` }], { duration: 180, easing: 'ease-out' });
      announce(say(`已贴 ${board.childElementCount} 张，最多保留最近 5 张。`, `${board.childElementCount} stickers. Keeping the latest five.`), q<HTMLElement>('[data-sticker-count]'));
    }),
  );
  const lens = root.querySelector<HTMLElement>("[data-lens]");
  const optics = root.querySelector<HTMLElement>(".atlas-optics-stage");
  optics?.addEventListener("pointermove", (event) => {
    if (!lens || reduced()) return;
    const box = optics.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    lens.style.transform = `translate(${x * 12}px,${y * 12}px) rotate(${-16 + x * 8}deg)`;
  });
  optics?.addEventListener("pointerleave", () => {
    if (lens) lens.style.transform = "";
  });
  root
    .querySelector<HTMLButtonElement>("[data-window-toggle]")
    ?.addEventListener("click", (event) => {
      const button = event.currentTarget as HTMLButtonElement;
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      button.textContent = expanded ? "+" : "−";
      q<HTMLElement>("[data-folder-content]").hidden = expanded;
    });
  // Retro window navigation is confined to its own folder history, never the site Home link.
  const folders = root.querySelector<HTMLElement>("[data-folder-content]");
  if (folders) {
    const initial = folders.cloneNode(true) as HTMLElement;
    let historyFolders = [-1];
    let folderCursor = 0;
    function renderFolder() {
      const index = historyFolders[folderCursor];
      q<HTMLButtonElement>("[data-folder-home]").disabled = index === -1;
      q<HTMLButtonElement>("[data-folder-back]").disabled = folderCursor === 0;
      q<HTMLButtonElement>("[data-folder-forward]").disabled =
        folderCursor === historyFolders.length - 1;
      q<HTMLElement>("[data-folder-path]").textContent =
        index < 0 ? "atlas://home" : `atlas://folder/${index + 1}`;
      if (index < 0) {
        folders!.replaceChildren(
          ...[...initial.childNodes].map((n) => n.cloneNode(true)),
        );
      } else {
        const v = data.variants[index];
        const title = document.createElement("h2");
        title.textContent = v.name;
        const p = document.createElement("p");
        p.textContent = v.note;
        const action = document.createElement("button");
        action.type = "button";
        action.textContent = say("查看详情", "Open details");
        action.addEventListener("click", () =>
          openDialog(`#variant-${index}`, action),
        );
        folders!.replaceChildren(title, p, action);
      }
    }
    folders.addEventListener("click", (event) => {
      const button = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-folder]",
      );
      if (!button) return;
      historyFolders = historyFolders.slice(0, folderCursor + 1);
      historyFolders.push(Number(button.dataset.folder));
      folderCursor++;
      renderFolder();
    });
    q<HTMLButtonElement>("[data-folder-back]").addEventListener("click", () => {
      if (folderCursor > 0) {
        folderCursor--;
        renderFolder();
      }
    });
    q<HTMLButtonElement>("[data-folder-forward]").addEventListener(
      "click",
      () => {
        if (folderCursor < historyFolders.length - 1) {
          folderCursor++;
          renderFolder();
        }
      },
    );
    q<HTMLButtonElement>("[data-folder-home]").addEventListener("click", () => {
      historyFolders = historyFolders.slice(0, folderCursor + 1);
      historyFolders.push(-1);
      folderCursor++;
      renderFolder();
    });
    renderFolder();
  }
  // Audio is created only after an explicit press and stopped on hide/navigation.
  const play = root.querySelector<HTMLButtonElement>("[data-synth-toggle]");
  if (play) {
    const synth = createAtlasSynth({
      volume: () => Number(range?.value ?? 20),
      onState: state => {
        play.disabled = state === 'loading';
        play.setAttribute('aria-pressed', String(state === 'playing'));
        play.textContent = state === 'playing' ? say('Ⅱ 暂停', 'Ⅱ Pause')
          : state === 'loading' ? say('正在启动…', 'Starting…') : say('▶ 播放合成音', '▶ Play synth');
        root.querySelector('[data-waveform]')?.classList.toggle('playing', state === 'playing');
      },
      onError: () => announce(say('浏览器无法播放音频。', 'Audio is unavailable in this browser.')),
    });
    play.addEventListener('click', () => { void synth.toggle(); });
    range?.addEventListener('input', synth.updateVolume);
    addEventListener("pagehide", synth.stop);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) synth.stop();
    });
  }
}
