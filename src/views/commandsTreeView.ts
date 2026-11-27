// src/views/commandsTreeView.ts
// =======================================
// TreeView provider for the categorized Flutter commands.
// Handles loading state, error state and fault tolerance, localizes all
// user-facing strings via vscode.l10n, and surfaces dynamic Favorites and
// Recent categories backed by persistent stores.
// =======================================

import * as vscode from "vscode";
import {
  type CommandCategory,
  type FlutterCommand,
} from "../data/flutter_commands_categorized";
import { loadCommandCategories } from "../data/commandsRepository";
import { runDefaultAction, sendToTerminal } from "../terminal/terminalManager";
import { FavoritesStore, RecentStore } from "../state/stores";

type TreeChange = CommandItem | undefined | null | void;

/** English keys (localized in CommandItem) for the dynamic categories. */
export const FAVORITES_CATEGORY_NAME = "⭐ Favorites";
export const RECENT_CATEGORY_NAME = "🕘 Recent";

export class FlutterCommandsProvider
  implements vscode.TreeDataProvider<CommandItem>, vscode.Disposable
{
  private readonly _onDidChangeTreeData = new vscode.EventEmitter<TreeChange>();
  readonly onDidChangeTreeData: vscode.Event<TreeChange> =
    this._onDidChangeTreeData.event;

  private categories: CommandCategory[] = [];
  private isLoading = false;
  private loadError: string | undefined;
  private treeView?: vscode.TreeView<CommandItem>;
  // Monotonic token so a slow load can't overwrite a newer one (double refresh).
  private loadToken = 0;

  constructor(
    private readonly favorites: FavoritesStore,
    private readonly recent: RecentStore
  ) {}

  /** Wires the TreeView so the provider can update its header message. */
  attach(treeView: vscode.TreeView<CommandItem>): void {
    this.treeView = treeView;
  }

  /** (Re)loads the catalog with a loading state and error handling. */
  async load(): Promise<void> {
    const token = ++this.loadToken;
    this.isLoading = true;
    this.loadError = undefined;
    this.updateMessage();
    this._onDidChangeTreeData.fire();

    try {
      const customCommands = vscode.workspace
        .getConfiguration("flutterHelper")
        .get<unknown[]>("customCommands", []);
      const categories = await vscode.window.withProgress(
        { location: { viewId: "flutterCommands" } },
        () => loadCommandCategories(customCommands)
      );
      // A newer load() started while we awaited: discard this stale result.
      if (token !== this.loadToken) {
        return;
      }
      this.categories = categories;
    } catch (err) {
      if (token !== this.loadToken) {
        return;
      }
      this.categories = [];
      this.loadError = err instanceof Error ? err.message : String(err);
    } finally {
      if (token === this.loadToken) {
        this.isLoading = false;
        this.updateMessage();
        this._onDidChangeTreeData.fire();
      }
    }
  }

  dispose(): void {
    this._onDidChangeTreeData.dispose();
  }

  refresh(): void {
    void this.load();
  }

  /** Re-renders Favorites/Recent without reloading the catalog (no loading flash). */
  update(): void {
    this._onDidChangeTreeData.fire();
  }

  private updateMessage(): void {
    if (!this.treeView) {
      return;
    }
    if (this.isLoading) {
      this.treeView.message = vscode.l10n.t("Loading commands…");
    } else if (this.loadError) {
      this.treeView.message = vscode.l10n.t(
        "Could not load the commands. Use refresh to try again."
      );
    } else if (this.categories.length === 0) {
      this.treeView.message = vscode.l10n.t("No commands available.");
    } else {
      this.treeView.message = undefined;
    }
  }

  getTreeItem(element: CommandItem): vscode.TreeItem {
    return element;
  }

  /** Built-in + custom categories, with Favorites/Recent prepended. */
  private rootCategories(): {
    category: CommandCategory;
    kind: CategoryKind;
  }[] {
    const roots: { category: CommandCategory; kind: CategoryKind }[] = [];

    const favorites = this.favorites.list();
    if (favorites.length > 0) {
      roots.push({
        category: {
          name: FAVORITES_CATEGORY_NAME,
          icon: "star-full",
          commands: favorites,
        },
        kind: "favorites",
      });
    }

    const recent = this.recent.list();
    if (recent.length > 0) {
      roots.push({
        category: {
          name: RECENT_CATEGORY_NAME,
          icon: "history",
          commands: recent,
        },
        kind: "recent",
      });
    }

    for (const category of this.categories) {
      roots.push({ category, kind: "normal" });
    }
    return roots;
  }

  getChildren(element?: CommandItem): Thenable<CommandItem[]> {
    // While loading or on error, keep the tree empty (message is shown instead).
    if (this.isLoading || this.loadError) {
      return Promise.resolve([]);
    }

    // Root level: categories.
    if (!element) {
      return Promise.resolve(
        this.rootCategories().map(({ category, kind }) =>
          CommandItem.category(category, kind)
        )
      );
    }

    // Inside a category: its commands.
    if (element.category) {
      return Promise.resolve(
        element.category.commands.map((cmd) =>
          CommandItem.command(cmd, this.favorites.has(cmd.command))
        )
      );
    }

    return Promise.resolve([]);
  }
}

