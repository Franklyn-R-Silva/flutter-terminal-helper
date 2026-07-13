// src/terminal/terminalManager.ts
// =======================================
// Manages the terminal used by the extension.
// Reuses a dedicated terminal (by name) when possible and respects the
// user settings (flutterHelper.*). All operations are fault tolerant:
// failures are reported to the caller instead of throwing across the API.
// =======================================

import * as vscode from "vscode";

interface HelperConfig {
  terminalName: string;
  reuseTerminal: boolean;
  clickAction: "paste" | "run";
}

function getConfig(): HelperConfig {
  const cfg = vscode.workspace.getConfiguration("flutterHelper");
  return {
    terminalName: cfg.get<string>("terminalName", "Flutter") || "Flutter",
    reuseTerminal: cfg.get<boolean>("reuseTerminal", true),
    clickAction: cfg.get<"paste" | "run">("clickAction", "paste"),
  };
}

/** A terminal is usable only while it has not exited (user may have closed it). */
function isAlive(
  terminal: vscode.Terminal | undefined
): terminal is vscode.Terminal {
  return !!terminal && terminal.exitStatus === undefined;
}

/**
 * Returns a terminal to use. Reuses the dedicated terminal (by the configured
 * name) or the active one, skipping any that the user has already closed;
 * only creates a new terminal when needed.
 */
function resolveTerminal(): vscode.Terminal {
  const { terminalName, reuseTerminal } = getConfig();

  if (reuseTerminal) {
    const existing = vscode.window.terminals.find(
      (t) => t.name === terminalName && isAlive(t)
    );
    return existing ?? vscode.window.createTerminal(terminalName);
  }

  const active = vscode.window.activeTerminal;
  return isAlive(active) ? active : vscode.window.createTerminal(terminalName);
}

/**
 * Sends a command to the terminal. `execute` controls whether the command is
 * run (Enter) or just pasted for review. Returns false on failure.
 */
export function sendToTerminal(command: string, execute: boolean): boolean {
  const text = (command ?? "").toString();
  if (text.trim().length === 0) {
    return false;
  }

  try {
    const terminal = resolveTerminal();
    terminal.show(true);
    // The second argument (addNewLine) decides whether the command is executed.
    terminal.sendText(text, execute);
    return true;
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    vscode.window.showErrorMessage(
      vscode.l10n.t("Could not send the command to the terminal: {0}", detail)
    );
    return false;
  }
}

/** Applies the user's configured default action (paste or run). */
export function runDefaultAction(command: string): boolean {
  const { clickAction } = getConfig();
  return sendToTerminal(command, clickAction === "run");
}
