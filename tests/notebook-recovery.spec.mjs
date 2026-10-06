import { test, expect } from "./helpers/private-browser.mjs";
import { readFile } from "node:fs/promises";
const original = {
  id: "notebook-input",
  conceptId: "input",
  conceptType: "components",
  name: "输入框",
  locale: "zh",
  styleId: "minimalism",
  styleName: "极简主义",
  mode: "default",
  variant: "",
  requirements: ["不新增依赖"],
  prompt: "实现这份完整方案\n保留这行说明",
  group: "个人网站",
  note: "首页主表单",
  url: "/components/input?style=minimalism&mode=default#playground",
  createdAt: 1,
};
async function seed(page, items, path = "/saved") {
  await page.goto(path);
  await page.evaluate(
    (value) => localStorage.setItem("ia-solutions-v1", JSON.stringify(value)),
    items,
  );
  await page.reload();
  await expect(
    page.locator('[aria-labelledby="solution-notebook-title"]'),
  ).toBeVisible();
}
async function choose(page, file) {
  const chooser = page.waitForEvent("filechooser");
  await page
    .getByRole("button", { name: /^(导入备份|Import backup)$/ })
    .click();
  await (await chooser).setFiles(file);
}
const backup = (items) => ({
  format: "interface-atlas-notebook",
  version: 1,
  base: "",
  solutions: items,
});
const payload = (data) => ({
  name: "notebook.json",
  mimeType: "application/json",
  buffer: Buffer.from(JSON.stringify(data)),
});

test("download, clear and import restore full configuration; repeated import preserves current edits", async ({
  page,
}) => {
  await seed(page, [original]);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "下载备份", exact: true }).click();
  const download = await downloadPromise;
  const saved = JSON.parse(await readFile(await download.path(), "utf8"));
  expect(saved.solutions).toEqual([original]);
  await page.evaluate(() => localStorage.removeItem("ia-solutions-v1"));
  await page.reload();
  await choose(page, await download.path());
  const region = page.getByRole("region", { name: "待导入备份" });
  await expect(region).toContainText("将新增 1 个");
  await expect(
    region.getByRole("button", { name: "合并到参考册" }),
  ).toBeFocused();
  await expect(page.getByRole("article")).toHaveCount(0);
  await region.getByRole("button", { name: "合并到参考册" }).click();
  await expect(page.getByRole("article")).toHaveCount(1);
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("ia-solutions-v1")),
    ),
  ).toEqual([original]);
  await page.getByRole("button", { name: "编辑分组与理由" }).click();
  await page.getByRole("textbox", { name: "选择理由" }).fill("现在的新理由");
  await page.getByRole("button", { name: "保存修改" }).click();
  await choose(page, await download.path());
  await region.getByRole("button", { name: "合并到参考册" }).click();
  await expect(page.getByText("现在的新理由", { exact: true })).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(1);
  await page.getByRole("link", { name: /恢复方案/ }).click();
  await expect(page.locator("[data-solution-summary]")).toContainText(
    "极简主义",
  );
});

test("two removals can be undone in order, restoring full records and keyboard focus", async ({
  page,
}) => {
  const second = {
    ...original,
    id: "second",
    name: "另一方案",
    group: "后台",
    note: "第二组",
  };
  await seed(page, [original, second]);
  await page
    .getByRole("button", { name: "移除方案 输入框", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "撤销移除 (1)", exact: true }),
  ).toBeFocused();
  await page
    .getByRole("button", { name: "移除方案 另一方案", exact: true })
    .click();
  await page.getByRole("button", { name: "撤销移除 (2)", exact: true }).click();
  await page.getByRole("button", { name: "撤销移除 (1)", exact: true }).click();
  await expect(
    page.locator('[data-solution-id="notebook-input"]'),
  ).toBeFocused();
  await page.getByRole("combobox", { name: "项目分组" }).selectOption("all");
  await expect(page.getByRole("article")).toHaveCount(2);
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("ia-solutions-v1")).sort((a, b) =>
        a.id.localeCompare(b.id),
      ),
    ),
  ).toEqual([original, second].sort((a, b) => a.id.localeCompare(b.id)));
});

test("invalid and external-link backups plus cancel leave the notebook unchanged", async ({
  page,
}) => {
  await seed(page, [original]);
  for (const data of [
    { invalid: true },
    backup([
      original,
      { ...original, id: "bad", url: "https://evil.example/" },
    ]),
  ]) {
    await choose(page, payload(data));
    await expect(
      page.getByRole("status").filter({ hasText: "无法读取这份备份" }),
    ).toBeVisible();
    expect(
      await page.evaluate(() =>
        JSON.parse(localStorage.getItem("ia-solutions-v1")),
      ),
    ).toEqual([original]);
  }
  await choose(page, payload(backup([{ ...original, id: "other" }])));
  await page.getByRole("button", { name: "取消导入" }).click();
  await expect(page.getByRole("region", { name: "待导入备份" })).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "导入备份", exact: true }),
  ).toBeFocused();
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("ia-solutions-v1")),
    ),
  ).toEqual([original]);
});

