"use client";
import { useEffect, useRef, useState } from "react";
import type { Gift } from "@/lib/templates";
import { ParticleWorld } from "./particle-world";
import {
  HoldButton,
  SceneControls,
  SourceLetter,
  useGiftAudio,
} from "./source-shared";
export function WishesExperience({
  gift,
  embedded = false,
}: {
  gift: Gift;
  embedded?: boolean;
}) {
  const [phase, setPhase] = useState<"intro" | "morph" | "sphere">("intro"),
    [letter, setLetter] = useState(false);
  const sound = useGiftAudio(gift);
  return (
    <section
      className={`sd-experience ws-experience ${embedded ? "sd-embedded" : ""}`}
    >
      {phase === "intro" ? (
        <div className="sd-center-intro">
          <div className="ws-sparks" />
          <HoldButton
            label="Ấn giữ để mở món quà"
            duration={1000}
            onStart={sound.play}
            onComplete={() => setPhase("morph")}
          >
            <img src="/dlove/galaxy/fingerprint.png" alt="" />
          </HoldButton>
          <p>Ấn giữ để mở món quà</p>
        </div>
      ) : phase === "morph" ? (
        <MorphSequence
          texts={gift.title.split("·").map((s) => s.trim())}
          image="/dlove/wishes/particle.jpg"
          onDone={() => setPhase("sphere")}
        />
      ) : (
        <>
          <ParticleWorld mode="sphere" photos={gift.photos} />
          <p className="sd-bottom-hint">
            Kéo để xoay quả cầu · Chạm lá thư để đọc lời nhắn
          </p>
        </>
      )}
      <SceneControls
        sound={sound}
        onReplay={() => setPhase("intro")}
        onLetter={phase === "sphere" ? () => setLetter(true) : undefined}
      />
      {letter && <SourceLetter gift={gift} onClose={() => setLetter(false)} />}
    </section>
  );
}
function MorphSequence({
  texts,
  image,
  onDone,
}: {
  texts: string[];
  image: string;
  onDone: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null),
    done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    const c = canvas.current!,
      ctx = c.getContext("2d")!,
      img = new Image();
    img.src = image;
    let frame = 0,
      disposed = false,
      w = 0,
      h = 0,
      current = -1;
    const particles = Array.from({ length: 9000 }, () => ({
      x: Math.random() * 1000,
      y: Math.random() * 900,
      tx: 0,
      ty: 0,
      r: 255,
      g: 130,
      b: 200,
    }));
    const started = performance.now();
    const resize = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * devicePixelRatio;
      c.height = h * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      current = -1;
    };
    const ob = new ResizeObserver(resize);
    ob.observe(c);
    resize();
    function target(index: number) {
      const scratch = document.createElement("canvas");
      scratch.width = w;
      scratch.height = h;
      const x = scratch.getContext("2d")!;
      if (index < texts.length) {
        const text = texts[index];
        x.font = `bold ${Math.min(h * 0.15, w / (Math.max(6, text.length) * 0.59))}px Arial`;
        x.fillStyle = "white";
        x.textBaseline = "middle";
        x.textAlign = "center";
        x.fillText(text, w / 2, h / 2);
      } else if (img.complete && img.naturalWidth) {
        const s = Math.min((w * 0.7) / img.width, (h * 0.65) / img.height);
        x.drawImage(
          img,
          (w - img.width * s) / 2,
          (h - img.height * s) / 2,
          img.width * s,
          img.height * s,
        );
      }
      const pix = x.getImageData(0, 0, w, h).data,
        positions: { x: number; y: number; r: number; g: number; b: number }[] =
          [];
      for (let y = 0; y < h; y += 3)
        for (let xx = 0; xx < w; xx += 3) {
          const p = (y * w + xx) * 4;
          if (pix[p + 3] > 100)
            positions.push({
              x: xx,
              y,
              r: pix[p],
              g: pix[p + 1],
              b: pix[p + 2],
            });
        }
      if (!positions.length) return;
      particles.forEach((p, i) => {
        const t = positions[i % positions.length];
        p.tx = t.x;
        p.ty = t.y;
        p.r = index < texts.length ? 255 : t.r;
        p.g = index < texts.length ? 150 : t.g;
        p.b = index < texts.length ? 210 : t.b;
      });
    }
    function draw(now: number) {
      if (disposed) return;
      const age = now - started,
        index = Math.min(texts.length, Math.floor(age / 3200));
      if (index !== current) {
        current = index;
        target(index);
      }
      const end = texts.length * 3200 + 6000;
      if (age > end) {
        done.current();
        return;
      }
      ctx.fillStyle = "rgba(0,0,0,.35)";
      ctx.fillRect(0, 0, w, h);
      const explode = age > end - 1000;
      for (const p of particles) {
        if (explode) {
          p.tx += (p.tx - w / 2) * 0.025;
          p.ty += (p.ty - h / 2) * 0.025;
        }
        p.x += (p.tx - p.x) * 0.065;
        p.y += (p.ty - p.y) * 0.065;
        ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
        ctx.globalAlpha = 0.75;
        ctx.fillRect(p.x, p.y, 1.3, 1.3);
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      ob.disconnect();
    };
  }, [texts.join("|"), image]);
  return (
    <canvas
      ref={canvas}
      className="bd-canvas"
      aria-label="Lời chúc biến hình từ hạt sáng"
    />
  );
}
