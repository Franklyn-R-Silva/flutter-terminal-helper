// src/test/extension.test.ts
// Integration tests running inside a real VS Code instance: the extension
// activates and registers all of its contributed commands.

import * as assert from "assert";
import * as vscode from "vscode";

const EXTENSION_ID = "Franklyn-R-Silva.flutter-terminal-helper";

const CONTRIBUTED_COMMANDS = [
  "flutterHelper.defaultAction",
  "flutterHelper.runFromTree",
  "flutterHelper.pasteFromTree",
  "flutterHelper.copyCommand",
  "flutterHelper.refreshCommands",
  "flutterHelper.searchCommands",
  "flutterHelper.addFavorite",
  "flutterHelper.removeFavorite",
  "flutterHelper.clearRecent",
];

suite("extension activation", () => {
  test("the extension is present and activates", async () => {
    const ext = vscode.extensions.getExtension(EXTENSION_ID);
    assert.ok(ext, `extension ${EXTENSION_ID} should be installed`);
    await ext.activate();
    assert.strictEqual(ext.isActive, true);
  });

  test("all contributed commands are registered", async () => {
    const ext = vscode.extensions.getExtension(EXTENSION_ID);
    await ext?.activate();
    const registered = await vscode.commands.getCommands(true);
    for (const command of CONTRIBUTED_COMMANDS) {
      assert.ok(
        registered.includes(command),
        `command ${command} should be registered`
      );
    }
  });

  test("refresh command runs without throwing", async () => {
    const ext = vscode.extensions.getExtension(EXTENSION_ID);
    await ext?.activate();
    await vscode.commands.executeCommand("flutterHelper.refreshCommands");
  });
});