test("failed import can retry while retaining additions from another tab", async ({
  page,
  context,
}) => {
  await context.addInitScript(() => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (window.auditBlocked && key === "ia-solutions-v1")
        throw new DOMException("full", "QuotaExceededError");
      return set.call(this, key, value);
    };
  });
  await seed(page, []);
  await page.evaluate(() => {
    window.auditBlocked = true;
  });
  await choose(page, payload(backup([original])));
  await page.getByRole("button", { name: "合并到参考册" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "本地存储不可用" }),
  ).toBeVisible();
  const other = await context.newPage();
  await seed(other, [{ ...original, id: "other-tab", name: "另一标签页" }]);
  await expect(page.getByRole("article")).toHaveCount(2);
  await page.evaluate(() => {
    window.auditBlocked = false;
  });
  await page.getByRole("button", { name: "重试保存", exact: true }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "本地存储不可用" }),
  ).toHaveCount(0);
  await other.reload();
  await expect(other.getByRole("article")).toHaveCount(2);
});

test("failed ordinary bookmark save also merges another tab before retry", async ({
  page,
  context,
}) => {
  await context.addInitScript(() => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (window.auditBlocked && key === "ia-saved")
        throw new DOMException("full", "QuotaExceededError");
      return set.call(this, key, value);
    };
  });
  await page.goto("/components/input");
  await expect(page.locator("[data-solution-lab]")).toBeVisible();
  await page.evaluate(() => {
    window.auditBlocked = true;
  });
  await page.getByRole("button", { name: "☆ 收藏", exact: true }).click();
  const other = await context.newPage();
  await other.goto("/components/button");
  await expect(other.locator("[data-solution-lab]")).toBeVisible();
  await other.getByRole("button", { name: "☆ 收藏", exact: true }).click();
  await page.evaluate(() => {
    window.auditBlocked = false;
  });
  await page.getByRole("button", { name: "重试保存", exact: true }).click();
  expect(
    await other.evaluate(() =>
      JSON.parse(localStorage.getItem("ia-saved")).sort(),
    ),
  ).toEqual(["button", "input"]);
});

test("backup and undo controls work in English within a phone viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await seed(page, [original], "/en/saved");
  await page
    .getByRole("button", { name: "Remove solution 输入框", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Undo removal (1)", exact: true })
    .click();
  await choose(page, payload(backup([{ ...original, id: "new-english" }])));
  await page.getByRole("button", { name: "Merge into notebook" }).click();
  await expect(page.getByRole("article")).toHaveCount(2);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("saving only a local reason retains the other tab’s changed project group", async ({
  page,
  context,
}) => {
  await seed(page, [original]);
  await page.getByRole("button", { name: "编辑分组与理由" }).click();
  await page.getByRole("textbox", { name: "选择理由" }).fill("本页新理由");
  const other = await context.newPage();
  await seed(other, [{ ...original, group: "另一页改的项目" }]);
  await page.getByRole("button", { name: "保存修改" }).click();
  await expect(page.getByText("本页新理由", { exact: true })).toBeVisible();
  const [saved] = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("ia-solutions-v1")),
  );
  expect(saved.group).toBe("另一页改的项目");
  expect(saved.note).toBe("本页新理由");
});

test("undo shows and focuses a record another tab restored into a different group", async ({
  page,
  context,
}) => {
  const remaining = { ...original, id: "remaining", name: "保留方案" };
  await seed(page, [original, remaining]);
  await page
    .getByRole("combobox", { name: "项目分组" })
    .selectOption("group:个人网站");
  await page
    .getByRole("button", { name: "移除方案 输入框", exact: true })
    .click();
  const other = await context.newPage();
  await seed(other, [
    { ...original, group: "另一项目", note: "他页恢复后的理由" },
    remaining,
  ]);
  await page.getByRole("button", { name: "撤销移除 (1)", exact: true }).click();
  const restored = page.locator('[data-solution-id="notebook-input"]');
  await expect(restored).toBeVisible();
  await expect(restored).toBeFocused();
  await expect(restored).toContainText("另一项目");
  await expect(restored).toContainText("他页恢复后的理由");
  await expect(page.getByRole("article")).toHaveCount(2);
});
