# Security Policy

## Supported Versions

Currently supported versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.5.x   | :white_check_mark: |
| < 0.5   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within Flutter Terminal Helper, please report it privately through
[GitHub's private vulnerability reporting](https://github.com/Franklyn-R-Silva/flutter-terminal-helper/security/advisories/new)
or by email to **franklyn.dev.mobile@gmail.com**.

**Please do not open a public issue for security vulnerabilities.**

### What to Include

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Any suggested fixes (if available)

### What to Expect

- Acknowledgment of your report within 48 hours
- Regular updates on the progress of fixing the vulnerability
- Credit for the discovery (if desired) when the fix is published

## Security Best Practices

This extension:

- Does not collect or transmit any user data
- Does not access external services
- Only interacts with the local VSCode terminal
- Honors [Workspace Trust](https://code.visualstudio.com/docs/editor/workspace-trust): in Restricted Mode,
  `flutterHelper.customCommands` and `flutterHelper.clickAction` from workspace settings are ignored, so an
  untrusted folder cannot make a click run its own commands
- Ships no runtime dependencies (a single bundled file built against the VS Code API)
- All code is open source and can be reviewed

## Scope

This security policy applies to:

- The extension code in this repository
- Published versions on the VSCode Marketplace

Out of scope:

- VSCode itself
- Third-party dependencies (report to their respective projects)
- User's local environment or terminal commands

Thank you for helping keep Flutter Terminal Helper secure! 🔒
