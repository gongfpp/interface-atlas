import { test, expect } from "@playwright/test";

/** 打开某组件的风格画廊并选中指定风格变体。 */
async function selectStyle(page, component, style) {
  await page.goto(`/components/${component}`);
  const section = page.locator("#style-variants");
  await section.scrollIntoViewIfNeeded();
  const pill = section.locator(`[data-style="${style}"]`);
  await pill.waitFor({ state: "visible" });
  await pill.click();
  await expect(pill).toHaveAttribute("aria-pressed", "true");
  return section;
}

test("table variant sorts numerically and exposes aria-sort", async ({ page }) => {
  const section = await selectStyle(page, "table", "editorial");
  const firstCity = section.locator("tbody tr td:first-child").first();
  await expect(firstCity).toHaveText("Tokyo"); // descending by default
  await section.getByRole("button", { name: /Population/ }).click();
  await expect(firstCity).toHaveText("Lima");
  await expect(section.locator("th[aria-sort='ascending']")).toHaveCount(1);
});

test("progress bar never exceeds 100%", async ({ page }) => {
  const section = await selectStyle(page, "progress-bar", "minimalism");
  const bar = section.getByRole("progressbar");
  for (let i = 0; i < 6; i++) await section.getByRole("button").first().click();
  const now = Number(await bar.getAttribute("aria-valuenow"));
  expect(now).toBeLessThanOrEqual(100);
  expect(now).toBeGreaterThanOrEqual(0);
});

test("date picker navigation changes month and grid", async ({ page }) => {
  const section = await selectStyle(page, "date-picker", "minimalism");
  await expect(section.getByText("September 2026")).toBeVisible();
  await section.getByRole("button", { name: "Next month" }).click();
  await expect(section.getByText("October 2026")).toBeVisible();
  await section.getByRole("button", { name: "Previous month" }).click();
  await expect(section.getByText("September 2026")).toBeVisible();
});

test("tabs expose panels and arrow-key navigation", async ({ page }) => {
  const section = await selectStyle(page, "tabs", "liquid-glass");
  const tabs = section.getByRole("tab");
  await expect(section.getByRole("tabpanel", { name: /Week/ })).toBeVisible();
  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(section.getByRole("tabpanel", { name: /Week/ })).toBeVisible();
});

test("tooltip shows on keyboard focus and hides on Escape", async ({ page }) => {
  const section = await selectStyle(page, "tooltip", "cyberpunk");
  const trigger = section.getByRole("button", { name: /ping/ });
  await trigger.focus();
  await expect(section.getByRole("tooltip")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(section.getByRole("tooltip")).toHaveCount(0);
});

test("switch exposes role=switch and toggles aria-checked", async ({ page }) => {
  const section = await selectStyle(page, "switch", "flat-design");
  const sw = section.getByRole("switch", { name: "Notifications" });
  const before = await sw.getAttribute("aria-checked");
  await sw.click();
  await expect(sw).not.toHaveAttribute("aria-checked", before ?? "");
});

test("file upload uses a real file input and lists the chosen file", async ({ page }) => {
  const section = await selectStyle(page, "file-upload", "flat-design");
  await section.locator('input[type=file]').setInputFiles({
    name: "report.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 demo"),
  });
  await expect(section.getByText("report.pdf")).toBeVisible();
});

test("tag input removes only the targeted duplicate tag", async ({ page }) => {
  const section = await selectStyle(page, "tag-input", "memphis");
  const input = section.getByRole("textbox", { name: "Add tag" });
  await input.fill("dup");
  await input.press("Enter");
  await input.fill("dup");
  await input.press("Enter");
  await expect(section.getByRole("button", { name: "Remove dup" })).toHaveCount(2);
  await section.getByRole("button", { name: "Remove dup" }).first().click();
  await expect(section.getByRole("button", { name: "Remove dup" })).toHaveCount(1);
});

test("input value survives a style switch (shared lab session)", async ({ page }) => {
  const section = await selectStyle(page, "input", "minimalism");
  const field = section.getByRole("textbox").first();
  await field.fill("kept across styles");
  await section.locator('[data-style="neobrutalism"]').click();
  await expect(section.getByRole("textbox").first()).toHaveValue("kept across styles");
});

test("active tab survives a style switch", async ({ page }) => {
  const section = await selectStyle(page, "tabs", "flat-design");
  await section.getByRole("tab").nth(2).click();
  await expect(section.getByRole("tab").nth(2)).toHaveAttribute("aria-selected", "true");
  await section.locator('[data-style="memphis"]').click();
  await expect(section.getByRole("tab").nth(2)).toHaveAttribute("aria-selected", "true");
});
