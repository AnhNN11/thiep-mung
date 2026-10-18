"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Gift } from "@/lib/templates";
import { HoldButton, SceneControls, useGiftAudio } from "./source-shared";
const messages = [
  "I love you so much! ❤️",
  "Our Anniverasry",
  "I love you 💖",
  "25/08/2004",
  "Thank you for being my sunshine",
  "Thank you for being my everything 💕",
  "You are my universe",
  "There is no other",
  "You’re amazing",
  "You make my heart smile",
  "Love ya! 💖",
  "Honey bunch, you are my everything!",
];
const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export function GalaxyExperience({
  gift,
  embedded = false,
}: {
  gift: Gift;
  embedded?: boolean;
}) {
  const [phase, setPhase] = useState<"intro" | "rain" | "heart">("intro"),
    [tip, setTip] = useState(false);
  const sound = useGiftAudio(gift, 0.7);
  const phrases =
    gift.title === "I love you so much! ❤️"
      ? messages
      : [gift.title, ...gift.message.split(/\n+/).filter(Boolean)];
  const stage = useRef<HTMLDivElement>(null),
    rotation = useRef({ x: 0, y: 0, scale: 1 }),
    drag = useRef<{ x: number; y: number } | null>(null),
    lastTap = useRef(0);
  useEffect(() => {
    if (phase !== "rain") return;
    const a = setTimeout(() => setTip(true), 5000),
      b = setTimeout(() => setTip(false), 8000);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [phase]);
  const update = () => {
    const r = rotation.current;
    if (stage.current)
      stage.current.style.transform = `rotateX(${r.x}deg) rotateY(${r.y}deg) scale(${r.scale})`;
  };
  return (
    <section
      className={`sd-experience gx-experience ${embedded ? "sd-embedded" : ""}`}
      onDoubleClick={() => {
        if (phase === "rain") setPhase("heart");
      }}
    >
      <div className="gx-stars">
        {Array.from({ length: 350 }, (_, i) => (
          <i
            key={i}
            style={
              {
                left: `${rand(i) * 100}%`,
                top: `${rand(i + 399) * 100}%`,
                animationDelay: `${rand(i + 700) * 3}s`,
                opacity: rand(i + 22),
              } as CSSProperties
            }
          />
        ))}
      </div>
      {phase === "intro" ? (
        <div className="gx-intro">
          <div className="gx-watermark">Chế độ xem trước</div>
          <div className="gx-fingerprint">
            <HoldButton
              label="Ấn giữ trái tim để bắt đầu"
              onStart={sound.play}
              onComplete={() => setPhase("rain")}
            >
              <img src="/dlove/galaxy/fingerprint.png" alt="" />
            </HoldButton>
            <p>Ấn giữ trái tim để bắt đầu</p>
          </div>
        </div>
      ) : phase === "rain" ? (
        <div
          className="gx-space"
          onPointerDown={(e) => {
            drag.current = { x: e.clientX, y: e.clientY };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            rotation.current.y += (e.clientX - drag.current.x) * 0.1;
            rotation.current.x -= (e.clientY - drag.current.y) * 0.1;
            drag.current = { x: e.clientX, y: e.clientY };
            update();
          }}
          onPointerUp={(e) => {
            drag.current = null;
            if (e.pointerType === "touch") {
              const now = performance.now();
              if (now - lastTap.current < 450) setPhase("heart");
              lastTap.current = now;
            }
          }}
          onWheel={(e) => {
            rotation.current.scale = Math.max(
              0.3,
              Math.min(3, rotation.current.scale - e.deltaY * 0.001),
            );
            update();
          }}
        >
          <div ref={stage} className="gx-stage">
            {Array.from({ length: 90 }, (_, i) => {
              const photo = i % 10 === 3;
              return (
                <div
                  key={i}
                  className={`gx-fall ${photo ? "gx-photo" : ""}`}
                  style={
                    {
                      "--x": `${-25 + rand(i + 66) * 140}vw`,
                      "--z": `${(rand(i + 90) - 0.5) * 500}px`,
                      "--duration": `${(6 + rand(i + 50) * 4) * 1.3}s`,
                      "--delay": `${-rand(i + 77) * 13}s`,
                      fontSize: `${20 + rand(i + 201) * 14}px`,
                    } as CSSProperties
                  }
                >
                  {photo ? (
                    <img
                      src={
                        gift.photos[i % gift.photos.length] ||
                        "/dlove/galaxy/demo-photo.jpg"
                      }
                      alt="Ảnh kỷ niệm"
                    />
                  ) : i % 7 === 0 ? (
                    "💕"
                  ) : (
                    phrases[i % phrases.length]
                  )}
                </div>
              );
            })}
          </div>
          {tip && <p className="gx-tip">click 2 lần vào màn hình nha💖</p>}
        </div>
      ) : (
        <HeartParticles name={gift.recipient} />
      )}
      <SceneControls sound={sound} onReplay={() => setPhase("intro")} />
    </section>
  );
}
function HeartParticles({ name }: { name: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current!;
    const ctx = c.getContext("2d")!;
    let frame = 0;
    let w = 0,
      h = 0;
    const resize = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * devicePixelRatio;
      c.height = h * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(c);
    resize();
    const particles = Array.from({ length: 2500 }, (_, i) => ({
      a: rand(i) * Math.PI * 2,
      age: rand(i + 400) * 4,
      speed: 50 + rand(i + 70) * 30,
    }));
    let prev = performance.now();
    function draw(now: number) {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      ctx.clearRect(0, 0, w, h);
      const s = Math.min(1, (w - 30) / 400);
      for (const p of particles) {
        p.age += dt;
        if (p.age > 4) p.age = 0;
        const x = 160 * Math.sin(p.a) ** 3,
          y =
            130 * Math.cos(p.a) -
            50 * Math.cos(2 * p.a) -
            20 * Math.cos(3 * p.a) -
            10 * Math.cos(4 * p.a) +
            25;
        const l = Math.hypot(x, y);
        const travel = p.speed * (p.age - 0.65 * p.age * p.age);
        ctx.globalAlpha = Math.max(0, 1 - p.age / 4);
        ctx.fillStyle = "#f50b02";
        ctx.font = `${5 + p.age * 1.5}px serif`;
        ctx.fillText(
          "♥",
          w / 2 + (x + (x / l) * travel) * s,
          h / 2 - (y + (y / l) * travel) * s,
        );
      }
      frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);
  return (
    <div className="gx-heart">
      <canvas ref={canvas} />
      <h2>{name}</h2>
    </div>
  );
}
