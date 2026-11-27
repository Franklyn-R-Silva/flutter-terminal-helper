# Changelog

All notable changes to **Flutter Terminal Helper** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.6.0] - 2026-11-27

### Added

- **🧭 FVM** category (`fvm install`, `fvm use`, `fvm list`, `fvm releases`,
  `fvm doctor`) and new commands: `pub upgrade --major-versions`, `pub deps`,
  `pod install` (iOS), `build apk --split-per-abi`, `build web --wasm`,
  `run -d <device>`, `flutter install`, `test --update-goldens`, `dart fix --dry-run`.

### Changed

- The extension now activates only when the sidebar opens or one of its
  commands runs, instead of on every VS Code startup.
- **Launch Emulator** and **Create Project** ask for the emulator ID / project
  name instead of using the hard-coded `Pixel_6` / `my_app`.
- Changing `flutterHelper.recentLimit` applies immediately (no reload).
- Commands that need a sidebar item (run, paste, copy, favorite) are hidden
  from the Command Palette, where they did nothing.

### Fixed

- Starring a command or running one no longer reloads the whole catalog, which
  flashed "Loading commands…" and could collapse the open categories.

### Security

- Supports **Workspace Trust**: in Restricted Mode, `customCommands` and
  `clickAction` from workspace settings are ignored, so an untrusted repo
  can't turn a click into running its own commands.
- Command tooltips render labels as plain text instead of Markdown.
- Release workflow: publish tokens are only visible to a tag-only publish job
  that doesn't run dependency scripts; all Actions pinned by commit SHA;
  Dependabot (grouped, monthly) added.

## [0.5.0] - 2026-07-13

### Added

- **Favorites** ⭐: star any command to pin it to a Favorites category at the top
  of the sidebar (persisted across projects).
- **Recent commands** 🕘: the commands you run/paste are remembered in a Recent
  category (configurable via `flutterHelper.recentLimit`, clearable inline).
- **Argument prompts**: commands that expect a value (those ending with a space,
  e.g. `flutter pub add`) now ask for it via an input box
  (`flutterHelper.promptForArguments`).
- **FVM support**: `flutterHelper.useFvm` (`auto`/`on`/`off`) runs `flutter`/`dart`
  through `fvm`; `auto` detects an `.fvmrc`/`.fvm` project.
- **New categories**: 📦 Melos (monorepo) and 🧩 GetX & Codegen, with pt-BR
  translations.
- **Getting-started walkthrough** and a **Ctrl+Alt+F / Cmd+Alt+F** shortcut for
  the command search; expanded marketplace keywords.

## [0.4.0] - 2026-07-13

### Added

- **Command search** 🔍: a magnifying-glass button in the sidebar title opens a
  searchable quick-pick of every command (built-in and custom); selecting one
  pastes or runs it per your `clickAction` setting.
- **Supabase category** 🟢: Supabase CLI commands (login, init, link, start/stop,
  status, db push/pull/reset, new migration, functions serve/deploy) with
  Portuguese (pt-BR) translations.

## [0.3.0] - 2026-07-13

### Added

- **Custom commands**: add your own Flutter/Dart commands via the
  `flutterHelper.customCommands` setting — they appear in a **⭐ Custom Commands**
  category in the sidebar and update live when you edit the setting. Invalid
  entries are ignored, and the category name is localized (pt-BR).

### Changed

- Changed the extension `publisher` to `Franklyn-R-Silva` (the extension
  identifier is now `Franklyn-R-Silva.flutter-terminal-helper`).

## [0.2.0] - 2026-07-13

### Added

- New commands: `flutter pub cache clean`, `flutter run -d macos`,
  `flutter run -d linux`, `flutter logs`, `dart test`, `flutter precache`,
  `dart devtools`, and `flutter create --template=package/plugin` — with
  Portuguese (pt-BR) translations.
