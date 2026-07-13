# Project Structure

```
flutter-terminal-helper/
│
├── .github/
│   ├── ISSUE_TEMPLATE/                  # Bug / feature / add-command templates
│   ├── PULL_REQUEST_TEMPLATE.md         # PR template
│   └── workflows/
│       └── ci.yml                       # GitHub Actions CI (build + typecheck)
│
├── .vscode/                             # Debug/build config for development
│
├── images/
│   ├── icon.svg                         # Source artwork (marketplace icon)
│   ├── icon.png                         # Generated 128×128 icon (npm run icon)
│   └── activitybar.svg                  # Activity Bar glyph
│
├── scripts/
│   └── generate-icon.js                 # Renders icon.png from icon.svg (sharp)
│
├── src/
│   ├── data/
│   │   ├── flutter_commands_categorized.ts  # Command database (typed categories)
│   │   └── commandsRepository.ts        # Validates/loads the catalog
│   ├── terminal/
│   │   └── terminalManager.ts           # Dedicated-terminal handling
│   ├── views/
│   │   └── commandsTreeView.ts          # Sidebar TreeView + command registration
│   ├── test/                            # Unit + integration tests (Mocha)
│   └── extension.ts                     # Entry point (activate/deactivate)
│
├── out/                                 # tsc output — tests + F5 debugging (generated)
├── dist/                                # esbuild bundle shipped in the .vsix (generated)
│
├── esbuild.mjs                          # Bundler (dist/extension.js)
├── eslint.config.mjs                    # ESLint flat config
├── .vscode-test.mjs                     # VS Code test runner config
├── .prettierrc.json / .editorconfig     # Formatting config
├── .vscodeignore                        # Files excluded from the .vsix package
├── CHANGELOG.md                         # Version history (Keep a Changelog)
├── CONTRIBUTING.md                      # Contribution guidelines
├── LICENSE                              # MIT License
├── package.json                         # Extension manifest
├── README.md                            # Main documentation (English)
├── SECURITY.md                          # Security policy
└── tsconfig.json                        # TypeScript configuration
```

## Key files

| File | Responsibility |
| --- | --- |
| `src/extension.ts` | Activates the extension and registers the sidebar. |
| `src/views/commandsTreeView.ts` | Builds the TreeView and registers the paste/run/copy commands. |
| `src/terminal/terminalManager.ts` | Resolves and reuses the dedicated terminal; applies user settings. |
| `src/data/flutter_commands_categorized.ts` | Typed list of categories and commands — the place to add new commands. |
| `scripts/generate-icon.js` | Regenerates `images/icon.png` from the SVG source. |

## Notes

- The extension UI is in Portuguese (pt-BR); code comments and documentation are in English.
- Adding a command is a one-line change in `flutter_commands_categorized.ts`.
