import { test, expect } from "./helpers/private-browser.mjs";
import { readdirSync } from "node:fs";
import { readyStyleFrame, exerciseStyleFlow } from './helpers/style-page-flows.mjs';

async function openDemo(page, slug, locale = "") {
  await page.goto(`${locale}/components/${slug}`);
  const demo = page.locator("#playground");
  await demo.scrollIntoViewIfNeeded();
  await expect(demo.locator("astro-island[ssr]")).toHaveCount(0);
  return demo.locator("#style-variants");
}

test("input validates, saves, resets and previews at narrow width", async ({
  page,
}) => {
  const demo = await openDemo(page, "input");
  const field = demo.getByRole("textbox", { name: "工作邮箱" });
  await field.fill("invalid");
  await demo.getByRole("button", { name: "保存偏好" }).click();
  await expect(field).toHaveAttribute("aria-invalid", "true");
  await field.fill("hello@example.com");
  await demo.getByRole("button", { name: "保存偏好" }).click();
  await expect(demo.getByRole("status")).toContainText("已在当前演示中保存");
  await demo.getByRole("button", { name: "窄容器" }).click();
  await expect
    .poll(() =>
      demo
        .locator(".demo-viewport")
        .evaluate((el) => el.getBoundingClientRect().width),
    )
    .toBeLessThanOrEqual(360);
  await demo.getByRole("button", { name: "重置" }).click();
  await expect(field).toHaveValue("lin@example.com");
  await expect(page.locator("#references a")).toHaveCount(3);
});

test("tabs move DOM focus and connect their active panel", async ({ page }) => {
  const demo = await openDemo(page, "tabs");
  const tabs = demo.getByRole("tab");
  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(demo.getByRole("tabpanel")).toContainText("林舟");
  await page.keyboard.press("End");
  await expect(tabs.last()).toBeFocused();
  await expect(demo.getByRole("tabpanel")).toHaveAttribute(
    "aria-labelledby",
    await tabs.last().getAttribute("id"),
  );
});

for (const slug of ["menu", "dropdown"])
  test(`${slug}: keyboard can reach delete, cancel, confirm and undo`, async ({
    page,
  }) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const demo = await openDemo(page, slug);
    const trigger = demo.getByRole("button", { name: "更多操作" });
    await trigger.click();
    await expect(demo.getByRole("menuitem").first()).toBeFocused();
    await page.keyboard.press("End");
    await expect(
      demo.getByRole("menuitem", { name: "删除", exact: true }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await demo.getByRole("button", { name: "取消", exact: true }).click();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await trigger.click();
    await demo.getByRole("menuitem", { name: "删除", exact: true }).click();
    await demo.getByRole("button", { name: "确认删除" }).click();
    await demo.getByRole("button", { name: "撤销删除" }).click();
    await expect(demo.getByRole("status")).toContainText("文件已恢复");
    expect(errors).toEqual([]);
  });

test("combobox filters, commits, clears and handles empty results in English", async ({
  page,
}) => {
  const demo = await openDemo(page, "combobox", "/en");
  const field = demo.getByRole("combobox");
  await field.fill("glass");
  await expect(demo.getByRole("option")).toHaveCount(1);
  await page.keyboard.press("Enter");
  await expect(field).toHaveValue("Glassmorphism");
  await expect(field).toHaveAttribute("aria-expanded", "false");
  await demo.getByRole("button", { name: "Clear selection" }).click();
  await expect(demo.getByRole("option")).toHaveCount(6);
  await field.fill("zzzzz");
  await expect(
    demo.getByText("No matching styles. Clear the field and try again."),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(field).toHaveAttribute("aria-expanded", "false");
});

test("stepper validates and preserves values across back navigation", async ({
  page,
}) => {
  const demo = await openDemo(page, "stepper");
  await demo.getByRole("button", { name: "下一步" }).click();
  await expect(demo.getByRole("alert")).toBeVisible();
  await demo.getByRole("textbox").fill("Atlas studio");
  await demo.getByRole("button", { name: "下一步" }).click();
  await demo.getByRole("combobox").selectOption("team");
  await demo.getByRole("button", { name: "上一步" }).click();
  await expect(demo.getByRole("textbox")).toHaveValue("Atlas studio");
  await demo.getByRole("button", { name: "下一步" }).click();
  await expect(demo.getByRole("combobox")).toHaveValue("team");
  await demo.getByRole("button", { name: "下一步" }).click();
  await demo.getByRole("button", { name: "创建工作区", exact: true }).click();
  await expect(demo.getByRole("status")).toContainText("工作区已创建");
});

test("file selection validates type and size without losing selected files", async ({
  page,
}) => {
  const demo = await openDemo(page, "file-upload");
  const input = demo.locator("input[type=file]");
  await input.setInputFiles({
    name: "sample.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 sample"),
  });
  await expect(demo.getByRole("status")).toContainText("1 个文件");
  await input.setInputFiles({
    name: "bad.exe",
    mimeType: "application/octet-stream",
    buffer: Buffer.from("bad"),
  });
  await expect(demo.getByRole("alert")).toContainText("请选择");
  await expect(demo.getByRole("status")).toContainText("1 个文件");
  await input.setInputFiles({
    name: "big.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.alloc(6 * 1024 * 1024),
  });
  await expect(demo.getByRole("alert")).toContainText("5 MB");
  await demo.getByRole("button", { name: "移除 sample.pdf" }).click();
  await expect(demo.getByRole("status")).toContainText("0 个文件");
});

test("rating and segmented controls support native radio keyboards", async ({
  page,
}) => {
  let demo = await openDemo(page, "rating");
  await expect(demo.getByRole("button", { name: "提交反馈" })).toBeDisabled();
  await demo.getByRole("radio").first().focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowRight");
  await expect(demo.getByRole("radio").nth(1)).toBeChecked();
  await demo.getByRole("button", { name: "提交反馈" }).click();
  await expect(demo.getByRole("status")).toContainText("谢谢");
  demo = await openDemo(page, "segmented-control");
  await demo.getByRole("radio").nth(1).focus();
  await page.keyboard.press("ArrowRight");
  await expect(demo.getByRole("radio").nth(2)).toBeChecked();
  await expect(demo.getByText("当前：按年查看 · 示例数据")).toBeVisible();
});

test("timeline preserves expanded event when reordered", async ({ page }) => {
  const demo = await openDemo(page, "timeline");
  await demo.getByRole("button", { name: /09:00/ }).click();
  await demo.getByRole("button", { name: "切换顺序" }).click();
  await expect(demo.getByRole("button", { name: /09:00/ })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await expect(
    demo.getByText("明确使用人群、项目目标和交付范围。"),
  ).toBeVisible();
});

test("all component pages render on mobile, switch modes and reset without errors", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 390, height: 844 });
  const errors = [];
  page.on("pageerror", (error) =>
    errors.push(`${page.url()}: ${error.message}`),
  );
  const slugs = readdirSync("src/content/components")
    .filter((x) => x.endsWith(".yaml"))
    .map((x) => x.slice(0, -5));
  for (const slug of slugs) {
    const demo = await openDemo(page, slug);
    await expect(demo).toBeVisible();
    for (const mode of ["深色", "形式", "默认"]) {
      const button = demo.getByRole("button", { name: mode, exact: true });
      if (await button.count()) {
        await button.click();
        await expect(button).toHaveAttribute("aria-pressed", "true");
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth + 1,
          ),
          `${slug} ${mode} overflows on mobile`,
        ).toBe(false);
      }
    }
    await demo.getByRole("button", { name: "重置" }).click();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    );
    expect(overflow, `${slug} overflows on mobile`).toBe(false);
  }
  expect(errors).toEqual([]);
});

