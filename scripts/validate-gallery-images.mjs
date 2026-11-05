import { realpathSync, statSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';

function isInside(root, target) {
  const path = relative(root, target);
  return path !== '..' && !path.startsWith(`..${sep}`) && !isAbsolute(path);
}

/**
 * 图库的 withBase() 将文件路径作为站内路径渲染；外链和 data URL 不受支持。
 * 按浏览器路径去掉查询/片段并解码，校验 public 内的真实文件，不发起网络请求。
 */
export function validateGalleryImages(data, publicDir) {
  if (!Array.isArray(data?.images) || data.images.length === 0) {
    return ['images 必须是非空数组'];
  }
  const errors = [];
  data.images.forEach((image, index) => {
    const file = image?.file;
    const fail = (message) => errors.push(`images[${index}].file ${message}`);
    if (typeof file !== 'string' || !file.trim()) {
      fail('必须是非空站内文件路径');
      return;
    }
    if (/^[a-z][a-z\d+.-]*:/i.test(file) || file.startsWith('//')) {
      fail(`不支持外链或 URL 协议「${file}」`);
      return;
    }
    let pathname;
    try {
      pathname = decodeURIComponent(file.split(/[?#]/, 1)[0]);
    } catch {
      fail(`URL 编码无效「${file}」`);
      return;
    }
    const hasControl = [...pathname].some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127);
    const hasDirectorySuffix = pathname.endsWith('/') || pathname.endsWith('/.');
    if (!pathname || hasDirectorySuffix || pathname.includes('\\') || hasControl || pathname.split('/').includes('..')) {
      fail(`站内路径无效「${file}」`);
      return;
    }
    const target = resolve(publicDir, pathname.replace(/^\/+/, ''));
    if (!isInside(resolve(publicDir), target)) {
      fail(`路径超出 public「${file}」`);
      return;
    }
    try {
      if (!isInside(realpathSync(publicDir), realpathSync(target))) {
        fail(`路径超出 public「${file}」`);
      } else if (!statSync(target).isFile()) {
        fail(`不是文件「${file}」`);
      }
    } catch (error) {
      fail(`文件不存在或无法读取「${file}」（${error.code}）`);
    }
  });
  return errors;
}
