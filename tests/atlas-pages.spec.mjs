import { chooseAtlasVariant } from './helpers/atlas-controls.mjs';
import { test, expect } from "./helpers/private-browser.mjs";
import { STYLE_SLUGS, pathFor } from "./helpers/style-page-flows.mjs";

for (const locale of ["zh", "en"])
  for (const width of [1440, 390, 320])
    for (const slug of STYLE_SLUGS) {
      test(`整页风格 ${slug} ${locale} ${width}: 首页、变体、弹层历史、提示词`, async ({
        page,
      }, testInfo) => {
        const errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        await page.setViewportSize({ width, height: 900 });
        await page.addInitScript(() =>
          Object.defineProperty(navigator, "clipboard", {
            configurable: true,
            value: {
              writeText: async (text) => {
                window.__atlasCopied = text;
              },
            },
          }),
        );
        await page.goto(pathFor(locale, `/styles/${slug}/`));
        await expect(page.locator("[data-atlas-root]")).toHaveAttribute(
          "data-ready",
          "true",
        );
        await expect(page.locator("iframe")).toHaveCount(0);
        await page.evaluate(() => document.fonts.ready);
        await expect(page.locator(".atlas-title h1")).toBeVisible();
        const home = page.locator(".atlas-home");
        await expect(home).toHaveAttribute("href", locale === "en" ? "/en" : "/");
        await expect(home).toBeInViewport();
        const hit = await home.boundingBox();
        expect(hit.height).toBeGreaterThanOrEqual(44);
        expect(hit.width).toBeGreaterThanOrEqual(44);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width + 1);
        await expect
          .poll(() =>
            page
              .locator(".atlas-art img")
              .evaluateAll((imgs) =>
                imgs.every((i) => i.complete && i.naturalWidth > 0),
              ),
          )
          .toBe(true);
        await testInfo.attach("initial.png", {
          body: await page.screenshot({
            fullPage: true,
            animations: "disabled",
          }),
          contentType: "image/png",
        });
        const variant = page.locator("select[data-variant]");
        await chooseAtlasVariant(page, 1);
        const label = await variant.locator("option:checked").innerText();
        await expect(page.locator("[data-prompt-output]")).toHaveValue(
          new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
        );
        await page.locator("[data-prompt-output]").fill("My edited prompt");
        await chooseAtlasVariant(page, 0);
        await expect(page.locator("[data-prompt-output]")).toHaveValue(
          "My edited prompt",
        );
        await page.locator("[name=project]").fill("Atlas test");
        await page.locator("[name=brief]").fill("A quiet reader");
        await page.locator("[data-prompt-form] button[type=submit]").click();
        await expect(page.locator("[data-prompt-output]")).toHaveValue(
          /Atlas test/,
        );
        await page.locator("[data-copy-prompt]").click();
        expect(await page.evaluate(() => window.__atlasCopied)).toContain(
          "A quiet reader",
        );
        await expect(home).toBeInViewport();
        const open = page.locator('.atlas-example-list [data-example="0"]');
        await open.click();
        await expect(page.locator("[data-example-dialog]")).toBeVisible();
        await expect(page.locator("[data-example-prev]")).toBeDisabled();
        await page.locator("[data-example-next]").click();
        await expect(page.locator("[data-example-count]")).toContainText("2 /");
        await page.keyboard.press("Escape");
        await expect(page.locator("[data-example-dialog]")).not.toBeVisible();
        await expect(open).toBeFocused();
        await page.goForward();
        await expect(page.locator("[data-example-dialog]")).toBeVisible();
        await page.goBack();
        await expect(page.locator("[data-example-dialog]")).not.toBeVisible();
        await page.locator("[data-open-guide]").click();
        await expect(page.locator("[data-guide]")).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(page.locator("[data-guide]")).not.toBeVisible();
        await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
        await expect(home).toBeInViewport();
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width + 1);
        await home.click();
        await expect(page).toHaveURL(
          new RegExp(locale === "en" ? "/en/?$" : "/$"),
        );
        expect(errors).toEqual([]);
      });
    }

test("独立交互：几何撤销重做、像素画布、便笺、任务进度", async ({ page }) => {
  await page.goto("/styles/bauhaus/");
  await page.locator("[data-shape=circle]").click();
  await expect(page.locator("[data-shapes] i")).toHaveCount(1);
  await page.locator("[data-undo]").click();
  await expect(page.locator("[data-shapes] i")).toHaveCount(0);
  await page.locator("[data-redo]").click();
  await expect(page.locator("[data-shapes] i")).toHaveCount(1);
  await page.locator("[data-clear-shapes]").click();
  await page.locator("[data-undo]").click();
  await expect(page.locator("[data-shapes] i")).toHaveCount(1);
  await page.goto("/styles/pixel-art/");
  await page.locator('[data-pixel="0"]').focus();
  await page.keyboard.press("Space");
  await expect(page.locator('[data-pixel="0"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.locator("[data-clear-pixels]").click();
  await expect(page.locator("[data-pixel][aria-pressed=true]")).toHaveCount(0);
  await page.goto("/styles/hand-drawn/");
  await page.locator("[data-note-input]").fill("A real note");
  await page.locator("[data-pin-note]").click();
  await expect(page.locator("[data-pinned-note]")).toHaveText("A real note");
  await page.locator("[data-clear-note]").click();
  await expect(page.locator("[data-pinned-note]")).toBeEmpty();
  await page.goto("/styles/corporate-memphis/");
  await page.locator("[data-task]").nth(1).check();
  await expect(page.locator("[data-progress]")).toHaveAttribute("value", "2");
});

test("复制失败、减弱动态、复古窗口历史与真正的首页", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("blocked");
        },
      },
    }),
  );
  await page.goto("/styles/retro-web/");
  await page.locator('[data-folder="0"]').click();
  await expect(page.locator("[data-folder-path]")).toContainText("folder/1");
  await page.locator("[data-folder-back]").click();
  await expect(page.locator("[data-folder-path]")).toHaveText("atlas://home");
  await page.locator("[data-folder-forward]").click();
  await expect(page.locator("[data-folder-path]")).toContainText("folder/1");
  await page.locator("[data-copy-prompt]").click();
  await expect(page.locator("[data-prompt-notice]")).toContainText("手动复制");
  await page.locator(".atlas-home").click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/styles/aurora/");
  await page.locator("input[data-atmosphere]").check();
  await expect(page.locator(".atlas-aurora-field>div")).toHaveCSS(
    "animation-name",
    "none",
  );
});
