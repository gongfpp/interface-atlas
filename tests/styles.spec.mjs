import { test, expect } from "@playwright/test";

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

for (const slug of ["organic", "art-deco"]) {
  test(`style page ${slug}: one section switches between interactive demo and full-page preview`, async ({
    page,
  }) => {
    await page.goto(`/styles/${slug}`);
    const section = page.locator("#playground");
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator("[data-style-preview]")).toBeHidden();
    await expect(section.locator(".demo-workbench").first()).toBeVisible();

    await section.getByText("整页预览", { exact: true }).click();
    await expect(section.locator("[data-style-preview]")).toBeVisible();
    await expect(section.locator("[data-style-preview]").locator("div").first()).toBeVisible();
  });
}
