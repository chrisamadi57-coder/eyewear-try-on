import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { classifyFaceShape, type FaceShape } from "./faceShape";
import { estimateFaceWidthMm, estimateMmPerPixel } from "./scale";

export function analyzeLandmarks(
  points: NormalizedLandmark[],
  imageWidth: number,
  imageHeight: number,
): { shape: FaceShape; faceWidthMm: number } | null {
  if (points.length < 477 || imageWidth <= 0 || imageHeight <= 0) return null;
  const distance = (a: number, b: number) =>
    Math.hypot(
      (points[a].x - points[b].x) * imageWidth,
      (points[a].y - points[b].y) * imageHeight,
    );
  const cheekWidth = distance(234, 454);
  if (cheekWidth <= 0) return null;
  const leftIris = distance(469, 471);
  const rightIris = distance(474, 476);
  const mmPerPixel = estimateMmPerPixel(leftIris, rightIris);
  return {
    shape: classifyFaceShape(
      distance(10, 152) / cheekWidth,
      distance(172, 397) / cheekWidth,
      distance(127, 356) / cheekWidth,
    ),
    faceWidthMm: estimateFaceWidthMm(cheekWidth, mmPerPixel),
  };
}
