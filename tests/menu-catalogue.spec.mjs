import { test, expect } from './helpers/private-browser.mjs';

const groups = [
 ['context-menu','split-button','radial-menu','action-sheet','command-palette','mega-menu','flyout-menu','drill-down','accordion-menu','breadcrumb-menu'],
 ['searchable-select','multi-select','grouped-select','tree-select','creatable-select','workspace-switcher','thumbnail-menu','color-picker-menu','sort-menu','mention-menu'],
 ['async-options','virtualized-list','dependent-selects','pinned-recent','disabled-reasons','instant-toggles','slider-menu','unit-combobox','live-preview','transfer-dropdown'],
 ['edge-aware','responsive-overflow','tear-off','navigation-drawer','fullscreen-menu','date-range','filter-builder','column-manager','inline-confirmation','spring-loaded'],
];
const path = (n=1,locale='en') => `${locale==='en'?'/en':''}/components/menus${n===1?'':`/${n}`}`;
const row = (page,id) => page.locator(`[data-menu-id="${id}"]`);
async function go(page,n=1,locale='en') {
 await page.goto(path(n,locale));
 await expect(page.locator('.mc-catalogue astro-island[ssr]')).toHaveCount(0);
}
async function open(demo) {
 const trigger=demo.locator('.mc-trigger').first();
 if(await trigger.getAttribute('aria-expanded')==='false') await trigger.click();
}
for(const locale of ['zh','en']) for(let n=1;n<=4;n++) {
 test(`${locale}: menu page ${n} contains ten ordered demos and standard two-ended pagination`,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await go(page,n,locale);
  await expect(page.locator('.mc-row')).toHaveCount(10);
  expect(await page.locator('.mc-row').evaluateAll(ns=>ns.map(n=>n.id))).toEqual(groups[n-1]);
  await expect(page.locator('.mc-pagination')).toHaveCount(2);
  for(const nav of await page.locator('.mc-pagination').all()) {
   await expect(nav.locator('.mc-page-number')).toHaveText(['1','2','3','4']);
   await expect(nav.locator('[aria-current="page"]')).toHaveText(String(n));
   await expect(nav.locator('p')).toHaveText(locale==='zh'?`第 ${(n-1)*10+1}–${n*10} 项，共 40 项`:`${(n-1)*10+1}–${n*10} of 40 examples`);
  }
  for(const id of groups[n-1]) {
   const demo=row(page,id);
   await expect(demo.locator('.mc-description')).toBeVisible();
   await expect(demo.locator('.mc-hint')).toBeVisible();
   expect((await demo.locator('.mc-hint').innerText()).trim()).not.toBe('');
   await expect(demo.locator('img')).toHaveCount(0);
  }
  const ids=await page.locator('[id]').evaluateAll(ns=>ns.map(n=>n.id));
  expect(ids.filter((id,i)=>ids.indexOf(id)!==i)).toEqual([]);
  await expect(page.locator('.mc-originals')).not.toHaveAttribute('open');
  await page.goto(`${path(n,locale)}#${groups[n-1][9]}`);
  await expect(row(page,groups[n-1][9])).toBeInViewport();
  if(n<4){await page.locator('.mc-pagination').last().locator('[rel="next"]').click();await expect(page).toHaveURL(new RegExp(`${path(n+1,locale)}/?$`));}
  expect(errors).toEqual([]);
 });
}

