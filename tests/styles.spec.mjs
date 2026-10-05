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
  test(`style page ${slug}: full-page preview appears above the interactive scene`, async ({
    page,
  }) => {
    await page.goto(`/styles/${slug}`);
    const section = page.locator("#playground");
    await section.scrollIntoViewIfNeeded();
    const preview = section.locator("[data-style-preview]");
    const interactive = section.locator("[data-style-interactive]");
    await expect(preview).toBeVisible();
    await interactive.scrollIntoViewIfNeeded();
    await expect(interactive.locator(".demo-workbench")).toBeVisible();
    const previewBox = await preview.boundingBox();
    const interactiveBox = await interactive.boundingBox();
    expect(previewBox.y + previewBox.height).toBeLessThan(interactiveBox.y);
  });
}
