// src/extension.ts
// =======================================
// Entry point for the Flutter Terminal Helper extension.
// Registers the sidebar TreeView with the Flutter/Dart commands.
// =======================================

import * as vscode from "vscode";
import { registerCommandsTreeView } from "./views/commandsTreeView";
import { FavoritesStore, RecentStore } from "./state/stores";

export function activate(context: vscode.ExtensionContext) {
  try {
    const recentLimit = vscode.workspace
      .getConfiguration("flutterHelper")
      .get<number>("recentLimit", 8);
    const favorites = new FavoritesStore(context.globalState);
    const recent = new RecentStore(context.globalState, recentLimit);
    registerCommandsTreeView(context, favorites, recent);
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
