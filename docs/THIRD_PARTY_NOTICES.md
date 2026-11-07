# Third-party notices

The application code is provided without an added license grant. Third-party components and their respective licenses remain governed by their upstream terms.

## MediaPipe Tasks Vision and Face Landmarker

- `@mediapipe/tasks-vision` version `0.10.35`: Apache License 2.0, as identified in its package metadata.
- `face_landmarker.task` float16 version 1: downloaded from Google's official MediaPipe model storage. SHA-256: `64184e229b263107bc2b804c6625db1341ff2bb731874b0bcc2fe6544e0bc9ff`.
- The MediaPipe FaceMesh model card states Apache License 2.0. It is available from [Google AI Edge](https://storage.googleapis.com/mediapipe-assets/Model%20Card%20MediaPipe%20Face%20Mesh%20V2.pdf); MediaPipe source is [Apache-2.0 licensed](https://github.com/google-ai-edge/mediapipe/blob/master/LICENSE).
- Google's current Face Landmarker guide documents the bundle's face detector, face landmark and blendshape models and links their model cards. This project assumes those component cards apply to the bundled task file. A [November 2026 forum question](https://discuss.ai.google.dev/t/mediapipe-face-landmarker-license-coverage-and-third-party-hosting-clarification/197824) asks Google to clarify whether every bundled metadata component is covered; it did not include a maintainer answer when reviewed. Check that thread and retain this model provenance before shipping a commercial release.
- `public/mediapipe/wasm/` contains the unmodified runtime WebAssembly and glue files distributed by the npm package.

Before redistributing the model bundle, retain its provenance and re-check current upstream notices. The `.task` file bundles multiple model and geometry components, so confirm any future licensing clarification from MediaPipe maintainers before changing or replacing this model.

The remaining application dependencies are declared in `package.json`; each is distributed under its own upstream license. Review the resolved lockfile dependency graph before each release.
