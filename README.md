<div align="center">

<img src="images/icon.png" width="96" alt="Flutter Terminal Helper" />

# Flutter Terminal Helper

**Categorized Flutter & Dart CLI commands in your sidebar. Click to paste or run.**

[![CI](https://github.com/Franklyn-R-Silva/flutter-terminal-helper/actions/workflows/ci.yml/badge.svg)](https://github.com/Franklyn-R-Silva/flutter-terminal-helper/actions/workflows/ci.yml)
![License](https://img.shields.io/badge/license-MIT-green)
![VS Code](https://img.shields.io/badge/VS%20Code-1.80+-007ACC)
[![Open VSX](https://img.shields.io/open-vsx/v/Franklyn-R-Silva/flutter-terminal-helper?label=Open%20VSX&color=a60ee5)](https://open-vsx.org/extension/Franklyn-R-Silva/flutter-terminal-helper)
[![Open VSX downloads](https://img.shields.io/open-vsx/dt/Franklyn-R-Silva/flutter-terminal-helper?label=downloads)](https://open-vsx.org/extension/Franklyn-R-Silva/flutter-terminal-helper)

</div>

<!--
## Preview

Add a short screen recording / screenshots here — extensions with a visual
preview convert far better on the Marketplace. Drop the files in `images/` and
uncomment:

![Flutter Terminal Helper in action](images/demo.gif)
-->

A lightweight sidebar for Flutter and Dart developers. Browse the most-used CLI
commands grouped by category and send them to your terminal with a single click —
no need to memorize flags or retype long commands.

> The extension UI is localized in **English** and **Portuguese (pt-BR)** and follows
> your editor's display language. This documentation is in English.

## Features

- **Sidebar TreeView** — commands grouped into categories (Flutter, Dart, FVM,
  Firebase, Supabase, Melos, GetX, …).
- **Search** 🔍 — a magnifying-glass button (**Ctrl+Alt+F**) opens a searchable
  list of every command; pick one to paste or run it.
- **Favorites** ⭐ — star commands to pin them to the top of the sidebar.
- **Recent** 🕘 — the commands you use are remembered automatically.
- **Argument prompts** — commands like `flutter pub add` ask you for the value.
- **FVM aware** — optionally run `flutter`/`dart` through `fvm`.
- **Click to paste or run** — clicking a command pastes it into the terminal for
  review (default) or runs it immediately, depending on your settings.
- **Inline actions** — each command has ▶ *run* and ⧉ *copy to clipboard* buttons.
- **Dedicated terminal** — the extension reuses a single named terminal instead of
  cluttering your workspace with new ones.
- **Localized** — English and Portuguese (pt-BR) UI, following your editor language.
- **Resilient** — loading state, guarded actions and localized error messages; a
  malformed command never breaks the sidebar.
- **Lightweight** — a single ~20 KB bundle with no runtime dependencies that only
  activates when you open the sidebar or search. Flutter/Dart are only needed to
  actually run the commands.
- **Workspace Trust aware** — an untrusted folder can't inject commands into the
  sidebar (see [Security](#security)).

## Command categories

| Category | Examples |
| --- | --- |
| 🧹 Cleaning & Dependencies | `flutter clean`, `flutter pub get`, `flutter pub add` |
| 🏗️ Build | `flutter build apk`, `appbundle`, `ipa`, `web`, `windows`, … |
| ▶️ Run | `flutter run`, `-d chrome`, `--release`, `--profile` |
| 📱 Devices | `flutter devices`, `flutter emulators`, `flutter attach` |
| 🧪 Test & Analyze | `flutter test`, `flutter analyze`, `dart fix --apply` |
| 🧰 Configuration | `flutter doctor`, `flutter upgrade`, `flutter channel` |
| 🎯 Dart | `dart run`, `dart analyze`, `dart compile` |
| 📦 Project | `flutter create`, `--platforms=…` |
| ⚙️ Code Generation | `build_runner build`, `gen-l10n` |
| 🔥 Firebase | `flutterfire configure`, `firebase deploy` |
| 🧭 FVM | `fvm install`, `fvm use`, `fvm list` |
| 🔍 Info | `flutter --version`, `dart --version` |
| 🟢 Supabase | `supabase start`, `db push`, `functions deploy` |
| 📦 Melos | `melos bootstrap`, `melos run`, `melos publish` |
| 🧩 GetX & Codegen | `get create page:`, `build_runner watch` |

## Installation

### From a `.vsix` file (works everywhere)

1. Download `flutter-terminal-helper-<version>.vsix` from the
   [Releases](https://github.com/Franklyn-R-Silva/flutter-terminal-helper/releases) page.
2. In your editor, open the Command Palette and run **Extensions: Install from VSIX…**,
   then select the file.

### From Open VSX (Antigravity, Windsurf, Cursor, VSCodium)

Antigravity and other VS Code-based editors use the
[Open VSX Registry](https://open-vsx.org). Search for **Flutter Terminal Helper**
in the Extensions view and click **Install**, or open its
[Open VSX page](https://open-vsx.org/extension/Franklyn-R-Silva/flutter-terminal-helper).

### From source

```bash
git clone https://github.com/Franklyn-R-Silva/flutter-terminal-helper.git
cd flutter-terminal-helper
npm install
npm run compile
# Press F5 in VS Code to launch an Extension Development Host
```

### Development scripts

| Script | What it does |
| --- | --- |
| `npm run compile` / `npm run watch` | Type-check and emit to `out/` (used by F5 debugging). |
| `npm run check-types` | Type-check only (no emit). |
| `npm run lint` | ESLint over the whole project. |
| `npm run format` | Format the code with Prettier. |
| `npm test` | Run the unit + integration test suite in a real VS Code instance. |
| `npm run package:build` | Bundle + minify the extension with esbuild into `dist/`. |
| `npm run package` | Produce a `.vsix` for distribution. |

### Releasing

Releases are automated by [`.github/workflows/release.yml`](.github/workflows/release.yml).
To cut a version:

```bash
npm run version:minor    # bumps package.json + creates the vX.Y.Z tag
git push --follow-tags   # pushes the commit and the tag
```

Pushing the tag builds and tests the extension, then a separate tag-only job
publishes a **GitHub Release with the `.vsix` attached**, so any specific version can be downloaded from the
[Releases](https://github.com/Franklyn-R-Silva/flutter-terminal-helper/releases)
page. Add these repository secrets to also auto-publish:

| Secret | Enables |
| --- | --- |
| `OVSX_PAT` | Publishing to the Open VSX Registry (`ovsx publish`). |
| `VSCE_PAT` | Publishing to the VS Code Marketplace (`vsce publish`). |

Without those secrets the publish steps are skipped — the GitHub Release is
still created.

## Usage

1. Click the **Flutter Helper** icon in the Activity Bar.
2. Expand a category and click a command.
3. By default the command is **pasted** into the terminal so you can review it —
   press <kbd>Enter</kbd> to run. Use the inline ▶ button to run immediately, or ⧉ to copy.

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `flutterHelper.clickAction` | `paste` | Action when clicking a command: `paste` (review first) or `run` (execute immediately). |
| `flutterHelper.terminalName` | `Flutter` | Name of the dedicated terminal used by the extension. |
| `flutterHelper.reuseTerminal` | `true` | Reuse the dedicated terminal instead of creating a new one each time. |
| `flutterHelper.customCommands` | `[]` | Your own commands, shown in a **⭐ Custom Commands** category (see below). |
| `flutterHelper.promptForArguments` | `true` | Ask for a value when a command expects an argument (e.g. `flutter pub add`). |
| `flutterHelper.useFvm` | `auto` | Run `flutter`/`dart` through FVM: `auto` (detect `.fvmrc`), `on`, or `off`. |
| `flutterHelper.recentLimit` | `8` | How many recent commands to keep in the 🕘 Recent category (`0` disables it). |

### Custom commands

Add your own frequently-used commands to the sidebar via
`flutterHelper.customCommands` in your `settings.json`:

```jsonc
"flutterHelper.customCommands": [
  { "label": "Build prod", "command": "flutter build apk --flavor prod -t lib/main_prod.dart" },
  { "label": "Gen + Run", "command": "dart run build_runner build -d && flutter run", "description": "Codegen then run" }
]
```

Each entry needs a `label` and a `command`; `description` is optional. The
sidebar updates as soon as you save the setting.

> **Workspace Trust:** custom commands (and `clickAction`) defined in a folder's
> `.vscode/settings.json` only apply once you trust that folder. In Restricted
> Mode only your user settings are used, so a cloned repo can't make a click run
> its own commands.

## Security

- Honors [Workspace Trust](https://code.visualstudio.com/docs/editor/workspace-trust):
  in Restricted Mode, `flutterHelper.customCommands` and `flutterHelper.clickAction`
  from a folder's settings are ignored.
- Never runs anything on its own: commands are only sent to the terminal when you
  click them, and by default they are pasted for review, not executed.
- No telemetry and no network access.

Found a vulnerability? Please report it privately — see [SECURITY.md](SECURITY.md).

## Requirements

- VS Code (or a compatible fork like Antigravity, Windsurf, Cursor, VSCodium) **1.80.0+**.

## Contributing

Contributions are welcome. Adding a command is usually a one-line change in
[`src/data/flutter_commands_categorized.ts`](src/data/flutter_commands_categorized.ts).
See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

[MIT](LICENSE) © Franklyn R. Silva
