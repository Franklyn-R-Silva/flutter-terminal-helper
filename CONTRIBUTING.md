# Contributing to Flutter Terminal Helper

First off, thank you for considering contributing to Flutter Terminal Helper! 🎉

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Note your VSCode version and OS**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List some examples of how it would be used**

### Adding New Flutter Commands

To add new Flutter/Dart commands to the sidebar:

1. Fork the repository
2. Edit `src/data/flutter_commands_categorized.ts`
3. Add your command to the `commands` array of the relevant category
4. Test your changes locally
5. Submit a pull request

Example:

```typescript
{
  label: "Your Command",
  command: "flutter your-command",
  description: "What the command does, in English",
},
```

The description is the English source string. Add its Portuguese (pt-BR)
translation to `l10n/bundle.l10n.pt-br.json`; the localization coverage test
fails otherwise. End `command` with a space if it needs a trailing argument —
the user is then prompted for it.

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the code style
3. **Test your changes** by running the same checks as CI:
   ```bash
   npm run check-types   # TypeScript strict mode
   npm run lint          # ESLint, zero warnings allowed
   npm run format:check  # Prettier
   npm test              # unit + integration tests in a real VS Code
   ```
   If you add a command, its description also needs a Portuguese (pt-BR)
   translation in `l10n/bundle.l10n.pt-br.json` — the localization coverage
   test will fail otherwise.
4. **Update documentation** if needed (README.md, CHANGELOG.md)
5. **Commit your changes** with a clear commit message
6. **Push to your fork** and submit a pull request

#### Pull Request Guidelines

- Use a clear and descriptive title
- Describe what changes you made and why
- Reference any related issues
- Keep changes focused - one feature/fix per PR
- **New behavior and bug fixes come with a test** in `src/test/` (pure logic as
  unit tests; anything that needs the VS Code API in `extension.test.ts`)
- Ensure all CI checks pass: type-check, lint (zero warnings), format and tests

### Code Style

- Use TypeScript strict mode
- Follow existing code formatting
- Add comments for complex logic
- Use meaningful variable and function names
- Keep functions small and focused

### Development Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Franklyn-R-Silva/flutter-terminal-helper.git
   cd flutter-terminal-helper
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Compile the code:**

   ```bash
   npm run compile
   ```

4. **Test the extension:**

   - Press `F5` in VSCode
   - A new Extension Development Host window will open
   - Test your changes there

5. **Watch mode for development:**
   ```bash
   npm run watch
   ```

### Development scripts

| Script | What it does |
| --- | --- |
| `npm run compile` / `npm run watch` | Type-check and emit to `out/` (used by F5 debugging and tests). |
| `npm run check-types` | Type-check only (no emit). |
| `npm run lint` | ESLint over the whole project; fails on any warning. |
| `npm run format` / `format:check` | Format with Prettier / verify formatting. |
| `npm test` | Unit + integration tests in a real VS Code instance (`xvfb-run -a npm test` on headless Linux). |
| `npm run package:build` | Bundle + minify the extension with esbuild into `dist/`. |
| `npm run package` | Produce a `.vsix`. |

### Releasing (maintainers)

Versions follow [Semantic Versioning](https://semver.org/). Move the
`[Unreleased]` notes in `CHANGELOG.md` into a dated section, then:

```bash
npm run version:minor    # or version:patch / version:major — bumps and tags vX.Y.Z
git push --follow-tags
```

The tag triggers [`release.yml`](.github/workflows/release.yml): it builds and
tests the extension, creates a GitHub Release with the `.vsix`, and publishes to
Open VSX through **trusted publishing** (OIDC — no stored token; registered on
open-vsx.org for `release.yml`). Publishing to the VS Code Marketplace runs only
when a `VSCE_PAT` repository secret exists.

## 📝 Project Structure

```
flutter-terminal-helper/
├── src/
│   ├── data/              # Command database (typed categories)
│   ├── terminal/          # Dedicated-terminal handling
│   ├── views/             # Sidebar TreeView + command registration
│   └── extension.ts       # Main entry point
├── images/                # Icon artwork
├── package.json           # Extension manifest
├── tsconfig.json          # TypeScript configuration
└── README.md              # Documentation
```

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for the full layout.

## 🎯 Areas We Need Help With

- Adding more Flutter/Dart commands
- Improving command descriptions
- Adding command categories/filtering
- Performance optimizations
- Better error handling
- Documentation improvements
- Translations (though code stays in English)
- Bug fixes

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

### Our Standards

**Positive behavior includes:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior includes:**

- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## 🎓 First Time Contributing?

Never contributed to open source before? Here are some resources:

- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [First Timers Only](https://www.firsttimersonly.com/)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)

## 💬 Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort! ❤️
