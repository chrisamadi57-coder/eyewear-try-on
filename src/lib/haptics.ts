export const haptic = (kind: "tap" | "success" = "tap") => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator)
    navigator.vibrate(kind === "success" ? [12, 24, 12] : 8);
};
