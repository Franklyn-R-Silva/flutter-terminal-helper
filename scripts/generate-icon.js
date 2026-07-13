// scripts/generate-icon.js
// =======================================
// Gera o icone PNG 128x128 do marketplace a partir de images/icon.svg.
// Uso: npm run icon
// =======================================

const fs = require("fs");
const path = require("path");

async function main() {
  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    console.error(
      "Dependencia 'sharp' nao encontrada. Rode `npm install` antes de `npm run icon`."
    );
    process.exit(1);
  }

  const root = path.join(__dirname, "..");
  const svgPath = path.join(root, "images", "icon.svg");
  const pngPath = path.join(root, "images", "icon.png");

  const svg = fs.readFileSync(svgPath);
  await sharp(svg, { density: 384 })
    .resize(128, 128, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(pngPath);

  console.log(`Icone gerado: ${pngPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
