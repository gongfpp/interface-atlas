import { test, expect } from "./helpers/private-browser.mjs";

test("search shows an error with retry instead of a false empty result", async ({
  page,
}) => {
  let fail = true;
  await page.route("**/data/search-docs.json", (route) => {
    if (fail) route.fulfill({ status: 500, body: "boom" });
    else route.fallback();
  });

  await page.goto("/");
  await page.locator("#search-open").click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("combobox").fill("骨架屏");
  await expect(dialog.getByRole("alert")).toContainText(/加载失败|failed/i);

  fail = false;
  await dialog.getByRole("button", { name: /重试|Retry/ }).click();
  await expect(dialog.getByRole("option").first()).toBeVisible({ timeout: 10_000 });
});

test("markdown mirror links related concepts to their real type and base path", async ({
  request,
}) => {
  const res = await request.get("/motion/hover-lift.md", { maxRedirects: 0 });
  expect(res.ok()).toBeTruthy();
  const text = await res.text();
  // hover-lift applies_to card (a component) → must resolve to /components/card, not /motion/card
  expect(text).toContain("/components/card");
  expect(text).not.toContain("/motion/card");
  expect(text).toContain("/api/concept/motion/hover-lift.json");
});
