// src/test/stores.test.ts
// Unit tests for the favorites/recent stores using an in-memory Memento fake.

import * as assert from "assert";
import { FavoritesStore, RecentStore, KeyValueStore } from "../state/stores";

/** Minimal in-memory KeyValueStore for tests. */
class FakeMemento implements KeyValueStore {
  private data = new Map<string, unknown>();
  get<T>(key: string, defaultValue: T): T {
    return this.data.has(key) ? (this.data.get(key) as T) : defaultValue;
  }
  update(key: string, value: unknown): void {
    this.data.set(key, value);
  }
}

const cmd = (label: string, command: string) => ({
  label,
  command,
  description: "",
});

suite("FavoritesStore", () => {
  test("toggle adds then removes", async () => {
    const store = new FavoritesStore(new FakeMemento());
    assert.strictEqual(store.has("flutter run"), false);

    const added = await store.toggle(cmd("Run", "flutter run"));
    assert.strictEqual(added, true);
    assert.strictEqual(store.has("flutter run"), true);
    assert.strictEqual(store.list().length, 1);

    const stillThere = await store.toggle(cmd("Run", "flutter run"));
    assert.strictEqual(stillThere, false);
    assert.strictEqual(store.has("flutter run"), false);
  });

  test("remove is idempotent and matches by command", async () => {
    const store = new FavoritesStore(new FakeMemento());
    await store.toggle(cmd("Clean", "flutter clean"));
    await store.remove("flutter clean");
    await store.remove("flutter clean");
    assert.strictEqual(store.list().length, 0);
  });
});

suite("RecentStore", () => {
  test("record moves to front, de-dupes and caps at the limit", async () => {
    const store = new RecentStore(new FakeMemento(), () => 3);
    await store.record(cmd("A", "flutter a"));
    await store.record(cmd("B", "flutter b"));
    await store.record(cmd("C", "flutter c"));
    await store.record(cmd("D", "flutter d")); // evicts A
    await store.record(cmd("B", "flutter b")); // moves B to front

    const commands = store.list().map((c) => c.command);
    assert.deepStrictEqual(commands, ["flutter b", "flutter d", "flutter c"]);
  });

  test("limit 0 disables recording entirely", async () => {
    const store = new RecentStore(new FakeMemento(), () => 0);
    await store.record(cmd("A", "flutter a"));
    assert.deepStrictEqual(store.list(), []);
  });

  test("a changed limit applies without recreating the store", async () => {
    let limit = 3;
    const store = new RecentStore(new FakeMemento(), () => limit);
    await store.record(cmd("A", "flutter a"));
    await store.record(cmd("B", "flutter b"));
    limit = 1;
    assert.deepStrictEqual(
      store.list().map((c) => c.command),
      ["flutter b"]
    );
  });

  test("clear empties the list", async () => {
    const mem = new FakeMemento();
    const store = new RecentStore(mem, () => 5);
    await store.record(cmd("A", "flutter a"));
    await store.clear();
    assert.deepStrictEqual(store.list(), []);
  });
});
