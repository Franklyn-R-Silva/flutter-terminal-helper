# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A VS Code extension ("Flutter Terminal Helper") that adds an Activity Bar sidebar
listing Flutter/Dart CLI commands grouped by category. Clicking a command pastes or
runs it in a dedicated terminal. It targets VS Code 1.80+ and Open VSX–compatible
forks (Antigravity, Windsurf, Cursor, VSCodium).

## Commands

```bash
npm install          # install dev deps
npm run compile      # tsc -p ./  → emits to out/ (tests + F5 debugging)
npm run watch        # incremental tsc during development
npm run check-types  # tsc --noEmit (type-check only)
npm run lint         # ESLint (flat config, typescript-eslint)
npm run format       # Prettier --write  (format:check to verify only)
npm test             # unit + integration tests in a real VS Code instance
npm run package:build # esbuild bundle+minify → dist/extension.js
npm run package      # vsce package --no-dependencies → .vsix
npm run icon         # regenerate images/icon.png from images/icon.svg (sharp)
```

`npm test` (via `@vscode/test-cli`, config in `.vscode-test.mjs`) downloads a VS Code
build and runs `out/test/**/*.test.js` in the extension host. `pretest` builds both `out/`
(tsc) and `dist/` (esbuild) first. To run a single test, use Mocha `.only` or filter with
`--grep`: `npx vscode-test --grep "localization"`. On Linux/CI the host needs a display —
CI wraps it with `xvfb-run`. To debug interactively instead, press **F5**.

CI (`.github/workflows/ci.yml`) runs check-types, lint, format:check, the test suite, and
`.vsix` packaging on Node 20 & 22.

Releases use `npm run version:patch|minor|major` (bumps + tags), then `npm run package`
and `npm run publish:ovsx`.

## Architecture

Data flows one direction: a static catalog → a repository that validates it → a TreeView
that renders it → a terminal manager that acts on the selected command.

- **`src/data/flutter_commands_categorized.ts`** — the command catalog: a typed
  `FLUTTER_COMMAND_CATEGORIES` array of `{ name, icon, commands[] }`. This is the single
  source of data. **Adding/editing a command is a one-line change here** and needs no
  other code changes. `icon` is a [VS Code codicon](https://microsoft.github.io/vscode-codicons/) id.
- **`src/data/commandsRepository.ts`** — `loadCommandCategories()` is the only way the
  UI reads the catalog. It is intentionally `async` (so the source could later come from
  disk/network) and **fault-tolerant**: malformed commands are silently dropped and empty
  categories removed; it throws only when the whole catalog is empty/invalid. Preserve
  this behavior when touching data loading. It also takes an optional `customCommands`
  array (from the `flutterHelper.customCommands` setting, read in `commandsTreeView`) and
  appends them as a trailing **⭐ Custom Commands** category via `buildCustomCategory` — kept
  as a pure parameter so the repository stays testable without the VS Code API.
- **`src/views/commandsTreeView.ts`** — the `TreeDataProvider`, `CommandItem` model, and
  all command registration. Two-level tree: categories → commands. Manages loading/error/
  empty header messages. Every registered command is wrapped by a local `register()` helper
  that catches errors and shows a localized message, so a failing action never crashes the
  extension host. New commands should go through this helper.
- **`src/terminal/terminalManager.ts`** — resolves/reuses the dedicated terminal (by the
  configured name) and sends text. `sendToTerminal(cmd, execute)` (async) — the `execute`
  boolean maps to `terminal.sendText`'s addNewLine (true = run, false = paste for review);
  before sending it may prompt for a trailing argument (`needsArgument`, gated by
  `promptForArguments`) and rewrite `flutter`/`dart` to run under FVM (`applyFvm`, pure +
  unit-tested, driven by `useFvm`). `runDefaultAction()` reads `flutterHelper.clickAction`.
- **`src/state/stores.ts`** — `FavoritesStore` and `RecentStore` over an injected
  `vscode.Memento` (`context.globalState`), kept injectable so they're unit-tested with a
  fake. The tree prepends **⭐ Favorites** / **🕘 Recent** dynamic categories from these;
  `CommandItem` carries the full `FlutterCommand` and a `command`/`commandFavorite`
  contextValue that drives the star toggle menus.
- **`src/extension.ts`** — thin entry point; `activate()` just calls `registerCommandsTreeView`.

**Build pipeline / two output dirs**: `tsc` compiles `src/` → `out/` (used for F5 debugging
and to produce `out/test/**` for the test runner). esbuild bundles `src/extension.ts` →
`dist/extension.js` (single minified file, `vscode` external). The manifest's `main` points
at `dist/`, and only `dist/extension.js` is shipped in the `.vsix` — keep it that way when
touching `.vscodeignore` or the build scripts.

The `package.json` `contributes` block wires everything to the runtime: the view container,
the `flutterCommands` view, the `flutterHelper.*` commands, their menu placement (inline
run/copy buttons + context menu), and the three `flutterHelper.*` settings. Any new command
or setting must be declared there **and** implemented in code.

## Conventions (important)

- **Localization is two separate systems** — keep them in sync when adding user-facing strings:
  1. **Manifest strings** (titles, setting descriptions in `package.json`) use `%key%`
     placeholders resolved from `package.nls.json` (English) and `package.nls.pt-br.json`.
  2. **Runtime strings** in `.ts` files use `vscode.l10n.t("English source")`; the English
     text is the key and Portuguese translations live in `l10n/bundle.l10n.pt-br.json`.
  When you add a `vscode.l10n.t(...)` call or a `%key%`, add the matching pt-br translation.
  The `src/test/l10n.test.ts` coverage test fails if any catalog category name or command
  description lacks a pt-br entry, so a missing translation is caught by `npm test`.
- **Language split**: user-facing documentation is in **English**; extension UI is localized
  (English + pt-BR); code comments are in **Portuguese/English mix per the repo** — match the
  surrounding file. (See the memory note: docs English, UI + comments pt-BR.)
- TypeScript **strict mode** is on (`tsconfig.json`). No runtime dependencies — everything is
  built against `@types/vscode` only.
- Command `label`s are treated as command-like and are **not** localized; `description`s and
  category `name`s **are** localized.
