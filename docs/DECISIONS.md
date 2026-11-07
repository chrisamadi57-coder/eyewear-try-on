# Decisions and assumptions

- The business is branded as **Atelier Eyewear** until the owner supplies a public-facing name. The WhatsApp number is set to `2348165469043` from the request.
- The default storefront locale is `en-NG` and currency is `NGN`; product prices are editable placeholders in Nigerian naira.
- The image generator makes original vector frame illustrations, then rasterizes them with Sharp into WebP. It is a premium visual catalog starter, not a substitute for manufacturer photography or certified physical fit dimensions.
- Product variants and asset paths live in generated `src/data/catalog.generated.json`; product source definitions live in `src/data/source-products.ts` and can be regenerated with `pnpm assets:generate`.
- No photo is included in app persistence or network requests. Camera capture uses a memory-only data URL; uploaded photos use a revocable object URL. The photo is removed when the try-on page unmounts or when Delete photo is selected.
- Uploaded and captured still photos use the self-hosted MediaPipe Face Landmarker model to align a 2D frame overlay, classify a face shape from landmark ratios, and rank approximate fit picks. Live camera preview does not yet run continuous tracking; depth occlusion, full head pose, and snapshot export remain future engine work. Fit scoring uses placeholder dimensions and should be validated against real product measurements.
- Favorites are a curated starter view, not a persisted customer favorites list. Cart contents are localStorage persisted; photo data is never persisted.
- Static export uses Next.js App Router with `output: 'export'`. Dynamic product routes are fully enumerated at build time. Hosting headers are supplied for Netlify/Cloudflare Pages.
- WhatsApp order links retain the cart. For oversized messages, product links are removed first and the item list is shortened to remain comfortably within common URL limits.
- Analytics is deliberately omitted and the wrapper is a no-op. No analytics variables are set by default.
- MediaPipe source and its three linked model cards indicate Apache-2.0. This build assumes those component licenses cover the official `.task` bundle; the exact bundle metadata coverage had an unanswered upstream clarification question at implementation time. See `docs/THIRD_PARTY_NOTICES.md` and verify that before a commercial release.
- Fonts use the operating system's native system font stack; no licensed Apple font is bundled.
- Visual QA is limited to generated contact-sheet review and Chromium desktop e2e here. Browser camera behavior, mobile Safari, live frame tracking, Lighthouse scores, and on-device FPS require device/browser checks before launch.
