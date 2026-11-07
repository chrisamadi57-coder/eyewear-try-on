import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { products as source } from "../src/data/source-products";
const root = process.cwd();
const shapePaths: Record<string, string> = {
  aviator: "M15 25 Q50 5 85 25 L80 65 Q75 93 55 90 Q35 93 25 65 Z",
  wayfarer:
    "M12 24 Q50 10 88 24 L82 62 Q78 86 56 82 L50 77 L44 82 Q22 86 18 62 Z",
  round:
    "M18 45 C18 20 35 12 50 12 C65 12 82 20 82 45 C82 70 65 84 50 84 C35 84 18 70 18 45Z",
  "cat-eye":
    "M12 30 L28 20 Q50 12 72 20 L88 30 L80 62 Q72 82 54 78 Q38 82 27 64Z",
  browline:
    "M15 24 Q50 8 85 24 L79 60 Q74 80 56 78 L50 75 L44 78 Q26 80 21 60Z",
  square: "M17 20 Q50 13 83 20 L81 62 Q79 83 58 83 L42 83 Q21 83 19 62Z",
  rectangle: "M15 27 Q50 20 85 27 L83 61 Q80 76 60 76 L40 76 Q20 76 17 61Z",
  oversized:
    "M10 20 Q50 8 90 20 L86 64 Q80 91 57 87 L50 83 L43 87 Q20 91 14 64Z",
  hexagonal: "M26 15 L74 15 L87 34 L82 66 L68 82 L32 82 L18 66 L13 34Z",
  panto: "M18 28 Q50 10 82 28 L78 58 Q74 83 50 85 Q26 83 22 58Z",
  butterfly:
    "M12 24 Q26 9 43 22 Q50 28 57 22 Q74 9 88 24 L80 62 Q75 85 56 80 L50 75 L44 80 Q25 85 20 62Z",
  shield: "M10 25 Q50 8 90 25 L84 65 Q75 83 50 84 Q25 83 16 65Z",
  "half-rim":
    "M18 25 Q50 16 82 25 L79 57 Q75 80 57 80 L50 76 L43 80 Q25 80 21 57Z",
  rimless:
    "M18 28 Q50 18 82 28 L78 59 Q74 80 57 80 L50 76 L43 80 Q26 80 22 59Z",
  oval: "M15 46 C15 25 30 18 50 18 C70 18 85 25 85 46 C85 67 70 78 50 78 C30 78 15 67 15 46Z",
  navigator:
    "M12 27 Q50 13 88 27 L82 61 Q78 83 56 81 L50 76 L44 81 Q22 83 18 61Z",
};
function svgFor(
  shape: string,
  colors: { rim: string; lens: string },
  product: boolean,
) {
  const pathData = shapePaths[shape] ?? shapePaths.round;
  const eye = (x: number) =>
    `<path d="${pathData}" transform="translate(${x} 0)" fill="${colors.lens}" fill-opacity="${product ? 0.42 : 0.38}" stroke="${colors.rim}" stroke-width="${shape === "rimless" ? 1.2 : 4}" stroke-linejoin="round"/><path d="M${x + 24} 34 Q${x + 50} 22 ${x + 76} 34" fill="none" stroke="white" stroke-opacity=".28" stroke-width="2"/>`;
  const lenses =
    shape === "shield"
      ? `<path d="M12 25 Q100 2 188 25 L177 69 Q162 91 100 92 Q38 91 23 69Z" fill="${colors.lens}" fill-opacity="${product ? 0.42 : 0.38}" stroke="${colors.rim}" stroke-width="4" stroke-linejoin="round"/><path d="M35 35 Q100 18 165 35" fill="none" stroke="white" stroke-opacity=".28" stroke-width="2"/>`
      : `${eye(0)}${eye(100)}<path d="M82 35 Q100 25 118 35 Q124 41 118 45 Q108 39 100 40 Q92 39 82 45 Q76 41 82 35Z" fill="${colors.rim}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="700" viewBox="0 0 200 100"><defs><linearGradient id="lens" x2="0" y2="1"><stop stop-color="${colors.lens}" stop-opacity=".18"/><stop offset="1" stop-color="${colors.lens}" stop-opacity=".5"/></linearGradient><filter id="shadow"><feGaussianBlur stdDeviation="3"/></filter></defs>${product ? '<ellipse cx="100" cy="78" rx="73" ry="8" fill="#000" opacity=".12" filter="url(#shadow)"/>' : ""}${lenses}<path d="M18 28 Q9 27 0 30 L-12 32 M182 28 Q191 27 200 30 L212 32" fill="none" stroke="${colors.rim}" stroke-width="4" stroke-linecap="round"/><path d="M18 28 L-12 24 M182 28 L212 24" stroke="${colors.rim}" stroke-width="3"/></svg>`;
}
async function main() {
  const catalog = [];
  for (const p of source) {
    const variants = [];
    for (const v of p.variants) {
      const stem = `${p.slug}-${v.id}`,
        frame = `/eyewear/frames/${stem}.webp`,
        hero = `/eyewear/products/${stem}.webp`,
        thumb = `/eyewear/thumbs/${stem}.webp`;
      const svg = svgFor(p.shape, { rim: v.rim, lens: v.lens }, false);
      const prod = svgFor(p.shape, { rim: v.rim, lens: v.lens }, true);
      const imageWidth = Math.round((p.dims.frameWidthMm * 10) / 0.85);
      const imageHeight = Math.round(imageWidth / 2);
      await mkdir(path.join(root, "public/eyewear/frames"), {
        recursive: true,
      });
      await mkdir(path.join(root, "public/eyewear/products"), {
        recursive: true,
      });
      await mkdir(path.join(root, "public/eyewear/thumbs"), {
        recursive: true,
      });
      await sharp(Buffer.from(svg))
        .resize(imageWidth, imageHeight)
        .webp({ quality: 92 })
        .toFile(path.join(root, "public", frame));
      const productArt = await sharp(Buffer.from(prod))
        .resize(1400, 680)
        .png()
        .toBuffer();
      await sharp({
        create: {
          width: 1400,
          height: 1400,
          channels: 3,
          background: "#f1f1f3",
        },
      })
        .composite([{ input: productArt, left: 0, top: 360 }])
        .webp({ quality: 88 })
        .toFile(path.join(root, "public", hero));
      await sharp(path.join(root, "public", hero))
        .resize(256, 256, { fit: "contain", background: "#f1f1f3" })
        .webp()
        .toFile(path.join(root, "public", thumb));
      variants.push({
        id: v.id,
        colorName: v.name,
        swatchHex: v.swatch,
        frameImage: frame,
        productImage: hero,
        thumbImage: thumb,
        templeColorHex: v.rim,
        lensTint: {
          hex: v.lens,
          opacity: p.category === "sunglasses" ? 0.42 : 0.08,
        },
        anchors: {
          leftLensCenterPx: [imageWidth * 0.25, imageHeight * 0.5],
          rightLensCenterPx: [imageWidth * 0.75, imageHeight * 0.5],
          bridgeCenterPx: [imageWidth * 0.5, imageHeight * 0.4],
          imageSizePx: [imageWidth, imageHeight],
        },
      });
    }
    catalog.push({ ...p, variants });
  }
  await writeFile(
    path.join(root, "src/data/catalog.generated.json"),
    JSON.stringify(catalog, null, 2),
  );
  console.log(
    `Generated ${catalog.length} products, ${catalog.reduce((n, p) => n + p.variants.length, 0)} variants`,
  );
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
