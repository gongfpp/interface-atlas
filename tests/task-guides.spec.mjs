import { test, expect } from './helpers/private-browser.mjs';

test('curated task paths link home, named concepts and localized guides', async ({ page }) => {
  await page.goto('/');
  const paths = page.locator('.home-tasks');
  await expect(paths.getByRole('link')).toHaveCount(3);
  await paths.getByRole('link', { name: /我要让表单更容易填写/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('我要让表单更容易填写');
  await expect(page.locator('.task-pick')).toHaveCount(5);
  await page.goto('/en/tasks/identify');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Name what you see in a screenshot');
  await expect(page.locator('.task-anatomy-preview a')).toHaveCount(4);
  for (const link of await page.locator('.task-pick').evaluateAll(links => links.map(link => link.href))) {
    expect(new URL(link).origin).toBe('http://127.0.0.1:4337');
    expect((await page.request.get(link, { maxRedirects: 0 })).status()).toBe(200);
  }
});

test('upload flow fails once, preserves selection, retries and removes the completed file', async ({ page }) => {
  await page.goto('/tasks/forms');
  const upload = page.getByTestId('upload-flow');
  await upload.getByRole('button', { name: '使用示例文件' }).click();
  await upload.getByRole('button', { name: '开始上传' }).click();
  await expect(upload.getByRole('progressbar')).toBeVisible();
  await expect(upload.getByRole('status')).toContainText('模拟连接失败');
  await expect(upload.locator('.task-file-name')).toHaveText('portfolio.pdf');
  await upload.getByRole('button', { name: '重试上传' }).click();
  await expect(upload.getByRole('status')).toContainText('演示上传完成');
  await upload.getByRole('button', { name: '删除文件' }).click();
  await expect(upload.getByRole('status')).toHaveText('等待选择文件');
  await expect(upload.locator('.task-file-name')).toHaveCount(0);
});

test('upload cancellation restores the selected file without a stale completion', async ({ page }) => {
  await page.goto('/en/tasks/forms');
  const upload = page.getByTestId('upload-flow');
  await upload.getByRole('button', { name: 'Use sample file' }).click();
  await upload.getByRole('button', { name: 'Start upload' }).click();
  await upload.getByRole('button', { name: 'Cancel upload' }).click();
  await expect(upload.getByRole('status')).toHaveText('File selected, ready to start');
  await expect(upload.getByRole('progressbar')).toHaveCount(0);
  await expect(upload.getByRole('button', { name: 'Start upload' })).toBeEnabled();
});

test('profile validates, restores focus, preserves failed edits and confirms unsaved departure', async ({ page }) => {
  await page.goto('/tasks/forms');
  const profile = page.getByTestId('profile-flow');
  const email = profile.getByRole('textbox', { name: '邮箱' });
  await email.fill('invalid');
  await profile.getByRole('button', { name: '保存资料' }).click();
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(email).toBeFocused();
  await email.fill('new@example.com');
  await profile.getByRole('button', { name: '保存资料' }).click();
  await expect(profile.getByRole('button', { name: '保存中…' })).toBeDisabled();
  await expect(profile.getByRole('status')).toContainText('模拟保存失败');
  await expect(email).toHaveValue('new@example.com');
  await profile.getByRole('button', { name: '重试保存' }).click();
  await expect(profile.getByRole('status')).toHaveText('已在本页演示中保存。');
  await email.fill('unsaved@example.com');
  await profile.getByRole('button', { name: '离开编辑' }).click();
  const dialog = profile.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: '继续编辑' }).click();
  await expect(profile.getByRole('button', { name: '离开编辑' })).toBeFocused();
  await expect(email).toHaveValue('unsaved@example.com');
  await profile.getByRole('button', { name: '离开编辑' }).click();
  await dialog.getByRole('button', { name: '放弃修改并离开' }).click();
  await expect(profile.getByRole('status')).toContainText('未保存的修改已放弃');
  await expect(profile.getByRole('button', { name: '重新编辑' })).toBeFocused();
  await profile.getByRole('button', { name: '重新编辑' }).click();
  await expect(email).toHaveValue('new@example.com');
});

test('task paths stay within a mobile viewport and examples explain the selected factor', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const route of ['/tasks/dashboard', '/tasks/forms', '/en/tasks/identify']) {
    await page.goto(route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.goto('/tasks/forms');
  await page.getByRole('button', { name: '分组间距' }).click();
  await expect(page.getByRole('button', { name: '分组间距' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.task-example-reason')).toContainText('字段与帮助文字之间');
  await expect(page.locator('.task-spacing-good')).toBeVisible();
});

test('workflow controls wait for hydration before accepting input', async ({ page }) => {
  let releaseScripts;
  const scriptsReady = new Promise(resolve => { releaseScripts = resolve; });
  await page.route('**/*.js', async route => {
    await scriptsReady;
    await route.fallback();
  });
  try {
    await page.goto('/tasks/forms', { waitUntil: 'commit' });
    const upload = page.getByTestId('upload-flow');
    const profile = page.getByTestId('profile-flow');
    await expect(profile.getByRole('textbox', { name: '邮箱' })).toBeDisabled();
    await expect(profile.getByRole('button', { name: '离开编辑' })).toBeDisabled();
    await expect(upload.locator('input[type="file"]')).toBeDisabled();
    await expect(upload.getByRole('button', { name: '使用示例文件' })).toBeDisabled();
    await expect(upload.getByRole('checkbox')).toBeDisabled();
    releaseScripts();
    const email = profile.getByRole('textbox', { name: '邮箱' });
    await expect(email).toBeEnabled();
    await email.fill('invalid');
    await profile.getByRole('button', { name: '保存资料' }).click();
    await expect(email).toHaveValue('invalid');
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await upload.getByRole('button', { name: '使用示例文件' }).click();
    await expect(upload.locator('.task-file-name')).toHaveText('portfolio.pdf');
  } finally {
    releaseScripts();
  }
});
