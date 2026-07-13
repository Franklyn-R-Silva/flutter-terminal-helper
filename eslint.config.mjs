// eslint.config.mjs
// Flat ESLint config for the extension source (TypeScript).
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: ["out/**", "dist/**", "node_modules/**", ".vscode-test/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.ts"],
  })),
  {
    files: ["src/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      eqeqeq: ["error", "always", { null: "ignore" }],
      curly: "error",
      "no-throw-literal": "error",
    },
  },
  // Node scripts (build tooling) run in CommonJS with Node globals.
  {
    files: ["scripts/**/*.js", "*.mjs"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
      },
    },
  },
  // Mocha TDD globals for the test suite.
  {
    files: ["src/test/**/*.ts"],
    languageOptions: {
      globals: {
        suite: "readonly",
        test: "readonly",
        suiteSetup: "readonly",
        suiteTeardown: "readonly",
        setup: "readonly",
        teardown: "readonly",
        __dirname: "readonly",
      },
    },
  },
  prettier
);