type CategoryKind = "normal" | "favorites" | "recent";

class CommandItem extends vscode.TreeItem {
  private constructor(
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly category?: CommandCategory,
    public readonly cmd?: FlutterCommand
  ) {
    super(label, collapsibleState);
  }

  /** The raw command string, for handlers that only need the text. */
  get commandText(): string | undefined {
    return this.cmd?.command;
  }

  static category(category: CommandCategory, kind: CategoryKind): CommandItem {
    const item = new CommandItem(
      vscode.l10n.t(category.name),
      vscode.TreeItemCollapsibleState.Collapsed,
      category
    );
    item.iconPath = new vscode.ThemeIcon(category.icon);
    item.contextValue =
      kind === "recent"
        ? "recentCategory"
        : kind === "favorites"
          ? "favoritesCategory"
          : "category";
    item.tooltip = vscode.l10n.t("{0} command(s)", category.commands.length);
    return item;
  }

  static command(cmd: FlutterCommand, isFavorite: boolean): CommandItem {
    const description = vscode.l10n.t(cmd.description);
    const item = new CommandItem(
      cmd.label,
      vscode.TreeItemCollapsibleState.None,
      undefined,
      cmd
    );
    item.description = cmd.command.trim();
    // Labels/commands can come from workspace settings: escape, never render as markdown.
    item.tooltip = new vscode.MarkdownString()
      .appendText(cmd.label)
      .appendMarkdown("\n\n")
      .appendText(description)
      .appendCodeblock(cmd.command.trim(), "shell");
    item.iconPath = new vscode.ThemeIcon(isFavorite ? "star-full" : "terminal");
    item.contextValue = isFavorite ? "commandFavorite" : "command";
    // Clicking runs the configured default action (paste or run).
    item.command = {
      command: "flutterHelper.defaultAction",
      title: "Flutter Helper",
      arguments: [item],
    };
    return item;
  }
}

/** Extracts the command string from a tree item or a raw string argument. */
function resolveCommand(arg: unknown): string | undefined {
  if (typeof arg === "string") {
    return arg;
  }
  if (arg instanceof CommandItem) {
    return arg.commandText;
  }
  return undefined;
}

/** Extracts a full command object from a tree item (for favorites/recents). */
function resolveCommandObject(arg: unknown): FlutterCommand | undefined {
  if (arg instanceof CommandItem && arg.cmd) {
    return arg.cmd;
  }
  const command = resolveCommand(arg);
  return command ? { label: command, command, description: "" } : undefined;
}

