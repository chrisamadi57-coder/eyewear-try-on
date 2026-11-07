import { describe, expect, it } from "vitest";
import {
  buildMessage,
  buildWhatsAppUrl,
} from "../src/engines/whatsapp/buildMessage";
import { products } from "../src/data/catalog";
import { createOrderRef } from "../src/engines/whatsapp/orderRef";
describe("WhatsApp order message", () => {
  it("includes selected products, color, and quantity", () => {
    const p = products[0];
    const message = buildMessage(
      [{ product: p, variantId: p.variants[0].id, quantity: 2 }],
      "Ada",
      "Please advise on sizing",
      "EW-ABC123",
    );
    expect(message).toContain(p.name);
    expect(message).toContain(p.variants[0].colorName);
    expect(message).toContain("× 2");
    expect(message).toContain("Ada");
    expect(message).toContain("EW-ABC123");
  });
  it("builds a wa.me link with encoded content", () => {
    expect(buildWhatsAppUrl("Hello 👋")).toContain(
      "https://wa.me/2348165469043?text=Hello%20%F0%9F%91%8B",
    );
  });
  it("keeps long orders inside the URL message budget", () => {
    const p = products[0];
    const lines = Array.from({ length: 80 }, () => ({
      product: p,
      variantId: p.variants[0].id,
      quantity: 10,
    }));
    expect(encodeURIComponent(buildMessage(lines)).length).toBeLessThanOrEqual(
      1750,
    );
  });
  it("creates six-character order references", () => {
    expect(createOrderRef(() => 0.1)).toMatch(/^EW-[A-Z2-9]{6}$/);
  });
  it("truncates unusually long names and notes safely", () => {
    const p = products[0];
    const message = buildMessage(
      [{ product: p, variantId: p.variants[0].id, quantity: 1 }],
      "A".repeat(1500),
      "👓".repeat(2000),
    );
    expect(encodeURIComponent(message).length).toBeLessThanOrEqual(1700);
    expect(message.endsWith("…")).toBe(true);
  });
});
