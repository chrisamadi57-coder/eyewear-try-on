import { cp, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
async function main() {
  const root = process.cwd();
  const wasmSource = path.join(
    root,
    "node_modules/@mediapipe/tasks-vision/wasm",
  );
  const dest = path.join(root, "public/mediapipe");
  await mkdir(dest, { recursive: true });
  await cp(wasmSource, path.join(dest, "wasm"), { recursive: true });
  const modelUrl =
    "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
  const response = await fetch(modelUrl);
  if (!response.ok)
    throw new Error(`Model download failed: ${response.status}`);
  await writeFile(
    path.join(dest, "face_landmarker.task"),
    Buffer.from(await response.arrayBuffer()),
  );
  console.log("Copied MediaPipe WASM and downloaded the face landmark model.");
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