test('context, split, radial, action-sheet and command actions respond to pointer and keyboard',async({page})=>{
 await go(page);
 const context=row(page,'context-menu');
 await context.locator('.mc-file').click({button:'right'});
 await context.getByRole('menuitem',{name:'Open Enter',exact:true}).click();
 await expect(context.locator('output')).toContainText('Open');
 await context.locator('.mc-file').press('Shift+F10');
 await expect(context.getByRole('menu')).toBeVisible();
 await context.getByRole('menuitem').first().press('Escape');
 await expect(context.locator('.mc-file')).toBeFocused();
 await context.locator('.mc-file').click();await context.getByRole('menuitem',{name:/Rename/}).click();await context.getByRole('textbox',{name:'File name',exact:true}).fill('Prototype.fig');await context.getByRole('textbox',{name:'File name',exact:true}).press('Enter');await expect(context.locator('.mc-file')).toContainText('Prototype.fig');
 await context.locator('.mc-file').click();await context.getByRole('menuitem',{name:/Delete/}).click();await expect(context.locator('.mc-file')).toHaveCount(0);await context.getByRole('button',{name:'Restore demo file',exact:true}).click();await expect(context.locator('.mc-file')).toContainText('Prototype.fig');
 const split=row(page,'split-button');await open(split);
 await split.getByRole('menuitem',{name:'Export SVG',exact:true}).click();
 await split.locator('.mc-split > button').first().click();
 await expect(split.locator('.mc-preview')).toContainText('Demo export complete');
 const radial=row(page,'radial-menu');await radial.getByRole('button',{name:'Rotate',exact:true}).click();
 await expect(radial.locator('output')).toHaveText('Rotate');
 const sheet=row(page,'action-sheet');await sheet.locator('.mc-trigger').click();
 await expect(sheet.getByRole('dialog')).toBeVisible();
 await sheet.getByRole('button',{name:'Cancel',exact:true}).click();
 await expect(sheet.locator('.mc-trigger')).toBeFocused();
 const command=row(page,'command-palette');await command.locator('.mc-trigger').press('Control+k');await expect(command.getByRole('textbox')).toBeFocused();
 await command.getByRole('textbox').fill('dark');await command.getByRole('textbox').press('Enter');
 await expect(command.locator('.mc-preview')).toHaveClass(/mc-theme-dark/);
});

test('mega, flyout, drill-down, accordion and breadcrumb retain the chosen content',async({page})=>{
 await go(page);
 const mega=row(page,'mega-menu');await mega.getByRole('menuitem',{name:'Canvas editor',exact:true}).click();await expect(mega.locator('output')).toHaveText('Canvas editor');
 const fly=row(page,'flyout-menu');await open(fly);const parent=fly.getByRole('menuitem',{name:'Export',exact:true});
 await parent.focus();await parent.press('ArrowRight');await expect(fly.getByRole('menuitem',{name:'PNG',exact:true})).toBeFocused();
 await page.keyboard.press('ArrowLeft');await expect(parent).toBeFocused();
 await parent.press('ArrowRight');await fly.getByRole('menuitem',{name:'PDF',exact:true}).click();await expect(fly.locator('output')).toHaveText('PDF');
 const drill=row(page,'drill-down');await drill.getByRole('button',{name:'Design resources',exact:false}).click();await drill.getByRole('button',{name:'Icons',exact:false}).click();await expect(drill.locator('output')).toHaveText('Design resources / Icons');
 await drill.getByRole('button',{name:'Back one level'}).click();await expect(drill.getByRole('button',{name:'Team files',exact:false})).toBeVisible();
 const accordion=row(page,'accordion-menu');await accordion.getByRole('button',{name:'Project settings',exact:false}).click();await accordion.getByRole('button',{name:'Members',exact:true}).click();await expect(accordion.locator('.mc-preview strong')).toHaveText('Members');
 const crumb=row(page,'breadcrumb-menu');await open(crumb);await crumb.getByRole('menuitem',{name:'Marketing',exact:true}).click();await expect(crumb.locator('.mc-preview')).toContainText('Marketing / Icon guide');
});

test('search, multi-select, grouped, mixed tree and creatable values work without a backend',async({page})=>{
 await go(page,2);
 const search=row(page,'searchable-select');await search.getByRole('combobox').fill('jp');await expect(search.getByRole('option')).toHaveCount(1);await search.getByRole('option').click();await expect(search.locator('.mc-trigger')).toContainText('Japan');
 const multi=row(page,'multi-select');await open(multi);await multi.getByRole('menuitemcheckbox',{name:'Engineering',exact:true}).click();await expect(multi.locator('.mc-chips')).toContainText('Engineering');await multi.getByRole('button',{name:'Remove Design',exact:true}).click();await expect(multi.locator('.mc-chips')).not.toContainText('Design');
 const grouped=row(page,'grouped-select');await open(grouped);await grouped.getByRole('menuitemradio',{name:'Code editor',exact:true}).click();await expect(grouped.locator('.mc-trigger')).toContainText('Code editor');
 const tree=row(page,'tree-select');await open(tree);const all=tree.getByRole('checkbox',{name:'Design resources',exact:true});await expect(all).toBeChecked({indeterminate:true});await all.check();await expect(tree.getByRole('checkbox',{name:'Illustrations',exact:true})).toBeChecked();
 const create=row(page,'creatable-select');await open(create);await create.getByRole('textbox').fill('Motion lab');await create.getByRole('textbox').press('Enter');await expect(create.locator('.mc-trigger')).toContainText('Motion lab');await open(create);await expect(create.getByRole('menuitem',{name:'Motion lab',exact:false})).toHaveCount(1);
});