export function registerCommandsTreeView(
  context: vscode.ExtensionContext,
  favorites: FavoritesStore,
  recent: RecentStore
) {
  const provider = new FlutterCommandsProvider(favorites, recent);
  const treeView = vscode.window.createTreeView("flutterCommands", {
    treeDataProvider: provider,
    showCollapseAll: true,
  });
  provider.attach(treeView);

  // Wraps handlers so a failing command never crashes the extension host.
  const register = (
    id: string,
    handler: (arg: unknown) => void | Promise<void>
  ) =>
    context.subscriptions.push(
      vscode.commands.registerCommand(id, async (arg: unknown) => {
        try {
          await handler(arg);
        } catch (err) {
          const detail = err instanceof Error ? err.message : String(err);
          vscode.window.showErrorMessage(
            vscode.l10n.t("Flutter Helper: the action failed. {0}", detail)
          );
        }
      })
    );

  // Records a successful send in the recent list (best-effort).
  const recordRecent = async (arg: unknown, sent: boolean) => {
    const cmd = resolveCommandObject(arg);
    if (sent && cmd) {
      await recent.record(cmd);
      provider.update();
    }
  };

  register("flutterHelper.defaultAction", async (arg) => {
    const command = resolveCommand(arg);
    if (command) {
      await recordRecent(arg, await runDefaultAction(command));
    }
  });

  register("flutterHelper.runFromTree", async (arg) => {
    const command = resolveCommand(arg);
    if (command) {
      await recordRecent(arg, await sendToTerminal(command, true));
    }
  });

  register("flutterHelper.pasteFromTree", async (arg) => {
    const command = resolveCommand(arg);
    if (command) {
      await recordRecent(arg, await sendToTerminal(command, false));
    }
  });

  register("flutterHelper.copyCommand", async (arg) => {
    const command = resolveCommand(arg);
    if (command) {
      await vscode.env.clipboard.writeText(command.trim());
      vscode.window.setStatusBarMessage(
        vscode.l10n.t("$(copy) Command copied"),
        2000
      );
    }
  });

  register("flutterHelper.addFavorite", async (arg) => {
    const cmd = resolveCommandObject(arg);
    if (cmd) {
      await favorites.toggle(cmd);
      provider.update();
    }
  });

  register("flutterHelper.removeFavorite", async (arg) => {
    const command = resolveCommand(arg);
    if (command) {
      await favorites.remove(command);
      provider.update();
    }
  });

  register("flutterHelper.clearRecent", async () => {
    await recent.clear();
    provider.update();
  });

  register("flutterHelper.refreshCommands", () => provider.refresh());

  // Magnifying-glass search: flatten every command into a searchable picker.
  register("flutterHelper.searchCommands", async () => {
    const customCommands = vscode.workspace
      .getConfiguration("flutterHelper")
      .get<unknown[]>("customCommands", []);
    const categories = await loadCommandCategories(customCommands);
    const items = categories.flatMap((cat) =>
      cat.commands.map((cmd) => ({
        label: cmd.label,
        description: cmd.command.trim(),
        detail: `${vscode.l10n.t(cat.name)} — ${vscode.l10n.t(cmd.description)}`,
        cmd,
      }))
    );
    const picked = await vscode.window.showQuickPick(items, {
      placeHolder: vscode.l10n.t("Search Flutter commands…"),
      matchOnDescription: true,
      matchOnDetail: true,
    });
    if (picked && (await runDefaultAction(picked.cmd.command))) {
      await recent.record(picked.cmd);
      provider.update();
    }
  });

  // Reload when the user edits their custom commands so the sidebar updates.
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("flutterHelper.customCommands")) {
        provider.refresh();
      } else if (e.affectsConfiguration("flutterHelper.recentLimit")) {
        provider.update();
      }
    })
  );

  context.subscriptions.push(treeView, provider);

  // Initial load (async, with loading state).
  void provider.load();
}
