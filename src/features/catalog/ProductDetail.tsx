"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Sparkles } from "lucide-react";
import type { Product } from "@/data/schema";
import { money } from "@/lib/format";
import { useCart } from "@/features/cart/cart.store";
import { useFavorites } from "./favorites.store";
export function ProductDetail({ product }: { product: Product }) {
  const [v, setV] = useState(product.variants[0]);
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.openCart);
  const favorite = useFavorites((s) => s.ids.includes(product.id));
  const toggleFavorite = useFavorites((s) => s.toggle);
  return (
    <div className="detail-layout">
      <Image
        className="detail-image"
        src={v.productImage}
        alt={`${product.name} in ${v.colorName}`}
        width={1400}
        height={1400}
        unoptimized
      />
      <div>
        <span className="eyebrow">
          {product.category} · {product.shape}
        </span>
        <h1 style={{ fontSize: 46, letterSpacing: "-.05em", margin: "10px 0" }}>
          {product.name}
        </h1>
        <p style={{ fontSize: 18, color: "var(--secondary)" }}>
          {product.tagline}
        </p>
        <p style={{ lineHeight: 1.65 }}>{product.description}</p>
        <strong style={{ fontSize: 22 }}>{money(product.price)}</strong>
        <h3 style={{ marginBottom: 8 }}>Choose a finish</h3>
        <div className="swatches">
          {product.variants.map((item) => (
            <button
              key={item.id}
              className="swatch"
              title={item.colorName}
              aria-label={item.colorName}
              onClick={() => setV(item)}
              style={{
                background: item.swatchHex,
                outline: item.id === v.id ? "2px solid var(--accent)" : "none",
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: 14, color: "var(--secondary)" }}>
          {v.colorName}
        </span>
        <div className="spec-grid">
          <div className="spec">
            <b>{product.dims.lensWidthMm} mm</b>
            <span>Lens width</span>
          </div>
          <div className="spec">
            <b>{product.dims.bridgeMm} mm</b>
            <span>Bridge</span>
          </div>
          <div className="spec">
            <b>{product.dims.templeLengthMm} mm</b>
            <span>Temple</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            className="button"
            href={`/try?product=${product.slug}&v=${v.id}`}
          >
            <Sparkles size={17} />
            Try on
          </Link>
          <button
            className="button secondary"
            onClick={() => {
              add(product.id, v.id);
              openCart();
            }}
          >
            Add to bag
          </button>
          <button
            className="button secondary"
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={favorite}
            onClick={() => toggleFavorite(product.id)}
          >
            <Heart size={17} fill={favorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
}
