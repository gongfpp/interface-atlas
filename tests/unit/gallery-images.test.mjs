import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import process from 'node:process';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { load as yamlLoad } from 'js-yaml';
import { validateGalleryImages } from '../../scripts/validate-gallery-images.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const publicDir = join(root, 'public');
const originalPath = join(root, 'fixtures/gallery-menu-dropdown-original.yaml');
const currentPath = join(root, 'src/content/gallery/menu-dropdown.yaml');
const readYaml = (path) => yamlLoad(readFileSync(path, 'utf8'));
const imageData = (file) => ({ images: [{ file }] });

test('原版 fixture 保留错位与缺图事实，新校验能够检出缺少的 4.webp', () => {
  // 来自 5260b447 的原始 YAML，保留原文，不为测试生成另一个相似案例。
  const bytes = readFileSync(originalPath);
  const sha = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  assert.equal(sha, 'eb6b2213f473ab2b3039119969afec47ffcc8f78');
  const errors = validateGalleryImages(readYaml(originalPath), publicDir);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /images\[3\]\.file.*\/menu-dropdown\/4\.webp.*ENOENT/);
});

test('修复后的八张图片与原海报编号及双语标题一致，只改前四个文件路径', () => {
  const original = readYaml(originalPath);
  const current = readYaml(currentPath);
  const numbers = [0, 1, 2, 3, 5, 6, 7, 8];
  assert.equal(current.images.length, 8);
  assert.deepEqual(current.images.map((image) => image.file), numbers.map((n) => `/images/gallery/menu-dropdown/${n}.webp`));
  current.images.forEach((image, index) => {
    assert.equal(image.title.zh, `结构案例 ${numbers[index]}`);
    assert.equal(image.title.en, `Sheet ${numbers[index]}`);
  });
  const expected = globalThis.structuredClone(original);
  expected.images.slice(0, 4).forEach((image, index) => { image.file = `/images/gallery/menu-dropdown/${index}.webp`; });
  assert.deepEqual(current, expected);
  assert.deepEqual(validateGalleryImages(current, publicDir), []);
});

test('现有全部图集都引用实际文件，保留正常资产格式', () => {
  for (const file of readdirSync(join(root, 'src/content/gallery')).filter((file) => file.endsWith('.yaml'))) {
    assert.deepEqual(validateGalleryImages(readYaml(join(root, 'src/content/gallery', file)), publicDir), [], file);
  }
});

test('真实文件后追加目录语义仍然失败，不能被路径归一化抹掉', () => {
  const file = '/images/gallery/menu-dropdown/0.webp';
  assert.deepEqual(validateGalleryImages(imageData(file), publicDir), []);
  for (const suffix of ['/', '/.', '/%2e', '%2f', '%2f%2e']) {
    assert.equal(validateGalleryImages(imageData(`${file}${suffix}`), publicDir).length, 1, suffix);
  }
});

test('支持站内路径、URL 编码、查询和片段，不按图片后缀误杀文件', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'atlas-gallery-paths-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  for (const file of ['sample.webp', 'sample.png', 'sample.jpg', 'sample.svg', '参考 图.avif']) {
    writeFileSync(join(dir, file), '测试文件');
    assert.deepEqual(validateGalleryImages(imageData(`/${file}`), dir), []);
    assert.deepEqual(validateGalleryImages(imageData(`${encodeURIComponent(file)}?v=1#preview`), dir), []);
  }
});

test('拒绝目录、缺失文件、空配置、外链、无效编码与越界路径', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'atlas-gallery-invalid-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const assets = join(dir, 'public');
  mkdirSync(assets);
  mkdirSync(join(assets, 'directory'));
  writeFileSync(join(dir, 'outside.webp'), '不能被当作公开资产');
  symlinkSync(join(dir, 'outside.webp'), join(assets, 'outside-link.webp'));
  for (const file of [null, 12, '', ' ', '/missing.webp', '/directory', '/', 'https://example.com/a.webp', 'http://example.com/a.webp', '//example.com/a.webp', 'data:image/png;base64,AA==', 'file:///outside.webp', '/%ZZ.webp', '/../outside.webp', '/%2e%2e/outside.webp', '/images/../../outside.webp', '..\\outside.webp', '/%00.webp', '/outside-link.webp']) {
    assert.equal(validateGalleryImages(imageData(file), assets).length, 1, String(file));
  }
  for (const data of [null, {}, { images: [] }, { images: 'invalid' }, { images: [null] }]) {
    assert.equal(validateGalleryImages(data, assets).length, 1);
  }
});

test('content:check 真实命令入口：原版失败，修复版通过', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'atlas-gallery-cli-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  mkdirSync(join(dir, 'scripts'));
  mkdirSync(join(dir, 'src/content/gallery'), { recursive: true });
  for (const file of ['validate-content.mjs', 'validate-gallery-images.mjs']) {
    copyFileSync(join(root, 'scripts', file), join(dir, 'scripts', file));
  }
  symlinkSync(join(root, 'node_modules'), join(dir, 'node_modules'), 'dir');
  symlinkSync(publicDir, join(dir, 'public'), 'dir');
  const run = () => spawnSync(process.execPath, [join(dir, 'scripts/validate-content.mjs')], { cwd: dir, encoding: 'utf8' });
  const galleryPath = join(dir, 'src/content/gallery/menu-dropdown.yaml');
  copyFileSync(originalPath, galleryPath);
  const before = run();
  assert.equal(before.status, 1, before.stderr);
  assert.match(before.stderr, /gallery\/menu-dropdown\.yaml: images\[3\]\.file.*\/4\.webp/);
  copyFileSync(currentPath, galleryPath);
  const after = run();
  assert.equal(after.status, 0, after.stderr);
  assert.match(after.stdout, /内容校验通过/);
});
