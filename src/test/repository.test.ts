// src/test/repository.test.ts
// Unit tests for the command catalog + validating repository. These exercise
// pure logic and do not depend on the VS Code UI.

import * as assert from "assert";
import { loadCommandCategories } from "../data/commandsRepository";
import { FLUTTER_COMMAND_CATEGORIES } from "../data/flutter_commands_categorized";

suite("commandsRepository", () => {
  test("loads a non-empty list of categories", async () => {
    const categories = await loadCommandCategories();
    assert.ok(Array.isArray(categories));
    assert.ok(categories.length > 0, "expected at least one category");
  });

  test("every category has a name, icon and at least one command", async () => {
    const categories = await loadCommandCategories();
    for (const category of categories) {
      assert.strictEqual(typeof category.name, "string");
      assert.ok(category.name.length > 0, "category name must not be empty");
      assert.ok(category.icon.length > 0, "category icon must not be empty");
      assert.ok(
        category.commands.length > 0,
        `category "${category.name}" must have commands`
      );
    }
  });

  test("every command has a label and a non-empty command string", async () => {
    const categories = await loadCommandCategories();
    for (const category of categories) {
      for (const cmd of category.commands) {
        assert.ok(cmd.label.length > 0, "command label must not be empty");
        assert.ok(
          cmd.command.trim().length > 0,
          `command "${cmd.label}" must not be blank`
        );
        assert.strictEqual(typeof cmd.description, "string");
      }
    }
  });

  test("command strings are unique within each category", () => {
    // The same command may intentionally appear under two categories (e.g.
    // `dart format .` under both Dart and Test & Analyze) as a navigation aid,
    // but it must never be duplicated inside a single category.
    for (const category of FLUTTER_COMMAND_CATEGORIES) {
      const seen = new Set<string>();
      for (const cmd of category.commands) {
        const key = cmd.command.trim();
        assert.ok(
          !seen.has(key),
          `duplicate command "${key}" in category "${category.name}"`
        );
        seen.add(key);
      }
    }
  });
});
