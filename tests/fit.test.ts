import { describe, it, expect } from "vitest";
import { classifyFaceShape } from "../src/engines/fit/faceShape";
import { scoreFit } from "../src/engines/fit/score";
import {
  estimateFaceWidthMm,
  estimateMmPerPixel,
} from "../src/engines/fit/scale";
describe("face shape and fit", () => {
  it("classifies the configured ratio bands", () => {
    expect(classifyFaceShape(1.5, 0.9, 0.9)).toBe("oblong");
    expect(classifyFaceShape(1.2, 0.7, 1)).toBe("heart");
    expect(classifyFaceShape(1.2, 0.9, 0.8)).toBe("square");
    expect(classifyFaceShape(1.2, 0.8, 0.8)).toBe("round");
    expect(classifyFaceShape(1.4, 0.8, 0.8)).toBe("oval");
  });
  it("weights width more than shape harmony", () => {
    expect(scoreFit(140, 140, ["oval"], "oval").label).toBe("Great fit");
    expect(scoreFit(140, 160, ["round"], "oval").label).toBe("Loose");
  });
  it("estimates and clamps real-world scale", () => {
    const scale = estimateMmPerPixel(40, 40);
    expect(scale).toBeCloseTo(0.2925);
    expect(estimateFaceWidthMm(450, scale)).toBeCloseTo(131.625);
  });
});
