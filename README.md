# Atelier Eyewear

A mobile-first static eyewear storefront with a local try-on preview and WhatsApp order handoff. No login, backend, payment, or photo upload is used.

## Requirements and setup

- Node.js 20.9 or newer
- pnpm

```sh
pnpm install
Copy-Item .env.example .env.local
pnpm assets:generate
pnpm dev
```

The storefront is available at `http://localhost:3000`. Camera use requires HTTPS in production (localhost is allowed during development). The first camera action shows a privacy notice. Upload is available when camera access is denied or unavailable.

## Business settings

Set these in `.env.local` or the deployment environment:

| Variable                      | Example                | Purpose                           |
| ----------------------------- | ---------------------- | --------------------------------- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `2348165469043`        | Digits only, international format |
| `NEXT_PUBLIC_BUSINESS_NAME`   | `Atelier Eyewear`      | Message greeting and brand        |
| `NEXT_PUBLIC_SITE_URL`        | `https://shop.example` | Product links in order message    |
| `NEXT_PUBLIC_CURRENCY`        | `NGN`                  | ISO currency code                 |
| `NEXT_PUBLIC_LOCALE`          | `en-NG`                | Number/date locale                |

Change product prices and specs in `src/data/source-products.ts`, then regenerate assets and catalog JSON. More detail is in `docs/ADD_A_PRODUCT.md`.

## Build and deploy

`pnpm build` creates a static site in `out/`. Publish that directory to Cloudflare Pages or Netlify. Use the static export preset, set the environment variables above at build time, and serve the site over HTTPS so browsers can grant camera permission. `public/_headers` provides security policies for hosts that support the Netlify headers format.

## Privacy

The try-on photo is held only in the `/try` page's memory. Capture is drawn locally; upload creates a local object URL. The image is not placed in Zustand, localStorage, analytics or a server request. Navigating away releases the photo, and **Delete photo** removes it immediately. The WhatsApp action opens a `wa.me` message containing product/order details; it never attaches a photo. Verify this in your browser's Network panel before deployment.

Cart lines and favorites persist in localStorage. The try-on aligns a 2D frame overlay to eye landmarks on a captured or uploaded still photo and shows approximate face-shape and frame-fit suggestions. It does not yet track frames continuously during live camera preview, infer head pose/depth occlusion, or export a snapshot. Fit estimates depend on placeholder measurements; see `docs/DECISIONS.md`.

## Commands

- `pnpm assets:generate` — create synthetic product imagery and catalog data
- `pnpm lint` — ESLint
- `pnpm typecheck` — strict TypeScript check
- `pnpm test` — Vitest unit tests
- `pnpm build` — static production export
- `pnpm exec playwright test` — browser flow tests

## Limitations

Catalog art is synthetic and placeholder pricing should be reviewed. Camera, static preview and cart-to-WhatsApp flow are implemented; image-to-face alignment, live tracking, fit scoring, share snapshot, and full on-device QA are not yet implemented.
