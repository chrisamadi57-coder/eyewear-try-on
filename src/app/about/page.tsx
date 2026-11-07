import { ShieldCheck } from "lucide-react";
import { brand } from "@/config/brand.config";
export default function About() {
  return (
    <main className="container section" style={{ maxWidth: 760 }}>
      <div className="eyebrow">A little about us</div>
      <h1 style={{ fontSize: 46, letterSpacing: "-.05em" }}>
        Good frames. A thoughtful fit.
      </h1>
      <p style={{ fontSize: 18, color: "var(--secondary)", lineHeight: 1.6 }}>
        We believe the right eyewear should feel like it was always yours.
        Browse at your own pace, try frames on privately, and message us when
        you find your pair.
      </p>
      <div className="card" style={{ padding: 24, marginTop: 28 }}>
        <ShieldCheck size={24} color="var(--accent)" />
        <h2>Your privacy matters</h2>
        <p style={{ lineHeight: 1.65, color: "var(--secondary)" }}>
          Try-on photos are processed only in your browser. They are not
          uploaded or stored. Delete your photo any time from the studio.
          WhatsApp receives only the order details you choose to send.
        </p>
      </div>
      <h2 style={{ marginTop: 36 }}>Say hello</h2>
      <p>Send us your questions and we’ll be happy to help.</p>
      <a
        className="button"
        href={`https://wa.me/${brand.whatsapp}`}
        target="_blank"
        rel="noreferrer"
      >
        Message {brand.name}
      </a>
    </main>
  );
}