test('workspace, layout thumbnail, custom color, sorting and inline mention update real previews',async({page})=>{
 await go(page,2);
 const work=row(page,'workspace-switcher');await work.getByRole('menuitem',{name:/Product Team/}).click();await expect(work.locator('.mc-preview strong')).toHaveText('Product Team');
 await open(work);await work.getByRole('menuitem',{name:/Create workspace/}).click();await work.getByRole('textbox').fill('Prototype lab');await work.getByRole('textbox').press('Enter');await expect(work.locator('.mc-preview strong')).toHaveText('Prototype lab');
 const thumb=row(page,'thumbnail-menu');await open(thumb);await thumb.getByRole('option',{name:'Grid',exact:false}).click();await expect(thumb.locator('[data-layout]')).toHaveAttribute('data-layout','grid');
 const color=row(page,'color-picker-menu');await open(color);await color.getByRole('textbox',{name:'Hex color'}).fill('#ef4444');await expect(color.locator('.mc-color-text')).toHaveCSS('color','rgb(239, 68, 68)');
 const sort=row(page,'sort-menu');await open(sort);await sort.getByRole('menuitemradio',{name:'File size',exact:true}).click();await expect(sort.locator('.mc-file-list > div > span')).toHaveText(['Components.md','Interface.fig','Interactions.fig']);await sort.getByRole('menuitemcheckbox',{name:'Descending',exact:true}).click();await expect(sort.locator('.mc-file-list > div > span')).toHaveText(['Interactions.fig','Interface.fig','Components.md']);
 const mention=row(page,'mention-menu');await mention.getByRole('textbox').fill('Before @mi');await mention.getByRole('option',{name:/Mia Wang/}).click();await expect(mention.getByRole('textbox')).toHaveValue('Before @Mia Wang ');await expect(mention.getByRole('textbox')).toBeFocused();
});

test('async cancellation, thousand-row virtualization, dependencies, pins and disabled reasons are functional',async({page})=>{
 await go(page,3);
 const async=row(page,'async-options');await async.getByRole('textbox').fill('design');await async.getByRole('textbox').fill('developer');await expect(async.getByRole('menuitem')).toHaveText(['Developer docs']);
 await async.getByRole('button',{name:'Simulate load failure',exact:true}).click();await expect(async.getByRole('alert')).toBeVisible();await async.getByRole('button',{name:'Retry',exact:true}).click();await expect(async.getByRole('alert')).toHaveCount(0);await expect(async.getByRole('menuitem')).toHaveText(['Developer docs']);
 const virtual=row(page,'virtualized-list');await open(virtual);await expect(virtual.getByRole('option')).toHaveCount(11);await virtual.getByRole('listbox').press('End');await expect(virtual.getByRole('option',{name:'Option 1000',exact:true})).toBeFocused();await page.keyboard.press('Enter');await expect(virtual.locator('.mc-trigger')).toContainText('1000 / 1000');
 const dep=row(page,'dependent-selects');await expect(dep.getByRole('combobox',{name:'Template',exact:true})).toBeDisabled();await dep.getByRole('combobox',{name:'Project type',exact:true}).selectOption('web');await dep.getByRole('combobox',{name:'Template',exact:true}).selectOption('Dashboard');await dep.getByRole('combobox',{name:'Project type',exact:true}).selectOption('mobile');await expect(dep.getByRole('combobox',{name:'Template',exact:true})).toHaveValue('');await expect(dep.getByRole('option',{name:'Dashboard',exact:true})).toHaveCount(0);
 const pins=row(page,'pinned-recent');await open(pins);await pins.getByRole('button',{name:'Pin Brand kit',exact:true}).click();await expect(pins.locator('.mc-panel > .mc-pin-row').filter({hasText:'Brand kit'})).toHaveCount(2);await pins.getByRole('button',{name:'Brand kit',exact:true}).first().click();await expect(pins.locator('.mc-trigger')).toContainText('Brand kit');
 const reason=row(page,'disabled-reasons');await open(reason);await expect(reason.getByRole('menuitem',{name:/Publish/})).toBeDisabled();await reason.getByRole('button',{name:/View missing field/}).click();await expect(reason.getByRole('textbox')).toBeFocused();await reason.getByRole('textbox').fill('Atlas');await reason.getByRole('menuitem',{name:'Publish',exact:false}).click();await expect(reason.locator('.mc-preview')).toContainText('Demo published');
});

