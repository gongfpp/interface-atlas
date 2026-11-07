export async function chooseAtlasVariant(page, index) {
  const trigger = page.locator('[data-variant-trigger]');
  if (await trigger.getAttribute('aria-expanded') !== 'true') await trigger.click();
  await page.locator(`[data-variant-option="${index}"]`).click();
}
