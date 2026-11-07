"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { products } from "@/data/catalog";
import { ProductCard } from "@/ui/ProductCard";
import { useFavorites } from "@/features/catalog/favorites.store";
export default function Favorites() {
  const ids = useFavorites((s) => s.ids);
  const saved = products.filter((p) => ids.includes(p.id));
  return (
    <main className="container section">
      <span className="eyebrow">Saved for later</span>
      <h1 style={{ fontSize: 42, letterSpacing: "-.05em" }}>Your favorites.</h1>
      {saved.length ? (
        <div className="product-grid">
          {saved.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: 60 }}>
          <Heart size={42} />
          <h2>Nothing saved yet</h2>
          <p>Tap the heart on any frame to keep it close.</p>
          <Link className="button" href="/shop">
            Explore the collection
          </Link>
        </div>
      )}
    </main>
  );
}