test('toggles, zoom, radius units, temporary font preview and transfer synchronize their targets',async({page})=>{
 await go(page,3);
 const toggles=row(page,'instant-toggles');await toggles.getByRole('menuitemcheckbox',{name:'Grid',exact:true}).click();await expect(toggles.locator('.mc-preview')).not.toHaveClass(/mc-grid-bg/);await toggles.getByRole('menuitemcheckbox',{name:'Rulers',exact:true}).click();await expect(toggles.locator('.mc-preview')).toHaveClass(/mc-rulers/);await expect(toggles.getByRole('menu')).toBeVisible();
 const zoom=row(page,'slider-menu');await open(zoom);await zoom.getByRole('slider').press('Home');await expect(zoom.getByRole('slider')).toHaveValue('25');await zoom.getByRole('button',{name:'100%',exact:true}).click();await expect(zoom.locator('output')).toHaveText('100%');
 const unit=row(page,'unit-combobox');await open(unit);await unit.getByRole('menuitem',{name:/rem/}).click();await expect(unit.getByRole('spinbutton')).toHaveValue('1');await unit.getByRole('spinbutton').fill('2');await expect(unit.locator('.mc-size-object')).toHaveCSS('border-top-left-radius','32px');
 const preview=row(page,'live-preview');await open(preview);await preview.getByRole('menuitem',{name:'Serif',exact:true}).hover();await expect(preview.locator('[data-font]')).toHaveAttribute('data-font','serif');await preview.locator('.mc-preview').hover();await expect(preview.locator('[data-font]')).toHaveAttribute('data-font','sans-serif');await preview.getByRole('menuitem',{name:'Monospace',exact:true}).click();await expect(preview.locator('[data-font]')).toHaveAttribute('data-font','monospace');
 const transfer=row(page,'transfer-dropdown');await open(transfer);await transfer.getByRole('checkbox',{name:'Product',exact:true}).check();await transfer.getByRole('button',{name:'Add selected',exact:true}).click();await expect(transfer.locator('.mc-transfer > div').last().getByRole('checkbox',{name:'Product',exact:true})).toBeVisible();await transfer.getByRole('checkbox',{name:'Product',exact:true}).check();await transfer.getByRole('button',{name:'Remove selected',exact:true}).click();await expect(transfer.locator('.mc-transfer > div').first().getByRole('checkbox',{name:'Product',exact:true})).toBeVisible();
});

