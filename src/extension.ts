// src/extension.ts
// =======================================
// Entry point for the Flutter Terminal Helper extension.
// Registers the sidebar TreeView with the Flutter/Dart commands.
// =======================================

import * as vscode from "vscode";
import { registerCommandsTreeView } from "./views/commandsTreeView";

export function activate(context: vscode.ExtensionContext) {
  try {
    registerCommandsTreeView(context);
    console.log("Flutter Terminal Helper activated.");
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    vscode.window.showErrorMessage(
      vscode.l10n.t("Flutter Helper failed to activate: {0}", detail)
    );
  }
}

export function deactivate() {
  // Nothing to clean up: subscriptions are disposed by VS Code.
}
