# Add a product

1. Add a definition to `src/data/source-products.ts`: slug, category, frame shape, material, dimensions, face-shape suggestions and at least two color variants.
2. Run `pnpm assets:generate`. This creates frame, product and thumbnail WebP files and rewrites `src/data/catalog.generated.json` with computed anchors.
3. Review `docs/eyewear-contact-sheet.png` and check product detail / shop routes locally.
4. Set the production business name, currency, site URL and WhatsApp number with the `NEXT_PUBLIC_*` environment variables.

Prices are integer amounts in the configured currency's minor-unit convention used by this starter catalog (whole NGN units).
