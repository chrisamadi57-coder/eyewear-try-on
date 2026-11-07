import Link from "next/link";
export default function NotFound() {
  return (
    <main
      className="container section"
      style={{
        textAlign: "center",
        minHeight: "55vh",
        display: "grid",
        placeContent: "center",
      }}
    >
      <span className="eyebrow">404 · Nothing here</span>
      <h1 style={{ fontSize: 42 }}>That frame slipped away.</h1>
      <p style={{ color: "var(--secondary)" }}>
        Let’s find something that fits.
      </p>
      <Link href="/shop" className="button" style={{ justifySelf: "center" }}>
        Browse the collection
      </Link>
    </main>
  );
}
