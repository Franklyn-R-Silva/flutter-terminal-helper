// src/terminal/terminalManager.ts
// =======================================
// Manages the terminal used by the extension.
// Reuses a dedicated terminal (by name) when possible and respects the
// user settings (flutterHelper.*). Before sending, it may prompt for a
// trailing argument and rewrite `flutter`/`dart` to run under FVM. All
// operations are fault tolerant: failures are reported to the caller.
// =======================================

import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export type FvmMode = "auto" | "on" | "off";

interface HelperConfig {
  terminalName: string;
  reuseTerminal: boolean;
  clickAction: "paste" | "run";
  useFvm: FvmMode;
  promptForArguments: boolean;
}

function getConfig(): HelperConfig {
  const cfg = vscode.workspace.getConfiguration("flutterHelper");
  return {
    terminalName: cfg.get<string>("terminalName", "Flutter") || "Flutter",
    reuseTerminal: cfg.get<boolean>("reuseTerminal", true),
    clickAction: cfg.get<"paste" | "run">("clickAction", "paste"),
    useFvm: cfg.get<FvmMode>("useFvm", "auto"),
    promptForArguments: cfg.get<boolean>("promptForArguments", true),
  };
}

/**
 * A command "needs an argument" when it ends with whitespace — the catalog
 * convention for entries the user must complete (e.g. `flutter pub add `).
 */
export function needsArgument(command: string): boolean {
  return (
    command.trim().length > 0 && command.length !== command.trimEnd().length
  );
}

/**
 * Rewrites leading `flutter`/`dart` tokens (including after `&&`, `;`, `|`) to
 * run under FVM. Other tools (supabase, firebase, melos, get…) are untouched.
 * Pure so it can be unit-tested without the VS Code API.
 */
export function applyFvm(
  command: string,
  mode: FvmMode,
  isFvmProject: boolean
): string {
  const enabled = mode === "on" || (mode === "auto" && isFvmProject);
  if (!enabled) {
    return command;
  }
  return command.replace(
    /(^|&&|;|\|)(\s*)(flutter|dart)(\s|$)/g,
    (_m, boundary, pre, tool, post) => `${boundary}${pre}fvm ${tool}${post}`
  );
}

/** True when any open workspace folder looks like an FVM project. */
function isFvmProject(): boolean {
  const folders = vscode.workspace.workspaceFolders ?? [];
  return folders.some((f) => {
    const root = f.uri.fsPath;
    return (
      fs.existsSync(path.join(root, ".fvmrc")) ||
      fs.existsSync(path.join(root, ".fvm"))
    );
  });
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
 * run (Enter) or just pasted for review. May prompt for an argument first.
 * Returns false on failure or when the user cancels the argument prompt.
 */
export async function sendToTerminal(
  command: string,
  execute: boolean
): Promise<boolean> {
  let text = (command ?? "").toString();
  if (text.trim().length === 0) {
    return false;
  }

  const { useFvm, promptForArguments } = getConfig();

  if (promptForArguments && needsArgument(text)) {
    const base = text.trimEnd();
    const value = await vscode.window.showInputBox({
      prompt: vscode.l10n.t("Value for: {0}", base),
      placeHolder: vscode.l10n.t("Type an argument (leave empty to skip)"),
    });
    if (value === undefined) {
      return false; // cancelled
    }
    text = value.trim().length > 0 ? `${base} ${value.trim()}` : base;
  }

  text = applyFvm(text, useFvm, isFvmProject());

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
export async function runDefaultAction(command: string): Promise<boolean> {
  const { clickAction } = getConfig();
  return sendToTerminal(command, clickAction === "run");
}