test('boundary placement, responsive overflow, detachable panel and modal navigation stay usable',async({page})=>{
 await go(page,4);
 const edge=row(page,'edge-aware');await edge.getByRole('button',{name:'Bottom right',exact:true}).click();await expect(edge.locator('[data-placement]')).toHaveAttribute('data-placement','top');await edge.getByRole('button',{name:'Top left',exact:true}).click();await expect(edge.locator('[data-placement]')).toHaveAttribute('data-placement','bottom');
 const bounds=await edge.locator('[data-placement]').boundingBox();const frame=await edge.locator('.mc-edge').boundingBox();expect(bounds.x).toBeGreaterThanOrEqual(frame.x);expect(bounds.x+bounds.width).toBeLessThanOrEqual(frame.x+frame.width+1);
 const overflow=row(page,'responsive-overflow');await overflow.getByRole('slider').press('Home');await open(overflow);const hidden=await overflow.getByRole('menuitem').count();expect(hidden).toBeGreaterThan(0);await overflow.getByRole('menuitem').last().click();await expect(overflow.locator('output')).toHaveText('Share');await overflow.getByRole('slider').press('End');await expect.poll(()=>overflow.locator('.mc-toolbar > button:not(.mc-trigger)').count()).toBe(6);await expect(overflow.locator('.mc-toolbar .mc-trigger')).toHaveCount(0);
 const tear=row(page,'tear-off');await open(tear);await tear.getByRole('button',{name:'Pin floating panel',exact:true}).click();const panel=tear.locator('.mc-floating-tools');const before=await panel.boundingBox();await tear.getByRole('button',{name:'Drag floating panel',exact:true}).press('ArrowRight');const after=await panel.boundingBox();expect(after.x).toBeGreaterThanOrEqual(before.x);await tear.getByRole('menuitem',{name:'Brush',exact:true}).click();await expect(tear.locator('.mc-preview')).toHaveText('Brush');
 for(const id of ['navigation-drawer','fullscreen-menu']) {
  const demo=row(page,id);await demo.locator('.mc-trigger').click();await expect(demo.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(demo.getByRole('dialog')).not.toBeVisible();await expect(demo.locator('.mc-trigger')).toBeFocused();await demo.locator('.mc-trigger').click();await demo.getByRole('dialog').locator('nav button').first().click();await expect(demo.locator('.mc-preview strong')).toHaveText(id==='navigation-drawer'?'Overview':'Work');
 }
});

test('calendar ranges, filter builder, table columns, confirmation and spring-loaded destinations work',async({page})=>{
 await go(page,4);
 const dates=row(page,'date-range');await dates.getByRole('button',{name:'2026-09-05',exact:true}).click();await dates.getByRole('button',{name:'2026-09-09',exact:true}).click();await dates.getByRole('button',{name:'Apply',exact:true}).click();await expect(dates.locator('.mc-trigger')).toContainText('2026-09-05 — 2026-09-09');
 const filters=row(page,'filter-builder');await open(filters);await filters.getByRole('button',{name:'+ Add condition',exact:true}).click();await filters.getByRole('combobox',{name:'Field 2',exact:true}).selectOption('size');await filters.getByRole('textbox',{name:'Filter value 1',exact:true}).fill('Draft');await filters.getByRole('spinbutton',{name:'Filter value 2',exact:true}).fill('100');await filters.getByRole('button',{name:'Apply',exact:true}).click();await expect(filters.locator('.mc-file-list > div > span')).toHaveText(['Brand']);await filters.getByRole('button',{name:'Clear',exact:true}).click();await expect(filters.locator('.mc-file-list > div')).toHaveCount(3);
 const columns=row(page,'column-manager');await open(columns);await columns.getByRole('checkbox',{name:'Status',exact:true}).uncheck();await expect(columns.locator('th')).toHaveText(['Name','Size']);await columns.getByRole('button',{name:'Move up Size',exact:true}).click();await columns.getByRole('button',{name:'Move up Size',exact:true}).click();await expect(columns.locator('th')).toHaveText(['Size','Name']);await columns.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));await columns.locator('.mc-column-row').filter({hasText:'Size'}).dragTo(columns.locator('.mc-column-row').filter({hasText:'Status'}));await expect(columns.locator('th')).toHaveText(['Name','Size']);
 const confirmation=row(page,'inline-confirmation');await open(confirmation);await confirmation.getByRole('menuitem',{name:'Delete file',exact:true}).click();await confirmation.getByRole('button',{name:'Cancel',exact:true}).click();await expect(confirmation.locator('.mc-document')).toBeVisible();await confirmation.getByRole('menuitem',{name:'Delete file',exact:true}).click();await confirmation.getByRole('button',{name:'Confirm delete',exact:true}).click();await expect(confirmation.locator('.mc-document')).toHaveCount(0);await confirmation.getByRole('button',{name:'Restore demo file',exact:true}).click();await expect(confirmation.locator('.mc-document')).toBeVisible();
 const spring=row(page,'spring-loaded');await open(spring);await spring.getByRole('button',{name:'▤ Design.fig',exact:true}).click();await spring.getByRole('button',{name:'Design resources',exact:false}).click();await spring.getByRole('button',{name:'Assets',exact:false}).click();await expect(spring.locator('.mc-preview strong')).toHaveText('Design resources/Assets');await spring.getByRole('button',{name:'Reset',exact:true}).click();await expect(spring.locator('[draggable]')).toBeVisible();
 await spring.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
 const folder=spring.getByRole('button',{name:'Project docs',exact:false});await folder.dispatchEvent('dragover');await expect(folder).toHaveAttribute('aria-expanded','true');await expect(spring.getByRole('button',{name:'Archive',exact:true})).toBeVisible();await spring.locator('[draggable]').dragTo(spring.getByRole('button',{name:'Archive',exact:true}));await expect(spring.locator('.mc-preview strong')).toHaveText('Project docs/Archive');
});

