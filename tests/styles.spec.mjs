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
  test(`style page ${slug}: the whole document owns its design`, async ({page}) => {
    await page.goto(`/styles/${slug}`);
    await expect(page.locator('body')).toHaveAttribute('data-atlas-style',slug);
    await expect(page.locator('[data-atlas-root]')).toBeVisible();
    await expect(page.locator('iframe')).toHaveCount(0);
    await expect(page.locator('.atlas-home')).toHaveAttribute('href','/');
    await expect(page.locator('.atlas-title h1')).toBeVisible();
  });
}
