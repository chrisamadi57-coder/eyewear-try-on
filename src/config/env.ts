import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_WHATSAPP_NUMBER: z
    .string()
    .regex(/^\d{8,15}$/)
    .default("2348165469043"),
  NEXT_PUBLIC_BUSINESS_NAME: z.string().min(1).default("Atelier Eyewear"),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url()
    .default("https://atelier-eyewear.example"),
  NEXT_PUBLIC_CURRENCY: z
    .string()
    .regex(/^[A-Z]{3}$/)
    .default("NGN"),
  NEXT_PUBLIC_LOCALE: z.string().min(2).default("en-NG"),
  NEXT_PUBLIC_ANALYTICS_PROVIDER: z.enum(["plausible", "umami"]).optional(),
  NEXT_PUBLIC_ANALYTICS_DOMAIN: z.string().optional(),
});

export const publicEnv = schema.parse({
  NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  NEXT_PUBLIC_BUSINESS_NAME: process.env.NEXT_PUBLIC_BUSINESS_NAME,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_CURRENCY: process.env.NEXT_PUBLIC_CURRENCY,
  NEXT_PUBLIC_LOCALE: process.env.NEXT_PUBLIC_LOCALE,
  NEXT_PUBLIC_ANALYTICS_PROVIDER: process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER,
  NEXT_PUBLIC_ANALYTICS_DOMAIN: process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN,
});
