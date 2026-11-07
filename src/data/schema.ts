import { z } from "zod";
export const variantSchema = z.object({
  id: z.string(),
  colorName: z.string(),
  swatchHex: z.string(),
  frameImage: z.string(),
  productImage: z.string(),
  thumbImage: z.string(),
  templeColorHex: z.string(),
  lensTint: z.object({ hex: z.string(), opacity: z.number() }).optional(),
  anchors: z.object({
    leftLensCenterPx: z.tuple([z.number(), z.number()]),
    rightLensCenterPx: z.tuple([z.number(), z.number()]),
    bridgeCenterPx: z.tuple([z.number(), z.number()]),
    imageSizePx: z.tuple([z.number(), z.number()]),
  }),
});
export const productSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  category: z.enum(["sunglasses", "optical"]),
  shape: z.string(),
  material: z.enum(["metal", "acetate", "titanium", "mixed"]),
  price: z.number(),
  inStock: z.boolean(),
  featured: z.boolean(),
  suitsFaceShapes: z.array(z.string()),
  dims: z.object({
    frameWidthMm: z.number(),
    lensWidthMm: z.number(),
    lensHeightMm: z.number(),
    bridgeMm: z.number(),
    templeLengthMm: z.number(),
  }),
  variants: z.array(variantSchema),
});
export type Product = z.infer<typeof productSchema>;
export type Variant = z.infer<typeof variantSchema>;
