// .vscode-test.mjs
// Configuration for @vscode/test-cli — runs the compiled test suite
// (out/test/**) inside a real VS Code instance.
import { defineConfig } from "@vscode/test-cli";

export default defineConfig({
  files: "out/test/**/*.test.js",
  version: "stable",
  mocha: {
    ui: "tdd",
    timeout: 20000,
  },
});
