import { test, expect } from "@playwright/test";

test("skip link is the first focusable element and targets main", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    return {
      tag: el?.tagName,
      text: (el?.textContent || "").trim(),
      href: el?.getAttribute?.("href") || "",
    };
  });
  expect(focused.tag).toBe("A");
  expect(focused.href).toBe("#main");
  expect(focused.text).toMatch(/跳到主要内容|Skip to content/);

  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});

test("search dialog is labelled, uses combobox semantics and restores focus", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#search-open").click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");

  const labelledBy = await dialog.getAttribute("aria-labelledby");
  expect(labelledBy).toBeTruthy();
  await expect(page.locator(`#${labelledBy}`)).toHaveCount(1);

  const input = dialog.getByRole("combobox");
  await expect(input).toBeVisible();
  await expect(input).toHaveAttribute("aria-expanded", /true|false/);

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.locator("#search-open")).toBeFocused();
});

test("unknown route renders a 404 heading and localized English chrome", async ({
  page,
}) => {
  const res = await page.goto("/this-route-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("404");

  await page.goto("/en");
  await expect(page.getByRole("link", { name: /Skip to content/i })).toHaveCount(1);
});
