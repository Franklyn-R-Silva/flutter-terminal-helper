// src/test/terminal.test.ts
// Unit tests for the pure terminal helpers (FVM rewrite + argument detection).

import * as assert from "assert";
import { applyFvm, needsArgument } from "../terminal/terminalManager";

suite("applyFvm", () => {
  test("off never rewrites", () => {
    assert.strictEqual(applyFvm("flutter run", "off", true), "flutter run");
  });

  test("on always prefixes flutter and dart", () => {
    assert.strictEqual(applyFvm("flutter run", "on", false), "fvm flutter run");
    assert.strictEqual(
      applyFvm("dart pub get", "on", false),
      "fvm dart pub get"
    );
  });

  test("auto prefixes only in an FVM project", () => {
    assert.strictEqual(applyFvm("flutter run", "auto", false), "flutter run");
    assert.strictEqual(
      applyFvm("flutter run", "auto", true),
      "fvm flutter run"
    );
  });

  test("rewrites both sides of a chained command", () => {
    assert.strictEqual(
      applyFvm("flutter clean && flutter pub get", "on", true),
      "fvm flutter clean && fvm flutter pub get"
    );
  });

  test("leaves other tools untouched", () => {
    assert.strictEqual(
      applyFvm("supabase start", "on", true),
      "supabase start"
    );
    assert.strictEqual(
      applyFvm("melos bootstrap", "on", true),
      "melos bootstrap"
    );
    // 'dart' only rewritten as a leading token, not inside another word.
    assert.strictEqual(
      applyFvm("firebase deploy", "on", true),
      "firebase deploy"
    );
  });
});

suite("needsArgument", () => {
  test("true when the command ends with whitespace", () => {
    assert.strictEqual(needsArgument("flutter pub add "), true);
    assert.strictEqual(needsArgument("supabase link --project-ref "), true);
  });

  test("false for complete commands", () => {
    assert.strictEqual(needsArgument("flutter run"), false);
    assert.strictEqual(needsArgument(""), false);
    assert.strictEqual(needsArgument("   "), false);
  });
});
