export const FIT_THRESHOLDS = {
  oblongLengthToWidth: 1.45,
  compactLengthToWidth: 1.35,
  heartForeheadToCheek: 0.95,
  heartJawToCheek: 0.78,
  squareJawToCheek: 0.86,
} as const;
// Ratios use normalized landmark distances, so camera scale and image resolution cancel out.
