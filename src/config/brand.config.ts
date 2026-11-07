import { publicEnv } from "./env";
export const brand = {
  name: publicEnv.NEXT_PUBLIC_BUSINESS_NAME,
  whatsapp: publicEnv.NEXT_PUBLIC_WHATSAPP_NUMBER,
  siteUrl: publicEnv.NEXT_PUBLIC_SITE_URL,
  currency: publicEnv.NEXT_PUBLIC_CURRENCY,
  locale: publicEnv.NEXT_PUBLIC_LOCALE,
  accent: "#0071E3",
} as const;
