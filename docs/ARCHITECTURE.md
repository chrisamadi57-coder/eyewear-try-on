# Architecture

This repository is one statically exported Next.js application. Route components compose feature components; domain utilities under `src/engines` are framework independent. Catalog records are Zod validated at import time. The generated WebP assets and manifest are bundled in `public/`.

The cart store uses Zustand persistence in localStorage. Try-on image state lives only in the `/try` client component and is released on unmount. The WhatsApp engine turns selected catalog records into a URL; no order API exists.

## Routes

- `/` landing and featured products
- `/try/` camera consent, upload, capture and frame preview
- `/shop/` collection and category/shape filters
- `/p/{slug}/` static product detail pages
- `/favorites/` curated favorites starter page
- `/about/` privacy and contact

## Hosting

Run `pnpm build` and publish `out/` to Cloudflare Pages or Netlify. Configure camera access only on HTTPS. The `public/_headers` file contains host-compatible security and caching headers.
