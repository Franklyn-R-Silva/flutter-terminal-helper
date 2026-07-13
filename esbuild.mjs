// esbuild.mjs
// =======================================
// Bundles the extension into a single minified dist/extension.js.
// `vscode` is provided by the host at runtime and must stay external.
//   node esbuild.mjs              → dev build (sourcemaps)
//   node esbuild.mjs --production → minified release build
//   node esbuild.mjs --watch      → rebuild on change
// =======================================

import * as esbuild from "esbuild";

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

/** @type {import('esbuild').BuildOptions} */
const options = {
  entryPoints: ["src/extension.ts"],
  bundle: true,
  outfile: "dist/extension.js",
  format: "cjs",
  platform: "node",
  target: "node18",
  external: ["vscode"],
  sourcemap: !production,
  minify: production,
  logLevel: "info",
};

async function run() {
  if (watch) {
    const ctx = await esbuild.context(options);
    await ctx.watch();
    console.log("esbuild: watching for changes…");
  } else {
    await esbuild.build(options);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
