import { FIT_THRESHOLDS as t } from "./constants";
export type FaceShape = "oval" | "round" | "square" | "heart" | "oblong";
export function classifyFaceShape(
  lengthToWidth: number,
  jawToCheek: number,
  foreheadToCheek: number,
): FaceShape {
  if (lengthToWidth >= t.oblongLengthToWidth) return "oblong";
  if (
    foreheadToCheek >= t.heartForeheadToCheek &&
    jawToCheek <= t.heartJawToCheek
  )
    return "heart";
  if (
    lengthToWidth < t.compactLengthToWidth &&
    jawToCheek >= t.squareJawToCheek
  )
    return "square";
  if (lengthToWidth < t.compactLengthToWidth && jawToCheek < t.squareJawToCheek)
    return "round";
  return "oval";
}
