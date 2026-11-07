import type { Product } from "@/data/schema";
import { brand } from "@/config/brand.config";
export type OrderLine = {
  product: Product;
  variantId: string;
  quantity: number;
};
export function buildMessage(
  lines: OrderLine[],
  name = "",
  note = "",
  ref = "EW-000000",
): string {
  const make = (withLinks: boolean, selected: OrderLine[]) => {
    const body = selected.map(({ product, variantId, quantity }, index) => {
      const variant =
        product.variants.find((entry) => entry.id === variantId) ??
        product.variants[0];
      return `${index + 1}. ${product.name} – ${variant.colorName} × ${quantity} – ${new Intl.NumberFormat(brand.locale, { style: "currency", currency: brand.currency, maximumFractionDigits: 0 }).format(product.price * quantity)}${withLinks ? `\n   ${brand.siteUrl}/p/${product.slug}?v=${variant.id}` : ""}`;
    });
    const total = lines.reduce(
      (sum, line) => sum + line.product.price * line.quantity,
      0,
    );
    return `Hi ${brand.name}! 👋 I tried these on in your virtual try-on and I'd like to order:\n\n${body.join("\n")}\n\nTotal: ${new Intl.NumberFormat(brand.locale, { style: "currency", currency: brand.currency, maximumFractionDigits: 0 }).format(total)}${name ? `\nName: ${name}` : ""}${note ? `\nNote: ${note}` : ""}\nRef: ${ref}`;
  };
  let message = make(true, lines);
  if (encodeURIComponent(message).length > 1700) message = make(false, lines);
  if (encodeURIComponent(message).length > 1700) {
    for (let count = 1; count < lines.length; count++) {
      message = `${make(false, lines.slice(0, count))}\n(+${lines.length - count} more items)`;
      if (encodeURIComponent(message).length <= 1700) break;
    }
  }
  if (encodeURIComponent(message).length > 1700) {
    const points = Array.from(message);
    let low = 0;
    let high = points.length;
    while (low < high) {
      const mid = Math.ceil((low + high) / 2);
      if (
        encodeURIComponent(`${points.slice(0, mid).join("")}…`).length <= 1700
      )
        low = mid;
      else high = mid - 1;
    }
    message = `${points.slice(0, low).join("").trimEnd()}…`;
  }
  return message;
}
export const buildWhatsAppUrl = (message: string) =>
  `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`;
