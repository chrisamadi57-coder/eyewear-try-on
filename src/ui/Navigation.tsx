"use client";
import Link from "next/link";
import { Heart, ShoppingBag, Sparkles } from "lucide-react";
import { useCart } from "@/features/cart/cart.store";
import { brand } from "@/config/brand.config";
export function Navigation() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const openCart = useCart((s) => s.openCart);
  return (
    <>
      <header className="nav glass">
        <div className="container nav-inner">
          <Link className="brand" href="/">
            {brand.name}
            <span style={{ color: "var(--accent)" }}>.</span>
          </Link>
          <nav className="nav-links">
            <Link href="/try">Try on</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/favorites">
              <Heart size={17} />
            </Link>
            <button
              onClick={openCart}
              aria-label={`Open cart, ${count} items`}
              style={{
                border: 0,
                background: "transparent",
                position: "relative",
              }}
            >
              <ShoppingBag size={19} />
              {count > 0 && (
                <small
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -10,
                    background: "var(--accent)",
                    color: "#fff",
                    borderRadius: 20,
                    padding: "1px 5px",
                  }}
                >
                  {count}
                </small>
              )}
            </button>
          </nav>
        </div>
      </header>
      <nav className="tabs glass" aria-label="Main navigation">
        <Link href="/try">
          <Sparkles size={18} />
          Try-On
        </Link>
        <Link href="/shop">
          <ShoppingBag size={18} />
          Shop
        </Link>
        <Link href="/favorites">
          <Heart size={18} />
          Favorites
        </Link>
        <button onClick={openCart}>
          <ShoppingBag size={18} />
          Cart {count > 0 && `(${count})`}
        </button>
      </nav>
    </>
  );
}
