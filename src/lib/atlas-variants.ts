const scenePalettes: Record<string, string[]> = {
  atompunk: ['#e8ddc3','#38685c','#d16d39','#f7ebcd'],
  cassette: ['#c7bda9','#142b1d','#bce39a','#e2a554'],
  synth: ['#21102f','#b84abf','#ffb15d','#ed598f'],
  'eight-bit': ['#09261c','#ffe1a1','#79c88c','#387149'],
  'modern-pixel': ['#131e31','#91d9f0','#c2a0e8','#f0add5'],
  isometric: ['#221b33','#dfb5fa','#9879b5','#f2d1a4'],
};

type Material = Partial<Record<'surface' | 'field' | 'primary' | 'ink' | 'primary-ink' | 'border' | 'radius' | 'shadow' | 'inset' | 'font' | 'dialog', string>> & { layout?: string };
/** Variant materials affect real controls, including the isolated detail specimen. */
const materials: Record<string, Record<string, Material>> = {
  minimalism: {
    'mono-minimal': { surface: '#fff', field: '#fff', ink: '#111', border: '1px solid #aaa' },
    'flat-minimal': { surface: '#eef3ed', field: '#fff', primary: '#d5e3d0', ink: '#263526', border: '1px solid #c2ccbf', layout: 'columns' },
    'warm-minimal': { surface: '#f6eedf', field: '#fff9ef', ink: '#604934', border: '1px solid #bfa88c', radius: '6px' },
  },
  'swiss-style': {
    zurich: { layout: 'columns' },
    basel: { primary: '#174b99', radius: '0', border: '2px solid #174b99', layout: 'poster' },
    'new-swiss': { primary: '#111', radius: '0', border: '1px solid #111', font: 'Arial,sans-serif', layout: 'columns' },
  },
  editorial: {
    broadsheet: { surface: '#f7f2e9', field: '#fffdf5', border: '1px solid #9e8f7e', layout: 'columns' },
    glossymag: { surface: '#f8e8e9', field: '#fff8fa', primary: '#78243e', border: '1px solid #b3798c', shadow: '0 4px 12px #78243e22', layout: 'poster' },
    'digital-first': { surface: '#fff', field: '#f3f4f6', border: '1px solid #c4c9d0', radius: '5px', font: 'Arial,sans-serif', layout: 'stack' },
  },
  glassmorphism: {
    frost: { surface: '#e8f1f8c7', field: '#f1f8ffb8', border: '1px solid #ffffffb3' },
    clear: { surface: '#ffffff42', field: '#ffffff5c', border: '1px solid #fff', shadow: 'inset 0 1px 1px #fff,0 4px 18px #29486222' },
    tinted: { surface: '#a7bad7a1', field: '#e5e7ff8c', primary: '#535782', border: '1px solid #e0e2ff', shadow: 'inset 0 2px 1px #eef1ff,0 5px 20px #454a7133' },
  },
  'bento-grid': {
    keynote: { radius: '20px', layout: 'poster' },
    dashboard: { radius: '10px', surface: '#eaf0e0', field: '#fff', layout: 'tiles' },
    profile: { radius: '28px', surface: '#f5ead8', field: '#fff8ee', layout: 'columns' },
  },
  neumorphism: {
    raised: { shadow: '5px 5px 10px #b1c4d2,-5px -5px 10px #f4fbff' },
    inset: { shadow: 'inset 4px 4px 8px #b1c4d2,inset -4px -4px 8px #f4fbff', radius: '12px' },
  },
  skeuomorphism: {
    leather: { surface: '#845d39', field: '#4b3421', ink: '#fff2d9', border: '3px ridge #c4a061', shadow: '0 3px 0 #49301e', layout: 'window' },
    metal: { surface: 'repeating-linear-gradient(0deg,#d0d5d8 0 2px,#e1e5e8 2px 3px)', field: '#e4eaee', primary: 'linear-gradient(#f6f8f9,#99a6af)', ink: '#26333a', 'primary-ink': '#26333a', border: '3px ridge #b8c4ca', radius: '5px', layout: 'window' },
    paper: { surface: '#f4e8d2', field: 'repeating-linear-gradient(#fffaed 0 27px,#c5b9a5 27px 28px)', primary: '#74583b', 'primary-ink': '#fff', border: '1px solid #b1a085', radius: '0', shadow: '3px 4px 0 #9b8a6c44' },
  },
  brutalism: {
    classic: { layout: 'stack' },
    'soft-brutalism': { surface: '#f0ebe1', field: '#fffaf2', border: '2px solid #111', radius: '8px', font: 'Georgia,serif' },
    typographic: { border: '1px solid #111', layout: 'poster', font: 'monospace' },
  },
  neobrutalism: {
    classic: { layout: 'columns' },
    candy: { surface: '#efd4ff', field: '#fff2f8', primary: '#ffbada', radius: '8px', shadow: '5px 5px #111', layout: 'tiles' },
    grunge: { surface: 'repeating-linear-gradient(45deg,#e4dfb5 0 3px,#d1ca9f 3px 4px)', field: '#f5efce', primary: '#c8dc64', radius: '0', shadow: '6px 6px #111' },
  },
  'retro-web': {
    'personal-homepage': { surface: '#fff5cd', field: '#fff', border: '3px outset #fff3b0', layout: 'poster' },
    'desktop-browser': { surface: '#d7d6ce', field: '#fff', border: '3px outset #eee', layout: 'window' },
  },
  'flat-design': {
    metro: { radius: '0', border: '0 solid transparent', primary: '#075ce5', layout: 'tiles' },
    'flat-ui': { surface: '#e1f2ee', field: '#fff', primary: '#167a67', border: '2px solid #167a67', radius: '4px', layout: 'columns' },
    flat2: { surface: '#f5f8ff', field: '#fff', radius: '10px', shadow: '0 3px 8px #075ce522', layout: 'stack' },
  },
  bauhaus: {
    weimar: { surface: '#f1d59b', field: '#faf0d9', primary: '#ad3d28', radius: '0', layout: 'poster' },
    dessau: { surface: '#fff', field: '#fff', primary: '#1955cc', layout: 'tiles' },
    contemporary: { surface: '#f9f4e9', field: '#fff', primary: '#d92517', border: '1px solid #111', radius: '12px', layout: 'columns' },
  },
  y2k: {
    candy: { surface: 'linear-gradient(#ffe6f5,#ef9bd0)', field: '#fff0fa', primary: 'linear-gradient(#ffdbf1,#e777b7)', ink: '#592e57', 'primary-ink': '#592e57', border: '2px solid #fff0ff', radius: '40px' },
    chrome: { surface: 'linear-gradient(#fff,#9aaac8 48%,#f7f9ff 52%,#879cbe)', field: '#eef3ff', border: '2px solid #c0d3f5', radius: '40px', layout: 'window' },
    iridescent: { surface: 'linear-gradient(120deg,#caf1f2,#ddd3fc,#ffe5ed)', field: '#f5f2ff', border: '2px solid #fff', radius: '28px', layout: 'poster' },
  },
  cyberpunk: {
    'neon-city': { primary: '#e8ff00', 'primary-ink': '#101707', border: '1px solid #e8ff00', layout: 'poster' },
    terminal: { surface: '#07140c', field: '#020c05', primary: '#a2efb2', ink: '#a2efb2', 'primary-ink': '#07140c', border: '1px solid #56976a', radius: '0', shadow: 'none', layout: 'terminal' },
    glitch: { surface: '#171029', field: '#130c22', primary: '#ef82e8', ink: '#f9d7fa', 'primary-ink': '#231129', border: '1px solid #54e8f1', shadow: '3px 0 #e65ee0,-2px 0 #54e8f1', radius: '0' },
  },
  memphis: {
    classic: { layout: 'poster' },
    terrazzo: { surface: 'radial-gradient(ellipse at 25% 25%,#ffd354 0 3px,transparent 4px),#f6e2dc', field: '#fffaf0', primary: '#1f778a', border: '2px solid #222', radius: '16px 3px 8px 2px' },
    'neo-memphis': { surface: '#e5edff', field: '#fff', primary: '#2546ff', radius: '10px', shadow: '3px 3px #2546ff', layout: 'columns' },
  },
  'retro-futurism': {
    atompunk: { surface: 'linear-gradient(#e5dcc2,#b9bea6)', field: '#f5ecd6', primary: '#3d6e61', ink: '#263b34', 'primary-ink': '#fff6da', border: '2px solid #7d927f', radius: '24px', layout: 'columns' },
    cassette: { surface: '#3e4243', field: '#181e1f', primary: '#efa14b', ink: '#f9e6c5', 'primary-ink': '#252724', border: '3px ridge #929486', radius: '3px', layout: 'window' },
    synth: { surface: '#281231', field: '#160b24', primary: 'linear-gradient(#ffd77b,#f88532)', ink: '#ffdeeb', 'primary-ink': '#2b1229', border: '1px solid #b563a9', layout: 'poster' },
  },
  claymorphism: {
    'soft-clay': { surface: '#ffe1ac', field: '#fff0e3' },
    'candy-clay': { surface: '#efc4f2', field: '#fff1fd', primary: '#b8e7de', 'primary-ink': '#3b5e55', shadow: 'inset 3px 3px 6px #fff0ff,inset -4px -5px 7px #c286cc,0 5px 6px #b66b7b33', layout: 'tiles' },
    'clay-dark': { surface: '#563c60', field: '#33243d', primary: '#deb4e8', ink: '#fff0ff', 'primary-ink': '#432e4a', border: '2px solid #84678e', shadow: 'inset 3px 3px 6px #886996,inset -4px -5px 7px #32203c,0 5px 6px #21152644', inset: 'inset 3px 4px 6px #1e152a,inset -3px -3px 6px #73557e' },
  },
  aurora: {
    'static-mesh': { surface: 'linear-gradient(120deg,#164450,#292b60)', field: '#092a3e' },
    'flowing-blobs': { surface: 'radial-gradient(at 10% 10%,#286854,#19355d)', field: '#123240', radius: '30px', layout: 'poster' },
    'dark-aurora': { surface: '#061b2c', field: '#03131e', border: '1px solid #258d81', shadow: '0 0 18px #00e3a422' },
  },
  organic: {
    earth: { surface: '#f3e4cd', field: '#fff4e3', primary: '#82603a', 'primary-ink': '#fff9e9' },
    botanical: { surface: '#e5eacf', field: '#f7fae9', primary: '#4e6c3a', radius: '25px 8px 22px 12px', layout: 'columns' },
  },
  'art-deco': {
    midnight: { surface: '#171820', field: '#0e1017', ink: '#e9d8a5', border: '3px double #c5a260', layout: 'poster' },
    emerald: { surface: '#193d31', field: '#0b231b', ink: '#eddfb8', border: '3px double #c5a260', layout: 'columns' },
  },
  'corporate-memphis': {
    people: { layout: 'columns' },
    abstract: { surface: '#e7efff', field: '#fff', primary: '#245cc7', radius: '4px', layout: 'tiles' },
    'gradient-flat': { surface: 'linear-gradient(120deg,#f2eaff,#e0f2ff)', field: '#fff', primary: '#6953b8', radius: '18px', layout: 'poster' },
  },
  'hand-drawn': {
    marker: { border: '3px solid #3458a4' },
    notebook: { surface: 'repeating-linear-gradient(#fffbea 0 27px,#91aaca55 27px 28px)', field: '#fffef4', border: '1px solid #3458a4', radius: '2px', layout: 'columns' },
    sticker: { surface: '#ffeaa0', field: '#fffde9', border: '3px solid #fff', shadow: '3px 4px #3458a466', radius: '12px 3px 15px 5px', layout: 'tiles' },
  },
  'liquid-glass': {
    sheet: { radius: '18px', layout: 'columns' },
    capsule: { radius: '40px', shadow: 'inset 0 3px 5px white,inset 0 -3px 5px #8fc9df66,0 3px 8px #8ca8c144' },
    'full-panel': { radius: '8px', surface: '#e4f3fbaa', border: '2px solid #fff', layout: 'poster' },
  },
  'pixel-art': {
    'eight-bit': { layout: 'window' },
    'modern-pixel': { surface: '#27364b', field: '#131e31', primary: '#91d9f0', ink: '#e1f4ff', 'primary-ink': '#172a40', border: '3px outset #6c8daf', radius: '0', shadow: '4px 4px #0c1728' },
    isometric: { surface: '#4b3c60', field: '#221b33', primary: '#dfb5fa', ink: '#f6e8ff', 'primary-ink': '#332244', border: '3px outset #9d81b8', radius: '0', shadow: '5px 5px #21142e', layout: 'tiles' },
  },
  vaporwave: {
    'mall-soft': { layout: 'columns' },
    'neon-glitch': { surface: '#42234b', field: '#271933', primary: '#92edf0', ink: '#ffe1fc', 'primary-ink': '#332244', border: '3px outset #df87d5', shadow: '3px 0 #f35aca,-2px 0 #92edf0', layout: 'window' },
    chrome: { surface: 'linear-gradient(120deg,#fff,#bfcaef,#f5d8ee,#cff5ee)', field: '#f5efff', primary: 'linear-gradient(#fff,#bfc9ed)', ink: '#57326e', 'primary-ink': '#57326e', border: '3px outset #fff', layout: 'poster' },
  },
};

