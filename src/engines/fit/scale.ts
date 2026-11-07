const IRIS_DIAMETER_MM = 11.7;
export function estimateMmPerPixel(
  leftIrisDiameterPx: number,
  rightIrisDiameterPx: number,
): number {
  const mean = (leftIrisDiameterPx + rightIrisDiameterPx) / 2;
  if (!Number.isFinite(mean) || mean <= 0) return 0.1;
  return Math.max(0.03, Math.min(0.3, IRIS_DIAMETER_MM / mean));
}
export function estimateFaceWidthMm(
  faceWidthPx: number,
  mmPerPixel: number,
): number {
  return Math.max(90, Math.min(190, faceWidthPx * mmPerPixel));
}
