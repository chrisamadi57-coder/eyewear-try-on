import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { products } from "../src/data/catalog";

describe("generated catalog", () => {
  it("contains 15 or more distinct products with locally generated imagery", () => {
    expect(products.length).toBeGreaterThanOrEqual(15);
    for (const product of products)
      for (const variant of product.variants) {
        for (const asset of [
          variant.frameImage,
          variant.productImage,
          variant.thumbImage,
        ])
          expect(existsSync(path.join(process.cwd(), "public", asset))).toBe(
            true,
          );
        for (const [x, y] of [
          variant.anchors.leftLensCenterPx,
          variant.anchors.rightLensCenterPx,
          variant.anchors.bridgeCenterPx,
        ]) {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(y).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThanOrEqual(variant.anchors.imageSizePx[0]);
          expect(y).toBeLessThanOrEqual(variant.anchors.imageSizePx[1]);
        }
      }
  });
});
