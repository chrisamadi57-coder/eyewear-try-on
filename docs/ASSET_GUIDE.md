# Eyewear assets

`pnpm assets:generate` rasterizes the parametric frame illustrations in `scripts/generate-eyewear.ts` into transparent frame WebP plus neutral-background product and thumbnail WebP files. Anchors are emitted alongside each variant and refer to the generated 1400 × 700 frame coordinates.

## Replacing generated art with product photography

Use a straight-on product photograph on a white or neutral background. Cut out the frame to a transparent PNG, preserve a centered front view, and note the overall physical frame width in millimeters. Configure the input file and measured width in the product source entry, then run `pnpm assets:ingest` after completing the ingestion helper. The current ingestion script is a scaffold; use `assets:generate` to restore the synthetic catalog assets until measurement and anchor review are complete. Avoid stretching manufacturer photos: derive pixel-per-mm from known frame width and measure the lens centers and bridge anchor in the transparent source.

The included images are original synthetic catalog illustrations. Validate colors, lens opacity, symmetry and anchor placement before using them as final sales imagery.