for(const width of [390,1280]) for(const locale of ['zh','en']) {
 test(`${width}px ${locale}: four menu pages fit in light/dark with full motion`,async({page})=>{
  test.setTimeout(60000);await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});
  for(let n=1;n<=4;n++) {
   await go(page,n,locale);
   for(const dark of [false,true]) {
    await page.evaluate(d=>document.documentElement.classList.toggle('dark',d),dark);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    for(const target of await page.locator('.mc-stage').all()) {
     expect(await target.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
    }
    if(dark) await expect(page.locator('.mc-meta h2').first()).toHaveCSS('color','rgb(236, 235, 230)');
   }
  }
  await go(page,3,locale);await expect(row(page,'async-options').locator('.mc-spinner')).toHaveCSS('animation-duration','0.7s');
 });
}

test('centralized menu originals show all eight real sheets and open full-size files',async({page,context})=>{
 await go(page);await page.locator('.mc-originals summary').click();
 const images=page.locator('.mc-original-grid img');await expect(images).toHaveCount(8);
 expect(await images.evaluateAll(async ns=>Promise.all(ns.map(async im=>{im.loading='eager';await im.decode();return [im.naturalWidth,im.naturalHeight]})))).toEqual(Array.from({length:8},()=>[1536,2048]));
 expect(await images.evaluateAll(ns=>ns.map(im=>new URL(im.src).pathname.split('/').at(-1)))).toEqual(['0.webp','1.webp','2.webp','3.webp','5.webp','6.webp','7.webp','8.webp']);
 const popup=context.waitForEvent('page');await page.locator('.mc-original-grid a').first().click();const original=await popup;await original.waitForLoadState();await expect(original).toHaveURL(/\/0.webp$/);await original.close();
});

test('component listing, menu/dropdown concepts and gallery provide direct bilingual catalogue links',async({page})=>{
 for(const locale of ['zh','en']) for(const suffix of ['/components','/components/menu','/components/dropdown','/gallery/menu-dropdown']) {
  await page.goto(`${locale==='en'?'/en':''}${suffix}`);
  const link=page.locator('.mc-entry a').first();await expect(link).toHaveAttribute('href',path(1,locale));
  await page.locator('.mc-entry a').last().click();await expect(page.locator('.mc-originals')).toHaveAttribute('open','');
 }
});

test('touch menus retain select and modal behavior at phone width',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
 await context.route('**/*',r=>{const u=new URL(r.request().url());return u.hostname==='127.0.0.1'||u.hostname==='localhost'?r.continue():r.abort();});
 const page=await context.newPage();try {
  await page.goto('http://127.0.0.1:4337/en/components/menus/2');await expect(page.locator('.mc-catalogue astro-island[ssr]')).toHaveCount(0);
  await row(page,'thumbnail-menu').getByRole('option',{name:'Single',exact:false}).tap();await expect(row(page,'thumbnail-menu').locator('[data-layout]')).toHaveAttribute('data-layout','single');
  await page.goto('http://127.0.0.1:4337/en/components/menus/4');await expect(page.locator('.mc-catalogue astro-island[ssr]')).toHaveCount(0);
  const drawer=row(page,'navigation-drawer');await drawer.locator('.mc-trigger').tap();await expect(drawer.getByRole('dialog')).toBeVisible();await drawer.getByRole('button',{name:'Close',exact:true}).tap();await expect(drawer.getByRole('dialog')).not.toBeVisible();
 }finally{await context.close();}
});

for(const locale of ['zh','en']) test(`${locale}: gallery contains twelve collections and sixty-two working originals`,async({page})=>{
 test.setTimeout(60000);await page.goto(`${locale==='en'?'/en':''}/gallery`);
 const cards=page.locator('main .grid > a');await expect(cards).toHaveCount(12);
 const links=await cards.evaluateAll(ns=>ns.map(n=>n.getAttribute('href')));let count=0;
 for(const link of links) {
  await page.goto(link);
  const images=page.locator('section.pb-10 > .grid > figure img');
  const valid=await images.evaluateAll(async ns=>Promise.all(ns.map(async im=>{im.loading='eager';await im.decode();return im.naturalWidth>0})));
  expect(valid.every(Boolean)).toBe(true);count+=valid.length;
  if(link.endsWith('/menu-dropdown')) expect(await images.evaluateAll(ns=>ns.map(im=>new URL(im.src).pathname.split('/').at(-1)))).toEqual(['0.webp','1.webp','2.webp','3.webp','5.webp','6.webp','7.webp','8.webp']);
 }
 expect(count).toBe(62);
});
