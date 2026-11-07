import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navigation } from "@/ui/Navigation";
import { CartLayer } from "@/features/cart/CartLayer";
import { brand } from "@/config/brand.config";
import { ServiceWorker } from "@/ui/ServiceWorker";
export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: `${brand.name} — Find your frame`,
  description:
    "Thoughtfully chosen eyewear. Try frames on privately, right in your browser.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: brand.name },
};
export const viewport: Viewport = {
  themeColor: "#f5f5f7",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ServiceWorker />
        <Navigation />
        {children}
        <CartLayer />
        <footer className="footer">
          <div
            className="container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <span>
              © {new Date().getFullYear()} {brand.name}
            </span>
            <span>Private by design · Your photo stays on this device</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
