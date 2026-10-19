import { chromium, firefox, webkit } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join, basename } from 'node:path';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { FOCUS_STYLES, STYLE_SLUGS, openStyleStatePage, runStyleStatePath, computedState } from '../tests/helpers/style-state-paths.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(argument => { const [key, ...value] = argument.replace(/^--/, '').split('='); return [key, value.join('=') || 'true']; }));
const baseURL = args['base-url'] || 'http://127.0.0.1:4322';
const origin = new URL(baseURL).origin;
if (new URL(baseURL).hostname !== '127.0.0.1' || new URL(baseURL).protocol !== 'http:') throw new Error('Capture requires a loopback HTTP server.');
const output = resolve(args.out || '/tmp/atlas-style-states-before-2bae6cd');
if (!output.startsWith('/tmp/') && !output.startsWith('/private/tmp/')) throw new Error('Capture output must stay under /tmp.');
const repository = resolve(args.repo || process.cwd());
const slugs = args.slugs === 'all' ? STYLE_SLUGS : args.slugs ? args.slugs.split(',') : FOCUS_STYLES;
if (slugs.some(slug => !STYLE_SLUGS.includes(slug))) throw new Error('Unknown style slug.');
const widths = (args.widths || '1280').split(',').map(Number);
if (widths.some(width => ![1280,390,320].includes(width))) throw new Error('Supported viewport widths: 1280,390,320.');
const locales = (args.locales || 'zh').split(',');
if (locales.some(locale => !['zh','en'].includes(locale))) throw new Error('Supported locales: zh,en.');
const engineName = args.engine || 'chromium';
const engine = { chromium, firefox, webkit }[engineName];
if (!engine) throw new Error('Unknown browser engine.');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const provenance = () => ({
  commit: execFileSync('git', ['-C', repository, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  dirtyPaths: execFileSync('git', ['-C', repository, 'status', '--short'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean),
  trackedSourceDiffHash: hash(execFileSync('git', ['-C', repository, 'diff', 'HEAD', '--', 'src'])),
  untrackedSources: execFileSync('git', ['-C', repository, 'ls-files', '--others', '--exclude-standard', '--', 'src'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean).map(path => ({ path, hash: hash(readFileSync(join(repository, path))) })),
  runnerHashes: [new URL(import.meta.url), new URL('../tests/helpers/style-state-paths.mjs', import.meta.url)].map(url => ({ file: url.pathname.split('/').at(-1), hash: hash(readFileSync(url)) })),
});
await mkdir(output, { recursive: true });
const initialSource = provenance();
const manifest = { versionLabel: args.version || initialSource.commit, server: baseURL, repositoryLabel: basename(repository), engine: engineName, started: new Date().toISOString(), source: initialSource, screenshotScale: 'css', visualReview: 'pending; screenshot existence is not a visual pass', cases: [] };
const browser = await engine.launch({ headless: args.headful !== 'true' });
try {
  for (const slug of slugs) for (const width of widths) for (const locale of locales) {
    const id = `${slug}-${locale}-${width}`;
    const context = await browser.newContext({ baseURL, viewport: { width, height: 900 }, deviceScaleFactor: 1, serviceWorkers: 'block', reducedMotion: 'reduce' });
    await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort('blockedbyclient'));
    const page = await context.newPage();
    const entry = { id, slug, locale, viewport: { width, height: 900 }, steps: [], errors: [] };
    page.on('pageerror', error => entry.errors.push(error.message));
    page.on('response', response => { if (new URL(response.url()).origin === origin && response.status() >= 400) entry.errors.push(`${response.status()} ${response.url()}`); });
    manifest.cases.push(entry);
    try {
      const root = await openStyleStatePage(page, slug, locale, args.mode || 'default');
      entry.route = page.url();
      entry.summary = await runStyleStatePath(page, slug, locale, async (state, metadata) => {
        await root.evaluate(() => document.fonts.ready);
        const prefix = `${id}-${String(entry.steps.length + 1).padStart(2,'0')}-${state}`;
        const screenshot = join(output, `${prefix}.png`);
        const json = join(output, `${prefix}.json`);
        const computed = await computedState(root, metadata.targets || []);
        await page.screenshot({ path: screenshot, animations: 'disabled', scale: 'css' });
        await writeFile(json, JSON.stringify({ ...metadata, state, provenance: manifest.source, server: baseURL, computed, screenshot: basename(screenshot), visualReview: 'pending' }, null, 2));
        entry.steps.push({ state, ...metadata, screenshot: basename(screenshot), computed: basename(json) });
      });
      entry.status = entry.errors.length ? 'page-errors' : 'captured-not-visually-approved';
    } catch (error) {
      entry.status = 'capture-failed'; entry.errors.push(error.stack || error.message);
      const path = join(output, `${id}-failed.png`);
      await page.screenshot({ path, animations: 'disabled', scale: 'css' }).catch(() => {});
      entry.failureScreenshot = basename(path);
    } finally {
      await context.close();
      await writeFile(join(output, 'manifest.json'), JSON.stringify(manifest, null, 2));
      console.log(JSON.stringify({ id, status: entry.status, captures: entry.steps.length, errors: entry.errors }));
    }
  }
} finally {
  await browser.close();
  manifest.finished = new Date().toISOString();
  manifest.finalSource = provenance();
  manifest.sourceChangedDuringCapture = JSON.stringify(manifest.source) !== JSON.stringify(manifest.finalSource);
  await writeFile(join(output, 'manifest.json'), JSON.stringify(manifest, null, 2));
}
console.log(JSON.stringify({ output, cases: manifest.cases.length, failures: manifest.cases.filter(entry => entry.status !== 'captured-not-visually-approved').length, sourceChangedDuringCapture: manifest.sourceChangedDuringCapture }));
if (manifest.cases.some(entry => entry.status !== 'captured-not-visually-approved')) process.exitCode = 1;
