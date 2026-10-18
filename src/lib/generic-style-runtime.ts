import { getTeamSceneData, getTeamCalendarDays, teamDate, teamMonthLabel, TEAM_INITIAL_DATE, TEAM_INITIAL_YEAR, TEAM_INITIAL_MONTH } from './team-scene-data';

/** 十五种配置驱动品牌场景：无服务端、真实账户或网络副作用。 */
export function initGenericStyle(root: HTMLElement): void {
  if (!root.hasAttribute('data-generic-style') || root.dataset.genericReady === 'true') return;
  const found = root.querySelector<HTMLElement>('[data-generic-content]');
  if (!found) return;
  const content = found;
  root.dataset.genericReady = 'true';
  const slug = root.dataset.styleScene ?? '';
  const en = root.dataset.sceneLocale === 'en';
  const l = (zh: string, english: string) => en ? english : zh;
  const q = <T extends HTMLElement = HTMLElement>(selector: string) => content.querySelector<T>(selector);
  const all = <T extends HTMLElement = HTMLElement>(selector: string) => Array.from(content.querySelectorAll<T>(selector));
  const set = (selector: string, value: string) => { const el = q(selector); if (el) el.textContent = value; };
  const status = (zh: string, english: string) => set('[data-generic-status]', l(zh, english));
  const initialMarkup = content.innerHTML;
  type SavedEntry = { text: string; detail: string; done?: boolean; due?: string };
  const teamLocale = en ? 'en' : 'zh';
  const initialSaved = (): SavedEntry[] => slug === 'corporate-memphis' ? getTeamSceneData(teamLocale).tasks : [];
  const initialNotes = () => slug === 'corporate-memphis' ? getTeamSceneData(teamLocale).notes : [];
  // 刷新、外层重置与模式切换都恢复初始样张；不触碰站点真实收藏或持久存储。
  let saved: SavedEntry[] = initialSaved();
  let teamNotes = initialNotes(), noteSequence = teamNotes.length, openTeamNote = teamNotes[0]?.id ?? '';
  let calendarYear = TEAM_INITIAL_YEAR, calendarMonth = TEAM_INITIAL_MONTH, selectedDate = TEAM_INITIAL_DATE;
  const scrollToContent = () => content.scrollIntoView({ behavior: 'instant', block: 'start' });
  function showPanel(index: number, focus = false) {
    const tabs = all<HTMLButtonElement>('[data-generic-tab]');
    index = Math.max(0, Math.min(tabs.length - 1, index));
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    all('[data-generic-panel]').forEach(panel => { panel.hidden = Number(panel.dataset.genericPanel) !== index; });
    root.querySelectorAll<HTMLElement>('.generic-style-hero [data-generic-action^="nav-"]').forEach((el, i) => {
      if (i + 1 === index) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
    });
    if (focus) { scrollToContent(); q(`[data-generic-panel="${index}"]`)?.focus({ preventScroll: true }); }
  }
  function listItem(text: string, detail = '', remove?: () => void): HTMLLIElement {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = detail ? `${text} · ${detail}` : text;
    li.append(span);
    if (remove) {
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = l('移除', 'Remove');
      button.setAttribute('aria-label', `${l('移除', 'Remove')} ${text}`);
      button.addEventListener('click', () => {
        const list = li.parentElement;
        const index = list ? Array.from(list.children).indexOf(li) : 0;
        remove();
        const remaining = list?.querySelectorAll<HTMLButtonElement>(':scope > li > button');
        const adjacent = remaining?.[Math.min(index, remaining.length - 1)];
        const fallback = list?.closest('[data-generic-panel]')?.querySelector<HTMLElement>('input:not([type="checkbox"]):not([type="hidden"]), textarea, button');
        const destination = adjacent ?? fallback ?? q('[data-command="reset"]');
        // 空表回到输入入口中央，避免原生最近边缘定位把小数像素的边框留在视口外。
        if (!adjacent) destination?.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' });
        destination?.focus({ preventScroll: !adjacent });
      }); li.append(button);
    }
    return li;
  }
  function renderSaved() {
    const target = q(slug === 'flat-design' ? '[data-workspaces]' : slug === 'hand-drawn' ? '[data-notes]' : '[data-team-tasks]');
    if (!target) return;
    target.replaceChildren();
    const search = q<HTMLInputElement>('[data-note-search]')?.value.trim().toLocaleLowerCase() ?? '';
    let shown = 0;
    saved.forEach((entry, index) => {
      if (search && !`${entry.text} ${entry.detail}`.toLocaleLowerCase().includes(search)) return;
      shown++;
      const li = listItem(entry.text, slug === 'corporate-memphis' ? `${entry.detail} · ${entry.due}` : entry.detail, () => { saved.splice(index, 1); renderSaved(); });
      if (slug === 'corporate-memphis') {
        const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.checked = entry.done === true;
        checkbox.setAttribute('aria-label', `${l('完成', 'Complete')} ${entry.text}`);
        li.dataset.done = String(checkbox.checked);
        checkbox.addEventListener('change', () => { entry.done = checkbox.checked; li.dataset.done = String(entry.done); updateProgress(); });
        li.prepend(checkbox);
      }
      target.append(li);
    });
    const empty = q('[data-note-empty], [data-empty]');
    if (empty) { empty.hidden = shown > 0; if (search && shown === 0) empty.textContent = l('没有找到这段记录。', 'No notes match your search.'); else if (slug === 'hand-drawn') empty.textContent = l('第一笔，留给今天。', 'Your first page starts today.'); }
    updateProgress();
  }
  function updateProgress() {
    set('[data-team-progress]', `${saved.filter(e => e.done).length} / ${saved.length} ${l('已完成', 'complete')}`);
    updateTeamSummary();
  }
  function updateTeamSummary() {
    if (slug !== 'corporate-memphis') return;
    const pending = saved.filter(entry => !entry.done).length;
    const due = saved.filter(entry => entry.due === selectedDate && !entry.done).length;
    root.querySelectorAll('[data-team-task-count]').forEach(el => { el.textContent = String(pending); });
    root.querySelectorAll('[data-team-task-caption]').forEach(el => { el.textContent = selectedDate === TEAM_INITIAL_DATE && saved.filter(entry => !entry.done).every(entry => entry.due === selectedDate) ? l('今日待完成 ✓', 'Due today ✓') : l('待完成任务 ✓', 'Pending tasks ✓'); });
    root.querySelectorAll('[data-team-note-count]').forEach(el => { el.textContent = String(teamNotes.length); });
    set('[data-team-notes-total]', String(teamNotes.length));
    set('[data-team-selected-date]', selectedDate);
    set('[data-team-date-summary]', l(`所选日期有 ${due} 项待办任务`, `${due} pending tasks on the selected date`));
  }
  function renderTeamCalendar() {
    if (slug !== 'corporate-memphis') return;
    const cells = getTeamCalendarDays(calendarYear, calendarMonth);
    const calendar = root.querySelector<HTMLElement>('[data-team-calendar-date]');
    if (calendar) calendar.dataset.teamCalendarDate = selectedDate;
    const heading = root.querySelector('[data-team-month]');
    if (heading) heading.textContent = teamMonthLabel(calendarYear, calendarMonth, teamLocale);
    root.querySelectorAll<HTMLButtonElement>('[data-team-cell]').forEach((cell, i) => {
      const day = cells[i]; cell.textContent = day === null ? '' : String(day); cell.disabled = day === null;
      if (day === null) { delete cell.dataset.teamDay; cell.setAttribute('aria-hidden', 'true'); cell.removeAttribute('aria-pressed'); cell.removeAttribute('aria-label'); cell.dataset.teamSelected = 'false'; }
      else { const date = teamDate(calendarYear, calendarMonth, day); cell.dataset.teamDay = String(day); cell.dataset.teamSelected = String(date === selectedDate); cell.removeAttribute('aria-hidden'); cell.setAttribute('aria-label', `${l('选择','Select')} ${date}`); cell.setAttribute('aria-pressed', String(date === selectedDate)); }
    });
    updateTeamSummary();
  }
  function moveTeamMonth(step: number) {
    const total = calendarYear * 12 + calendarMonth + step;
    const year = Math.floor(total / 12), month = total % 12;
    if (year < 1 || year > 9999) return;
    calendarYear = year; calendarMonth = month;
    const last = Math.max(...getTeamCalendarDays(year, month).map(day => day ?? 0));
    selectedDate = teamDate(year, month, Math.min(Number(selectedDate.slice(-2)), last));
    renderTeamCalendar(); status(`已查看 ${selectedDate} 的团队日程。`, `Viewing the team schedule for ${selectedDate}.`);
  }
  function renderTeamNotes() {
    if (slug !== 'corporate-memphis') return;
    if (!teamNotes.some(note => note.id === openTeamNote)) openTeamNote = teamNotes[0]?.id ?? '';
    const list = q('[data-team-notes-list]'); if (!list) return;
    list.replaceChildren();
    teamNotes.forEach(note => {
      const li = document.createElement('li');
      const read = document.createElement('button'); read.type = 'button'; read.dataset.command = 'team-read-note'; read.dataset.value = note.id; read.textContent = note.title; read.setAttribute('aria-pressed', String(note.id === openTeamNote));
      const remove = document.createElement('button'); remove.type = 'button'; remove.dataset.command = 'team-delete-note'; remove.dataset.value = note.id; remove.textContent = l('删除', 'Delete'); remove.setAttribute('aria-label', `${l('删除','Delete')} ${note.title}`);
      li.append(read, remove); list.append(li);
    });
    const selected = teamNotes.find(note => note.id === openTeamNote);
    set('[data-team-note-title]', selected?.title ?? l('笔记本已清空', 'The notebook is empty'));
    set('[data-team-note-body]', selected?.body ?? l('记录团队的下一条想法。', 'Write down the team’s next idea.'));
    updateTeamSummary();
  }
  function openTeamWorkspace(kind: 'tasks' | 'notes') {
    showPanel(0);
    const target = q(`[data-team-${kind === 'tasks' ? 'task' : 'notes'}-workspace]`);
    target?.scrollIntoView({ behavior: 'instant', block: 'start' }); target?.focus({ preventScroll: true });
  }
  renderSaved(); renderTeamCalendar(); renderTeamNotes();

  let selectedShape = 0, shapeCount = 0, squeezes = 0, adopted = 0;
  let connected = false, credit = false, painted = 0, pixelColor = '#EF7D57';
  let floor = 0;
  const basket = new Map<string, { count: number; price: number }>();
  const collection = new Set<string>();
  const passport = new Set<number>();
  let audio: AudioContext | null = null, oscillator: OscillatorNode | null = null, gain: GainNode | null = null;
  let playing = false, starting = false, track = 0, soundGeneration = 0;
  const tracks = ['Midnight Drive', 'Neon Coast', 'Last Sunset'];
  const frequencies = [164.81, 196, 220];
  function stopSound() {
    soundGeneration++; starting = false;
    oscillator?.stop(); oscillator = null;
    if (audio && audio.state !== 'closed') void audio.close().catch(() => {});
    audio = null; gain = null; playing = false;
  }
  function renderRadio() {
    set('[data-track]', `0${track+1} · ${tracks[track]}`);
    const button = q<HTMLButtonElement>('[data-command="play"]');
    if (button) { button.textContent = playing ? l('暂停电台 ⏸', 'Pause radio ⏸') : l('播放电台 ▶', 'Play radio ▶'); button.setAttribute('aria-pressed', String(playing)); }
    const bars = q('[data-equalizer]'); if (bars) bars.dataset.playing = String(playing);
    set('[data-radio-status]', playing ? l('正在播放本机合成音。', 'Playing a locally synthesized tone.') : l('电台已暂停。', 'The radio is paused.'));
  }
  async function toggleRadio() {
    if (starting) return;
    if (playing) { stopSound(); renderRadio(); return; }
    starting = true;
    const generation = ++soundGeneration;
    try {
      const context = new AudioContext(); audio = context; await context.resume();
      // 异步启动期间若重置或离开页面，不再创建振荡器。
      if (generation !== soundGeneration || audio !== context) { if (context.state !== 'closed') void context.close().catch(() => {}); return; }
      gain = context.createGain(); gain.gain.value = Number(q<HTMLInputElement>('[data-volume]')?.value ?? 20) / 1000;
      gain.connect(context.destination);
      oscillator = context.createOscillator(); oscillator.type = 'triangle'; oscillator.frequency.value = frequencies[track]; oscillator.connect(gain); oscillator.start();
      playing = true; starting = false; renderRadio();
    } catch {
      if (generation !== soundGeneration) return;
      stopSound(); renderRadio(); set('[data-radio-status]', l('当前浏览器不支持音频，请在支持 Web Audio 的浏览器体验。', 'Audio is unavailable. Try a browser with Web Audio support.'));
    }
  }
  window.addEventListener('pagehide', () => { stopSound(); if (slug === 'retro-futurism') renderRadio(); });

  function renderBasket() {
    const list = q('[data-basket]'); if (!list) return;
    list.replaceChildren(); let total = 0;
    basket.forEach((entry, name) => { total += entry.count * entry.price; list.append(listItem(name, `${entry.count} × $${entry.price}`, () => { basket.delete(name); renderBasket(); })); });
    set('[data-basket-total]', basket.size ? `${l('合计', 'Total')} $${total} · ${l('仅作清单，不会下单', 'A wishlist only; no order is placed')}` : l('尚未添加物品', 'Your list is empty'));
  }
  function updateLight() {
    const spectrum = q<HTMLSelectElement>('[data-spectrum]'); const intensity = q<HTMLInputElement>('[data-intensity]');
    if (!spectrum || !intensity) return;
    const field = q('[data-light-field]'); field?.style.setProperty('--light-hue', spectrum.value); field?.style.setProperty('--light-intensity', String(Number(intensity.value)/100));
    set('[data-light-values]', `${spectrum.selectedOptions[0].textContent} / ${intensity.value}%`);
  }
  function updateGlass() {
    const material = q<HTMLSelectElement>('[data-glass-material]'); const depth = q<HTMLInputElement>('[data-glass-depth]'); const angle = q<HTMLInputElement>('[data-glass-angle]');
    if (!material || !depth || !angle) return;
    const specimen = q('[data-glass-specimen]'); if (specimen) { specimen.dataset.material = material.value; specimen.style.setProperty('--glass-depth', `${depth.value}px`); }
    q('[data-glass-stage]')?.style.setProperty('--glass-angle', `${angle.value}deg`);
    set('[data-glass-values]', `${material.value} / ${depth.value}px / ${angle.value}°`);
  }
  function updateFloor() {
    floor = q<HTMLSelectElement>('[data-floor]')?.selectedIndex ?? 0;
    set('[data-floor-sign]', `${floor+1}F`);
    const descriptions = [l('试听磁带，在慢拍里度过下午。','Browse tapes and spend an afternoon in slow motion.'),l('来一杯蜜桃汽水，坐在永远阳光明亮的美食广场。','Peach soda and a seat in the forever-sunny food court.'),l('登上屋顶花园，等一场不会结束的日落。','Visit the sky garden for a sunset that never ends.')];
    set('[data-floor-description]', descriptions[floor]);
    q('[data-mall-map]')?.style.setProperty('filter', `hue-rotate(${floor*25}deg)`);
  }
  function connect() {
    connected = !connected;
    const terminal = q('.gs-terminal'); if (terminal) terminal.dataset.online = String(connected);
    set('[data-network-status]', connected ? 'CONNECTED / LOCAL' : 'DISCONNECTED');
    set('[data-network-route]', connected ? (q<HTMLSelectElement>('[data-district]')?.value ?? 'KABUKI') : '—');
    set('[data-command="connect"]', connected ? l('断开街区', 'Disconnect district') : l('接入街区', 'Connect to district'));
  }
  function squeeze() {
    squeezes++; set('[data-squeeze-count]', `${l('已捏', 'Squeezed')} ${squeezes} ${l('次，心情 +1', 'times. Joy +1')}`);
    const blob = q('[data-blob]'); if (blob) { blob.dataset.squeezed = 'false'; void blob.offsetWidth; blob.dataset.squeezed = 'true'; }
  }
  function startPixels() { credit = true; set('[data-pixel-status]', `CREDIT 1 / ${l('开始画吧', 'READY TO PAINT')}`); }
  function paint(cell: HTMLButtonElement) {
    if (!credit) { set('[data-pixel-status]', l('请先按 INSERT COIN 开始。','Press INSERT COIN first.')); return; }
    cell.style.background = pixelColor; cell.setAttribute('aria-pressed', 'true');
    painted = all('[data-pixel][aria-pressed="true"]').length;
    set('[data-pixel-status]', `CREDIT 1 / ${painted} ${l('像素已点亮','PIXELS PAINTED')}`);
  }
  function primary() {
    showPanel(0, true);
    if (slug === 'retro-futurism') void toggleRadio();
    else if (slug === 'claymorphism') squeeze();
    else if (slug === 'cyberpunk') connect();
    else if (slug === 'pixel-art') startPixels();
    else if (slug === 'aurora') { const input = q<HTMLInputElement>('[data-intensity]'); if (input) { input.value = '85'; updateLight(); } }
    else q<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement>('input, textarea, select, .gs-primary')?.focus({ preventScroll: true });
  }
  function command(name: string, value = '', button?: HTMLButtonElement) {
    switch (name) {
      case 'return': showPanel(0, true); break;
      case 'reset': {
        stopSound(); saved = initialSaved();
        teamNotes = initialNotes(); noteSequence = teamNotes.length; openTeamNote = teamNotes[0]?.id ?? '';
        calendarYear = TEAM_INITIAL_YEAR; calendarMonth = TEAM_INITIAL_MONTH; selectedDate = TEAM_INITIAL_DATE;
        content.innerHTML = initialMarkup; basket.clear(); collection.clear(); passport.clear();
        selectedShape = shapeCount = squeezes = adopted = painted = floor = track = 0; connected = credit = false; pixelColor = '#EF7D57';
        renderSaved(); renderTeamCalendar(); renderTeamNotes(); showPanel(0); status('已重置此品牌的本地体验与保存内容。', 'This brand’s local experience and saved content have been reset.');
        q<HTMLButtonElement>('[data-command="reset"]')?.focus({ preventScroll:true });
        break;
      }
      case 'team-read-note': openTeamNote = value; renderTeamNotes(); q('[data-team-note-detail]')?.scrollIntoView({ behavior: 'instant', block: 'nearest' }); q('[data-team-note-detail]')?.focus({ preventScroll: true }); break;
      case 'team-delete-note': {
        teamNotes = teamNotes.filter(note => note.id !== value); renderTeamNotes();
        (q<HTMLButtonElement>(`[data-command="team-read-note"][data-value="${openTeamNote}"]`) ?? q<HTMLInputElement>('[data-generic-form="team-note"] [name="title"]'))?.focus({ preventScroll: true });
        status('这条笔记已从本页团队笔记本移除。', 'The note has been removed from this page’s team notebook.'); break;
      }
      case 'shape': selectedShape = Number(value); all<HTMLButtonElement>('[data-command="shape"]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.value === value))); break;
      case 'place': {
        if (shapeCount >= 12) { status('构图已放满 12 个形状。清空后可以重新开始。', 'The composition has 12 shapes. Clear it to start again.'); break; }
        const shape = document.createElement('i'); shape.className = `form-${selectedShape}`;
        shape.style.left = `${8+(shapeCount*23)%64}%`; shape.style.top = `${8+(shapeCount*31)%64}%`;
        q('[data-composition]')?.append(shape); shapeCount++; set('[data-shape-count]', `${shapeCount} / 12`); break;
      }
      case 'clear-shapes': q('[data-composition]')?.replaceChildren(); shapeCount = 0; set('[data-shape-count]', '0 / 12'); break;
      case 'connect': connect(); break;
      case 'squeeze': squeeze(); break;
      case 'adopt': {
        adopted++; const select = q<HTMLSelectElement>('[data-clay-color]');
        q('[data-clay-cabin]')?.append(listItem(`${l('朋友','Friend')} ${adopted}`, select?.selectedOptions[0].textContent ?? ''));
        status('新朋友已经住进小屋。', 'Your new friend has moved into the cabin.'); break;
      }
      case 'play': void toggleRadio(); break;
      case 'previous': case 'next': track = (track + (name === 'next' ? 1 : 2)) % tracks.length; if (oscillator && audio) oscillator.frequency.setValueAtTime(frequencies[track], audio.currentTime); renderRadio(); break;
      case 'save-light': q('[data-light-saves]')?.append(listItem(q('[data-light-values]')?.textContent ?? '')); status('这束光已保存到本页。', 'This light has been saved in this page.'); break;
      case 'save-glass': q('[data-glass-saves]')?.append(listItem(q('[data-glass-values]')?.textContent ?? '')); status('材质配方已保存到本页。', 'The material recipe has been saved in this page.'); break;
      case 'basket': {
        const productName = button?.dataset.name; if (!productName) break;
        const entry = basket.get(productName) ?? { count: 0, price: Number(button?.dataset.price ?? 0) }; entry.count++; basket.set(productName, entry); renderBasket(); break;
      }
      case 'clear-basket': basket.clear(); renderBasket(); break;
      case 'coin': startPixels(); break;
      case 'pixel-color': pixelColor = value; all<HTMLButtonElement>('[data-command="pixel-color"]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.value === value))); break;
      case 'clear-pixels': all<HTMLButtonElement>('[data-pixel]').forEach(cell => { cell.style.removeProperty('background'); cell.setAttribute('aria-pressed', 'false'); }); painted = 0; set('[data-pixel-status]', credit ? 'CREDIT 1 / 0 PIXELS' : 'CREDIT 0 / READY?'); break;
      case 'visit': {
        if (!passport.has(floor)) { passport.add(floor); q('[data-passport]')?.append(listItem(`${floor+1}F`, q<HTMLSelectElement>('[data-floor]')?.selectedOptions[0].textContent ?? '')); }
        status(`商场护照已集齐 ${passport.size} / 3 枚印章。`, `Your mall passport has ${passport.size} / 3 stamps.`); break;
      }
      case 'keep': {
        const item = button?.dataset.name ?? ''; if (!item) break;
        if (collection.has(item)) collection.delete(item); else collection.add(item);
        all<HTMLButtonElement>('[data-command="keep"]').forEach(el => el.setAttribute('aria-pressed', String(collection.has(el.dataset.name ?? ''))));
        all('[data-shelf-list]').forEach(list => { list.replaceChildren(); collection.forEach(text => list.append(listItem(text))); });
        all('[data-shelf-empty]').forEach(el => { el.hidden = collection.size > 0; }); break;
      }
    }
  }
  root.addEventListener('click', event => {
    const target = event.target as Element;
    const button = target.closest<HTMLButtonElement>('button'); if (!button || !root.contains(button)) return;
    if (button.hasAttribute('data-pixel')) { paint(button); return; }
    if (button.dataset.genericTab !== undefined) { showPanel(Number(button.dataset.genericTab)); return; }
    if (button.dataset.command) { command(button.dataset.command, button.dataset.value, button); return; }
    const action = button.dataset.sceneAction;
    if (!action) return;
    if (slug === 'corporate-memphis' && action === 'calendar-previous') moveTeamMonth(-1);
    else if (slug === 'corporate-memphis' && action === 'calendar-next') moveTeamMonth(1);
    else if (slug === 'corporate-memphis' && action === 'calendar-day' && button.dataset.teamDay) { selectedDate = teamDate(calendarYear, calendarMonth, Number(button.dataset.teamDay)); renderTeamCalendar(); status(`已选择 ${selectedDate}，下方看板显示该日待办摘要。`, `${selectedDate} selected. The board below shows its task summary.`); }
    else if (slug === 'corporate-memphis' && action === 'team-tasks') openTeamWorkspace('tasks');
    else if (slug === 'corporate-memphis' && action === 'team-notes') openTeamWorkspace('notes');
    else if (action.startsWith('nav-')) showPanel(Number(action.slice(4)) + 1, true);
    else if (action === 'search') { showPanel(0, true); q<HTMLInputElement>('[data-note-search]')?.focus({ preventScroll: true }); }
    else if (action === 'next' || action === 'previous') command(action);
    else if (action === 'login' || (action.startsWith('extra-') && slug === 'flat-design')) { showPanel(0, true); status('已进入访客工作区。此样张不使用密码，也不会创建真实账户。', 'Guest workspace opened. This study uses no password and creates no real account.'); q<HTMLInputElement>('input')?.focus({ preventScroll: true }); }
    else if (action === 'primary' || action.startsWith('extra-')) primary();
  });
  content.addEventListener('submit', event => {
    const form = event.target as HTMLFormElement; if (!form.dataset.genericForm) return;
    event.preventDefault(); if (!form.reportValidity()) return;
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? '').trim();
    const requireText = (field: string) => { if (value(field)) return true; const input = form.elements.namedItem(field) as HTMLInputElement; input.setCustomValidity(l('请填写内容，而不只是空格。','Please enter text, not just spaces.')); input.reportValidity(); return false; };
    switch (form.dataset.genericForm) {
      case 'workspace': if (!requireText('name')) return; saved.push({ text: value('name'), detail: value('plan') }); renderSaved(); status('本地工作区已创建，开始安排下一步吧。','Local workspace created. You are ready to plan the next step.'); break;
      case 'member': if (!requireText('name')) return; set('[data-member-name]', value('name')); set('[data-member-outfit]', value('outfit')); set('[data-member-status]', l('会员卡已生成 · 仅保存在本页','Member card created · Saved in this page only')); status('欢迎来到你的星球。','Welcome to your planet.'); break;
      case 'party': {
        if (!requireText('name')) return; set('[data-party-name]', value('name')); set('[data-party-guests]', `${value('guests')} ${l('位朋友，等你来玩。','friends invited to play.')}`);
        const palette = (form.elements.namedItem('palette') as HTMLSelectElement).selectedIndex;
        const invitation = q('[data-invitation]'); if (invitation) invitation.style.background = ['#ffb4ca','#ffdf65','#e0c5ff'][palette];
        status('你的派对邀请卡已制作完成。','Your party invitation is ready.'); break;
      }
      case 'reservation': if (!requireText('name')) return; set('[data-reservation]', `${value('name')} / ${value('date')} / ${value('guests')} ${l('位 · 晚宴意向已保存，未实际预订','guests · Evening plan saved, not a real booking')}`); status('期待这个夜晚。此处没有发出实际预订。','An evening to look forward to. No real booking was made.'); break;
      case 'team': if (!requireText('task')) return; saved.push({ text: value('task'), detail: value('owner'), done: false, due: selectedDate }); renderSaved(); (form.elements.namedItem('task') as HTMLInputElement).value = ''; status('小小的下一步，已经加入团队看板。','One small next step is now on the team board.'); break;
      case 'team-note': if (!requireText('title') || !requireText('body')) return; openTeamNote = `note-${++noteSequence}`; teamNotes.push({ id: openTeamNote, title: value('title'), body: value('body') }); renderTeamNotes(); form.reset(); q('[data-team-note-detail]')?.scrollIntoView({ behavior: 'instant', block: 'nearest' }); q('[data-team-note-detail]')?.focus({ preventScroll: true }); status('团队笔记已保存在本页。', 'The team note has been saved in this page.'); break;
      case 'note': if (!requireText('note')) return; saved.push({ text: value('note'), detail: value('paper') }); renderSaved(); (form.elements.namedItem('note') as HTMLTextAreaElement).value = ''; status('这一笔已夹进本页的日记本。','Your note is saved in the journal in this page.'); break;
    }
  });
  const updateControl = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if ('setCustomValidity' in input) input.setCustomValidity('');
    if (input.matches('[data-spectrum], [data-intensity]')) updateLight();
    if (input.matches('[data-glass-material], [data-glass-depth], [data-glass-angle]')) updateGlass();
    if (input.matches('[data-clay-color]')) q('[data-blob]')?.style.setProperty('background', input.value);
    if (input.matches('[data-volume]') && gain && audio) gain.gain.setTargetAtTime(Number(input.value)/1000, audio.currentTime, .03);
    if (input.matches('[data-floor]')) updateFloor();
    if (input.matches('[data-note-search]')) renderSaved();
    if (input.matches('[data-gear]')) set('[data-gear-status]', `${all<HTMLInputElement>('[data-gear]:checked').length} / 3 ${l('装备已装载','modules loaded')}`);
    if (input.matches('[data-district]') && connected) set('[data-network-route]', input.value);
  };
  content.addEventListener('input', updateControl); content.addEventListener('change', updateControl);
  content.addEventListener('keydown', event => {
    const target = event.target as HTMLElement;
    if (target.hasAttribute('data-generic-tab')) {
      const tabs = all<HTMLButtonElement>('[data-generic-tab]'); const index = tabs.indexOf(target as HTMLButtonElement);
      const destination = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length-1 : event.key === 'ArrowRight' ? (index+1)%tabs.length : event.key === 'ArrowLeft' ? (index+tabs.length-1)%tabs.length : -1;
      if (destination >= 0) { event.preventDefault(); showPanel(destination); tabs[destination].focus(); }
    }
    if (target.hasAttribute('data-pixel') && ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) {
      event.preventDefault(); const index = Number(target.dataset.pixel); const step = { ArrowLeft:-1, ArrowRight:1, ArrowUp:-8, ArrowDown:8 }[event.key] ?? 0;
      const cells = all<HTMLButtonElement>('[data-pixel]'); const destination = (index+step+64)%64;
      cells.forEach((cell,i) => { cell.tabIndex = i === destination ? 0 : -1; }); cells[destination].focus();
    }
  });
}
