import { productSchema, type Product } from "./schema";
import raw from "./catalog.generated.json";
export const products: Product[] = productSchema.array().parse(raw);
export const getProduct = (slug: string) =>
  products.find((item) => item.slug === slug);
