const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function createOrderRef(random: () => number = Math.random): string {
  return `EW-${Array.from({ length: 6 }, () => alphabet[Math.floor(random() * alphabet.length)]).join("")}`;
}
