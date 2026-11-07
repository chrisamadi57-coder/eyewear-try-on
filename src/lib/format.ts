import { brand } from "@/config/brand.config";
export const money = (value: number) =>
  new Intl.NumberFormat(brand.locale, {
    style: "currency",
    currency: brand.currency,
    maximumFractionDigits: 0,
  }).format(value);
