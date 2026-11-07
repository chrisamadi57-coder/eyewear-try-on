import type { FaceShape } from "./faceShape";
export type FitLabel = "Great fit" | "Good fit" | "Snug" | "Loose";
export function scoreFit(
  faceWidthMm: number,
  frameWidthMm: number,
  suits: readonly string[],
  shape: FaceShape,
) {
  const relative = (frameWidthMm - faceWidthMm) / Math.max(faceWidthMm, 1);
  const widthScore =
    relative < -0.06
      ? Math.max(0, 100 + relative * 250)
      : relative > 0.08
        ? Math.max(0, 100 - relative * 200)
        : 100;
  const shapeScore = suits.includes(shape) ? 100 : 60;
  const score = Math.round(widthScore * 0.6 + shapeScore * 0.4);
  const label: FitLabel =
    score >= 88
      ? "Great fit"
      : score >= 72
        ? "Good fit"
        : relative < -0.06
          ? "Snug"
          : relative > 0.08
            ? "Loose"
            : "Good fit";
  return { score, label };
}
