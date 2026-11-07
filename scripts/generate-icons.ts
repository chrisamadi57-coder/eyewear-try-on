import path from "node:path";
import sharp from "sharp";

async function main() {
  const root = process.cwd();
  const source = path.join(root, "public/icons/icon.svg");
  for (const size of [192, 512]) {
    await sharp(source)
      .resize(size, size)
      .png()
      .toFile(path.join(root, `public/icons/icon-${size}.png`));
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
