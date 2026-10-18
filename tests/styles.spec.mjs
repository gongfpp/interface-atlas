import { test, expect } from "./helpers/private-browser.mjs";

test("homepage shows '先看风格' above the components row", async ({ page }) => {
  await page.goto("/");
  const styleHeading = page.getByRole("heading", { name: "先看风格" });
  const componentsHeading = page.getByRole("heading", { name: /六个组件/ });
  await expect(styleHeading).toBeVisible();
  await expect(componentsHeading).toBeVisible();
  const styleBox = await styleHeading.boundingBox();
  const compBox = await componentsHeading.boundingBox();
  expect(styleBox && compBox && styleBox.y).toBeLessThan(compBox.y);
});

for (const slug of ["editorial", "organic", "art-deco"]) {
  test(`style page ${slug}: one full-page interactive preview owns the scene`, async ({
    page,
  }) => {
    await page.goto(`/styles/${slug}`);
    const section = page.locator("#playground");
    await section.scrollIntoViewIfNeeded();
    const preview = section.locator("[data-style-preview]");
    const interactive = section.locator("[data-style-interactive]");
    await expect(preview).toHaveCount(1);
    await expect(interactive).toHaveCount(1);
    await expect(section.locator('[data-style-preview][data-style-interactive]')).toHaveCount(1);
    await expect(interactive.locator('[data-style-experience]')).toBeVisible();
    await expect(interactive.locator('[data-style-frame]')).toHaveAttribute('src', `/style-scenes/${slug}/`);
    await expect(page.frameLocator('[data-style-frame]').locator(`[data-style-scene="${slug}"][data-scene-interactive="true"]`)).toBeVisible();
    // 不再上下叠放“封面 + 无关组件demo”；iframe本身就是唯一完整页面。
    await expect(section.locator('.demo-content')).toHaveCount(0);
  });
}
