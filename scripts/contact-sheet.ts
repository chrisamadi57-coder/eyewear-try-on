import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { products } from "../src/data/source-products";
async function main() {
  const root = process.cwd();
  const tileW = 320,
    tileH = 290,
    cols = 4,
    rows = Math.ceil(products.length / cols);
  const layers = [];
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const image = path.join(
      root,
      "public/eyewear/products",
      `${p.slug}-${p.variants[0].id}.webp`,
    );
    const svg = Buffer.from(
      `<svg width="320" height="40"><rect width="100%" height="100%" fill="#fff"/><text x="16" y="26" font-family="Arial" font-size="16" fill="#222">${i + 1}. ${p.name}</text></svg>`,
    );
    layers.push({
      input: await sharp(image)
        .resize(tileW, tileH - 40, { fit: "contain", background: "#efeff1" })
        .toBuffer(),
      left: (i % cols) * tileW,
      top: Math.floor(i / cols) * tileH,
    });
    layers.push({
      input: svg,
      left: (i % cols) * tileW,
      top: Math.floor(i / cols) * tileH + tileH - 40,
    });
  }
  await mkdir(path.join(root, "docs"), { recursive: true });
  await sharp({
    create: {
      width: tileW * cols,
      height: tileH * rows,
      channels: 3,
      background: "#eee",
    },
  })
    .composite(layers)
    .png()
    .toFile(path.join(root, "docs/eyewear-contact-sheet.png"));
  console.log("Wrote docs/eyewear-contact-sheet.png");
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
