// src/test/l10n.test.ts
// Guards translation completeness: every localizable string in the catalog
// (category names + command descriptions) must have a pt-BR entry so a new
// command can never ship with an untranslated tooltip.

import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import { FLUTTER_COMMAND_CATEGORIES } from "../data/flutter_commands_categorized";

// out/test/l10n.test.js → repo root is two levels up.
const repoRoot = path.resolve(__dirname, "..", "..");
const bundlePath = path.join(repoRoot, "l10n", "bundle.l10n.pt-br.json");

suite("pt-BR localization coverage", () => {
  const bundle: Record<string, string> = JSON.parse(
    fs.readFileSync(bundlePath, "utf8")
  );

  test("every category name is translated", () => {
    const missing = FLUTTER_COMMAND_CATEGORIES.map((c) => c.name).filter(
      (name) => !(name in bundle)
    );
    assert.deepStrictEqual(missing, [], `missing category translations`);
  });

  test("every command description is translated", () => {
    const missing = new Set<string>();
    for (const category of FLUTTER_COMMAND_CATEGORIES) {
      for (const cmd of category.commands) {
        if (!(cmd.description in bundle)) {
          missing.add(cmd.description);
        }
      }
    }
    assert.deepStrictEqual(
      [...missing],
      [],
      "missing description translations"
    );
  });

  test("no translation value is empty", () => {
    for (const [key, value] of Object.entries(bundle)) {
      assert.ok(value.length > 0, `empty translation for "${key}"`);
    }
  });
});