for (const slug of ["organic", "art-deco", "neumorphism"])
  test(`${slug} style has a working interactive scene`, async ({ page }) => {
    await page.goto(`/styles/${slug}`);
    const { scene } = await readyStyleFrame(page, slug, 'zh');
    // 保留收藏、晚宴计划、专注状态这些用户结果，迁移到各品牌真正的业务流程。
    await exerciseStyleFlow(scene, slug, 'zh');
  });

test("context menu supports right-click and keyboard dismissal", async ({
  page,
}) => {
  const demo = await openDemo(page, "menu");
  await demo.getByRole("button", { name: "形式", exact: true }).click();
  await demo
    .locator(".specimen")
    .click({ button: "right", position: { x: 120, y: 70 } });
  await expect(demo.getByRole("menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(demo.getByRole("menu")).toHaveCount(0);
});

test("prompt copy reports success and offers manual copying when blocked", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.__copiedPrompt = text;
        },
      },
    });
  });
  await page.goto("/components/combobox");
  const section = page.locator("#prompts");
  await section.scrollIntoViewIfNeeded();
  await expect(section.locator("astro-island[ssr]")).toHaveCount(0);
  await section.getByRole("button", { name: "复制 Prompt" }).click();
  await expect(section.getByRole("status").first()).toContainText("已复制");
  expect(await page.evaluate(() => window.__copiedPrompt)).toContain(
    "可搜索选择框",
  );
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw new Error("denied");
    };
  });
  await section.getByRole("button", { name: "通用概念说明", exact: true }).click();
  await section.getByRole("button", { name: "基础", exact: true }).click();
  await section.getByRole("button", { name: "复制 Prompt" }).click();
  await expect(section.getByRole("status").first()).toContainText("手动复制");
});

test('mobile category navigation reaches component library', async ({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/');
 await page.getByLabel('浏览分类').click();
 await page.getByRole('navigation',{name:'移动端导航'}).getByRole('link',{name:'组件',exact:true}).click();
 await expect(page).toHaveURL(/\/components/);
  await expect(page.locator('[data-list-item]')).toHaveCount(46);
});