export function atlasVariantMaterial(slug: string, id: string): Material {
  return materials[slug]?.[id] ?? {};
}

const keys = ['surface', 'field', 'primary', 'ink', 'primary-ink', 'border', 'radius', 'shadow', 'inset', 'font', 'dialog'] as const;
export function captureAtlasMaterial(root: HTMLElement) {
  const css = getComputedStyle(root);
  return Object.fromEntries(keys.map(key => {
    const value = css.getPropertyValue(`--ui-${key}`).trim();
    return [key, key === 'font' && (!value || value === 'inherit') ? css.fontFamily : value || (key === 'ink' ? css.getPropertyValue('--ai').trim() : 'inherit')];
  })) as Record<typeof keys[number], string>;
}

export function applyAtlasMaterial(target: HTMLElement, base: ReturnType<typeof captureAtlasMaterial>, slug: string, id: string) {
  const material = atlasVariantMaterial(slug, id);
  for (const key of keys) target.style.setProperty(`--ui-${key}`, material[key] ?? base[key]);
  // A dark material must also carry its surface into the modal and feedback panels.
  target.style.setProperty('--ui-dialog', material.dialog ?? material.surface ?? base.dialog);
  target.dataset.variantId = id;
  target.dataset.previewLayout = material.layout ?? 'stack';
  if (target.hasAttribute('data-atlas-root') && ['retro-futurism','pixel-art'].includes(slug)) {
    const palette = scenePalettes[id];
    target.querySelectorAll<HTMLElement>('.approved-palette > div').forEach((swatch, i) => {
      swatch.querySelector<HTMLElement>('span')!.style.setProperty('--swatch', palette[i % palette.length]);
      swatch.querySelector('code')!.textContent = palette[i % palette.length].toUpperCase();
    });
  }
  for (const art of target.querySelectorAll<HTMLElement>('[data-variant-art]')) {
    // 页面变体与弹窗里的未应用预览各自拥有状态。
    if (target.hasAttribute('data-atlas-root') && art.closest('[data-example-preview]')) continue;
    art.toggleAttribute('hidden', art.dataset.variantArt !== id);
  }
}
