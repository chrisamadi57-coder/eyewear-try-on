"use client";
import { useMemo, useState } from "react";
import { products } from "@/data/catalog";
import { ProductCard } from "@/ui/ProductCard";
export default function Shop() {
  const [category, setCategory] = useState("all");
  const [shape, setShape] = useState("all");
  const shown = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === "all" || p.category === category) &&
          (shape === "all" || p.shape === shape),
      ),
    [category, shape],
  );
  return (
    <main className="container section">
      <div className="eyebrow">The collection</div>
      <h1 style={{ fontSize: 42, letterSpacing: "-.05em", margin: "8px 0" }}>
        Frames, made personal.
      </h1>
      <p style={{ color: "var(--secondary)" }}>
        Explore the collection and find the one that feels right.
      </p>
      <div className="filters" aria-label="Category filters">
        {[
          ["all", "All frames"],
          ["sunglasses", "Sun"],
          ["optical", "Optical"],
        ].map(([v, label]) => (
          <button
            key={v}
            className={`filter ${category === v ? "active" : ""}`}
            onClick={() => setCategory(v)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="filters" aria-label="Shape filters">
        {["all", ...Array.from(new Set(products.map((p) => p.shape)))].map(
          (v) => (
            <button
              key={v}
              className={`filter ${shape === v ? "active" : ""}`}
              onClick={() => setShape(v)}
            >
              {v === "all" ? "All shapes" : v}
            </button>
          ),
        )}
      </div>
      <div className="product-grid">
          {shown.map((product, index) => (
            <ProductCard key={product.id} product={product} eager={index < 2} />
        ))}
      </div>
    </main>
  );
}
