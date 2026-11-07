"use client";

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  ImagePlus,
  RotateCcw,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { default as NextImage } from "next/image";
import { products } from "@/data/catalog";
import { useCart } from "@/features/cart/cart.store";
import { money } from "@/lib/format";
import {
  alignmentFromLandmarks,
  getFaceLandmarker,
  largestFace,
  type FaceAlignment,
} from "@/engines/vision/faceLandmarker";
import { analyzeLandmarks } from "@/engines/fit/analyzeLandmarks";
import { scoreFit } from "@/engines/fit/score";
import type { Product } from "@/data/schema";

export default function TryPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [consented, setConsented] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const [alignment, setAlignment] = useState<FaceAlignment | null>(null);
  const [fitSummary, setFitSummary] = useState<{
    shape: string;
    picks: { product: Product; score: number; label: string }[];
  } | null>(null);
  const [photoSize, setPhotoSize] = useState<[number, number]>([4, 3]);
  const [selected, setSelected] = useState(products[0]);
  const [variant, setVariant] = useState(products[0].variants[0]);
  const [status, setStatus] = useState("Choose a photo or start your camera.");
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.openCart);

  const stop = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  useEffect(() => () => stop(), []);
  useEffect(
    () => () => {
      if (photo?.startsWith("blob:")) URL.revokeObjectURL(photo);
    },
    [photo],
  );
  useEffect(() => {
    const video = videoRef.current;
    if (video && streamRef.current) {
      video.srcObject = streamRef.current;
      void video.play().catch(() => {});
    }
  }, [live]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const product = products.find(
        (item) => item.slug === params.get("product"),
      );
      if (product) {
        setSelected(product);
        const color = product.variants.find(
          (item) => item.id === params.get("v"),
        );
        if (color) setVariant(color);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!photo) return;
    let cancelled = false;
    const image = new Image();
    image.onload = async () => {
      if (cancelled) return;
      setPhotoSize([image.naturalWidth, image.naturalHeight]);
      try {
        setStatus("Finding your eyes…");
        const landmarker = await getFaceLandmarker();
        if (cancelled) return;
        const points = largestFace(
          landmarker.detect(image).faceLandmarks ?? [],
        );
        const detected = points ? alignmentFromLandmarks(points) : null;
        const analysis = points
          ? analyzeLandmarks(points, image.naturalWidth, image.naturalHeight)
          : null;
        setAlignment(detected);
        setFitSummary(
          analysis
            ? {
                shape: analysis.shape,
                picks: products
                  .map((product) => ({
                    product,
                    ...scoreFit(
                      analysis.faceWidthMm,
                      product.dims.frameWidthMm,
                      product.suitsFaceShapes,
                      analysis.shape,
                    ),
                  }))
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 3),
              }
            : null,
        );
        setStatus(
          detected
            ? "Frame aligned to your eyes. Estimates based on your photo. Fit may vary slightly."
            : "No face found. Try a brighter, front-facing photo.",
        );
      } catch {
        setAlignment(null);
        setStatus(
          "Face analysis is unavailable. You can still browse and add frames.",
        );
      }
    };
    image.onerror = () =>
      setStatus("This image could not be opened. Try another photo.");
    image.src = photo;
    return () => {
      cancelled = true;
    };
  }, [photo]);

  async function start() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });
      streamRef.current = stream;
      setLive(true);
      setPhoto(null);
      setAlignment(null);
      setFitSummary(null);
      setStatus("Camera ready. Center your face, then take a photo.");
    } catch (reason) {
      setError(
        reason instanceof DOMException && reason.name === "NotAllowedError"
          ? "Camera access was denied. Enable it in browser settings or upload a photo instead."
          : "Camera is unavailable here. Upload a photo to continue.",
      );
    }
  }

  function takePhoto() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0);
    setPhoto(canvas.toDataURL("image/jpeg", 0.92));
    stop();
    setLive(false);
  }

  async function upload(file?: File) {
    if (!file) return;
    let url = URL.createObjectURL(file);
    try {
      const bitmap = await createImageBitmap(file, {
        imageOrientation: "from-image",
      });
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      canvas.getContext("2d")?.drawImage(bitmap, 0, 0);
      bitmap.close();
      URL.revokeObjectURL(url);
      url = canvas.toDataURL("image/jpeg", 0.94);
    } catch {
      // Keep the local object URL fallback for browsers without createImageBitmap support.
    }
    setPhoto(url);
    setAlignment(null);
    setFitSummary(null);
    stop();
    setLive(false);
    setStatus("Photo ready. Pick a frame to preview.");
  }

  function clearPhoto() {
    if (photo?.startsWith("blob:")) URL.revokeObjectURL(photo);
    setPhoto(null);
    setAlignment(null);
    setFitSummary(null);
    setStatus("Choose a photo or start your camera.");
  }

  const frameStyle = alignment
    ? {
        position: "absolute" as const,
        left: `${alignment.x * 100}%`,
        top: `${alignment.y * 100}%`,
        width: `${alignment.width * 100}%`,
        height: "auto",
        transform: `translate(-50%,-50%) rotate(${alignment.rotation}deg)`,
        filter: "drop-shadow(0 3px 6px #0005)",
        pointerEvents: "none" as const,
      }
    : { display: "none" };

  return (
    <main>
      <div className="studio-shell">
        <div
          style={{
            position: "absolute",
            zIndex: 3,
            top: 16,
            left: 16,
            right: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="button secondary"
              onClick={() => setShowPrivacy(true)}
              style={{ background: "rgba(255,255,255,.2)", color: "white" }}
            >
              <ShieldCheck size={16} />
              Private
            </button>
            {photo && (
              <button
                className="button secondary"
                onClick={clearPhoto}
                style={{ background: "rgba(255,255,255,.2)", color: "white" }}
              >
                <Trash2 size={16} />
                Delete photo
              </button>
            )}
          </div>
          <button
            className="button secondary"
            onClick={() => {
              stop();
              setLive(false);
              clearPhoto();
            }}
            style={{ background: "rgba(255,255,255,.2)", color: "white" }}
          >
            <X size={16} />
            Exit
          </button>
        </div>

        {live ? (
          <>
            <video ref={videoRef} className="studio-video" playsInline muted />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                width: "min(78vw,410px)",
                height: "min(88vw,480px)",
                border: "2px solid rgba(255,255,255,.68)",
                borderRadius: "50%",
                left: "50%",
                top: "42%",
                transform: "translate(-50%,-50%)",
              }}
            />
          </>
        ) : photo ? (
          <div
            style={{
              position: "relative",
              width: "min(100%,1100px)",
              margin: "0 auto",
              aspectRatio: `${photoSize[0]} / ${photoSize[1]}`,
            }}
          >
            <NextImage
              src={photo}
              alt="Your try-on photo, stored only on this device"
              width={photoSize[0]}
              height={photoSize[1]}
              sizes="100vw"
              unoptimized
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
            {alignment ? (
              <NextImage
                src={variant.frameImage}
                alt="Selected glasses preview, aligned to your eyes"
                width={1400}
                height={700}
                unoptimized
                style={frameStyle}
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  textShadow: "0 1px 3px #000",
                  textAlign: "center",
                  padding: 20,
                }}
              >
                <span>{status}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="studio-empty">
            <div>
              <div style={{ fontSize: 54, marginBottom: 10 }}>◉</div>
              <h1 style={{ fontSize: 28 }}>See how they feel.</h1>
              <p style={{ color: "#bbb", maxWidth: 350 }}>
                Your photo stays on this device and is cleared when you leave or
                delete it.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginTop: 20,
                }}
              >
                <button
                  className="button"
                  onClick={() =>
                    consented ? void start() : setShowPrivacy(true)
                  }
                >
                  <Camera size={18} />
                  Use camera
                </button>
                <label className="button secondary">
                  <ImagePlus size={18} />
                  Upload photo
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => upload(e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            top: 75,
            left: "50%",
            transform: "translateX(-50%)",
            color: "#fff",
            fontSize: 13,
            textAlign: "center",
            width: "90%",
          }}
          role="status"
          aria-live="polite"
        >
          {error || status}
        </div>
        {photo && fitSummary && (
          <section
            className="glass"
            aria-label="Fit recommendations"
            style={{
              position: "absolute",
              zIndex: 2,
              top: 112,
              left: "50%",
              transform: "translateX(-50%)",
              width: "min(360px, calc(100% - 32px))",
              padding: 16,
              borderRadius: 22,
              color: "#1d1d1f",
              fontSize: 12,
            }}
          >
            <strong style={{ fontSize: 14 }}>Best match</strong>
            <span style={{ marginLeft: 8, color: "#6e6e73" }}>
              {fitSummary.shape} face estimate
            </span>
            {fitSummary.picks.map(({ product, label }, index) => (
              <div
                key={product.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 7,
                }}
              >
                <span>
                  {index + 1}. {product.name}
                </span>
                <strong>{label}</strong>
              </div>
            ))}
            <p style={{ margin: "10px 0 0", color: "#6e6e73", fontSize: 11 }}>
              Estimates based on your photo. Fit may vary slightly.
            </p>
          </section>
        )}
        {photo && (
          <div
            style={{
              position: "absolute",
              bottom: 115,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: 8,
              overflowX: "auto",
              padding: 12,
            }}
          >
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelected(p);
                  setVariant(p.variants[0]);
                }}
                className="button secondary"
                style={{
                  minWidth: 130,
                  background:
                    selected.id === p.id ? "#fff" : "rgba(255,255,255,.2)",
                  color: selected.id === p.id ? "#222" : "#fff",
                  fontSize: 12,
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
        {photo && (
          <div
            style={{
              position: "absolute",
              bottom: 66,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {selected.variants.map((v) => (
              <button
                key={v.id}
                className="swatch"
                aria-label={v.colorName}
                onClick={() => setVariant(v)}
                style={{
                  background: v.swatchHex,
                  outline: v.id === variant.id ? "2px solid white" : "none",
                }}
              />
            ))}
          </div>
        )}
        <div className="studio-controls">
          {live ? (
            <button
              className="capture-ring"
              aria-label="Take photo"
              onClick={takePhoto}
            />
          ) : photo ? (
            <>
              <button className="button secondary" onClick={clearPhoto}>
                <RotateCcw size={17} />
                Retake
              </button>
              <button
                className="button"
                onClick={() => {
                  add(selected.id, variant.id);
                  openCart();
                }}
              >
                Add to bag · {money(selected.price)}
              </button>
            </>
          ) : (
            <label className="button secondary">
              <ImagePlus size={17} />
              Upload instead
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => upload(e.target.files?.[0])}
              />
            </label>
          )}
        </div>
      </div>

      {showPrivacy && (
        <div className="privacy-modal">
          <section className="privacy-card">
            <div className="eyebrow">Private by design</div>
            <h2 style={{ margin: "10px 0" }}>Your face stays yours.</h2>
            <p style={{ lineHeight: 1.55, color: "var(--secondary)" }}>
              Camera access is used only to preview frames in this browser. Your
              photo is never uploaded or saved. You can delete it at any time.
            </p>
            <button
              className="button"
              style={{ width: "100%", marginTop: 10 }}
              onClick={() => {
                setConsented(true);
                setShowPrivacy(false);
                void start();
              }}
            >
              Continue to camera
            </button>
            <button
              className="button secondary"
              style={{ width: "100%", marginTop: 8 }}
              onClick={() => setShowPrivacy(false)}
            >
              Not now
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
