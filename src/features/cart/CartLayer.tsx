"use client";
import { useMemo, useState } from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useCart } from "./cart.store";
import { products } from "@/data/catalog";
import { money } from "@/lib/format";
import {
  buildMessage,
  buildWhatsAppUrl,
} from "@/engines/whatsapp/buildMessage";
import { createOrderRef } from "@/engines/whatsapp/orderRef";
export function CartLayer() {
  const open = useCart((state) => state.isOpen);
  const closeCart = useCart((state) => state.closeCart);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [toast, setToast] = useState("");
  const [orderRef] = useState(createOrderRef);
  const { items, remove, setQty, clear } = useCart();
  const lines = useMemo(
    () =>
      items.flatMap((item) => {
        const product = products.find((p) => p.id === item.productId);
        return product
          ? [
              {
                ...item,
                product,
                variant:
                  product.variants.find((v) => v.id === item.variantId) ??
                  product.variants[0],
              },
            ]
          : [];
      }),
    [items],
  );
  const total = lines.reduce((n, l) => n + l.product.price * l.qty, 0);
  const href = buildWhatsAppUrl(
    buildMessage(
      lines.map((l) => ({
        product: l.product,
        variantId: l.variant.id,
        quantity: l.qty,
      })),
      name,
      note,
      orderRef,
    ),
  );
  return (
    <>
      {open && (
        <>
          <button
            className="sheet-backdrop"
            aria-label="Close cart"
            onClick={closeCart}
            style={{ border: 0 }}
          />
          <section
            className="cart-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Your bag"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span className="eyebrow">Your selection</span>
                <h2 style={{ margin: "6px 0" }}>
                  Your bag{" "}
                  <small style={{ color: "var(--secondary)", fontWeight: 400 }}>
                    ({lines.reduce((n, l) => n + l.qty, 0)})
                  </small>
                </h2>
              </div>
              <button
                onClick={closeCart}
                aria-label="Close"
                className="button secondary"
                style={{ width: 42, minHeight: 42, padding: 0 }}
              >
                <X size={18} />
              </button>
            </div>
            {lines.length === 0 ? (
              <div style={{ textAlign: "center", padding: "38px 10px" }}>
                <p>Your bag is waiting for a favorite.</p>
                <button className="button" onClick={closeCart}>
                  Keep exploring
                </button>
              </div>
            ) : (
              <>
                {lines.map((l) => (
                  <div
                    className="cart-line"
                    key={`${l.product.id}-${l.variant.id}`}
                  >
                    <Image
                      src={l.variant.thumbImage}
                      alt=""
                      width={72}
                      height={72}
                      unoptimized
                    />
                    <div>
                      <strong>{l.product.name}</strong>
                      <div
                        style={{
                          fontSize: 13,
                          color: "var(--secondary)",
                          marginTop: 4,
                        }}
                      >
                        {l.variant.colorName} · {money(l.product.price)}
                      </div>
                    </div>
                    <div className="qty">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() =>
                          setQty(l.product.id, l.variant.id, l.qty - 1)
                        }
                      >
                        <Minus size={15} />
                      </button>
                      <span>{l.qty}</span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() =>
                          setQty(l.product.id, l.variant.id, l.qty + 1)
                        }
                      >
                        <Plus size={15} />
                      </button>
                      <button
                        aria-label="Remove item"
                        onClick={() => remove(l.product.id, l.variant.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
                <label
                  style={{ display: "block", marginTop: 20, fontSize: 13 }}
                >
                  Your name
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Optional"
                    style={inputStyle}
                  />
                </label>
                <label
                  style={{ display: "block", marginTop: 12, fontSize: 13 }}
                >
                  Note
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Anything you'd like us to know?"
                    rows={2}
                    style={inputStyle}
                  />
                </label>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "20px 0",
                    fontWeight: 700,
                  }}
                >
                  Subtotal <span>{money(total)}</span>
                </div>
                <a
                  className="button"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setToast("Opening WhatsApp…");
                    setTimeout(() => setToast(""), 2600);
                  }}
                  style={{ width: "100%", background: "#168c55" }}
                >
                  Send to WhatsApp <span aria-hidden="true">↗</span>
                </a>
                <button
                  onClick={clear}
                  className="button secondary"
                  style={{ width: "100%", marginTop: 10 }}
                >
                  Clear bag
                </button>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--secondary)",
                    textAlign: "center",
                  }}
                >
                  Your photo is never attached to this message. WhatsApp links
                  cannot carry images.
                </p>
              </>
            )}
          </section>
        </>
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </>
  );
}
const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: 6,
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid var(--separator)",
  background: "var(--surface)",
  color: "var(--label)",
  resize: "vertical",
};
