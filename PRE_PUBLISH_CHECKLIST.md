# Pre-Publication Checklist

The manifest is already filled in (publisher `DevFullStack-Franklyn-R-Silva`, icon,
repository URLs). Use this list before each release.

## 1. Sanity checks

- [ ] `npm install` runs cleanly.
- [ ] `npm run compile` succeeds with no errors.
- [ ] `npm run lint` (typecheck) passes.
- [ ] Press <kbd>F5</kbd> and verify in the Extension Development Host:
  - [ ] The **Flutter Helper** view appears in the Activity Bar.
  - [ ] Categories expand and commands are listed.
  - [ ] Clicking a command pastes it into the terminal.
  - [ ] The inline ▶ (run) and ⧉ (copy) actions work.
  - [ ] Settings under `flutterHelper.*` take effect.

## 2. Version bump

```bash
npm run version:patch   # 0.1.0 → 0.1.1
npm run version:minor   # 0.1.0 → 0.2.0
npm run version:major   # 0.1.0 → 1.0.0
```

- [ ] Move the `[Unreleased]` notes into a dated version section in `CHANGELOG.md`.

## 3. Package the `.vsix`

```bash
npm run package         # -> flutter-terminal-helper-<version>.vsix
```

- [ ] Install the `.vsix` locally (**Extensions: Install from VSIX…**) and smoke-test it.

## 4. Publish to Open VSX (Antigravity, Windsurf, Cursor, VSCodium)

Antigravity installs extensions from the [Open VSX Registry](https://open-vsx.org).

1. Create an account at https://open-vsx.org (sign in with GitHub).
2. Create a namespace matching the publisher:
   ```bash
   npx ovsx create-namespace DevFullStack-Franklyn-R-Silva -p <TOKEN>
   ```
3. Publish:
   ```bash
   npx ovsx publish flutter-terminal-helper-<version>.vsix -p <TOKEN>
   # or: OVSX_PAT=<TOKEN> npm run publish:ovsx
   ```

- [ ] Extension is searchable on open-vsx.org.

## 5. (Optional) Publish to the VS Code Marketplace

1. Create an Azure DevOps Personal Access Token with **Marketplace → Manage**.
2. `npx vsce login DevFullStack-Franklyn-R-Silva`
3. `npx vsce publish`

## 6. GitHub release

- [ ] Tag matches the version (`vX.Y.Z`) — `npm version` creates the tag automatically.
- [ ] `git push --follow-tags`
- [ ] Create a GitHub Release, attach the `.vsix`, and copy notes from `CHANGELOG.md`.

## Useful links

- [Open VSX publishing](https://github.com/eclipse/openvsx/wiki/Publishing-Extensions)
- [VS Code publishing guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Extension manifest reference](https://code.visualstudio.com/api/references/extension-manifest)