- **Test suite**: unit tests for the command repository, a localization
  coverage test (every category/description must have a pt-BR translation), and
  integration tests that activate the extension inside a real VS Code instance
  (`@vscode/test-cli`). Run with `npm test`.
- **Tooling**: ESLint (flat config) + Prettier + `.editorconfig`, with
  `npm run lint` and `npm run format`.
- **Bundling**: the extension is now bundled and minified with esbuild into a
  single `dist/extension.js`, shrinking the `.vsix` payload.

### Changed

- CI now type-checks, lints, checks formatting, runs the test suite (headless
  via xvfb) and validates `.vsix` packaging.
- **Release workflow**: pushing a `vX.Y.Z` tag builds the extension and creates
  a GitHub Release with the packaged `.vsix` attached, and (when the matching
  secrets are configured) publishes to Open VSX and the VS Code Marketplace.
- Corrected the repository/homepage/issue URLs to the actual GitHub org.

### Fixed

- The dedicated terminal is no longer reused after the user closes it — a closed
  (exited) terminal is now detected and a fresh one is created.
- A rapid double refresh can no longer let a stale catalog load overwrite a
  newer one (load requests are now versioned).
- The tree data provider now disposes its event emitter on deactivation.

## [0.1.0] - 2026-07-12

### Added

- **Localization (i18n)**: full English + Portuguese (pt-BR) UI via `package.nls`
  and `vscode.l10n`. The interface follows the editor's display language.
- **Loading state**: the sidebar shows a progress spinner and "Loading commands…"
  message while the catalog loads (async, refreshable).
- **Error handling & fault tolerance**: every command handler is guarded and reports
  a localized error instead of crashing; malformed catalog entries are dropped, and
  an empty/invalid catalog surfaces a clear message with a refresh hint.
- **Run / Copy actions**: inline ▶ (run) and ⧉ (copy) buttons on every command,
  plus a context menu with paste/run/copy.
- **Settings**: `flutterHelper.clickAction` (paste or run), `flutterHelper.terminalName`,
  and `flutterHelper.reuseTerminal`.
- **Dedicated terminal manager**: reuses a single named terminal instead of creating
  a new one for each command.
- **Extension artwork**: marketplace icon (128×128) and Activity Bar glyph, generated
  from SVG via `npm run icon`.
- New commands: `flutter pub add/remove`, `flutter build aar`, `flutter emulators --create`,
  `dart compile exe/js`, `firebase deploy`, `build_runner clean`, and platform-scoped
  `flutter create`.
- Packaging/publishing scripts for `.vsix` and the Open VSX Registry (`npm run package`,
  `npm run publish:ovsx`) and version bump helpers.

### Changed

- Rewrote the data layer as typed categories with per-category icons, loaded
  through a validating repository.
- UI strings now use English as the source language with Portuguese (pt-BR)
  translations; documentation kept in English.
- Rewrote the README to reflect the actual feature set.
- Command clicks now paste by default (configurable) instead of always pasting.

### Removed

- Dropped the activation pop-up notification.
- Removed documentation claims for features that were never shipped
  (Ctrl+Space autocomplete, shell-file completion, custom terminal).

## [0.0.1] - 2025-11-12

### Added

- Initial release.
- Sidebar TreeView with categorized Flutter and Dart CLI commands.
- One-click paste of a command into the active terminal.

[Unreleased]: https://github.com/Franklyn-R-Silva/flutter-terminal-helper/compare/v0.6.0...HEAD
[0.6.0]: https://github.com/Franklyn-R-Silva/flutter-terminal-helper/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/Franklyn-R-Silva/flutter-terminal-helper/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/Franklyn-R-Silva/flutter-terminal-helper/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/Franklyn-R-Silva/flutter-terminal-helper/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Franklyn-R-Silva/flutter-terminal-helper/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Franklyn-R-Silva/flutter-terminal-helper/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/Franklyn-R-Silva/flutter-terminal-helper/releases/tag/v0.0.1
