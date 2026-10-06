import test from "node:test";
import assert from "node:assert/strict";
let sequence = 0;
const item = {
  id: "input-test",
  conceptId: "input",
  conceptType: "components",
  name: "Input",
  locale: "en",
  styleId: "minimalism",
  styleName: "Minimalism",
  mode: "default",
  variant: "filled",
  variantScope: "preview",
  requirements: ["Keyboard"],
  prompt: "Implement the exact selection",
  group: "Website",
  note: "Home form",
  url: "/components/input?form=filled#playground",
  createdAt: 1,
};
async function setup() {
  const disk = new Map();
  let blocked = false;
  globalThis.window = {
    location: { origin: "https://atlas.example" },
    localStorage: {
      getItem: (key) => disk.get(key) ?? null,
      setItem(key, value) {
        if (blocked) throw Error("quota");
        disk.set(key, value);
      },
    },
  };
  const store = await import(`../../src/lib/solutions.ts?backup=${sequence++}`);
  return {
    store,
    disk,
    blocked(value) {
      blocked = value;
    },
  };
}
test.afterEach(() => {
  delete globalThis.window;
});

test("JSON round trip retains identity, complete configuration, project, reason and prompt", async () => {
  const { store } = await setup();
  const raw = store.exportSolutionsBackup([item]);
  assert.deepEqual(store.readSolutionsBackup(raw), [item]);
  assert.deepEqual(store.importSolutions(store.readSolutionsBackup(raw)), {
    added: 1,
    skipped: 0,
    persisted: true,
  });
  assert.deepEqual(store.getSolutionsSnapshot(), [item]);
  assert.deepEqual(store.importSolutions(store.readSolutionsBackup(raw)), {
    added: 0,
    skipped: 1,
    persisted: true,
  });
});
test("backups relocate deployment paths and origin without changing preview parameters", async () => {
  const { store } = await setup();
  const deployed = {
    ...item,
    url: "https://atlas.example/old-base/en/components/input?style=minimalism&form=filled#playground",
  };
  const raw = store.exportSolutionsBackup([deployed], "/old-base");
  assert.equal(
    JSON.parse(raw).solutions[0].url,
    "/old-base/en/components/input?style=minimalism&form=filled#playground",
  );
  assert.equal(
    store.readSolutionsBackup(raw, "/interface-atlas-web")[0].url,
    "/interface-atlas-web/en/components/input?style=minimalism&form=filled#playground",
  );
});
test("a backup cannot overwrite a newer existing record, even when imported twice", async () => {
  const { store } = await setup();
  store.saveSolution({ ...item, note: "Current note" });
  const incoming = [item, { ...item, id: "other" }];
  assert.deepEqual(store.importSolutions(incoming), {
    added: 1,
    skipped: 1,
    persisted: true,
  });
  assert.equal(
    store.getSolutionsSnapshot().find((row) => row.id === item.id).note,
    "Current note",
  );
  assert.equal(store.getSolutionsSnapshot().length, 2);
});
test("invalid, unsafe, duplicate and unsupported files do not partially alter storage", async () => {
  const { store, disk } = await setup();
  store.saveSolution(item);
  const before = disk.get("ia-solutions-v1");
  const valid = JSON.parse(store.exportSolutionsBackup([item]));
  for (const data of [
    { ...valid, version: 2 },
    { ...valid, solutions: [item, { ...item, id: "bad", mode: 2 }] },
    { ...valid, solutions: [item, item] },
    ...[
      "javascript:alert(1)",
      "//evil.example/components/input",
      "/another-app/input",
      "/components/button",
      "/components/input?x=<script>",
    ].map((url) => ({ ...valid, solutions: [{ ...item, url }] })),
  ]) {
    assert.throws(() => store.readSolutionsBackup(JSON.stringify(data)));
    assert.equal(disk.get("ia-solutions-v1"), before);
  }
  assert.throws(() => store.readSolutionsBackup("{invalid"));
  assert.throws(
    () => store.readSolutionsBackup(" ".repeat(store.BACKUP_MAX_BYTES + 1)),
    /size/,
  );
});
test("import failure is retained in memory and retry merges a subsequently added disk record", async () => {
  const { store, disk, blocked } = await setup();
  blocked(true);
  assert.equal(store.importSolutions([item]).persisted, false);
  assert.deepEqual(store.getSolutionsSnapshot(), [item]);
  disk.set(
    "ia-solutions-v1",
    JSON.stringify([{ ...item, id: "from-other-tab" }]),
  );
  blocked(false);
  assert.equal(store.retrySolutionsStorage(), true);
  assert.deepEqual(
    new Set(store.getSolutionsSnapshot().map((row) => row.id)),
    new Set([item.id, "from-other-tab"]),
  );
});
test("undo retains every field and never overwrites a concurrently restored entry", async () => {
  const { store } = await setup();
  store.saveSolution(item);
  store.removeSolution(item.id);
  assert.equal(store.getSolutionsSnapshot().length, 0);
  assert.equal(store.restoreSolution(item), true);
  assert.deepEqual(store.getSolutionsSnapshot(), [item]);
  store.removeSolution(item.id);
  store.saveSolution({ ...item, note: "Newer restored note" });
  store.restoreSolution(item);
  assert.equal(store.getSolutionsSnapshot()[0].note, "Newer restored note");
});
test("undoing a failed deletion also retains earlier unsaved edits", async () => {
  const { store, blocked } = await setup();
  store.saveSolution(item);
  blocked(true);
  store.updateSolution(item.id, { note: "Unsaved edit" });
  const edited = store.getSolutionsSnapshot()[0];
  store.removeSolution(item.id);
  assert.equal(store.getSolutionsSnapshot().length, 0);
  store.restoreSolution(edited);
  assert.equal(store.getSolutionsSnapshot()[0].note, "Unsaved edit");
  blocked(false);
  store.retrySolutionsStorage();
  assert.equal(store.getSolutionsSnapshot()[0].note, "Unsaved edit");
});
