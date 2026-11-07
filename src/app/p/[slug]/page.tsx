import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, getProduct } from "@/data/catalog";
import { ProductDetail } from "@/features/catalog/ProductDetail";
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  return p
    ? {
        title: `${p.name} — Atelier Eyewear`,
        description: p.description,
        openGraph: { images: [p.variants[0].productImage] },
      }
    : { title: "Frame not found" };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return (
    <main className="container section">
      <ProductDetail product={product} />
    </main>
  );
}
