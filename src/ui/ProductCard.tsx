import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/data/schema";
import { money } from "@/lib/format";
export function ProductCard({
  product,
  eager = false,
}: {
  product: Product;
  eager?: boolean;
}) {
  const variant = product.variants[0];
  return (
    <article className="card product-card">
      <Link href={`/p/${product.slug}`} aria-label={`View ${product.name}`}>
        <Image
          className="product-image"
          src={variant.productImage}
          alt={`${product.name}, ${variant.colorName}`}
          width={1400}
          height={1400}
          loading={eager ? "eager" : "lazy"}
          unoptimized
        />
      </Link>
      <div className="product-meta">
        <h3>{product.name}</h3>
        <span className="tag">
          {product.category === "sunglasses" ? "SUN" : "OPTICAL"}
        </span>
      </div>
      <p>{product.tagline}</p>
      <div className="product-meta">
        <strong>{money(product.price)}</strong>
        <Link
          className="button secondary"
          style={{ minHeight: 36, padding: "0 14px", fontSize: 12 }}
          href={`/p/${product.slug}`}
        >
          Explore
        </Link>
      </div>
    </article>
  );
}
