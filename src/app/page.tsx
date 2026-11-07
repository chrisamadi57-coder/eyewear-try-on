import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { products } from "@/data/catalog";
import { ProductCard } from "@/ui/ProductCard";
export default function Home() {
  const featured = products.filter((p) => p.featured).slice(0, 4);
  return (
    <main>
      <section className="container hero">
        <div className="hero-layout">
          <div>
            <span className="eyebrow">A clearer point of view</span>
            <h1>
              Meet the frame
              <br />
              that feels like you.
            </h1>
            <p>
              Find your next favorite. Try it on privately, see how it fits, and
              make it yours.
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 28,
              }}
            >
              <Link className="button" href="/try">
                Try on now <ArrowRight size={18} />
              </Link>
              <Link className="button secondary" href="/shop">
                Explore frames
              </Link>
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginTop: 24,
                color: "var(--secondary)",
                fontSize: 13,
              }}
            >
              <ShieldCheck size={17} />
              Your photo stays on your device
            </div>
          </div>
          <div className="hero-art">
            <Image
              src={
                featured[0]?.variants[0]?.productImage ??
                "/eyewear/products/aviator-classic-gold-green.webp"
              }
              alt="Featured gold aviator glasses"
              width={1400}
              height={1400}
              loading="eager"
              unoptimized
            />
          </div>
        </div>
      </section>
      <section className="container section" style={{ paddingTop: 32 }}>
        <div className="eyebrow">The edit</div>
        <h2
          style={{
            fontSize: 30,
            letterSpacing: "-.04em",
            margin: "10px 0 24px",
          }}
        >
          A few worth a closer look
        </h2>
        <div className="product-grid">
            {featured.map((p, index) => (
              <ProductCard key={p.id} product={p} eager={index === 0} />
          ))}
        </div>
        <p style={{ textAlign: "center", marginTop: 28 }}>
          <Link className="button secondary" href="/shop">
            Shop all frames <ArrowRight size={17} />
          </Link>
        </p>
      </section>
      <section className="container section" style={{ paddingTop: 12 }}>
        <div
          className="card"
          style={{
            padding: "28px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div className="eyebrow">Your fit, your call</div>
            <h2 style={{ margin: "8px 0" }}>See yourself in a new light.</h2>
            <p style={{ margin: 0, color: "var(--secondary)" }}>
              A quick, private try-on. No account. No upload.
            </p>
          </div>
          <Link className="button" href="/try">
            <Sparkles size={18} />
            Start try-on
          </Link>
        </div>
      </section>
    </main>
  );
}
